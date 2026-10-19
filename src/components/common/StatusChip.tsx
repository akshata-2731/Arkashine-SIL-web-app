import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, MinusCircle } from 'lucide-react';

export type StatusType = 
  | 'on_track' 
  | 'attention' 
  | 'critical' 
  | 'missing' 
  | 'late' 
  | 'partial' 
  | 'completed' 
  | 'pending'
  | 'eligible'
  | 'not_eligible';

interface StatusChipProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, size = 'md' }) => {
  const normStatus = status.toLowerCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = MinusCircle;
  let text = label || status;

  if (normStatus === 'on_track' || normStatus === 'healthy' || normStatus === 'eligible' || normStatus === 'completed' || normStatus === 'on_time') {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = CheckCircle2;
    text = label || (normStatus === 'on_time' ? 'On Time' : (normStatus === 'healthy' ? 'Healthy' : 'Eligible'));
  } else if (normStatus === 'attention' || normStatus === 'eligible_with_conditions' || normStatus === 'late' || normStatus === 'partial' || normStatus === 'near_limit' || normStatus === 'incomplete_data') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertTriangle;
    text = label || (normStatus === 'incomplete_data' ? 'Incomplete Data' : (normStatus === 'eligible_with_conditions' ? 'Conditions Apply' : 'Attention'));
  } else if (normStatus === 'critical' || normStatus === 'missing' || normStatus === 'not_eligible' || normStatus === 'exceeded') {
    bgClass = 'bg-rose-50 text-rose-800 border-rose-200';
    Icon = XCircle;
    text = label || (normStatus === 'missing' ? 'Missing' : 'Not Eligible');
  } else if (normStatus === 'pending' || normStatus === 'draft') {
    bgClass = 'bg-blue-50 text-blue-800 border-blue-200';
    Icon = Clock;
    text = label || 'Pending';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClasses} transition-colors`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{text}</span>
    </span>
  );
};
