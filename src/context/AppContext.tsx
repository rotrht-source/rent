import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  TenantAccount,
  BookingRequest,
  ContactMessage,
  Language,
  AppView,
  PaymentMethod,
  MeetingDetails,
  SiteSettings,
  TenantReport,
  ReportStatus
} from '../types';
import { INITIAL_PROPERTIES, INITIAL_TENANTS, INITIAL_BOOKING_REQUESTS, INITIAL_TENANT_REPORTS } from '../data/mockData';
import { translations } from '../data/translations';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: '',
  companyName: 'RentFlow',
  companyTagline: 'Better Homes. Brighter Future.',

  homeBannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
  homeBannerHeadline: 'Find Your Ideal Rental Home',
  homeBannerSubtitle: 'Comfortable homes, flexible options and trusted landlords — all in one place.',
  homeBannerBadge: 'FIND YOUR IDEAL',

  allPropertiesBannerImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=85',
  allPropertiesBannerHeadline: 'Explore All Rental Properties',
  allPropertiesBannerSubtitle: 'Browse premium apartments, duplex homes, offices, and garages with verified details.',

  companyDescription: 'Premier property rental and tenant management portal with unique login IDs, inspection booking, and automated rent tracking.',
  badge1: 'Verified Listings',
  badge2: 'Fast & Easy Booking',
  badge3: 'Prime Locations',
  badge4: '24/7 Support',

  officeName: 'RentFlow Real Estate HQ',
  contactAddress: '742 Evergreen Terrace, Suite 500, Austin, TX 78701',
  contactPhone: '+1 (800) 555-0199 / +1 (555) 789-0123',
  contactEmail: 'contact@rentflow.com / support@rentflow.com',
  workingHours: 'Monday - Saturday: 9:00 AM - 7:00 PM',
  contactTitle: 'We are here to help you find your dream home',
  contactSubtitle: 'Have questions about property inspection, lease terms, or automated rent payments? Send us a message or visit our corporate office.',

  // Stripe Online Payment Integration
  stripeEnabled: true,
  stripePaymentUrl: 'https://buy.stripe.com/test_rentflow_landlord_demo',
  stripeAccountName: 'RentFlow Landlord Account',

  // No-Code Cloud Database & Storage Sync
  databaseMode: 'local',
  firebaseConfigText: '',
  firebaseApiKey: '',
  firebaseAuthDomain: '',
  firebaseProjectId: '',
  firebaseStorageBucket: '',
  firebaseConnected: false,
  lastCloudSync: '',
  lastBackupDate: ''
};

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  properties: Property[];
  tenants: TenantAccount[];
  inbox: BookingRequest[];
  contactMessages: ContactMessage[];
  tenantReports: TenantReport[];
  
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  
  currentTenant: TenantAccount | null;
  setCurrentTenant: (tenant: TenantAccount | null) => void;
  
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  
  activeAdminTab: 'dashboard' | 'properties' | 'tenants' | 'inbox' | 'reports' | 'payments' | 'site_settings';
  setActiveAdminTab: (tab: 'dashboard' | 'properties' | 'tenants' | 'inbox' | 'reports' | 'payments' | 'site_settings') => void;
  
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  
  // Actions
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  addBookingRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveBooking: (id: string) => void;
  scheduleMeeting: (id: string, details: MeetingDetails) => void;
  generateUniqueIdAndAssign: (bookingId: string) => string;
  createTenantProfile: (data: {
    bookingId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    propertyId: string;
    monthlyRent: number;
    nextDueDate: string;
    dueDayOfMonth?: number;
    depositAmount?: number;
    notes?: string;
    avatar?: string;
    uniqueLoginId?: string;
  }) => TenantAccount;
  
  makeRentPayment: (tenantId: string, month: string, amount: number, method: PaymentMethod) => void;
  
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => void;
  
  // Tenant Flat Incident / Issue Reports
  addTenantReport: (report: Omit<TenantReport, 'id' | 'createdAt' | 'status'>) => TenantReport;
  updateTenantReportStatus: (id: string, status: ReportStatus, adminNote?: string) => void;
  deleteTenantReport: (id: string) => void;
  
  loginAsTenant: (uniqueLoginId: string) => boolean;
  loginAsAdmin: (user: string, pass: string, uniqueId?: string) => boolean;
  logout: () => void;
  
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Commercial & Demo Suite
  resetAllDemoData: () => void;
  exportSystemData: () => void;
  importSystemData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROPERTIES: 'rentflow_properties_v3',
  TENANTS: 'rentflow_tenants_v3',
  INBOX: 'rentflow_inbox_v3',
  TENANT_REPORTS: 'rentflow_tenant_reports_v3',
  LANG: 'rentflow_lang_v3',
  SITE_SETTINGS: 'rentflow_site_settings_v3'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const [currentView, setCurrentView] = useState<AppView>('public');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentTenant, setCurrentTenant] = useState<TenantAccount | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'properties' | 'tenants' | 'inbox' | 'reports' | 'payments' | 'site_settings'>('dashboard');

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(updated));
      return updated;
    });
    showToast('Site settings saved successfully!');
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    showToast('Default settings restored.');
  };

  // Local storage initialization
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [tenants, setTenants] = useState<TenantAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TENANTS);
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [inbox, setInbox] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INBOX);
      return saved ? JSON.parse(saved) : INITIAL_BOOKING_REQUESTS;
    } catch {
      return INITIAL_BOOKING_REQUESTS;
    }
  });

  const [tenantReports, setTenantReports] = useState<TenantReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TENANT_REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_TENANT_REPORTS;
    } catch {
      return INITIAL_TENANT_REPORTS;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(inbox));
  }, [inbox]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TENANT_REPORTS, JSON.stringify(tenantReports));
  }, [tenantReports]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Property actions
  const addProperty = (newPropData: Omit<Property, 'id'>) => {
    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...newPropData,
      id: newId
    };
    setProperties(prev => [newProperty, ...prev]);
    showToast('New property added successfully!');
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(prev => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Property updated successfully.');
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Property deleted successfully.');
  };

  // Booking actions
  const addBookingRequest = (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: BookingRequest = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInbox(prev => [newReq, ...prev]);
    showToast('Booking request submitted successfully! Our team will contact you.');
  };

  const approveBooking = (id: string) => {
    setInbox(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    showToast('Booking inquiry approved.');
  };

  const scheduleMeeting = (id: string, details: MeetingDetails) => {
    setInbox(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'meeting_set',
              meetingDetails: details
            }
          : item
      )
    );
    showToast(`Meeting scheduled for ${details.date} at ${details.time}!`);
  };

  const generateUniqueIdAndAssign = (bookingId: string): string => {
    const targetBooking = inbox.find(b => b.id === bookingId);
    if (!targetBooking) return '';

    const count = tenants.length + 1;
    const uniqueId = `TNT-2026-${count.toString().padStart(2, '0')}`;

    const property = properties.find(p => p.id === targetBooking.propertyId);
    const monthlyRent = property ? property.rentAmount : 1800;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 25);
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    const newTenant: TenantAccount = {
      id: `tenant-${Date.now()}`,
      uniqueLoginId: uniqueId,
      fullName: targetBooking.fullName,
      email: targetBooking.email,
      phoneNumber: targetBooking.phoneNumber,
      propertyId: targetBooking.propertyId,
      monthlyRent,
      leaseStartDate: new Date().toISOString().split('T')[0],
      nextDueDate: formattedDueDate,
      dueAmount: 0,
      payments: []
    };

    setTenants(prev => [newTenant, ...prev]);

    if (targetBooking.propertyId) {
      updateProperty(targetBooking.propertyId, {
        status: 'rented',
        assignedTenantId: uniqueId
      });
    }

    setInbox(prev =>
      prev.map(item =>
        item.id === bookingId
          ? {
              ...item,
              status: 'tenant_created',
              generatedTenantId: uniqueId
            }
          : item
      )
    );

    showToast(`Unique ID ${uniqueId} generated and property assigned!`);
    return uniqueId;
  };

  const createTenantProfile = (data: {
    bookingId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    propertyId: string;
    monthlyRent: number;
    nextDueDate: string;
    dueDayOfMonth?: number;
    depositAmount?: number;
    notes?: string;
    avatar?: string;
    uniqueLoginId?: string;
  }): TenantAccount => {
    const count = tenants.length + 1;
    const uniqueId = data.uniqueLoginId && data.uniqueLoginId.trim()
      ? data.uniqueLoginId.trim().toUpperCase()
      : `TNT-2026-${count.toString().padStart(2, '0')}`;

    const newTenant: TenantAccount = {
      id: `tenant-${Date.now()}`,
      uniqueLoginId: uniqueId,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      propertyId: data.propertyId,
      monthlyRent: Number(data.monthlyRent) || 1800,
      leaseStartDate: new Date().toISOString().split('T')[0],
      nextDueDate: data.nextDueDate || new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      dueDayOfMonth: data.dueDayOfMonth,
      dueAmount: 0,
      payments: [],
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      notes: data.notes,
      depositAmount: data.depositAmount
    };

    setTenants(prev => [newTenant, ...prev]);

    if (data.propertyId) {
      updateProperty(data.propertyId, {
        status: 'rented',
        assignedTenantId: uniqueId
      });
    }

    if (data.bookingId) {
      setInbox(prev =>
        prev.map(item =>
          item.id === data.bookingId
            ? {
                ...item,
                status: 'tenant_created',
                generatedTenantId: uniqueId
              }
            : item
        )
      );
    }

    showToast(`Tenant profile for "${newTenant.fullName}" created with ID ${uniqueId}!`);
    return newTenant;
  };

  const makeRentPayment = (tenantId: string, month: string, amount: number, method: PaymentMethod) => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      tenantId,
      propertyId: '',
      month,
      amount,
      paidDate: new Date().toISOString().split('T')[0],
      method,
      status: 'Paid' as const,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`
    };

    setTenants(prev =>
      prev.map(t => {
        if (t.uniqueLoginId === tenantId || t.id === tenantId) {
          const next = new Date(t.nextDueDate || new Date());
          next.setDate(next.getDate() + 30);
          const newDueDate = next.toISOString().split('T')[0];

          return {
            ...t,
            dueAmount: Math.max(0, t.dueAmount - amount),
            nextDueDate: newDueDate,
            payments: [newPayment, ...t.payments]
          };
        }
        return t;
      })
    );

    if (currentTenant && (currentTenant.uniqueLoginId === tenantId || currentTenant.id === tenantId)) {
      setCurrentTenant(prev => {
        if (!prev) return null;
        const next = new Date(prev.nextDueDate || new Date());
        next.setDate(next.getDate() + 30);
        return {
          ...prev,
          dueAmount: Math.max(0, prev.dueAmount - amount),
          nextDueDate: next.toISOString().split('T')[0],
          payments: [newPayment, ...prev.payments]
        };
      });
    }

    showToast(`Rent payment of $${amount} recorded successfully!`);
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContactMessages(prev => [newMsg, ...prev]);

    const bookingLike: BookingRequest = {
      id: `req-msg-${Date.now()}`,
      propertyId: 'general',
      propertyTitle: `General Inquiry: ${msg.subject}`,
      fullName: msg.name,
      phoneNumber: msg.phone,
      email: msg.email,
      message: msg.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInbox(prev => [bookingLike, ...prev]);
    showToast('Message sent successfully to our property team!');
  };

  // Tenant Incident & Flat Issue Actions
  const addTenantReport = (data: Omit<TenantReport, 'id' | 'createdAt' | 'status'>): TenantReport => {
    const nextCount = tenantReports.length + 1;
    const reportId = `REP-2026-${nextCount.toString().padStart(2, '0')}`;
    const newReport: TenantReport = {
      ...data,
      id: reportId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTenantReports(prev => [newReport, ...prev]);
    showToast(`Issue report ticket #${reportId} submitted successfully to Landlord Admin!`, 'success');
    return newReport;
  };

  const updateTenantReportStatus = (id: string, status: ReportStatus, adminNote?: string) => {
    setTenantReports(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status,
              adminNote: adminNote !== undefined ? adminNote : r.adminNote,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : r.resolvedAt,
              updatedAt: new Date().toISOString()
            }
          : r
      )
    );
    showToast(`Report #${id} marked as "${status}".`, 'info');
  };

  const deleteTenantReport = (id: string) => {
    setTenantReports(prev => prev.filter(r => r.id !== id));
    showToast(`Report ticket #${id} deleted.`);
  };

  const loginAsTenant = (uniqueLoginId: string): boolean => {
    const cleanId = uniqueLoginId.trim().toUpperCase();
    const found = tenants.find(
      t => t.uniqueLoginId.toUpperCase() === cleanId || t.uniqueLoginId.replace(/-/g, '').toUpperCase() === cleanId.replace(/-/g, '')
    );
    if (found) {
      setCurrentTenant(found);
      setIsAdmin(false);
      setCurrentView('tenant_portal');
      showToast(`Welcome ${found.fullName}! Logged in as tenant.`);
      return true;
    }
    return false;
  };

  const loginAsAdmin = (user: string, pass: string, uniqueId?: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanId = (uniqueId || '').trim().toUpperCase().replace(/\s+/g, '');

    const validUsers = ['admin', 'sarah', 'landlord', 'owner'];
    const validPass = ['admin123', 'admin', '123456', 'rentflow2026'];
    const validIds = ['ADM-2026-01', 'ADMIN-01', 'ADM-01', 'ADMIN-2026', 'ADMIN', 'ADM202601', 'ADM'];

    const isUserValid = validUsers.includes(cleanUser);
    const isPassValid = validPass.includes(cleanPass);
    const isIdValid = validIds.includes(cleanId) || cleanId.startsWith('ADM-') || cleanId.startsWith('ADMIN-');

    if (isUserValid && isPassValid && isIdValid) {
      setIsAdmin(true);
      setCurrentTenant(null);
      setCurrentView('admin_dashboard');
      showToast('Welcome to Landlord Admin Dashboard!');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentTenant(null);
    setCurrentView('public');
    showToast('Logged out successfully.');
  };

  const resetAllDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
      localStorage.removeItem(STORAGE_KEYS.TENANTS);
      localStorage.removeItem(STORAGE_KEYS.INBOX);
      localStorage.removeItem(STORAGE_KEYS.TENANT_REPORTS);
      localStorage.removeItem(STORAGE_KEYS.SITE_SETTINGS);
    } catch (e) {
      console.warn('Storage clear warning', e);
    }

    setProperties(INITIAL_PROPERTIES);
    setTenants(INITIAL_TENANTS);
    setInbox(INITIAL_BOOKING_REQUESTS);
    setTenantReports(INITIAL_TENANT_REPORTS);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setCurrentTenant(null);
    setIsAdmin(false);
    setCurrentView('public');
    showToast('Demo database restored to factory state!', 'success');
  };

  const exportSystemData = () => {
    try {
      const backupData = {
        name: 'RentFlow Property Management SaaS',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        siteSettings,
        properties,
        tenants,
        inbox,
        contactMessages,
        tenantReports
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rentflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('System data backup exported successfully!', 'success');
    } catch (e) {
      showToast('Failed to export backup.', 'error');
    }
  };

  const importSystemData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') {
        showToast('Invalid backup file format.', 'error');
        return false;
      }

      if (Array.isArray(parsed.properties)) {
        setProperties(parsed.properties);
      }
      if (Array.isArray(parsed.tenants)) {
        setTenants(parsed.tenants);
      }
      if (Array.isArray(parsed.inbox)) {
        setInbox(parsed.inbox);
      }
      if (Array.isArray(parsed.tenantReports)) {
        setTenantReports(parsed.tenantReports);
      }
      if (parsed.siteSettings && typeof parsed.siteSettings === 'object') {
        setSiteSettings(prev => ({
          ...prev,
          ...parsed.siteSettings,
          lastBackupDate: new Date().toLocaleDateString()
        }));
      }
      showToast('All system data restored successfully!', 'success');
      return true;
    } catch (e) {
      showToast('Failed to parse backup JSON file.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations.en,
        currentView,
        setCurrentView,
        properties,
        tenants,
        inbox,
        contactMessages,
        tenantReports,
        selectedProperty,
        setSelectedProperty,
        currentTenant,
        setCurrentTenant,
        isAdmin,
        setIsAdmin,
        activeAdminTab,
        setActiveAdminTab,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        addProperty,
        updateProperty,
        deleteProperty,
        addBookingRequest,
        approveBooking,
        scheduleMeeting,
        generateUniqueIdAndAssign,
        createTenantProfile,
        makeRentPayment,
        addContactMessage,
        addTenantReport,
        updateTenantReportStatus,
        deleteTenantReport,
        loginAsTenant,
        loginAsAdmin,
        logout,
        toasts,
        showToast,
        dismissToast,
        resetAllDemoData,
        exportSystemData,
        importSystemData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
