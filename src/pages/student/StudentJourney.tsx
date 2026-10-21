import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Compass, 
  Microscope, 
  BookOpen, 
  Languages, 
  Star,
  Film
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CertificateModal } from '../../components/certificate/CertificateModal';
import { VideoGallery } from '../../components/video/VideoGallery';
import { BhoomiMascot } from './components/BhoomiMascot';
import { SoilJourneyMap } from './components/SoilJourneyMap';
import { SoilDiagrams } from './components/SoilDiagrams';
import { VisualModulesView } from './components/VisualModulesView';
import { PlayfulBadgesView } from './components/PlayfulBadgesView';
import { CelebratoryCertificateView } from './components/CelebratoryCertificateView';
import { StudentBottomNav, StudentNavTab } from './components/StudentBottomNav';

export interface StudentJourneyProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const StudentJourney: React.FC<StudentJourneyProps> = ({
  currentTab = 'journey',
  onTabChange
}) => {
  const { activeStudentId, switchRole } = useAuth();
  const allStudents = storageService.getStudents();
  const student = storageService.getStudent(activeStudentId) || allStudents[0] || {
    id: 'SCH-01-STU-01',
    schoolId: 'SCH-01',
    name: 'Ananya Sharma',
    rollNo: 'SIL-2026-101',
    gender: 'Female',
    classGrade: 'X' as const,
    groupNumber: 1,
    avatar: '',
    selectionStage: 'Selected' as const,
    quizScore: 92,
    assignmentScore: 88,
    attendanceRate: 94,
    totalPresentDays: 19,
    totalLoggedDays: 20,
    modulesCompleted: 4,
    practicalsDone: 8,
    outreachFarmersCount: 52,
    soilSamplesTestedCount: 28,
    capstoneSubmitted: true,
    certificateStatus: 'Issued' as const,
    missingFields: [],
    badgeIds: ['badge-sampler', 'badge-tester', 'badge-reporter', 'badge-farmer-friend', 'badge-ambassador']
  };

  const handleStudentSelect = (newStudentId: string) => {
    switchRole('student', undefined, newStudentId);
  };

  // Bilingual Language State (English / Hindi)
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('arkashine_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('arkashine_lang', nextLang);
  };

  // Tab mapping
  const normalizeTab = (tab?: string): StudentNavTab => {
    if (!tab) return 'journey';
    if (tab === 'ecosystem' || tab === 'diagrams') return 'diagrams';
    if (['journey', 'videos', 'diagrams', 'modules', 'badges', 'certificate'].includes(tab)) {
      return tab as StudentNavTab;
    }
    return 'journey';
  };

  const [internalTab, setInternalTab] = useState<StudentNavTab>(normalizeTab(currentTab));
  const [showCertModal, setShowCertModal] = useState(false);

  const activeTab = currentTab ? normalizeTab(currentTab) : internalTab;

  const handleTabSelect = (tab: StudentNavTab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Student Gamified Level & XP Calculation
  const totalBadgesUnlocked = student.badgeIds.length;
  const currentXP = 250 + (student.soilSamplesTestedCount * 15) + (totalBadgesUnlocked * 100);

  const getStudentLevel = () => {
    if (student.modulesCompleted >= 4) {
      return {
        title: language === 'hi' ? 'महान वृक्ष मित्र 🌳' : 'Mighty Tree Partner 🌳',
        tag: 'Level 4',
        badgeColor: 'bg-emerald-500 text-white'
      };
    }
    if (student.modulesCompleted >= 2) {
      return {
        title: language === 'hi' ? 'मृदा रक्षक 🪴' : 'Soil Guardian 🪴',
        tag: 'Level 3',
        badgeColor: 'bg-teal-500 text-white'
      };
    }
    if (student.modulesCompleted >= 1) {
      return {
        title: language === 'hi' ? 'हरा अंकुर 🌱' : 'Green Sprout 🌱',
        tag: 'Level 2',
        badgeColor: 'bg-lime-600 text-white'
      };
    }
    return {
      title: language === 'hi' ? 'बीज खोजी 🌰' : 'Seed Explorer 🌰',
      tag: 'Level 1',
      badgeColor: 'bg-amber-600 text-white'
    };
  };

  const studentLevel = getStudentLevel();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-8 font-sans text-slate-800">
      {/* Top Playful Bar: Greeting, XP, Level and Language Switcher */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-5 sm:p-6 border-2 border-emerald-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0">
            🌱
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${studentLevel.badgeColor} shadow-2xs`}>
                {studentLevel.title}
              </span>
              <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs text-xs font-bold text-emerald-800">
                <span className="hidden sm:inline">Profile:</span>
                <select
                  value={student.id}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="bg-transparent font-bold text-emerald-900 cursor-pointer focus:outline-hidden"
                  aria-label="Switch active student"
                >
                  {allStudents.slice(0, 18).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Grp {s.groupNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? `नमस्ते, ${student.name.split(' ')[0]}!` : `Hello, ${student.name.split(' ')[0]}!`} 👋
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800 font-bold mt-0.5">
              {language === 'hi' ? 'आपकी मृदा स्वास्थ्य यात्रा' : 'Your Soil Health Journey'}
            </p>
          </div>
        </div>

        {/* Right Actions: XP Stars & Prominent Language Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* XP Pill */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-amber-200 shadow-2xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-black text-amber-600 tracking-wider">
                {language === 'hi' ? 'अनुभव अंक' : 'Total XP'}
              </div>
              <div className="text-sm font-black text-slate-900 leading-none">
                {currentXP} <span className="text-[10px] text-amber-500 font-bold">XP</span>
              </div>
            </div>
          </div>

          {/* Bilingual EN / हिंदी Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-emerald-400 hover:border-emerald-500 text-emerald-800 font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
            aria-label="Toggle language between English and Hindi"
          >
            <Languages className="w-4 h-4 text-emerald-600" />
            <span className={language === 'en' ? 'text-emerald-700 underline font-black' : 'text-slate-400 font-medium'}>
              EN
            </span>
            <span className="text-slate-300">/</span>
            <span className={language === 'hi' ? 'text-emerald-700 underline font-black' : 'text-slate-400 font-medium'}>
              हिंदी
            </span>
          </button>
        </div>
      </div>

      {/* Cheerful Bhoomi Mascot greeting & Voice tips */}
      <BhoomiMascot studentName={student.name} language={language} />

      {/* Desktop / Tablet Navigation Pills */}
      <div 
        role="tablist"
        aria-label="Student sections"
        className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs font-bold overflow-x-auto"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'journey'}
          onClick={() => handleTabSelect('journey')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'journey'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? '🌱 8-चरणीय सफ़र' : '🌱 8-Step Soil Trail'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'videos'}
          onClick={() => handleTabSelect('videos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Film className="w-4 h-4 text-purple-600" />
          <span>{language === 'hi' ? '🎬 वीडियो पाठ (6)' : '🎬 Animated Videos (6)'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'diagrams'}
          onClick={() => handleTabSelect('diagrams')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'diagrams'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Microscope className="w-4 h-4 text-sky-600" />
          <span>{language === 'hi' ? '🔬 मिट्टी अन्वेषक व आरेख' : '🔬 Soil Explorer Diagrams'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'modules'}
          onClick={() => handleTabSelect('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'modules'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>{language === 'hi' ? '📚 चित्र पाठ व क्विज़ (4)' : '📚 Visual Lessons & Quiz (4)'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'badges'}
          onClick={() => handleTabSelect('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'badges'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? `🏅 अर्जित बैज (${totalBadgesUnlocked})` : `🏅 Earned Badges (${totalBadgesUnlocked})`}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'certificate'}
          onClick={() => handleTabSelect('certificate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'certificate'
              ? 'bg-white text-emerald-800 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? '📜 मृदा मित्र प्रमाणपत्र' : '📜 Soil Partner Certificate'}</span>
        </button>
      </div>

      {/* Active Sub-View Area */}
      <div className="transition-all duration-200">
        {activeTab === 'journey' && (
          <SoilJourneyMap 
            language={language} 
            onExploreDiagrams={() => handleTabSelect('diagrams')} 
            onWatchVideos={() => handleTabSelect('videos')} 
          />
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <VideoGallery />
          </div>
        )}

        {activeTab === 'diagrams' && (
          <SoilDiagrams 
            language={language} 
            onStartModules={() => handleTabSelect('modules')} 
          />
        )}

        {activeTab === 'modules' && (
          <VisualModulesView 
            student={student} 
            language={language} 
          />
        )}

        {activeTab === 'badges' && (
          <PlayfulBadgesView 
            student={student} 
            language={language} 
          />
        )}

        {activeTab === 'certificate' && (
          <CelebratoryCertificateView 
            student={student} 
            language={language} 
            onOpenCertModal={() => setShowCertModal(true)} 
          />
        )}
      </div>

      {/* Mobile Sticky Bottom Navigation (Phones <768px, min 48px tap targets) */}
      <StudentBottomNav
        activeTab={activeTab}
        onTabChange={handleTabSelect}
        language={language}
      />

      {/* Full Certificate Modal (Opened when requested) */}
      {showCertModal && (
        <CertificateModal
          student={student}
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
