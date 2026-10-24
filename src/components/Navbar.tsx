import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Heart,
  User,
  ShieldCheck,
  Building2,
  Phone,
  ArrowRight,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenLoginModal: () => void;
  onOpenReportModal?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoginModal, onOpenReportModal, onNavigateSection }) => {
  const {
    currentView,
    setCurrentView,
    isAdmin,
    currentTenant,
    logout,
    siteSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Smart Navbar Scroll Listener: hide when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // When visiting the Admin page, hide the public navbar completely
  if (currentView === 'admin_dashboard') {
    return null;
  }

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (onNavigateSection) {
        onNavigateSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-transform duration-300 ease-in-out shadow-xs ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <BrandLogo logoUrl={siteSettings.logoUrl} theme="light" size="md" />
          </div>

          {/* Desktop Links: Clean Modern Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                setCurrentView('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer relative ${
                currentView === 'public'
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <span>Home</span>
              {currentView === 'public' && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer relative ${
                currentView === 'all_properties'
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>All Properties</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Rent</span>
              </span>
              {currentView === 'all_properties' && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact-section')}
              className="px-4 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Report Flat Issue Button */}
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer bg-white shadow-2xs"
                title="Report Flat / Unit Issue"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Report Issue</span>
              </button>
            )}

            {/* Saved Properties Count */}
            <button
              onClick={() => handleNavClick('featured-properties-section')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer bg-white shadow-2xs"
              title="Saved Properties"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs font-bold">Saved</span>
            </button>

            {/* User Session or Login Trigger */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : currentTenant ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('tenant_portal')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{currentTenant.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                if (isAdmin) {
                  setCurrentView('admin_dashboard');
                } else if (currentTenant) {
                  setCurrentView('tenant_portal');
                } else {
                  onOpenLoginModal();
                }
              }}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              aria-label="Profile Login"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-5 py-5 space-y-3 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-slate-800 hover:bg-slate-100 text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-blue-600" />
                <span>Home</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Overview</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-slate-800 hover:bg-slate-100 text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>All Properties</span>
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Browse</span>
            </button>

            <button
              onClick={() => handleNavClick('contact-section')}
              className="w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-slate-800 hover:bg-slate-100 text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Contact & Support</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Inquiries</span>
            </button>

            {onOpenReportModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReportModal();
                }}
                className="w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-rose-600 bg-rose-50/70 hover:bg-rose-100/70 text-sm flex items-center justify-between border border-rose-200/60"
              >
                <span className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Report Flat Issue</span>
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Tenant</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tenant & Resident Account</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
