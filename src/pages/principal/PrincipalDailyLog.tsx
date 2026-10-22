import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  FlaskConical, 
  Users, 
  MessageSquareQuote, 
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DailyLog } from '../../types';
import { StatusChip } from '../../components/common/StatusChip';
import { CURRICULUM_MODULES } from '../../data/modulesData';

export const PrincipalDailyLog: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [logs, setLogs] = useState<DailyLog[]>(
    storageService.getDailyLogs(school.id)
      .filter(l => l.dayNumber <= school.currentDay)
      .sort((a, b) => b.dayNumber - a.dayNumber)
  );
  const [remarksState, setRemarksState] = useState<Record<string, string>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const totalDeliveredHours = logs.reduce((acc, l) => acc + l.hoursTaught, 0);
  const totalSamples = logs.reduce((acc, l) => acc + l.samplesTestedCount, 0);
  const totalFarmers = logs.reduce((acc, l) => acc + l.farmersReachedCount, 0);
  const endorsedLogsCount = logs.filter(l => Boolean(l.principalRemarks && l.principalRemarks.trim().length > 0)).length;

  const handleRemarkChange = (logId: string, val: string) => {
    setRemarksState(prev => ({ ...prev, [logId]: val }));
  };

  const handleApplyPreset = (logId: string, preset: string) => {
    setRemarksState(prev => ({ ...prev, [logId]: preset }));
  };

  const handleSaveRemark = (log: DailyLog) => {
    const remark = remarksState[log.id] !== undefined ? remarksState[log.id] : (log.principalRemarks || '');
    if (!remark.trim()) return;

    log.principalRemarks = remark;
    storageService.saveDailyLog(log, currentUser.name);
    setLogs(prev => prev.map(l => l.id === log.id ? { ...l, principalRemarks: remark } : l));

    storageService.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: 'principal',
      action: 'PRINCIPAL_REMARK_ADDED',
      details: `Added principal endorsement to Day ${log.dayNumber} log: "${remark}"`,
      schoolId: school.id
    });

    setSavedNotice(`Official endorsement saved for Day ${log.dayNumber}!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const getModuleImage = (moduleNumber: number): string => {
    const mod = CURRICULUM_MODULES.find(m => m.id === moduleNumber);
    return mod?.image || '/assets/images/module-soil-testing.webp';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <ClipboardCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Faculty Daily Updates & Principal Endorsements
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Day {school.currentDay} of 28 Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Chronological laboratory timeline of classroom instructions and practical fieldwork submitted by <span className="font-semibold text-slate-700">{school.facultyName}</span>. Review session evidence and record principal observations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-center min-w-[90px]">
            <span className="text-base font-extrabold text-emerald-800 block">{endorsedLogsCount} / {logs.length}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Endorsed</span>
          </div>
          <div className="px-3 py-2 bg-purple-50 rounded-xl border border-purple-100 text-center min-w-[90px]">
            <span className="text-base font-extrabold text-purple-800 block">{totalDeliveredHours}h</span>
            <span className="text-[10px] text-purple-700 font-semibold">Delivered</span>
          </div>
          <div className="px-3 py-2 bg-sky-50 rounded-xl border border-sky-100 text-center min-w-[85px]">
            <span className="text-base font-extrabold text-sky-800 block">{totalSamples}</span>
            <span className="text-[10px] text-sky-700 font-semibold">Tests Logged</span>
          </div>
          <div className="px-3 py-2 bg-amber-50 rounded-xl border border-amber-100 text-center min-w-[85px]">
            <span className="text-base font-extrabold text-amber-800 block">{totalFarmers}</span>
            <span className="text-[10px] text-amber-700 font-semibold">Farmers</span>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Pictorial Session Stages Gallery Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Laboratory & Field Session Pictorial Representation
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Arkashine Practical Pedagogy
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="relative rounded-2xl overflow-hidden h-28 group bg-slate-900">
            <img 
              src="/assets/images/module-agri-science.webp" 
              alt="Soil Science Theory" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <div>
                <span className="text-[10px] font-bold text-emerald-300 block">Stage 1: Science</span>
                <span className="text-xs font-bold text-white">Soil Horizons & Chemistry</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-28 group bg-slate-900">
            <img 
              src="/assets/images/module-sample-collection.webp" 
              alt="Sample Collection" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <div>
                <span className="text-[10px] font-bold text-emerald-300 block">Stage 2: Fieldwork</span>
                <span className="text-xs font-bold text-white">GPS Auger Core Sampling</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-28 group bg-slate-900">
            <img 
              src="/assets/images/module-soil-testing.webp" 
              alt="SoiLENZ Testing" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <div>
                <span className="text-[10px] font-bold text-amber-300 block">Stage 3: Lab Reagents</span>
                <span className="text-xs font-bold text-white">SoiLENZ Handheld Testing</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-28 group bg-slate-900">
            <img 
              src="/assets/images/module-health-reports.webp" 
              alt="Farmer Advisory" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <div>
                <span className="text-[10px] font-bold text-sky-300 block">Stage 4: Community</span>
                <span className="text-xs font-bold text-white">Farmer Health Advisories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline of Logs */}
      <div className="space-y-4">
        {logs.map(log => {
          const currentRemark = remarksState[log.id] !== undefined ? remarksState[log.id] : (log.principalRemarks || '');
          const isEndorsed = Boolean(log.principalRemarks && log.principalRemarks.trim().length > 0);
          const fallbackImage = getModuleImage(log.moduleNumber);

          return (
            <div
              key={log.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs hover:border-slate-300 transition-all space-y-4 ${
                isEndorsed ? 'border-emerald-200/90 ring-1 ring-emerald-50' : 'border-slate-200/90'
              }`}
            >
              {/* Log Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-xs">
                      Day {log.dayNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <StatusChip status={log.status} size="sm" />
                    {isEndorsed && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Principal Endorsed
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {log.moduleTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100 shrink-0 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-purple-800">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    {log.hoursTaught} hrs taught
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-bold text-sky-800">
                    <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                    {log.samplesTestedCount} samples
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {log.farmersReachedCount} farmers
                  </span>
                </div>
              </div>

              {/* Topics Covered & Pictorial Representation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Pictorial Session Evidence / Poster Preview */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 relative h-36 md:h-auto group">
                  <img
                    src={log.photos && log.photos.length > 0 ? log.photos[0] : fallbackImage}
                    alt={log.moduleTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-semibold text-white drop-shadow-xs">
                      {log.photos && log.photos.length > 0 ? 'Verified Session Evidence' : 'Curriculum Lab Demonstration'}
                    </span>
                  </div>
                </div>

                {/* Topics List & Details */}
                <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        Topics Taught & Practical Exercises:
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Module {log.moduleNumber} Pedagogy
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                      {log.topicsCovered.map((t, idx) => (
                        <li key={idx} className="leading-snug">{t}</li>
                      ))}
                    </ul>
                  </div>

                  {log.learningDescription && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-700 block mb-0.5">Faculty Classroom Notes:</span>
                      {log.learningDescription}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <span className="flex items-center gap-1 font-medium text-emerald-700">
                      🧪 Chemical Safety Verified: Goggles & Reagents Signed
                    </span>
                    <span className="font-semibold text-slate-600">
                      Submitted by {log.facultyName}
                    </span>
                  </div>
                </div>

              </div>

              {/* Photo Strip if more than 1 photo */}
              {log.photos && log.photos.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {log.photos.map((p, idx) => (
                    <div key={idx} className="w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={p} alt={`Lab photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Principal Remarks & Official Endorsement Box */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                    Principal Observation & Official Endorsement:
                  </label>
                  {isEndorsed && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Endorsed & Stamped for Arkashine Compliance
                    </span>
                  )}
                </div>

                {/* Quick Endorsement Preset Chips */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className="text-slate-400 font-semibold mr-1">Quick Endorsement:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(log.id, "Verified lab chemical safety protocols, PPE kits, and active student participation.")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                  >
                    + Lab Safety & PPE Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(log.id, "High student attendance observed; excellent precision shown during SoiLENZ sample readings.")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                  >
                    + Excellent Student Precision
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(log.id, "Village farmer interaction completed smoothly. Advisory recommendations verified.")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                  >
                    + Farmer Advisory Commended
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={currentRemark}
                    onChange={(e) => handleRemarkChange(log.id, e.target.value)}
                    placeholder="Enter principal observation, PTA commendation, or safety audit endorsement..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
                  />
                  <button
                    onClick={() => handleSaveRemark(log)}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Endorsement
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
