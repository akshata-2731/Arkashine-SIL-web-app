import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';
import { DailyLog, SessionType } from '../../types';

export const FacultyLessonPlan: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const currentCohortDay = school?.currentDay || 20;
  const [selectedDay, setSelectedDay] = useState<number>(currentCohortDay);
  
  // Selected Module (1 to 6)
  const defaultModule = Math.min(6, Math.ceil(selectedDay / 4.5));
  const [selectedModuleId, setSelectedModuleId] = useState<number>(defaultModule);
  
  // Session type
  const [sessionType, setSessionType] = useState<SessionType>(selectedModuleId === 1 ? 'Theory' : 'Practical');
  const [hoursTaught, setHoursTaught] = useState<number>(2.5);
  
  // Completed topics for selected module
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Which Team did what (Teams 1-5)
  const [teamTasks, setTeamTasks] = useState<Record<number, string>>({
    1: 'Collected 15cm auger core samples in Malegaon plot',
    2: 'Calibrated SoiLENZ sensor & tested 12 prepared vials',
    3: 'Verified pH and electrical conductivity (EC) extraction',
    4: 'Generated and printed 12 Soil Health Cards for farmers',
    5: 'Demonstrated organic fertilizer dosage to 15 local farmers'
  });

  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // When module changes, adjust defaults
  useEffect(() => {
    const mod = CURRICULUM_MODULES.find(m => m.id === selectedModuleId);
    if (mod && mod.topics.length > 0) {
      setSelectedTopics([mod.topics[0].title]);
    }
    if (selectedModuleId === 1) {
      setSessionType('Theory');
      setTeamTasks({
        1: 'Classroom soil texture ribbon test (sand vs clay)',
        2: 'Microscope examination of living earthworm humus',
        3: 'N-P-K macronutrient poster preparation & diagram',
        4: 'Classroom soil pH paper demonstration',
        5: 'Farmer questionnaire & survey form planning'
      });
    } else {
      setSessionType('Practical');
      setTeamTasks({
        1: 'Collected 15cm auger core samples in Malegaon plot',
        2: 'Calibrated SoiLENZ sensor & tested 12 prepared vials',
        3: 'Verified pH and electrical conductivity (EC) extraction',
        4: 'Generated and printed 12 Soil Health Cards for farmers',
        5: 'Demonstrated organic fertilizer dosage to 15 local farmers'
      });
    }
  }, [selectedModuleId]);

  // Load existing log for selected day if available
  useEffect(() => {
    if (!school) return;
    const existing = storageService.getDailyLog(school.id, selectedDay);
    if (existing) {
      setSelectedModuleId(existing.moduleNumber || defaultModule);
      if (existing.sessionType) setSessionType(existing.sessionType);
      if (existing.hoursTaught) setHoursTaught(existing.hoursTaught);
      if (existing.topicsCovered && existing.topicsCovered.length > 0) {
        setSelectedTopics(existing.topicsCovered);
      }
    }
  }, [school?.id, selectedDay]);

  const activeModule = CURRICULUM_MODULES.find(m => m.id === selectedModuleId) || CURRICULUM_MODULES[0];

  const handleToggleTopic = (topicTitle: string) => {
    if (selectedTopics.includes(topicTitle)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicTitle));
    } else {
      setSelectedTopics([...selectedTopics, topicTitle]);
    }
  };

  const handleSaveAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    const existingLog = storageService.getDailyLog(school.id, selectedDay);

    const logToSave: DailyLog = {
      id: existingLog?.id || `LOG-${school.id}-D${selectedDay}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      dayNumber: selectedDay,
      facultyId: currentUser?.id || 'USR-FAC-01',
      facultyName: 'Dr. Anjali Patil',
      moduleNumber: selectedModuleId,
      moduleTitle: `Module ${selectedModuleId}: ${activeModule.title}`,
      topicsCovered: selectedTopics.length > 0 ? selectedTopics : [activeModule.topics[0]?.title || 'Daily Lesson'],
      sessionType,
      hoursTaught,
      plannedHours: 2.5,
      isDelayed: false,
      status: 'On_Time',
      studentAttendance: existingLog?.studentAttendance || {},
      samplesTestedCount: selectedModuleId === 1 ? 0 : (existingLog?.samplesTestedCount || 12),
      farmersReachedCount: selectedModuleId === 1 ? 0 : (existingLog?.farmersReachedCount || 15),
      campaignsCount: existingLog?.campaignsCount || 1,
      stockUsed: selectedModuleId === 1 ? 'Classroom charts & soil jars' : 'Standard sensor reagents',
      photos: existingLog?.photos || ['/assets/images/module-soil-testing.png'],
      incidentNotes: `Team Tasks: ${Object.entries(teamTasks).map(([t, task]) => `Team ${t}: ${task}`).join(' | ')}`,
      principalRemarks: existingLog?.principalRemarks,
      isLocked: false,
      submittedAt: new Date().toISOString()
    };

    storageService.saveDailyLog(logToSave, 'Dr. Anjali Patil');
    setSubmittedNotice(`✓ Day ${selectedDay} teaching update successfully submitted to Principal Dr. Sunita Deshmukh!`);
    setTimeout(() => setSubmittedNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Toast Notice */}
      {submittedNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-2xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Lesson Plan & Daily Teaching Log
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                Syncs to Principal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record curriculum progress, hours taught, and team activity for the School Principal.
            </p>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
            disabled={selectedDay <= 1}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
            Day {selectedDay} of 28
          </span>
          <button
            onClick={() => setSelectedDay(Math.min(28, selectedDay + 1))}
            disabled={selectedDay >= 28}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAndSubmit} className="space-y-6">

        {/* Section 1: Module Selector (1 to 6) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              1. Select Module Covered Today
            </h2>
            {selectedModuleId === 1 ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                📖 Classroom Theory Phase
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                🔬 Hands-on Lab & Field Phase
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CURRICULUM_MODULES.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModuleId(m.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[80px] ${
                  selectedModuleId === m.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase opacity-80">
                  {m.code}
                </span>
                <span className="text-xs font-bold leading-tight my-1 line-clamp-2">
                  {m.title}
                </span>
                <span className="text-[9px] opacity-75 font-semibold">
                  12 Hours Allocated
                </span>
              </button>
            ))}
          </div>

          {/* Module 1 Theory Notice */}
          {selectedModuleId === 1 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Theory Phase Active:</span> Module 1 focuses on classroom soil science, horizons, and ecological concepts. Field tests and farmer outreach commence in Module 2 after optical sensor calibration.
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Lesson Plan Topics & Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              2. Lesson Topics Covered & Class Hours
            </h2>

            {/* Hours Taught Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Hours Taught:</span>
              {[1.5, 2.0, 2.5, 3.0].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursTaught(hrs)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hoursTaught === hrs
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Topics Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              Check off topics completed from Module {selectedModuleId} lesson plan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeModule.topics.map(t => {
                const isChecked = selectedTopics.includes(t.title);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToggleTopic(t.title)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-950 dark:text-purple-100 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md mt-0.5 border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white dark:bg-slate-700'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{t.title}</span>
                      <span className="text-[11px] opacity-75">{t.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Which Student Team Did What */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            3. Student Team Assignments (Which Team Did What)
          </h2>

          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map(teamNum => (
              <div 
                key={teamNum} 
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                    T{teamNum}
                  </span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Team {teamNum}
                  </span>
                </div>

                <input
                  type="text"
                  value={teamTasks[teamNum] || ''}
                  onChange={(e) => setTeamTasks({ ...teamTasks, [teamNum]: e.target.value })}
                  placeholder={`Activity performed by Team ${teamNum}...`}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Submit Button */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Ready to submit today's update?
            </h3>
            <p className="text-xs text-purple-200 mt-0.5">
              Syncs immediately to Principal Dr. Sunita Deshmukh's endorsement dashboard.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-98"
          >
            Submit Log to Principal →
          </button>
        </div>

      </form>
    </div>
  );
};
