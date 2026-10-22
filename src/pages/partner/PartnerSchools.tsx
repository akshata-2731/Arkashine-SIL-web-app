import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  FlaskConical, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Users
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

  const avgReadiness = schools.length > 0
    ? Math.round(schools.reduce((acc, s) => acc + s.eligibility.score, 0) / schools.length)
    : 90;

  return (
    <div className="space-y-6">
      
      {/* Pictorial Header Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Physical Infrastructure & Safety Audit
              </span>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-200">
                Avg Readiness: {avgReadiness}%
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Assigned Schools & Lab Setup Readiness
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify physical room demarcation, electrical power benches, SoiLENZ sensor deployment, certified buffer reagents, and condition closures before authorizing student cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {schools.filter(s => s.status === 'Running').length} Cohorts Active
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {schools.filter(s => s.status === 'Lab_Setup').length} Under Setup & Inspection
            </span>
            <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              6 Handheld SoiLENZ Units
            </span>
          </div>
        </div>

        <div className="w-full md:w-72 h-44 md:h-auto bg-slate-900 overflow-hidden shrink-0 border-t md:border-t-0 md:border-l border-slate-100 relative group">
          <img
            src="/assets/images/module-soil-testing.webp"
            alt="SoiLENZ device and lab testing"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white">
              SoiLENZ Handheld Spectrometry Lab
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pictorial Lab Readiness Pillars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Optical Sensors</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            2 SoiLENZ devices with dual NIR optical reflectance channels per lab.
          </p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            ✓ Factory Calibrated
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Chemical Reagents</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            pH 4.0 / 7.0 buffer standards, colorimetric dyes & extraction reagents.
          </p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            ✓ Safe Storage Verified
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Physical Space</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            280+ sq ft room, 240V power bench, sample drying trays & 2mm sieves.
          </p>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded inline-block">
            ✓ Demarcated & Clear
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Safety & Consent</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Splash goggles, nitrile gloves, eyewash bottle & signed parent slips.
          </p>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
            ✓ 100% On Record
          </span>
        </div>
      </div>

      {/* Cards - Pictorial School Labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schools.map(sch => {
          const bannerSrc = sch.bannerImage?.replace('.png', '.webp') || '/assets/images/hero-banner.webp';

          return (
            <div
              key={sch.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="h-40 w-full relative overflow-hidden bg-slate-900 border-b border-slate-100">
                  <img
                    src={bannerSrc}
                    alt={sch.name}
                    width={400}
                    height={160}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs">
                      {sch.code}
                    </span>
                    <StatusChip status={sch.status} size="sm" />
                  </div>

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-2xl shadow-2xs flex items-center gap-1.5">
                    <ScoreRing score={sch.eligibility.score} size={48} strokeWidth={6} />
                  </div>

                  <div className="absolute bottom-2.5 left-4 right-4 text-white">
                    <h3 className="text-base font-extrabold truncate drop-shadow-xs">{sch.name}</h3>
                    <p className="text-xs text-white/90 drop-shadow-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {sch.city}, {sch.state}
                    </p>
                  </div>
                </div>

                {/* Lab Setup Pictorial status */}
                <div className="p-5 space-y-3.5">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] text-purple-700 uppercase font-bold block">Lab Space</span>
                      <strong className="text-slate-800 text-xs">280 sq ft 🔬</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">SoiLENZ</span>
                      <strong className="text-emerald-900 text-xs">2 Units 📱</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="text-[10px] text-amber-700 uppercase font-bold block">Reagents</span>
                      <strong className="text-amber-900 text-xs">Certified 🧪</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Faculty Coordinator:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">{sch.facultyName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Student Cohort:</span>
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        18 Enrolled (5 Teams)
                      </span>
                    </div>
                  </div>

                  {sch.eligibility.conditionsList && sch.eligibility.conditionsList.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        Conditions Pending Closure Before Sign-off:
                      </span>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-800">
                        {sch.eligibility.conditionsList.map((cond, idx) => (
                          <li key={idx}>{cond}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedSchool(sch)}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Audit Physical Readiness Checklist ({sch.eligibility.score}%)
                </button>
              </div>
            </div>
          );
        })}
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
