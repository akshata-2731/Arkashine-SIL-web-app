import React from 'react';
import { Student } from '../../../types';
import { useT } from '../../../i18n/useT';

interface StudentAttendanceSectionProps {
  students: Student[];
  attendance: Record<string, 'present' | 'absent' | 'late'>;
  onToggleAttendance: (studentId: string) => void;
  onMarkAll: (status: 'present' | 'absent' | 'late') => void;
  error?: string;
}

export const StudentAttendanceSection: React.FC<StudentAttendanceSectionProps> = ({
  students,
  attendance,
  onToggleAttendance,
  onMarkAll,
  error
}) => {
  const { t } = useT();

  const presentCount = Object.values(attendance).filter(st => st === 'present' || st === 'late').length;
  const enrolledCount = students.length;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. {t('log.attendance_title', 'Student Attendance Tracking')}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {presentCount} / {enrolledCount} {t('log.present_count', 'Present')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Tap any student card to toggle: Present → Late → Absent</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => onMarkAll('present')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer"
          >
            {t('log.mark_all_present', 'All Present')}
          </button>
          <button
            type="button"
            onClick={() => onMarkAll('absent')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-semibold hover:bg-rose-100 cursor-pointer"
          >
            {t('log.mark_all_absent', 'Clear')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
          ⚠️ {error}
        </div>
      )}

      {/* Student Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
        {students.map(s => {
          const status = attendance[s.id] || 'present';
          const colorClass = status === 'present'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
            : (status === 'late' ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'bg-rose-50 border-rose-300 text-rose-950');

          return (
            <button
              type="button"
              key={s.id}
              onClick={() => onToggleAttendance(s.id)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 min-h-[50px] cursor-pointer ${colorClass}`}
            >
              <div className="min-w-0 pr-1">
                <p className="text-xs truncate">{s.name}</p>
                <span className="text-[10px] opacity-75">T{s.groupNumber} • {s.rollNo}</span>
              </div>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white/80 shrink-0">
                {status[0].toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
