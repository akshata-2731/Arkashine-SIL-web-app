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
  CheckCircle2, 
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
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
  const [villageName, setVillageName] = useState<string>('Malegaon Khurd');

  // 2. Module & Topics
  const defaultModule = selectedDay <= 5 ? 1 : Math.min(6, Math.ceil(selectedDay / 4.5));
  const [selectedModuleId, setSelectedModuleId] = useState<number>(defaultModule);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');

  // 3. Tests & Farmers (Can be 0 if theory or sampling only)
  const [testsCount, setTestsCount] = useState<number>(selectedDay <= 5 ? 0 : 12);
  const [farmersCount, setFarmersCount] = useState<number>(selectedDay <= 5 ? 0 : 15);

  // 4. Photos (2 to 3 photos max: Session photo, Test ticket photo, Farmer meet)
  const [photos, setPhotos] = useState<string[]>([
    '/assets/images/students-testing-soilenz-farm.png',
    '/assets/images/soilenz-real-device.png'
  ]);

  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setCustomNote(existing.incidentNotes.replace(/Village:.*\| Team Tasks:.*| Malegaon.*/g, '').trim());
      }
    } else {
      // New day defaults
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

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (photos.length >= 3) {
            setPhotos([reader.result as string, photos[0], photos[1]]);
          } else {
            setPhotos([...photos, reader.result as string]);
          }
          setToastNotice('📸 Photo added!');
          setTimeout(() => setToastNotice(null), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  // Submit
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

  const existingLog = storageService.getDailyLog(school.id, selectedDay);
  const isSubmitted = Boolean(existingLog?.submittedAt);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xl border border-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Hidden Camera Input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 1. DATE & DAY PICKER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleDayChange(Math.max(1, selectedDay - 1))}
          disabled={selectedDay <= 1}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 disabled:opacity-30 cursor-pointer transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Day {selectedDay} of 28
            </h1>
            {isSubmitted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ✓ Sent
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Draft
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleDayChange(Math.min(28, selectedDay + 1))}
          disabled={selectedDay >= 28}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 disabled:opacity-30 cursor-pointer transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN SIMPLE CARD */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        
        {/* QUESTION 1: WHERE DID THEY VISIT TODAY? */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            1. Where did students work today?
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setLocationType('lab'); setFarmersCount(0); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                locationType === 'lab'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🏫 School Science Lab
            </button>

            <button
              type="button"
              onClick={() => setLocationType('field')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                locationType === 'field'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🌾 Farm / Village Visit
            </button>
          </div>

          {locationType === 'field' && (
            <input
              type="text"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              placeholder="Enter village or plot name (e.g. Malegaon Khurd)..."
              className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          )}
        </div>

        {/* QUESTION 2: WHICH MODULE & TOPICS COVERED? */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>📖</span>
              2. Module & Topics Covered Today
            </label>
            {selectedModuleId === 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Theory Phase (Classroom)
              </span>
            )}
          </div>

          {/* Module Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CURRICULUM_MODULES.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setSelectedModuleId(m.id); setSelectedTopics([]); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-all ${
                  selectedModuleId === m.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                M{m.id}: {m.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Simply Tick Topics (Option 3) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-400">Tap to tick topics completed today:</span>
            <div className="flex flex-wrap gap-1.5">
              {activeModule.topics.map(t => {
                const isTicked = selectedTopics.includes(t.title);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTopic(t.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isTicked
                        ? 'bg-purple-100 text-purple-900 border border-purple-400 dark:bg-purple-950 dark:text-purple-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {isTicked ? <Check className="w-3.5 h-3.5 text-purple-700" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                    <span>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Add any extra note or observation (optional)..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
          />
        </div>

        {/* QUESTION 3: HOW MANY TESTS & FARMERS TODAY? */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            3. Tests & Farmers Visited Today
          </label>
          <span className="text-[11px] text-slate-400 block -mt-1">
            (If it was a Theory class or sample collection only, keep Tests as 0)
          </span>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Soil Tests Done */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                🧪 Soil Tests Done
              </span>
              <input
                type="number"
                min="0"
                value={testsCount}
                onChange={(e) => setTestsCount(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-lg font-black rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1">
                {[0, 6, 12, 18].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTestsCount(num)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Farmers Met */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                🌾 Farmers Met
              </span>
              <input
                type="number"
                min="0"
                value={farmersCount}
                onChange={(e) => setFarmersCount(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-lg font-black rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1">
                {[0, 5, 15, 25].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFarmersCount(num)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION 4: PHOTOS (2 TO 3 PHOTOS: SESSION & TEST TICKET) */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              4. Photos (2–3 Photos: Session & Printed Test Ticket)
            </label>
            <span className="text-[11px] text-slate-400">
              {photos.length} / 3 photos
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((photoUrl, idx) => (
              <div 
                key={idx} 
                className="relative h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group"
              >
                <img
                  src={photoUrl}
                  alt={`Session photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 cursor-pointer transition-all"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] font-bold">
                  {idx === 0 ? 'Session' : idx === 1 ? 'Ticket 🧾' : 'Outreach'}
                </span>
              </div>
            ))}

            {photos.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-bold">Add Photo</span>
                <span className="text-[8px] text-slate-400">(Camera / File)</span>
              </button>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Send Day {selectedDay} Update to Principal
          </button>
        </div>

      </form>

    </div>
  );
};
