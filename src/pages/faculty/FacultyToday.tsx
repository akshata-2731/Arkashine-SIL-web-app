import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Search, 
  Flame, 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student, DailyLog } from '../../types';

export const FacultyToday: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const currentCohortDay = school?.currentDay || 20;
  const [selectedDay, setSelectedDay] = useState<number>(currentCohortDay);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<number | 'all'>('all');
  
  // Attendance state for currently selected day
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load data from storage
  const loadData = () => {
    if (!school) return;
    const stuList = storageService.getStudents(school.id);
    const logsList = storageService.getDailyLogs(school.id);
    setStudents(stuList);
    setDailyLogs(logsList);

    // Find log for selected day
    const dayLog = logsList.find(l => l.dayNumber === selectedDay);
    if (dayLog && dayLog.studentAttendance) {
      setAttendance({ ...dayLog.studentAttendance });
    } else {
      // Default initial state
      const initial: Record<string, 'present' | 'absent' | 'late'> = {};
      stuList.forEach(s => { initial[s.id] = 'present'; });
      setAttendance(initial);
    }
  };

  useEffect(() => {
    loadData();
  }, [school?.id, selectedDay]);

  // Toast auto-hide
  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // Update attendance for a single student
  const handleUpdateStudent = (studentId: string, status: 'present' | 'absent' | 'late', studentName?: string) => {
    if (!school) return;
    const updated = {
      ...attendance,
      [studentId]: status
    };
    setAttendance(updated);

    // Save to storage
    const result = storageService.saveAttendanceForDay(school.id, selectedDay, updated);
    if (result.success) {
      // Refresh students to reflect updated cumulative attendance rates
      setStudents(storageService.getStudents(school.id));
      setDailyLogs(storageService.getDailyLogs(school.id));
      setSaveToast(`Day ${selectedDay}: ${studentName || 'Student'} marked ${status.toUpperCase()}`);
    }
  };

  // Bulk actions
  const handleBulkMark = (status: 'present' | 'absent' | 'late') => {
    if (!school) return;
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendance(updated);

    const result = storageService.saveAttendanceForDay(school.id, selectedDay, updated);
    if (result.success) {
      setStudents(storageService.getStudents(school.id));
      setDailyLogs(storageService.getDailyLogs(school.id));
      setSaveToast(`All 20 students marked ${status.toUpperCase()} for Day ${selectedDay}`);
    }
  };

  // Calculate day stats
  const currentDayStats = useMemo(() => {
    const total = students.length || 20;
    const present = Object.values(attendance).filter(v => v === 'present').length;
    const late = Object.values(attendance).filter(v => v === 'late').length;
    const absent = Object.values(attendance).filter(v => v === 'absent').length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { total, present, late, absent, rate };
  }, [attendance, students]);

  // Calculate stats for any day number in the heatmap
  const getDayHeatmapInfo = (day: number) => {
    const isFuture = day > currentCohortDay;
    const log = dailyLogs.find(l => l.dayNumber === day);

    if (isFuture) {
      return {
        rate: null,
        status: 'future',
        bgClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
      };
    }

    if (!log || !log.studentAttendance) {
      return {
        rate: 0,
        status: 'missing',
        bgClass: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
      };
    }

    const att = log.studentAttendance;
    const total = Object.keys(att).length || 20;
    const pres = Object.values(att).filter(v => v === 'present').length;
    const lat = Object.values(att).filter(v => v === 'late').length;
    const rate = Math.round(((pres + lat * 0.5) / total) * 100);

    if (rate >= 85) {
      return {
        rate,
        status: 'high',
        bgClass: 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
      };
    } else if (rate >= 70) {
      return {
        rate,
        status: 'medium',
        bgClass: 'bg-amber-400 text-slate-900 border-amber-500 font-semibold'
      };
    } else {
      return {
        rate,
        status: 'low',
        bgClass: 'bg-rose-500 text-white border-rose-600 shadow-xs'
      };
    }
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTeam = selectedTeamFilter === 'all' || s.groupNumber === selectedTeamFilter;
      return matchSearch && matchTeam;
    });
  }, [students, searchQuery, selectedTeamFilter]);

  // Overall cohort attendance average
  const overallCohortRate = useMemo(() => {
    if (students.length === 0) return 94;
    const sum = students.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    return Math.round(sum / students.length);
  }, [students]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* Save Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Executive Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Daily Attendance & 28-Day Heatmap
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Dr. Anjali Patil (Faculty Coordinator)</span>
                <span>•</span>
                <span>{school?.name || "St. Xavier's Model High School"}</span>
                <span>•</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">20 Enrolled Students</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Program Day</span>
              <span className="text-sm font-black text-purple-700 dark:text-purple-300">Day {currentCohortDay} of 28</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cohort Avg</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{overallCohortRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Threshold</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">≥80% for Certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 28-Day Interactive Attendance Heatmap */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              28-Day Cohort Attendance Heatmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any day below to load, view, or update that day's attendance record.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block shadow-2xs" />
              ≥85% (High)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
              70–84% (Partial)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500 inline-block" />
              &lt;70% (Low)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700 border border-dashed border-slate-400 inline-block" />
              Upcoming
            </span>
          </div>
        </div>

        {/* 4-Week Heatmap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
            const info = getDayHeatmapInfo(day);
            const isSelected = selectedDay === day;
            const isToday = day === currentCohortDay;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                type="button"
                className={`group relative p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center min-h-[72px] ${info.bgClass} ${
                  isSelected 
                    ? 'ring-4 ring-purple-500/40 ring-offset-2 dark:ring-offset-slate-900 scale-102 z-10 font-bold' 
                    : 'hover:scale-101 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] opacity-90 font-bold">
                  <span>Day {day}</span>
                  {isToday && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white text-purple-900 font-extrabold shadow-2xs">
                      Today
                    </span>
                  )}
                </div>

                <div className="text-base font-black my-0.5">
                  {info.rate !== null ? `${info.rate}%` : '—'}
                </div>

                <div className="text-[9px] tracking-tight opacity-80 uppercase font-semibold">
                  {isSelected ? 'Viewing' : (info.rate !== null ? `${Math.round(info.rate * 0.2)} / 20 Pres` : 'Scheduled')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Control & Quick Bulk Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Day Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay <= 1}
                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                Day {selectedDay} of 28
              </span>

              <button
                onClick={() => setSelectedDay(Math.min(28, selectedDay + 1))}
                disabled={selectedDay >= 28}
                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {selectedDay !== currentCohortDay && (
              <button
                onClick={() => setSelectedDay(currentCohortDay)}
                className="px-3 py-1.5 text-xs font-bold rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
              >
                Jump to Today (Day {currentCohortDay})
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>{selectedDay === currentCohortDay ? "Today's Active Session" : `Historical Record for Day ${selectedDay}`}</span>
            </div>
          </div>

          {/* Day Stats Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {currentDayStats.present} Present
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {currentDayStats.late} Late
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              {currentDayStats.absent} Absent
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-black">
              {currentDayStats.rate}% Day Rate
            </span>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkMark('present')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkMark('late')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              All Late
            </button>
            <button
              onClick={() => handleBulkMark('absent')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              All Absent
            </button>
          </div>
        </div>

        {/* Search & Team Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTeamFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTeamFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Cohort (20)
            </button>
            {[1, 2, 3, 4, 5].map(teamNum => (
              <button
                key={teamNum}
                onClick={() => setSelectedTeamFilter(teamNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTeamFilter === teamNum
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Team {teamNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Attendance Roster Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Student Attendance Roster ({filteredStudents.length} Students)
          </h3>
          <span className="text-xs text-slate-500">
            Click status pills to toggle attendance • Auto-saved instantly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredStudents.map((stu) => {
            const currentStatus = attendance[stu.id] || 'present';
            const isEligible = stu.attendanceRate >= 80;

            return (
              <div 
                key={stu.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={stu.avatar} 
                      alt={stu.name} 
                      className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {stu.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {stu.rollNo}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Class {stu.classGrade}</span>
                        <span>•</span>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          Team {stu.groupNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cumulative Attendance & Certificate Eligibility */}
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      {stu.attendanceRate}% Overall
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      isEligible 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {isEligible ? (
                        <>
                          <Check className="w-2.5 h-2.5" />
                          Cert Eligible
                        </>
                      ) : (
                        <>
                          <XCircle className="w-2.5 h-2.5" />
                          &lt;80% Risk
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* 3-Way Tactical Attendance Selector */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleUpdateStudent(stu.id, 'present', stu.name)}
                    type="button"
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs scale-101 ring-2 ring-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Present
                  </button>

                  <button
                    onClick={() => handleUpdateStudent(stu.id, 'late', stu.name)}
                    type="button"
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-xs scale-101 ring-2 ring-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Late
                  </button>

                  <button
                    onClick={() => handleUpdateStudent(stu.id, 'absent', stu.name)}
                    type="button"
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs scale-101 ring-2 ring-rose-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
