import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  showPercent?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 110,
  strokeWidth = 10,
  label,
  sublabel,
  color,
  showPercent = true
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const defaultColor = normalizedScore >= 80 
    ? '#10B981' 
    : normalizedScore >= 60 
      ? '#F59E0B' 
      : '#EF4444';

  const strokeColor = color || defaultColor;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold tracking-tight text-slate-800">
            {normalizedScore}{showPercent ? '%' : ''}
          </span>
          {sublabel && <span className="text-[11px] font-medium text-slate-500 uppercase">{sublabel}</span>}
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-700 text-center">{label}</span>}
    </div>
  );
};
