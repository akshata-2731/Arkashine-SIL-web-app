import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { School } from '../../types';
import { StatusChip } from '../../components/common/StatusChip';
import { ScoreRing } from '../../components/common/ScoreRing';
import { EligibilityModal } from '../../components/school/EligibilityModal';

export const PartnerSchools: React.FC = () => {
  const { activePartnerId } = useAuth();
  const [schools, setSchools] = useState<School[]>(
    storageService.getSchools().filter(s => s.partnerId === activePartnerId)
  );
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const refreshList = () => {
    setSchools(storageService.getSchools().filter(s => s.partnerId === activePartnerId));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Assigned Schools & Lab Setup Readiness
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Verify physical space, SoiLENZ sensor deployment, and ensure condition closures before cohort initiation.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schools.map(sch => (
          <div
            key={sch.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sch.code}
                    </span>
                    <StatusChip status={sch.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sch.name}</h3>
                  <p className="text-xs text-slate-500">{sch.city}, {sch.state}</p>
                </div>
                <ScoreRing score={sch.eligibility.score} size={64} strokeWidth={7} />
              </div>

              {/* Lab Setup Checklist status */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Lab Corner Space (280 sq ft):</span>
                  <span className="font-bold text-emerald-700">Allocated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">SoiLENZ Handheld Devices:</span>
                  <span className="font-bold text-emerald-700">2 Calibrated Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Faculty Coordinator:</span>
                  <span className="font-bold text-slate-800">{sch.facultyName}</span>
                </div>
              </div>

              {sch.eligibility.conditionsList.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Conditions Pending Resolution:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-800">
                    {sch.eligibility.conditionsList.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSchool(sch)}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                Update Eligibility & Lab Checklist
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedSchool && (
        <EligibilityModal
          school={selectedSchool}
          isOpen={true}
          onClose={() => setSelectedSchool(null)}
          onSaved={() => {
            setSelectedSchool(null);
            refreshList();
          }}
        />
      )}

    </div>
  );
};
