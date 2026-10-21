import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  ShieldCheck, 
  UserCheck, 
  Clock,
  Plus
} from 'lucide-react';
import { School, SchoolStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { StatusChip } from '../../components/common/StatusChip';
import { ScoreRing } from '../../components/common/ScoreRing';
import { EligibilityModal } from '../../components/school/EligibilityModal';
import { SchoolTimelineModal } from '../../components/heatmap/SchoolTimelineModal';

interface ArkashineSchoolsProps {
  onOpenDayHistory: (schoolId: string, day: number) => void;
}

export const ArkashineSchools: React.FC<ArkashineSchoolsProps> = ({ onOpenDayHistory }) => {
  const [schools, setSchools] = useState<School[]>(storageService.getSchools());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolForEligibility, setSelectedSchoolForEligibility] = useState<School | null>(null);
  const [selectedSchoolForTimeline, setSelectedSchoolForTimeline] = useState<string | null>(null);

  const refreshList = () => {
    setSchools(storageService.getSchools());
  };

  const filteredSchools = schools.filter(s => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.city.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Schools & Partner Network
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage school lab onboarding, eligibility gating, and cohort lifecycle pipeline.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['All', 'Running', 'Lab_Setup', 'Eligibility_Check', 'Not_Eligible'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === st ? 'bg-white text-emerald-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'All' ? 'All (6)' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* School Cards Grid - Pictorial Lab Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchools.map(school => (
          <div
            key={school.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Pictorial Card Banner */}
              <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={school.bannerImage || '/assets/images/hero-banner.png'}
                  alt={school.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Overlay Chips */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-slate-800 shadow-2xs">
                    {school.code}
                  </span>
                  <StatusChip status={school.status} size="sm" />
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-2xs">
                  <ScoreRing
                    score={school.eligibility.score}
                    size={46}
                    strokeWidth={5}
                    showPercent={true}
                  />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-sm leading-snug truncate drop-shadow-xs">
                    {school.name}
                  </h3>
                  <p className="text-[11px] text-white/85 flex items-center gap-1 drop-shadow-xs">
                    📍 {school.city}, {school.state}
                  </p>
                </div>
              </div>

              {/* Pictorial Metrics Row */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cohort</span>
                    <strong className="text-slate-800 text-sm">
                      {school.totalStudentsSelected > 0 ? `${school.totalStudentsSelected} 🎓` : 'Funnel'}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stage</span>
                    <strong className="text-purple-700 text-xs truncate block mt-0.5">
                      {school.status === 'Running' ? `Day ${school.currentDay}/28` : school.status.replace(/_/g, ' ')}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Health</span>
                    <strong className={`text-xs capitalize ${
                      school.healthStatus === 'healthy' ? 'text-emerald-700' : (school.healthStatus === 'attention' ? 'text-amber-700' : 'text-rose-700')
                    }`}>
                      {school.healthStatus === 'healthy' ? '🟢 On Track' : (school.healthStatus === 'attention' ? '🟡 Review' : '🔴 Action')}
                    </strong>
                  </div>
                </div>

                {/* People Pills */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50/70 p-1.5 px-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-[11px]">Lead Faculty:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{school.facultyName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50/70 p-1.5 px-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-[11px]">Principal:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{school.principalName}</span>
                  </div>
                </div>

                {/* Rejection or Condition Notice */}
                {school.eligibility.result === 'Not_Eligible' && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Ineligible:</strong> Laboratory space and faculty criteria unmet.</span>
                  </div>
                )}
                {school.eligibility.result === 'Eligible_With_Conditions' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Condition:</strong> Wi-Fi repeater & 10 safety goggles pending.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedSchoolForEligibility(school)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                Eligibility Check
              </button>
              
              {school.status === 'Running' && (
                <button
                  onClick={() => setSelectedSchoolForTimeline(school.id)}
                  className="py-2 px-3.5 rounded-xl btn-theme-primary font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  Timeline 📅
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedSchoolForEligibility && (
        <EligibilityModal
          school={selectedSchoolForEligibility}
          isOpen={true}
          onClose={() => setSelectedSchoolForEligibility(null)}
          onSaved={() => {
            setSelectedSchoolForEligibility(null);
            refreshList();
          }}
        />
      )}

      {selectedSchoolForTimeline && (
        <SchoolTimelineModal
          schoolId={selectedSchoolForTimeline}
          onClose={() => setSelectedSchoolForTimeline(null)}
          onSelectDay={(day) => {
            onOpenDayHistory(selectedSchoolForTimeline, day);
          }}
        />
      )}

    </div>
  );
};
