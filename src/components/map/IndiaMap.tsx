import React, { useState } from 'react';
import { School } from '../../types';

interface IndiaMapProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  selectedSchoolId?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  schools,
  onSelectSchool,
  selectedSchoolId
}) => {
  const [hoveredSchool, setHoveredSchool] = useState<School | null>(null);

  // Geographic boundary approximation for India projection
  // Coordinates mapping into SVG viewBox 0 0 500 560
  // India lat range: ~8.4N to ~37N, lng range: ~68E to ~97E
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 35.5;
    const minLng = 68.5;
    const maxLng = 92.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 430 + 35;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 480 + 35;
    return { x, y };
  };

  const getPinColor = (school: School) => {
    if (school.status === 'Not_Eligible' || school.healthStatus === 'critical') {
      return { fill: '#EF4444', ring: 'ring-rose-400', label: 'Critical' }; // Red
    }
    if (school.healthStatus === 'attention' || school.status === 'Eligibility_Check') {
      return { fill: '#F59E0B', ring: 'ring-amber-400', label: 'Needs Fix' }; // Amber
    }
    if (school.status === 'Lab_Setup') {
      return { fill: '#94A3B8', ring: 'ring-slate-400', label: 'Setup' }; // Grey
    }
    return { fill: '#10B981', ring: 'ring-emerald-400', label: 'Healthy' }; // Green
  };

  return (
    <div className="relative w-full h-[340px] flex items-center justify-center bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 overflow-hidden select-none">
      
      {/* SVG Canvas with simplified India Geographic Outline */}
      <svg
        viewBox="0 0 500 540"
        className="w-full h-full max-h-[320px] filter drop-shadow-xs"
        style={{ overflow: 'visible' }}
      >
        {/* Soft Background Grid */}
        <defs>
          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200/50 dark:text-slate-800/60" />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="500" height="540" fill="url(#grid)" />
        <circle cx="230" cy="280" r="210" fill="url(#mapGlow)" />

        {/* Realistic stylized India Mainland Contour */}
        <path
          d="M 170 45 
             C 195 40, 220 55, 235 75 
             C 255 70, 275 85, 290 110 
             C 320 125, 345 130, 360 145 
             C 375 160, 420 170, 435 200 
             C 410 220, 395 240, 360 225 
             C 340 240, 330 260, 320 280 
             C 310 320, 280 370, 260 410 
             C 245 445, 230 480, 225 505 
             C 215 480, 195 430, 180 380 
             C 165 330, 150 290, 140 250 
             C 115 245, 80 230, 95 200 
             C 120 185, 140 180, 150 160 
             C 145 130, 155 80, 170 45 Z"
          className="fill-slate-100/90 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700/80 stroke-[1.5]"
          strokeLinejoin="round"
        />

        {/* State boundary indicator lines (Stylized) */}
        <path
          d="M 140 250 Q 200 270 260 270"
          className="stroke-slate-200 dark:stroke-slate-700/50 stroke-1 stroke-dasharray-2 fill-none"
        />
        <path
          d="M 180 340 Q 230 350 290 330"
          className="stroke-slate-200 dark:stroke-slate-700/50 stroke-1 stroke-dasharray-2 fill-none"
        />
        <path
          d="M 220 170 Q 280 180 340 190"
          className="stroke-slate-200 dark:stroke-slate-700/50 stroke-1 stroke-dasharray-2 fill-none"
        />

        {/* Region Labels */}
        <text x="180" y="275" className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">Maharashtra</text>
        <text x="175" y="360" className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">Karnataka</text>
        <text x="210" y="215" className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">Madhya Pradesh</text>
        <text x="260" y="255" className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">Chhattisgarh</text>
        <text x="260" y="165" className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">Uttar Pradesh</text>

        {/* Interactive School Pins */}
        {schools.map(school => {
          const { x, y } = projectCoords(school.coordinates.lat, school.coordinates.lng);
          const pin = getPinColor(school);
          const isSelected = selectedSchoolId === school.id;
          const isHovered = hoveredSchool?.id === school.id;

          return (
            <g
              key={school.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer transition-transform duration-150"
              onClick={() => onSelectSchool(school)}
              onMouseEnter={() => setHoveredSchool(school)}
              onMouseLeave={() => setHoveredSchool(null)}
              style={{
                transformOrigin: '0 0',
                transform: isHovered || isSelected ? `translate(${x}px, ${y}px) scale(1.3)` : `translate(${x}px, ${y}px) scale(1)`
              }}
            >
              {/* Pulsing ring for active / attention pins */}
              {(school.healthStatus === 'attention' || school.status === 'Running') && (
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill={pin.fill}
                  opacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Pin Base Circle */}
              <circle
                cx="0"
                cy="0"
                r="7"
                fill={pin.fill}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="shadow-md"
              />

              {/* Center Dot */}
              <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

              {/* Short Label */}
              <text
                x="10"
                y="3"
                className="fill-slate-700 dark:fill-slate-200 text-[9px] font-bold pointer-events-none drop-shadow-xs"
              >
                {school.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Card Tooltip */}
      {hoveredSchool && (
        <div 
          className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 pointer-events-none max-w-xs animate-in fade-in duration-150 z-20"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getPinColor(hoveredSchool).fill }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {hoveredSchool.city}, {hoveredSchool.state}
            </span>
          </div>
          <p className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
            {hoveredSchool.name}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Status: <b>{hoveredSchool.status.replace('_', ' ')}</b></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Click to inspect →</span>
          </div>
        </div>
      )}

      {/* Legend Badge Bar */}
      <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy (4)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Attention (2)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical (1)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Setup (1)</span>
      </div>
    </div>
  );
};
