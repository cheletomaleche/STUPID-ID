import React, { useState } from 'react';
import { AppTab, StylingOption, Gender } from '../types';
import { 
  HAIR_OPTIONS, HAIR_COLORS,
  OUTFIT_OPTIONS, OUTFIT_COLORS,
  BACKGROUND_OPTIONS, 
  BEARD_OPTIONS 
} from '../constants';
import { Sparkles, Smile, Eye, User, Palette } from 'lucide-react';

interface ControlPanelProps {
  activeTab: AppTab;
  onApplyStyle: (option: StylingOption) => void;
  onApplyFaceEdit: (prompt: string) => void;
  isProcessing: boolean;
  selectedGender: Gender | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ activeTab, onApplyStyle, onApplyFaceEdit, isProcessing, selectedGender }) => {
  const [sliderValues, setSliderValues] = useState({
    slim: 50,
    smile: 50,
    eyes: 50
  });

  const handleSliderChange = (key: keyof typeof sliderValues, val: number) => {
    setSliderValues(prev => ({ ...prev, [key]: val }));
  };

  const handleFaceEditCommit = (key: string) => {
    const val = sliderValues[key as keyof typeof sliderValues];
    let prompt = "";
    
    if (val >= 45 && val <= 55) return; 

    if (key === 'slim') {
       if (val > 55) prompt = "Subtly refine the jawline and cheekbones for a naturally slimmer face, while strictly maintaining identity and ID photo standards.";
       if (val < 45) prompt = "Make the face slightly fuller naturally.";
    } else if (key === 'smile') {
       if (val > 55) prompt = "Subtly lift the corners of the mouth to create a gentle, confident smile. Keep the mouth closed or natural. The expression must remain professional for an ID photo.";
       if (val < 45) prompt = "Make the facial expression more serious and neutral. Relax the mouth corners.";
    } else if (key === 'eyes') {
       if (val > 55) prompt = "Enhance eye focus and clarity. Add subtle catchlights to the pupils to make the eyes look more alert and engaged. Do not enlarge eyes unnaturally.";
       if (val < 45) prompt = "Soften the gaze slightly for a calmer look.";
    }

    if (prompt) {
      onApplyFaceEdit(prompt);
      setSliderValues(prev => ({ ...prev, [key]: 50 })); 
    }
  };

  const filterByGender = (options: StylingOption[]) => {
    return options.filter(opt => {
      if (!opt.category) return true;
      if (opt.category === 'Unisex') return true;
      if (opt.category === 'Men' && selectedGender === Gender.MALE) return true;
      if (opt.category === 'Women' && selectedGender === Gender.FEMALE) return true;
      // Backgrounds, Beards (if female? usually no beards, but we'll leave logic flexible)
      if (activeTab === AppTab.BACKGROUND) return true;
      if (activeTab === AppTab.BEARD && selectedGender === Gender.MALE) return true;
      return false;
    });
  };

  const renderStyleRow = (title: string, options: StylingOption[]) => {
    const filteredOptions = filterByGender(options);
    
    // If no options (e.g. Female + Beard), don't render row
    if (filteredOptions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2">{title}</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {filteredOptions.map((opt) => (
            <button
              key={opt.id}
              disabled={isProcessing}
              onClick={() => onApplyStyle(opt)}
              className={`
                flex-shrink-0 w-20 h-20 rounded-xl border-2 border-grey-700 bg-grey-800 
                hover:border-gold-400 hover:shadow-[0_0_15px_rgba(204,164,59,0.3)] 
                transition-all duration-300 flex flex-col items-center justify-center gap-1
                snap-start group relative overflow-hidden
              `}
            >
              {opt.previewColor && (
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: opt.previewColor }}
                />
              )}
              <span className="relative z-10 text-slate-300 group-hover:text-white font-medium text-[10px] text-center px-1 leading-tight">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderColorRow = (title: string, options: StylingOption[]) => (
    <div className="mb-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2 flex items-center gap-2">
        {title} <Palette size={10} />
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x scrollbar-hide">
        {options.map((opt) => (
          <button
            key={opt.id}
            disabled={isProcessing}
            onClick={() => onApplyStyle(opt)}
            className="flex-shrink-0 group flex flex-col items-center gap-1"
          >
            <div 
              className={`
                w-10 h-10 rounded-full border-2 border-grey-700 shadow-md
                group-hover:border-gold-400 group-hover:scale-110 transition-all duration-300
              `}
              style={{ backgroundColor: opt.previewColor }}
            />
            <span className="text-[9px] text-slate-500 group-hover:text-gold-400 uppercase font-semibold">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSlider = (
    key: keyof typeof sliderValues, 
    label: string, 
    minLabel: string, 
    maxLabel: string,
    icon?: React.ReactNode
  ) => (
    <div key={key} className="space-y-3 p-3 bg-grey-800/50 rounded-xl border border-grey-700/50">
      <div className="flex justify-between items-center text-xs text-gold-400 uppercase tracking-wider font-semibold">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <span className="text-slate-500 font-normal">{sliderValues[key]}%</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-500 w-12 text-right">{minLabel}</span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={sliderValues[key]}
          onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
          onMouseUp={() => handleFaceEditCommit(key)}
          onTouchEnd={() => handleFaceEditCommit(key)}
          disabled={isProcessing}
          className="flex-1 h-1.5 bg-grey-700 rounded-lg appearance-none cursor-pointer accent-gold-400 hover:accent-gold-300 transition-all"
        />
        <span className="text-[10px] text-slate-500 w-12">{maxLabel}</span>
      </div>
    </div>
  );

  const renderFaceControls = () => (
    <div className="flex flex-col gap-4 px-2 py-2 w-full max-w-md mx-auto h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-grey-700">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-2">
          Mood Control <Sparkles size={12} className="text-gold-400 animate-pulse" />
        </h3>
        {renderSlider('smile', 'Expression', 'Serious', 'Gentle Smile', <Smile size={14} />)}
        {renderSlider('eyes', 'Eye Focus', 'Soft', 'Alert & Sharp', <Eye size={14} />)}
      </div>

      <div className="w-full h-px bg-grey-800 my-1" />

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-2">
          Structure <User size={12} />
        </h3>
        {renderSlider('slim', 'Face Shape', 'Fuller', 'Slimmer', null)}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {activeTab === AppTab.FACE && renderFaceControls()}
      
      {activeTab === AppTab.HAIR && (
        <div className="h-full overflow-y-auto scrollbar-hide">
          {renderStyleRow("Hair Styles", HAIR_OPTIONS)}
          {renderColorRow("Hair Color", HAIR_COLORS)}
        </div>
      )}

      {activeTab === AppTab.OUTFIT && (
        <div className="h-full overflow-y-auto scrollbar-hide">
          {renderStyleRow("Apparel Style", OUTFIT_OPTIONS)}
          {renderColorRow("Fabric Color", OUTFIT_COLORS)}
        </div>
      )}
      
      {activeTab === AppTab.BACKGROUND && (
        <div className="h-full overflow-y-auto scrollbar-hide pt-2">
           {renderStyleRow("Official Backgrounds", BACKGROUND_OPTIONS)}
        </div>
      )}

      {activeTab === AppTab.BEARD && (
        <div className="h-full overflow-y-auto scrollbar-hide pt-2">
           {selectedGender === Gender.MALE 
             ? renderStyleRow("Facial Hair", BEARD_OPTIONS) 
             : <div className="flex items-center justify-center h-32 text-slate-500 text-sm">Facial hair options not available.</div>
           }
        </div>
      )}
    </div>
  );
};

export default ControlPanel;