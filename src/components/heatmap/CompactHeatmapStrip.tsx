import React from 'react';
import { School, DailyLog } from '../../types';
import { storageService } from '../../services/storageService';

interface CompactHeatmapStripProps {
  schools: School[];
  onSelectDay: (schoolId: string, day: number) => void;
}

export const CompactHeatmapStrip: React.FC<CompactHeatmapStripProps> = ({
  schools,
  onSelectDay
}) => {
  const allLogs = storageService.getDailyLogs();
  const currentProgramDay = 22;

  const runningSchools = schools.filter(s => s.status === 'Running');

  const getLogForSchoolDay = (schoolId: string, day: number): DailyLog | undefined => {
    return allLogs.find(l => l.schoolId === schoolId && l.dayNumber === day);
  };

  const getCellColor = (log?: DailyLog, day?: number) => {
    if (!log || (day && day > currentProgramDay)) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200';
    }
    switch (log.status) {
      case 'On_Time':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'Late':
        return 'bg-emerald-300 dark:bg-emerald-600/70 hover:bg-emerald-400 text-emerald-950';
      case 'Partial':
        return 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold';
      case 'Missing':
        return 'bg-rose-500 hover:bg-rose-600 text-white font-bold';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="w-full flex flex-col justify-between h-full">
      
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white leading-tight">
            28-Day Execution Heat Map
          </h4>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">
            4 Running Hubs • Day 22 Active
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-500" /> On Time
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-amber-400" /> Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-rose-500" /> Missing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-slate-200 dark:bg-slate-700" /> Upcoming
          </span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto pb-1">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
              <th className="text-left font-semibold py-1 pr-2 w-20">School</th>
              <th colSpan={7} className="text-center font-bold py-1 px-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-l-md border-r border-slate-200 dark:border-slate-700">W1</th>
              <th colSpan={7} className="text-center font-bold py-1 px-1 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-700">W2</th>
              <th colSpan={7} className="text-center font-bold py-1 px-1 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-700">W3</th>
              <th colSpan={7} className="text-center font-bold py-1 px-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-r-md">W4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {runningSchools.map(sch => (
              <tr key={sch.id} className="group">
                <td className="py-1.5 pr-2 font-mono font-bold text-slate-700 dark:text-slate-300 truncate max-w-[85px]" title={sch.name}>
                  {sch.code}
                </td>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
                  const log = getLogForSchoolDay(sch.id, day);
                  const isToday = day === currentProgramDay;
                  const colorClass = getCellColor(log, day);

                  return (
                    <td key={day} className="p-0.5 text-center">
                      <button
                        onClick={() => onSelectDay(sch.id, day)}
                        title={`Day ${day}: ${log?.status || 'Upcoming'} (${log?.topicsCovered?.[0] || 'Scheduled session'})`}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-xs flex items-center justify-center font-mono text-[9px] transition-transform hover:scale-115 cursor-pointer ${colorClass} ${
                          isToday ? 'ring-2 ring-sky-500 z-10 font-bold' : ''
                        }`}
                      >
                        {log?.status === 'Missing' ? '×' : (isToday ? '•' : '')}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Click any day to inspect full lesson history & photos</span>
        <span className="text-sky-600 dark:text-sky-400 font-semibold">• Day 22 Outlined</span>
      </div>

    </div>
  );
};
