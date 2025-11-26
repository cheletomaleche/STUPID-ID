import React, { useState, useRef } from 'react';
import { 
  AppTab, 
  AppState, 
  ProcessingState, 
  StylingOption,
  Gender
} from './types';
import { TAB_CONFIG } from './constants';
import ControlPanel from './components/ControlPanel';
import ComplianceModal from './components/ComplianceModal';
import ExportModal from './components/ExportModal';
import * as geminiService from './services/geminiService';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Loader2,
  Undo2,
  Home,
  Wand2,
  Sparkles,
  UserCircle,
  ImagePlus
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    currentImage: null,
    processingState: ProcessingState.IDLE,
    activeTab: AppTab.FACE,
    compliance: null,
    history: [],
    historyIndex: -1,
    gender: null,
  });

  const [isExportOpen, setIsExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to update state and manage history
  const updateImage = (newImage: string) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newImage);
      return {
        ...prev,
        currentImage: newImage,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        processingState: ProcessingState.IDLE
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setState({
          ...state,
          originalImage: base64,
          currentImage: base64,
          history: [base64],
          historyIndex: 0,
          processingState: ProcessingState.IDLE,
          compliance: null,
          gender: null // Reset gender on new upload
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = () => {
    if (state.historyIndex > 0) {
      setState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex - 1,
        currentImage: prev.history[prev.historyIndex - 1]
      }));
    }
  };

  const handleReset = () => {
    if (state.originalImage) {
        updateImage(state.originalImage);
    }
  };

  const handleStartOver = () => {
    const reset = () => {
      setState({
        originalImage: null,
        currentImage: null,
        processingState: ProcessingState.IDLE,
        activeTab: AppTab.FACE,
        compliance: null,
        history: [],
        historyIndex: -1,
        gender: null,
      });
      setIsExportOpen(false);
      
      // Clear file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // If we haven't selected gender yet, skip confirmation
    if (!state.gender) {
        reset();
        return;
    }

    // For "New Photo" button, we can just reset directly for a faster workflow
    // or keep confirmation if desired. Let's make it direct for "Stupid Easy" UX.
    reset(); 
  };

  const processEdit = async (prompt: string) => {
    if (!state.currentImage) return;

    setState(prev => ({ ...prev, processingState: ProcessingState.PROCESSING }));

    try {
      const newImage = await geminiService.editIdPhoto(state.currentImage, prompt);
      updateImage(newImage);
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, processingState: ProcessingState.ERROR }));
      alert("Failed to process image. Please try again with a different option.");
      setState(prev => ({ ...prev, processingState: ProcessingState.IDLE }));
    }
  };

  const handleApplyStyle = (option: StylingOption) => {
    processEdit(option.prompt);
  };

  const handleFaceEdit = (prompt: string) => {
    processEdit(prompt);
  };

  const checkCompliance = async () => {
    if (!state.currentImage) return;
    setState(prev => ({ ...prev, processingState: ProcessingState.CHECKING_COMPLIANCE }));
    try {
      const result = await geminiService.checkCompliance(state.currentImage);
      setState(prev => ({ 
        ...prev, 
        compliance: result,
        processingState: ProcessingState.IDLE
      }));
    } catch (error) {
      setState(prev => ({ ...prev, processingState: ProcessingState.ERROR }));
    }
  };

  const selectGender = (gender: Gender) => {
    setState(prev => ({ ...prev, gender }));
  };

  return (
    <div className="h-screen w-full bg-grey-900 text-slate-200 relative overflow-hidden flex flex-col">
      {/* Hidden File Input - Always Mounted */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />

      {/* 1. Welcome Screen */}
      {!state.currentImage && (
        <div className="flex-1 flex flex-col relative animate-in fade-in duration-500">
           <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
              <h1 className="text-2xl font-bold tracking-tight text-white">STUPID <span className="text-gold-400">ID</span></h1>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
              <div className="w-24 h-24 bg-grey-800 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(204,164,59,0.2)] border border-grey-700 mb-4 animate-pulse">
                  <Wand2 size={40} className="text-gold-400" />
              </div>
              
              <div className="space-y-2 max-w-xs mx-auto">
                  <h2 className="text-3xl font-bold text-white">Smart Photos, Stupid Easy</h2>
                  <p className="text-slate-400">Your AI image consultant. One photo, limitless professional styles.</p>
              </div>

              <div className="space-y-4 w-full max-w-xs">
                   <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-grey-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg"
                   >
                      <Upload size={20} />
                      Upload Photo
                   </button>
                   
                   <div className="flex gap-4 items-center justify-center opacity-50 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><ShieldCheck size={12}/> Secure Processing</span>
                      <span className="flex items-center gap-1"><Sparkles size={12}/> AI Powered</span>
                   </div>
              </div>
           </div>
        </div>
      )}

      {/* 2. Gender Selection Screen */}
      {state.currentImage && !state.gender && (
         <div className="flex-1 flex flex-col relative animate-in slide-in-from-right duration-300">
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <button onClick={handleStartOver} className="text-xl font-bold tracking-tight text-white hover:opacity-80 flex items-center gap-2">
                    <Home size={20} className="text-gold-400" /> STUPID <span className="text-gold-400">ID</span>
                </button>
                <button 
                  onClick={handleStartOver}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-grey-800 text-slate-300 hover:text-gold-400 hover:bg-grey-700 transition-all border border-transparent hover:border-gold-400/30"
                  title="Upload New Photo"
                >
                  <ImagePlus size={18} />
                  <span className="text-xs font-semibold">New Photo</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
                <h2 className="text-2xl font-bold text-white mb-4">Who is this photo for?</h2>
                <p className="text-slate-400 max-w-xs">We'll filter hairstyle and outfit recommendations based on your choice.</p>
                
                <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
                  <button 
                    onClick={() => selectGender(Gender.MALE)}
                    className="w-full py-6 bg-grey-800 hover:bg-grey-700 hover:border-gold-400 border border-grey-700 rounded-xl flex items-center justify-center gap-4 transition-all group"
                  >
                     <div className="w-12 h-12 rounded-full bg-grey-900 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-grey-900 transition-colors">
                        <UserCircle size={28} />
                     </div>
                     <div className="text-left">
                        <span className="block text-lg font-bold text-white">Male Styles</span>
                        <span className="text-xs text-slate-400">Suits, Short Hair, Beards</span>
                     </div>
                  </button>

                  <button 
                    onClick={() => selectGender(Gender.FEMALE)}
                    className="w-full py-6 bg-grey-800 hover:bg-grey-700 hover:border-gold-400 border border-grey-700 rounded-xl flex items-center justify-center gap-4 transition-all group"
                  >
                     <div className="w-12 h-12 rounded-full bg-grey-900 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-grey-900 transition-colors">
                        <UserCircle size={28} />
                     </div>
                     <div className="text-left">
                        <span className="block text-lg font-bold text-white">Female Styles</span>
                        <span className="text-xs text-slate-400">Blazers, Long Hair, Makeup</span>
                     </div>
                  </button>
                </div>
            </div>
         </div>
      )}

      {/* 3. Main Editor Interface */}
      {state.currentImage && state.gender && (
        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
          <header className="h-16 flex items-center justify-between px-4 border-b border-grey-700 bg-grey-900 z-20 flex-shrink-0">
            <button onClick={handleStartOver} className="text-lg font-bold text-white hover:opacity-80 transition-opacity">
                STUPID <span className="text-gold-400">ID</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleStartOver}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-grey-800 text-slate-300 hover:text-gold-400 hover:bg-grey-700 transition-all border border-transparent hover:border-gold-400/30 mr-2"
                title="Upload New Photo"
              >
                <ImagePlus size={18} />
                <span className="hidden sm:inline text-xs font-semibold">New</span>
              </button>

              <div className="h-6 w-px bg-grey-700 mx-1"></div>

              <button 
                disabled={state.historyIndex <= 0}
                onClick={handleUndo}
                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Undo"
              >
                <Undo2 size={20} />
              </button>
              
              <button 
                onClick={checkCompliance}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-grey-800 border border-grey-700 text-xs font-semibold text-slate-300 hover:border-gold-400 hover:text-gold-400 transition-all"
              >
                <ShieldCheck size={14} />
                Check
              </button>

              <button 
                onClick={() => setIsExportOpen(true)}
                className="p-2 text-gold-400 hover:text-gold-300 transition-colors"
                title="Download"
              >
                <Download size={22} />
              </button>
            </div>
          </header>

          {/* Main Preview Area */}
          <main className="flex-1 relative overflow-hidden bg-grey-950 flex items-center justify-center p-4 sm:p-8">
            <div className="relative shadow-2xl rounded-sm overflow-hidden border-4 border-white aspect-[3/4] h-full max-h-[500px] sm:max-h-[600px] w-auto">
                 <img 
                    src={state.currentImage} 
                    alt="ID Preview" 
                    className="w-full h-full object-cover"
                 />
                 
                 {(state.processingState === ProcessingState.PROCESSING || state.processingState === ProcessingState.CHECKING_COMPLIANCE) && (
                    <div className="absolute inset-0 bg-grey-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                        <Loader2 size={40} className="text-gold-400 animate-spin" />
                        <p className="text-gold-400 font-medium animate-pulse">
                            {state.processingState === ProcessingState.PROCESSING ? 'Styling AI is working...' : 'Analyzing Compliance...'}
                        </p>
                    </div>
                 )}
            </div>
            
            <button 
                onClick={handleReset}
                className="absolute top-4 right-4 p-2 bg-grey-800/80 rounded-full text-slate-400 hover:text-white backdrop-blur-md"
                title="Reset to Original"
            >
                <RotateCcw size={16} />
            </button>
          </main>

          {/* Bottom Controls */}
          <div className="bg-grey-900 border-t border-grey-800 flex flex-col flex-shrink-0">
            <div className="h-44 px-4 py-4">
                 <ControlPanel 
                    activeTab={state.activeTab}
                    onApplyStyle={handleApplyStyle}
                    onApplyFaceEdit={handleFaceEdit}
                    isProcessing={state.processingState !== ProcessingState.IDLE}
                    selectedGender={state.gender}
                 />
            </div>

            <nav className="h-20 border-t border-grey-800 flex items-center justify-around px-2 pb-safe bg-grey-900">
                {TAB_CONFIG.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
                        className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300 ${
                            state.activeTab === tab.id 
                                ? 'text-grey-900 bg-gold-400 shadow-[0_0_15px_rgba(204,164,59,0.4)] transform -translate-y-2' 
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                ))}
            </nav>
          </div>
        </div>
      )}

      {/* Modals */}
      {state.compliance && (
          <ComplianceModal 
            result={state.compliance} 
            onClose={() => setState(prev => ({ ...prev, compliance: null }))} 
          />
      )}
      
      {isExportOpen && (
        <ExportModal 
          imageBase64={state.currentImage}
          onClose={() => setIsExportOpen(false)}
          onReset={handleStartOver}
        />
      )}
    </div>
  );
};

export default App;