import React from 'react';
import { ComplianceResult } from '../types';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ComplianceModalProps {
  result: ComplianceResult | null;
  onClose: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-grey-800 border border-grey-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="bg-grey-900 p-4 flex justify-between items-center border-b border-grey-700">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            ID Compliance Check
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center">
            {result.isCompliant ? (
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            )}
            
            <h4 className={`text-xl font-bold ${result.isCompliant ? 'text-green-400' : 'text-red-400'}`}>
              {result.isCompliant ? 'Passed' : 'Attention Needed'}
            </h4>
            <span className="text-slate-400 text-sm mt-1">Score: {result.score}/100</span>
          </div>

          <div className="bg-grey-900/50 rounded-xl p-4">
            <h5 className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-3">Analysis Report</h5>
            {result.issues.length === 0 ? (
              <p className="text-slate-300 text-sm">No issues detected. This photo is ready for official use.</p>
            ) : (
              <ul className="space-y-2">
                {result.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 bg-grey-900 border-t border-grey-700">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-grey-900 font-bold transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceModal;