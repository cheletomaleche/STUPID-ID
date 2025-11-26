import React, { useRef, useState } from 'react';
import { X, Download, Maximize, FileImage, Home, Grid, Printer, ImagePlus } from 'lucide-react';

interface ExportModalProps {
  imageBase64: string | null;
  onClose: () => void;
  onReset: () => void;
}

interface SizeOption {
  id: string;
  label: string;
  description: string;
  widthMm: number;
  heightMm: number;
  ratio: number; // width / height
  type: 'single' | 'sheet';
  sheetConfig?: {
    cols: number;
    rows: number;
    gapMm: number;
    paperWidthMm: number; // Standard 4x6 inch = 101.6 x 152.4 mm
    paperHeightMm: number;
  };
}

const EXPORT_OPTIONS: SizeOption[] = [
  // Single Photos (Digital Use)
  { 
    id: 'us_passport', 
    label: '2" x 2" (US Passport)', 
    description: 'Single digital file. Square format.',
    widthMm: 51,
    heightMm: 51,
    ratio: 1,
    type: 'single'
  },
  { 
    id: 'global_2inch', 
    label: '35mm x 45mm (Global)', 
    description: 'Single digital file. Standard for UK, EU, Australia.',
    widthMm: 35,
    heightMm: 45,
    ratio: 35/45,
    type: 'single'
  },
  { 
    id: '1inch', 
    label: '1" (25mm x 35mm)', 
    description: 'Single digital file. Common for licenses.',
    widthMm: 25,
    heightMm: 35,
    ratio: 25/35,
    type: 'single'
  },
  // Printable Sheets (4x6 inch paper)
  {
    id: 'sheet_us_2x2',
    label: '2" x 2" Sheet (2 Photos)',
    description: 'Printable 4x6" sheet with 2 US Passport photos.',
    widthMm: 51,
    heightMm: 51,
    ratio: 1,
    type: 'sheet',
    sheetConfig: {
      cols: 2,
      rows: 1, 
      gapMm: 10,
      paperWidthMm: 152.4, // 6 inches
      paperHeightMm: 101.6 // 4 inches
    }
  },
  {
    id: 'sheet_global',
    label: '35x45mm Sheet (4 Photos)',
    description: 'Printable 4x6" sheet with 4 Global Standard photos.',
    widthMm: 35,
    heightMm: 45,
    ratio: 35/45,
    type: 'sheet',
    sheetConfig: {
      cols: 2, 
      rows: 2, 
      gapMm: 8, 
      paperWidthMm: 152.4, 
      paperHeightMm: 101.6 
    }
  },
  {
    id: 'sheet_1inch',
    label: '1" Sheet (8 Photos)',
    description: 'Printable 4x6" sheet with 8 copies of 1" photos.',
    widthMm: 25,
    heightMm: 35,
    ratio: 25/35,
    type: 'sheet',
    sheetConfig: {
      cols: 4,
      rows: 2,
      gapMm: 5,
      paperWidthMm: 152.4, // 6 inches
      paperHeightMm: 101.6 // 4 inches
    }
  }
];

const ExportModal: React.FC<ExportModalProps> = ({ imageBase64, onClose, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!imageBase64) return null;

  const handleDownload = (option: SizeOption | null) => {
    if (!option) {
      // Download Original
      const link = document.createElement('a');
      link.href = imageBase64;
      link.download = `STUPID-ID-Original-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // DPI configuration - High quality for print
      const DPI = 300;
      const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

      // Determine Canvas Size
      let canvasWidth, canvasHeight;
      if (option.type === 'sheet' && option.sheetConfig) {
        canvasWidth = mmToPx(option.sheetConfig.paperWidthMm);
        canvasHeight = mmToPx(option.sheetConfig.paperHeightMm);
      } else {
        canvasWidth = mmToPx(option.widthMm);
        canvasHeight = mmToPx(option.heightMm);
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      if (!ctx) return;

      // Fill Background White (Paper Color)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw Function with "Scale to Fit" (Contain) logic
      // This ensures we never cut off hair or chin
      const drawPhoto = (x: number, y: number, w: number, h: number) => {
        // Calculate scaling factor to FIT the image inside destination w,h
        // This ensures the entire original image is visible (no cropping hair/chin)
        const scale = Math.min(w / img.width, h / img.height);
        
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        
        // Center the image within the target area
        const dx = x + (w - drawW) / 2;
        const dy = y + (h - drawH) / 2;

        // Draw white background behind the photo area explicitly (safe guard)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, w, h);

        // Draw image
        ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, drawW, drawH);

        // Add light border for cutting guide
        ctx.strokeStyle = '#cbd5e1'; // Light grey
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      };

      if (option.type === 'sheet' && option.sheetConfig) {
        const photoW = mmToPx(option.widthMm);
        const photoH = mmToPx(option.heightMm);
        const gap = mmToPx(option.sheetConfig.gapMm);
        
        // Calculate grid geometry
        const cols = option.sheetConfig.cols;
        const rows = option.sheetConfig.rows;
        
        const totalGridW = (cols * photoW) + ((cols - 1) * gap);
        const totalGridH = (rows * photoH) + ((rows - 1) * gap);
        
        // Center the grid on the paper
        const startX = (canvasWidth - totalGridW) / 2;
        const startY = (canvasHeight - totalGridH) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const px = startX + c * (photoW + gap);
            const py = startY + r * (photoH + gap);
            drawPhoto(px, py, photoW, photoH);
          }
        }
      } else {
        // Single Photo
        drawPhoto(0, 0, canvasWidth, canvasHeight);
      }

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `STUPID-ID-${option.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = imageBase64;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="bg-grey-900 border border-grey-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-5 flex justify-between items-center border-b border-grey-800 flex-shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="text-gold-400" size={24} /> Export Options
          </h3>
          <div className="flex items-center gap-2">
            <button 
                onClick={onReset} 
                className="text-slate-400 hover:text-gold-400 transition-colors p-2 rounded-lg hover:bg-grey-800"
                title="Start New Photo"
            >
                <ImagePlus size={20} />
            </button>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-grey-800"
                title="Close"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-grey-700">
          
          <button 
            onClick={() => handleDownload(null)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-grey-800 hover:bg-grey-700 hover:border-gold-400/50 border border-transparent transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-grey-900 rounded-lg group-hover:text-gold-400 text-slate-300">
                 <Maximize size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-200">Original Full Size</div>
                <div className="text-xs text-slate-500">Highest quality for external editing</div>
              </div>
            </div>
            <Download size={18} className="text-slate-500 group-hover:text-gold-400" />
          </button>

          <div className="h-px bg-grey-800 w-full my-2"></div>
          
          <h4 className="text-xs uppercase text-slate-500 font-bold tracking-wider flex items-center gap-2">
             <FileImage size={12}/> Digital File (Single)
          </h4>
          
          <div className="grid gap-3">
             {EXPORT_OPTIONS.filter(o => o.type === 'single').map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => handleDownload(opt)}
                 className="w-full flex items-center justify-between p-3 rounded-xl bg-grey-800 hover:bg-grey-700 hover:border-gold-400/50 border border-transparent transition-all group"
               >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-grey-900 rounded-lg group-hover:text-gold-400 text-slate-300">
                       <FileImage size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-200 text-sm">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.description}</div>
                    </div>
                  </div>
               </button>
             ))}
          </div>

          <div className="h-px bg-grey-800 w-full my-2"></div>
          
          <h4 className="text-xs uppercase text-slate-500 font-bold tracking-wider flex items-center gap-2">
             <Printer size={12}/> Printable Sheet (4x6")
          </h4>

          <div className="grid gap-3">
             {EXPORT_OPTIONS.filter(o => o.type === 'sheet').map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => handleDownload(opt)}
                 className="w-full flex items-center justify-between p-3 rounded-xl bg-grey-800 hover:bg-grey-700 hover:border-gold-400/50 border border-transparent transition-all group"
               >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-grey-900 rounded-lg group-hover:text-gold-400 text-slate-300">
                       <Grid size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-200 text-sm">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.description}</div>
                    </div>
                  </div>
               </button>
             ))}
          </div>

        </div>
        
        <div className="p-4 bg-grey-950 text-center flex-shrink-0 border-t border-grey-800">
           <span className="text-xs text-slate-600 block">Generated at 300 DPI (High Quality Print)</span>
           <span className="text-[10px] text-slate-700 block mt-1">Recommended paper size: 4R (4" x 6")</span>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;