import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PopularRentals } from './components/PopularRentals';
import { AllPropertiesView } from './components/AllPropertiesView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { TenantPortalView } from './components/TenantPortalView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TenantReportModal } from './components/TenantReportModal';
import { Property } from './types';
import { Lock, ShieldAlert } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedProperty,
    setSelectedProperty,
    currentTenant,
    isAdmin,
    language
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<{ location: string; category: string; maxPrice: number } | undefined>();

  const handleSearch = (params: { location: string; category: string; maxPrice: number }) => {
    setSearchFilter(params);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main View Router */}
      <div className={`flex-1 ${currentView !== 'admin_dashboard' ? 'pt-20' : ''}`}>
        
        {/* 1. Home Page View (Home page ONLY has Featured Properties, NO all properties and NO filter bar) */}
        {currentView === 'public' && (
          <main>
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                setSelectedCategory('all');
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSearch={(params) => {
                handleSearch(params);
                if (params.category && params.category !== 'all') {
                  setSelectedCategory(params.category);
                }
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Properties & Category Icons & Why Choose Us */}
            <PopularRentals
              onSelectProperty={(prop: Property) => setSelectedProperty(prop)}
              onViewAllClick={() => {
                setSelectedCategory('all');
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCategoryClick={(cat: string) => {
                setSelectedCategory(cat);
                setCurrentView('all_properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onListPropertyClick={() => handleNavigateSection('contact-section')}
            />

            {/* Contact Form & Office Info */}
            <ContactSection />
          </main>
        )}

        {/* 2. Separate Dedicated All Properties Page with Full Search & Filters */}
        {currentView === 'all_properties' && (
          <main>
            <AllPropertiesView
              onSelectProperty={(prop: Property) => setSelectedProperty(prop)}
              onBackToHome={() => {
                setCurrentView('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initialFilter={{
                location: searchFilter?.location,
                category: selectedCategory,
                maxPrice: searchFilter?.maxPrice
              }}
            />
          </main>
        )}

        {/* 3. Tenant Portal (Protected: Only accessible if authenticated as Tenant or Admin) */}
        {currentView === 'tenant_portal' && (
          currentTenant || isAdmin ? (
            <TenantPortalView />
          ) : (
            <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Tenant Portal Access Restricted
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Please sign in with your Username, Password, and Unique ID to access this portal.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )
        )}

        {/* 4. Admin Dashboard (Protected: Strictly accessible ONLY if authenticated as Admin) */}
        {currentView === 'admin_dashboard' && (
          isAdmin ? (
            <AdminDashboardView />
          ) : (
            <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 border border-slate-200">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Access Restricted
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                This page requires authorized credentials. Please sign in with your Username, Password, and Unique ID.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )
        )}
      </div>

      {/* Public Footer (rendered in public and tenant view) */}
      {currentView !== 'admin_dashboard' && (
        <Footer
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onNavigateSection={handleNavigateSection}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Mobile Fixed Bottom Navigation Bar Matching Phone Screenshot */}
      {(currentView === 'public' || currentView === 'all_properties') && (
        <MobileBottomNav
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onNavigateSection={handleNavigateSection}
        />
      )}

      {/* Property Details Modal (Matching Screenshot 1) */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onOpenContact={() => handleNavigateSection('contact-section')}
        />
      )}

      {/* Tenant Flat Incident / Issue Reporting Modal */}
      <TenantReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Unified Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Real-time Toasts & Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
