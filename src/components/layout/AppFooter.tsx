import React from 'react';
import { Sprout, Sparkles, ShieldCheck } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full mt-10 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0D1322] transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand & Telemetry Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5C26C0] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                Arkashine Innovations Pvt. Ltd.
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SoiLENZ Diagnostic Systems • School Innovation Lab
              </p>
            </div>
          </div>

          {/* Center: Stylish Compact Team Capsule */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex -space-x-2">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=AkshataPatil"
                alt="Akshata Patil"
                title="Akshata Patil (Co-Founder & CEO)"
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-purple-100 shadow-xs object-cover"
              />
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=VivekSaxena"
                alt="Dr. Vivek Saxena"
                title="Dr. Vivek Saxena (Co-Founder & CTO)"
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-100 shadow-xs object-cover"
              />
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=SunitaDeshmukh"
                alt="Dr. Sunita Deshmukh"
                title="Dr. Sunita Deshmukh (Co-Founder & COO)"
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-amber-100 shadow-xs object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C26C0] dark:text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Leadership:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                <span className="hover:text-[#5C26C0] transition-colors">
                  Akshata Patil <span className="text-slate-400 font-normal text-[10px]">(CEO)</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="hover:text-[#5C26C0] transition-colors">
                  Dr. Vivek Saxena <span className="text-slate-400 font-normal text-[10px]">(CTO)</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="hover:text-[#5C26C0] transition-colors">
                  Dr. Sunita Deshmukh <span className="text-slate-400 font-normal text-[10px]">(COO)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Certified Made In India */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} Arkashine</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Proudly Made in India
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
