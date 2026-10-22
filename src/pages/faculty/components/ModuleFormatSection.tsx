import React from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  MapPin, 
  Award, 
  Sparkles, 
  Check, 
  FileText 
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../../../data/modulesData';
import { SessionType } from '../../../types';
import { useT } from '../../../i18n/useT';

interface ModuleFormatSectionProps {
  selectedModule: number;
  onSelectModule: (moduleId: number) => void;
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  learningDescription: string;
  onLearningDescriptionChange: (desc: string) => void;
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
  selectedTopics,
  onToggleTopic,
  learningDescription,
  onLearningDescriptionChange,
  sessionType,
  onSelectSessionType,
  hoursTaught,
  onHoursChange,
  delayReason,
  onDelayReasonChange,
  errors
}) => {
  const { t } = useT();

  const sessionTypes: { type: SessionType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'Theory', label: t('log.theory_only', 'Theory'), icon: BookOpen },
    { type: 'Practical', label: t('log.lab_only', 'Practical (Lab)'), icon: FlaskConical },
    { type: 'Field', label: t('log.outreach_format', 'Field (Outreach)'), icon: MapPin },
    { type: 'Assessment', label: 'Assessment / Quiz', icon: Award }
  ];

  const currentModuleObj = CURRICULUM_MODULES.find(m => m.id === selectedModule) || CURRICULUM_MODULES[0];

  const quickTemplates = [
    "Conducted hands-on SoiLENZ sensor calibration and tested 12 core samples.",
    "Practiced standard 15cm auger zig-zag field grid sampling and 2mm sieving.",
    "Calculated Soil Organic Carbon (SOC) deficit and prepared farmer advisory cards.",
    "Reviewed N-P-K chemical test strips and demonstrated pH balance indicators."
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              1. {t('log.curriculum_module', 'Module, Session & Learning Description')}
            </h3>
            <p className="text-xs text-slate-500">
              Select module, session format, topics covered, and pedagogy summary
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {currentModuleObj.code}
        </span>
      </div>

      {/* Module selection cards */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          Select Active Curriculum Module
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CURRICULUM_MODULES.map(m => {
            const isSelected = selectedModule === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`p-3.5 rounded-2xl text-left border text-xs transition-all min-h-[70px] flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-300'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                    {m.code}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <p className="font-bold line-clamp-2 leading-tight">
                  {m.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Covered in this module */}
      <div>
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-2">
          <span>Topics Covered Today ({currentModuleObj.topics.length} Available)</span>
          <span className="text-[11px] font-normal text-slate-400">Click to toggle topic tags</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {currentModuleObj.topics.map(tItem => {
            const isChecked = selectedTopics.includes(tItem.title);
            return (
              <button
                type="button"
                key={tItem.id}
                onClick={() => onToggleTopic(tItem.title)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 text-emerald-700 shrink-0" />}
                <span>{tItem.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Description Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Today's Learning Description & Pedagogical Summary</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {learningDescription.length} characters
          </span>
        </div>

        <textarea
          rows={3}
          value={learningDescription}
          onChange={(e) => onLearningDescriptionChange(e.target.value)}
          placeholder="Describe today's key practical concepts taught, instruments calibrated, student observations, and farmer questions answered..."
          className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
        />

        {/* Quick Suggestion Chips */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Add:
          </span>
          {quickTemplates.map((tmpl, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                const updated = learningDescription.trim() 
                  ? `${learningDescription.trim()} ${tmpl}`
                  : tmpl;
                onLearningDescriptionChange(updated);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200/80 transition-colors cursor-pointer truncate max-w-xs"
              title={tmpl}
            >
              + {tmpl.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Session Type & Hours */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Session Type */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            {t('log.session_type', 'Session Format')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {sessionTypes.map(st => {
              const Icon = st.icon;
              const isSelected = sessionType === st.type;
              return (
                <button
                  type="button"
                  key={st.type}
                  onClick={() => onSelectSessionType(st.type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hours Taught */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              {t('log.classroom_hours', 'Hours Taught Today')}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Target: 2.5h (max 12h)</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => onHoursChange(Math.max(0.5, Number((hoursTaught - 0.5).toFixed(1))))}
              className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-lg font-black flex items-center justify-center active:scale-95 cursor-pointer shadow-2xs border border-slate-200"
              aria-label="Decrease hours taught"
            >
              -
            </button>
            <div className="flex-1 flex items-center justify-center gap-1.5">
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={hoursTaught}
                onChange={(e) => onHoursChange(parseFloat(e.target.value) || 0)}
                className="text-xl font-black text-slate-900 w-16 text-center bg-white border border-slate-200 rounded-xl py-1 shadow-inner focus:outline-hidden"
                aria-label="Hours taught"
              />
              <span className="text-sm font-bold text-slate-600">Hours</span>
            </div>
            <button
              type="button"
              onClick={() => onHoursChange(Math.min(12, Number((hoursTaught + 0.5).toFixed(1))))}
              className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-lg font-black flex items-center justify-center active:scale-95 cursor-pointer shadow-2xs"
              aria-label="Increase hours taught"
            >
              +
            </button>
          </div>

          {errors?.hoursTaught && (
            <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
              ⚠️ {errors.hoursTaught}
            </p>
          )}
        </div>
      </div>

      {/* Reduced Hours Delay Reason */}
      {hoursTaught < 2.0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5 animate-in fade-in">
          <label className="font-bold text-amber-900 block">
            Reason for Reduced Hours ({hoursTaught}h &lt; 2.5h target) <span className="text-rose-600">*Required</span>
          </label>
          <input
            type="text"
            value={delayReason}
            onChange={(e) => onDelayReasonChange(e.target.value)}
            placeholder="e.g. Heavy monsoon rain, school assembly delay, or power maintenance"
            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
          />
          {errors?.delayReason && (
            <p className="text-xs font-semibold text-rose-600">
              ⚠️ {errors.delayReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
