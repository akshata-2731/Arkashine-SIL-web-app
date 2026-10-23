import React, { useState } from 'react';
import { 
  FlaskConical, 
  Users, 
  MessageSquareQuote, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Receipt, 
  Calendar, 
  Check 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService, useDailyLogs } from '../../services/storageService';
import { DailyLog } from '../../types';

export const PrincipalDailyLog: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  // REAL-TIME hook: Automatically updates when Faculty submits in real time!
  const allSchoolLogs = useDailyLogs(school?.id);
  const logs = [...allSchoolLogs].sort((a, b) => b.dayNumber - a.dayNumber);

  // Active / Selected Log for endorsement (defaults to latest log)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const activeLog = (selectedDayNumber !== null ? logs.find(l => l.dayNumber === selectedDayNumber) : logs[0]) || logs[0];

  // Endorsement remark input state
  const [remarkInput, setRemarkInput] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Endorsement Presets for 1-click review
  const ENDORSEMENT_PRESETS = [
    '⭐ Excellent field testing & verified auger samples.',
    '🧾 Test ticket proofs & SoiLENZ sensor readings verified.',
    '🌾 Farmer consultation and fertilizer advice approved.',
    '🧪 Chemical safety protocols observed by student teams.'
  ];

  const handleApplyPreset = (preset: string) => {
    setRemarkInput(preset);
  };

  const handleEndorseLog = (logToEndorse: DailyLog) => {
    const remark = remarkInput.trim() || 'Officially reviewed and endorsed by Principal.';

    const updatedLog: DailyLog = {
      ...logToEndorse,
      principalRemarks: remark,
      status: 'On_Time'
    };

    storageService.saveDailyLog(updatedLog, currentUser?.name || 'Principal Dr. Sunita Deshmukh');

    storageService.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser?.name || 'Principal Dr. Sunita Deshmukh',
      actorRole: 'principal',
      action: 'PRINCIPAL_REMARK_ADDED',
      details: `Officially endorsed Day ${logToEndorse.dayNumber} log: "${remark}"`,
      schoolId: school.id
    });

    setSavedNotice(`✓ Day ${logToEndorse.dayNumber} officially signed and endorsed in real-time!`);
    setRemarkInput('');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const totalDeliveredHours = logs.reduce((acc, l) => acc + (l.hoursTaught || 2.5), 0);
  const totalSamples = logs.reduce((acc, l) => acc + (l.samplesTestedCount || 0), 0);
  const totalFarmers = logs.reduce((acc, l) => acc + (l.farmersReachedCount || 0), 0);
  const endorsedLogsCount = logs.filter(l => Boolean(l.principalRemarks && l.principalRemarks.trim().length > 0)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Toast Alert */}
      {savedNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 🌟 HEADER: SIMPLE & REAL-TIME */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Real-Time Sync
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Connected to Faculty {school.facultyName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Principal Daily Log & Endorsements
            </h1>
            <p className="text-xs text-emerald-200/80">
              Real-time feed of classroom instructions, farm visits, and verified test ticket receipts.
            </p>
          </div>

          {/* Key Metric Pills */}
          <div className="flex items-center gap-2 text-center shrink-0">
            <div className="px-3.5 py-2 bg-white/10 rounded-2xl border border-white/10 min-w-[80px]">
              <span className="text-lg font-black text-white block">{endorsedLogsCount} / {logs.length}</span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Endorsed</span>
            </div>
            <div className="px-3.5 py-2 bg-white/10 rounded-2xl border border-white/10 min-w-[75px]">
              <span className="text-lg font-black text-white block">{totalDeliveredHours}h</span>
              <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">Hours</span>
            </div>
            <div className="px-3.5 py-2 bg-white/10 rounded-2xl border border-white/10 min-w-[80px]">
              <span className="text-lg font-black text-white block">{totalSamples}</span>
              <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Tests Done</span>
            </div>
            <div className="px-3.5 py-2 bg-white/10 rounded-2xl border border-white/10 min-w-[80px]">
              <span className="text-lg font-black text-white block">{totalFarmers}</span>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Farmers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 HERO CARD: ACTIVE DAY TO ENDORSE */}
      {activeLog ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Top Bar of Active Log */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                D{activeLog.dayNumber}
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Day {activeLog.dayNumber}: {activeLog.moduleTitle || `Module ${activeLog.moduleNumber}`}
                  </h2>
                  {activeLog.principalRemarks ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Officially Endorsed
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 flex items-center gap-1 animate-pulse">
                      Awaiting Your Endorsement
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {activeLog.date}
                  </span>
                  <span>•</span>
                  <span>Submitted by {activeLog.facultyName || school.facultyName}</span>
                </div>
              </div>
            </div>

            {/* Quick Numbers Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-black flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                {activeLog.samplesTestedCount || 0} Tests Done
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                {activeLog.farmersReachedCount || 0} Farmers Met
              </span>
            </div>
          </div>

          {/* Topics Covered & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Work Location:</span>
              <span className="font-medium">{activeLog.incidentNotes?.split('|')[0] || 'School Lab & Community Field'}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                Topics Covered:
              </span>
              {activeLog.topicsCovered && activeLog.topicsCovered.length > 0 ? (
                activeLog.topicsCovered.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                  >
                    ✓ {topic}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Classroom Soil Science Theory</span>
              )}
            </div>
          </div>

          {/* 📸 PHOTOS OF TODAY (INCLUDING TEST TICKET RECEIPT) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              Live Photo Proof from Faculty (Session & Printed Test Tickets 🧾)
            </label>

            {activeLog.photos && activeLog.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {activeLog.photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs group"
                  >
                    <img
                      src={photoUrl}
                      alt={`Day ${activeLog.dayNumber} photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                      {idx === 0 ? <Camera className="w-3 h-3 text-emerald-400" /> : <Receipt className="w-3 h-3 text-purple-400" />}
                      {idx === 0 ? 'Field Session' : idx === 1 ? 'Test Ticket Proof 🧾' : 'Farmer Advisory'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500">
                No photos attached for this day.
              </div>
            )}
          </div>

          {/* ✍️ OFFICIAL PRINCIPAL ENDORSEMENT BOX */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {activeLog.principalRemarks ? (
              /* Already Endorsed Banner */
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Officially Endorsed by Principal Dr. Sunita Deshmukh:
                  </span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 italic pl-6 font-medium">
                  "{activeLog.principalRemarks}"
                </p>
              </div>
            ) : (
              /* Pending Endorsement Form */
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
                    Sign & Endorse Day {activeLog.dayNumber} Update
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    1-Click Presets:
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {ENDORSEMENT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-700 cursor-pointer transition-all"
                    >
                      + {preset.split('.')[0]}
                    </button>
                  ))}
                </div>

                {/* Custom Remark Input */}
                <input
                  type="text"
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  placeholder="Enter endorsement remark or tap a preset above..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* 1-Click Endorse Button */}
                <button
                  type="button"
                  onClick={() => handleEndorseLog(activeLog)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Sign & Endorse Day {activeLog.dayNumber} Update in Real-Time
                </button>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-500 font-bold">
            No daily logs submitted yet.
          </p>
        </div>
      )}

      {/* 📅 CHRONOLOGICAL LOGS TIMELINE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          All Cohort Teaching Days ({logs.length} Days)
        </h3>

        <div className="space-y-2">
          {logs.map(log => {
            const isEndorsed = Boolean(log.principalRemarks && log.principalRemarks.trim().length > 0);
            const isSelected = activeLog?.id === log.id;

            return (
              <div
                key={log.id}
                onClick={() => setSelectedDayNumber(log.dayNumber)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                    D{log.dayNumber}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {log.moduleTitle || `Module ${log.moduleNumber}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {log.date} • {log.samplesTestedCount || 0} Tests • {log.farmersReachedCount || 0} Farmers
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEndorsed ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ Endorsed
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
