import React, { useState } from 'react';
import { Users, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
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
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const enrolledCount = students.length;
  const presentCount = Object.values(attendance).filter(st => st === 'present').length;
  const lateCount = Object.values(attendance).filter(st => st === 'late').length;
  const absentCount = Object.values(attendance).filter(st => st === 'absent').length;
  const effectivePresent = presentCount + lateCount;
  const attendancePct = enrolledCount > 0 ? Math.round((effectivePresent / enrolledCount) * 100) : 0;

  const filteredStudents = students.filter(s => {
    const matchesGroup = selectedGroup === 'all' || s.groupNumber === selectedGroup;
    const matchesSearch = !searchTerm.trim() || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5C26C0] flex items-center justify-center font-bold">
            <Users className="w-4 h-4 text-[#5C26C0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                2. {t('log.attendance_title', 'Daily Student Attendance Tracking')}
              </h3>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {attendancePct}% Present
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tap any student card to toggle: 🟢 Present → 🟡 Late → 🔴 Absent
            </p>
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => onMarkAll('present')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Present</span>
          </button>
          <button
            type="button"
            onClick={() => onMarkAll('late')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>All Late</span>
          </button>
          <button
            type="button"
            onClick={() => onMarkAll('absent')}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear / Absent</span>
          </button>
        </div>
      </div>

      {/* Visual Live Attendance Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {presentCount} Present
            </span>
            <span className="text-amber-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              {lateCount} Late
            </span>
            <span className="text-rose-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              {absentCount} Absent
            </span>
          </div>
          <span className="text-slate-700 font-mono">
            {effectivePresent} / {enrolledCount} Students ({attendancePct}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
          <div 
            style={{ width: `${enrolledCount > 0 ? (presentCount / enrolledCount) * 100 : 0}%` }} 
            className="h-full bg-emerald-500 transition-all duration-300"
          />
          <div 
            style={{ width: `${enrolledCount > 0 ? (lateCount / enrolledCount) * 100 : 0}%` }} 
            className="h-full bg-amber-400 transition-all duration-300"
          />
          <div 
            style={{ width: `${enrolledCount > 0 ? (absentCount / enrolledCount) * 100 : 0}%` }} 
            className="h-full bg-rose-400 transition-all duration-300"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Group tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Groups ({students.length})
          </button>
          {[1, 2, 3, 4, 5].map(grp => {
            const count = students.filter(s => s.groupNumber === grp).length;
            if (count === 0) return null;
            return (
              <button
                type="button"
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedGroup === grp ? 'bg-emerald-700 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grp {grp} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or roll..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
          ⚠️ {error}
        </div>
      )}

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1 scrollbar-thin">
        {filteredStudents.map(s => {
          const status = attendance[s.id] || 'present';
          
          let cardStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:border-emerald-400';
          let statusBadge = 'bg-emerald-600 text-white';
          let statusText = 'Present';

          if (status === 'late') {
            cardStyle = 'bg-amber-50/80 border-amber-300 text-amber-950 hover:border-amber-400';
            statusBadge = 'bg-amber-500 text-white';
            statusText = 'Late';
          } else if (status === 'absent') {
            cardStyle = 'bg-rose-50/70 border-rose-300 text-rose-950 hover:border-rose-400';
            statusBadge = 'bg-rose-600 text-white';
            statusText = 'Absent';
          }

          const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2);

          return (
            <button
              type="button"
              key={s.id}
              onClick={() => onToggleAttendance(s.id)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 cursor-pointer shadow-2xs ${cardStyle}`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">{s.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Grp {s.groupNumber} • {s.rollNo}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg shrink-0 shadow-2xs ${statusBadge}`}>
                {statusText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
