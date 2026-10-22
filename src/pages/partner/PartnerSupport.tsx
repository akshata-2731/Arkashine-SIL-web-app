import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  AlertCircle, 
  Send,
  Users,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const PartnerSupport: React.FC = () => {
  const { currentUser } = useAuth();
  const campaigns = storageService.getCampaigns();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketSeverity, setTicketSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const totalAttendees = campaigns.reduce((acc, c) => acc + c.attendeesCount, 0);

  const handleRaiseIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    storageService.addAuditLog({
      id: `TKT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: 'partner',
      action: 'SUPPORT_TICKET_RAISED',
      details: `[${ticketSeverity.toUpperCase()}] ${ticketSubject}: ${ticketDetails}`,
      schoolId: 'SCH-01'
    });

    setSubmittedMessage('Support ticket dispatched to Arkashine Operations team!');
    setTicketSubject('');
    setTicketDetails('');
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Pictorial Header Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                Village Agronomy Outreach
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-200">
                GreenHorizon AgriEd Hub
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Field Visits, Community Outreach & HQ Support
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Supervising village community soil testing drives, tracking farmer consultations conducted by student micro-teams, and providing rapid escalation to Arkashine engineering and logistics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              {totalAttendees} Farmers Consulted
            </span>
            <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              {campaigns.length} Village Drives
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              N-P-K Soil Cards Issued
            </span>
          </div>
        </div>

        <div className="w-full md:w-72 h-44 md:h-auto bg-slate-900 overflow-hidden shrink-0 border-t md:border-t-0 md:border-l border-slate-100 relative group">
          <img
            src="/assets/images/farmer-outreach.webp"
            alt="Farmer outreach and community clinic"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white">
              Village Soil Testing Clinics
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Field Outreach & Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700" />
              Village Community Campaigns Conducted
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {campaigns.length} Active Records
            </span>
          </div>

          <div className="space-y-3.5">
            {campaigns.map((cmp, idx) => (
              <div
                key={cmp.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start group"
              >
                <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={idx % 2 === 0 ? "/assets/images/farmer-outreach.webp" : "/assets/images/tree-soil-ecosystem.webp"}
                    alt={cmp.title}
                    width={144}
                    height={112}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                      Camp #{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {cmp.village}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">{cmp.date}</span>
                    <span>•</span>
                    <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {cmp.attendeesCount} Farmers Attended
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{cmp.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cmp.topicsCovered}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Handheld SoiLENZ Demonstrations Completed
                    </span>
                    <span className="font-medium text-slate-600">
                      Team 1 to 5 Involved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Raise Issue Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs h-fit space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-slate-800">Raise Partner Support Ticket</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct high-priority operational line to Arkashine technical, agronomy, and device logistics teams.
            </p>
          </div>

          {submittedMessage && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleRaiseIssue} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issue Category & Severity</label>
              <select
                value={ticketSeverity}
                onChange={(e) => setTicketSeverity(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-600"
              >
                <option value="low">Low - General Agronomy Query</option>
                <option value="medium">Medium - Chemical Reagents Restock</option>
                <option value="high">High - SoiLENZ Spectrometer Calibration Drift</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of issue (e.g. Need extra buffer tablets for SCH-01)..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-600 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Details & Field Observations</label>
              <textarea
                rows={4}
                placeholder="Describe equipment symptom, delivery requirements, or village clinic assistance needed..."
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-600 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Ticket to Arkashine HQ</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold block text-slate-700">Support SLA Response Times:</span>
            <p>• High (Device / Reagents): Within 4 hours</p>
            <p>• Medium / Low: Within 24 hours</p>
          </div>
        </div>

      </div>

    </div>
  );
};
