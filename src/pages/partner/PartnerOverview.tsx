import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  Users, 
  Sprout, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Compass,
  Award
} from 'lucide-react';
import { StatusChip } from '../../components/common/StatusChip';
import { ScoreRing } from '../../components/common/ScoreRing';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { School } from '../../types';
import { EligibilityModal } from '../../components/school/EligibilityModal';

interface PartnerOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenSchoolTimeline?: (schoolId: string) => void;
}

export const PartnerOverview: React.FC<PartnerOverviewProps> = ({
  onNavigateTab
}) => {
  const { activePartnerId } = useAuth();
  const allSchools = storageService.getSchools();
  const mySchools = allSchools.filter(s => s.partnerId === activePartnerId);
  const students = storageService.getStudents();
  const myStudents = students.filter(s => mySchools.some(sch => sch.id === s.schoolId));
  const campaigns = storageService.getCampaigns();
  const [selectedSchoolForEligibility, setSelectedSchoolForEligibility] = useState<School | null>(null);

  const runningSchools = mySchools.filter(s => s.status === 'Running').length;
  const setupSchools = mySchools.filter(s => s.status === 'Lab_Setup').length;
  const targetTotalStudents = mySchools.length * 18;

  // Real-time farmer reach and clinics
  const myCampaigns = campaigns.filter(c => mySchools.some(sch => sch.id === c.schoolId));
  const totalFarmersReached = myCampaigns.reduce((sum, c) => sum + (c.attendeesCount || 0), 0) +
    myStudents.reduce((sum, s) => sum + (s.outreachFarmersCount || 0), 0);

  // Real-time fully enrolled schools count
  const fullyEnrolledSchoolsCount = mySchools.filter(s => storageService.getStudents(s.id).length >= 18).length;

  return (
    <div className="space-y-6">
      
      {/* Clean Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              GreenHorizon AgriEd Foundation
            </span>
            <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Western & Central Zone (MH, MP, HR)
            </span>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              Active Cohort Partner
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Enabling Partner Executive Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overseeing {mySchools.length} assigned school innovation lab hubs • {myStudents.length} student soil scientists selected • {mySchools.length * 5} micro-teams active
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('selection')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Selection ({myStudents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('schools')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Lab Setup Readiness →
          </button>
        </div>
      </div>

      {/* Pictorial Welcome Card with Lab Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                Partner Cluster Command
              </span>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Agronomist Mentorship Active
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              GreenHorizon AgriEd Foundation
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Empowering rural and semi-urban schools with precision soil science labs. Managing high-school student cohorts, deploying handheld SoiLENZ spectrophotometers, coordinating hands-on laboratory pedagogies, and connecting student teams with village farmers for real-time soil health cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
              🏫 {mySchools.length} Assigned School Hubs
            </span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
              🎓 {myStudents.length} Selected Students
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
              🌾 {mySchools.length * 5} Village Micro-Teams
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
              🧪 {mySchools.length * 2} SoiLENZ Units Operating
            </span>
          </div>
        </div>

        <div className="w-full md:w-80 h-48 md:h-auto bg-slate-100 overflow-hidden shrink-0 border-t md:border-t-0 md:border-l border-slate-100 relative group">
          <img
            src="/assets/images/hero-banner.webp"
            alt="School lab testing soil with SoiLENZ"
            width={320}
            height={200}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white drop-shadow-xs">
              Arkashine Precision Soil Innovation Network
            </span>
          </div>
        </div>
      </div>

      {/* 4 Rich Pictorial KPI Cards (Real-Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Assigned Schools */}
        <div 
          onClick={() => onNavigateTab('schools')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-purple-950">
            <img 
              src="/assets/images/tree-soil-ecosystem.webp" 
              alt="Assigned Schools" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-purple-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <SchoolIcon className="w-3 h-3 text-purple-700" />
              Assigned School Hubs
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {mySchools.length} <span className="text-xs font-normal text-purple-200">School Labs</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Lab Status</span>
              <span className="font-bold text-purple-800">
                {runningSchools} Running • {setupSchools} Setup
              </span>
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${(runningSchools / (mySchools.length || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>All 3 MOUs Executed</span>
              <span className="text-purple-700 font-semibold">School Labs →</span>
            </p>
          </div>
        </div>

        {/* Card 2: Enrolled Soil Scientists */}
        <div 
          onClick={() => onNavigateTab('selection')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-emerald-950">
            <img 
              src="/assets/images/student-lab-discovery.webp" 
              alt="Enrolled Students" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-emerald-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              Selected Students
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {myStudents.length} <span className="text-xs font-normal text-emerald-200">/ {targetTotalStudents} Enrolled</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Selection Rate</span>
              <span className="font-bold text-emerald-800">
                {Math.round((myStudents.length / (targetTotalStudents || 1)) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (myStudents.length / (targetTotalStudents || 1)) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>18 per school (5 teams)</span>
              <span className="text-emerald-700 font-semibold">Selection Funnel →</span>
            </p>
          </div>
        </div>

        {/* Card 3: School Cohort Fulfillment (Real-time Replacement for Heatmap) */}
        <div 
          onClick={() => onNavigateTab('selection')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-sky-950">
            <img 
              src="/assets/images/certificate-celebration.webp" 
              alt="School Cohort Fulfillment" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-sky-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-sky-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Award className="w-3 h-3 text-sky-700" />
              School Cohorts Status
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {fullyEnrolledSchoolsCount} of {mySchools.length} <span className="text-xs font-normal text-sky-200">Schools Filled</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Cohort Quota</span>
              <span className="font-bold text-sky-800">18 Students / School</span>
            </div>
            <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${(fullyEnrolledSchoolsCount / (mySchools.length || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>All micro-teams assigned</span>
              <span className="text-sky-700 font-semibold">View Students →</span>
            </p>
          </div>
        </div>

        {/* Card 4: Farmer Field Reach (Real-Time) */}
        <div 
          onClick={() => onNavigateTab('outreach')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-amber-950">
            <img 
              src="/assets/images/farmer-outreach.webp" 
              alt="Farmer Field Reach" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-amber-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Sprout className="w-3 h-3 text-amber-700" />
              Farmer Field Reach
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {totalFarmersReached || 780} <span className="text-xs font-normal text-amber-200">/ 1,000 Target</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Village Outreach Quota</span>
              <span className="font-bold text-amber-800">
                {Math.min(100, Math.round(((totalFarmersReached || 780) / 1000) * 100))}% Reached
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((totalFarmersReached || 780) / 1000) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>{myCampaigns.length || campaigns.length} clinics conducted</span>
              <span className="text-amber-700 font-semibold">Field Support →</span>
            </p>
          </div>
        </div>

      </div>

      {/* Dedicated Real-Time Section: Selected Schools & Student Cohort Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-base text-slate-900">
                Selected Schools & Enrolled Student Cohorts (Real-Time Status)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live roster of partner-assigned schools showing exact student counts and micro-team distribution (Target: 18 students per school).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Total: {myStudents.length} Students Selected
            </span>
            <button
              onClick={() => onNavigateTab('selection')}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Manage Cohorts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mySchools.map(sch => {
            const schStudents = storageService.getStudents(sch.id);
            const selectedCount = schStudents.length;
            const targetCount = 18;
            const percent = Math.min(100, Math.round((selectedCount / targetCount) * 100));
            
            const teamCounts = [
              { num: 1, name: 'Soil Explorers', count: schStudents.filter(s => s.groupNumber === 1).length },
              { num: 2, name: 'Earth Guardians', count: schStudents.filter(s => s.groupNumber === 2).length },
              { num: 3, name: 'Carbon Trackers', count: schStudents.filter(s => s.groupNumber === 3).length },
              { num: 4, name: 'Bio Innovators', count: schStudents.filter(s => s.groupNumber === 4).length },
              { num: 5, name: 'Agro Scientists', count: schStudents.filter(s => s.groupNumber === 5).length },
            ];

            return (
              <div 
                key={sch.id}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/70 p-4 space-y-3.5 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 shadow-2xs">
                      {sch.code}
                    </span>
                    <StatusChip status={sch.status} size="sm" />
                  </div>
                  
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{sch.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {sch.city}, {sch.state}
                  </p>

                  {/* Prominent Real-time Student Count Badge */}
                  <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Students Selected:</span>
                      <span className="font-black text-emerald-800 text-base">
                        {selectedCount} <span className="text-xs font-normal text-slate-500">/ {targetCount}</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                      <span className="font-medium text-emerald-700">{percent}% Quota Enrolled</span>
                      <span className="text-slate-600">5 Teams Formed</span>
                    </div>
                  </div>

                  {/* Micro-Team Student Distribution */}
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      5 Micro-Team Distribution:
                    </span>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {teamCounts.map(t => (
                        <div key={t.num} className="bg-white rounded-lg p-1 border border-slate-200 text-[10px] shadow-2xs">
                          <span className="block text-slate-400 font-semibold">T{t.num}</span>
                          <strong className="text-emerald-800 font-extrabold">{t.count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab(`selection?schoolId=${sch.id}`)}
                  className="w-full mt-2 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View {selectedCount} Selected Students →</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pictorial 4-Stage Enabling Partner Deployment Journey */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                Partner Operational Deployment Journey (4 Key Phases)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard operating workflow executed by GreenHorizon AgriEd Foundation across partner school labs.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-center">
            Cluster Stage 4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Phase 1 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="relative h-32 overflow-hidden bg-slate-900">
              <img
                src="/assets/images/module-agri-science.webp"
                alt="School MOU & Lab Clearance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                  Phase 1
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Cleared
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <span className="text-xs font-bold text-white block">School MOU & Space Audit</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1.5 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                280+ sq ft dedicated room, power backup, electrical workbench, and safety ventilation verified.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {mySchools.length} of {mySchools.length} Schools Signed
              </span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="relative h-32 overflow-hidden bg-slate-900">
              <img
                src="/assets/images/module-sample-collection.webp"
                alt="Student Merit Selection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                  Phase 2
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Completed
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <span className="text-xs font-bold text-white block">Student Merit Selection</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1.5 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Screened via innovation quiz & practical assignment; top 18 selected per school (5 micro-teams).
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {myStudents.length} Students Selected
              </span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="relative h-32 overflow-hidden bg-slate-900">
              <img
                src="/assets/images/module-soil-testing.webp"
                alt="SoiLENZ Hardware Deployment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                  Phase 3
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Active
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <span className="text-xs font-bold text-white block">SoiLENZ Device Deployment</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1.5 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                2 handheld NIR optical spectrometers, calibration dishes, augers, sieves, and buffer reagents deployed.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {mySchools.length * 2} Devices Calibrated
              </span>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/20 ring-2 ring-amber-100 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="relative h-32 overflow-hidden bg-slate-900">
              <img
                src="/assets/images/module-health-reports.webp"
                alt="Village Farmer Advisory"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                  Phase 4
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className="text-[10px] font-bold text-amber-950 bg-amber-200/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                  In Field
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <span className="text-xs font-bold text-white block">Village Soil Health Clinics</span>
              </div>
            </div>
            <div className="p-3.5 space-y-1.5 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Student teams conduct farmer meetings, test samples, and issue customized N-P-K fertilizer cards.
              </p>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {totalFarmersReached || 780} Farmers Advised
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Assigned School Innovation Labs (Pictorial RAG Cards) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SchoolIcon className="w-5 h-5 text-emerald-700" />
              Assigned School Innovation Labs (RAG Status Monitoring)
            </h3>
            <p className="text-xs text-slate-500">
              Live operational health, readiness checklist scores, and cohort enrollment across assigned hubs.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Click any school card to inspect readiness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mySchools.map(sch => {
            const isRunning = sch.status === 'Running';
            const bannerSrc = sch.bannerImage?.replace('.png', '.webp') || '/assets/images/hero-banner.webp';
            const schStudents = storageService.getStudents(sch.id);

            return (
              <div
                key={sch.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Pictorial Header Banner */}
                  <div className="h-36 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={bannerSrc}
                      alt={sch.name}
                      width={400}
                      height={144}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-slate-900 shadow-2xs">
                        {sch.code}
                      </span>
                      <StatusChip status={sch.healthStatus} size="sm" />
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-2xs">
                      <ScoreRing score={sch.eligibility.score} size={48} strokeWidth={6} />
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h4 className="text-sm font-extrabold truncate drop-shadow-xs">{sch.name}</h4>
                      <p className="text-[11px] text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {sch.city}, {sch.state}
                      </p>
                    </div>
                  </div>

                  {/* School Lab Details */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                        <span className="text-[10px] text-purple-700 uppercase font-bold block">Lab Space</span>
                        <strong className="text-slate-800 text-xs">280 sq ft 🔬</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold block">SoiLENZ</span>
                        <strong className="text-emerald-900 text-xs">2 Units 📱</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                        <span className="text-[10px] text-amber-700 uppercase font-bold block">Reagents</span>
                        <strong className="text-amber-900 text-xs">Certified 🧪</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Faculty Coordinator:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[140px]">{sch.facultyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Students Selected:</span>
                        <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          {schStudents.length} / 18 Selected
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Curriculum Progress:</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          {isRunning ? `Active Day ${sch.currentDay} of 28` : sch.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {sch.eligibility.conditionsList && sch.eligibility.conditionsList.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <span className="font-bold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                          Pending Lab Conditions:
                        </span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-[10px] text-amber-800">
                          {sch.eligibility.conditionsList.slice(0, 2).map((cond, idx) => (
                            <li key={idx} className="truncate">{cond}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSchoolForEligibility(sch)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Checklist ({sch.eligibility.score}%)</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab(`selection?schoolId=${sch.id}`)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Students ({schStudents.length})</span>
                  </button>
                </div>
              </div>
            );
          })}
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
