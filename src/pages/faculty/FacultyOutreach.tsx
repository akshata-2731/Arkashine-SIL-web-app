import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Plus, 
  X,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { FarmerOutreach, Campaign } from '../../types';

export const FacultyOutreach: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [activeTab, setActiveTab] = useState<'farmers' | 'campaigns'>('farmers');
  const [outreachList, setOutreachList] = useState<FarmerOutreach[]>(storageService.getFarmerOutreach(school.id));
  const [campaigns, setCampaigns] = useState<Campaign[]>(storageService.getCampaigns(school.id));
  const [showAddOutreach, setShowAddOutreach] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);

  // Outreach Form State
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('Malegaon Budruk');
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [crop, setCrop] = useState('Sugarcane');
  const [landArea, setLandArea] = useState<number>(2.4);
  const [advice, setAdvice] = useState('');

  // Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignVillage, setCampaignVillage] = useState('Malegaon Budruk');
  const [farmersAttended, setFarmersAttended] = useState<number>(35);
  const [campaignTopic, setCampaignTopic] = useState('Soil organic carbon and balanced NPK dosing');

  // Outreach Form Validation
  const outreachErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!farmerName.trim() || farmerName.trim().length < 3) {
      errs.farmerName = 'Farmer name must be at least 3 characters.';
    }
    if (!village.trim() || village.trim().length < 2) {
      errs.village = 'Village name is required.';
    }
    if (!crop.trim()) {
      errs.crop = 'Primary crop is required.';
    }
    if (isNaN(landArea) || landArea <= 0) {
      errs.landArea = 'Land area must be greater than 0 hectares.';
    } else if (landArea > 100) {
      errs.landArea = 'Land area cannot exceed 100 hectares.';
    }
    if (!advice.trim() || advice.trim().length < 10) {
      errs.advice = 'Advice given must be at least 10 characters.';
    }
    return errs;
  }, [farmerName, village, crop, landArea, advice]);

  const isOutreachValid = Object.keys(outreachErrors).length === 0;

  // Campaign Form Validation
  const campaignErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!campaignTitle.trim() || campaignTitle.trim().length < 3) {
      errs.title = 'Campaign title is required (min 3 characters).';
    }
    if (!campaignVillage.trim()) {
      errs.village = 'Village location is required.';
    }
    if (isNaN(farmersAttended) || farmersAttended < 5) {
      errs.farmers = 'Estimated attendees must be at least 5 farmers.';
    } else if (farmersAttended > 500) {
      errs.farmers = 'Attendees cannot exceed 500 for a micro-campaign.';
    }
    if (!campaignTopic.trim() || campaignTopic.trim().length < 5) {
      errs.topic = 'Key topic must be at least 5 characters.';
    }
    return errs;
  }, [campaignTitle, campaignVillage, farmersAttended, campaignTopic]);

  const isCampaignValid = Object.keys(campaignErrors).length === 0;

  const handleSaveOutreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOutreachValid) return;

    const newItem: FarmerOutreach = {
      id: `OUT-${Date.now()}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      groupNumber,
      studentNames: [`Student Group ${groupNumber} Leads`],
      village,
      farmerName: farmerName.trim(),
      phone: '+91 98221 44091',
      landAreaHectares: landArea,
      primaryCrop: crop.trim(),
      soilSampleCode: `ARK-${school.code}-024`,
      adviceGiven: advice.trim(),
      status: 'Completed'
    };

    storageService.saveFarmerOutreach(newItem);
    setOutreachList(storageService.getFarmerOutreach(school.id));
    setShowAddOutreach(false);
    setFarmerName('');
    setAdvice('');
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCampaignValid) return;

    const newCampaign: Campaign = {
      id: `CMP-${Date.now()}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      title: campaignTitle.trim(),
      village: campaignVillage.trim(),
      groupNumber: 1,
      attendeesCount: farmersAttended,
      topicsCovered: campaignTopic.trim(),
      photos: []
    };

    storageService.saveCampaign(newCampaign);
    setCampaigns(storageService.getCampaigns(school.id));
    setShowAddCampaign(false);
    setCampaignTitle('');
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddOutreach(true)}
            className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Farmer Advisory Visit
          </button>
          <button
            onClick={() => setShowAddCampaign(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-emerald-400" />
            Log Campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'farmers' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🌱 Farmer Field Consultations ({outreachList.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'campaigns' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📢 Village Campaigns & Demos ({campaigns.length})
        </button>
      </div>

      {/* Farmers Consultations List */}
      {activeTab === 'farmers' && (
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
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{item.landAreaHectares} ha ({item.primaryCrop})</span>
                  </div>
                  <p className="text-slate-600 text-xs">{item.adviceGiven}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">{item.date}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
            {outreachList.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No farmer outreach records logged yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Village Awareness Demonstrations</span>
            <span className="text-slate-500">Community Outreach Metrics</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {campaigns.map(cmp => (
              <div key={cmp.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{cmp.title || cmp.village}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {cmp.attendeesCount} Farmers Attended
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{cmp.village}</span>
                  </div>
                  <p className="text-slate-600 text-xs">{cmp.topicsCovered}</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">{cmp.date}</span>
              </div>
            ))}
            {campaigns.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No village campaigns recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Outreach Modal */}
      {showAddOutreach && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Farmer Advisory Visit</h3>
                <p className="text-xs text-slate-500">Enter farmer contact details and advice delivered</p>
              </div>
              <button
                onClick={() => setShowAddOutreach(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutreach} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Farmer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Babanrao Patil"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                    outreachErrors.farmerName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {outreachErrors.farmerName && (
                  <p className="text-rose-600 font-semibold mt-1">⚠️ {outreachErrors.farmerName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Village *</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                      outreachErrors.village ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {outreachErrors.village && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {outreachErrors.village}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Group</label>
                  <select
                    value={groupNumber}
                    onChange={(e) => setGroupNumber(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Group {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Crop *</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                      outreachErrors.crop ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {outreachErrors.crop && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {outreachErrors.crop}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Land Area (Hectares) *</label>
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={landArea}
                    onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 font-bold focus:outline-hidden ${
                      outreachErrors.landArea ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {outreachErrors.landArea && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {outreachErrors.landArea}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Advice & Recommendation Delivered *</label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="e.g. Correct soil acidity using agricultural lime; split urea dose."
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                    outreachErrors.advice ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {outreachErrors.advice && (
                  <p className="text-rose-600 font-semibold mt-1">⚠️ {outreachErrors.advice}</p>
                )}
              </div>

              {!isOutreachValid && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Please resolve all fields marked above.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddOutreach(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isOutreachValid}
                  className={`px-4 py-2 font-bold rounded-xl shadow-xs transition-colors ${
                    isOutreachValid
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Save Field Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Village Awareness Campaign</h3>
                <p className="text-xs text-slate-500">Track community demonstration and attendee counts</p>
              </div>
              <button
                onClick={() => setShowAddCampaign(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Village Organic Carbon Demonstration"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                    campaignErrors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {campaignErrors.title && (
                  <p className="text-rose-600 font-semibold mt-1">⚠️ {campaignErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Village Location *</label>
                  <input
                    type="text"
                    value={campaignVillage}
                    onChange={(e) => setCampaignVillage(e.target.value)}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                      campaignErrors.village ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {campaignErrors.village && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {campaignErrors.village}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Farmers Attended (5-500) *</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={farmersAttended}
                    onChange={(e) => setFarmersAttended(Number(e.target.value))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 font-bold focus:outline-hidden ${
                      campaignErrors.farmers ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {campaignErrors.farmers && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {campaignErrors.farmers}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Demonstration Theme / Key Topics *</label>
                <textarea
                  rows={2}
                  value={campaignTopic}
                  onChange={(e) => setCampaignTopic(e.target.value)}
                  placeholder="e.g. Demonstration of rapid optical soil testing using SoiLENZ strip scanner."
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                    campaignErrors.topic ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {campaignErrors.topic && (
                  <p className="text-rose-600 font-semibold mt-1">⚠️ {campaignErrors.topic}</p>
                )}
              </div>

              {!isCampaignValid && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Please resolve all required fields above.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCampaign(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCampaignValid}
                  className={`px-4 py-2 font-bold rounded-xl shadow-xs transition-colors ${
                    isCampaignValid
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
