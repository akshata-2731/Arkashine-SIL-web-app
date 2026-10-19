import React from 'react';
import { 
  Clock, 
  Users, 
  FlaskConical, 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { KpiCard } from '../../components/common/KpiCard';
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

  return (
    <div className="space-y-6">
      
      {/* Clean Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Principal Scorecard
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
              isTodaySubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isTodaySubmitted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Today: {isTodaySubmitted ? 'Submitted' : 'Pending'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {school.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty Coordinator: {school.facultyName} • Active Day {school.currentDay} of 28
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('logs')}
          className="self-start sm:self-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
        >
          View Daily Log Timeline →
        </button>
      </div>

      {/* 4 Core Scorecard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Hours Delivered"
          value={`${totalHoursDelivered}h`}
          target="72h"
          icon={Clock}
          trend={`${Math.round((totalHoursDelivered / 72) * 100)}% of 72h total`}
          trendType="positive"
          onClick={() => onNavigateTab('logs')}
        />
        <KpiCard
          title="Student Attendance"
          value={`${avgAttendance}%`}
          target="80% min"
          icon={Users}
          trend={avgAttendance >= 80 ? 'Above 80% threshold' : 'Needs attention'}
          trendType={avgAttendance >= 80 ? 'positive' : 'negative'}
          onClick={() => onNavigateTab('students')}
        />
        <KpiCard
          title="Soil Samples Tested"
          value={totalSamples}
          target="750"
          icon={FlaskConical}
          trend="Handheld SoiLENZ tests"
          trendType="positive"
          onClick={() => onNavigateTab('logs')}
        />
        <KpiCard
          title="Farmers Reached"
          value={totalFarmers}
          target="1,500"
          icon={Sprout}
          trend="5 micro-teams in field"
          trendType="positive"
          onClick={() => onNavigateTab('logs')}
        />
      </div>

      {/* 4-Module Progress Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              4-Module Curriculum Progression (72 Training Hours)
            </h3>
            <p className="text-xs text-slate-500">
              18 hours allocated per module: theory, SoiLENZ sensor practicals, and village fieldwork
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Week 3 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CURRICULUM_MODULES.map(mod => {
            const isCompleted = mod.id < 3;
            const isInProgress = mod.id === 3;

            return (
              <div
                key={mod.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : (isInProgress ? 'bg-amber-50/40 border-amber-300' : 'bg-slate-50 border-slate-200/80 opacity-60')
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {mod.code}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : isInProgress ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Upcoming</span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                  {mod.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mod.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
