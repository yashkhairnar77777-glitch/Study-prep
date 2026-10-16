import React from 'react';

interface OryqenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const OryqenLogo: React.FC<OryqenLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Subtle Geometric Prism Symbol */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-[1px] shadow-sm shrink-0 flex items-center justify-center overflow-hidden`}
      >
        <div className="w-full h-full rounded-[11px] bg-slate-950/20 backdrop-blur-xs flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-white"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Geometric faceted prism hexagon */}
            <polygon points="12 2 20 6.5 20 17.5 12 22 4 17.5 4 6.5" className="opacity-90 stroke-white" />
            <line x1="12" y1="2" x2="12" y2="22" className="stroke-white/60" />
            <polyline points="4 6.5 12 12 20 6.5" className="stroke-white/80" />
            <circle cx="12" cy="12" r="2.5" className="fill-violet-300 stroke-none animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Distinctive ORYQEN Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">
              ORYQEN
            </span>
            <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              STUDY AI
            </span>
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase mt-0.5">
            Intelligent Learning System
          </span>
        </div>
      )}
    </div>
  );
};
