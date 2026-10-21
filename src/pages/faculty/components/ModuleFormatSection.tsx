import React from 'react';
import { CURRICULUM_MODULES } from '../../../data/modulesData';
import { SessionType } from '../../../types';
import { useT } from '../../../i18n/useT';

interface ModuleFormatSectionProps {
  selectedModule: number;
  onSelectModule: (moduleId: number) => void;
  sessionType: SessionType;
  onSelectSessionType: (st: SessionType) => void;
  hoursTaught: number;
  onHoursChange: (hours: number) => void;
  delayReason: string;
  onDelayReasonChange: (reason: string) => void;
  errors?: {
    hoursTaught?: string;
    delayReason?: string;
  };
}

export const ModuleFormatSection: React.FC<ModuleFormatSectionProps> = ({
  selectedModule,
  onSelectModule,
  sessionType,
  onSelectSessionType,
  hoursTaught,
  onHoursChange,
  delayReason,
  onDelayReasonChange,
  errors
}) => {
  const { t } = useT();

  const sessionTypes: { type: SessionType; label: string }[] = [
    { type: 'Theory', label: t('log.theory_only', 'Theory') },
    { type: 'Practical', label: t('log.lab_only', 'Practical') },
    { type: 'Field', label: t('log.outreach_format', 'Field') },
    { type: 'Assessment', label: 'Assessment' }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
        1. {t('log.curriculum_module', 'Module & Session Format')}
      </h3>

      {/* Module selection pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CURRICULUM_MODULES.map(m => (
          <button
            type="button"
            key={m.id}
            onClick={() => onSelectModule(m.id)}
            className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all min-h-[56px] flex flex-col justify-center cursor-pointer ${
              selectedModule === m.id
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-[10px] opacity-75">{m.code}</span>
            <span className="line-clamp-1">{m.title}</span>
          </button>
        ))}
      </div>

      {/* Session Type */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          {t('log.session_type', 'Session Type')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sessionTypes.map(st => (
            <button
              type="button"
              key={st.type}
              onClick={() => onSelectSessionType(st.type)}
              className={`py-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                sessionType === st.type
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hours Taught (Stepper + direct input) */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">
              {t('log.classroom_hours', 'Classroom / Lab Hours Taught')}
            </span>
            <span className="text-[11px] text-slate-400">Target: 2.5 hours daily (max 12h)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onHoursChange(Math.max(0.5, Number((hoursTaught - 0.5).toFixed(1))))}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-lg font-bold flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Decrease hours taught"
            >
              -
            </button>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={hoursTaught}
                onChange={(e) => onHoursChange(parseFloat(e.target.value) || 0)}
                className="text-lg font-extrabold text-slate-900 w-16 text-center border border-slate-200 rounded-lg py-1"
                aria-label="Hours taught"
              />
              <span className="text-sm font-bold text-slate-600">h</span>
            </div>
            <button
              type="button"
              onClick={() => onHoursChange(Math.min(12, Number((hoursTaught + 0.5).toFixed(1))))}
              className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-lg font-bold flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Increase hours taught"
            >
              +
            </button>
          </div>
        </div>
        {errors?.hoursTaught && (
          <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
            ⚠️ {errors.hoursTaught}
          </p>
        )}
      </div>

      {/* Optional Delay Reason */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Session Delay / Reschedule Reason {hoursTaught < 1.5 ? <span className="text-rose-600 font-bold">*Required for reduced hours</span> : '(Optional)'}
        </label>
        <input
          type="text"
          value={delayReason}
          onChange={(e) => onDelayReasonChange(e.target.value)}
          placeholder="e.g. Morning power interruption, heavy rainfall delay"
          className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden ${
            errors?.delayReason ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-emerald-500'
          }`}
        />
        {errors?.delayReason && (
          <p className="text-xs font-semibold text-rose-600 mt-1">
            ⚠️ {errors.delayReason}
          </p>
        )}
      </div>
    </div>
  );
};
