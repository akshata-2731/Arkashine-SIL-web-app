import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileCheck2, 
  Save, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SoilSample } from '../../types';

export const FacultySoilLab: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [samples, setSamples] = useState<SoilSample[]>(storageService.getSoilSamples(school.id));
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New sample form state
  const [village, setVillage] = useState('Malegaon Budruk');
  const [farmerName, setFarmerName] = useState('');
  const [cropType, setCropType] = useState('Sugarcane');
  const [pH, setPH] = useState<number>(7.2);
  const [ec, setEC] = useState<number>(0.65);
  const [oc, setOC] = useState<number>(0.82);
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(24);
  const [potassium, setPotassium] = useState<number>(260);

  const handleAddSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) return;

    const sampleNum = samples.length + 1;
    const newSample: SoilSample = {
      id: `SMP-${Date.now()}`,
      sampleCode: `ARK-${school.code}-${String(sampleNum).padStart(3, '0')}`,
      schoolId: school.id,
      studentId: `${school.id}-STU-01`,
      studentName: 'Ananya Sharma (Group 1)',
      groupNumber: 1,
      date: new Date().toISOString().split('T')[0],
      village,
      farmerName,
      farmerPhone: '+91 98221 55410',
      cropType,
      parameters: {
        pH,
        ec,
        organicCarbon: oc,
        nitrogen,
        phosphorus,
        potassium,
        moisture: 18,
        micronutrients: { zinc: 0.8, iron: 5.2, sulfur: 12, boron: 0.5 }
      },
      healthScore: 82,
      healthCategory: 'Good',
      reportStatus: 'Generated',
      soiLenzDeviceId: 'SLZ-2026-101'
    };

    storageService.saveSoilSample(newSample);
    setSamples(storageService.getSoilSamples(school.id));
    setShowAddModal(false);
    setFarmerName('');
  };

  const filteredSamples = samples.filter(s => 
    s.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sampleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              SoiLENZ Handheld Soil Lab Registry
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {samples.length} precision samples tested and telemetrically archived at {school.name}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Log New Soil Test
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 flex items-center justify-between text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farmer name, village, or sample code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
          />
        </div>
        <span className="text-slate-500 font-medium">
          Showing {filteredSamples.length} samples
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5">Sample Code</th>
                <th className="p-3.5">Farmer & Village</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5 text-center">pH</th>
                <th className="p-3.5 text-center">EC (dS/m)</th>
                <th className="p-3.5 text-center">OC (%)</th>
                <th className="p-3.5 text-center">N-P-K (kg/ha)</th>
                <th className="p-3.5">Health Score</th>
                <th className="p-3.5">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSamples.map(sample => (
                <tr key={sample.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-700">{sample.sampleCode}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{sample.farmerName}</p>
                    <p className="text-[11px] text-slate-500">{sample.village}</p>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">{sample.cropType}</td>
                  <td className="p-3.5 text-center font-bold text-slate-800">{sample.parameters.pH}</td>
                  <td className="p-3.5 text-center text-slate-600">{sample.parameters.ec}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-800">{sample.parameters.organicCarbon}%</td>
                  <td className="p-3.5 text-center text-[11px] text-slate-600">
                    {sample.parameters.nitrogen}-{sample.parameters.phosphorus}-{sample.parameters.potassium}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {sample.healthScore} ({sample.healthCategory})
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <FileCheck2 className="w-3 h-3" /> {sample.reportStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sample Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Log SoiLENZ Rapid Soil Test
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter optical sensor telemetry reading from handheld cuvette scan.
            </p>

            <form onSubmit={handleAddSample} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Shinde"
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
                  <label className="font-semibold text-slate-700 block mb-1">Crop</label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">pH (1-14)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pH}
                    onChange={(e) => setPH(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">EC (dS/m)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={ec}
                    onChange={(e) => setEC(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Organic C (%)</label>
                  <input
                    type="number"
                    step="0.02"
                    value={oc}
                    onChange={(e) => setOC(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Generate Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
