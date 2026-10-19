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
  Clock, 
  Sparkles, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SOIL_JOURNEY_STEPS, SYSTEM_BADGES, CURRICULUM_MODULES } from '../../data/modulesData';
import { CertificateModal } from '../../components/certificate/CertificateModal';

export const StudentJourney: React.FC = () => {
  const { activeStudentId } = useAuth();
  const student = storageService.getStudent(activeStudentId) || storageService.getStudents()[0];
  const school = storageService.getSchool(student.schoolId);
  const [activeTab, setActiveTab] = useState<'journey' | 'modules' | 'badges' | 'certificate'>('journey');
  const [showCertModal, setShowCertModal] = useState(false);

  // Journey step icons mapping
  const stepIcons: Record<string, any> = {
    Compass, Filter, Cpu, Database, BarChart3, Activity, FileCheck, Leaf
  };

  const isCertReady = student.certificateStatus === 'Issued' || student.certificateStatus === 'Eligible';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Friendly Welcome Clean Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Welcome back, {student.name.split(' ')[0]}! 🌱
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              Group {student.groupNumber} Lead
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Soil Health Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Every soil sample you collect, scan with SoiLENZ, and advise to local farmers restores vital earth ecosystems and boosts agricultural harvest.
          </p>
        </div>

        {/* Celebration illustration preview */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs shrink-0 bg-emerald-50">
          <img
            src="/assets/images/certificate-celebration.png"
            alt="Celebrating student achievement"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'journey' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          8-Step Soil Journey Path
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'modules' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Curriculum Modules (4)
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'badges' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Earned Badges ({student.badgeIds.length})
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'certificate' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Soil Partner Certificate
        </button>
      </div>

      {/* Tab 1: 8-Step Soil Journey */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              The 8-Step Precision Soil Testing Workflow
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Track your hands-on mastery as you advance from auger extraction in rural fields to farmer advisory.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOIL_JOURNEY_STEPS.map((st, idx) => {
                const IconComponent = stepIcons[st.iconName] || Leaf;
                const isStepUnlocked = idx < 6; // First 6 unlocked in active cohort

                return (
                  <div
                    key={st.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isStepUnlocked
                        ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                          {st.step}
                        </span>
                        {isStepUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mastered
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">Locked</span>
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 mb-3 shadow-2xs">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                      <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">{st.tagline}</p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Curriculum Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRICULUM_MODULES.map(mod => {
              const isDone = mod.id <= student.modulesCompleted;
              return (
                <div
                  key={mod.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {mod.code} • 18 Hours
                        </span>
                        <h4 className="font-bold text-base text-slate-900 mt-0.5">{mod.title}</h4>
                        <p className="text-xs text-emerald-800 font-semibold mt-0.5">{mod.subtitle}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{mod.description}</p>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
                        Key Learning Units:
                      </span>
                      {mod.topics.map(t => (
                        <div key={t.id} className="flex justify-between text-slate-600">
                          <span className="truncate pr-2">• {t.title}</span>
                          <span className="font-mono text-slate-400 shrink-0">{t.theoryHours + t.practicalHours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Assessment: {mod.assessmentType}</span>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isDone ? 'Passed (88%)' : 'In Progress'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Badges */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Earned Achievement Badges
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Badges awarded upon completing precision sampling thresholds and community outreach impact.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYSTEM_BADGES.map(badge => {
              const isUnlocked = student.badgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs">
                      🏆
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{badge.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        {isUnlocked ? 'Unlocked' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Certificate Preview & Download */}
      {activeTab === 'certificate' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center space-y-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Soil Partner Completion Certificate
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Issued under the National Soil Innovation Mandate by Arkashine Innovations Pvt. Ltd.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 my-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Attendance Bar (≥80%):</span>
                <span className="font-bold text-emerald-700">{student.attendanceRate}% (Passed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modules Completed:</span>
                <span className="font-bold text-slate-800">{student.modulesCompleted} of 4 Modules</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SoiLENZ Handheld Scans:</span>
                <span className="font-bold text-slate-800">{student.soilSamplesTestedCount} Tests Logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer Advisory Completed:</span>
                <span className="font-bold text-slate-800">{student.outreachFarmersCount} Farmers</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Preview Official Branded Certificate & QR
            </button>
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
