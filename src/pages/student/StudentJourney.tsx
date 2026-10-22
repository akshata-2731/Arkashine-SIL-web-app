import React, { useState } from 'react';
import { 
  Compass, 
  Filter, 
  Cpu, 
  Database, 
  BarChart3, 
  Activity, 
  FileCheck, 
  Leaf, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  X,
  Eye,
  ChevronRight,
  Layers,
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SOIL_JOURNEY_STEPS, CURRICULUM_MODULES, JourneyStep, CurriculumModule } from '../../data/modulesData';
import { CertificateModal } from '../../components/certificate/CertificateModal';
import { ScientificSoilLab } from '../../components/interactive/ScientificSoilLab';
import { SoilDoctorQuiz } from '../../components/interactive/SoilDoctorQuiz';
import { VideoGallery } from '../../components/video/VideoGallery';
import { Student } from '../../types';

interface StudentJourneyProps {
  initialTab?: 'journey' | 'videos' | 'lab' | 'modules' | 'quiz' | 'certificate';
  currentTab?: 'journey' | 'videos' | 'lab' | 'modules' | 'quiz' | 'certificate';
  onTabChange?: (tab: string) => void;
}

const fallbackStudent: Student = {
  id: 'STU-DEMO-001',
  schoolId: 'SCH-DEMO-001',
  name: 'Aradhya Sharma',
  rollNo: 'SIL-2026-001',
  gender: 'Female',
  classGrade: 'X',
  groupNumber: 1,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  selectionStage: 'Selected',
  quizScore: 94,
  assignmentScore: 92,
  attendanceRate: 95,
  totalPresentDays: 21,
  totalLoggedDays: 22,
  modulesCompleted: 4,
  practicalsDone: 8,
  outreachFarmersCount: 6,
  soilSamplesTestedCount: 14,
  capstoneSubmitted: true,
  certificateStatus: 'Issued',
  missingFields: [],
  badgeIds: ['badge_soil_explorer', 'badge_lab_pro', 'badge_farmer_friend', 'badge_data_master'],
  certificateId: 'SIL-2026-XAV-001',
  verifiedQrHash: 'hash-sil-aradhya-2026'
};

export const StudentJourney: React.FC<StudentJourneyProps> = ({ initialTab, currentTab, onTabChange }) => {
  const { activeStudentId } = useAuth();
  const allStudents = storageService.getStudents();
  const student: Student = (activeStudentId ? storageService.getStudent(activeStudentId) : null) 
    || (allStudents && allStudents.length > 0 ? allStudents[0] : null) 
    || fallbackStudent;
    
  const effectiveTab = currentTab || initialTab || 'journey';
  const [activeTab, setActiveTabState] = useState<'journey' | 'videos' | 'lab' | 'modules' | 'quiz' | 'certificate'>(
    effectiveTab
  );
  const [readingModule, setReadingModule] = useState<CurriculumModule | null>(null);

  const [selectedStepModal, setSelectedStepModal] = useState<JourneyStep | null>(null);

  React.useEffect(() => {
    const target = currentTab || initialTab;
    if (target && ['journey', 'videos', 'lab', 'modules', 'quiz', 'certificate'].includes(target)) {
      setActiveTabState(target);
    }
  }, [currentTab, initialTab]);

  const setActiveTab = (t: 'journey' | 'videos' | 'lab' | 'modules' | 'quiz' | 'certificate') => {
    setActiveTabState(t);
    if (onTabChange) onTabChange(t);
  };
  const [showCertModal, setShowCertModal] = useState(false);

  // Real prerequisites check for certification
  const [quizScore, setQuizScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkashine_quiz_score');
      return saved ? parseInt(saved, 10) : 80;
    } catch {
      return 80;
    }
  });

  const [isQuizPassed, setIsQuizPassed] = useState<boolean>(() => {
    try {
      const passed = localStorage.getItem('arkashine_quiz_passed');
      return passed === 'true' || quizScore >= 80;
    } catch {
      return true;
    }
  });

  const [watchedVideosCount, setWatchedVideosCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arkashine_watched_videos');
      return saved ? JSON.parse(saved).length : 6;
    } catch {
      return 6;
    }
  });

  // Re-read on tab change
  React.useEffect(() => {
    try {
      const qScore = localStorage.getItem('arkashine_quiz_score');
      if (qScore) setQuizScore(parseInt(qScore, 10));
      const qPass = localStorage.getItem('arkashine_quiz_passed');
      if (qPass) setIsQuizPassed(qPass === 'true');
      const vWatched = localStorage.getItem('arkashine_watched_videos');
      if (vWatched) setWatchedVideosCount(JSON.parse(vWatched).length);
    } catch {}
  }, [activeTab]);

  const isVideosComplete = watchedVideosCount >= 6;
  const isCertFullyUnlocked = isQuizPassed && isVideosComplete;

  // Journey step icons mapping
  const stepIcons: Record<string, any> = {
    Compass, Filter, Cpu, Database, BarChart3, Activity, FileCheck, Leaf
  };

  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Navigation Pills (Ordered: Journey -> Videos -> Lab/pH -> Study Modules (6) -> Quiz -> Certificate) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'journey' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🌱 8-Step Soil Journey
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'videos' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🎬 Learning Videos
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lab' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🔬 Why Soil Testing Matters & pH
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'modules' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📚 Study Modules (6)
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🩺 Soil Doctor Quiz
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'certificate' ? 'btn-theme-primary shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Certificate
        </button>
      </div>

      {/* Tab 1: 8-Step Soil Journey (Creative Visual First Screen) */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          
          {/* Creative Hello Hero Banner with Students Collecting Soil in Farm */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1b253b] to-[#0f382c] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="max-w-xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
                    🌱 Welcome back, {student.name ? student.name.split(' ')[0] : 'Aradhya'}!
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-xs">
                    Group {student.groupNumber || 1} Lead (Soil Explorers)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Hands-on Soil Testing Journey
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  From taking precision 15cm auger cuts in rural fields to advising local farmers with SoiLENZ test cards.
                </p>

                {/* 3 Pictorial Quick Metrics */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10 text-center">
                    <span className="text-base sm:text-lg font-black text-emerald-400 block">
                      {student.soilSamplesTestedCount || 14}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">Field Samples</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10 text-center">
                    <span className="text-base sm:text-lg font-black text-purple-300 block">
                      12 Scans
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">SoiLENZ Tests</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10 text-center">
                    <span className="text-base sm:text-lg font-black text-amber-300 block">
                      {student.outreachFarmersCount || 6} Farms
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">Farmers Advised</span>
                  </div>
                </div>
              </div>

              {/* High-Resolution Picture of Students Testing with the SoiLENZ Machine on the Farm */}
              <div className="w-full sm:w-80 lg:w-96 shrink-0 group">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-950 aspect-[4/3]">
                  <img
                    src="/assets/images/students-testing-soilenz-farm.png"
                    alt="Students on the farm testing soil with the SoiLENZ machine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/soilenz-real-device.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Photo Caption Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="font-bold flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/20">
                      🔬 Students Testing with SoiLENZ on Farm
                    </span>
                    <span className="text-[10px] bg-emerald-600/90 font-extrabold px-2 py-0.5 rounded-lg text-white">
                      Live SoiLENZ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Pill Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#5C26C0]" />
                Arkashine Slide 17 Standard Flow:
              </span>
              <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
                01 COLLECT → 02 PREPARE → 03 TEST → 04 RECORD → 05 ANALYZE → 06 INTERPRET → 07 REPORT → 08 APPLY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('lab')}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5C26C0] hover:bg-purple-100 font-bold border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" /> Why Test Soil & pH
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                🎬 Watch Learning Videos
              </button>
            </div>
          </div>

          {/* 8 Pictorial Steps Grid (Images for each step showing students in farm & lab) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <span className="badge-theme text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 border">
                The 8 Scientific Steps (Arkashine Standard)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                How Students Conduct the Soil Test
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every soil sample follows this 8-step workflow from farm field auger sampling to delivering farmer health cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOIL_JOURNEY_STEPS.map((st, idx) => {
                const IconComponent = stepIcons[st.iconName] || Leaf;
                const isStepUnlocked = idx < 6; // First 6 unlocked in active cohort

                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStepModal(st)}
                    className="group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top Image Preview Showing Students at Work */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                      <img
                        src={st.image}
                        alt={st.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/images/module-soil-testing.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Step Stage & Number Overlay */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-amber-300 border border-white/20">
                          {st.pptStage}
                        </span>
                      </div>

                      {/* Status Chip */}
                      <div className="absolute top-2 right-2">
                        {isStepUnlocked ? (
                          <span className="text-[10px] font-bold text-white bg-emerald-600/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-white/80 bg-slate-800/80 px-2 py-0.5 rounded-md">
                            Next Up
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Title */}
                      <div className="absolute bottom-2 left-2.5 right-2.5">
                        <span className="text-[11px] font-bold text-white drop-shadow-sm truncate block">
                          {st.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#5C26C0] border border-purple-200 flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#5C26C0] transition-colors leading-tight">
                            {st.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                          {st.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#5C26C0]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> View Technique
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seedling to Canopy Graphic Reminder */}
          <div className="bg-gradient-to-r from-emerald-50 via-purple-50 to-amber-50 rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex-1">
              <span className="badge-theme text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5 border">
                Visual Soil Cycle 🌿
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                From Tiny Seeds to Giant Trees!
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Healthy soil nutrients (N-P-K & pH) directly feed plant roots, empowering farmers to produce abundant harvests.
              </p>
            </div>
            <div className="w-full md:w-56 h-32 rounded-2xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
              <img
                src="/assets/images/seedling-sprout-journey.png"
                alt="Seedling sprout journey"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      )}

      {/* Tab: Learning Videos Hub (Direct video gallery without extra scroll or headers) */}
      {activeTab === 'videos' && (
        <div>
          <VideoGallery />
        </div>
      )}

      {/* Tab: Scientific Soil Physiology & pH Lab */}
      {activeTab === 'lab' && (
        <ScientificSoilLab onNavigateToModules={() => setActiveTab('modules')} />
      )}

      {/* Tab 3: Detailed Study Materials (6 Comprehensive Modules) */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 bg-purple-50 text-[#5C26C0] border border-purple-200">
                  National Curriculum Standard • 72 Training Hours
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Curriculum Study Materials (6 Modules)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any module card below to read the comprehensive study guide, scientific theories, and hands-on lab protocols.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  6 Modules • 12h Each
                </span>
              </div>
            </div>

            {/* 6 Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CURRICULUM_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setReadingModule(mod)}
                  className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-white"
                >
                  <div>
                    {/* Module Image Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                      <img
                        src={mod.image}
                        alt={mod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/images/module-agri-science.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-amber-300 border border-white/20">
                          {mod.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600/90 text-white">
                          {mod.allocatedHours} Hours
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2.5 right-2.5">
                        <span className="text-[11px] font-bold text-white drop-shadow-sm truncate block">
                          {mod.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#5C26C0] transition-colors leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Key Learning Units Chips */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Key Units:
                        </span>
                        {mod.topics.slice(0, 3).map((t) => (
                          <div key={t.id} className="text-[11px] text-slate-600 truncate flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5C26C0]" />
                            <span className="truncate">{t.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setReadingModule(mod)}
                      className="w-full py-2 rounded-xl bg-purple-50 group-hover:bg-[#5C26C0] text-[#5C26C0] group-hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Study Material in Detail</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Banner to Proceed to Soil Doctor Quiz */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-emerald-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Ready to Test Your Scientific Knowledge? 🩺
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Now that you have reviewed the study modules, take the Soil Doctor Quiz (≥80% required) to qualify for your certificate.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('quiz')}
                className="px-6 py-3 rounded-xl btn-theme-primary font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Proceed to Soil Doctor Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Soil Doctor Quiz (Placed strictly after study modules!) */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <SoilDoctorQuiz
            onQuizPassed={(scorePct) => {
              setQuizScore(scorePct);
              setIsQuizPassed(scorePct >= 80);
            }}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        </div>
      )}

      {/* Tab 5: Soil Partner Certificate (Last tab - Badges removed) */}
      {activeTab === 'certificate' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
              isCertFullyUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border inline-block mb-1.5 ${
                isCertFullyUnlocked 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isCertFullyUnlocked ? '🎉 100% Certified Soil Partner Qualification Met' : '🔒 Certificate Locked (Prerequisites Pending)'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Soil Partner Completion Certificate
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Issued under the National Soil Innovation Mandate by Arkashine Innovations Pvt. Ltd.
              </p>
            </div>

            {/* Prerequisites Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Prerequisite 1: All Videos Watched */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isVideosComplete ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">Prerequisite 1:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isVideosComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isVideosComplete ? '✓ Completed' : `${watchedVideosCount}/6 Watched`}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">Watch All Learning Videos</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Must watch all 6 animated science explainers.
                </p>
                {!isVideosComplete && (
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="mt-2.5 text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    Watch Videos Now →
                  </button>
                )}
              </div>

              {/* Prerequisite 2: Quiz Score >= 80% */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isQuizPassed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">Prerequisite 2:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isQuizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isQuizPassed ? `✓ Score: ${quizScore}% (≥80%)` : `Score: ${quizScore}% (<80%)`}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">Pass Soil Doctor Quiz</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Must score ≥80% (at least 4 of 5 correct).
                </p>
                {!isQuizPassed && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="mt-2.5 text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                  >
                    Take Quiz Now →
                  </button>
                )}
              </div>
            </div>

            {/* Additional Standards */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Attendance Bar (≥80%):</span>
                <span className="font-bold text-emerald-700">{student.attendanceRate || 95}% (Passed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Curriculum Units Covered:</span>
                <span className="font-bold text-slate-800">6 of 6 Modules (72 Hours)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SoiLENZ Handheld Scans:</span>
                <span className="font-bold text-slate-800">{student.soilSamplesTestedCount || 14} Tests Logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer Advisory Completed:</span>
                <span className="font-bold text-slate-800">{student.outreachFarmersCount || 6} Farmers Advised</span>
              </div>
            </div>

            {/* Final Action Button */}
            {isCertFullyUnlocked ? (
              <button
                onClick={() => setShowCertModal(true)}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Preview Official Branded Certificate & QR</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-center gap-2">
                <span>🔒 Certificate Locked: Please complete all 6 videos and score ≥80% on the Quiz to qualify.</span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Comprehensive Module Reading Modal */}
      {readingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 shrink-0">
              <img
                src={readingModule.image}
                alt={readingModule.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <button
                onClick={() => setReadingModule(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    {readingModule.code} • {readingModule.allocatedHours} Hours
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    {readingModule.assessmentType}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {readingModule.title}
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  {readingModule.subtitle}
                </p>
              </div>
            </div>

            {/* Scrollable Reader Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
              {/* Theory Summary */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-1">
                  Scientific Core Theory
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                  {readingModule.theorySummary}
                </p>
              </div>

              {/* Expected Learning Outcomes */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Expected Learning Outcomes:
                </span>
                <div className="space-y-1.5">
                  {readingModule.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Units & Key Concepts Breakdown */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Curriculum Units & Key Concepts:
                </span>
                <div className="space-y-2.5">
                  {readingModule.topics.map((t) => (
                    <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-slate-900">{t.id} {t.title}</h5>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {t.theoryHours}h Theory + {t.practicalHours}h Lab
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{t.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {t.keyConcepts.map((k, kIdx) => (
                          <span key={kIdx} className="text-[9px] font-semibold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            #{k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hands-on Lab & Field Activities */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Hands-on Lab & Field Protocols:
                </span>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                  {readingModule.handsOnLabActivities.map((act, actIdx) => (
                    <div key={actIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {actIdx + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => setReadingModule(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Close Reader
              </button>

              <button
                onClick={() => {
                  setReadingModule(null);
                  setActiveTab('quiz');
                }}
                className="px-5 py-2 rounded-xl btn-theme-primary font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Take Soil Doctor Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Interactive Step Technique Modal */}
      {selectedStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <img
                src={selectedStepModal.image}
                alt={selectedStepModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setSelectedStepModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 inline-block mb-1">
                  {selectedStepModal.pptStage} • Step {selectedStepModal.step}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {selectedStepModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body: How Students Do This */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Scientific Field Protocol (Slide 16 & 17):
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedStepModal.description}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2">
                <span className="font-extrabold text-slate-900 block">
                  Student Action Checklist:
                </span>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Follow proper safety & sample handling guidelines.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ensure 0-15cm depth & composite mixing in shade.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accurately log numbers to generate farmer advisory.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStepModal(null)}
                className="w-full py-2.5 rounded-xl btn-theme-primary font-bold text-xs shadow-xs cursor-pointer"
              >
                Got It! Back to Journey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          student={student}
          isOpen={true}
          onClose={() => setShowCertModal(false)}
        />
      )}

    </div>
  );
};
