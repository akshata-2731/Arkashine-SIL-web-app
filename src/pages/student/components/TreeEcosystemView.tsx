import React from 'react';

interface TreeEcosystemViewProps {
  onStartModules: () => void;
  onViewBadges: () => void;
}

export const TreeEcosystemView: React.FC<TreeEcosystemViewProps> = ({
  onStartModules,
  onViewBadges
}) => {
  return (
    <div className="space-y-6">
      {/* Main Visual Dual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Giant Tree Canopy & Underground Root Network */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Living Ecosystem
              </span>
              <span className="text-xs font-semibold text-emerald-700">Canopy to Taproots 🌳</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              How Living Soil Powers Mighty Trees
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Deep tree taproots spread wide into nutrient-rich soil horizons. Healthy earthworms and mycorrhizal fungi create microscopic highways that feed water and organic minerals to the leafy canopy above.
            </p>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs mb-4 aspect-4/3">
              <img
                src="/assets/images/tree-soil-ecosystem.webp"
                alt="Canopy Tree and underground root network"
                width={400}
                height={300}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                <p className="font-bold text-purple-900">Root Network</p>
                <p className="text-[10px] text-purple-700 mt-0.5">Anchors & absorbs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="font-bold text-emerald-900">Mycorrhiza</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Nutrient exchange</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <p className="font-bold text-amber-900">Earthworms</p>
                <p className="text-[10px] text-amber-700 mt-0.5">Soil aeration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Soil Layers Horizons Diagram for Kids */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Earth Cross-Section
              </span>
              <span className="text-xs font-semibold text-slate-500">Horizons O-A-B-C 🔍</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Soil Layers Explorer (Horizons)
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Dig into the ground! From the soft organic leaf litter on top down to deep mineral subsoil and solid bedrock, each layer plays a distinct role in plant life and farm harvest.
            </p>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs mb-4 aspect-4/3">
              <img
                src="/assets/images/soil-layers-kids.webp"
                alt="Child-friendly soil layers cross section"
                width={400}
                height={300}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-emerald-900">🌱 O & A Horizon (Topsoil)</span>
                <span className="text-[11px] text-emerald-700">Richest in organic matter & N-P-K</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-100">
                <span className="font-bold text-amber-900">🪨 B Horizon (Subsoil)</span>
                <span className="text-[11px] text-amber-700">Clay, iron, and deep mineral deposits</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200">
                <span className="font-bold text-slate-800">⛰️ C & R Horizon (Bedrock)</span>
                <span className="text-[11px] text-slate-600">Weathered parent rock foundation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Lab Discovery Feature Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs shrink-0">
          <img
            src="/assets/images/student-lab-discovery.webp"
            alt="Students exploring soil discovery"
            width={256}
            height={192}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <span className="badge-theme text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 border">
            Young Soil Scientists in Action
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            Explore, Test & Protect Our Earth
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            As a Student Soil Partner, you are learning what real agronomists and environmental scientists do. By using the handheld SoiLENZ scanner to measure pH, organic carbon, and nutrients, you help local farmers grow healthier crops while protecting our trees and water resources.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onStartModules}
              className="px-4 py-2 rounded-xl btn-theme-primary text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Start Module Lessons →
            </button>
            <button
              onClick={onViewBadges}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Earned Badges 🏆
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
