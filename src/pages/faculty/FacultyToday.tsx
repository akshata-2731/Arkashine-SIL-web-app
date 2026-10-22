import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Search, 
  Flame, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student, DailyLog } from '../../types';

export const FacultyToday: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const currentCohortDay = school?.currentDay || 20;
  
  // State for data
  const [students, setStudents] = useState<Student[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modal State: null if closed, or the day number (1-28) if open
  const [activeDayModal, setActiveDayModal] = useState<number | null>(null);
  const [modalAttendance, setModalAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Load data from storage
  const loadData = () => {
    if (!school) return;
    const stuList = storageService.getStudents(school.id);
    const logsList = storageService.getDailyLogs(school.id);
    setStudents(stuList);
    setDailyLogs(logsList);
  };

  useEffect(() => {
    loadData();
  }, [school?.id]);

  // Toast auto-hide
  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // When a day card is clicked, load that day's attendance and open modal
  const handleOpenDayModal = (day: number) => {
    if (!school) return;
    const dayLog = dailyLogs.find(l => l.dayNumber === day);
    if (dayLog && dayLog.studentAttendance) {
      setModalAttendance({ ...dayLog.studentAttendance });
    } else {
      const initial: Record<string, 'present' | 'absent' | 'late'> = {};
      students.forEach(s => { initial[s.id] = 'present'; });
      setModalAttendance(initial);
    }
    setStudentSearchQuery('');
    setActiveDayModal(day);
  };

  // Toggle single student attendance in modal (ONLY Present or Absent)
  const handleToggleStudent = (studentId: string, status: 'present' | 'absent', studentName?: string) => {
    if (!school || activeDayModal === null) return;
    const updated = {
      ...modalAttendance,
      [studentId]: status
    };
    setModalAttendance(updated);

    // Save immediately to storage
    const result = storageService.saveAttendanceForDay(school.id, activeDayModal, updated);
    if (result.success) {
      setStudents(storageService.getStudents(school.id));
      setDailyLogs(storageService.getDailyLogs(school.id));
      setSaveToast(`Day ${activeDayModal}: ${studentName || 'Student'} marked ${status.toUpperCase()}`);
    }
  };

  // Bulk actions in modal
  const handleBulkMarkModal = (status: 'present' | 'absent') => {
    if (!school || activeDayModal === null) return;
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setModalAttendance(updated);

    const result = storageService.saveAttendanceForDay(school.id, activeDayModal, updated);
    if (result.success) {
      setStudents(storageService.getStudents(school.id));
      setDailyLogs(storageService.getDailyLogs(school.id));
      setSaveToast(`All 20 students marked ${status.toUpperCase()} for Day ${activeDayModal}`);
    }
  };

  // Stats for any day card in the heatmap
  const getDayCardData = (day: number) => {
    const isFuture = day > currentCohortDay;
    const total = students.length || 20;

    if (isFuture) {
      return {
        isFuture: true,
        present: null,
        total,
        rate: null,
        bgClass: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
      };
    }

    const log = dailyLogs.find(l => l.dayNumber === day);
    if (!log || !log.studentAttendance) {
      return {
        isFuture: false,
        present: 0,
        total,
        rate: 0,
        bgClass: 'bg-rose-50/70 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/50 hover:border-rose-400'
      };
    }

    const att = log.studentAttendance;
    const presentCount = Object.values(att).filter(v => v === 'present' || v === 'late').length;
    const rate = Math.round((presentCount / total) * 100);

    if (rate >= 85) {
      return {
        isFuture: false,
        present: presentCount,
        total,
        rate,
        bgClass: 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:border-emerald-500 hover:shadow-md'
      };
    } else if (rate >= 70) {
      return {
        isFuture: false,
        present: presentCount,
        total,
        rate,
        bgClass: 'bg-amber-50/80 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:border-amber-500 hover:shadow-md'
      };
    } else {
      return {
        isFuture: false,
        present: presentCount,
        total,
        rate,
        bgClass: 'bg-rose-50/80 border-rose-300 dark:bg-rose-950/30 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:border-rose-500 hover:shadow-md'
      };
    }
  };

  // Overall cohort attendance average
  const overallCohortRate = useMemo(() => {
    if (students.length === 0) return 94;
    const sum = students.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    return Math.round(sum / students.length);
  }, [students]);

  // Modal active day stats
  const modalDayStats = useMemo(() => {
    const total = students.length || 20;
    const present = Object.values(modalAttendance).filter(v => v === 'present' || v === 'late').length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, rate };
  }, [modalAttendance, students]);

  // Filtered students inside modal
  const modalFilteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
      s.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [students, studentSearchQuery]);

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
                <span className="font-semibold text-purple-700 dark:text-purple-300">20 Students Cohort</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Program Day</span>
              <span className="text-sm font-black text-purple-700 dark:text-purple-300">Day {currentCohortDay} of 28</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cohort Average</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{overallCohortRate}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cert Gate</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">≥80% Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* 28-Day Attendance Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Heatmap Section Title & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              28-Day Attendance Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any day to open the student attendance list and mark Present or Absent.
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
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

        {/* 28-Day Grid: Showing present students out of total */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
            const data = getDayCardData(day);
            const isToday = day === currentCohortDay;

            return (
              <button
                key={day}
                onClick={() => handleOpenDayModal(day)}
                type="button"
                className={`group relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${data.bgClass} hover:scale-102 hover:shadow-lg`}
              >
                {/* Day Header with Today Badge */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold tracking-tight">
                    Day {day}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-purple-700 text-white font-extrabold shadow-2xs">
                      Today
                    </span>
                  )}
                </div>

                {/* Big Present Count out of Total */}
                <div className="my-1.5">
                  <div className="text-lg font-black tracking-tight flex items-baseline gap-1">
                    {data.present !== null ? (
                      <>
                        <span className="text-xl font-black">{data.present}</span>
                        <span className="text-xs font-bold opacity-60">/ {data.total}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold opacity-40">— / {data.total}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-semibold opacity-75 uppercase tracking-wider">
                    {data.present !== null ? 'Students Present' : 'Scheduled'}
                  </div>
                </div>

                {/* Bottom Rate & Click Hint */}
                <div className="flex items-center justify-between w-full text-[10px] font-bold opacity-80 pt-1 border-t border-black/5 dark:border-white/5">
                  <span>{data.rate !== null ? `${data.rate}% Rate` : 'Upcoming'}</span>
                  <span className="text-[9px] text-purple-700 dark:text-purple-300 font-extrabold flex items-center group-hover:translate-x-0.5 transition-transform">
                    Mark →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* POPUP MODAL: Vertical Student Attendance List (ONLY Present & Absent) */}
      {activeDayModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-sm">
                  D{activeDayModal}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Day {activeDayModal} Attendance
                    </h3>
                    {activeDayModal === currentCohortDay && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {modalDayStats.present} of {modalDayStats.total} Present ({modalDayStats.rate}%)
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveDayModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Bulk Actions & Search Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkMarkModal('present')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleBulkMarkModal('absent')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Mark All Absent
                  </button>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {modalFilteredStudents.length} Students
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name or roll number..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Vertical Student List (ONLY 2 Options: Present or Absent) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
              {modalFilteredStudents.map((stu) => {
                const isPresent = (modalAttendance[stu.id] || 'present') === 'present';

                return (
                  <div 
                    key={stu.id} 
                    className="pt-2 first:pt-0 flex items-center justify-between gap-3"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={stu.avatar} 
                        alt={stu.name} 
                        className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {stu.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {stu.rollNo}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>Team {stu.groupNumber}</span>
                          <span>•</span>
                          <span className={stu.attendanceRate >= 80 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                            {stu.attendanceRate}% Overall
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ONLY 2 OPTIONS: Present or Absent */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleStudent(stu.id, 'present', stu.name)}
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Present
                      </button>

                      <button
                        onClick={() => handleToggleStudent(stu.id, 'absent', stu.name)}
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          !isPresent
                            ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer with Close Button */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="text-emerald-600 font-black">{modalDayStats.present} Present</span>
                <span className="mx-2">•</span>
                <span className="text-rose-600 font-black">{modalDayStats.absent} Absent</span>
              </div>

              <button
                onClick={() => setActiveDayModal(null)}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-700/20 transition-all cursor-pointer"
              >
                Done & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
