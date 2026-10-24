import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Headphones,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSearch?: (params: { location: string; category: string; maxPrice: number }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const { siteSettings, properties } = useApp();
  const propertyCount = properties?.length || 48;

  return (
    <section id="home-hero" className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[580px] lg:min-h-[640px] flex items-center justify-center">
      
      {/* Background Banner Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={siteSettings.homeBannerImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"}
          alt="Rental Property Banner"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/75 to-slate-950/50" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-8">
        
        {/* Top Badge & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-bold uppercase tracking-wider text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{siteSettings.homeBannerBadge || 'FIND YOUR IDEAL'}</span>
            <span className="text-blue-300/60">·</span>
            <span className="text-white">{propertyCount}+ Verified Listings</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.12]">
            {siteSettings.homeBannerHeadline || 'Find Your Ideal Rental Home'}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {siteSettings.homeBannerSubtitle || 'Comfortable homes, flexible options and trusted landlords — all in one place.'}
          </p>
        </div>

        {/* Call-to-Action Buttons (Search Bar removed from Home) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('contact-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Contact & Inquire</span>
          </button>
        </div>

        {/* 4 Trust Feature Badges */}
        <div className="pt-6 border-t border-slate-800/80 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-slate-700/60 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white truncate">
                  {siteSettings.badge1 || 'Verified Listings'}
                </span>
                <span className="block text-[11px] text-slate-400 truncate">100% Inspected</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-slate-700/60 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white truncate">
                  {siteSettings.badge2 || 'Fast & Easy Booking'}
                </span>
                <span className="block text-[11px] text-slate-400 truncate">Direct Landlord Tour</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-slate-700/60 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white truncate">
                  {siteSettings.badge3 || 'Prime Locations'}
                </span>
                <span className="block text-[11px] text-slate-400 truncate">Central & Connected</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-slate-700/60 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white truncate">
                  {siteSettings.badge4 || '24/7 Support'}
                </span>
                <span className="block text-[11px] text-slate-400 truncate">Dedicated Desk</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
