import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Plus, 
  X, 
  Megaphone, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { FarmerOutreach, Campaign } from '../../types';

export const FacultyOutreach: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  
  const [activeTab, setActiveTab] = useState<'farmers' | 'campaigns'>('farmers');
  const [outreachList, setOutreachList] = useState<FarmerOutreach[]>(() => storageService.getFarmerOutreach(school.id));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => storageService.getCampaigns(school.id));
  const [showAddOutreach, setShowAddOutreach] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Follow_Up'>('all');

  // Outreach Form State
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('+91 98221 44091');
  const [village, setVillage] = useState('Malegaon Budruk');
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [crop, setCrop] = useState('Sugarcane');
  const [landArea, setLandArea] = useState<number>(2.4);
  const [sampleCode, setSampleCode] = useState(`ARK-${school.code}-024`);
  const [advice, setAdvice] = useState('');
  const [outreachStatus, setOutreachStatus] = useState<'Completed' | 'Follow_Up'>('Completed');

  // Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignVillage, setCampaignVillage] = useState('Malegaon Budruk');
  const [campaignGroup, setCampaignGroup] = useState<number>(1);
  const [farmersAttended, setFarmersAttended] = useState<number>(35);
  const [campaignTopic, setCampaignTopic] = useState('Soil organic carbon and balanced NPK dosing');

  // Agronomy Suggestion Chips
  const agronomySuggestions = [
    "Apply 25kg Zinc Sulfate + 5 tons Farm Yard Manure (FYM) before monsoon sowing.",
    "Soil pH is alkaline (8.2): incorporate gypsum at 400kg/acre and reduce chemical nitrogen by 20%.",
    "Phosphorus deficit detected: apply single super phosphate (SSP) with mycorrhiza bio-fertilizer.",
    "Organic carbon critically low (0.32%): recommend green manuring with dhaincha/sunhemp.",
    "Potassium levels healthy: maintain current farm compost dressing without synthetic MOP."
  ];

  const campaignTopicSuggestions = [
    "Soil Organic Carbon (SOC) enhancement & vermicomposting demonstration",
    "Digital SoiLENZ sensor live testing at Gram Panchayat hall",
    "Correct auger V-shape soil core collection protocol for kharif season",
    "Interpreting Soil Health Card nutrient ratings & balanced fertilization"
  ];

  // Refresh data
  const refreshData = () => {
    setOutreachList([...storageService.getFarmerOutreach(school.id)]);
    setCampaigns([...storageService.getCampaigns(school.id)]);
  };

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

  // Handlers
  const handleSaveOutreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOutreachValid) return;

    const newItem: FarmerOutreach = {
      id: `OUT-${Date.now()}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      groupNumber,
      studentNames: [`Student Group ${groupNumber} Scientists`],
      village: village.trim(),
      farmerName: farmerName.trim(),
      phone: phone.trim() || '+91 98221 44091',
      landAreaHectares: landArea,
      primaryCrop: crop.trim(),
      soilSampleCode: sampleCode.trim() || undefined,
      adviceGiven: advice.trim(),
      status: outreachStatus
    };

    storageService.saveFarmerOutreach(newItem);
    refreshData();
    setShowAddOutreach(false);
    setFarmerName('');
    setAdvice('');
  };

  const handleToggleOutreachStatus = (item: FarmerOutreach) => {
    const updatedStatus: 'Completed' | 'Follow_Up' = item.status === 'Completed' ? 'Follow_Up' : 'Completed';
    item.status = updatedStatus;
    storageService.saveFarmerOutreach(item);
    refreshData();
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
      groupNumber: campaignGroup,
      attendeesCount: farmersAttended,
      topicsCovered: campaignTopic.trim(),
      photos: []
    };

    storageService.saveCampaign(newCampaign);
    refreshData();
    setShowAddCampaign(false);
    setCampaignTitle('');
  };

  // KPI calculations
  const totalFarmers = outreachList.length;
  const totalHectares = useMemo(() => {
    const sum = outreachList.reduce((acc, curr) => acc + (curr.landAreaHectares || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [outreachList]);

  const totalCampaigns = campaigns.length;
  const totalAttendees = useMemo(() => {
    return campaigns.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  }, [campaigns]);

  const uniqueVillages = useMemo(() => {
    const set = new Set<string>();
    outreachList.forEach(o => set.add(o.village));
    campaigns.forEach(c => set.add(c.village));
    return Array.from(set);
  }, [outreachList, campaigns]);

  const cropList = useMemo(() => {
    const set = new Set<string>();
    outreachList.forEach(o => set.add(o.primaryCrop));
    return Array.from(set);
  }, [outreachList]);

  // Filtered outreach
  const filteredOutreach = useMemo(() => {
    return outreachList.filter(item => {
      const matchesSearch = 
        item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.adviceGiven.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGroup = selectedGroup === 'all' || item.groupNumber === selectedGroup;
      const matchesCrop = selectedCrop === 'all' || item.primaryCrop === selectedCrop;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesGroup && matchesCrop && matchesStatus;
    });
  }, [outreachList, searchQuery, selectedGroup, selectedCrop, statusFilter]);

  // Crop Emoji Mapping
  const getCropEmoji = (cropName: string) => {
    const c = cropName.toLowerCase();
    if (c.includes('sugar')) return '🎋';
    if (c.includes('cotton')) return '🌾';
    if (c.includes('wheat')) return '🌿';
    if (c.includes('soy')) return '🌱';
    if (c.includes('grape')) return '🍇';
    if (c.includes('rice') || c.includes('paddy')) return '🌾';
    return '🌱';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Village Agronomy & Community Outreach</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Classroom to Village Field</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Farmer Advisory Consultations & Village Campaigns
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Log student micro-team visits to farming households, soil health card handovers, and village awareness rallies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddOutreach(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Farmer Consultation</span>
          </button>
          <button
            onClick={() => setShowAddCampaign(true)}
            className="px-4 py-2.5 bg-[#5C26C0] hover:bg-purple-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Megaphone className="w-4 h-4" />
            <span>+ Record Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Farmers Advised</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalFarmers} Farmers</div>
          <p className="text-[11px] text-slate-400">5 Student groups active</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Cultivated Area Impacted</span>
            <Sprout className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{totalHectares} Hectares</div>
          <p className="text-[11px] text-slate-400">Precision nutrient advisory</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Village Campaigns</span>
            <Megaphone className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black text-purple-950">{totalCampaigns} Rallies</div>
          <p className="text-[11px] text-slate-400">{totalAttendees} Farmer attendees</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Villages Reached</span>
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">{uniqueVillages.length} Villages</div>
          <p className="text-[11px] text-slate-400">Baramati agrarian belt</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'farmers'
              ? 'bg-emerald-800 text-white font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>🌱 Farmer Field Consultations ({totalFarmers})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'bg-[#5C26C0] text-white font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>📢 Village Awareness Campaigns ({totalCampaigns})</span>
        </button>
      </div>

      {/* TAB 1: Farmers List */}
      {activeTab === 'farmers' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search farmer, village, or crop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Group filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setSelectedGroup('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Groups
                </button>
                {[1, 2, 3, 4, 5].map(grp => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      selectedGroup === grp ? 'bg-emerald-800 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Group {grp}
                  </button>
                ))}
              </div>

              {/* Crop & Status Dropdowns */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
                  aria-label="Filter by crop"
                >
                  <option value="all">All Crops</option>
                  {cropList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Completed' | 'Follow_Up')}
                  className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
                  aria-label="Filter by consultation status"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Follow_Up">Follow-Up Needed</option>
                </select>
              </div>

            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOutreach.map(item => {
              const isCompleted = item.status === 'Completed';

              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Farmer Name, Crop Badge, Group */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {item.farmerName}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            {getCropEmoji(item.primaryCrop)} {item.primaryCrop}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.village}
                          </span>
                          <span>•</span>
                          <span>{item.landAreaHectares} Hectares</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#5C26C0] font-black text-xs border border-purple-200 shrink-0">
                        Group {item.groupNumber}
                      </span>
                    </div>

                    {/* Contact & Sample ID */}
                    <div className="mt-2.5 flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{item.phone || '+91 98221 44091'}</span>
                      </div>
                      {item.soilSampleCode && (
                        <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Sample: {item.soilSampleCode}
                        </span>
                      )}
                    </div>

                    {/* Advisory Given Quote Box */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-slate-700 space-y-1">
                      <p className="font-black text-emerald-950 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Agronomic Advisory & Recommendation:
                      </p>
                      <p className="leading-relaxed font-medium italic text-slate-800">
                        "{item.adviceGiven}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer: Date and Toggle Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Logged: {item.date}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleOutreachStatus(item)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Clock className="w-3.5 h-3.5 text-amber-700" />}
                      <span>{item.status.replace('_', ' ')}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredOutreach.length === 0 && (
              <div className="col-span-2 p-10 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
                No farmer outreach records found matching the filter.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: Campaigns List */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(cmp => (
            <div 
              key={cmp.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {cmp.title || cmp.village}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {cmp.village}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-[#5C26C0] font-black text-xs border border-purple-200 shrink-0">
                    Group {cmp.groupNumber || 1}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#5C26C0] block">
                    Core Campaign Topics
                  </span>
                  <p className="text-slate-800 font-semibold leading-relaxed">
                    {cmp.topicsCovered}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  Date: {cmp.date}
                </span>

                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 font-black flex items-center gap-1.5 border border-emerald-200">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{cmp.attendeesCount} Farmer Attendees</span>
                </span>
              </div>
            </div>
          ))}

          {campaigns.length === 0 && (
            <div className="col-span-2 p-10 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              No village awareness campaigns recorded yet.
            </div>
          )}
        </div>
      )}

      {/* ADD FARMER OUTREACH MODAL */}
      {showAddOutreach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Log Farmer Field Advisory Visit
                  </h3>
                  <p className="text-xs text-slate-500">Record micro-team student advice and soil health recommendations</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddOutreach(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutreach} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farmer Full Name *</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Babanrao Patil"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                  {outreachErrors.farmerName && <p className="text-rose-600 text-[10px] mt-1">{outreachErrors.farmerName}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98221 44091"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village Location *</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Malegaon Budruk"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                  {outreachErrors.village && <p className="text-rose-600 text-[10px] mt-1">{outreachErrors.village}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Group Assigned</label>
                  <select
                    value={groupNumber}
                    onChange={(e) => setGroupNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-hidden"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Group {g} (Micro-team {g})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Crop *</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="Sugarcane, Cotton, Soybean, Wheat"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                  {outreachErrors.crop && <p className="text-rose-600 text-[10px] mt-1">{outreachErrors.crop}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Land Area (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={landArea}
                    onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                  />
                  {outreachErrors.landArea && <p className="text-rose-600 text-[10px] mt-1">{outreachErrors.landArea}</p>}
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Soil Sample ID (Optional)</label>
                <input
                  type="text"
                  value={sampleCode}
                  onChange={(e) => setSampleCode(e.target.value)}
                  placeholder="ARK-SCH-01-024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Advisory Given with Suggestion Chips */}
              <div className="text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Agronomic Advisory Provided *</label>
                  <span className="text-[10px] text-slate-400 font-mono">{advice.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Specific soil health advisory given to the farmer by students based on SoiLENZ sensor readings..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-emerald-500 shadow-inner"
                />
                {outreachErrors.advice && <p className="text-rose-600 text-[10px]">{outreachErrors.advice}</p>}

                {/* Quick Suggestion Chips */}
                <div className="pt-1 flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-slate-400 block w-full">Quick Preset Advisory:</span>
                  {agronomySuggestions.map((sug, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAdvice(sug)}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 text-left transition-colors cursor-pointer truncate max-w-full"
                    >
                      + {sug.slice(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="text-xs flex items-center gap-4 pt-1">
                <label className="font-bold text-slate-700">Follow-Up Required?</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={outreachStatus === 'Completed'}
                      onChange={() => setOutreachStatus('Completed')}
                      className="text-emerald-700"
                    />
                    <span>No, Completed</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={outreachStatus === 'Follow_Up'}
                      onChange={() => setOutreachStatus('Follow_Up')}
                      className="text-amber-600"
                    />
                    <span>Yes, Follow-Up Needed</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddOutreach(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isOutreachValid}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold cursor-pointer shadow-xs"
                >
                  Save Consultation Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CAMPAIGN MODAL */}
      {showAddCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5C26C0] flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5 text-[#5C26C0]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Record Village Awareness Campaign
                  </h3>
                  <p className="text-xs text-slate-500">Log Gram Panchayat demonstrations and farmer awareness rallies</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCampaign(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Event Title *</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Gram Sabha Soil Organic Carbon Awareness Rally"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-purple-500"
                />
                {campaignErrors.title && <p className="text-rose-600 text-[10px] mt-1">{campaignErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village Location *</label>
                  <input
                    type="text"
                    value={campaignVillage}
                    onChange={(e) => setCampaignVillage(e.target.value)}
                    placeholder="e.g. Malegaon Budruk"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-purple-500"
                  />
                  {campaignErrors.village && <p className="text-rose-600 text-[10px] mt-1">{campaignErrors.village}</p>}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farmer Attendees Count *</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={farmersAttended}
                    onChange={(e) => setFarmersAttended(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-purple-500 font-bold"
                  />
                  {campaignErrors.farmers && <p className="text-rose-600 text-[10px] mt-1">{campaignErrors.farmers}</p>}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Group Lead</label>
                <select
                  value={campaignGroup}
                  onChange={(e) => setCampaignGroup(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-hidden"
                >
                  {[1, 2, 3, 4, 5].map(g => (
                    <option key={g} value={g}>Group {g} (Micro-team {g})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Topics Covered & Key Takeaways *</label>
                <textarea
                  rows={2}
                  value={campaignTopic}
                  onChange={(e) => setCampaignTopic(e.target.value)}
                  placeholder="Key topics presented to the village community..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-purple-500"
                />
                {campaignErrors.topic && <p className="text-rose-600 text-[10px]">{campaignErrors.topic}</p>}

                {/* Quick Topic Chips */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {campaignTopicSuggestions.map((top, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCampaignTopic(top)}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-purple-50 hover:text-purple-800 text-slate-600 border border-slate-200 text-left transition-colors cursor-pointer truncate max-w-full"
                    >
                      + {top.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddCampaign(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCampaignValid}
                  className="px-5 py-2.5 rounded-xl bg-[#5C26C0] hover:bg-purple-800 disabled:opacity-40 text-white font-extrabold cursor-pointer shadow-xs"
                >
                  Save Campaign Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
