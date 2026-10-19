import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  Users, 
  FlaskConical, 
  Camera, 
  Save, 
  Send, 
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';
import { DailyLog, SessionType } from '../../types';

export const FacultyToday: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const students = storageService.getStudents(school.id);

  const currentDayNum = school.currentDay || 20;

  // Form State with Offline Draft Support
  const [selectedModule, setSelectedModule] = useState<number>(3);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Handling Sensor Drift & Triplicate Verification Protocol'
  ]);
  const [sessionType, setSessionType] = useState<SessionType>('Practical');
  const [hoursTaught, setHoursTaught] = useState<number>(2.5);
  const [delayReason, setDelayReason] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [samplesTested, setSamplesTested] = useState<number>(12);
  const [farmersReached, setFarmersReached] = useState<number>(18);
  const [stockUsed, setStockUsed] = useState<string>('18 filter papers, 120ml extractant, 20 gloves');
  const [incidentNotes, setIncidentNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>(['/assets/images/module-soil-testing.png']);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState<boolean>(false);

  // Initialize attendance with all present
  useEffect(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum) {
      if (draft.moduleNumber) setSelectedModule(draft.moduleNumber);
      if (draft.topicsCovered) setSelectedTopics(draft.topicsCovered);
      if (draft.sessionType) setSessionType(draft.sessionType);
      if (draft.hoursTaught !== undefined) setHoursTaught(draft.hoursTaught);
      if (draft.studentAttendance) setAttendance(draft.studentAttendance);
      if (draft.samplesTestedCount !== undefined) setSamplesTested(draft.samplesTestedCount);
      if (draft.farmersReachedCount !== undefined) setFarmersReached(draft.farmersReachedCount);
    } else {
      const initial: Record<string, 'present' | 'absent' | 'late'> = {};
      students.forEach(s => { initial[s.id] = 'present'; });
      setAttendance(initial);
    }
  }, [school.id, currentDayNum]);

  // Auto-save draft to local storage on edits
  const handleAutoSaveDraft = () => {
    storageService.saveDraftDailyLog({
      schoolId: school.id,
      dayNumber: currentDayNum,
      moduleNumber: selectedModule,
      topicsCovered: selectedTopics,
      sessionType,
      hoursTaught,
      studentAttendance: attendance,
      samplesTestedCount: samplesTested,
      farmersReachedCount: farmersReached,
      stockUsed,
      incidentNotes
    });
    setDraftSavedNotice(true);
    setTimeout(() => setDraftSavedNotice(false), 2000);
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'late') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleToggleAttendance = (stuId: string) => {
    const current = attendance[stuId] || 'present';
    const next = current === 'present' ? 'late' : (current === 'late' ? 'absent' : 'present');
    setAttendance(prev => ({ ...prev, [stuId]: next }));
  };

  const handleSubmitDailyUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const activeModObj = CURRICULUM_MODULES.find(m => m.id === selectedModule);

    const newLog: DailyLog = {
      id: `LOG-${school.id}-DAY-${String(currentDayNum).padStart(2, '0')}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentDayNum,
      facultyId: `FAC-${school.id}`,
      facultyName: school.facultyName,
      moduleNumber: selectedModule,
      moduleTitle: activeModObj?.title || 'Soil Testing using SoiLENZ Device',
      topicsCovered: selectedTopics.length > 0 ? selectedTopics : ['Practical Session Completed'],
      sessionType,
      hoursTaught,
      plannedHours: 2.5,
      isDelayed: !!delayReason,
      delayReason: delayReason || undefined,
      status: 'On_Time',
      studentAttendance: attendance,
      samplesTestedCount: samplesTested,
      farmersReachedCount: farmersReached,
      campaignsCount: sessionType === 'Field' ? 1 : 0,
      stockUsed,
      incidentNotes: incidentNotes || 'All safety and device calibration protocols observed.',
      photos,
      isLocked: false,
      submittedAt: new Date().toISOString()
    };

    storageService.saveDailyLog(newLog, currentUser.name);
    storageService.clearDraftDailyLog();

    setSuccessNotice(`Day ${currentDayNum} update successfully submitted! Heat map updated.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const currentModuleObj = CURRICULUM_MODULES.find(m => m.id === selectedModule);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Top Header Card (Optimized for phone browser) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Quick-Log Engine (&lt;3 Minutes)
            </span>
            {draftSavedNotice && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200 animate-pulse">
                Draft saved
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Day {currentDayNum} of 28 Daily Update
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {school.name} • Faculty: {school.facultyName}
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-emerald-700" />
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmitDailyUpdate} className="space-y-6">
        
        {/* Step 1: Module & Session Type (Big Touch Buttons) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-slate-500">
            1. Module & Session Format
          </h3>

          {/* Module selection pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CURRICULUM_MODULES.map(m => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setSelectedModule(m.id);
                  handleAutoSaveDraft();
                }}
                className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all min-h-[56px] flex flex-col justify-center ${
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

          {/* Session Type (Big Tap targets) */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">Session Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Theory', 'Practical', 'Field', 'Assessment'] as SessionType[]).map(st => (
                <button
                  type="button"
                  key={st}
                  onClick={() => {
                    setSessionType(st);
                    handleAutoSaveDraft();
                  }}
                  className={`py-3 rounded-xl text-xs font-bold transition-all text-center ${
                    sessionType === st
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Hours Taught (Large Stepper) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">Classroom / Lab Hours Taught</span>
              <span className="text-[11px] text-slate-400">Target: 2.5 hours daily (counts toward 72h total)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setHoursTaught(Math.max(0.5, hoursTaught - 0.5));
                  handleAutoSaveDraft();
                }}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-lg font-bold flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <span className="text-xl font-extrabold text-slate-900 w-12 text-center">
                {hoursTaught}h
              </span>
              <button
                type="button"
                onClick={() => {
                  setHoursTaught(Math.min(5.0, hoursTaught + 0.5));
                  handleAutoSaveDraft();
                }}
                className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-lg font-bold flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: One-Tap Student Attendance */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-slate-500">
                2. Student Attendance (1-Tap Toggle)
              </h3>
              <p className="text-xs text-slate-400">Tap any student card to toggle: Present → Late → Absent</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-semibold hover:bg-rose-100"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Student Grid (Big Touch Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
            {students.map(s => {
              const status = attendance[s.id] || 'present';
              const colorClass = status === 'present'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : (status === 'late' ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'bg-rose-50 border-rose-300 text-rose-950');

              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    handleToggleAttendance(s.id);
                    handleAutoSaveDraft();
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 min-h-[50px] ${colorClass}`}
                >
                  <div className="min-w-0 pr-1">
                    <p className="text-xs truncate">{s.name}</p>
                    <span className="text-[10px] opacity-75">T{s.groupNumber} • {s.rollNo}</span>
                  </div>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white/80 shrink-0">
                    {status[0].toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Soil Lab & Farmer Field Metrics */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-slate-500">
            3. Lab & Outreach Progress
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Soil Samples Tested Today (SoiLENZ)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={samplesTested}
                  onChange={(e) => {
                    setSamplesTested(Number(e.target.value));
                    handleAutoSaveDraft();
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Farmers Reached & Consulted Today
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={farmersReached}
                  onChange={(e) => {
                    setFarmersReached(Number(e.target.value));
                    handleAutoSaveDraft();
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-base font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Lab Reagents & Consumables Consumed</label>
            <input
              type="text"
              value={stockUsed}
              onChange={(e) => {
                setStockUsed(e.target.value);
                handleAutoSaveDraft();
              }}
              placeholder="e.g. 15 filter papers, 120ml extractant, 2 cuvettes"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Photo attach preview */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              Session Photo Upload (Max 3)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                <img src="/assets/images/module-soil-testing.png" alt="Upload preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-slate-500">
                <p className="font-semibold text-slate-800">1 photo ready</p>
                <p className="text-[11px] text-slate-400">Mobile camera upload verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button (Big Touch Target) */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all min-h-[52px]"
          >
            <Send className="w-4 h-4" />
            Submit Day {currentDayNum} Daily Update
          </button>
        </div>

      </form>

    </div>
  );
};
