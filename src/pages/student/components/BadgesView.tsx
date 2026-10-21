import React from 'react';
import { SYSTEM_BADGES } from '../../../data/modulesData';
import { Student } from '../../../types';

interface BadgesViewProps {
  student: Student;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
      <h3 className="text-base font-bold text-slate-800 mb-1">
        Earned Achievement Badges
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Badges awarded upon completing precision sampling thresholds and community outreach impact.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SYSTEM_BADGES.map(badge => {
          const isUnlocked = student.badgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs">
                  🏆
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{badge.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {isUnlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
