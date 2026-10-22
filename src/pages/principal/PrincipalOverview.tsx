import React from 'react';
import { 
  Clock, 
  Users, 
  FlaskConical, 
  Sprout, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CURRICULUM_MODULES } from '../../data/modulesData';

interface PrincipalOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenDayHistory: (schoolId: string, day: number) => void;
}

export const PrincipalOverview: React.FC<PrincipalOverviewProps> = ({
  onNavigateTab
}) => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const logs = storageService.getDailyLogs(school.id);
  const students = storageService.getStudents(school.id);
  const samples = storageService.getSoilSamples(school.id);

  // Compute school metrics
  const completedLogs = logs.filter(l => l.status !== 'Missing' && l.dayNumber <= school.currentDay);
  const totalHoursDelivered = completedLogs.reduce((acc, l) => acc + l.hoursTaught, 0);
  
  const avgAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)
    : 85;

  const totalSamples = samples.length;
  const totalFarmers = 520;

  // Check today's update status
  const todayLog = logs.find(l => l.dayNumber === school.currentDay);
  const isTodaySubmitted = todayLog && todayLog.status !== 'Missing';

  // Risk and compliance metrics
  const below70AttendanceCount = students.filter(s => s.attendanceRate < 70).length;
  const eligibleAttendanceCount = students.filter(s => s.attendanceRate >= 70).length;
  const parentConsentVerifiedCount = students.filter(s => s.parentConsentSigned !== false).length;

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Principal Executive Dashboard
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${
              isTodaySubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isTodaySubmitted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Today's Session: {isTodaySubmitted ? 'Delivered & Logged' : 'Pending Submission'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {school.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty In-Charge: <span className="font-semibold text-slate-700">{school.facultyName}</span> • Active Day {school.currentDay} of 28 ({school.city}, {school.state})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('logs')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Daily Log Timeline
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pictorial Welcome Card with Lab Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                School Innovation Lab Overview
              </span>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                Lab Reagents Safety Verified
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {school.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Leading the Summer Vacations Soil Health mandate in {school.city}. Students conduct precision tests with handheld SoiLENZ devices, test local farm samples, and issue customized digital soil health advisories to village farmers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
              🌱 Day {school.currentDay} of 28 Active
            </span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              🎓 {students.length} Enrolled Students
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
              🌾 5 Micro Field Teams
            </span>
            <span className="flex items-center gap-1.5 font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
              🧪 SoiLENZ Electrochemical Lab
            </span>
          </div>
        </div>

        <div className="w-full md:w-80 h-48 md:h-auto bg-slate-100 overflow-hidden shrink-0 border-t md:border-t-0 md:border-l border-slate-100 relative group">
          <img
            src="/assets/images/hero-banner.webp"
            alt="School lab testing soil"
            width={320}
            height={200}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white drop-shadow-xs">
              Arkashine Soil Partner Lab • {school.city}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Rich Pictorial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Hours Delivered */}
        <div 
          onClick={() => onNavigateTab('logs')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-purple-900">
            <img 
              src="/assets/images/tree-soil-ecosystem.webp" 
              alt="Hours Delivered Illustration" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-purple-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Clock className="w-3 h-3 text-purple-700" />
              Hours Delivered
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {totalHoursDelivered}h <span className="text-xs font-normal text-purple-200">/ 72h</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Curriculum Progress</span>
              <span className="font-bold text-purple-800">{Math.round((totalHoursDelivered / 72) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalHoursDelivered / 72) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>Target: 72 Training Hours</span>
              <span className="text-purple-700 font-semibold">View Logs →</span>
            </p>
          </div>
        </div>

        {/* Card 2: Student Attendance */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-emerald-900">
            <img 
              src="/assets/images/student-lab-discovery.webp" 
              alt="Student Attendance" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-emerald-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Users className="w-3 h-3 text-emerald-700" />
              Student Attendance
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {avgAttendance}% <span className="text-xs font-normal text-emerald-200">avg</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Certification Threshold</span>
              <span className={`font-bold ${avgAttendance >= 70 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {avgAttendance >= 70 ? 'Above 70% min' : 'Below 70% bar'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${avgAttendance >= 70 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min(100, avgAttendance)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>70% compulsory for certs</span>
              <span className="text-emerald-700 font-semibold">Cohort Roster →</span>
            </p>
          </div>
        </div>

        {/* Card 3: Soil Samples Tested */}
        <div 
          onClick={() => onNavigateTab('logs')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-sky-950">
            <img 
              src="/assets/images/soil-layers-kids.webp" 
              alt="Soil Samples Tested" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-sky-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-sky-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <FlaskConical className="w-3 h-3 text-sky-700" />
              Soil Samples Tested
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {totalSamples} <span className="text-xs font-normal text-sky-200">/ 750 target</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">SoiLENZ Device Tests</span>
              <span className="font-bold text-sky-800">{Math.round((totalSamples / 750) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalSamples / 750) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>Target: 750 farm samples</span>
              <span className="text-sky-700 font-semibold">Lab Details →</span>
            </p>
          </div>
        </div>

        {/* Card 4: Farmers Reached */}
        <div 
          onClick={() => onNavigateTab('logs')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
        >
          <div className="relative h-28 overflow-hidden bg-amber-950">
            <img 
              src="/assets/images/farmer-outreach.webp" 
              alt="Farmers Reached" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-amber-950/30 to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Sprout className="w-3 h-3 text-amber-700" />
              Farmers Reached
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <div className="text-xl font-extrabold tracking-tight">
                {totalFarmers} <span className="text-xs font-normal text-amber-200">/ 1,500 target</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Village Field Advisory</span>
              <span className="font-bold text-amber-800">{Math.round((totalFarmers / 1500) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalFarmers / 1500) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
              <span>5 micro-teams in field</span>
              <span className="text-amber-700 font-semibold">Outreach Logs →</span>
            </p>
          </div>
        </div>

      </div>

      {/* Mandatory Student Safety & Certification Compliance Directives */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-950" />
                Mandatory Lab Directives
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-400/30">
                Principal Safety & Eligibility Notice
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Student Lab Safety & Certification Compliance Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Chemical Safety & Parental Permission Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <FlaskConical className="w-4 h-4 shrink-0 text-amber-400" />
                  <h4>Parental Permission Mandatory (Chemical Reagents)</h4>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Laboratory soil testing involves chemical reagents, extraction buffer solutions, and pH colorimetric indicators. Prior written permission from parents is compulsory before any student handles soil reagents or operates SoiLENZ sensor calibration dishes.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{parentConsentVerifiedCount} of {students.length} Signed Parental Consent Slips Verified on Record</span>
                </div>
              </div>

              {/* 70% Attendance Rule Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Award className="w-4 h-4 shrink-0 text-emerald-400" />
                  <h4>70% Minimum Attendance Compulsory for Certificates</h4>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Students must achieve at least 70% verified lab and field attendance. Only students meeting 70% or higher are eligible to receive the Arkashine Soil Partner Certificate; otherwise students are strictly not eligible to receive the certificate.
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="font-semibold text-slate-300">
                    {eligibleAttendanceCount} of {students.length} Meeting 70% Bar ({below70AttendanceCount} At Risk)
                  </span>
                  <span className="font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                    Strict Gate
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Manage Student Cohort & Risk
            </button>
            <button
              onClick={() => onNavigateTab('certificates')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-300" />
              Check Certificate Eligibility
            </button>
          </div>
        </div>
      </div>

      {/* 4-Module Curriculum Progression with Rich Posters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                4-Module Curriculum Progression (72 Training Hours)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured pedagogy: 18 hours per module combining theoretical science, SoiLENZ sensor practicals, and village fieldwork.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-center">
            Currently in Week 3 of 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURRICULUM_MODULES.map(mod => {
            const isCompleted = mod.id < 3;
            const isInProgress = mod.id === 3;
            const hoursDeliveredForMod = isCompleted ? 18 : (isInProgress ? 14 : 0);
            const percent = Math.round((hoursDeliveredForMod / 18) * 100);

            return (
              <div
                key={mod.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                  isCompleted
                    ? 'bg-emerald-50/20 border-emerald-200'
                    : (isInProgress ? 'bg-amber-50/20 border-amber-300 ring-2 ring-amber-100' : 'bg-slate-50 border-slate-200/80')
                }`}
              >
                {/* Module Poster Image Banner */}
                <div className="relative h-36 overflow-hidden bg-slate-900 group">
                  <img
                    src={mod.image}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  
                  {/* Status Ribbon */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider shadow-xs bg-slate-900/80 text-white backdrop-blur-xs">
                      {mod.code}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Done
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-200/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
                        In Progress
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-200 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[10px] text-emerald-300 font-semibold block">
                      {hoursDeliveredForMod}h / 18h Delivered
                    </span>
                  </div>
                </div>

                {/* Module Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Progress ({hoursDeliveredForMod}/18h)</span>
                      <span className="font-bold text-slate-800">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-600' : (isInProgress ? 'bg-amber-500' : 'bg-slate-300')
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{mod.topics.length} Key Topics</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {mod.assessmentType.split('+')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
