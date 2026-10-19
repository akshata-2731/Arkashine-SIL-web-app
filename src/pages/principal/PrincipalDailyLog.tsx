import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  FlaskConical, 
  Users, 
  MessageSquareQuote, 
  Save, 
  CheckCircle2, 
  Calendar,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DailyLog } from '../../types';
import { StatusChip } from '../../components/common/StatusChip';

export const PrincipalDailyLog: React.FC = () => {
  const { activeSchoolId, currentUser } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [logs, setLogs] = useState<DailyLog[]>(
    storageService.getDailyLogs(school.id)
      .filter(l => l.dayNumber <= school.currentDay)
      .sort((a, b) => b.dayNumber - a.dayNumber)
  );

  const [remarksState, setRemarksState] = useState<Record<string, string>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleRemarkChange = (logId: string, val: string) => {
    setRemarksState(prev => ({ ...prev, [logId]: val }));
  };

  const handleSaveRemark = (log: DailyLog) => {
    const remark = remarksState[log.id] || log.principalRemarks || '';
    if (!remark.trim()) return;

    log.principalRemarks = remark;
    storageService.saveDailyLog(log, currentUser.name);

    storageService.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: 'principal',
      action: 'PRINCIPAL_REMARK_ADDED',
      details: `Added principal endorsement to Day ${log.dayNumber} log: "${remark}"`,
      schoolId: school.id
    });

    setSavedNotice(`Remark saved for Day ${log.dayNumber}!`);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Faculty Daily Updates & Principal Endorsement
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Read-only chronological timeline of classroom instruction submitted by {school.facultyName}.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          Current: Day {school.currentDay} of 28
        </span>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-900 animate-in fade-in">
          {savedNotice}
        </div>
      )}

      {/* Timeline of Logs */}
      <div className="space-y-4">
        {logs.map(log => {
          const currentRemark = remarksState[log.id] !== undefined ? remarksState[log.id] : (log.principalRemarks || '');

          return (
            <div
              key={log.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Log Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-xs">
                      Day {log.dayNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <StatusChip status={log.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {log.moduleTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1 font-bold text-emerald-800">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {log.hoursTaught} hrs
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-sky-800">
                    <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                    {log.samplesTestedCount} samples
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-amber-800">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {log.farmersReachedCount} farmers
                  </span>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-700">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
                  Topics Taught & Practical Exercises:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {log.topicsCovered.map((t, idx) => (
                    <li key={idx} className="leading-snug">{t}</li>
                  ))}
                </ul>
              </div>

              {/* Photos if any */}
              {log.photos && log.photos.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {log.photos.map((p, idx) => (
                    <div key={idx} className="w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={p} alt="Lab photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Principal Remarks Box */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                  Principal Observation & Endorsement:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentRemark}
                    onChange={(e) => handleRemarkChange(log.id, e.target.value)}
                    placeholder="Enter observation, PTA feedback, or student commendation..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleSaveRemark(log)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Endorse
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
