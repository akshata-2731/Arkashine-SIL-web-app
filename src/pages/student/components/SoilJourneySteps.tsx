import React from 'react';
import { CheckCircle2, Compass, Filter, Cpu, Database, BarChart3, Activity, FileCheck, Leaf } from 'lucide-react';
import { SOIL_JOURNEY_STEPS } from '../../../data/modulesData';

interface SoilJourneyStepsProps {
  onExploreEcosystem: () => void;
}

export const SoilJourneySteps: React.FC<SoilJourneyStepsProps> = ({ onExploreEcosystem }) => {
  const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Compass, Filter, Cpu, Database, BarChart3, Activity, FileCheck, Leaf
  };

  return (
    <div className="space-y-6">
      {/* Pictorial Seedling to Canopy Banner for Kids */}
      <div className="bg-gradient-to-r from-emerald-50 via-purple-50 to-amber-50 rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex-1">
          <span className="badge-theme text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5 border">
            Kid-Friendly Soil Science 🌿
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            From Tiny Seeds to Giant Trees!
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Notice how every mighty tree depends on the hidden world of healthy soil below. Follow the 8 steps to master sampling, testing with SoiLENZ, and advising farmers!
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={onExploreEcosystem}
              className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Explore Tree Roots & Soil Horizons 🌳
            </button>
          </div>
        </div>
        <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
          <img
            src="/assets/images/seedling-sprout-journey.webp"
            alt="Seedling sprout journey"
            width={224}
            height={144}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-1">
          The 8-Step Precision Soil Testing Workflow
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Track your hands-on mastery as you advance from auger extraction in rural fields to farmer advisory.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOIL_JOURNEY_STEPS.map((st, idx) => {
            const IconComponent = stepIcons[st.iconName] || Leaf;
            const isStepUnlocked = idx < 6;

            return (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isStepUnlocked
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                      {st.step}
                    </span>
                    {isStepUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Locked</span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 mb-3 shadow-2xs">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                  <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">{st.tagline}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
