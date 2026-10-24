import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Zap, Smartphone, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenLoginModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenReportModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLoginModal, onNavigateSection, onOpenReportModal }) => {
  const { t, siteSettings } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Brand + Assurance Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <BrandLogo logoUrl={siteSettings.logoUrl} theme="dark" size="md" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {siteSettings.companyDescription || 'Premier property rental and tenant management portal with unique login IDs, inspection booking, and automated rent tracking.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Tour Approvals</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span>Tenant Portal</span>
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateSection('home-hero')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('rental-categories')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.nav.rent}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('all-properties')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.nav.allProperties}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>Modern Apartments</li>
              <li>Houses & Villas</li>
              <li>Commercial Offices</li>
              <li>Parking & Garages</li>
            </ul>
          </div>

          {/* Support & Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Support & Inquiries
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Schedule Inspection</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenReportModal) {
                      onOpenReportModal();
                    } else {
                      onNavigateSection('contact-section');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 text-rose-400 font-semibold"
                >
                  <span>Report Flat Issue (Direct to Admin)</span>
                  <ArrowUpRight className="w-3 h-3 text-rose-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Lease Agreements & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Corporate Headquarters
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteSettings.companyName || 'RentFlow'} Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Protocol</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
