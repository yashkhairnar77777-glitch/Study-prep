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
      {/* Geometric Prism Mark */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4.5 h-4.5 text-white"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 20 6.5 20 17.5 12 22 4 17.5 4 6.5" className="stroke-white" />
          <line x1="12" y1="2" x2="12" y2="22" className="stroke-white/70" />
          <polyline points="4 6.5 12 12 20 6.5" className="stroke-white/85" />
          <circle cx="12" cy="12" r="2" className="fill-white stroke-none" />
        </svg>
      </div>

      {/* Clean Single-Line Wordmark */}
      {showWordmark && (
        <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
          ORYQEN Study AI
        </span>
      )}
    </div>
  );
};
