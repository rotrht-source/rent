import React from 'react';

interface BrandLogoProps {
  logoUrl?: string;
  className?: string;
  theme?: 'light' | 'dark'; // 'light' = on light background (e.g. Navbar), 'dark' = on dark background (e.g. Footer)
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoUrl,
  className = '',
  theme = 'light',
  size = 'md'
}) => {
  // If user uploaded a custom logo image or URL, render ONLY that image!
  if (logoUrl && logoUrl.trim() !== '') {
    const heightClass = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10';
    return (
      <img
        src={logoUrl}
        alt="Company Logo"
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto max-w-[220px] object-contain transition-transform group-hover:scale-[1.02] ${className}`}
      />
    );
  }

  // Built-in modern vector prop-tech brand logo for RentFlow
  const isDark = theme === 'dark';
  const primaryText = isDark ? '#FFFFFF' : '#0F172A';
  const taglineText = isDark ? '#94A3B8' : '#64748B';

  const dims = size === 'sm' 
    ? { width: 140, height: 34 } 
    : size === 'lg' 
    ? { width: 200, height: 48 } 
    : { width: 175, height: 42 };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={dims.width}
        height={dims.height}
        viewBox="0 0 185 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-[1.02]"
        aria-label="RentFlow Logo"
      >
        <defs>
          <linearGradient id={`rf-grad-blue-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id={`rf-grad-emerald-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id={`rf-shadow-${theme}`} x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2563EB" floodOpacity={isDark ? "0.45" : "0.22"} />
          </filter>
        </defs>

        {/* --- Logo Emblem --- */}
        <g filter={`url(#rf-shadow-${theme})`}>
          {/* Base rounded background tile for emblem */}
          <rect x="2" y="3" width="38" height="38" rx="11" fill={`url(#rf-grad-blue-${theme})`} />

          {/* Architectural Modern Roofline & Buildings */}
          <path
            d="M 21 8.5 L 32.5 18 L 29.5 18 L 29.5 32.5 L 12.5 32.5 L 12.5 18 L 9.5 18 Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Inner Windows */}
          <rect x="15.5" y="21" width="3.5" height="4" rx="0.8" fill="#1D4ED8" />
          <rect x="23" y="21" width="3.5" height="4" rx="0.8" fill="#1D4ED8" />
          <rect x="15.5" y="27" width="3.5" height="5.5" rx="0.8" fill="#1D4ED8" />
          <rect x="23" y="27" width="3.5" height="5.5" rx="0.8" fill="#1D4ED8" />

          {/* Dynamic Flow Ribbon (Looping through the building) */}
          <path
            d="M 6.5 28 C 11 25, 17 26, 21 21 C 25 16, 31 16, 35.5 22"
            stroke={`url(#rf-grad-emerald-${theme})`}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Tiny accent spark at the rooftop peak */}
          <circle cx="21" cy="8.5" r="1.5" fill="#FDE047" />
        </g>

        {/* --- Integrated Logotype --- */}
        <g>
          {/* "Rent" */}
          <text
            x="48"
            y="26"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="21"
            letterSpacing="-0.6px"
            fill={primaryText}
          >
            Rent
          </text>

          {/* "Flow" */}
          <text
            x="99"
            y="26"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="21"
            letterSpacing="-0.6px"
            fill={`url(#rf-grad-blue-${theme})`}
          >
            Flow
          </text>

          {/* Flow Dot Accent */}
          <circle cx="151" cy="17" r="3" fill="#06B6D4" />
          <circle cx="151" cy="17" r="1.5" fill="#38BDF8" />

          {/* Subtitle inside the logo */}
          <text
            x="49"
            y="36.5"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="7"
            letterSpacing="2px"
            fill={taglineText}
          >
            HOMES & RENTALS
          </text>
        </g>
      </svg>
    </div>
  );
};
