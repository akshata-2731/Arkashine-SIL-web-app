import React from 'react';
import { Sparkles, Mail, Heart, Sprout } from 'lucide-react';
import { ARKASHINE_TEAM } from '../../data/teamData';

export const AppFooter: React.FC = () => {
  const leadershipTeam = [
    {
      name: 'Akshata Patil',
      designation: 'Co-Founder & CEO',
      role: 'Program Director • Agritech Leadership',
      avatar: ARKASHINE_TEAM[0]?.avatar || '',
      badge: 'Co-Founder & CEO',
      badgeColor: 'bg-amber-400 text-slate-950',
      email: 'akshata@arkashine.com',
      quote: 'Empowering school students to become certified Soil Partners for India’s farming future.'
    },
    {
      name: 'Dr. Vivek Saxena',
      designation: 'Co-Founder & CTO',
      role: 'Chief Technology Officer • SoiLENZ Sensor Architect',
      avatar: ARKASHINE_TEAM[1]?.avatar || '',
      badge: 'Co-Founder & CTO',
      badgeColor: 'bg-purple-200 text-purple-950',
      email: 'vivek@arkashine.com',
      quote: 'Deploying real-time optical soil telemetry to bring laboratory accuracy to village fields.'
    },
    {
      name: 'Dr. Sunita Deshmukh',
      designation: 'Co-Founder & COO',
      role: 'Director of Academic Partnerships & Operations',
      avatar: ARKASHINE_TEAM[2]?.avatar || '',
      badge: 'Co-Founder & COO',
      badgeColor: 'bg-emerald-200 text-emerald-950',
      email: 'sunita@arkashine.com',
      quote: 'Building scalable 72-hour innovation ecosystems across school hubs nationwide.'
    }
  ];

  return (
    <footer className="w-full mt-12 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0D1322] transition-colors no-print">
      
      {/* Top Stylish Team Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#5C26C0] dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Arkashine Innovation Lab Leadership</span>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
            Meet the Founding Team
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Driving rural soil diagnostics, student empowerment, and agritech innovation.
          </p>
        </div>

        {/* 3 Co-Founders Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {leadershipTeam.map((member) => (
            <div
              key={member.name}
              className="relative rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50/60 to-white dark:from-slate-900/60 dark:to-slate-900 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#5C26C0]/20 p-1 shadow-md object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Online" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs ${member.badgeColor}`}>
                    {member.badge}
                  </span>
                </div>

                <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#5C26C0] dark:group-hover:text-purple-400 transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs font-bold text-[#5C26C0] dark:text-purple-300 mt-0.5">
                  {member.designation}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {member.role}
                </p>

                <p className="text-[11px] italic text-slate-600 dark:text-slate-400 mt-3 p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 leading-relaxed">
                  "{member.quote}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#5C26C0] dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{member.email}</span>
                </a>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Telemetry & Certification Seal Bar */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5C26C0] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading font-bold text-slate-900 dark:text-white leading-tight">
                Arkashine Innovations Pvt. Ltd. (SoiLENZ Diagnostic Systems)
              </p>
              <p className="text-[11px] text-slate-500">
                Live Cloud Telemetry • 7 School Innovation Hubs • Autonomous Sensor Synchronizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Feed Active
            </span>
          </div>
        </div>

        {/* Copyright Sub-footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © 2026 Arkashine Innovations Pvt. Ltd. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-slate-500">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Young Soil Partners of India
          </p>
        </div>

      </div>

    </footer>
  );
};
