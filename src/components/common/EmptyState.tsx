import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  imageSrc = '/assets/images/empty-state.webp'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
      <div className="w-48 h-48 mb-4 relative overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={title || "No data available"}
          width={192}
          height={192}
          className="w-full h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm active:scale-98"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
