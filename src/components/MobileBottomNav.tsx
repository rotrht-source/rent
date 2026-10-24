import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Heart, User } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenLoginModal: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenLoginModal,
  onNavigateSection
}) => {
  const { currentView, setCurrentView, currentTenant, isAdmin } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-6 flex items-center justify-between sm:hidden shadow-lg">
      
      {/* 1. Home Tab */}
      <button
        onClick={() => {
          setCurrentView('public');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          currentView === 'public' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px]">Home</span>
        {currentView === 'public' && (
          <span className="w-3.5 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </button>

      {/* 2. All Properties Tab */}
      <button
        onClick={() => {
          setCurrentView('all_properties');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          currentView === 'all_properties' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Search className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px]">Properties</span>
        {currentView === 'all_properties' && (
          <span className="w-3.5 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </button>

      {/* 3. Saved Tab */}
      <button
        onClick={() => onNavigateSection('featured-properties-section')}
        className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
      >
        <Heart className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] font-medium">Saved</span>
      </button>

      {/* 4. Profile / Sign In Tab */}
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
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          currentView !== 'public' && currentView !== 'all_properties' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <User className="w-5 h-5 stroke-[2]" />
        <span className="text-[10px] font-medium">
          {isAdmin ? 'Admin' : currentTenant ? 'Tenant' : 'Sign In'}
        </span>
        {currentView !== 'public' && currentView !== 'all_properties' && (
          <span className="w-3.5 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </button>

    </nav>
  );
};
