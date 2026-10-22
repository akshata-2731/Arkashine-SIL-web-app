import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Search, 
  Flame, 
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student, DailyLog } from '../../types';

export const FacultyToday: React.FC = () => {
  const navigate = useNavigate();
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
        bgClass: 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-400 border-dashed hover:border-slate-400'
      };
    }

    const log = dailyLogs.find(l => l.dayNumber === day);
    if (!log || !log.studentAttendance) {
      return {
        isFuture: false,
        present: 0,
        total,
        rate: 0,
        bgClass: 'bg-gradient-to-br from-rose-500 to-red-600 text-white border-rose-400 shadow-sm shadow-rose-500/20 hover:scale-103 hover:shadow-md'
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
        bgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white border-emerald-400 shadow-sm shadow-emerald-600/25 hover:scale-103 hover:shadow-md'
      };
    } else if (rate >= 70) {
      return {
        isFuture: false,
        present: presentCount,
        total,
        rate,
        bgClass: 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-bold border-amber-300 shadow-sm shadow-amber-500/25 hover:scale-103 hover:shadow-md'
      };
    } else {
      return {
        isFuture: false,
        present: presentCount,
        total,
        rate,
        bgClass: 'bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white border-rose-400 shadow-sm shadow-rose-600/25 hover:scale-103 hover:shadow-md'
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
    <div className="max-w-7xl mx-auto flex flex-col gap-3.5 select-none overflow-hidden">

      {/* Save Toast */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Sleek Compact Header Bar (Fits without scrolling) */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl px-5 py-3 text-white shadow-md border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 shrink-0">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Daily Attendance & 28-Day Heatmap
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 shadow-xs">
                Live
              </span>
            </div>
            <p className="text-[11px] text-purple-200/80 font-medium truncate">
              Dr. Anjali Patil • {school?.name || "St. Xavier's Model High School"} • 20 Enrolled Students
            </p>
          </div>
        </div>

        {/* Colorful Metric Capsules */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-center">
            <span className="text-[9px] uppercase font-bold text-purple-200 block tracking-wider">Timeline</span>
            <span className="text-xs font-black text-amber-300">Day {currentCohortDay} / 28</span>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-emerald-400/30 text-center">
            <span className="text-[9px] uppercase font-bold text-emerald-300 block tracking-wider">Cohort Avg</span>
            <span className="text-xs font-black text-emerald-400">{overallCohortRate}%</span>
          </div>
          <div className="bg-indigo-500/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-indigo-400/30 text-center">
            <span className="text-[9px] uppercase font-bold text-indigo-300 block tracking-wider">Cert Gate</span>
            <span className="text-xs font-black text-indigo-200">≥80%</span>
          </div>
        </div>
      </div>

      {/* Colorful Static 28-Day Attendance Heatmap (Zero Scroll) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        
        {/* Heatmap Legend & Guide Bar */}
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>28-Day Cohort Attendance Grid</span>
            <span className="text-[10px] font-normal text-slate-400">(Tap any day to mark/view)</span>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-2.5 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
              ≥85% High
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              70–84% Partial
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs" />
              &lt;70% Low
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              Upcoming
            </span>
          </div>
        </div>

        {/* 28-Day Grid (4 Rows × 7 Columns - Perfectly Fits Viewport) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
            const data = getDayCardData(day);
            const isToday = day === currentCohortDay;

            return (
              <button
                key={day}
                onClick={() => handleOpenDayModal(day)}
                type="button"
                className={`group relative p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[72px] sm:h-[76px] ${data.bgClass} ${
                  isToday ? 'ring-3 ring-purple-500 ring-offset-2 dark:ring-offset-slate-900 scale-102 z-10' : ''
                }`}
              >
                {/* Day Header with Today Badge */}
                <div className="flex items-center justify-between w-full text-[10px] font-bold leading-none">
                  <span className={data.isFuture ? 'text-slate-500' : 'opacity-95'}>
                    Day {day}
                  </span>
                  {isToday ? (
                    <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-white text-purple-900 font-black shadow-xs">
                      Today
                    </span>
                  ) : (
                    data.rate !== null && (
                      <span className="text-[9px] opacity-90 font-black">
                        {data.rate}%
                      </span>
                    )
                  )}
                </div>

                {/* Big Present Count out of Total */}
                <div className="leading-tight my-0.5">
                  <div className="text-base sm:text-lg font-black tracking-tight flex items-baseline gap-1">
                    {data.present !== null ? (
                      <>
                        <span>{data.present}</span>
                        <span className="text-[10px] font-bold opacity-75">/ {data.total}</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold opacity-40">— / {data.total}</span>
                    )}
                  </div>
                  <div className="text-[9px] font-bold opacity-80 uppercase tracking-wider">
                    {data.present !== null ? 'Present' : 'Scheduled'}
                  </div>
                </div>

                {/* Bottom Tap Indicator */}
                <div className="flex items-center justify-between w-full text-[8px] font-extrabold uppercase tracking-wider opacity-70">
                  <span>{data.isFuture ? 'Future' : 'Click to edit'}</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* POPUP MODAL: Vertical Student Attendance List (ONLY Present & Absent) */}
      {activeDayModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-600/30">
                  D{activeDayModal}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      Day {activeDayModal} Attendance Sheet
                    </h3>
                    {activeDayModal === currentCohortDay && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-600 text-white shadow-2xs">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                    {modalDayStats.present} of {modalDayStats.total} Students Present ({modalDayStats.rate}%)
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveDayModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Bulk Actions & Search Bar */}
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkMarkModal('present')}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm shadow-emerald-500/20 active:scale-98"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All Present
                  </button>
                  <button
                    onClick={() => handleBulkMarkModal('absent')}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm shadow-rose-500/20 active:scale-98"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    All Absent
                  </button>
                </div>

                <span className="text-[11px] font-bold text-slate-500">
                  {modalFilteredStudents.length} Students
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or roll no..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Vertical Student List (ONLY 2 Options: Present or Absent) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
              {modalFilteredStudents.map((stu) => {
                const isPresent = (modalAttendance[stu.id] || 'present') === 'present';

                return (
                  <div 
                    key={stu.id} 
                    className="pt-1.5 first:pt-0 flex items-center justify-between gap-3"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={stu.avatar} 
                        alt={stu.name} 
                        className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 object-cover shrink-0"
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
                          <span className={stu.attendanceRate >= 80 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {stu.attendanceRate}% Avg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ONLY 2 OPTIONS: Present or Absent */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleStudent(stu.id, 'present', stu.name)}
                        type="button"
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isPresent
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30 scale-102 ring-2 ring-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Present
                      </button>

                      <button
                        onClick={() => handleToggleStudent(stu.id, 'absent', stu.name)}
                        type="button"
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          !isPresent
                            ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-sm shadow-rose-500/30 scale-102 ring-2 ring-rose-400'
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

            {/* Modal Footer with Close Button & Direct Link to Daily Log */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/50">
              <div className="text-xs font-bold">
                <span className="text-emerald-600 font-black">{modalDayStats.present} Present</span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="text-rose-600 font-black">{modalDayStats.absent} Absent</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const day = activeDayModal;
                    setActiveDayModal(null);
                    navigate(`/faculty/lessons?day=${day}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Day {activeDayModal} Log & Photos →
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDayModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
