import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  FlaskConical, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Activity,
} from 'lucide-react';

interface NutrientStatus {
  name: string;
  symbol: string;
  role: string;
  getAvailability: (ph: number) => { percent: number; status: 'optimal' | 'moderate' | 'locked'; note: string };
}

const NUTRIENT_METRICS: NutrientStatus[] = [
  {
    name: 'Nitrogen',
    symbol: 'N',
    role: 'Leaf greening & vegetative foliage growth',
    getAvailability: (ph: number) => {
      if (ph < 5.5) return { percent: 35, status: 'locked', note: 'Acid lock: Microbes cannot convert ammonium to nitrate' };
      if (ph <= 8.0) return { percent: 95, status: 'optimal', note: 'Peak bioavailability for rapid protein synthesis' };
      return { percent: 60, status: 'moderate', note: 'Ammonia volatilization loss at high alkalinity' };
    }
  },
  {
    name: 'Phosphorus',
    symbol: 'P',
    role: 'Early root branching & flower seed development',
    getAvailability: (ph: number) => {
      if (ph < 6.0) return { percent: 25, status: 'locked', note: 'Bound tightly to toxic Aluminum & Iron oxides' };
      if (ph <= 7.5) return { percent: 98, status: 'optimal', note: 'Maximum ionic orthophosphate (H2PO4-) uptake' };
      return { percent: 30, status: 'locked', note: 'Precipitates as insoluble Calcium Phosphate crystals' };
    }
  },
  {
    name: 'Potassium',
    symbol: 'K',
    role: 'Stalk strength, water regulation & disease shield',
    getAvailability: (ph: number) => {
      if (ph < 5.5) return { percent: 45, status: 'locked', note: 'Leached easily in acidic low-CEC sandy soil' };
      if (ph <= 8.5) return { percent: 92, status: 'optimal', note: 'Freely exchangeable K+ ions at root surface' };
      return { percent: 65, status: 'moderate', note: 'Competes with excess sodium and calcium ions' };
    }
  },
  {
    name: 'Micronutrients (Fe, Zn, Mn)',
    symbol: 'Fe·Zn',
    role: 'Chlorophyll enzymes & grain formation',
    getAvailability: (ph: number) => {
      if (ph < 6.5) return { percent: 95, status: 'optimal', note: 'High solubility in acidic conditions' };
      if (ph <= 7.5) return { percent: 75, status: 'optimal', note: 'Balanced enzymatic trace availability' };
      return { percent: 15, status: 'locked', note: 'Severe alkaline lockout: Leaves suffer interveinal chlorosis' };
    }
  },
  {
    name: 'Beneficial Soil Microbes',
    symbol: 'Biomass',
    role: 'Decomposing organic matter & unlocking natural minerals',
    getAvailability: (ph: number) => {
      if (ph < 5.8) return { percent: 30, status: 'locked', note: 'Bacteria go dormant; fungi dominate under harsh acid' };
      if (ph <= 7.6) return { percent: 100, status: 'optimal', note: 'Thriving mycorrhizal fungi & nitrogen-fixing rhizobia' };
      return { percent: 40, status: 'locked', note: 'Enzyme denaturation in saline alkaline soils' };
    }
  }
];

interface ScientificSoilLabProps {
  onNavigateToModules?: () => void;
}

export const ScientificSoilLab: React.FC<ScientificSoilLabProps> = ({ onNavigateToModules }) => {
  const [ph, setPh] = useState<number>(6.8);
  const [activeMode, setActiveMode] = useState<'comparison' | 'phSpectrum'>('comparison');
  const [blindTab, setBlindTab] = useState<'blind' | 'tested'>('tested');

  // Scientific diagnosis from pH
  const getPhDiagnosis = () => {
    if (ph < 5.5) {
      return {
        label: 'Strongly Acidic',
        badge: 'Critical Acidity',
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        summary: 'Toxic Aluminum & Manganese dissolve, destroying tender feeder roots.',
        rootState: 'Burnt, short, blackened root tips',
        remedy: 'Apply Agricultural Lime (CaCO3) to neutralize acid and liberate Phosphorus.',
        hex: '#DC2626'
      };
    } else if (ph < 6.5) {
      return {
        label: 'Moderately Acidic',
        badge: 'Sub-Optimal Zone',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        summary: 'Suitable for tea and potatoes, but reduces yield in wheat, rice, and pulses.',
        rootState: 'Sluggish branching, slow phosphorus intake',
        remedy: 'Apply Dolomite or well-rotted vermicompost to buffer soil toward pH 6.8.',
        hex: '#D97706'
      };
    } else if (ph <= 7.5) {
      return {
        label: 'Optimal Agronomic Zone',
        badge: '100% Nutrient Peak',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        summary: 'All 14 plant nutrients are in free, bio-available ionic form. Maximum crop yield!',
        rootState: 'Lush, dense web of white feeder roots with active nodules',
        remedy: 'Maintain with organic carbon mulch and balanced N-P-K maintenance doses.',
        hex: '#16A34A'
      };
    } else if (ph <= 8.5) {
      return {
        label: 'Moderately Alkaline',
        badge: 'Trace Lockout',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        summary: 'Excess Calcium binds with Phosphorus; leaves turn yellow due to Iron lockout.',
        rootState: 'Thickened brittle roots; micronutrient deficiency',
        remedy: 'Apply Agricultural Gypsum (CaSO4) and farmyard manure to release soil sodium.',
        hex: '#2563EB'
      };
    } else {
      return {
        label: 'Severe Sodic Alkaline',
        badge: 'High Salinity Risk',
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        summary: 'Soil particles disperse, sealing pore space. Rainwater cannot infiltrate.',
        rootState: 'Suffocated roots due to lack of oxygen in compacted soil',
        remedy: 'Deep tillage with heavy Gypsum and sulfur flushing before planting.',
        hex: '#9333EA'
      };
    }
  };

  const diagnosis = getPhDiagnosis();

  return (
    <div className="space-y-6">
      
      {/* Scientific Lab Master Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#162036] to-[#0d281e] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Scientific Soil Physiology • Arkashine Lab</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Soil Testing is Essential
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Applying chemical fertilizers without testing is like taking medicine without a doctor's prescription. Testing reveals exact nutrient chemistry and soil pH in 15 minutes.
            </p>

            {/* 3 Scientific Advantage Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-emerald-300 text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +20% Crop Yield
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-amber-300 text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> -15% Input Cost
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs text-purple-300 text-xs font-bold border border-white/10 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" /> 15-Minute Optical Scan
              </span>
            </div>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex sm:flex-col gap-2 shrink-0 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
            <button
              onClick={() => setActiveMode('comparison')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                activeMode === 'comparison'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>1. Blind vs. Precision Agronomy</span>
            </button>
            <button
              onClick={() => setActiveMode('phSpectrum')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                activeMode === 'phSpectrum'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>2. Scientific pH Lockout Meter</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Blind vs. Precision Soil Testing (Deeply Scientific) */}
      {activeMode === 'comparison' && (
        <div className="space-y-6">
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 inline-flex shadow-2xs">
              <button
                onClick={() => setBlindTab('tested')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  blindTab === 'tested'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Precision Soil Tested (SoiLENZ)
              </button>
              <button
                onClick={() => setBlindTab('blind')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  blindTab === 'blind'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Blind Farming (Without Test)
              </button>
            </div>
          </div>

          {/* Interactive Scientific Comparison Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Visual Graphic & Field Impact (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-6 border transition-all flex flex-col justify-between text-white ${
              blindTab === 'tested'
                ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/40 shadow-md'
                : 'bg-gradient-to-b from-rose-950 via-slate-900 to-rose-900 border-rose-500/40 shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                    blindTab === 'tested' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}>
                    {blindTab === 'tested' ? '✓ Scientific Precision' : '⚠ High Danger & Loss'}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {blindTab === 'tested' ? 'Optimal Agronomy' : 'Guesswork Farming'}
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 mb-4 bg-slate-950">
                  <img
                    src={blindTab === 'tested' ? '/assets/images/poster-soil-partner.png' : '/assets/images/poster-why-test-soil.png'}
                    alt="Scientific soil comparison"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-xs font-bold text-white">
                    {blindTab === 'tested'
                      ? 'Lush green canopy, active roots & balanced nutrients'
                      : 'Yellow stunted crop, fertilizer burn & chemical runoff'}
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white">
                  {blindTab === 'tested' ? 'Targeted Nutrition Delivery' : 'The Fertilizer Trap'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {blindTab === 'tested'
                    ? 'SoiLENZ tests pH, EC and N-P-K in 15 minutes, giving farmers an exact micro-dosage card.'
                    : 'Farmers apply excess synthetic urea blindly. Crops burn, soil acidifies, and profit drops.'}
                </p>
              </div>

              {/* Key Scientific Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs text-center">
                  <span className="text-lg font-black block text-emerald-300">
                    {blindTab === 'tested' ? '+20%' : '-35%'}
                  </span>
                  <span className="text-[10px] text-slate-300">Yield Outcome</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs text-center">
                  <span className="text-lg font-black block text-amber-300">
                    {blindTab === 'tested' ? '-₹4,500' : '+₹12,000'}
                  </span>
                  <span className="text-[10px] text-slate-300">Input Waste / Acre</span>
                </div>
              </div>
            </div>

            {/* Scientific Breakdown (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#5C26C0]" />
                  What Happens in the Soil Matrix?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Scientific comparison of chemical reactions, groundwater impact, and root biology.
                </p>

                <div className="space-y-3">
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    blindTab === 'tested' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        blindTab === 'tested' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {blindTab === 'tested' ? 'Optimal Root Absorption (No Salt Shock)' : 'Feeder Root Salt Burn & Stunting'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {blindTab === 'tested'
                            ? 'Nutrients enter the plant via osmotic equilibrium without scorching sensitive microscopic root hairs.'
                            : 'Excess chemical nitrogen creates high osmotic pressure, pulling water OUT of roots and causing root scorching.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    blindTab === 'tested' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        blindTab === 'tested' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {blindTab === 'tested' ? 'Zero Toxic Groundwater Runoff' : 'Nitrate Leaching into Drinking Aquifers'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {blindTab === 'tested'
                            ? 'Every kilogram applied is absorbed by crop foliage, preventing environmental contamination.'
                            : 'Unabsorbed synthetic nitrates wash into village ponds and tube-wells, causing toxic algae blooms and water pollution.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    blindTab === 'tested' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        blindTab === 'tested' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {blindTab === 'tested' ? 'Microbial & Earthworm Ecology Thrives' : 'Earthworms Die & Soil Acidifies'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {blindTab === 'tested'
                            ? 'Balanced organic carbon and neutral pH support billions of mycorrhizae fungi that trade minerals for plant sugars.'
                            : 'Repeated synthetic fertilizer overdoses kill earthworms and acidify the soil below pH 5.0, creating dead dirt.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button to explore pH */}
              <button
                onClick={() => setActiveMode('phSpectrum')}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Now Explore the Scientific pH Lockout Scale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: The Scientific pH Spectrum & Nutrient Lockout Meter */}
      {activeMode === 'phSpectrum' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 bg-purple-50 text-[#5C26C0] border border-purple-200">
                Liebig’s Law of Minimum • Soil Chemistry
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Soil pH & The Nutrient Lockout Spectrum
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Even if soil is full of fertilizer, the wrong pH chemically locks nutrients so plant roots cannot drink them.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <button
                onClick={() => setPh(5.0)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
              >
                Acidic (5.0)
              </button>
              <button
                onClick={() => setPh(6.8)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                Optimal (6.8)
              </button>
              <button
                onClick={() => setPh(8.5)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 cursor-pointer"
              >
                Alkaline (8.5)
              </button>
            </div>
          </div>

          {/* Interactive Scientific pH Slider Controls */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#5C26C0]" />
                Drag to Test Soil pH:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  pH {ph.toFixed(1)}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${diagnosis.color}`}>
                  {diagnosis.badge}
                </span>
              </div>
            </div>

            {/* Rainbow Spectrum Bar */}
            <div className="relative pt-2">
              <div 
                className="h-4 rounded-full w-full shadow-inner"
                style={{
                  background: 'linear-gradient(to right, #DC2626 0%, #EA580C 20%, #EAB308 35%, #16A34A 50%, #065F46 65%, #2563EB 80%, #9333EA 100%)'
                }}
              />
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full absolute inset-0 opacity-0 cursor-pointer h-8"
              />
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-1.5 px-1">
                <span>4.0 (Toxic Acid)</span>
                <span>6.0</span>
                <span className="text-emerald-700 font-black">6.8 (Arkashine Gold)</span>
                <span>8.0</span>
                <span>10.0 (High Sodic)</span>
              </div>
            </div>

            {/* Real-time Chemical Diagnosis Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Soil Condition:
                </span>
                <p className="text-xs font-extrabold text-slate-900">
                  {diagnosis.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {diagnosis.summary}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Feeder Root Status:
                </span>
                <p className="text-xs font-bold text-slate-800">
                  {diagnosis.rootState}
                </p>
              </div>

              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-0.5">
                  Scientific Farmer Remedy:
                </span>
                <p className="text-xs font-bold text-emerald-900">
                  {diagnosis.remedy}
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Bio-Availability Spectrum Bars (The Science of NPK vs pH) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
              <span>Bio-Available Plant Nutrient Absorption at pH {ph.toFixed(1)}:</span>
              <span className="text-[11px] font-normal text-slate-400">Green = Available • Red = Chemically Locked Out</span>
            </h3>

            <div className="space-y-2.5">
              {NUTRIENT_METRICS.map((nutrient) => {
                const metric = nutrient.getAvailability(ph);
                const isOptimal = metric.status === 'optimal';
                const isLocked = metric.status === 'locked';

                return (
                  <div
                    key={nutrient.name}
                    className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="w-48 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                          isOptimal ? 'bg-emerald-100 text-emerald-900' : (isLocked ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900')
                        }`}>
                          {nutrient.symbol}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{nutrient.name}</h4>
                          <span className={`text-[10px] font-bold ${
                            isOptimal ? 'text-emerald-700' : (isLocked ? 'text-rose-700' : 'text-amber-700')
                          }`}>
                            {metric.percent}% Bio-Available
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nutrient Availability Bar */}
                    <div className="flex-1 space-y-1">
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isOptimal ? 'bg-emerald-500' : (isLocked ? 'bg-rose-500' : 'bg-amber-500')
                          }`}
                          style={{ width: `${metric.percent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {metric.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {onNavigateToModules && (
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={onNavigateToModules}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <span>Proceed to Study Modules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
