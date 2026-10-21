import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useAuth();

  const handleGoHome = () => {
    navigate(`/${currentRole}`);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm max-w-md w-full space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 text-emerald-700 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            404 Error
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist in the Arkashine School Innovation Lab portal or may have moved.
          </p>
        </div>

        <button
          onClick={handleGoHome}
          className="w-full py-3 px-4 rounded-xl btn-theme-primary text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to My Dashboard
        </button>
      </div>
    </div>
  );
};
