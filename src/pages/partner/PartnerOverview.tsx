import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  Users, 
  Sprout, 
  Clock
} from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusChip } from '../../components/common/StatusChip';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { School } from '../../types';
import { EligibilityModal } from '../../components/school/EligibilityModal';

interface PartnerOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenSchoolTimeline: (schoolId: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  onNavigateTab,
  onOpenSchoolTimeline
}) => {
  const { activePartnerId } = useAuth();
  const allSchools = storageService.getSchools();
  const mySchools = allSchools.filter(s => s.partnerId === activePartnerId);
  const students = storageService.getStudents();
  const myStudents = students.filter(s => mySchools.some(sch => sch.id === s.schoolId));
  const [selectedSchoolForEligibility, setSelectedSchoolForEligibility] = useState<School | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            GreenHorizon AgriEd Foundation
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Enabling Partner Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overseeing {mySchools.length} assigned school innovation labs across Western & Central Zone
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('selection')}
          className="self-start sm:self-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
        >
          Manage Student Selection →
        </button>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Assigned Schools"
          value={mySchools.length}
          target="3"
          icon={SchoolIcon}
          trend="2 Running • 1 Setup"
          trendType="positive"
          onClick={() => onNavigateTab('schools')}
        />
        <KpiCard
          title="Active Students"
          value={myStudents.length}
          target="54"
          icon={Users}
          trend="5 micro-teams per school"
          trendType="neutral"
          onClick={() => onNavigateTab('selection')}
        />
        <KpiCard
          title="Daily Compliance"
          value="94.2%"
          target="100%"
          icon={Clock}
          trend="On-time updates"
          trendType="positive"
          onClick={() => onNavigateTab('heatmap')}
        />
        <KpiCard
          title="Farmer Field Reach"
          value="780"
          target="1,000"
          icon={Sprout}
          trend="78% of regional goal"
          trendType="positive"
          onClick={() => onNavigateTab('outreach')}
        />
      </div>

      {/* School Status Cards (RAG Red-Amber-Green Monitoring) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Assigned Schools (RAG Status)
          </h3>
          <span className="text-xs text-slate-500">Click a school to inspect readiness</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mySchools.map(sch => (
            <div
              key={sch.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {sch.code}
                  </span>
                  <StatusChip status={sch.healthStatus} size="sm" />
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{sch.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{sch.city}, {sch.state}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Faculty Coordinator:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[130px]">{sch.facultyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Program Day:</span>
                    <span className="font-bold text-slate-800">
                      {sch.status === 'Running' ? `Day ${sch.currentDay}/28` : sch.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setSelectedSchoolForEligibility(sch)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Checklist ({sch.eligibility.score}%)
                </button>
                {sch.status === 'Running' && (
                  <button
                    onClick={() => onOpenSchoolTimeline(sch.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
                  >
                    Timeline
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSchoolForEligibility && (
        <EligibilityModal
          school={selectedSchoolForEligibility}
          isOpen={true}
          onClose={() => setSelectedSchoolForEligibility(null)}
          onSaved={() => setSelectedSchoolForEligibility(null)}
        />
      )}

    </div>
  );
};
