import React from 'react';
import { Camera, Trash2, AlertCircle } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
        3. {t('nav.soillab', 'Lab & Outreach Progress')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('log.samples_tested', 'Soil Samples Tested Today (SoiLENZ)')}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="200"
              value={samplesTested}
              onChange={(e) => onSamplesChange(Number(e.target.value))}
              className={`w-full bg-white border rounded-xl p-2.5 text-base font-bold text-slate-900 focus:outline-hidden ${
                errors?.samplesTested ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
          </div>
          {errors?.samplesTested && (
            <p className="text-xs font-semibold text-rose-600 mt-1.5">
              ⚠️ {errors.samplesTested}
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('log.farmers_reached', 'Farmers Reached & Consulted Today')}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="200"
              value={farmersReached}
              onChange={(e) => onFarmersChange(Number(e.target.value))}
              className={`w-full bg-white border rounded-xl p-2.5 text-base font-bold text-slate-900 focus:outline-hidden ${
                errors?.farmersReached ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
          </div>
          {errors?.farmersReached && (
            <p className="text-xs font-semibold text-rose-600 mt-1.5">
              ⚠️ {errors.farmersReached}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          {t('log.stock_used', 'Lab Reagents & Consumables Consumed')}
        </label>
        <input
          type="text"
          value={stockUsed}
          onChange={(e) => onStockChange(e.target.value)}
          placeholder={t('log.stock_placeholder', 'e.g. 15 filter papers, 120ml extractant, 2 cuvettes')}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          {t('log.incident_notes', 'Incident Notes / Safety Observations')}
        </label>
        <textarea
          rows={2}
          value={incidentNotes}
          onChange={(e) => onIncidentNotesChange(e.target.value)}
          placeholder={t('log.incident_placeholder', 'Enter any safety observations, lab equipment notes, or unexpected occurrences...')}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Photo attach preview */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-700" />
            Session Photo Upload (Max 3)
          </label>
          {photos.length < 3 && (
            <button
              type="button"
              onClick={onAddPhoto}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              + Attach Sample Photo
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
            No lab photos attached. Tap '+ Attach Sample Photo' to attach evidence.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                <img
                  src={photo.replace('.png', '.webp')}
                  alt={`Lab session evidence ${i + 1}`}
                  width={320}
                  height={180}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemovePhoto(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/70 text-white hover:bg-rose-600 transition-colors opacity-90 group-hover:opacity-100 cursor-pointer"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
