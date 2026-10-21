import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { VideoGallery } from '../../components/video/VideoGallery';

export const ArkashineVideos: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Learning Videos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Streaming Science Explainer Gallery for Class 8–10 Soil Partners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/docs/video-prompts.md"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Video Prompts Doc</span>
          </a>
        </div>
      </div>

      {/* Admin KPI Header Tile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Overall Watch Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            91.4%
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +5.2% vs pilot baseline
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Quiz Score Average</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-purple-700 dark:text-purple-400">
            86.2%
          </p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            High concept retention
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">School Completions</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            4 / 4
          </p>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
            All active hubs finished all 6
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Class 8–10 Viewers</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            72 Students
          </p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            100% active cohort engaged
          </span>
        </div>

      </div>

      {/* Streaming Gallery */}
      <VideoGallery />

    </div>
  );
};
