import React from 'react';
import { X, Calendar, Clock, FlaskConical, Users, ArrowUpDown, ChevronDown } from 'lucide-react';
import { School, DailyLog } from '../../types';
import { storageService } from '../../services/storageService';
import { StatusChip } from '../common/StatusChip';

interface SchoolTimelineModalProps {
  schoolId: string | null;
  onClose: () => void;
  onSelectDay: (day: number) => void;
}

export const SchoolTimelineModal: React.FC<SchoolTimelineModalProps> = ({
  schoolId,
  onClose,
  onSelectDay
}) => {
  if (!schoolId) return null;

  const school = storageService.getSchool(schoolId);
  const logs = storageService.getDailyLogs(schoolId)
    .filter(l => l.dayNumber <= (school?.currentDay || 0))
    .sort((a, b) => b.dayNumber - a.dayNumber); // Newest first

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Complete School Log Timeline
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {school?.name}
            </h3>
            <p className="text-xs text-slate-500">
              {school?.city}, {school?.state} • Day {school?.currentDay} of 28
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
          {logs.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">No daily updates logged yet.</p>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                onClick={() => {
                  onClose();
                  onSelectDay(log.dayNumber);
                }}
                className="pt-4 first:pt-0 hover:bg-slate-50 p-3 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-xs">
                      Day {log.dayNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(log.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <StatusChip status={log.status} size="sm" />
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-1">
                  {log.moduleTitle}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                  {log.topicsCovered.join(' • ')}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {log.hoursTaught} hrs taught
                  </span>
                  <span className="flex items-center gap-1">
                    <FlaskConical className="w-3 h-3 text-sky-600" />
                    {log.samplesTestedCount} samples
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-600" />
                    {log.farmersReachedCount} farmers
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
