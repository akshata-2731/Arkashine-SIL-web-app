import React from 'react';
import { 
  Leaf, Users, ShieldCheck, TrendingUp, CheckCircle2, 
  Sprout, Award, MapPin, HeartHandshake, Scale 
} from 'lucide-react';

interface ESGPillarsProps {
  totalSamplesTested: number;
  totalHectares: number;
  avgPh: string;
  avgOc: string;
  totalCampaigns: number;
  totalStudentsTrained: number;
  certifiedOrReady: number;
  femalePct: number;
  malePct: number;
  femaleCount: number;
  farmersReached: number;
  villagesCovered: number;
  communityHubSchools: number;
  dailyCompliancePct: number;
  attendanceCompliancePct: number;
  totalBudgetActual: number;
  issuedCertCount: number;
  auditEventCount: number;
}

export const ESGPillars: React.FC<ESGPillarsProps> = ({
  totalSamplesTested,
  totalHectares,
  avgPh,
  avgOc,
  totalCampaigns,
  totalStudentsTrained,
  certifiedOrReady,
  femalePct,
  malePct,
  femaleCount,
  farmersReached,
  villagesCovered,
  communityHubSchools,
  dailyCompliancePct,
  attendanceCompliancePct,
  totalBudgetActual,
  issuedCertCount,
  auditEventCount
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. ENVIRONMENTAL PANEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">ENVIRONMENTAL</h3>
                <p className="text-[11px] text-slate-500">Soil ecology & climate resilience</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase">
              Pillar 1
            </span>
          </div>

          <div className="space-y-4 pt-4">
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Soil Samples Tested
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSamplesTested}</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs pilot pace
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Tested via handheld SoiLENZ sensor</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Hectares & Farms Covered
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalHectares} Ha</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 180+ farm parcels
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Precision GPS zoned and sampled</p>
            </div>

            <div className="p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100/80 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                Soil Health Improvement Delta
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">Average pH</span>
                  <span className="font-extrabold text-slate-900 text-base">{avgPh}</span>
                  <span className="text-[10px] text-emerald-700 block">Neutral band</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Organic Carbon</span>
                  <span className="font-extrabold text-emerald-800 text-base">{avgOc}%</span>
                  <span className="text-[10px] text-emerald-700 block">+50% rel. rise</span>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-100 text-[11px] text-slate-600 flex justify-between">
                <span>N-P-K Status:</span>
                <span className="font-bold text-emerald-800">Balanced (Medium-Optimal)</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Sustainable Farming Campaigns
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCampaigns}</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% target met
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Village demos on organic carbon & soil biology</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>~14.2 Metric Tons synthetic urea runoff eliminated</span>
        </div>
      </div>

      {/* 2. SOCIAL PANEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">SOCIAL EQUITY</h3>
                <p className="text-[11px] text-slate-500">Youth STEM & farmer livelihoods</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-full uppercase">
              Pillar 2
            </span>
          </div>

          <div className="space-y-4 pt-4">
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Students Trained & Certified
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalStudentsTrained}</span>
                <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {certifiedOrReady} Cert-Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">72 hours instruction per student</p>
            </div>

            <div className="p-3.5 bg-sky-50/40 rounded-2xl border border-sky-100/80">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
                Gender Parity in Agritech
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {femalePct}% <span className="text-sm font-semibold text-slate-500">Girls</span> : {malePct}% <span className="text-sm font-semibold text-slate-500">Boys</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 52:48 Parity
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{femaleCount} girls breaking ground in precision agriculture</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Farmers Reached with Advisory
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{farmersReached}</span>
                <span className="text-xs font-semibold text-amber-700">
                  89.3% of 1,500 Target
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: '89.3%' }} />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Villages & Community Hubs
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{villagesCovered}</span>
                <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {communityHubSchools} School Labs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Schools transformed into community soil clinics</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-sky-800 font-semibold flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-sky-600" />
          <span>89% farmers adopted customized fertilizer recommendations</span>
        </div>
      </div>

      {/* 3. GOVERNANCE PANEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">GOVERNANCE</h3>
                <p className="text-[11px] text-slate-500">Compliance, audit & budget</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full uppercase">
              Pillar 3
            </span>
          </div>

          <div className="space-y-4 pt-4">
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Daily Update Compliance %
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dailyCompliancePct}%</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.1% MoM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Submissions verified within 48h lock window</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Attendance Compliance Rate
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{attendanceCompliancePct}%</span>
                <span className="text-xs font-semibold text-emerald-700">
                  +8.6% above 80% bar
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Automated at-risk flagging enabled</p>
            </div>

            <div className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100/80">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Budget Disbursed vs Ceiling
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  ₹{(totalBudgetActual / 100000).toFixed(2)}L <span className="text-xs font-normal text-slate-500">/ ₹5.00L</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  3.5% under ceiling
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">29 planned vs actual lines strictly tracked</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">QR Certificates Issued:</span>
                <span className="font-bold text-emerald-700">{issuedCertCount} Publicly Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Immutable Audit Log:</span>
                <span className="font-bold text-slate-800">{auditEventCount} Events Logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parental Minor Consent:</span>
                <span className="font-bold text-emerald-700">100% On File (DPDP Compliant)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-amber-600" />
          <span>Zero compliance infractions across all school pilots</span>
        </div>
      </div>
    </div>
  );
};
