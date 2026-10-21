import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
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

      {/* Cards - Pictorial School Labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schools.map(sch => (
          <div
            key={sch.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="h-36 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={sch.bannerImage?.replace('.png', '.webp') || '/assets/images/hero-banner.webp'}
                  alt={sch.name}
                  width={400}
                  height={144}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs">
                    {sch.code}
                  </span>
                  <StatusChip status={sch.status} size="sm" />
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-2xs">
                  <ScoreRing score={sch.eligibility.score} size={48} strokeWidth={6} />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="text-base font-extrabold truncate drop-shadow-xs">{sch.name}</h3>
                  <p className="text-xs text-white/90 drop-shadow-xs">📍 {sch.city}, {sch.state}</p>
                </div>
              </div>

              {/* Lab Setup Pictorial status */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] text-purple-700 uppercase font-bold block">Lab Space</span>
                    <strong className="text-slate-800 text-xs">280 sq ft 🔬</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">SoiLENZ</span>
                    <strong className="text-emerald-900 text-xs">2 Units 📱</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Reagents</span>
                    <strong className="text-amber-900 text-xs">Certified 🧪</strong>
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Assigned Faculty:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">{sch.facultyName}</span>
                </div>

                {sch.eligibility.conditionsList.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Conditions Pending Resolution:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-800">
                      {sch.eligibility.conditionsList.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedSchool(sch)}
                className="w-full py-2.5 rounded-xl btn-theme-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
