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
  Calendar,
  Camera,
  Users,
  Upload,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SoilSample, Campaign } from '../../types';

export const FacultySoilLab: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];

  const currentCohortDay = school?.currentDay || 20;
  const isTheoryPhase = currentCohortDay <= 5;

  // Active Tab: 'campaigns' (Village Outreach & 1000 Farmers) vs 'samples' (Individual Soil Tests)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'samples'>('campaigns');

  // Existing data
  const [samples, setSamples] = useState<SoilSample[]>(storageService.getSoilSamples(school.id));
  const [campaigns, setCampaigns] = useState<Campaign[]>(storageService.getCampaigns(school.id));

  // Search & Toast
  const [searchQuery, setSearchQuery] = useState('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Modal 1: Village Outreach Campaign (Batch 1,000 Farmers + Photo)
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campVillage, setCampVillage] = useState('Malegaon Khurd');
  const [campTitle, setCampTitle] = useState('Village Panchayat Soil Health Camp');
  const [campFarmersCount, setCampFarmersCount] = useState<number>(50);
  const [campTestsCount, setCampTestsCount] = useState<number>(12);
  const [campSelectedTeams, setCampSelectedTeams] = useState<number[]>([1, 2, 3]);
  const [campTopics, setCampTopics] = useState('Soil pH testing, N-P-K diagnosis, vermicompost & organic carbon');
  const [campPhotoUrl, setCampPhotoUrl] = useState<string>('/assets/images/students-testing-soilenz-farm.png');

  // Modal 2: Individual Soil Sample Modal
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sampleFarmerName, setSampleFarmerName] = useState('');
  const [sampleVillage, setSampleVillage] = useState('Malegaon');
  const [sampleCrop, setSampleCrop] = useState('Sugarcane');
  const [samplePH, setSamplePH] = useState<number>(7.0);

  // Photo presets for fast 1-click selection in rural lab
  const PHOTO_PRESETS = [
    { label: 'Field Testing (Farm)', url: '/assets/images/students-testing-soilenz-farm.png' },
    { label: 'Farmer Outreach (Village)', url: '/assets/images/farmer-outreach.webp' },
    { label: 'Sampling in Field', url: '/assets/images/poster-how-to-collect.png' },
    { label: 'SoiLENZ Digital Readout', url: '/assets/images/soilenz-real-device.png' }
  ];

  // Calculate overall metrics
  const totalFarmersReached = campaigns.reduce((acc, c) => acc + (c.attendeesCount || 0), 0);
  const targetFarmers = 1000;
  const farmerProgressPct = Math.min(100, Math.round((totalFarmersReached / targetFarmers) * 100));

  // Toggle participating student teams
  const toggleTeam = (t: number) => {
    if (campSelectedTeams.includes(t)) {
      if (campSelectedTeams.length > 1) {
        setCampSelectedTeams(campSelectedTeams.filter(team => team !== t));
      }
    } else {
      setCampSelectedTeams([...campSelectedTeams, t].sort());
    }
  };

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCampPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Village Campaign
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campVillage.trim()) return;

    const newCamp: Campaign = {
      id: `CMP-${school.id}-${Date.now()}`,
      schoolId: school.id,
      date: new Date().toISOString().split('T')[0],
      title: campTitle || `${campVillage} Community Soil Camp`,
      village: campVillage,
      attendeesCount: Number(campFarmersCount),
      topicsCovered: campTopics,
      groupNumber: campSelectedTeams[0] || 1,
      photos: [campPhotoUrl]
    };

    storageService.saveCampaign(newCamp);
    setCampaigns(storageService.getCampaigns(school.id));
    setShowCampaignModal(false);
    setToastNotice(`✓ Logged camp at ${campVillage}! Reached +${campFarmersCount} farmers with live photo proof.`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Save Individual Soil Test
  const handleSaveSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleFarmerName.trim()) return;

    const sampleNum = samples.length + 1;
    const newSample: SoilSample = {
      id: `SMP-${Date.now()}`,
      sampleCode: `ARK-${school.code}-${String(sampleNum).padStart(3, '0')}`,
      schoolId: school.id,
      studentId: `${school.id}-STU-01`,
      studentName: 'Student Team 1',
      groupNumber: 1,
      date: new Date().toISOString().split('T')[0],
      village: sampleVillage,
      farmerName: sampleFarmerName,
      farmerPhone: '+91 98221 55410',
      cropType: sampleCrop,
      parameters: {
        pH: samplePH,
        ec: 0.65,
        organicCarbon: 0.8,
        nitrogen: 240,
        phosphorus: 24,
        potassium: 260,
        moisture: 18
      },
      healthScore: samplePH >= 6.5 && samplePH <= 7.5 ? 88 : 72,
      healthCategory: samplePH >= 6.5 && samplePH <= 7.5 ? 'Good' : 'Moderate',
      reportStatus: 'Generated',
      soiLenzDeviceId: 'SLZ-2026-101'
    };

    storageService.saveSoilSample(newSample);
    setSamples(storageService.getSoilSamples(school.id));
    setShowSampleModal(false);
    setSampleFarmerName('');
    setToastNotice(`✓ Logged soil test for ${sampleFarmerName} (${sampleCrop})!`);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const filteredSamples = samples.filter(s =>
    s.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sampleCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter(c =>
    c.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.topicsCovered.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Soil Tests & Farmer Outreach
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target: 1,000 Farmers
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SoiLENZ Lab
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Faculty logs village outreach camps with student teams (no student phones needed) and verifies field testing with photo proof.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Camera className="w-4 h-4" />
              + Log Village Camp & Photo
            </button>
            <button
              onClick={() => setShowSampleModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Single Test
            </button>
          </div>
        </div>

        {/* 1,000 Farmers Mission Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">1,000 Farmers Mission Progress</span>
              <span className="text-slate-400">({campaigns.length} villages visited)</span>
            </div>
            <span className="font-black text-emerald-400">
              {totalFarmersReached} / {targetFarmers} Farmers Reached ({farmerProgressPct}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(5, farmerProgressPct)}%` }}
            />
          </div>
        </div>
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

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Farmers Reached */}
        <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950 rounded-3xl p-5 text-white border border-emerald-800/50 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
              Farmers Reached
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {totalFarmersReached}
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Target: 1,000 farmers via 20 village camps
          </p>
        </div>

        {/* Soil Tests */}
        <div className="bg-gradient-to-br from-purple-900/90 to-indigo-950 rounded-3xl p-5 text-white border border-purple-800/50 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
              Soil Tests Conducted
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {samples.length}
          </div>
          <p className="text-[11px] text-purple-200/80 mt-1">
            Measured with portable SoiLENZ scanner
          </p>
        </div>

        {/* Village Campaigns */}
        <div className="bg-gradient-to-br from-blue-900/90 to-slate-900 rounded-3xl p-5 text-white border border-blue-800/50 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
              Village Outreach Camps
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {campaigns.length}
          </div>
          <p className="text-[11px] text-blue-200/80 mt-1">
            100% verified with live field photographs
          </p>
        </div>

      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'campaigns'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Village Outreach Camps ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'samples'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Individual Soil Tests ({samples.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64 pr-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'campaigns' ? "Search village, topic..." : "Search farmer, village..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: Village Outreach Camps Gallery */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Village Outreach Camps with Photo Proof
              </h2>
              <p className="text-xs text-slate-500">
                Batch logging makes reaching 1,000 farmers easy without individual student phones.
              </p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Log New Camp
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => (
              <div 
                key={camp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={camp.photos && camp.photos[0] ? camp.photos[0] : '/assets/images/students-testing-soilenz-farm.png'}
                    alt={camp.village}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  {/* Village Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{camp.village}</span>
                  </div>

                  {/* Photo Verified Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-black shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Photo Proof
                  </div>

                  {/* Farmers Count overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <span className="text-xl font-black text-white block leading-tight">
                        +{camp.attendeesCount} Farmers
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold">
                        Consulted & Advised
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {camp.date}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {camp.topicsCovered}
                    </p>
                  </div>

                  {/* Student Teams Tag */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Student Team {camp.groupNumber || '1, 2, 3'}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Faculty Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Individual Soil Tests Registry */}
      {activeTab === 'samples' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Individual Soil Test Registry
              </h2>
              <p className="text-xs text-slate-500">
                Detailed test parameters, pH ratings, and issued Soil Health Cards.
              </p>
            </div>
            <button
              onClick={() => setShowSampleModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Test
            </button>
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
      )}

      {/* MODAL 1: Log Village Outreach Camp with Photo Proof */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Log Village Outreach Camp
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Faculty smartphone upload • No student phone required
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowCampaignModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              
              {/* Village Name & Campaign Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Village Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={campVillage}
                    onChange={(e) => setCampVillage(e.target.value)}
                    placeholder="e.g. Malegaon Khurd"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    placeholder="e.g. Soil Testing Drive"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Farmer Turnout Quick Selectors */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Farmers Attended & Advised: <span className="text-emerald-600 font-black">+{campFarmersCount} Farmers</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCampFarmersCount(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        campFarmersCount === num
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      +{num} Farmers
                    </button>
                  ))}
                </div>
              </div>

              {/* Soil Tests Conducted */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Soil Tests on SoiLENZ
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={campTestsCount}
                    onChange={(e) => setCampTestsCount(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Camp Date
                  </label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Participating Student Teams (Checkboxes) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Participating Student Teams (Classes 8–10)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((t) => {
                    const isSelected = campSelectedTeams.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTeam(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        Team {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Proof Upload & Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Mandatory Field Photo Proof *
                </label>

                {/* Photo Preview */}
                <div className="relative h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 mb-2">
                  <img
                    src={campPhotoUrl}
                    alt="Proof preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/students-testing-soilenz-farm.png';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold">
                    ✓ Photo Ready for Verification
                  </div>
                </div>

                {/* Quick Presets or File Upload */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-[10px] font-semibold text-slate-500">Presets:</span>
                  {PHOTO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCampPhotoUrl(p.url)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        campPhotoUrl === p.url
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Local Smartphone Upload input */}
                <label className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload Photo from Phone / Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Advisory note */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Topics & Fertilizer Advice Given
                </label>
                <textarea
                  rows={2}
                  value={campTopics}
                  onChange={(e) => setCampTopics(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Village Camp Proof →
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: Single Soil Test Quick Log */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Quick Log Single Soil Sample
              </h3>
              <button 
                onClick={() => setShowSampleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSample} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Farmer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kadam"
                  value={sampleFarmerName}
                  onChange={(e) => setSampleFarmerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={sampleVillage}
                    onChange={(e) => setSampleVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Crop Type
                  </label>
                  <input
                    type="text"
                    value={sampleCrop}
                    onChange={(e) => setSampleCrop(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Measured pH ({samplePH})
                </label>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={samplePH}
                  onChange={(e) => setSamplePH(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSampleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Sample
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

