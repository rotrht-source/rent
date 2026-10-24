import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, TenantAccount, BookingRequest, PropertyCategory, MeetingDetails, TenantReport, ReportStatus, ReportPriority } from '../types';
import {
  LayoutDashboard,
  Building,
  Users,
  Inbox,
  CreditCard,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  Download,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Video,
  Palette,
  Check,
  X,
  FileSpreadsheet,
  CalendarCheck,
  KeyRound,
  UserPlus,
  Copy,
  ExternalLink,
  FileText,
  ChevronRight,
  CalendarRange,
  CheckCircle,
  User,
  Image,
  ImagePlus,
  Utensils,
  Bed,
  Bath,
  Maximize2,
  Armchair,
  Car,
  ShieldCheck,
  Wifi,
  Tag,
  Sliders,
  Settings,
  Globe,
  RotateCcw,
  MapPin,
  Upload,
  Lock,
  Database,
  Cloud,
  HardDrive,
  Wrench,
  MessageSquare,
  Camera
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { DatabaseSettingsPanel } from './DatabaseSettingsPanel';
import { StripeSetupPanel } from './StripeSetupPanel';
import { TenantReportModal } from './TenantReportModal';

export const AdminDashboardView: React.FC = () => {
  const {
    t,
    language,
    properties,
    tenants,
    inbox,
    tenantReports,
    addProperty,
    deleteProperty,
    updateProperty,
    approveBooking,
    scheduleMeeting,
    generateUniqueIdAndAssign,
    createTenantProfile,
    makeRentPayment,
    updateTenantReportStatus,
    deleteTenantReport,
    showToast,
    setCurrentView,
    loginAsTenant,
    siteSettings,
    updateSiteSettings,
    resetSiteSettings,
    resetAllDemoData,
    exportSystemData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'tenants' | 'inbox' | 'reports' | 'payments' | 'stripe_setup' | 'database' | 'site_settings'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Site Settings Form state for live edit & save
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);
  
  // Search & Filters in Tenant Table
  const [tenantSearch, setTenantSearch] = useState('');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Tenant Reports Filter & Interaction States
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved' | 'dismissed'>('all');
  const [reportPriorityFilter, setReportPriorityFilter] = useState<string>('all');
  const [reportCategoryFilter, setReportCategoryFilter] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState<string>('');
  const [editingAdminNoteId, setEditingAdminNoteId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState<string>('');
  const [previewPhotoModal, setPreviewPhotoModal] = useState<string | null>(null);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);

  // Modals
  const [showAddPropModal, setShowAddPropModal] = useState(false);
  const [inspectTenant, setInspectTenant] = useState<TenantAccount | null>(null);
  const [meetingModalItem, setMeetingModalItem] = useState<BookingRequest | null>(null);

  // Financial Accounting States (Filtered by selected month & property status)
  const [selectedAccountingMonth, setSelectedAccountingMonth] = useState('October 2026');
  const [accountingStatusFilter, setAccountingStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [accountingSearch, setAccountingSearch] = useState('');
  const [selectedPropertyPaymentDetail, setSelectedPropertyPaymentDetail] = useState<{
    property: Property;
    tenant: TenantAccount;
    status: 'Paid' | 'Pending';
    payment?: any;
    amount: number;
  } | null>(null);

  const ACCOUNTING_MONTHS = [
    'October 2026',
    'September 2026',
    'August 2026',
    'July 2026',
    'June 2026',
    'May 2026'
  ];

  // Add Tenant Modal State (Create profile & assign property)
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [createdTenantSuccess, setCreatedTenantSuccess] = useState<TenantAccount | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  ];

  const [tenantForm, setTenantForm] = useState({
    bookingId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    propertyId: '',
    monthlyRent: 1800,
    dueDayOfMonth: 5,
    nextDueDate: '2026-11-05',
    depositAmount: 3600,
    notes: '',
    avatar: PRESET_AVATARS[0],
    uniqueLoginId: ''
  });

  const handleOpenAddTenantFromInbox = (item: BookingRequest) => {
    const matchedProp = properties.find(p => p.id === item.propertyId) || properties[0];
    
    // Auto-calculate next due date (e.g. 5th of next month)
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(5);
    const formattedDueDate = nextDate.toISOString().split('T')[0];

    const nextCount = tenants.length + 1;
    const autoId = `TNT-2026-${nextCount.toString().padStart(2, '0')}`;

    setTenantForm({
      bookingId: item.id,
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      propertyId: matchedProp ? matchedProp.id : (properties[0]?.id || ''),
      monthlyRent: matchedProp ? matchedProp.rentAmount : 1800,
      dueDayOfMonth: 5,
      nextDueDate: formattedDueDate,
      depositAmount: matchedProp ? matchedProp.depositAmount : 3600,
      notes: item.message ? `Applicant message: ${item.message}` : '',
      avatar: PRESET_AVATARS[0],
      uniqueLoginId: autoId
    });
    setShowAddTenantModal(true);
  };

  const handleOpenAddTenantNew = () => {
    const defaultProp = properties.find(p => p.status === 'available') || properties[0];
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(5);
    const formattedDueDate = nextDate.toISOString().split('T')[0];

    const nextCount = tenants.length + 1;
    const autoId = `TNT-2026-${nextCount.toString().padStart(2, '0')}`;

    setTenantForm({
      bookingId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      propertyId: defaultProp ? defaultProp.id : (properties[0]?.id || ''),
      monthlyRent: defaultProp ? defaultProp.rentAmount : 1800,
      dueDayOfMonth: 5,
      nextDueDate: formattedDueDate,
      depositAmount: defaultProp ? defaultProp.depositAmount : 3600,
      notes: '',
      avatar: PRESET_AVATARS[0],
      uniqueLoginId: autoId
    });
    setShowAddTenantModal(true);
  };

  const handlePropertyChangeInTenantForm = (propId: string) => {
    const p = properties.find(item => item.id === propId);
    setTenantForm(prev => ({
      ...prev,
      propertyId: propId,
      monthlyRent: p ? p.rentAmount : prev.monthlyRent,
      depositAmount: p ? p.depositAmount : prev.depositAmount
    }));
  };

  const handleSaveTenantProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantForm.fullName.trim() || !tenantForm.propertyId) {
      alert('Please specify tenant name and select a property.');
      return;
    }

    const newCreated = createTenantProfile({
      bookingId: tenantForm.bookingId || undefined,
      fullName: tenantForm.fullName.trim(),
      email: tenantForm.email.trim(),
      phoneNumber: tenantForm.phoneNumber.trim(),
      propertyId: tenantForm.propertyId,
      monthlyRent: Number(tenantForm.monthlyRent),
      nextDueDate: tenantForm.nextDueDate,
      dueDayOfMonth: Number(tenantForm.dueDayOfMonth),
      depositAmount: Number(tenantForm.depositAmount),
      notes: tenantForm.notes.trim(),
      avatar: tenantForm.avatar,
      uniqueLoginId: tenantForm.uniqueLoginId.trim()
    });

    setShowAddTenantModal(false);
    setCreatedTenantSuccess(newCreated);
  };

  // Add Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    titleBn: '',
    category: 'Apartment' as PropertyCategory,
    rentAmount: 20000,
    depositAmount: 40000,
    currency: '$',
    location: 'Westlake, Austin, TX',
    city: 'Austin',
    address: '',
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1, // 4 Interior specs: bedrooms, bathrooms, kitchen, sqft
    areaSqFt: 1350,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    amenities: ['Furnished', 'Parking', 'Security', 'WiFi'],
    description: '',
    descriptionBn: '',
    features: [
      '24/7 CCTV & Security Guard',
      'Modern Modular Kitchen & Hood',
      'Spacious South-Facing Balcony',
      'Full Power Generator & Fast Elevator'
    ],
    colorDetails: {
      walls: 'Warm Ivory & Alabaster',
      livingRoom: 'Contemporary Greige',
      accentColor: 'Subtle Champagne Gold',
      flooring: 'Polished Oak Hardwood'
    },
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available' as const,
    isFeatured: true,
    unitNo: 'Apt 4B',
    floor: 4
  });

  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [customKeywordInput, setCustomKeywordInput] = useState('');

  // Helper for single image file to Data URL
  const handleImageFileToDataUrl = (
    file: File,
    onSuccess: (dataUrl: string) => void,
    maxSizeMb: number = 8
  ) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP');
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Image size must be less than ${maxSizeMb}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onSuccess(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper for multiple images upload from desktop (e.g. in Add Property modal)
  const handleMultipleFilesToPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please select image files');
      return;
    }
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          const result = e.target.result;
          setNewProp(prev => ({
            ...prev,
            photos: [...prev.photos, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Schedule Meeting State
  const [meetingDate, setMeetingDate] = useState('2026-10-25');
  const [meetingTime, setMeetingTime] = useState('11:00 AM');
  const [meetingType, setMeetingType] = useState<'in_person' | 'email' | 'video_call'>('in_person');
  const [meetingNotes, setMeetingNotes] = useState('Head Office Conference Room, Floor 3');

  // Stats Calculations
  const totalPropertiesCount = properties.length;
  const totalUnits = properties.length * 4;
  const rentedCount = properties.filter(p => p.status === 'rented').length;
  const occupancyRate = Math.round((rentedCount / (properties.length || 1)) * 100);
  const activeTenantsCount = tenants.length;
  
  // Revenue calculations
  const totalMonthlyRevenue = tenants.reduce((acc, t) => acc + (t.monthlyRent || 0), 0);
  const totalPendingDues = tenants.reduce((acc, t) => acc + (t.dueAmount || 0), 0);
  const pendingRequestsCount = inbox.filter(i => i.status === 'new').length;
  const pendingReportsCount = tenantReports.filter(r => r.status === 'pending').length;
  const inReviewReportsCount = tenantReports.filter(r => r.status === 'in_review').length;
  const resolvedReportsCount = tenantReports.filter(r => r.status === 'resolved').length;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title.trim() || !newProp.address.trim()) {
      alert('Please fill in title and address.');
      return;
    }
    const cleanPhotos = newProp.photos.filter(p => p.trim().length > 0);
    if (cleanPhotos.length === 0) {
      alert('Please provide at least one photo URL.');
      return;
    }
    const cleanFeatures = newProp.features.filter(f => f.trim().length > 0);

    addProperty({
      ...newProp,
      title: newProp.title.trim(),
      titleBn: newProp.titleBn?.trim() || newProp.title.trim(),
      address: newProp.address.trim(),
      photos: cleanPhotos,
      features: cleanFeatures.length > 0 ? cleanFeatures : ['24/7 CCTV', 'Modern Kitchen', 'Spacious Balcony'],
      kitchens: Number(newProp.kitchens) || 1,
      bedrooms: Number(newProp.bedrooms) || 1,
      bathrooms: Number(newProp.bathrooms) || 1,
      areaSqFt: Number(newProp.areaSqFt) || 500,
      rentAmount: Number(newProp.rentAmount) || 0,
      depositAmount: Number(newProp.depositAmount) || 0,
      amenities: newProp.amenities
    });

    setShowAddPropModal(false);
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingModalItem) return;
    scheduleMeeting(meetingModalItem.id, {
      type: meetingType,
      date: meetingDate,
      time: meetingTime,
      locationOrNotes: meetingNotes
    });
    setMeetingModalItem(null);
  };

  // Filtered tenants list
  const filteredTenants = tenants.filter(t => {
    if (selectedPropertyFilter !== 'all' && t.propertyId !== selectedPropertyFilter) return false;
    if (selectedStatusFilter === 'paid' && t.dueAmount > 0) return false;
    if (selectedStatusFilter === 'pending' && t.dueAmount === 0) return false;
    if (tenantSearch.trim()) {
      const q = tenantSearch.toLowerCase();
      const match =
        t.fullName.toLowerCase().includes(q) ||
        t.uniqueLoginId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Compute monthly payment records by Property Name
  const monthlyPropertyAccountingList = tenants.map(tenant => {
    const prop = properties.find(
      p => p.id === tenant.propertyId || p.assignedTenantId === tenant.uniqueLoginId
    ) || properties[0];

    // Find payment for selected month
    const targetMonthPrefix = selectedAccountingMonth.split(' ')[0].toLowerCase();
    const payment = tenant.payments.find(p => {
      const pMonth = p.month.toLowerCase().trim();
      return pMonth === selectedAccountingMonth.toLowerCase().trim() || pMonth.includes(targetMonthPrefix);
    });

    const isPaid = Boolean(payment && payment.status === 'Paid');

    return {
      property: prop,
      tenant,
      status: isPaid ? ('Paid' as const) : ('Pending' as const),
      payment,
      amount: tenant.monthlyRent || prop.rentAmount
    };
  });

  // Calculate monthly stats for selected month
  const currentMonthExpected = monthlyPropertyAccountingList.reduce((acc, it) => acc + it.amount, 0);
  const currentMonthCollected = monthlyPropertyAccountingList
    .filter(it => it.status === 'Paid')
    .reduce((acc, it) => acc + (it.payment?.amount || it.amount), 0);
  const currentMonthPending = monthlyPropertyAccountingList
    .filter(it => it.status === 'Pending')
    .reduce((acc, it) => acc + it.amount, 0);
  const currentMonthPaidCount = monthlyPropertyAccountingList.filter(it => it.status === 'Paid').length;
  const currentMonthPendingCount = monthlyPropertyAccountingList.filter(it => it.status === 'Pending').length;
  const currentMonthCollectionRate = Math.round((currentMonthCollected / (currentMonthExpected || 1)) * 100);

  // Filtered accounting list by status and search
  const filteredAccountingList = monthlyPropertyAccountingList.filter(item => {
    if (accountingStatusFilter === 'paid' && item.status !== 'Paid') return false;
    if (accountingStatusFilter === 'pending' && item.status !== 'Pending') return false;
    if (accountingSearch.trim()) {
      const q = accountingSearch.toLowerCase();
      const match =
        item.property.title.toLowerCase().includes(q) ||
        item.property.address.toLowerCase().includes(q) ||
        item.property.unitNo.toLowerCase().includes(q) ||
        item.tenant.fullName.toLowerCase().includes(q) ||
        item.tenant.uniqueLoginId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Desktop Dark Navy Sidebar (Hidden on mobile screens, sticky on lg) */}
      <aside className="hidden lg:flex w-72 bg-slate-950 text-white p-5 flex-col justify-between shrink-0 border-r border-slate-900 shadow-xl min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          
          {/* Brand Logo in Sidebar */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                LANDLORD <span className="text-blue-500">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                Manage. Rent. Grow.
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.admin.dashboard}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                <span>{t.admin.properties}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tenants')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tenants'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>{t.admin.tenants}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {tenants.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>{t.admin.inbox}</span>
              </div>
              {pendingRequestsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                  {pendingRequestsCount} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{'Tenant Reports'}</span>
              </div>
              {pendingReportsCount > 0 ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                  {pendingReportsCount} new
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {tenantReports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>{t.admin.payments}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('stripe_setup')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'stripe_setup'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>{'Stripe Card Setup'}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                siteSettings.stripeEnabled && siteSettings.stripePaymentUrl
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {siteSettings.stripeEnabled && siteSettings.stripePaymentUrl ? 'Active' : 'Off'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span>{'Cloud DB & Backup'}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                siteSettings.firebaseConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {siteSettings.firebaseConnected ? 'Cloud' : 'Local'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('site_settings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'site_settings'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4" />
                <span>{'Site Settings'}</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Card in Sidebar (Matching Screenshot 3) */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Better Properties Happier Tenants</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Track, manage and grow your rental business — all in one place.
          </p>
          <button
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold text-center block cursor-pointer transition-colors"
          >
            ← View Public Website
          </button>
        </div>
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-slate-950 text-white p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Header with Close */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-white block">
                      LANDLORD <span className="text-blue-500">PRO</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                      Admin Portal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close Admin Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 text-sm font-semibold">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t.admin.dashboard}</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('properties');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'properties'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4" />
                    <span>{t.admin.properties}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {properties.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('tenants');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'tenants'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>{t.admin.tenants}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {tenants.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('inbox');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'inbox'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Inbox className="w-4 h-4" />
                    <span>{t.admin.inbox}</span>
                  </div>
                  {pendingRequestsCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                      {pendingRequestsCount} new
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-rose-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{'Tenant Reports'}</span>
                  </div>
                  {pendingReportsCount > 0 ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                      {pendingReportsCount} new
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {tenantReports.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('payments');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'payments'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4" />
                    <span>{t.admin.payments}</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('stripe_setup');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'stripe_setup'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>{'Stripe Card Setup'}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    siteSettings.stripeEnabled && siteSettings.stripePaymentUrl
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {siteSettings.stripeEnabled && siteSettings.stripePaymentUrl ? 'Active' : 'Off'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('database');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'database'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4" />
                    <span>{'Cloud DB & Backup'}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    siteSettings.firebaseConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {siteSettings.firebaseConnected ? 'Cloud' : 'Local'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('site_settings');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'site_settings'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sliders className="w-4 h-4" />
                    <span>{'Site Settings'}</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Bottom button in mobile drawer */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setCurrentView('public');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold text-center block cursor-pointer"
              >
                ← View Public Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto space-y-5 sm:space-y-6">
        
        {/* Top Header Bar Matching Screenshot 3 */}
        <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          <div className="flex items-center gap-3 flex-1">
            {/* 3-Dot Line / Menu Button for Mobile Screens */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
              title="Open Admin Menu"
              aria-label="Open Admin Menu"
            >
              <div className="flex flex-col gap-1 items-center justify-center w-5 h-5">
                <span className="w-4 h-0.5 bg-white rounded-full"></span>
                <span className="w-4 h-0.5 bg-white rounded-full"></span>
                <span className="w-4 h-0.5 bg-white rounded-full"></span>
              </div>
            </button>

            {/* Mobile Brand Title */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900">
                LANDLORD <span className="text-blue-600">PRO</span>
              </span>
            </div>

            {/* Desktop / Tablet Search Box */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <input
                type="text"
                value={tenantSearch}
                onChange={e => setTenantSearch(e.target.value)}
                placeholder="Search tenants, properties, or ID... Ctrl + K"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-blue-600 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Right Admin Profile & Notifications */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setActiveTab('inbox')}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {pendingRequestsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Sarah"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block">Admin Sarah J.</span>
                <span className="text-[11px] text-slate-400 font-medium block">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden relative w-full">
          <input
            type="text"
            value={tenantSearch}
            onChange={e => setTenantSearch(e.target.value)}
            placeholder="Search tenants, properties, or ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-blue-600 outline-none shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Tab 1: Dashboard Overview (Greeting, Metric Cards, Payment Charts & Quick Actions) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Greeting & Add Property Button (Matching Screenshot 3) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t.admin.greeting}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {t.admin.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Oct 21, 2026 • Wednesday</span>
                </div>

                <button
                  onClick={() => setShowAddPropModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t.admin.addProperty}</span>
                </button>
              </div>
            </div>

            {/* 4 Metric Cards (Matching Screenshot 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Properties */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +2 new
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.admin.metricProperties}</span>
                  <span className="text-3xl font-black text-slate-900 mt-1 block">{totalPropertiesCount}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-4/5" />
                </div>
              </div>

              {/* Card 2: Total Units */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {occupancyRate}% Occupied
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.admin.metricUnits}</span>
                  <span className="text-3xl font-black text-slate-900 mt-1 block">{totalUnits}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Active Tenants */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    New Leases 5 ↗
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.admin.metricTenants}</span>
                  <span className="text-3xl font-black text-slate-900 mt-1 block">{activeTenantsCount}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full w-3/4" />
                </div>
              </div>

              {/* Card 4: Monthly Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.admin.metricRevenue}</span>
                  <span className="text-3xl font-black text-slate-900 mt-1 block font-mono">
                    ${totalMonthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Pending Dues:</span>
                  <span className="text-rose-500 font-bold font-mono">${totalPendingDues.toLocaleString()}</span>
                </div>
              </div>

            </div>
            
            {/* Mid Charts & Quick Actions Row (Matching Screenshot 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Payment Overview Chart (Zeroed out as requested) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.admin.paymentOverview}</h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      Graphs Zeroed ($0.00)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Paid ($0)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span> Pending ($0)
                    </span>
                  </div>
                </div>

                {/* Monthly Bars Visualization - All Set to Zero ($0) */}
                <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400 bg-slate-50/90 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                      $0.00 Total Revenue across all graph periods
                    </span>
                  </div>
                  {[
                    { month: 'May', paid: 0, pending: 0 },
                    { month: 'Jun', paid: 0, pending: 0 },
                    { month: 'Jul', paid: 0, pending: 0 },
                    { month: 'Aug', paid: 0, pending: 0 },
                    { month: 'Sep', paid: 0, pending: 0 },
                    { month: 'Oct', paid: 0, pending: 0 }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="w-full max-w-[28px] flex flex-col gap-0.5 items-center justify-end h-full">
                        <div
                          className="w-full bg-blue-200/60 rounded-t-xs"
                          style={{ height: '3px' }}
                        />
                        <div
                          className="w-full bg-blue-600/60 rounded-b-xs"
                          style={{ height: '3px' }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                        {bar.month}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">$0</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Status Donut Widget (Zeroed) */}
              <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{t.admin.paymentStatusPie}</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Zeroed
                  </span>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-200 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">$0</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Balance</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid
                    </span>
                    <span className="font-bold text-slate-900 font-mono">$0 (0)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending
                    </span>
                    <span className="font-bold text-slate-900 font-mono">$0 (0)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue
                    </span>
                    <span className="font-bold text-slate-900 font-mono">$0 (0)</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Matching Screenshot 3) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t.admin.quickActions}</h3>

                <div className="space-y-2">
                  <button
                    onClick={handleOpenAddTenantNew}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-left flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600">
                          {'Add New Tenant'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {'Create profile, photo & rent terms'}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600">›</span>
                  </button>

                  <button
                    onClick={() => setShowAddPropModal(true)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600">
                          {'Add Property'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Register new rental property</span>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600">›</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600">
                          {'Record Payment / Accounting'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Log rent payment & summary</span>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600">›</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full p-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/80 text-left flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-rose-600">
                            {'Tenant Flat Reports'}
                          </span>
                          {pendingReportsCount > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                              {pendingReportsCount} new
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">Review maintenance & issues</span>
                      </div>
                    </div>
                    <span className="text-rose-400 group-hover:text-rose-600 font-bold">›</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Alert Banner: Tenant Flat Incident & Maintenance Reports */}
            <div className="bg-linear-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-5 rounded-2xl shadow-xs border border-rose-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-300 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-white">Tenant Flat Reports & Issues</h3>
                    {pendingReportsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                        {pendingReportsCount} Action Needed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        All Issues Resolved
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      ({tenantReports.length} total logged)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Tenants can report plumbing, electrical, damage, or lock issues directly. Reports sync instantly here.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                <button
                  onClick={() => setShowCreateReportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors border border-white/20"
                >
                  + Log Flat Report
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <span>Open Reports Section</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Tenant Rental Records & Payment Status Table (Matching Screenshot 3) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.admin.tenantTableTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {'Click "View" on any record to inspect the complete payment ledger & countdown to next rent due'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatusFilter}
                    onChange={e => setSelectedStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>

                  <button
                    onClick={() => {
                      alert('Tenant ledger exported as CSV.');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">{t.admin.colTenant}</th>
                      <th className="py-3 px-4">{t.admin.colUnit}</th>
                      <th className="py-3 px-4">{t.admin.colRent}</th>
                      <th className="py-3 px-4">{t.admin.colDueDate}</th>
                      <th className="py-3 px-4">{t.admin.colStatus}</th>
                      <th className="py-3 px-4 text-right">{t.admin.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredTenants.map((tenant, idx) => {
                      const prop = properties.find(p => p.id === tenant.propertyId);
                      const isPaid = tenant.dueAmount === 0;

                      return (
                        <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                          
                          {/* Tenant Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={tenant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{tenant.fullName}</span>
                                <span className="text-[11px] font-mono text-blue-600">{tenant.uniqueLoginId}</span>
                              </div>
                            </div>
                          </td>

                          {/* Property Unit */}
                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            <span>{prop ? prop.address : 'Apt 402, Oak Street'}</span>
                          </td>

                          {/* Rent Amount */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            ${tenant.monthlyRent.toLocaleString()}
                          </td>

                          {/* Due Date & Countdown */}
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              <span>{tenant.nextDueDate}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              (Next rent in ~15 days)
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>{t.admin.statusPaid}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                                <Clock className="w-3 h-3 stroke-[3]" />
                                <span>{t.admin.statusPending}</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectTenant(tenant)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                {t.admin.view}
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Message sent to ${tenant.fullName} (${tenant.phoneNumber})`);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors"
                              >
                                {t.admin.message}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Manage Properties (Add/Delete/Color details) */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Rental Properties</h2>
                <p className="text-xs text-slate-500">Add, edit, or configure wall colors, photos, and video links.</p>
              </div>
              <button
                onClick={() => setShowAddPropModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Property</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-16/10 bg-slate-100">
                      <img src={p.photos[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-xs font-bold text-white bg-slate-900/80">
                        {p.category}
                      </div>
                      <div className="absolute top-2 right-2">
                        {p.status === 'available' ? (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold text-emerald-800 bg-emerald-100">Available</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold text-slate-800 bg-slate-200">Rented</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-black text-blue-600">${p.rentAmount}/mo</span>
                        <span className="text-xs text-slate-400 font-semibold">{p.unitNo}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.address}</p>
                      
                      <div className="p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900 border border-amber-100">
                        <span className="font-bold">Wall & Colors: </span>
                        <span>{p.colorDetails.walls}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => {
                        updateProperty(p.id, {
                          status: p.status === 'available' ? 'rented' : 'available'
                        });
                      }}
                      className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700"
                    >
                      Toggle {p.status === 'available' ? 'Rented' : 'Available'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this property?')) deleteProperty(p.id);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Tenants & Leases */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {'Active Tenants & Unique IDs'}
                </h2>
                <p className="text-xs text-slate-500">
                  {'All registered tenants and their login unique IDs.'}
                </p>
              </div>

              <button
                onClick={handleOpenAddTenantNew}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>{'+ Add New Tenant'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tenants.map(t => {
                const prop = properties.find(p => p.id === t.propertyId);
                return (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{t.fullName}</h4>
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {t.uniqueLoginId}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop?.title || 'Skyline Residence'}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>Monthly Rent: ${t.monthlyRent}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectTenant(t)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors"
                    >
                      View Tenant Ledger & Countdown
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Inbox & Meeting Schedule (CRITICAL FLOW from user instructions) */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t.admin.inboxTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {'Review booking requests, schedule in-person/online inspection meetings, and generate tenant unique login IDs.'}
              </p>
            </div>

            <div className="space-y-4">
              {inbox.map(item => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    item.status === 'new'
                      ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">{item.fullName}</span>
                        {item.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                            NEW REQUEST
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        )}
                        {item.status === 'meeting_set' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            Meeting Scheduled
                          </span>
                        )}
                        {item.status === 'tenant_created' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                            Tenant Created ({item.generatedTenantId})
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">
                        Property: {item.propertyTitle}
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="py-3 text-xs text-slate-700 space-y-2">
                    <div className="flex flex-wrap gap-4 text-slate-600">
                      <span>📞 {item.phoneNumber}</span>
                      <span>✉️ {item.email}</span>
                    </div>
                    {item.message && (
                      <p className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-100">
                        “{item.message}”
                      </p>
                    )}

                    {item.meetingDetails && (
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                        <span className="font-bold block">
                          📅 Scheduled Inspection Meeting:
                        </span>
                        <span>
                          {item.meetingDetails.date} at {item.meetingDetails.time} ({item.meetingDetails.type === 'in_person' ? 'Office In-Person' : 'Email/Online'})
                        </span>
                        <span className="block text-[11px] text-purple-700">
                          Notes: {item.meetingDetails.locationOrNotes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Inbox Item */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {item.status === 'new' && (
                      <button
                        onClick={() => approveBooking(item.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{'Approve Application'}</span>
                      </button>
                    )}

                    {item.status !== 'tenant_created' && (
                      <button
                        onClick={() => setMeetingModalItem(item)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{'Schedule Meeting'}</span>
                      </button>
                    )}

                    {/* Option: Add as Tenant */}
                    {item.status !== 'tenant_created' ? (
                      <button
                        onClick={() => handleOpenAddTenantFromInbox(item)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 stroke-[2.5]" />
                        <span>{'Add as Tenant'}</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>
                            {'Tenant Profile Created:'} {item.generatedTenantId}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const found = tenants.find(t => t.uniqueLoginId === item.generatedTenantId);
                            if (found) setInspectTenant(found);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                        >
                          {'View Profile'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Dedicated Tenant Reports & Flat Issues Section */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Header & Quick Metrics */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Tenant Flat Incident & Issue Reports</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold font-mono">
                        {tenantReports.length} total
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time reports sent by tenants about their flats. Review maintenance tickets, assign repairs, and notify tenants.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => setShowCreateReportModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Log New Flat Report</span>
                </button>
              </div>
            </div>

            {/* 4 Metric Cards for Reports */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Reports */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-slate-900 font-mono block">
                  {tenantReports.length}
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Across all rental buildings
                </span>
              </div>

              {/* Card 2: Pending Attention */}
              <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs space-y-2 bg-rose-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Pending Action</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-rose-600 font-mono block">
                  {pendingReportsCount}
                </span>
                <span className="text-[11px] text-rose-700 font-semibold block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Needs review or assignment
                </span>
              </div>

              {/* Card 3: In Review / Working */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2 bg-amber-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">In Review</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-amber-600 font-mono block">
                  {inReviewReportsCount}
                </span>
                <span className="text-[11px] text-amber-700 font-medium block">
                  Technician or inspection scheduled
                </span>
              </div>

              {/* Card 4: Resolved */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-2 bg-emerald-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-600 font-mono block">
                  {resolvedReportsCount}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium block">
                  Successfully repaired & closed
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setReportStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    reportStatusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({tenantReports.length})
                </button>

                <button
                  onClick={() => setReportStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    reportStatusFilter === 'pending'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>Pending ({pendingReportsCount})</span>
                </button>

                <button
                  onClick={() => setReportStatusFilter('in_review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    reportStatusFilter === 'in_review'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>In Review ({inReviewReportsCount})</span>
                </button>

                <button
                  onClick={() => setReportStatusFilter('resolved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    reportStatusFilter === 'resolved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Resolved ({resolvedReportsCount})</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2 flex-1 md:justify-end">
                {/* Priority Filter */}
                <select
                  value={reportPriorityFilter}
                  onChange={e => setReportPriorityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">🚨 Urgent Priority</option>
                  <option value="high">⚠️ High Priority</option>
                  <option value="medium">🔹 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>

                {/* Category Filter */}
                <select
                  value={reportCategoryFilter}
                  onChange={e => setReportCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Plumbing">💧 Plumbing</option>
                  <option value="Electrical">⚡ Electrical & AC</option>
                  <option value="Appliance">🔌 Appliance</option>
                  <option value="Structural & Locks">🔑 Doors, Windows & Locks</option>
                  <option value="Water & Heating">🔥 Water & Heating</option>
                  <option value="Noise & Disturbance">🔊 Noise / Disturbance</option>
                  <option value="Pest Control">🐜 Pest Control</option>
                  <option value="Security">🛡️ Security</option>
                  <option value="Other">🛠️ Other</option>
                </select>

                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs min-w-[160px]">
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={e => setReportSearch(e.target.value)}
                    placeholder="Search tenant, flat, or ticket..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>
            </div>

            {/* Filtered Reports List */}
            {(() => {
              const filteredReports = tenantReports.filter(r => {
                if (reportStatusFilter !== 'all' && r.status !== reportStatusFilter) return false;
                if (reportPriorityFilter !== 'all' && r.priority !== reportPriorityFilter) return false;
                if (reportCategoryFilter !== 'all' && r.category !== reportCategoryFilter) return false;
                if (reportSearch.trim()) {
                  const q = reportSearch.toLowerCase();
                  const match =
                    r.id.toLowerCase().includes(q) ||
                    r.tenantName.toLowerCase().includes(q) ||
                    r.unitNo.toLowerCase().includes(q) ||
                    r.propertyName.toLowerCase().includes(q) ||
                    r.title.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    (r.tenantId && r.tenantId.toLowerCase().includes(q));
                  if (!match) return false;
                }
                return true;
              });

              if (filteredReports.length === 0) {
                return (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">No Reports Found</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
                        There are no tenant reports matching the selected filters.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReportStatusFilter('all');
                        setReportPriorityFilter('all');
                        setReportCategoryFilter('all');
                        setReportSearch('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredReports.map(report => {
                    const isUrgent = report.priority === 'urgent';
                    const isPending = report.status === 'pending';
                    const isInReview = report.status === 'in_review';

                    return (
                      <div
                        key={report.id}
                        className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs space-y-4 ${
                          isPending && isUrgent
                            ? 'border-rose-400 ring-2 ring-rose-100'
                            : isPending
                            ? 'border-rose-200/90'
                            : isInReview
                            ? 'border-amber-200/90'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Top Meta Line: Ticket ID, Status, Priority, Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/70">
                              #{report.id}
                            </span>

                            {/* Priority Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                              report.priority === 'urgent'
                                ? 'bg-rose-600 text-white animate-pulse'
                                : report.priority === 'high'
                                ? 'bg-amber-500 text-white'
                                : report.priority === 'medium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {report.priority === 'urgent' && '🚨 '}
                              {report.priority}
                            </span>

                            {/* Category Badge */}
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                              {report.category}
                            </span>

                            {/* Status Pill */}
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                              report.status === 'pending'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : report.status === 'in_review'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : report.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              ● {report.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(report.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Flat Location & Tenant Card */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          
                          {/* Left: Location & Tenant Contact Details */}
                          <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
                              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                                Location & Flat
                              </span>
                              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md font-mono">
                                {report.unitNo}
                              </span>
                            </div>

                            <p className="font-extrabold text-slate-900 line-clamp-1">
                              {report.propertyName}
                            </p>

                            <div className="space-y-1 pt-1 text-slate-600">
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-bold text-slate-900">{report.tenantName}</span>
                                {report.tenantId && (
                                  <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-50 px-1 rounded">
                                    {report.tenantId}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <a href={`tel:${report.tenantPhone}`} className="text-blue-600 hover:underline">
                                  {report.tenantPhone}
                                </a>
                              </div>
                              {report.tenantEmail && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <a href={`mailto:${report.tenantEmail}`} className="text-blue-600 hover:underline truncate">
                                    {report.tenantEmail}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Issue Title, Description & Photos */}
                          <div className="md:col-span-8 space-y-2.5">
                            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                              <span>{report.title}</span>
                            </h4>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {report.description}
                            </div>

                            {/* Attached Photo Preview */}
                            {report.photoUrl && (
                              <div className="pt-1 flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-500">Attachment:</span>
                                <div
                                  onClick={() => setPreviewPhotoModal(report.photoUrl || null)}
                                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer border border-slate-200 group transition-all"
                                >
                                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                                  <span>View Issue Photo</span>
                                  <Eye className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                                </div>
                              </div>
                            )}

                            {/* Admin Note if already added */}
                            {report.adminNote && (
                              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                                <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-blue-700">
                                  <span>Admin Response / Assigned Staff:</span>
                                </span>
                                <p className="leading-relaxed">{report.adminNote}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Action Bar for this Report */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Status Changers */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 mr-1">Status:</span>

                            {report.status !== 'in_review' && (
                              <button
                                onClick={() => updateTenantReportStatus(report.id, 'in_review')}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                              >
                                <Wrench className="w-3 h-3" />
                                <span>Mark In Review</span>
                              </button>
                            )}

                            {report.status !== 'resolved' && (
                              <button
                                onClick={() => updateTenantReportStatus(report.id, 'resolved')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Mark Resolved</span>
                              </button>
                            )}

                            {report.status === 'resolved' && (
                              <button
                                onClick={() => updateTenantReportStatus(report.id, 'pending')}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reopen</span>
                              </button>
                            )}

                            {report.status !== 'dismissed' && (
                              <button
                                onClick={() => updateTenantReportStatus(report.id, 'dismissed')}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Dismiss
                              </button>
                            )}

                            {/* Add / Edit Admin Note Trigger */}
                            <button
                              onClick={() => {
                                setEditingAdminNoteId(report.id);
                                setAdminNoteText(report.adminNote || '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>{report.adminNote ? 'Edit Admin Note' : '+ Add Admin Note'}</span>
                            </button>
                          </div>

                          {/* Contact & Delete Buttons */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${report.tenantPhone}`}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Call</span>
                            </a>
                            {report.tenantEmail && (
                              <a
                                href={`mailto:${report.tenantEmail}?subject=Regarding Flat Report %23${report.id}&body=Hello ${report.tenantName}, we have received your maintenance report (${report.title}).`}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-blue-600" />
                                <span>Email</span>
                              </a>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Delete report ticket #${report.id}?`)) {
                                  deleteTenantReport(report.id);
                                }
                              }}
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Admin Note Editor */}
                        {editingAdminNoteId === report.id && (
                          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 animate-in fade-in">
                            <label className="text-xs font-bold text-blue-900 block">
                              Add Resolution Note / Assign Maintenance Staff:
                            </label>
                            <textarea
                              value={adminNoteText}
                              onChange={e => setAdminNoteText(e.target.value)}
                              rows={2}
                              placeholder="e.g. Assigned plumber John (555-0199) for visit on Thursday at 2:00 PM."
                              className="w-full p-2.5 rounded-xl bg-white border border-blue-300 text-xs outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingAdminNoteId(null)}
                                className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateTenantReportStatus(report.id, report.status, adminNoteText.trim());
                                  setEditingAdminNoteId(null);
                                }}
                                className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* Tab 5: Financial Accounting & Rent Breakdown by Property */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Month Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{'Financial Accounting & Rent by Property'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {'Select a month to see Paid and Pending rent by property name. Click on any property to see full details of who rented it.'}
                </p>
              </div>

              {/* Month Selector Dropdown */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Stripe Gateway Status Pill */}
                <div className={`p-2 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  settingsForm.stripeEnabled
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                  <CreditCard className={`w-4 h-4 ${settingsForm.stripeEnabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">Stripe Gateway</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${settingsForm.stripeEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span>{settingsForm.stripeEnabled ? 'Active' : 'Disabled'}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('site_settings')}
                    className="ml-1 text-[10px] text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                  >
                    {'Config'}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 bg-blue-50/80 p-2.5 px-4 rounded-2xl border border-blue-200 shadow-xs shrink-0">
                  <CalendarRange className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                      {'Selected Month'}
                    </span>
                    <select
                      value={selectedAccountingMonth}
                      onChange={e => setSelectedAccountingMonth(e.target.value)}
                      className="bg-transparent font-black text-slate-900 text-sm sm:text-base outline-none cursor-pointer pr-1"
                    >
                      {ACCOUNTING_MONTHS.map(m => (
                        <option key={m} value={m} className="font-semibold text-slate-800 bg-white">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Financial Highlight Cards for the Selected Month */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Expected */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {`Expected (${selectedAccountingMonth})`}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">
                  ${currentMonthExpected.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {monthlyPropertyAccountingList.length} {'active leased properties'}
                </span>
              </div>

              {/* Card 2: Total Paid */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1 bg-emerald-50/20">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
                  <span>{'Total Paid'}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono block">
                  ${currentMonthCollected.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  ✓ {currentMonthPaidCount} {'properties paid'}
                </span>
              </div>

              {/* Card 3: Total Pending */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-1 bg-amber-50/20">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
                  <span>{'Total Pending'}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono block">
                  ${currentMonthPending.toLocaleString()}
                </span>
                <span className="text-[11px] text-amber-700 font-semibold block">
                  ⏳ {currentMonthPendingCount} {'properties pending'}
                </span>
              </div>

              {/* Card 4: Collection Rate */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {'Collection Rate'}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {currentMonthCollectionRate}%
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono block">
                  {currentMonthCollectionRate}%
                </span>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentMonthCollectionRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Search & Filter Tabs for Properties */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setAccountingStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    accountingStatusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {'All Properties'} ({monthlyPropertyAccountingList.length})
                </button>

                <button
                  onClick={() => setAccountingStatusFilter('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    accountingStatusFilter === 'paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{'Paid'} ({currentMonthPaidCount})</span>
                </button>

                <button
                  onClick={() => setAccountingStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    accountingStatusFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{'Pending'} ({currentMonthPendingCount})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={accountingSearch}
                  onChange={e => setAccountingSearch(e.target.value)}
                  placeholder={'Search property or tenant...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* List of Properties with Paid & Pending for Selected Month */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {`Rent Status by Property Name for ${selectedAccountingMonth} (Click to view full tenant details)`}
                </span>
                <span className="text-xs text-slate-400">
                  {filteredAccountingList.length} {'properties'}
                </span>
              </div>

              {filteredAccountingList.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                  <Building className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">
                    {'No properties found for this filter.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredAccountingList.map((item, idx) => {
                    const isPaid = item.status === 'Paid';
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPropertyPaymentDetail(item)}
                        className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                          isPaid
                            ? 'border-slate-200/90 hover:border-emerald-300'
                            : 'border-amber-200/80 bg-amber-50/10 hover:border-amber-400 ring-1 ring-amber-100'
                        }`}
                      >
                        {/* Property Image & Details */}
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.property.photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                            alt={item.property.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-100 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                          />

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {item.property.title}
                              </h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {item.property.category}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                {item.property.unitNo}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 truncate">
                              📍 {item.property.address}
                            </p>

                            {/* Who rented it indicator */}
                            <div className="flex items-center gap-2 pt-0.5 text-xs">
                              <img
                                src={item.tenant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                                alt={item.tenant.fullName}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              />
                              <span className="font-semibold text-slate-700">
                                {'Rented by:'}{' '}
                                <span className="font-bold text-slate-900">{item.tenant.fullName}</span>
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-400">
                                ({item.tenant.uniqueLoginId})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rent Amount & Status for Selected Month */}
                        <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              {'Monthly Rent'}
                            </span>
                            <span className="text-base sm:text-lg font-black font-mono text-slate-900 block">
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>

                          {/* Payment Status Pill */}
                          <div className="text-right">
                            {isPaid ? (
                              <div className="inline-flex flex-col items-end">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 shadow-2xs">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>{'Paid'}</span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                                  {item.payment?.paidDate} • {item.payment?.method}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex flex-col items-end">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 shadow-2xs animate-pulse">
                                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>{'Pending'}</span>
                                </span>
                                <span className="text-[10px] font-mono text-rose-500 font-bold mt-1 block">
                                  {`$${item.amount} Due`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          <div className="hidden sm:flex items-center text-slate-400 group-hover:text-blue-600 transition-colors pl-2">
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Historical Payment Ledger Table (Collapsible / Summary) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-6">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {'Historical Payment Ledger'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {'Complete audit of all recorded transactions'}
                  </span>
                </div>
                <button
                  onClick={() => alert('Audited Financial Report downloaded as CSV.')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 inline mr-1" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Month</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {tenants.flatMap(t => t.payments).map((pay, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{pay.transactionId}</td>
                        <td className="py-3 px-4 font-mono text-blue-600 font-bold">{pay.tenantId}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{pay.month}</td>
                        <td className="py-3 px-4">{pay.method}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-600">${pay.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: Site Settings & Customization */}
        {activeTab === 'site_settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header with Save & Restore Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <Sliders className="w-6 h-6 text-blue-600" />
                  <span>{'Site Settings & Branding CMS'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {'Customize website logo, home & catalog banners, company descriptions, and contact box information in real-time.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={resetSiteSettings}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>{'Reset Defaults'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSiteSettings(settingsForm)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/25 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{'Save All Changes'}</span>
                </button>
              </div>
            </div>

            {/* Grid of Customization Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* 1. Logo & Brand Identity */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>1. Logo & Brand Identity</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Navbar & Footer
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      value={settingsForm.companyName}
                      onChange={e => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                      placeholder="e.g. RentFlow / Premier Living"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.companyTagline}
                      onChange={e => setSettingsForm({ ...settingsForm, companyTagline: e.target.value })}
                      placeholder="e.g. Better Homes. Brighter Future."
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700"
                    />
                  </div>

                  {/* Logo Upload & URL */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      Logo Image (Upload from desktop or enter URL)
                    </label>

                    {/* Dual Option: Desktop Upload OR Direct URL */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Upload Logo from Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageFileToDataUrl(file, dataUrl => {
                                  setSettingsForm(prev => ({ ...prev, logoUrl: dataUrl }));
                                });
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <span className="text-slate-400 text-center text-xs font-semibold">Or enter URL:</span>
                      </div>

                      <div className="relative">
                        <input
                          type="url"
                          value={settingsForm.logoUrl || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          placeholder="https://... (PNG/SVG/JPG Logo Link)"
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] pr-20"
                        />
                        {settingsForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                            className="absolute right-2 top-2 px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sample Logo Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold">Preset Logos:</span>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Default Icon
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Golden Crown
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=200&q=80'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Blue Cube
                    </button>
                  </div>

                  {/* Live Navbar Logo Preview */}
                  <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 mt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Live Navbar Logo Preview:
                    </span>
                    <div className="flex items-center py-2">
                      <BrandLogo logoUrl={settingsForm.logoUrl} theme="dark" size="md" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Home Hero Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <Image className="w-5 h-5 text-blue-600" />
                    <span>2. Home Hero Banner</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Home Page
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Home Hero Banner Upload & URL */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      Home Hero Background Image (Upload from desktop or enter URL) *
                    </label>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Upload Banner from Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageFileToDataUrl(file, dataUrl => {
                                  setSettingsForm(prev => ({ ...prev, homeBannerImage: dataUrl }));
                                });
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <span className="text-slate-400 text-center text-xs font-semibold">Or enter URL:</span>
                      </div>

                      <input
                        type="url"
                        value={settingsForm.homeBannerImage}
                        onChange={e => setSettingsForm({ ...settingsForm, homeBannerImage: e.target.value })}
                        placeholder="https://images.unsplash.com/... (Banner Image Link)"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Preset Banner Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold">Preset Banner Images:</span>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        homeBannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Modern Villa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        homeBannerImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Skyscraper City
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        homeBannerImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Luxury Penthouse
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Banner Headline</label>
                      <input
                        type="text"
                        value={settingsForm.homeBannerHeadline}
                        onChange={e => setSettingsForm({ ...settingsForm, homeBannerHeadline: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Banner Headline (Alternative)</label>
                      <input
                        type="text"
                        value={settingsForm.homeBannerHeadlineBn}
                        onChange={e => setSettingsForm({ ...settingsForm, homeBannerHeadlineBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Banner Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.homeBannerSubtitle}
                        onChange={e => setSettingsForm({ ...settingsForm, homeBannerSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Banner Subtitle (Alternative)</label>
                      <input
                        type="text"
                        value={settingsForm.homeBannerSubtitleBn}
                        onChange={e => setSettingsForm({ ...settingsForm, homeBannerSubtitleBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Banner Live Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden aspect-16/7 border border-slate-200 bg-slate-900 shadow-inner group">
                    <img
                      src={settingsForm.homeBannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 to-transparent flex flex-col justify-center p-4 text-white">
                      <span className="text-[10px] text-blue-300 font-bold uppercase">{settingsForm.homeBannerBadge}</span>
                      <h4 className="text-base font-black">{settingsForm.homeBannerHeadline}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{settingsForm.homeBannerSubtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. All Properties Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <ImagePlus className="w-5 h-5 text-blue-600" />
                    <span>3. All Properties Banner</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Rent / All Properties
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* All Properties Banner Upload & URL */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      All Properties Banner Image (Upload from desktop or enter URL) *
                    </label>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Upload Banner from Desktop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageFileToDataUrl(file, dataUrl => {
                                  setSettingsForm(prev => ({ ...prev, allPropertiesBannerImage: dataUrl }));
                                });
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <span className="text-slate-400 text-center text-xs font-semibold">Or enter URL:</span>
                      </div>

                      <input
                        type="url"
                        value={settingsForm.allPropertiesBannerImage}
                        onChange={e => setSettingsForm({ ...settingsForm, allPropertiesBannerImage: e.target.value })}
                        placeholder="https://images.unsplash.com/... (Banner Image Link)"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold">Preset Banner Images:</span>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        allPropertiesBannerImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Modern Estate
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        allPropertiesBannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      White Villa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({
                        ...settingsForm,
                        allPropertiesBannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85'
                      })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Modern Architecture
                    </button>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={settingsForm.allPropertiesBannerHeadline}
                      onChange={e => setSettingsForm({ ...settingsForm, allPropertiesBannerHeadline: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.allPropertiesBannerSubtitle}
                      onChange={e => setSettingsForm({ ...settingsForm, allPropertiesBannerSubtitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  {/* All Properties Live Banner Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden aspect-16/7 border border-slate-200 bg-slate-900 shadow-inner group">
                    <img
                      src={settingsForm.allPropertiesBannerImage}
                      alt="All Properties Banner Preview"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 to-transparent flex flex-col justify-center p-4 text-white">
                      <h4 className="text-base font-black">{settingsForm.allPropertiesBannerHeadline}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{settingsForm.allPropertiesBannerSubtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Company Description & Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>4. Company Description & Details</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    About & Footer
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Description (Summary) *</label>
                    <textarea
                      rows={2}
                      value={settingsForm.companyDescriptionBn}
                      onChange={e => setSettingsForm({ ...settingsForm, companyDescriptionBn: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Description (Full)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.companyDescription}
                      onChange={e => setSettingsForm({ ...settingsForm, companyDescription: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <label className="font-bold text-slate-700 block pt-1">Home Banner 4 Highlights / Badges:</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={settingsForm.badge1}
                      onChange={e => setSettingsForm({ ...settingsForm, badge1: e.target.value })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                    <input
                      type="text"
                      value={settingsForm.badge2}
                      onChange={e => setSettingsForm({ ...settingsForm, badge2: e.target.value })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                    <input
                      type="text"
                      value={settingsForm.badge3}
                      onChange={e => setSettingsForm({ ...settingsForm, badge3: e.target.value })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                    <input
                      type="text"
                      value={settingsForm.badge4}
                      onChange={e => setSettingsForm({ ...settingsForm, badge4: e.target.value })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* 5. Contact Box & Office Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>5. Contact Box & Office Details</span>
                </div>
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  Contact Section
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
                
                {/* Form Fields (Left 7 Cols) */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Office / Headquarters Name *</label>
                      <input
                        type="text"
                        value={settingsForm.officeName}
                        onChange={e => setSettingsForm({ ...settingsForm, officeName: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Office Hours *</label>
                      <input
                        type="text"
                        value={settingsForm.workingHours}
                        onChange={e => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Main Office Full Address *</label>
                    <input
                      type="text"
                      value={settingsForm.contactAddress}
                      onChange={e => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Hotline & WhatsApp Number *</label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Support Email Address *</label>
                      <input
                        type="text"
                        value={settingsForm.contactEmail}
                        onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Section Title</label>
                      <input
                        type="text"
                        value={settingsForm.contactTitleBn}
                        onChange={e => setSettingsForm({ ...settingsForm, contactTitleBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Section Subtitle</label>
                      <input
                        type="text"
                        value={settingsForm.contactTitle}
                        onChange={e => setSettingsForm({ ...settingsForm, contactTitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Contact Card Preview (Right 5 Cols) */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <span className="text-xs uppercase font-bold text-blue-400">Live Contact Box Preview</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{settingsForm.officeName}</h4>
                      <p className="text-[11px] text-blue-300">Property Management Division</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[11px] text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Main Office:</span>
                        <span className="text-slate-300 block">{settingsForm.contactAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Hotline & WhatsApp:</span>
                        <span className="font-mono text-slate-300 block">{settingsForm.contactPhone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Support Email:</span>
                        <span className="text-slate-300 block">{settingsForm.contactEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Visiting Hours:</span>
                        <span className="text-slate-300 block">{settingsForm.workingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 6. Stripe Payment Integration */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-2xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>6. Stripe Payment Integration</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect your Stripe payment link directly to the tenant portal page. You can toggle this on or off at any time.
                    </p>
                  </div>
                </div>

                {/* Master Toggle Switch */}
                <div className="flex items-center gap-3 bg-slate-50 p-2 px-3.5 rounded-2xl border border-slate-200">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Stripe Gateway Status
                    </span>
                    <span className={`text-xs font-black block ${settingsForm.stripeEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {settingsForm.stripeEnabled ? '✓ Active (ON)' : '✕ Disabled (OFF)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSettingsForm(prev => ({ ...prev, stripeEnabled: !prev.stripeEnabled }))}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                      settingsForm.stripeEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                    title={settingsForm.stripeEnabled ? 'Click to disable Stripe' : 'Click to enable Stripe'}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-md block transform transition-transform" />
                  </button>
                </div>
              </div>

              {/* Status Warning / Info Notice */}
              {!settingsForm.stripeEnabled ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Stripe online payment is currently disabled (OFF)</span>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Tenants will not see any Stripe link or option on their portal or payment modal. Turn on the toggle above to enable it again.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Stripe payment option is Active (ON) — Linked to Tenant Portal</span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      A direct card payment button will appear on the tenant portal. Tenants can pay rent directly to your Stripe account.
                    </p>
                  </div>
                </div>
              )}

              {/* Configuration Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Landlord Account / Brand Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Stripe Account or Business Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.stripeAccountName || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, stripeAccountName: e.target.value })}
                    placeholder="e.g. RentFlow Landlord Official Account"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">
                    This name is displayed on the tenant payment card so they know who they are paying.
                  </p>
                </div>

                {/* 2. Stripe Payment URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Stripe Payment Link / Checkout URL</span>
                    <span className="text-[10px] font-mono text-indigo-600">buy.stripe.com</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={settingsForm.stripePaymentUrl || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, stripePaymentUrl: e.target.value })}
                      placeholder="https://buy.stripe.com/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono pr-20"
                    />
                    {settingsForm.stripePaymentUrl && (
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, stripePaymentUrl: '' })}
                        className="absolute right-2 top-2 px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      >
                            Clear
                          </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-slate-400">Quick Actions:</span>
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({
                        ...prev,
                        stripePaymentUrl: 'https://buy.stripe.com/test_rentflow_landlord_demo',
                        stripeAccountName: prev.stripeAccountName || 'RentFlow Landlord Account'
                      }))}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors cursor-pointer"
                    >
                      Set Sample Link
                    </button>
                    {settingsForm.stripePaymentUrl && (
                      <button
                        type="button"
                        onClick={() => window.open(settingsForm.stripePaymentUrl, '_blank')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Open Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* How it works guidance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>How to get your Stripe Payment Link?</span>
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
                  <li>Log in to your <strong className="text-slate-800">dashboard.stripe.com</strong> account.</li>
                  <li>Navigate to <strong className="text-slate-800">Payment Links</strong> and click <strong className="text-slate-800">+ New</strong> to create a payment link with your rent amount.</li>
                  <li>Copy the created link, paste it into the box above, and click <strong className="text-slate-800">✓ Save Changes</strong> below.</li>
                  <li>Tenants will be able to pay easily via Visa, MasterCard, American Express, or Apple Pay.</li>
                </ol>
              </div>

              {/* Live Tenant Portal Preview Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Live Tenant Portal Preview:</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    settingsForm.stripeEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {settingsForm.stripeEnabled ? 'Visible on Tenant Portal' : 'Hidden from Tenant Portal'}
                  </span>
                </span>

                {settingsForm.stripeEnabled ? (
                  <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-md border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-black text-sm">
                          S
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-sm text-white">Stripe Online Payment</h5>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-200">
                            {settingsForm.stripeAccountName || 'Landlord Stripe Account'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-300 font-mono">
                        <span>VISA</span> • <span>MC</span> • <span>AMEX</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">
                      Pay your rent directly to your landlord’s verified Stripe checkout account via Credit/Debit card.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                        <CreditCard className="w-4 h-4" />
                        <span>💳 Pay Online via Stripe</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <div className="px-4 py-2.5 rounded-xl bg-white/10 text-indigo-100 font-bold text-xs flex items-center justify-center">
                      Record Receipt
                    </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-100 border border-dashed border-slate-300 text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">Stripe payment option is currently disabled</p>
                    <p className="text-[11px] text-slate-400">
                      This card and the Stripe payment option will not appear on the tenant portal.
                    </p>
                  </div>
                )}
              </div>

              {/* Commercial Data Management & Backup Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Commercial Template & Database Management</h3>
                      <p className="text-xs text-slate-400">
                        Export local CRM data as portable JSON backup or reset system to fresh factory demo state.
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 font-mono">
                    ✓ Production Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  
                  {/* Cloud Database Connector */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-700/70 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-200">
                        <Cloud className="w-4 h-4 text-indigo-400" />
                        <span>Cloud DB & Firebase Sync</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Connect Google Firebase with 1-click or switch storage modes without any coding.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('database')}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Open DB & Sync Manager</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200">
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>Export Database Backup</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Download all current properties, tenant accounts, lease agreements, and payment records into a single JSON file.
                    </p>
                    <button
                      type="button"
                      onClick={exportSystemData}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export System JSON</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span>Reset Factory Demo Data</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Instantly restores all default listings, demo tenants, inspection bookings, and site settings.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to restore the demo database to factory defaults? All manual edits will be reset.')) {
                          resetAllDemoData();
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Factory State</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Sticky / Callout Bar */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h4 className="font-bold text-sm">Save Site Settings</h4>
                <p className="text-xs text-blue-200">
                  After saving, changes are immediately reflected across the home page, all properties, navbar, and footer.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetSiteSettings}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                    Reset to Default
                  </button>
                <button
                  type="button"
                  onClick={() => updateSiteSettings(settingsForm)}
                  className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/30 cursor-pointer transition-colors"
                >
                    ✓ Save Changes
                  </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Stripe Online Rent Payment Setup */}
        {activeTab === 'stripe_setup' && (
          <StripeSetupPanel />
        )}

        {/* Tab: Cloud Database & Automated Backup Manager */}
        {activeTab === 'database' && (
          <DatabaseSettingsPanel />
        )}

      </main>

      {/* Modal 1: Click-to-view Tenant Ledger & Next Rent Countdown (Plan requirement!) */}
      {inspectTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={inspectTenant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{inspectTenant.fullName}</h3>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    ID: {inspectTenant.uniqueLoginId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectTenant(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Next Rent Countdown Pill */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider block">
                  Next Rent Due Countdown
                </span>
                <span className="text-lg font-bold mt-0.5 block">
                  Due on: {inspectTenant.nextDueDate}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-cyan-300 block">
                  ~15 Days Left
                </span>
                <span className="text-xs text-slate-300">Countdown active</span>
              </div>
            </div>

            {/* Tenant Property & Ledger Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Phone:</span>
                <span className="font-bold text-slate-900 block mt-0.5">{inspectTenant.phoneNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-bold text-slate-900 block mt-0.5">{inspectTenant.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Monthly Rent:</span>
                <span className="font-bold text-blue-600 block mt-0.5">${inspectTenant.monthlyRent}/month</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Outstanding Due:</span>
                <span className={`font-bold block mt-0.5 ${inspectTenant.dueAmount > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  ${inspectTenant.dueAmount}
                </span>
              </div>
            </div>

            {/* Additional Description / Notes if present */}
            {inspectTenant.notes && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                <span className="font-extrabold text-blue-900 block">
                  📝 {'Additional Description & Lease Terms:'}
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{inspectTenant.notes}</p>
              </div>
            )}

            {/* Month-by-month Payment History Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Monthly Rent Payment Records
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Date Paid</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {inspectTenant.payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400">
                          No previous payments recorded for this lease.
                        </td>
                      </tr>
                    ) : (
                      inspectTenant.payments.map((p, i) => (
                        <tr key={i}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{p.month}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{p.paidDate}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">${p.amount}</td>
                          <td className="py-2.5 px-3">{p.method}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Paid</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  makeRentPayment(inspectTenant.uniqueLoginId, 'Current Month', inspectTenant.monthlyRent, 'Bank Transfer');
                  setInspectTenant(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                + Record Rent Payment For This Tenant
              </button>
              <button
                onClick={() => setInspectTenant(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Schedule Meeting Modal */}
      {meetingModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">Schedule Inspection Meeting</h3>
              </div>
              <button onClick={() => setMeetingModalItem(null)} className="text-slate-400">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Schedule a meeting with <b>{meetingModalItem.fullName}</b> for <b>{meetingModalItem.propertyTitle}</b>.
            </p>

            <form onSubmit={handleSaveMeeting} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Date</label>
                <input
                  type="date"
                  required
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Time</label>
                <input
                  type="text"
                  required
                  value={meetingTime}
                  onChange={e => setMeetingTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Type</label>
                <select
                  value={meetingType}
                  onChange={e => setMeetingType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="in_person">In-Person at Main Office</option>
                  <option value="email">Direct Email Discussion</option>
                  <option value="video_call">Live Video Call Walkthrough</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location or Instructions</label>
                <textarea
                  rows={2}
                  value={meetingNotes}
                  onChange={e => setMeetingNotes(e.target.value)}
                  placeholder="Office address or conference room notes..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Confirm & Schedule Meeting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add New Property Modal */}
      {showAddPropModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add New Rental Property</h3>
              </div>
              <button onClick={() => setShowAddPropModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={newProp.title}
                    onChange={e => setNewProp({ ...newProp, title: e.target.value })}
                    placeholder="e.g. Grand Boulevard Luxury Duplex"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Property Subtitle / Tagline *</label>
                  <input
                    type="text"
                    value={newProp.titleBn}
                    onChange={e => setNewProp({ ...newProp, titleBn: e.target.value })}
                    placeholder="e.g. Modern Luxury Family Residence..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProp.category}
                    onChange={e => setNewProp({ ...newProp, category: e.target.value as PropertyCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House & Villa</option>
                    <option value="Office">Commercial Office</option>
                    <option value="Parking/Garage">Parking & Garage</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Rent ($) *</label>
                  <input
                    type="number"
                    required
                    value={newProp.rentAmount}
                    onChange={e => setNewProp({ ...newProp, rentAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit / Floor</label>
                  <input
                    type="text"
                    value={newProp.unitNo}
                    onChange={e => setNewProp({ ...newProp, unitNo: e.target.value })}
                    placeholder="e.g. Suite 301, 3rd Floor"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={newProp.address}
                  onChange={e => setNewProp({ ...newProp, address: e.target.value })}
                  placeholder="e.g. 102 Park Avenue, Downtown Corridor"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              {/* Color Details (CRITICAL FEATURE requested by user in prompt) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>Wall Color & Interior Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newProp.colorDetails.walls}
                    onChange={e => setNewProp({
                      ...newProp,
                      colorDetails: { ...newProp.colorDetails, walls: e.target.value }
                    })}
                    placeholder="Wall colors (e.g. Warm Ivory & Pearl White)"
                    className="p-2 rounded-lg bg-white border border-amber-200 text-xs"
                  />
                  <input
                    type="text"
                    value={newProp.colorDetails.livingRoom}
                    onChange={e => setNewProp({
                      ...newProp,
                      colorDetails: { ...newProp.colorDetails, livingRoom: e.target.value }
                    })}
                    placeholder="Living room tone (e.g. Modern Greige)"
                    className="p-2 rounded-lg bg-white border border-amber-200 text-xs"
                  />
                </div>
              </div>

              {/* 1. Multiple Photos Support */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ImagePlus className="w-4 h-4 text-blue-600" />
                    <span>Property Photos ({newProp.photos.length} uploaded) *</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">At least 1 photo required</span>
                </div>

                {/* Desktop Upload Button & URL Adder */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-sm shadow-blue-500/20 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photos from Desktop</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={e => {
                          handleMultipleFilesToPhotos(e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <span className="text-slate-400 text-center text-xs font-semibold">Or add via Image URL:</span>
                  </div>

                  {/* Photo Add Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newPhotoInput}
                      onChange={e => setNewPhotoInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... (Image URL)"
                      className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] focus:outline-blue-500"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newPhotoInput.trim()) {
                            setNewProp({ ...newProp, photos: [...newProp.photos, newPhotoInput.trim()] });
                            setNewPhotoInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPhotoInput.trim()) {
                          setNewProp({ ...newProp, photos: [...newProp.photos, newPhotoInput.trim()] });
                          setNewPhotoInput('');
                        }
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo URL</span>
                    </button>
                  </div>
                </div>

                {/* Quick Preset Sample Photos */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold">Add Preset Photos:</span>
                  <button
                    type="button"
                    onClick={() => setNewProp({
                      ...newProp,
                      photos: [...newProp.photos, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
                    })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    + Living Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({
                      ...newProp,
                      photos: [...newProp.photos, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80']
                    })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    + Master Bedroom
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({
                      ...newProp,
                      photos: [...newProp.photos, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80']
                    })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    + Modern Kitchen
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({
                      ...newProp,
                      photos: [...newProp.photos, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80']
                    })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    + Exterior View
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProp({
                      ...newProp,
                      photos: [...newProp.photos, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80']
                    })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    + Balcony
                  </button>
                </div>

                {/* Photos List Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {newProp.photos.map((photoUrl, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-2xs aspect-16/11">
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white">
                        {idx === 0 ? '👑 Cover Photo' : `Photo #${idx + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = newProp.photos.filter((_, i) => i !== idx);
                          setNewProp({ ...newProp, photos: updated });
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Key Interior Details: Bed, Bath, Kitchen, Sqft */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Key 4 Interior Details *</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Bed className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bedrooms</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProp.bedrooms}
                      onChange={e => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-center"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Bath className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bathrooms</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProp.bathrooms}
                      onChange={e => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-center"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Utensils className="w-3.5 h-3.5 text-blue-600" />
                      <span>Kitchen</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProp.kitchens || 1}
                      onChange={e => setNewProp({ ...newProp, kitchens: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-center"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Area (Sq.Ft.)</span>
                    </label>
                    <input
                      type="number"
                      min="100"
                      required
                      value={newProp.areaSqFt}
                      onChange={e => setNewProp({ ...newProp, areaSqFt: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Key Features List */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Key Features List</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProp({
                        ...newProp,
                        features: [...newProp.features, '']
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Feature</span>
                  </button>
                </div>

                {/* Quick Feature Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-amber-900">
                  <span className="font-semibold text-amber-800">Suggestions:</span>
                  {[
                    '24/7 CCTV & Security Guard',
                    'Modern Modular Kitchen',
                    'Spacious South-Facing Balcony',
                    'Full Power Backup Generator',
                    'Fast Capsule Elevator',
                    'Central Water Heater & Geyser'
                  ].map((sugg, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        if (!newProp.features.includes(sugg)) {
                          setNewProp({ ...newProp, features: [...newProp.features, sugg] });
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-[11px] cursor-pointer"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>

                {/* Numbered 1, 2, 3... List of Features */}
                <div className="space-y-2 pt-1">
                  {newProp.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center shrink-0">
                        {fIdx + 1}
                      </div>
                      <input
                        type="text"
                        value={feat}
                        onChange={e => {
                          const updated = [...newProp.features];
                          updated[fIdx] = e.target.value;
                          setNewProp({ ...newProp, features: updated });
                        }}
                        placeholder={`Feature #${fIdx + 1} (e.g. Spacious South-Facing Balcony)...`}
                        className="flex-1 p-2 rounded-xl bg-white border border-amber-200 text-xs font-medium text-slate-800 focus:outline-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = newProp.features.filter((_, i) => i !== fIdx);
                          setNewProp({ ...newProp, features: updated });
                        }}
                        className="p-2 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Amenities & Keywords */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>Amenities & Keywords</span>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-medium">Click to toggle</span>
                </div>

                {/* Standard Keywords Toggle Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, furnished: !newProp.furnished })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      newProp.furnished
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Armchair className="w-4 h-4 shrink-0" />
                    <span>Furnished</span>
                    <span className="ml-auto text-[10px]">{newProp.furnished ? '✓' : ''}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, parking: !newProp.parking })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      newProp.parking
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Car className="w-4 h-4 shrink-0" />
                    <span>Parking</span>
                    <span className="ml-auto text-[10px]">{newProp.parking ? '✓' : ''}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, security: !newProp.security })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      newProp.security
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Security</span>
                    <span className="ml-auto text-[10px]">{newProp.security ? '✓' : ''}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProp({ ...newProp, wifi: !newProp.wifi })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      newProp.wifi
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wifi className="w-4 h-4 shrink-0" />
                    <span>WiFi Internet</span>
                    <span className="ml-auto text-[10px]">{newProp.wifi ? '✓' : ''}</span>
                  </button>
                </div>

                {/* Additional Pre-made Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">More Keywords:</span>
                  {['Elevator', 'Generator', 'Gas Line', 'Balcony', 'Swimming Pool', 'Fitness Gym', 'Intercom'].map((kw, kIdx) => {
                    const isAdded = newProp.amenities?.includes(kw);
                    return (
                      <button
                        key={kIdx}
                        type="button"
                        onClick={() => {
                          const currentAmenities = newProp.amenities || [];
                          if (isAdded) {
                            setNewProp({ ...newProp, amenities: currentAmenities.filter(a => a !== kw) });
                          } else {
                            setNewProp({ ...newProp, amenities: [...currentAmenities, kw] });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
                        }`}
                      >
                        {isAdded ? `✓ ${kw}` : `+ ${kw}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Keyword Adder */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customKeywordInput}
                    onChange={e => setCustomKeywordInput(e.target.value)}
                    placeholder="Custom keyword (e.g. Rooftop Garden, Duplex, Solar)..."
                    className="flex-1 p-2 rounded-xl bg-white border border-indigo-200 text-xs focus:outline-indigo-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customKeywordInput.trim()) {
                          const currentAmenities = newProp.amenities || [];
                          if (!currentAmenities.includes(customKeywordInput.trim())) {
                            setNewProp({ ...newProp, amenities: [...currentAmenities, customKeywordInput.trim()] });
                          }
                          setCustomKeywordInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customKeywordInput.trim()) {
                        const currentAmenities = newProp.amenities || [];
                        if (!currentAmenities.includes(customKeywordInput.trim())) {
                          setNewProp({ ...newProp, amenities: [...currentAmenities, customKeywordInput.trim()] });
                        }
                        setCustomKeywordInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    + Add Keyword
                  </button>
                </div>

                {/* Custom Keywords Tags Badges */}
                {newProp.amenities && newProp.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newProp.amenities.map((item, aIdx) => (
                      <span
                        key={aIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 text-xs font-semibold"
                      >
                        <span>#{item}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewProp({
                              ...newProp,
                              amenities: newProp.amenities.filter((_, i) => i !== aIdx)
                            });
                          }}
                          className="hover:text-rose-600 text-indigo-500 font-bold ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Video Walkthrough URL */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Video Walkthrough YouTube Embed URL (Optional)</label>
                <input
                  type="url"
                  value={newProp.videoUrl}
                  onChange={e => setNewProp({ ...newProp, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]"
                />
              </div>

              {/* 6. Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Property Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newProp.description}
                  onChange={e => setNewProp({ ...newProp, description: e.target.value })}
                  placeholder="Write detailed property description and features..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPropModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save & Publish Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Add Tenant & Create Profile */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                  <UserPlus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {'Add Tenant & Create Profile'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {'Assign property, set monthly rent, due date, photo and lease description'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTenantProfile} className="space-y-4 text-xs">
              
              {/* 1. Tenant Photo/Avatar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <label className="font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📸 {'Select Tenant Photo'}</span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    ({'Click to select preset or paste URL'})
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={tenantForm.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-3 border-blue-600 shadow-md ring-2 ring-blue-100 shrink-0"
                  />
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setTenantForm({ ...tenantForm, avatar: url })}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer hover:scale-110 ${
                            tenantForm.avatar === url
                              ? 'border-blue-600 ring-2 ring-blue-400 scale-105'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs shrink-0">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload from Desktop</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageFileToDataUrl(file, dataUrl => {
                                setTenantForm(prev => ({ ...prev, avatar: dataUrl }));
                              });
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={tenantForm.avatar}
                        onChange={e => setTenantForm({ ...tenantForm, avatar: e.target.value })}
                        placeholder="Or paste image URL..."
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Name, Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantForm.fullName}
                    onChange={e => setTenantForm({ ...tenantForm, fullName: e.target.value })}
                    placeholder="e.g. Asif Rahman"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={tenantForm.email}
                    onChange={e => setTenantForm({ ...tenantForm, email: e.target.value })}
                    placeholder="tenant@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={tenantForm.phoneNumber}
                    onChange={e => setTenantForm({ ...tenantForm, phoneNumber: e.target.value })}
                    placeholder="+880 1712-345678"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* 3. Property Assignment */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 block">
                    🏢 {'Select Assigned Rental Property *'}
                  </label>
                  <span className="text-[11px] text-blue-600 font-bold">
                    {properties.filter(p => p.status === 'available').length} {'Available'}
                  </span>
                </div>

                <select
                  required
                  value={tenantForm.propertyId}
                  onChange={e => handlePropertyChangeInTenantForm(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs focus:border-blue-600 outline-none cursor-pointer"
                >
                  <option value="" disabled>-- {'Select Property'} --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} • {p.unitNo} • {p.location} (${p.rentAmount}/mo) {p.status === 'rented' ? '⚠️ (Occupied)' : '✓ (Available)'}
                    </option>
                  ))}
                </select>

                {/* Selected Property Preview Details */}
                {(() => {
                  const selectedP = properties.find(p => p.id === tenantForm.propertyId);
                  if (!selectedP) return null;
                  return (
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-blue-200 shadow-2xs mt-2">
                      <img
                        src={selectedP.photos[0]}
                        alt={selectedP.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-xs truncate">{selectedP.title}</span>
                          <span className="text-[11px] font-mono font-black text-blue-600 shrink-0">
                            ${selectedP.rentAmount}/mo
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">{selectedP.address}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium mt-1">
                          <span>🚪 Unit: {selectedP.unitNo}</span>
                          <span>• {selectedP.bedrooms} Bed</span>
                          <span>• {selectedP.bathrooms} Bath</span>
                          <span>• {selectedP.areaSqFt} sq.ft</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 4. Monthly Rent & Due Day */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    💰 {'Monthly Rent ($/mo) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      min={100}
                      value={tenantForm.monthlyRent}
                      onChange={e => setTenantForm({ ...tenantForm, monthlyRent: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    🛡️ {'Security Deposit ($)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min={0}
                      value={tenantForm.depositAmount}
                      onChange={e => setTenantForm({ ...tenantForm, depositAmount: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    📅 {'Due Day of Month *'}
                  </label>
                  <select
                    value={tenantForm.dueDayOfMonth}
                    onChange={e => {
                      const day = Number(e.target.value);
                      const next = new Date();
                      next.setMonth(next.getMonth() + 1);
                      next.setDate(day);
                      setTenantForm({
                        ...tenantForm,
                        dueDayOfMonth: day,
                        nextDueDate: next.toISOString().split('T')[0]
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs focus:border-blue-600 outline-none cursor-pointer"
                  >
                    <option value={1}>1st of each month</option>
                    <option value={5}>5th of each month</option>
                    <option value={10}>10th of each month</option>
                    <option value={15}>15th of each month</option>
                    <option value={20}>20th of each month</option>
                    <option value={25}>25th of each month</option>
                    <option value={30}>End of each month</option>
                  </select>
                </div>
              </div>

              {/* Specific Next Due Date & Unique ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {'Next Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={tenantForm.nextDueDate}
                    onChange={e => setTenantForm({ ...tenantForm, nextDueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-semibold focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    🔑 {'Unique Tenant ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantForm.uniqueLoginId}
                    onChange={e => setTenantForm({ ...tenantForm, uniqueLoginId: e.target.value })}
                    placeholder="e.g. TNT-2026-05"
                    className="w-full p-2.5 rounded-xl bg-blue-50/50 border border-blue-200 font-mono font-bold text-blue-700 focus:border-blue-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {'Tenant will log in with this ID.'}
                  </span>
                </div>
              </div>

              {/* 5. Additional Description & Lease Terms */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>📝 {'Additional Description & Lease Terms'}</span>
                  <span className="text-[10px] text-slate-400">({'Optional'})</span>
                </label>
                <textarea
                  rows={2}
                  value={tenantForm.notes}
                  onChange={e => setTenantForm({ ...tenantForm, notes: e.target.value })}
                  placeholder={
                    'e.g. Electricity bill paid by tenant, parking slot B-1 included, 1 month advance deposit paid...'
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-blue-600 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{'Create & Confirm Tenant Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Tenant Created Success Modal with Login Credentials Card */}
      {createdTenantSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                {'Tenant Profile Created Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {'The tenant can now log into the Tenant Portal using this unique ID.'}
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl text-left space-y-3.5 shadow-xl border border-blue-900">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <img
                  src={createdTenantSuccess.avatar}
                  alt={createdTenantSuccess.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                />
                <div>
                  <h4 className="font-extrabold text-base text-white">{createdTenantSuccess.fullName}</h4>
                  <span className="text-xs text-slate-300 block">{createdTenantSuccess.phoneNumber}</span>
                </div>
              </div>

              {/* Unique ID Highlight with Copy Button */}
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                    {'Tenant Login Unique ID'}
                  </span>
                  <span className="text-xl font-mono font-black text-cyan-300 tracking-wider">
                    {createdTenantSuccess.uniqueLoginId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdTenantSuccess.uniqueLoginId);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Lease Details */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{'Monthly Rent:'}</span>
                  <span className="font-mono font-bold text-emerald-400">${createdTenantSuccess.monthlyRent}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>{'Due Date:'}</span>
                  <span className="font-semibold text-white">
                    {createdTenantSuccess.dueDayOfMonth ? `Day ${createdTenantSuccess.dueDayOfMonth} of month` : createdTenantSuccess.nextDueDate}
                  </span>
                </div>
                {createdTenantSuccess.notes && (
                  <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                    <span className="font-bold text-slate-200">Notes: </span>
                    {createdTenantSuccess.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  loginAsTenant(createdTenantSuccess.uniqueLoginId);
                  setCreatedTenantSuccess(null);
                  setCurrentView('tenant_portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{'Test Login as this Tenant'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedTenantSuccess(null);
                  setActiveTab('tenants');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {'View in Tenants List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Leased Property Tenant & Payment Details */}
      {selectedPropertyPaymentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {'Property & Tenant Lease Profile'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {`Rent account & tenant details for ${selectedAccountingMonth}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPropertyPaymentDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Property Banner Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={selectedPropertyPaymentDetail.property.photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                alt={selectedPropertyPaymentDetail.property.title}
                className="w-full sm:w-28 h-28 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
              />
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {selectedPropertyPaymentDetail.property.category}
                  </span>
                  <span className="text-sm font-black font-mono text-blue-600">
                    ${selectedPropertyPaymentDetail.amount}/mo
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedPropertyPaymentDetail.property.title}
                </h4>
                <p className="text-xs text-slate-500">
                  📍 {selectedPropertyPaymentDetail.property.address}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                  <span>🚪 Unit: <b>{selectedPropertyPaymentDetail.property.unitNo}</b></span>
                  <span>• {selectedPropertyPaymentDetail.property.bedrooms} Bed</span>
                  <span>• {selectedPropertyPaymentDetail.property.bathrooms} Bath</span>
                  <span>• {selectedPropertyPaymentDetail.property.areaSqFt} sq.ft</span>
                </div>
              </div>
            </div>

            {/* Section 2: Tenant Profile Details */}
            <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-slate-900 to-blue-950 text-white space-y-4 shadow-lg border border-blue-900/60">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{'Rented By (Tenant Profile):'}</span>
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-bold bg-white/10 px-2 py-0.5 rounded-md">
                  Active Lease
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedPropertyPaymentDetail.tenant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={selectedPropertyPaymentDetail.tenant.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-400 shadow-md ring-2 ring-blue-500/20"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      {selectedPropertyPaymentDetail.tenant.fullName}
                    </h4>
                    <span className="text-xs text-slate-300 block">
                      {selectedPropertyPaymentDetail.tenant.email}
                    </span>
                    <span className="text-xs text-cyan-300 font-mono font-bold block mt-0.5">
                      📞 {selectedPropertyPaymentDetail.tenant.phoneNumber}
                    </span>
                  </div>
                </div>

                {/* Unique Login ID */}
                <div className="p-2.5 px-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between sm:justify-end gap-2.5">
                  <div>
                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                      Unique Tenant ID
                    </span>
                    <span className="text-sm font-mono font-black text-cyan-300">
                      {selectedPropertyPaymentDetail.tenant.uniqueLoginId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPropertyPaymentDetail.tenant.uniqueLoginId);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                    title="Copy Unique ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Lease Dates & Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block">{'Lease Started:'}</span>
                  <span className="font-semibold text-white font-mono">{selectedPropertyPaymentDetail.tenant.leaseStartDate || '2026-05-01'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{'Due Date Schedule:'}</span>
                  <span className="font-semibold text-white">
                    {selectedPropertyPaymentDetail.tenant.dueDayOfMonth
                      ? `Day ${selectedPropertyPaymentDetail.tenant.dueDayOfMonth} of month`
                      : `Due on ${selectedPropertyPaymentDetail.tenant.nextDueDate}`}
                  </span>
                </div>
              </div>

              {/* Additional Description / Notes if any */}
              {selectedPropertyPaymentDetail.tenant.notes && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                  <span className="font-bold text-blue-300">📝 Lease Terms & Additional Notes: </span>
                  <span className="text-slate-200">{selectedPropertyPaymentDetail.tenant.notes}</span>
                </div>
              )}
            </div>

            {/* Section 3: Selected Month Payment Status Card */}
            <div className={`p-4 rounded-2xl border ${
              selectedPropertyPaymentDetail.status === 'Paid'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                    {`Status for ${selectedAccountingMonth}:`}
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedPropertyPaymentDetail.status === 'Paid' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-lg font-black text-emerald-800">
                          {`Payment Received ($${selectedPropertyPaymentDetail.amount})`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="text-lg font-black text-amber-800">
                          {`Pending / Due ($${selectedPropertyPaymentDetail.amount})`}
                        </span>
                      </>
                    )}
                  </div>

                  {selectedPropertyPaymentDetail.status === 'Paid' && selectedPropertyPaymentDetail.payment && (
                    <p className="text-xs text-emerald-700 font-mono">
                      Paid Date: {selectedPropertyPaymentDetail.payment.paidDate} • Method: {selectedPropertyPaymentDetail.payment.method} • Transaction: {selectedPropertyPaymentDetail.payment.transactionId}
                    </p>
                  )}
                  {selectedPropertyPaymentDetail.status === 'Pending' && (
                    <p className="text-xs text-amber-700">
                      Tenant has not submitted payment for this month yet.
                    </p>
                  )}
                </div>

                {/* If Pending, button to record payment */}
                {selectedPropertyPaymentDetail.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      makeRentPayment(
                        selectedPropertyPaymentDetail.tenant.uniqueLoginId,
                        selectedAccountingMonth,
                        selectedPropertyPaymentDetail.amount,
                        'Bank Transfer'
                      );
                      // Update detail state to Paid
                      setSelectedPropertyPaymentDetail(prev =>
                        prev
                          ? {
                              ...prev,
                              status: 'Paid',
                              payment: {
                                id: `pay-${Date.now()}`,
                                tenantId: prev.tenant.uniqueLoginId,
                                propertyId: prev.property.id,
                                month: selectedAccountingMonth,
                                amount: prev.amount,
                                paidDate: new Date().toISOString().split('T')[0],
                                method: 'Bank Transfer',
                                status: 'Paid',
                                transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                                receiptNumber: `REC-${Date.now().toString().slice(-6)}`
                              }
                            }
                          : null
                      );
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 shrink-0 cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{'Mark as Paid'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Section 4: Previous Payment History */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {`Payment History for ${selectedPropertyPaymentDetail.tenant.fullName}`}
              </h4>

              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Month</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedPropertyPaymentDetail.tenant.payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400">
                          {'No previous payment records.'}
                        </td>
                      </tr>
                    ) : (
                      selectedPropertyPaymentDetail.tenant.payments.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-900">{p.month}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{p.paidDate}</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">${p.amount}</td>
                          <td className="py-2 px-3">{p.method}</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold">✓ Paid</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  loginAsTenant(selectedPropertyPaymentDetail.tenant.uniqueLoginId);
                  setSelectedPropertyPaymentDetail(null);
                  setCurrentView('tenant_portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{'Test Login as Tenant'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPropertyPaymentDetail(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Zoom Modal */}
      {previewPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewPhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 text-white">
              <span className="text-xs font-bold text-slate-300">Attached Issue Photo</span>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewPhotoModal}
              alt="Issue Full View"
              className="w-full max-h-[75vh] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}

      {/* Create Report Modal Triggered from Admin */}
      {showCreateReportModal && (
        <TenantReportModal
          isOpen={showCreateReportModal}
          onClose={() => setShowCreateReportModal(false)}
        />
      )}

    </div>
  );
};
