import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  target?: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'emerald' | 'amber' | 'blue' | 'earth';
  onClick?: () => void;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  target,
  icon: Icon,
  trend,
  trendType = 'positive',
  onClick,
  badge
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
            {target && (
              <span className="text-xs text-slate-400 font-medium">
                / {target}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 shrink-0">
          <Icon className="w-4 h-4 text-emerald-800" />
        </div>
      </div>

      {(trend || badge) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {trend && (
            <span
              className={`font-medium ${
                trendType === 'positive'
                  ? 'text-emerald-700'
                  : trendType === 'negative'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {trend}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
