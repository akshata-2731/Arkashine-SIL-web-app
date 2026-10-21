import React from 'react';
import { CURRICULUM_MODULES } from '../../../data/modulesData';
import { Student } from '../../../types';

interface CurriculumModulesViewProps {
  student: Student;
}

export const CurriculumModulesView: React.FC<CurriculumModulesViewProps> = ({ student }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRICULUM_MODULES.map(mod => {
          const isDone = mod.id <= student.modulesCompleted;
          return (
            <div
              key={mod.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {mod.code} • 18 Hours
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-0.5">{mod.title}</h4>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">{mod.subtitle}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{mod.description}</p>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
                    Key Learning Units:
                  </span>
                  {mod.topics.map(t => (
                    <div key={t.id} className="flex justify-between text-slate-600">
                      <span className="truncate pr-2">• {t.title}</span>
                      <span className="font-mono text-slate-400 shrink-0">{t.theoryHours + t.practicalHours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Assessment: {mod.assessmentType}</span>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isDone ? 'Passed (88%)' : 'In Progress'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
