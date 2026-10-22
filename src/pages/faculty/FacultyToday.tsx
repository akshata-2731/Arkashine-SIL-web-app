import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Send,
  AlertTriangle,
  Calendar,
  Sparkles,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';
import { DailyLog, SessionType } from '../../types';
import { computeDailyLogStatus } from '../../utils/statusUtils';
import { getNextAttendanceStatus } from '../../utils/attendanceUtils';
import { ModuleFormatSection } from './components/ModuleFormatSection';
import { StudentAttendanceSection } from './components/StudentAttendanceSection';
import { LabProgressSection } from './components/LabProgressSection';
import { useT } from '../../i18n/useT';

export const FacultyToday: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const { t } = useT();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const students = storageService.getStudents(school.id);

  const currentDayNum = school.currentDay || 1;
  const defaultModule = Math.min(4, Math.max(1, Math.ceil(currentDayNum / 7)));
  const defaultModuleObj = CURRICULUM_MODULES.find(m => m.id === defaultModule);
  const defaultTopics = defaultModuleObj?.topics[0] ? [defaultModuleObj.topics[0].title] : [];

  // Form State with Offline Draft Support
  const [selectedModule, setSelectedModule] = useState<number>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.moduleNumber) {
      return draft.moduleNumber;
    }
    return defaultModule;
  });

  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.topicsCovered) {
      return draft.topicsCovered;
    }
    return defaultTopics;
  });

  const [learningDescription, setLearningDescription] = useState<string>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.learningDescription) {
      return draft.learningDescription;
    }
    return '';
  });

  const [sessionType, setSessionType] = useState<SessionType>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.sessionType) {
      return draft.sessionType;
    }
    return 'Practical';
  });

  const [hoursTaught, setHoursTaught] = useState<number>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.hoursTaught !== undefined) {
      return draft.hoursTaught;
    }
    return 2.5;
  });

  const [delayReason, setDelayReason] = useState<string>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.delayReason) {
      return draft.delayReason;
    }
    return '';
  });

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.studentAttendance) {
      return draft.studentAttendance;
    }
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => { initial[s.id] = 'present'; });
    return initial;
  });

  const [samplesTested, setSamplesTested] = useState<number>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.samplesTestedCount !== undefined) {
      return draft.samplesTestedCount;
    }
    return 0;
  });

  const [farmersReached, setFarmersReached] = useState<number>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.farmersReachedCount !== undefined) {
      return draft.farmersReachedCount;
    }
    return 0;
  });

  const [stockUsed, setStockUsed] = useState<string>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.stockUsed !== undefined) {
      return draft.stockUsed;
    }
    return '';
  });

  const [incidentNotes, setIncidentNotes] = useState<string>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.incidentNotes !== undefined) {
      return draft.incidentNotes;
    }
    return '';
  });

  const [photos, setPhotos] = useState<string[]>(() => {
    const draft = storageService.getDraftDailyLog();
    if (draft && draft.schoolId === school.id && draft.dayNumber === currentDayNum && draft.photos) {
      return draft.photos;
    }
    return [];
  });

  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState<boolean>(false);

  // Form Validation
  const errors = useMemo(() => {
    const errs: {
      hoursTaught?: string;
      delayReason?: string;
      attendance?: string;
      samplesTested?: string;
      farmersReached?: string;
    } = {};

    if (isNaN(hoursTaught) || hoursTaught <= 0) {
      errs.hoursTaught = 'Hours taught must be greater than 0.';
    } else if (hoursTaught > 12) {
      errs.hoursTaught = 'Hours taught cannot exceed 12 hours in a single day.';
    }

    if (hoursTaught < 1.5 && (!delayReason || delayReason.trim().length < 5)) {
      errs.delayReason = 'Please explain the reason for reduced hours (min 5 characters).';
    }

    const presentCount = Object.values(attendance).filter(st => st === 'present' || st === 'late').length;
    if (presentCount > students.length) {
      errs.attendance = 'Present student count cannot exceed total enrolled students.';
    }

    if (samplesTested < 0 || !Number.isInteger(samplesTested)) {
      errs.samplesTested = 'Samples tested cannot be negative and must be a whole number.';
    } else if (samplesTested > 200) {
      errs.samplesTested = 'Samples tested cannot exceed 200 per day.';
    }

    if (farmersReached < 0 || !Number.isInteger(farmersReached)) {
      errs.farmersReached = 'Farmers reached cannot be negative and must be a whole number.';
    } else if (farmersReached > 200) {
      errs.farmersReached = 'Farmers reached cannot exceed 200 per day.';
    }

    return errs;
  }, [hoursTaught, delayReason, attendance, students.length, samplesTested, farmersReached]);

  const isValid = Object.keys(errors).length === 0;

  // Debounced autosave effect (500 ms)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      storageService.saveDraftDailyLog({
        schoolId: school.id,
        dayNumber: currentDayNum,
        moduleNumber: selectedModule,
        topicsCovered: selectedTopics,
        learningDescription,
        sessionType,
        hoursTaught,
        delayReason: delayReason.trim() || undefined,
        studentAttendance: attendance,
        samplesTestedCount: samplesTested,
        farmersReachedCount: farmersReached,
        stockUsed,
        incidentNotes,
        photos
      });
      setDraftSavedNotice(true);
      const hideTimer = setTimeout(() => setDraftSavedNotice(false), 2000);
      return () => clearTimeout(hideTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    school.id,
    currentDayNum,
    selectedModule,
    selectedTopics,
    learningDescription,
    sessionType,
    hoursTaught,
    delayReason,
    attendance,
    samplesTested,
    farmersReached,
    stockUsed,
    incidentNotes,
    photos
  ]);

  const handleMarkAll = (status: 'present' | 'absent' | 'late') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleToggleAttendance = (stuId: string) => {
    setAttendance(prev => ({
      ...prev,
      [stuId]: getNextAttendanceStatus(prev[stuId])
    }));
  };

  const handleAddSamplePhoto = () => {
    if (photos.length < 3) {
      setPhotos(prev => [...prev, '/assets/images/module-soil-testing.png']);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectModule = (moduleId: number) => {
    setSelectedModule(moduleId);
    const mod = CURRICULUM_MODULES.find(m => m.id === moduleId);
    if (mod?.topics[0]) {
      setSelectedTopics([mod.topics[0].title]);
    }
  };

  const handleToggleTopic = (topicTitle: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicTitle)
        ? (prev.length > 1 ? prev.filter(tItem => tItem !== topicTitle) : prev)
        : [...prev, topicTitle]
    );
  };

  const handleSubmitDailyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const activeModObj = CURRICULUM_MODULES.find(m => m.id === selectedModule);

    const calculatedStatus = computeDailyLogStatus({
      submissionTime: new Date(),
      dayNumber: currentDayNum,
      schoolCurrentDay: school.currentDay || 1,
      hoursTaught,
      plannedHours: 2.5,
      isDelayed: !!delayReason.trim()
    });

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
      learningDescription: learningDescription.trim() || undefined,
      sessionType,
      hoursTaught,
      plannedHours: 2.5,
      isDelayed: !!delayReason.trim(),
      delayReason: delayReason.trim() || undefined,
      status: calculatedStatus,
      studentAttendance: attendance,
      samplesTestedCount: samplesTested,
      farmersReachedCount: farmersReached,
      campaignsCount: sessionType === 'Field' ? 1 : 0,
      stockUsed,
      incidentNotes: incidentNotes.trim() || undefined,
      photos,
      isLocked: false,
      submittedAt: new Date().toISOString()
    };

    storageService.saveDailyLog(newLog, currentUser.name);
    storageService.clearDraftDailyLog();

    // Confetti celebration
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setSuccessNotice(`Day ${currentDayNum} update submitted (${calculatedStatus.replace('_', ' ')})! Attendance and heat map updated.`);
    setTimeout(() => setSuccessNotice(null), 6000);
  };

  const programPct = Math.round((currentDayNum / 28) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Stylish Header Card with Program Progress Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Daily Log Engine • 72-Hour Curriculum</span>
              </span>
              {draftSavedNotice && (
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200 animate-pulse">
                  {t('log.saved_draft', 'Auto-saved')}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Day {currentDayNum} of 28 Daily Faculty Log</span>
              <span className="text-sm font-semibold text-slate-500 hidden sm:inline">({school.code})</span>
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              {school.name} • Faculty Coordinator: <strong className="text-slate-700">{school.facultyName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Day {currentDayNum} / 28</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#5C26C0]/10 border border-[#5C26C0]/20 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5 text-[#5C26C0]" />
            </div>
          </div>
        </div>

        {/* 28-day Progress Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>SIL 28-Day Milestone Journey</span>
            <span className="text-emerald-700 font-extrabold">{programPct}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div 
              style={{ width: `${programPct}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#5C26C0] rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-3xl text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-3 animate-in fade-in shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold">{successNotice}</p>
            <p className="text-[11px] text-emerald-800 font-medium">Student attendance statistics and school timeline updated in real-time.</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmitDailyUpdate} className="space-y-6">
        <ModuleFormatSection
          selectedModule={selectedModule}
          onSelectModule={handleSelectModule}
          selectedTopics={selectedTopics}
          onToggleTopic={handleToggleTopic}
          learningDescription={learningDescription}
          onLearningDescriptionChange={setLearningDescription}
          sessionType={sessionType}
          onSelectSessionType={setSessionType}
          hoursTaught={hoursTaught}
          onHoursChange={setHoursTaught}
          delayReason={delayReason}
          onDelayReasonChange={setDelayReason}
          errors={{
            hoursTaught: errors.hoursTaught,
            delayReason: errors.delayReason
          }}
        />

        <StudentAttendanceSection
          students={students}
          attendance={attendance}
          onToggleAttendance={handleToggleAttendance}
          onMarkAll={handleMarkAll}
          error={errors.attendance}
        />

        <LabProgressSection
          samplesTested={samplesTested}
          onSamplesChange={setSamplesTested}
          farmersReached={farmersReached}
          onFarmersChange={setFarmersReached}
          stockUsed={stockUsed}
          onStockChange={setStockUsed}
          incidentNotes={incidentNotes}
          onIncidentNotesChange={setIncidentNotes}
          photos={photos}
          onAddPhoto={handleAddSamplePhoto}
          onRemovePhoto={handleRemovePhoto}
          errors={{
            samplesTested: errors.samplesTested,
            farmersReached: errors.farmersReached
          }}
        />

        {/* Validation Errors Notice */}
        {!isValid && (
          <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>Please resolve form errors before submitting: {Object.values(errors).join(' ')}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition-all min-h-[54px] cursor-pointer ${
              isValid
                ? 'bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t('log.submit_btn', `Submit Day ${currentDayNum} Daily Log & Update Attendance`)}</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </form>
    </div>
  );
};
