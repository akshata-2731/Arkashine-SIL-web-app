import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  Users, 
  Calendar,
  MessageSquarePlus
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
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Field Visits, Outreach & HQ Support
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Coordinate agronomist site visits, track community soil awareness campaigns, and raise operational issues to Arkashine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Field Outreach & Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            Village Community Campaigns Conducted
          </h3>

          <div className="space-y-3">
            {campaigns.map(cmp => (
              <div
                key={cmp.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-start"
              >
                <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src="/assets/images/farmer-outreach.png"
                    alt={cmp.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MapPin className="w-3.5 h-3.5" /> {cmp.village}
                    </span>
                    <span>•</span>
                    <span>{cmp.date}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{cmp.attendeesCount} Farmers Attended</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{cmp.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{cmp.topicsCovered}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Raise Issue Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-slate-800">Raise Support Ticket</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Direct high-priority line to Arkashine technical and logistics team.
          </p>

          {submittedMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-900 font-semibold">
              {submittedMessage}
            </div>
          )}

          <form onSubmit={handleRaiseIssue} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Priority Level</label>
              <select
                value={ticketSeverity}
                onChange={(e) => setTicketSeverity(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              >
                <option value="low">Low - General Query</option>
                <option value="medium">Medium - Reagent Restock Request</option>
                <option value="high">High - SoiLENZ Device Calibration Issue</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of issue..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Details & Observations</label>
              <textarea
                rows={3}
                placeholder="Describe equipment symptom, delivery delay, or school request..."
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch to Arkashine HQ
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
