import React from 'react';
import { Sprout } from 'lucide-react';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md animate-bounce"
        style={{ backgroundColor: 'var(--theme-accent, #10B981)' }}
      >
        <Sprout className="w-6 h-6" />
      </div>
      <p className="text-xs font-semibold text-slate-500 mt-3">
        Loading view...
      </p>
    </div>
  );
};
