import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Users, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Save, 
  Search 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { FarmerOutreach, Campaign } from '../../types';

export const FacultyOutreach: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [outreachList, setOutreachList] = useState<FarmerOutreach[]>(storageService.getFarmerOutreach(school.id));
  const [campaigns, setCampaigns] = useState<Campaign[]>(storageService.getCampaigns(school.id));
  const [showAddOutreach, setShowAddOutreach] = useState(false);

  // Form
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('Malegaon Budruk');
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [crop, setCrop] = useState('Sugarcane');
  const [advice, setAdvice] = useState('');

  const handleSaveOutreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) return;

    const newItem: FarmerOutreach = {
      id: `OUT-${Date.now()}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      groupNumber,
      studentNames: [`Student Group ${groupNumber} Leads`],
      village,
      farmerName,
      phone: '+91 98221 44091',
      landAreaHectares: 2.4,
      primaryCrop: crop,
      soilSampleCode: `ARK-${school.code}-024`,
      adviceGiven: advice || 'Reduced chemical urea dosing; recommended 5 tons FYM per hectare.',
      status: 'Completed'
    };

    storageService.saveFarmerOutreach(newItem);
    setOutreachList(storageService.getFarmerOutreach(school.id));
    setShowAddOutreach(false);
    setFarmerName('');
    setAdvice('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Farmer Advisory & Village Campaigns
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Track student micro-team visits to agrarian households and village awareness demonstrations.
          </p>
        </div>

        <button
          onClick={() => setShowAddOutreach(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Log Farmer Advisory Visit
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700">Recent Field Consultations</span>
          <span className="text-slate-500">5 Student Groups in Field Rotation</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {outreachList.slice(0, 15).map(item => (
            <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{item.farmerName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Group {item.groupNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{item.village}</span>
                </div>
                <p className="text-slate-600 line-clamp-1 italic">
                  "{item.adviceGiven}"
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-semibold text-slate-800 block">{item.primaryCrop} ({item.landAreaHectares} Ha)</span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showAddOutreach && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record Farmer Advisory Visit
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter farmer contact details and recommendations delivered by student team.
            </p>

            <form onSubmit={handleSaveOutreach} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Farmer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Babanrao Patil"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Group</label>
                  <select
                    value={groupNumber}
                    onChange={(e) => setGroupNumber(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Group {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Crop</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Advice & Recommendation Delivered</label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="e.g. Correct soil acidity using agricultural lime; split urea dose."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddOutreach(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Field Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
