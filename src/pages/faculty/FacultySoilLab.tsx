import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sprout, 
  Plus, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  X,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SoilSample } from '../../types';

export const FacultySoilLab: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const currentCohortDay = school?.currentDay || 20;
  const isTheoryPhase = currentCohortDay <= 5;

  const [samples, setSamples] = useState<SoilSample[]>(storageService.getSoilSamples(school.id));
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simple form state
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('Malegaon');
  const [cropType, setCropType] = useState('Sugarcane');
  const [pH, setPH] = useState<number>(7.0);
  const [advice, setAdvice] = useState('Reduced urea dosage; applied 5 tons compost/ha.');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const handleAddSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) return;

    const sampleNum = samples.length + 1;
    const newSample: SoilSample = {
      id: `SMP-${Date.now()}`,
      sampleCode: `ARK-${school.code}-${String(sampleNum).padStart(3, '0')}`,
      schoolId: school.id,
      studentId: `${school.id}-STU-01`,
      studentName: 'Aradhya Sharma (Team 1)',
      groupNumber: 1,
      date: new Date().toISOString().split('T')[0],
      village,
      farmerName,
      farmerPhone: '+91 98221 55410',
      cropType,
      parameters: {
        pH,
        ec: 0.65,
        organicCarbon: 0.8,
        nitrogen: 240,
        phosphorus: 24,
        potassium: 260,
        moisture: 18
      },
      healthScore: pH >= 6.5 && pH <= 7.5 ? 88 : 72,
      healthCategory: pH >= 6.5 && pH <= 7.5 ? 'Good' : 'Moderate',
      reportStatus: 'Generated',
      soiLenzDeviceId: 'SLZ-2026-101'
    };

    storageService.saveSoilSample(newSample);
    setSamples(storageService.getSoilSamples(school.id));
    setShowAddModal(false);
    setFarmerName('');
    setToastNotice(`✓ Logged soil test & advisory for farmer ${farmerName}!`);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const filteredSamples = samples.filter(s =>
    s.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sampleCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-2xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Soil Tests & Farmers Visited
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                SoiLENZ Lab
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live registry of tested soil samples and community farmer consultations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Log New Soil Test
        </button>
      </div>

      {/* Theory Phase Alert if in Module 1 */}
      {isTheoryPhase && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold block text-sm">Theory Phase Active (Module 1 — Days 1 to 5):</span>
            During Module 1, students focus on classroom soil science and nutrient theory. Hands-on machine testing with farmers begins in Module 2 after optical sensor calibration.
          </div>
        </div>
      )}

      {/* Two Tally Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Soil Tests Card */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-5 text-white shadow-md border border-purple-800/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
              Soil Tests Conducted
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">
                {isTheoryPhase ? 0 : 12}
              </span>
              <span className="text-xs text-purple-200 font-semibold">Today</span>
              <span className="text-xs text-purple-300 ml-2">
                • {isTheoryPhase ? '0' : samples.length} Total (Target: 50)
              </span>
            </div>
            <p className="text-[11px] text-purple-200/80 mt-1">
              Tested on school SoiLENZ optical sensor device
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-200">
            <FlaskConical className="w-6 h-6" />
          </div>
        </div>

        {/* Farmers Reached Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-5 text-white shadow-md border border-emerald-800/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
              Farmers Reached & Advised
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">
                {isTheoryPhase ? 0 : 15}
              </span>
              <span className="text-xs text-emerald-200 font-semibold">Today</span>
              <span className="text-xs text-emerald-300 ml-2">
                • {isTheoryPhase ? '0' : '186'} Total (Target: 100)
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              Soil Health Cards issued with custom fertilizer advice
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tests & Farmers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Soil Tests & Farmer Consultations
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredSamples.length} verified sample tests
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farmer, village, crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredSamples.map((s) => (
            <div 
              key={s.id} 
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {s.farmerName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                    {s.sampleCode}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
                    {s.cropType}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {s.village}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {s.date}
                  </span>
                  <span>•</span>
                  <span>Tester: {s.studentName}</span>
                </div>
              </div>

              {/* Readouts & Health Rating */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    pH {s.parameters.pH} • EC {s.parameters.ec}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    Score: {s.healthScore}/100 ({s.healthCategory})
                  </span>
                </div>

                <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  Card Issued
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Quick Log New Test */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                Quick Log Soil Test & Farmer
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSample} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kadam"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Primary Crop
                  </label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Measured pH Reading ({pH})
                </label>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={pH}
                  onChange={(e) => setPH(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Advisory Given to Farmer
                </label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Test Record
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
