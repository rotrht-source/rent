import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReportCategory, ReportPriority } from '../types';
import {
  AlertTriangle,
  Wrench,
  X,
  Upload,
  CheckCircle2,
  Camera,
  Building,
  User,
  Phone,
  Mail,
  Home,
  ShieldAlert,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

interface TenantReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPropertyId?: string;
}

const CATEGORIES: { value: ReportCategory; label: string; icon: string }[] = [
  { value: 'Plumbing', label: 'Plumbing (Leaks, Drains, Taps)', icon: '💧' },
  { value: 'Electrical', label: 'Electrical & AC (Power, Lighting)', icon: '⚡' },
  { value: 'Appliance', label: 'Appliance (Fridge, Stove, Washer)', icon: '🔌' },
  { value: 'Structural & Locks', label: 'Doors, Windows & Locks', icon: '🔑' },
  { value: 'Water & Heating', label: 'Water Heater & Geyser', icon: '🔥' },
  { value: 'Noise & Disturbance', label: 'Noise / Disturbance', icon: '🔊' },
  { value: 'Pest Control', label: 'Pest Control / Extermination', icon: '🐜' },
  { value: 'Security', label: 'Security & Gates', icon: '🛡️' },
  { value: 'Other', label: 'Other Maintenance Issue', icon: '🛠️' }
];

const PRESET_SAMPLE_PHOTOS = [
  {
    name: 'Plumbing Leak',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Electrical / AC',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Door & Lock',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Wall / Fixture',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  }
];

export const TenantReportModal: React.FC<TenantReportModalProps> = ({
  isOpen,
  onClose,
  preselectedPropertyId
}) => {
  const {
    properties,
    currentTenant,
    addTenantReport,
    showToast
  } = useApp();

  // Find tenant assigned property if available
  const tenantProp = properties.find(
    p => p.id === currentTenant?.propertyId || (currentTenant && p.assignedTenantId === currentTenant.uniqueLoginId)
  );

  const initialProp = properties.find(p => p.id === preselectedPropertyId) || tenantProp || properties[0];

  const [propertyId, setPropertyId] = useState(initialProp?.id || '');
  const [propertyName, setPropertyName] = useState(initialProp?.title || '');
  const [unitNo, setUnitNo] = useState(initialProp?.unitNo || 'Apt 402');
  const [tenantName, setTenantName] = useState(currentTenant?.fullName || '');
  const [tenantPhone, setTenantPhone] = useState(currentTenant?.phoneNumber || '');
  const [tenantEmail, setTenantEmail] = useState(currentTenant?.email || '');
  const [tenantId, setTenantId] = useState(currentTenant?.uniqueLoginId || '');

  const [category, setCategory] = useState<ReportCategory>('Plumbing');
  const [priority, setPriority] = useState<ReportPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if currentTenant or preselectedPropertyId changes
  useEffect(() => {
    if (currentTenant) {
      setTenantName(currentTenant.fullName);
      setTenantPhone(currentTenant.phoneNumber);
      setTenantEmail(currentTenant.email);
      setTenantId(currentTenant.uniqueLoginId);
    }
    if (initialProp) {
      setPropertyId(initialProp.id);
      setPropertyName(initialProp.title);
      setUnitNo(initialProp.unitNo || 'Unit 1A');
    }
  }, [currentTenant, preselectedPropertyId]);

  if (!isOpen) return null;

  const handlePropertySelect = (pId: string) => {
    setPropertyId(pId);
    const matched = properties.find(p => p.id === pId);
    if (matched) {
      setPropertyName(matched.title);
      setUnitNo(matched.unitNo || '');
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image size should be below 8MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPhotoUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!tenantPhone.trim()) {
      alert('Please enter your contact phone number.');
      return;
    }
    if (!unitNo.trim()) {
      alert('Please enter your flat or unit number.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Please provide an issue title and description.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addTenantReport({
        propertyId: propertyId || undefined,
        propertyName: propertyName || 'Rental Flat Property',
        unitNo: unitNo.trim(),
        tenantId: tenantId.trim() || (currentTenant ? currentTenant.uniqueLoginId : undefined),
        tenantName: tenantName.trim(),
        tenantPhone: tenantPhone.trim(),
        tenantEmail: tenantEmail.trim() || undefined,
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
        photoUrl: photoUrl.trim() || undefined
      });

      setIsSubmitting(false);
      setSubmittedTicketId(created.id);
    }, 450);
  };

  const handleResetAndClose = () => {
    setSubmittedTicketId(null);
    setTitle('');
    setDescription('');
    setPhotoUrl('');
    setCategory('Plumbing');
    setPriority('medium');
    onClose();
  };

  const handleCopyTicket = () => {
    if (submittedTicketId) {
      navigator.clipboard?.writeText(submittedTicketId);
      setCopiedTicket(true);
      showToast(`Ticket #${submittedTicketId} copied to clipboard!`);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Tenant Issue & Flat Report</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white tracking-wider uppercase">
                  Direct to Admin
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Any tenant can submit a maintenance or flat issue directly to the landlord admin.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Success Screen or Form */}
        {submittedTicketId ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900">
                Report Submitted Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your issue report has been logged and forwarded directly to the <span className="font-bold text-slate-900">Landlord Admin Dashboard</span> under the Tenant Reports section.
              </p>
            </div>

            {/* Ticket Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Reference Ticket ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl sm:text-2xl font-mono font-black text-blue-600">
                  {submittedTicketId}
                </span>
                <button
                  onClick={handleCopyTicket}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedTicket ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Property: <span className="font-semibold text-slate-800">{propertyName}</span> ({unitNo})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setSubmittedTicketId(null);
                  setTitle('');
                  setDescription('');
                  setPhotoUrl('');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer transition-colors border border-blue-200"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            
            {/* Logged in Tenant Indicator banner if applicable */}
            {currentTenant && (
              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-slate-600">
                    Logged in as: <strong className="text-slate-900">{currentTenant.fullName}</strong> ({currentTenant.uniqueLoginId})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Auto-filled
                </span>
              </div>
            )}

            {/* Flat & Property Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Property Name / Building *
                </label>
                <select
                  value={propertyId}
                  onChange={e => handlePropertySelect(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.unitNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Flat / Unit Number *
                </label>
                <input
                  type="text"
                  value={unitNo}
                  onChange={e => setUnitNo(e.target.value)}
                  placeholder="e.g. Apt 402, House 14, Unit 3B"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Tenant Identity Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tenant Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tenantName}
                    onChange={e => setTenantName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={tenantPhone}
                    onChange={e => setTenantPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tenant ID (Optional)
                </label>
                <input
                  type="text"
                  value={tenantId}
                  onChange={e => setTenantId(e.target.value)}
                  placeholder="e.g. TNT-2026-01"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ReportCategory)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Urgency / Priority Level *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'medium', 'high', 'urgent'] as ReportPriority[]).map(lvl => {
                    const isSelected = priority === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border text-center ${
                          isSelected
                            ? lvl === 'urgent'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : lvl === 'high'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : lvl === 'medium'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {lvl === 'urgent' ? '🚨 Urgent' : lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Report Summary / Issue Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Water leaking under kitchen sink, AC not cooling, broken lock"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Describe the exact location, when it started, and any damage caused. Include your preferred time for maintenance staff to visit."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Photo Attachment (Upload or Preset) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Attach Issue Photo (Optional)
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                      e.target.value = '';
                    }}
                  />
                </label>

                <div className="relative flex-1">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    placeholder="Or enter image URL (https://...)"
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none focus:border-blue-600"
                  />
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute right-2 top-2 text-[10px] font-bold text-rose-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Photo Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <span className="font-semibold">Sample Photo Presets:</span>
                {PRESET_SAMPLE_PHOTOS.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setPhotoUrl(p.url)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Preview if image selected */}
              {photoUrl && (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs mt-2">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold">
                    Attached
                  </span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report to Admin'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
