import React from 'react';
import { X, Sprout } from 'lucide-react';
import { ARKASHINE_TEAM } from '../../data/teamData';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#5C26C0] dark:text-purple-400 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Arkashine Innovation Lab Team
              </h3>
              <p className="text-xs text-slate-500">
                Core Leadership • 3 Founding Members
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Members Cards */}
        <div className="space-y-3">
          {ARKASHINE_TEAM.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center gap-3.5 hover:border-purple-300 transition-colors"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-0.5 object-cover shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-[#5C26C0] dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {member.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#5C26C0] dark:text-purple-400">
                  {member.role}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900 text-center text-xs text-[#5C26C0] dark:text-purple-300 font-medium">
          Arkashine Innovations Pvt. Ltd. • Agritech & School Innovation Lab
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
