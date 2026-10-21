import React, { useState } from 'react';
import { 
  Info,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { School, Role } from '../../types';
import { storageService } from '../../services/storageService';
import { DayHistoryDrawer } from './DayHistoryDrawer';

export type HeatmapMetric = 'updates' | 'teaching' | 'attendance' | 'outreach';

interface CalendarHeatmapProps {
  schools: School[];
  role?: Role;
  singleSchoolId?: string;
  onSelectSchoolTimeline?: (schoolId: string) => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  schools,
  role: _role = 'arkashine',
  singleSchoolId,
  onSelectSchoolTimeline
}) => {
  const [metric, setMetric] = useState<HeatmapMetric>('updates');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [activeCell, setActiveCell] = useState<{ schoolId: string; day: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ schoolId: string; day: number; summary: string } | null>(null);

  // Filter schools
  const visibleSchools = schools.filter(s => {
    if (singleSchoolId) return s.id === singleSchoolId;
    if (s.status !== 'Running' && s.status !== 'Completed') return false;
    return true;
  });

  const allLogs = storageService.getDailyLogs();

  // Days range (28 program days, 4 weeks of 7 days)
  const allDays = Array.from({ length: 28 }, (_, i) => i + 1);
  const displayedDays = selectedWeek === 'all' 
    ? allDays 
    : allDays.filter(d => Math.ceil(d / 7) === selectedWeek);

  // Helper to evaluate cell status and colors
  const getCellData = (schoolId: string, day: number) => {
    const log = allLogs.find(l => l.schoolId === schoolId && l.dayNumber === day);
    const school = schools.find(s => s.id === schoolId);
    const isFuture = day > (school?.currentDay || 0);

    if (isFuture) {
      return {
        bg: 'bg-slate-100 hover:bg-slate-200 text-slate-400',
        label: 'Upcoming',
        summary: `Day ${day}: Upcoming scheduled session`
      };
    }

    if (!log || log.status === 'Missing') {
      return {
        bg: 'bg-rose-500 hover:bg-rose-600 text-white',
        label: 'Missing',
        summary: `Day ${day}: Log MISSING (Alert flagged)`
      };
    }

    if (metric === 'updates') {
      if (log.status === 'On_Time') {
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          label: 'On Time',
          summary: `Day ${day}: Submitted on-time by ${log.facultyName}`
        };
      } else if (log.status === 'Late') {
        return {
          bg: 'bg-emerald-400 hover:bg-emerald-500 text-slate-900',
          label: 'Late Submission',
          summary: `Day ${day}: Submitted late (${log.delayReason || 'delay'})`
        };
      } else {
        return {
          bg: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
          label: 'Partial',
          summary: `Day ${day}: Partial log (${log.hoursTaught} hrs taught)`
        };
      }
    }

    if (metric === 'teaching') {
      if (log.hoursTaught >= 2.5) {
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          label: `${log.hoursTaught}h (Target Met)`,
          summary: `Day ${day}: ${log.hoursTaught} hrs taught (${log.sessionType})`
        };
      } else if (log.hoursTaught > 0) {
        return {
          bg: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
          label: `${log.hoursTaught}h (Partial)`,
          summary: `Day ${day}: Only ${log.hoursTaught} hrs taught`
        };
      } else {
        return {
          bg: 'bg-rose-500 hover:bg-rose-600 text-white',
          label: '0h (No Class)',
          summary: `Day ${day}: 0 hours logged`
        };
      }
    }

    if (metric === 'attendance') {
      const presentCount = Object.values(log.studentAttendance || {}).filter(v => v === 'present').length;
      const total = Object.keys(log.studentAttendance || {}).length || 18;
      const rate = Math.round((presentCount / total) * 100);

      if (rate >= 85) {
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          label: `${rate}% Att.`,
          summary: `Day ${day}: Attendance ${rate}% (${presentCount}/${total})`
        };
      } else if (rate >= 70) {
        return {
          bg: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
          label: `${rate}% Att.`,
          summary: `Day ${day}: Attendance ${rate}% (Below 80% threshold)`
        };
      } else {
        return {
          bg: 'bg-rose-500 hover:bg-rose-600 text-white',
          label: `${rate}% Att.`,
          summary: `Day ${day}: Attendance critical ${rate}%`
        };
      }
    }

    if (metric === 'outreach') {
      if (log.farmersReachedCount >= 30) {
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          label: `${log.farmersReachedCount} farmers`,
          summary: `Day ${day}: Reached ${log.farmersReachedCount} farmers (High Outreach)`
        };
      } else if (log.farmersReachedCount > 0) {
        return {
          bg: 'bg-emerald-400 hover:bg-emerald-500 text-slate-900',
          label: `${log.farmersReachedCount} farmers`,
          summary: `Day ${day}: Reached ${log.farmersReachedCount} farmers`
        };
      } else {
        return {
          bg: 'bg-slate-200 hover:bg-slate-300 text-slate-600',
          label: '0 farmers',
          summary: `Day ${day}: No outreach session scheduled`
        };
      }
    }

    return { bg: 'bg-slate-100 text-slate-400', label: 'N/A', summary: `Day ${day}` };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Heatmap Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">
              Program Compliance & Activity Heat Map
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time daily telemetry across all 28 program days. Click any cell for deep-dive history.
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setMetric('updates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === 'updates' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Updates
          </button>
          <button
            onClick={() => setMetric('teaching')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === 'teaching' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teaching Hours
          </button>
          <button
            onClick={() => setMetric('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === 'attendance' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Attendance
          </button>
          <button
            onClick={() => setMetric('outreach')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === 'outreach' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Farmer Outreach
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Week:</span>
          {(['all', 1, 2, 3, 4] as const).map(w => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedWeek === w
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {w === 'all' ? 'All 4 Weeks' : `Week ${w}`}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span>On Time / Met</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
            <span>Missing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block" />
            <span>Upcoming / Rest</span>
          </div>
        </div>
      </div>

      {/* Matrix Table with Sticky School Column */}
      <div className="relative overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
              <th className="sticky left-0 z-10 bg-slate-50 p-3 min-w-[200px] border-r border-slate-200">
                School Name
              </th>
              {displayedDays.map(d => (
                <th key={d} className="p-2 text-center min-w-[34px] max-w-[38px] border-r border-slate-100">
                  <div className="text-[10px] text-slate-400">D</div>
                  <div>{d}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {visibleSchools.map(school => (
              <tr key={school.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Sticky School Header Cell */}
                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 p-3 font-medium text-slate-800 border-r border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => onSelectSchoolTimeline && onSelectSchoolTimeline(school.id)}
                      className="text-left font-semibold text-emerald-900 hover:text-emerald-700 hover:underline truncate"
                      title="Click to view full school timeline"
                    >
                      {school.name}
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    <span>{school.city}, {school.state}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">Day {school.currentDay}/28</span>
                  </div>
                </td>

                {/* Day Cells */}
                {displayedDays.map(day => {
                  const cell = getCellData(school.id, day);
                  return (
                    <td key={day} className="p-1 text-center border-r border-slate-100">
                      <button
                        onClick={() => setActiveCell({ schoolId: school.id, day })}
                        onMouseEnter={() => setHoveredCell({ schoolId: school.id, day, summary: cell.summary })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onFocus={() => setHoveredCell({ schoolId: school.id, day, summary: cell.summary })}
                        onBlur={() => setHoveredCell(null)}
                        className={`w-7 h-7 rounded-md ${cell.bg} flex items-center justify-center mx-auto text-[10px] font-bold transition-transform active:scale-90 shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-1 cursor-pointer`}
                        aria-label={`${school.name}, Day ${day}: ${cell.label}. ${cell.summary}`}
                        title={cell.summary}
                      >
                        {day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Tooltip / Status Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2 truncate">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="truncate">
            {hoveredCell 
              ? hoveredCell.summary 
              : 'Hover over any day cell to inspect; tap or click to open the complete Day History Drawer.'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
          Showing {visibleSchools.length} active schools
        </span>
      </div>

      {/* Day History Drawer Modal */}
      {activeCell && (
        <DayHistoryDrawer
          isOpen={true}
          onClose={() => setActiveCell(null)}
          schoolId={activeCell.schoolId}
          dayNumber={activeCell.day}
          onNavigateDay={(newDay) => setActiveCell({ ...activeCell, day: newDay })}
          onOpenSchoolTimeline={(schId) => {
            setActiveCell(null);
            if (onSelectSchoolTimeline) onSelectSchoolTimeline(schId);
          }}
        />
      )}
    </div>
  );
};
