import React from 'react';
import { Camera, Trash2, Microscope, Users, Sparkles } from 'lucide-react';
import { useT } from '../../../i18n/useT';

interface LabProgressSectionProps {
  samplesTested: number;
  onSamplesChange: (count: number) => void;
  farmersReached: number;
  onFarmersChange: (count: number) => void;
  stockUsed: string;
  onStockChange: (val: string) => void;
  incidentNotes: string;
  onIncidentNotesChange: (val: string) => void;
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  errors?: {
    samplesTested?: string;
    farmersReached?: string;
  };
}

export const LabProgressSection: React.FC<LabProgressSectionProps> = ({
  samplesTested,
  onSamplesChange,
  farmersReached,
  onFarmersChange,
  stockUsed,
  onStockChange,
  incidentNotes,
  onIncidentNotesChange,
  photos,
  onAddPhoto,
  onRemovePhoto,
  errors
}) => {
  const { t } = useT();

  const consumablePills = [
    "SoiLENZ Cuvettes x10",
    "Quartering Bags x15",
    "pH Buffer Solution 7.0",
    "Distilled Water 500ml",
    "2mm Mesh Sieve Kit"
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Microscope className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              3. {t('nav.soillab', 'Lab Telemetry & Field Outreach Progress')}
            </h3>
            <p className="text-xs text-slate-500">
              Record SoiLENZ optical scans, farmer consults, reagents, and photo evidence
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          SoiLENZ Connected
        </span>
      </div>

      {/* Counters: Samples Tested & Farmers Consulted */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Soil Samples Tested */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-emerald-700" />
              <span>{t('log.samples_tested', 'Soil Samples Tested Today')}</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-400">Target: 4-12/day</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="200"
              value={samplesTested}
              onChange={(e) => onSamplesChange(Math.max(0, parseInt(e.target.value) || 0))}
              className={`w-24 bg-white border rounded-xl p-2 text-center text-lg font-black text-slate-900 focus:outline-hidden ${
                errors?.samplesTested ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
            <div className="flex items-center gap-1.5 flex-1">
              {[1, 5, 10].map(inc => (
                <button
                  type="button"
                  key={inc}
                  onClick={() => onSamplesChange(Math.min(200, samplesTested + inc))}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-xs font-bold text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer flex-1 text-center"
                >
                  +{inc}
                </button>
              ))}
              {samplesTested > 0 && (
                <button
                  type="button"
                  onClick={() => onSamplesChange(Math.max(0, samplesTested - 1))}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200 transition-colors cursor-pointer"
                  title="Decrease by 1"
                >
                  -1
                </button>
              )}
            </div>
          </div>

          {errors?.samplesTested && (
            <p className="text-xs font-semibold text-rose-600">
              ⚠️ {errors.samplesTested}
            </p>
          )}
        </div>

        {/* Farmers Reached */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>{t('log.farmers_reached', 'Farmers Reached & Consulted')}</span>
            </label>
            <span className="text-[10px] font-semibold text-slate-400">Target: 2-8/day</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="200"
              value={farmersReached}
              onChange={(e) => onFarmersChange(Math.max(0, parseInt(e.target.value) || 0))}
              className={`w-24 bg-white border rounded-xl p-2 text-center text-lg font-black text-slate-900 focus:outline-hidden ${
                errors?.farmersReached ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
            <div className="flex items-center gap-1.5 flex-1">
              {[1, 5, 10].map(inc => (
                <button
                  type="button"
                  key={inc}
                  onClick={() => onFarmersChange(Math.min(200, farmersReached + inc))}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 text-xs font-bold text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer flex-1 text-center"
                >
                  +{inc}
                </button>
              ))}
              {farmersReached > 0 && (
                <button
                  type="button"
                  onClick={() => onFarmersChange(Math.max(0, farmersReached - 1))}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200 transition-colors cursor-pointer"
                  title="Decrease by 1"
                >
                  -1
                </button>
              )}
            </div>
          </div>

          {errors?.farmersReached && (
            <p className="text-xs font-semibold text-rose-600">
              ⚠️ {errors.farmersReached}
            </p>
          )}
        </div>
      </div>

      {/* Consumables / Stock Used */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          {t('log.stock_used', 'Lab Consumables & Reagents Consumed Today')}
        </label>
        <input
          type="text"
          value={stockUsed}
          onChange={(e) => onStockChange(e.target.value)}
          placeholder="e.g. 10 cuvettes used, 15 sampling ziplock bags, buffer solution 20ml"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
        />
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Insert:
          </span>
          {consumablePills.map((pill, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                const updated = stockUsed.trim() ? `${stockUsed.trim()}, ${pill}` : pill;
                onStockChange(updated);
              }}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 cursor-pointer"
            >
              + {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Incident / Observation Notes */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Incident Notes, Sensor Health or Farmer Feedback (Optional)
        </label>
        <textarea
          rows={2}
          value={incidentNotes}
          onChange={(e) => onIncidentNotesChange(e.target.value)}
          placeholder="e.g. All 4 SoiLENZ sensor probes calibrated normally; village sarpanch joined practical demo."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Photo Evidence Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Field & Lab Photo Evidence ({photos.length} / 3 Uploaded)</span>
          </label>
          {photos.length < 3 && (
            <button
              type="button"
              onClick={onAddPhoto}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              + Attach Photo
            </button>
          )}
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((p, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group shadow-2xs">
                <img
                  src={p}
                  alt={`Evidence photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemovePhoto(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-xs"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">
                  Photo #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            onClick={onAddPhoto}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30 text-center cursor-pointer transition-colors space-y-1"
          >
            <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-700">Click to attach laboratory practical or village field photos</p>
            <p className="text-[10px] text-slate-400">Supports JPG, PNG up to 10MB per session</p>
          </div>
        )}
      </div>
    </div>
  );
};
