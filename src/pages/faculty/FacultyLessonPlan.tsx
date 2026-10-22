import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ClipboardCheck, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  Upload,
  Trash2,
  Sprout,
  FlaskConical,
  MapPin,
  Check,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';
import { DailyLog, SessionType } from '../../types';

export const FacultyLessonPlan: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const [searchParams, setSearchParams] = useSearchParams();
  const dayParam = searchParams.get('day');

  const currentCohortDay = school?.currentDay || 20;
  const initialDay = dayParam ? parseInt(dayParam) || currentCohortDay : currentCohortDay;
  const [selectedDay, setSelectedDay] = useState<number>(Math.min(28, Math.max(1, initialDay)));

  // Sync query param when day changes
  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSearchParams({ day: day.toString() });
  };

  // Selected Module (1 to 6)
  const defaultModule = selectedDay <= 5 ? 1 : Math.min(6, Math.ceil(selectedDay / 4.5));
  const [selectedModuleId, setSelectedModuleId] = useState<number>(defaultModule);
  
  // Session type & hours
  const [sessionType, setSessionType] = useState<SessionType>(selectedDay <= 5 ? 'Theory' : 'Practical');
  const [hoursTaught, setHoursTaught] = useState<number>(2.5);
  
  // Completed topics for selected module
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Daily Farmers visited & Soil tests done on this day
  const [farmersCount, setFarmersCount] = useState<number>(selectedDay <= 5 ? 0 : 15);
  const [testsCount, setTestsCount] = useState<number>(selectedDay <= 5 ? 0 : 12);
  const [villageName, setVillageName] = useState<string>('Malegaon Khurd');

  // Which Team did what (Teams 1-5)
  const [teamTasks, setTeamTasks] = useState<Record<number, string>>({
    1: 'Collected 15cm auger core samples in field plot',
    2: 'Calibrated SoiLENZ sensor & tested 12 prepared vials',
    3: 'Verified pH and electrical conductivity (EC) extraction',
    4: 'Generated and printed Soil Health Cards for farmers',
    5: 'Demonstrated organic fertilizer dosage to local farmers'
  });

  // Day Photos: Clicked/Uploaded pictures for this specific day
  const [dayPhotos, setDayPhotos] = useState<string[]>([
    '/assets/images/students-testing-soilenz-farm.png',
    '/assets/images/farmer-outreach.webp'
  ]);

  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Hidden inputs for camera capture & phone gallery
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Team badge styles for 5 teams
  const TEAM_STYLES: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: 'bg-emerald-100 dark:bg-emerald-950/70', text: 'text-emerald-800 dark:text-emerald-300', label: 'Team 1: Soil Sampling' },
    2: { bg: 'bg-indigo-100 dark:bg-indigo-950/70', text: 'text-indigo-800 dark:text-indigo-300', label: 'Team 2: SoiLENZ Machine' },
    3: { bg: 'bg-purple-100 dark:bg-purple-950/70', text: 'text-purple-800 dark:text-purple-300', label: 'Team 3: Chemical Reagents' },
    4: { bg: 'bg-amber-100 dark:bg-amber-950/70', text: 'text-amber-800 dark:text-amber-300', label: 'Team 4: Health Card Print' },
    5: { bg: 'bg-teal-100 dark:bg-teal-950/70', text: 'text-teal-800 dark:text-teal-300', label: 'Team 5: Farmer Outreach' }
  };

  // Quick Preset Photos for instant demo
  const PHOTO_PRESETS = [
    { label: 'Farm Soil Test', url: '/assets/images/students-testing-soilenz-farm.png' },
    { label: 'Farmer Outreach', url: '/assets/images/farmer-outreach.webp' },
    { label: 'SoiLENZ Device', url: '/assets/images/soilenz-real-device.png' },
    { label: 'Lab Discovery', url: '/assets/images/student-lab-discovery.webp' }
  ];

  // Load existing log for selected day whenever selectedDay changes
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
      setFarmersCount(existing.farmersReachedCount !== undefined ? existing.farmersReachedCount : (selectedDay <= 5 ? 0 : 15));
      setTestsCount(existing.samplesTestedCount !== undefined ? existing.samplesTestedCount : (selectedDay <= 5 ? 0 : 12));
      if (existing.photos && existing.photos.length > 0) {
        setDayPhotos(existing.photos);
      } else {
        setDayPhotos(selectedDay <= 5 ? ['/assets/images/module-agri-science.webp'] : ['/assets/images/students-testing-soilenz-farm.png']);
      }
    } else {
      // New / Unfilled Day
      const modNum = selectedDay <= 5 ? 1 : Math.min(6, Math.ceil(selectedDay / 4.5));
      setSelectedModuleId(modNum);
      setSessionType(selectedDay <= 5 ? 'Theory' : 'Practical');
      setFarmersCount(selectedDay <= 5 ? 0 : 15);
      setTestsCount(selectedDay <= 5 ? 0 : 12);
      setDayPhotos(selectedDay <= 5 ? ['/assets/images/module-agri-science.webp'] : ['/assets/images/students-testing-soilenz-farm.png']);
      
      const mod = CURRICULUM_MODULES.find(m => m.id === modNum);
      if (mod && mod.topics.length > 0) {
        setSelectedTopics([mod.topics[0].title]);
      }
    }
  }, [school?.id, selectedDay]);

  // Adjust defaults when module is manually changed
  useEffect(() => {
    const mod = CURRICULUM_MODULES.find(m => m.id === selectedModuleId);
    if (mod && mod.topics.length > 0 && selectedTopics.length === 0) {
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
        1: 'Collected 15cm auger core samples in field plot',
        2: 'Calibrated SoiLENZ sensor & tested 12 prepared vials',
        3: 'Verified pH and electrical conductivity (EC) extraction',
        4: 'Generated and printed Soil Health Cards for farmers',
        5: 'Demonstrated organic fertilizer dosage to local farmers'
      });
    }
  }, [selectedModuleId]);

  const activeModule = CURRICULUM_MODULES.find(m => m.id === selectedModuleId) || CURRICULUM_MODULES[0];

  const handleToggleTopic = (topicTitle: string) => {
    if (selectedTopics.includes(topicTitle)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicTitle));
    } else {
      setSelectedTopics([...selectedTopics, topicTitle]);
    }
  };

  // Camera Capture / Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDayPhotos(prev => [reader.result as string, ...prev]);
          setSubmittedNotice(`📸 Picture added for Day ${selectedDay}! Remember to submit below.`);
          setTimeout(() => setSubmittedNotice(null), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!dayPhotos.includes(url)) {
      setDayPhotos([url, ...dayPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setDayPhotos(dayPhotos.filter((_, i) => i !== index));
  };

  // Save & Submit Day Update to Principal
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
      samplesTestedCount: selectedModuleId === 1 ? 0 : Number(testsCount),
      farmersReachedCount: selectedModuleId === 1 ? 0 : Number(farmersCount),
      campaignsCount: farmersCount > 0 ? 1 : 0,
      stockUsed: selectedModuleId === 1 ? 'Classroom charts & soil jars' : 'Standard sensor reagents',
      photos: dayPhotos.length > 0 ? dayPhotos : ['/assets/images/students-testing-soilenz-farm.png'],
      incidentNotes: `Village: ${villageName} | Team Tasks: ${Object.entries(teamTasks).map(([t, task]) => `Team ${t}: ${task}`).join(' | ')}`,
      principalRemarks: existingLog?.principalRemarks,
      isLocked: false,
      submittedAt: new Date().toISOString()
    };

    storageService.saveDailyLog(logToSave, 'Dr. Anjali Patil');
    setSubmittedNotice(`✓ Day ${selectedDay} update with ${dayPhotos.length} photo(s) submitted to Principal Dr. Sunita Deshmukh!`);
    setTimeout(() => setSubmittedNotice(null), 4000);
  };

  // All logs for indicator dots
  const allLogs = storageService.getDailyLogs(school.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Toast Notice */}
      {submittedNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-2xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Hidden file inputs for Camera and Gallery */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-purple-800/40 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Day-Wise Teaching Log & Photos
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Day {selectedDay} Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Syncs to Principal
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1 max-w-xl">
                Daily update: click pictures of today's session, record farmers visited, soil tests done, topics taught, and submit directly to Principal Dr. Sunita Deshmukh.
              </p>
            </div>
          </div>

          {/* Quick Camera Action in Header */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98 self-start md:self-auto shrink-0"
          >
            <Camera className="w-4 h-4" />
            📸 Click Picture of Today
          </button>
        </div>

        {/* 28-DAY VISUAL SELECTOR CAROUSEL STRIP */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Select Day to Update (Days 1 to 28):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay <= 1}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-white">Day {selectedDay} of 28</span>
              <button
                type="button"
                onClick={() => handleSelectDay(Math.min(28, selectedDay + 1))}
                disabled={selectedDay >= 28}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal scrollable day strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
              const isSelected = selectedDay === day;
              const logForDay = allLogs.find(l => l.dayNumber === day);
              const isSubmitted = Boolean(logForDay?.submittedAt);
              const hasPhotos = Boolean(logForDay?.photos && logForDay.photos.length > 0);
              const isTheory = day <= 5;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md scale-105'
                      : isSubmitted
                        ? 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/5'
                  }`}
                >
                  <span>D{day}</span>
                  {hasPhotos && <Camera className="w-2.5 h-2.5 opacity-80" />}
                  {isSubmitted ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
                  )}
                  {isTheory && day === 1 && (
                    <span className="text-[9px] opacity-75 font-normal">Th</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAndSubmit} className="space-y-6">

        {/* SECTION 1: 📸 CLICK PICTURES & UPDATE FOR DAY X (HERO FEATURE) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  1. Pictures of Day {selectedDay} ({dayPhotos.length} Attached)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Required Proof
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Take pictures using your smartphone camera during the session with students & farmers.
              </p>
            </div>

            {/* Click & Upload Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-98"
              >
                <Camera className="w-3.5 h-3.5" />
                Click Picture (Camera)
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload from Gallery
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Quick Test Presets:</span>
            {PHOTO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPresetPhoto(p.url)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/40 cursor-pointer transition-all"
              >
                + {p.label}
              </button>
            ))}
          </div>

          {/* Live Photo Gallery of Day X */}
          {dayPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {dayPhotos.map((photoUrl, idx) => (
                <div 
                  key={idx} 
                  className="relative group rounded-2xl overflow-hidden h-36 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  <img
                    src={photoUrl}
                    alt={`Day ${selectedDay} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Photo Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    D{selectedDay} • #{idx + 1}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 cursor-pointer shadow-sm transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="text-[11px] font-bold block truncate">
                      Day {selectedDay} Live Proof
                    </span>
                    <span className="text-[9px] text-emerald-300 block">
                      ✓ Faculty Smartphone
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No pictures attached yet for Day {selectedDay}.
              </p>
              <p className="text-[11px] text-slate-400">
                Tap "Click Picture (Camera)" to take live field photos or pick from test presets above.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: FARMERS & SOIL TESTS OF DAY X */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              2. Farmers Visited & Soil Tests Conducted on Day {selectedDay}
            </h2>
            {selectedDay <= 5 ? (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300">
                Theory Phase (No field testing required)
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Field Phase Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Farmers Reached */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Farmers Met on Day {selectedDay}
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={farmersCount}
                onChange={(e) => setFarmersCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-black rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1.5">
                {[0, 5, 15, 25, 45].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setFarmersCount(cnt)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Tests Done */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                Soil Tests on SoiLENZ
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={testsCount}
                onChange={(e) => setTestsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-black rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1.5">
                {[0, 6, 12, 18, 24].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTestsCount(cnt)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Village Name */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Village / Plot Location
              </label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="e.g. Malegaon Khurd"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 block">
                Target: 1,000 farmers across 20 villages
              </span>
            </div>

          </div>
        </div>

        {/* SECTION 3: CURRICULUM MODULE & TOPICS COVERED */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              3. Curriculum Module & Topics Taught
            </h2>

            {/* Hours Taught Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-semibold pl-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Hours:
              </span>
              {[1.5, 2.0, 2.5, 3.0].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursTaught(hrs)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hoursTaught === hrs
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Module 1 to 6 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CURRICULUM_MODULES.map(m => {
              const isSelected = selectedModuleId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-600 shadow-lg shadow-purple-600/30 scale-[1.02] font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-wider uppercase opacity-80">
                      {m.code}
                    </span>
                    {m.id === 1 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 font-bold">
                        Theory
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold leading-tight my-1 line-clamp-2">
                    {m.title}
                  </span>
                  <span className="text-[9px] opacity-75 font-semibold">
                    12 Hours Total
                  </span>
                </button>
              );
            })}
          </div>

          {/* Module 1 Theory Notice */}
          {selectedModuleId === 1 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Theory Phase Active (Module 1 — Classroom Science):</span>
                Students master soil ecology, horizons, nutrient chemistry, and pH balance in class. Field sample testing on SoiLENZ and community farmer visits commence in Module 2.
              </div>
            </div>
          )}

          {/* Topics Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 block">
              Check off syllabus topics completed on Day {selectedDay}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeModule.topics.map(t => {
                const isChecked = selectedTopics.includes(t.title);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToggleTopic(t.title)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-950 dark:text-purple-100 font-semibold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg mt-0.5 border flex items-center justify-center shrink-0 transition-all ${
                      isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white dark:bg-slate-700'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
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

        {/* SECTION 4: WHICH STUDENT TEAM DID WHAT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              4. Student Team Assignments (Which Team Did What on Day {selectedDay})
            </h2>
            <span className="text-[11px] text-slate-400">
              5 Teams • 4 Students each (Total 20)
            </span>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(teamNum => {
              const style = TEAM_STYLES[teamNum];
              return (
                <div 
                  key={teamNum} 
                  className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-32 shrink-0 flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${style.bg} ${style.text}`}>
                      T{teamNum}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                        Team {teamNum}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {teamNum === 1 ? 'Sampling' : teamNum === 2 ? 'SoiLENZ' : teamNum === 3 ? 'Reagents' : teamNum === 4 ? 'Cards' : 'Outreach'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={teamTasks[teamNum] || ''}
                    onChange={(e) => setTeamTasks({ ...teamTasks, [teamNum]: e.target.value })}
                    placeholder={`Activity performed by Team ${teamNum}...`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: SUBMIT BUTTON TO PRINCIPAL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl border border-purple-800/40">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              Ready to submit Day {selectedDay} update?
            </h3>
            <p className="text-xs text-purple-200 mt-0.5">
              Includes {dayPhotos.length} photo proof(s), {farmersCount} farmers, and {testsCount} soil tests. Syncs immediately to Principal Dr. Sunita Deshmukh.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all cursor-pointer active:scale-98 shrink-0 flex items-center justify-center gap-2"
          >
            Submit Day {selectedDay} Log to Principal →
          </button>
        </div>

      </form>
    </div>
  );
};
