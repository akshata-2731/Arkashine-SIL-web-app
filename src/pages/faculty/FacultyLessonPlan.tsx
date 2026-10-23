import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Check, 
  MapPin, 
  FlaskConical, 
  Users, 
  CheckCircle2, 
  X,
  Plus,
  Sparkles,
  Receipt,
  Building2,
  Tractor,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService, useDailyLogs } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';
import { DailyLog } from '../../types';

export const FacultyLessonPlan: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const [searchParams, setSearchParams] = useSearchParams();
  const dayParam = searchParams.get('day');

  const currentCohortDay = school?.currentDay || 20;
  const initialDay = dayParam ? parseInt(dayParam) || currentCohortDay : currentCohortDay;
  const [selectedDay, setSelectedDay] = useState<number>(Math.min(28, Math.max(1, initialDay)));

  // Navigation between days
  const handleDayChange = (newDay: number) => {
    setSelectedDay(newDay);
    setSearchParams({ day: newDay.toString() });
  };

  // 1. Where they visited
  const [locationType, setLocationType] = useState<'lab' | 'field'>('field');
  const [villageName, setVillageName] = useState<string>('Malegaon Khurd Plot B');

  // 2. Module & Topics
  const defaultModule = selectedDay <= 5 ? 1 : Math.min(6, Math.ceil(selectedDay / 4.5));
  const [selectedModuleId, setSelectedModuleId] = useState<number>(defaultModule);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');

  // 3. Tests & Farmers (Can be 0 if theory or sampling only)
  const [testsCount, setTestsCount] = useState<number>(selectedDay <= 5 ? 0 : 12);
  const [farmersCount, setFarmersCount] = useState<number>(selectedDay <= 5 ? 0 : 15);

  // 4. Photos (Slot 1: Session, Slot 2: Ticket Receipt, Slot 3: Farmer Meet)
  const [photos, setPhotos] = useState<string[]>([
    '/assets/images/students-testing-soilenz-farm.png',
    '/assets/images/soilenz-real-device.png'
  ]);

  const [activePhotoSlot, setActivePhotoSlot] = useState<number | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Module color schemes
  const MODULE_COLORS: Record<number, { bg: string; border: string; text: string; gradient: string }> = {
    1: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-800 dark:text-amber-300', gradient: 'from-amber-500 to-orange-500' },
    2: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-800 dark:text-emerald-300', gradient: 'from-emerald-500 to-teal-500' },
    3: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-800 dark:text-purple-300', gradient: 'from-purple-500 to-indigo-600' },
    4: { bg: 'bg-sky-500/10 dark:bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-800 dark:text-sky-300', gradient: 'from-sky-500 to-blue-600' },
    5: { bg: 'bg-teal-500/10 dark:bg-teal-500/20', border: 'border-teal-400', text: 'text-teal-800 dark:text-teal-300', gradient: 'from-teal-500 to-emerald-600' },
    6: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', border: 'border-indigo-400', text: 'text-indigo-800 dark:text-indigo-300', gradient: 'from-indigo-500 to-purple-600' }
  };

  // Load existing log when day changes
  useEffect(() => {
    if (!school) return;
    const existing = storageService.getDailyLog(school.id, selectedDay);
    if (existing) {
      setSelectedModuleId(existing.moduleNumber || defaultModule);
      if (existing.topicsCovered && existing.topicsCovered.length > 0) {
        setSelectedTopics(existing.topicsCovered);
      }
      setTestsCount(existing.samplesTestedCount || 0);
      setFarmersCount(existing.farmersReachedCount || 0);
      if (existing.photos && existing.photos.length > 0) {
        setPhotos(existing.photos.slice(0, 3));
      } else {
        setPhotos(selectedDay <= 5 ? ['/assets/images/module-agri-science.webp'] : ['/assets/images/students-testing-soilenz-farm.png']);
      }
      if (existing.incidentNotes) {
        setCustomNote(existing.incidentNotes.replace(/Location:.*\| Note: /g, '').trim());
      }
    } else {
      const modNum = selectedDay <= 5 ? 1 : Math.min(6, Math.ceil(selectedDay / 4.5));
      setSelectedModuleId(modNum);
      const mod = CURRICULUM_MODULES.find(m => m.id === modNum);
      if (mod && mod.topics.length > 0) {
        setSelectedTopics([mod.topics[0].title]);
      }
      setTestsCount(selectedDay <= 5 ? 0 : 12);
      setFarmersCount(selectedDay <= 5 ? 0 : 15);
      setPhotos(selectedDay <= 5 ? ['/assets/images/module-agri-science.webp'] : ['/assets/images/students-testing-soilenz-farm.png']);
      setCustomNote('');
    }
  }, [school?.id, selectedDay]);

  const activeModule = CURRICULUM_MODULES.find(m => m.id === selectedModuleId) || CURRICULUM_MODULES[0];

  // Toggle topic
  const toggleTopic = (title: string) => {
    if (selectedTopics.includes(title)) {
      setSelectedTopics(selectedTopics.filter(t => t !== title));
    } else {
      setSelectedTopics([...selectedTopics, title]);
    }
  };

  // Trigger camera for slot
  const handleSlotClick = (slotIndex: number) => {
    setActivePhotoSlot(slotIndex);
    fileInputRef.current?.click();
  };

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newPhotos = [...photos];
          if (activePhotoSlot !== null && activePhotoSlot < newPhotos.length) {
            newPhotos[activePhotoSlot] = reader.result as string;
          } else {
            newPhotos.push(reader.result as string);
          }
          setPhotos(newPhotos.slice(0, 3));
          setToastNotice('📸 Photo captured & attached!');
          setTimeout(() => setToastNotice(null), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  // Submit to Principal
  const handleSubmit = (e: React.FormEvent) => {
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
      topicsCovered: selectedTopics.length > 0 ? selectedTopics : [activeModule.topics[0]?.title || 'Daily Teaching'],
      sessionType: testsCount > 0 ? 'Practical' : 'Theory',
      hoursTaught: 2.5,
      plannedHours: 2.5,
      isDelayed: false,
      status: 'On_Time',
      studentAttendance: existingLog?.studentAttendance || {},
      samplesTestedCount: Number(testsCount),
      farmersReachedCount: Number(farmersCount),
      campaignsCount: farmersCount > 0 ? 1 : 0,
      stockUsed: testsCount > 0 ? 'Standard reagents & sensor vial' : 'Classroom charts',
      photos: photos.length > 0 ? photos : ['/assets/images/students-testing-soilenz-farm.png'],
      incidentNotes: `Location: ${locationType === 'lab' ? 'School Lab' : villageName} | Note: ${customNote}`,
      principalRemarks: existingLog?.principalRemarks,
      isLocked: false,
      submittedAt: new Date().toISOString()
    };

    storageService.saveDailyLog(logToSave, 'Dr. Anjali Patil');
    setToastNotice(`✓ Day ${selectedDay} update successfully sent to Principal!`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Real-time hook for daily logs
  const allLogs = useDailyLogs(school?.id);
  const existingLog = allLogs.find(l => l.dayNumber === selectedDay);
  const isSubmitted = Boolean(existingLog?.submittedAt);
  const isEndorsed = Boolean(existingLog?.principalRemarks && existingLog.principalRemarks.trim().length > 0);
  const isTheoryDay = selectedDay <= 5;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Hidden Native Camera Input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 🌟 HERO DAY PICKER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-5 sm:p-6 border border-purple-800/40 shadow-xl">
        <div className="relative z-10 flex items-center justify-between gap-4">
          
          {/* Previous Day Arrow */}
          <button
            type="button"
            onClick={() => handleDayChange(Math.max(1, selectedDay - 1))}
            disabled={selectedDay <= 1}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center disabled:opacity-20 cursor-pointer transition-all border border-white/10 shadow-sm shrink-0"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center Day Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-white tracking-wide uppercase">
                Daily Teaching Log
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[11px] text-purple-200">
                Cohort Day {selectedDay} / 28
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Day {selectedDay}
              </h1>
              {isEndorsed ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Principal Endorsed ✓
                </span>
              ) : isSubmitted ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" /> Sent to Principal
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Draft Pending
                </span>
              )}
            </div>

            {isEndorsed && existingLog?.principalRemarks && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 text-xs shadow-sm">
                <span className="font-bold text-emerald-300">Principal Endorsement:</span>
                <span className="italic">"{existingLog.principalRemarks}"</span>
              </div>
            )}

            <p className="text-xs text-purple-200/80 mt-1 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Next Day Arrow */}
          <button
            type="button"
            onClick={() => handleDayChange(Math.min(28, selectedDay + 1))}
            disabled={selectedDay >= 28}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center disabled:opacity-20 cursor-pointer transition-all border border-white/10 shadow-sm shrink-0"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mini 28-Day Timeline Dots */}
        <div className="relative z-10 flex items-center justify-center gap-1 mt-4 pt-3 border-t border-white/10">
          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayChange(day)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                day === selectedDay
                  ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md shadow-emerald-400/50'
                  : day < selectedDay
                    ? 'w-1.5 bg-emerald-500/70 hover:w-2'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Go to Day ${day}`}
            />
          ))}
        </div>
      </div>

      {/* 📋 MAIN INTERACTIVE CARD FORM */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-6">
        
        {/* STEP 1: WHERE DID STUDENTS WORK TODAY? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
              1
            </span>
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              Where did students work today?
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* School Lab Option */}
            <button
              type="button"
              onClick={() => { setLocationType('lab'); setFarmersCount(0); }}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                locationType === 'lab'
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                locationType === 'lab' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs block text-slate-900 dark:text-white">
                  School Lab
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Indoor experiments
                </span>
              </div>
            </button>

            {/* Farm / Field Option */}
            <button
              type="button"
              onClick={() => setLocationType('field')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                locationType === 'field'
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                locationType === 'field' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs block text-slate-900 dark:text-white">
                  Farm & Field
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Village farmer visits
                </span>
              </div>
            </button>
          </div>

          {locationType === 'field' && (
            <div className="relative mt-2 animate-in fade-in">
              <MapPin className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="Village / Farm Name (e.g. Malegaon Khurd Plot B)..."
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        {/* STEP 2: MODULE & TOPICS COVERED */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                2
              </span>
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                Module & Topics Covered
              </label>
            </div>
            {isTheoryDay && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                📖 Module 1 Theory Phase
              </span>
            )}
          </div>

          {/* Module Selector Ribbon */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CURRICULUM_MODULES.map(m => {
              const isSelected = selectedModuleId === m.id;
              const color = MODULE_COLORS[m.id] || MODULE_COLORS[1];
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setSelectedModuleId(m.id); setSelectedTopics([]); }}
                  className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? `bg-gradient-to-r ${color.gradient} text-white font-black shadow-md scale-102`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-black uppercase">
                    M{m.id}
                  </span>
                  <span className="text-[9px] truncate max-w-full font-bold opacity-90">
                    {m.id === 1 ? 'Theory' : m.id === 2 ? 'Sampling' : m.id === 3 ? 'Testing' : m.id === 4 ? 'Cards' : m.id === 5 ? 'Outreach' : 'Capstone'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tap-to-Tick Topics */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold block">
              Tap topics completed today:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeModule.topics.map(t => {
                const isTicked = selectedTopics.includes(t.title);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTopic(t.title)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-98 ${
                      isTicked
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-102 ring-2 ring-purple-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isTicked ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-400" />
                    )}
                    <span>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note Box */}
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Add an extra note or observation (optional)..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* STEP 3: TODAY'S TESTS & FARMERS (VIBRANT JEWEL STATS) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                3
              </span>
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                Tests & Farmers Visited Today
              </label>
            </div>
            <span className="text-[11px] text-slate-400">
              (Set to 0 if Theory class or Sampling only)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Soil Tests Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-md border border-purple-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-purple-300 tracking-wider">
                  Soil Tests Done
                </span>
                <FlaskConical className="w-4 h-4 text-purple-300" />
              </div>

              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  min="0"
                  value={testsCount}
                  onChange={(e) => setTestsCount(parseInt(e.target.value) || 0)}
                  className="w-20 bg-transparent text-3xl font-black text-white focus:outline-none border-b border-purple-500/40 pb-0.5"
                />
                <span className="text-xs text-purple-200 font-semibold">Tests</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {[0, 6, 12, 18].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTestsCount(num)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-white cursor-pointer transition-all"
                  >
                    {num === 0 ? '0 (Theory)' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Farmers Reached Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-md border border-emerald-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider">
                  Farmers Met
                </span>
                <Users className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  min="0"
                  value={farmersCount}
                  onChange={(e) => setFarmersCount(parseInt(e.target.value) || 0)}
                  className="w-20 bg-transparent text-3xl font-black text-white focus:outline-none border-b border-emerald-500/40 pb-0.5"
                />
                <span className="text-xs text-emerald-200 font-semibold">Farmers</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {[0, 5, 15, 25].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFarmersCount(num)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-white cursor-pointer transition-all"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* STEP 4: 2–3 PHOTOS (THE VISUAL HERO: SESSION & PRINTED TEST TICKET) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                4
              </span>
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                Photos (Session & Printed Test Ticket 🧾)
              </label>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              {photos.length} of 3 photos
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            
            {/* Slot 1: Session Photo */}
            <div
              onClick={() => handleSlotClick(0)}
              className="relative h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group cursor-pointer hover:border-emerald-500 transition-all shadow-sm"
            >
              {photos[0] ? (
                <>
                  <img
                    src={photos[0]}
                    alt="Session photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <button
                    type="button"
                    onClick={(e) => removePhoto(0, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    Session Photo
                  </span>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-2 text-slate-400 group-hover:text-emerald-600">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">1. Session Photo</span>
                  <span className="text-[8px] text-slate-400">Click to Snap</span>
                </div>
              )}
            </div>

            {/* Slot 2: Test Ticket Receipt (Key Requirement) */}
            <div
              onClick={() => handleSlotClick(1)}
              className="relative h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group cursor-pointer hover:border-purple-500 transition-all shadow-sm"
            >
              {photos[1] ? (
                <>
                  <img
                    src={photos[1]}
                    alt="Test ticket proof"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/soilenz-real-device.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <button
                    type="button"
                    onClick={(e) => removePhoto(1, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                    <Receipt className="w-3 h-3 text-purple-400" />
                    Test Ticket 🧾
                  </span>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-2 text-slate-400 group-hover:text-purple-600">
                  <Receipt className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">2. Test Ticket 🧾</span>
                  <span className="text-[8px] text-slate-400">Printed Slip Proof</span>
                </div>
              )}
            </div>

            {/* Slot 3: Farmer / Group Outreach */}
            <div
              onClick={() => handleSlotClick(2)}
              className="relative h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group cursor-pointer hover:border-amber-500 transition-all shadow-sm"
            >
              {photos[2] ? (
                <>
                  <img
                    src={photos[2]}
                    alt="Outreach photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/farmer-outreach.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <button
                    type="button"
                    onClick={(e) => removePhoto(2, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Farmer Meet
                  </span>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-2 text-slate-400 group-hover:text-amber-600">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">3. Extra Photo</span>
                  <span className="text-[8px] text-slate-400">Farmer / Team</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 🚀 VIBRANT SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Day {selectedDay} Update to Principal Dr. Sunita Deshmukh →
          </button>
        </div>

      </form>

    </div>
  );
};
