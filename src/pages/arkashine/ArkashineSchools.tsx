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

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchools.map(school => (
          <div
            key={school.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                      {school.code}
                    </span>
                    <StatusChip status={school.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                    {school.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {school.city}, {school.state}
                  </p>
                </div>
                
                {/* Score Ring */}
                <div className="shrink-0">
                  <ScoreRing
                    score={school.eligibility.score}
                    size={56}
                    strokeWidth={6}
                    showPercent={true}
                  />
                </div>
              </div>

              {/* People & Contact Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-600">Principal:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{school.principalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Faculty Lead:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{school.facultyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Stage:</span>
                  <span className="font-bold text-emerald-800">
                    {school.status === 'Running' ? `Day ${school.currentDay} of 28` : school.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Rejection or Condition Notice */}
              {school.eligibility.result === 'Not_Eligible' && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                  <span className="font-bold">Ineligible:</span> Disqualified on laboratory space & faculty criteria.
                </div>
              )}
              {school.eligibility.result === 'Eligible_With_Conditions' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                  <span className="font-bold">Conditions:</span> Wi-Fi mesh & safety goggles upgrade pending.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedSchoolForEligibility(school)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Eligibility Checklist
              </button>
              
              {school.status === 'Running' && (
                <button
                  onClick={() => setSelectedSchoolForTimeline(school.id)}
                  className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                >
                  Timeline
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
