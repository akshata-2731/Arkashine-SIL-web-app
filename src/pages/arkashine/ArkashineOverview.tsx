import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  Users, 
  Award, 
  Sprout, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusChip } from '../../components/common/StatusChip';
import { School } from '../../types';
import { storageService } from '../../services/storageService';
import { EligibilityModal } from '../../components/school/EligibilityModal';

interface ArkashineOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenSchoolTimeline: (schoolId: string) => void;
}

export const ArkashineOverview: React.FC<ArkashineOverviewProps> = ({
  onNavigateTab,
  onOpenSchoolTimeline
}) => {
  const schools = storageService.getSchools();
  const students = storageService.getStudents();
  const [selectedSchoolForEligibility, setSelectedSchoolForEligibility] = useState<School | null>(null);

  // 4 Core KPIs (Simple First: max 4 cards)
  const enrolledSchoolsCount = schools.filter(s => s.status === 'Running' || s.status === 'Enrolled').length;
  const totalStudentsSelected = students.length;
  const farmersReachedCount = 1340;
  const readyCertificatesCount = students.filter(s => s.certificateStatus === 'Eligible' || s.certificateStatus === 'Issued').length;

  // Needs Attention list (max 4 schools)
  const needsAttentionSchools = schools
    .filter(s => s.status === 'Not_Eligible' || s.healthStatus === 'attention' || s.healthStatus === 'critical' || s.status === 'Eligibility_Check')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Clean, calm header without heavy gradients */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Program Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Summer Innovation Program 2026 • 6 School Innovation Labs • SoiLENZ Field Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('heatmap')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
          >
            Open Program Heat Map →
          </button>
        </div>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Schools Enrolled"
          value={enrolledSchoolsCount}
          target={schools.length}
          icon={SchoolIcon}
          trend="+2 in onboarding"
          trendType="neutral"
          color="emerald"
          onClick={() => onNavigateTab('schools')}
        />
        <KpiCard
          title="Students in Program"
          value={totalStudentsSelected}
          target="108"
          icon={Users}
          trend="52% Girls • 48% Boys"
          trendType="positive"
          color="blue"
          onClick={() => onNavigateTab('schools')}
        />
        <KpiCard
          title="Farmers Reached"
          value={farmersReachedCount}
          target="1,500"
          icon={Sprout}
          trend="89% of pilot target"
          trendType="positive"
          color="earth"
          onClick={() => onNavigateTab('heatmap')}
        />
        <KpiCard
          title="Certificates Ready"
          value={readyCertificatesCount}
          target={totalStudentsSelected}
          icon={Award}
          trend="≥80% attendance required"
          trendType="neutral"
          color="amber"
          onClick={() => onNavigateTab('certificates')}
        />
      </div>

      {/* Main Section: 1 Main Visual (Active Lab Hubs) + 1 Clean List (Needs Attention) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Visual (Clean School Deployment Grid) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                School Lab Deployment Hubs
              </h3>
              <p className="text-xs text-slate-500">
                Operational status across Western, Central, and Southern zones
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('schools')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              View all ({schools.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schools.map(sch => (
              <div
                key={sch.id}
                onClick={() => onOpenSchoolTimeline(sch.id)}
                className="p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sch.code}
                    </span>
                    <StatusChip status={sch.status} size="sm" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {sch.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {sch.city}, {sch.state}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{sch.status === 'Running' ? `Day ${sch.currentDay} of 28` : sch.status.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-emerald-800 flex items-center gap-0.5">
                    Timeline <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Clean "Needs Attention" List */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Needs Attention
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {needsAttentionSchools.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {needsAttentionSchools.map(sch => (
                <div
                  key={sch.id}
                  onClick={() => setSelectedSchoolForEligibility(sch)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 truncate">{sch.name}</span>
                    <StatusChip status={sch.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {sch.status === 'Not_Eligible'
                      ? 'Disqualified on safety/space criteria'
                      : (sch.status === 'Eligibility_Check'
                        ? 'Wi-Fi & Safety equipment proof pending'
                        : 'Missed daily update during mid-program')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('schools')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/60 transition-colors"
          >
            Manage School Approvals
          </button>
        </div>

      </div>

      {/* Eligibility Modal when clicked */}
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
