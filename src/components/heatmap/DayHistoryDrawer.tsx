import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  UserCheck, 
  FlaskConical, 
  Users, 
  MessageSquareQuote,
  ShieldAlert
} from 'lucide-react';
import { StatusChip } from '../common/StatusChip';
import { storageService } from '../../services/storageService';
import { useModalA11y } from '../../hooks/useModalA11y';

interface DayHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  dayNumber: number;
  onNavigateDay: (newDay: number) => void;
  onOpenSchoolTimeline?: (schoolId: string) => void;
}

export const DayHistoryDrawer: React.FC<DayHistoryDrawerProps> = ({
  isOpen,
  onClose,
  schoolId,
  dayNumber,
  onNavigateDay,
  onOpenSchoolTimeline
}) => {
  const { containerRef } = useModalA11y({ isOpen, onClose });

  if (!isOpen) return null;

  const school = storageService.getSchool(schoolId);
  const log = storageService.getDailyLog(schoolId, dayNumber);
  const students = storageService.getStudents(schoolId);

  const presentCount = log && log.studentAttendance 
    ? Object.values(log.studentAttendance).filter(v => v === 'present').length 
    : 0;
  const lateCount = log && log.studentAttendance 
    ? Object.values(log.studentAttendance).filter(v => v === 'late').length 
    : 0;
  const absentCount = log && log.studentAttendance 
    ? Object.values(log.studentAttendance).filter(v => v === 'absent').length 
    : 0;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-history-drawer-title"
    >
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          ref={containerRef}
          tabIndex={-1}
          className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 focus:outline-hidden"
        >
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Day {dayNumber} of 28
                </span>
                {log && <StatusChip status={log.status} />}
              </div>
              <h3 id="day-history-drawer-title" className="text-base font-bold text-slate-900 truncate">
                {school?.name || 'School Log'}
              </h3>
              <p className="text-xs text-slate-500">
                {log ? new Date(log.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) : 'No session'}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={dayNumber <= 1}
                onClick={() => onNavigateDay(dayNumber - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                disabled={dayNumber >= 28}
                onClick={() => onNavigateDay(dayNumber + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 ml-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {!log || log.status === 'Missing' ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  {dayNumber > (school?.currentDay || 0) ? 'Upcoming Session' : 'Missing Daily Log'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  {dayNumber > (school?.currentDay || 0)
                    ? `Day ${dayNumber} has not occurred yet. Program is currently active on Day ${school?.currentDay}.`
                    : 'The faculty coordinator did not submit the daily log for this working day. An alert has been flagged.'}
                </p>
                {log?.delayReason && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl text-left border border-amber-200">
                    <p className="text-xs font-semibold text-amber-800">Reported Note:</p>
                    <p className="text-xs text-amber-700 mt-0.5">{log.delayReason}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Section 1: Session & Faculty */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-slate-600">Module {log.moduleNumber}</span>
                    <span className="font-medium bg-white px-2 py-0.5 rounded border border-slate-200">{log.sessionType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{log.moduleTitle}</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {log.topicsCovered.map((t, idx) => (
                      <li key={idx} className="leading-snug">{t}</li>
                    ))}
                  </ul>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span><strong>{log.hoursTaught} hrs</strong> taught (Target: {log.plannedHours} hrs)</span>
                    </div>
                    <span className="text-slate-500">Faculty: {log.facultyName}</span>
                  </div>
                </div>

                {/* Section 2: Four Core Metric Badges */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                    <UserCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                    <span className="text-base font-bold text-emerald-900">{presentCount}/{students.length}</span>
                    <p className="text-[10px] text-emerald-700 font-medium">Students Present</p>
                  </div>
                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-center">
                    <FlaskConical className="w-4 h-4 text-sky-700 mx-auto mb-1" />
                    <span className="text-base font-bold text-sky-900">{log.samplesTestedCount}</span>
                    <p className="text-[10px] text-sky-700 font-medium">Samples Tested</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                    <Users className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                    <span className="text-base font-bold text-amber-900">{log.farmersReachedCount}</span>
                    <p className="text-[10px] text-amber-700 font-medium">Farmers Reached</p>
                  </div>
                </div>

                {/* Attendance Roster */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Student Attendance Roster
                    </h5>
                    <div className="text-[11px] flex gap-2">
                      <span className="text-emerald-700">{presentCount} Present</span>
                      <span className="text-amber-700">{lateCount} Late</span>
                      <span className="text-rose-700">{absentCount} Absent</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto text-xs">
                    {students.map(s => {
                      const att = log.studentAttendance[s.id] || 'absent';
                      return (
                        <div key={s.id} className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                              {s.groupNumber}
                            </span>
                            <span className="font-medium text-slate-800">{s.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            att === 'present' ? 'bg-emerald-100 text-emerald-800' : (att === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')
                          }`}>
                            {att.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Photos */}
                {log.photos && log.photos.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Session Photo Documentation
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {log.photos.map((p, idx) => (
                        <div key={idx} className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={p} alt="Session photo" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes & Remarks */}
                <div className="space-y-3">
                  {log.stockUsed && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                      <p className="font-semibold text-slate-700">Lab Stock Consumed:</p>
                      <p className="text-slate-600 mt-0.5">{log.stockUsed}</p>
                    </div>
                  )}

                  {log.principalRemarks && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-700" />
                        Principal Endorsement:
                      </div>
                      <p className="text-emerald-800 italic">"{log.principalRemarks}"</p>
                    </div>
                  )}

                  {log.partnerRemarks && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-blue-900 mb-1">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-blue-700" />
                        Partner Observation:
                      </div>
                      <p className="text-blue-800 italic">"{log.partnerRemarks}"</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => onOpenSchoolTimeline && onOpenSchoolTimeline(schoolId)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline"
            >
              View Full School Timeline →
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-xl hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
