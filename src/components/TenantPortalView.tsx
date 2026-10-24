import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RentPayment, PaymentMethod } from '../types';
import {
  ShieldCheck,
  Zap,
  Headphones,
  Copy,
  Check,
  Calendar,
  Clock,
  Home,
  Bed,
  Bath,
  Maximize2,
  Download,
  CreditCard,
  Building,
  User,
  ArrowRight,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  AlertTriangle,
  Wrench,
  Plus
} from 'lucide-react';
import { TenantReportModal } from './TenantReportModal';

export const TenantPortalView: React.FC = () => {
  const {
    t,
    language,
    currentTenant,
    properties,
    tenantReports,
    siteSettings,
    makeRentPayment,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<RentPayment | null>(null);

  // Payment form state
  const [payMonth, setPayMonth] = useState('October 2026');
  const [payAmount, setPayAmount] = useState(currentTenant?.monthlyRent || 1800);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Assigned property
  const assignedProperty = properties.find(
    p => p.id === currentTenant?.propertyId || p.assignedTenantId === currentTenant?.uniqueLoginId
  ) || properties[0];

  // Dynamic Countdown calculation
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 4, minutes: 30, seconds: 15 });

  useEffect(() => {
    if (!currentTenant?.nextDueDate) return;

    const calculateTime = () => {
      const target = new Date(currentTenant.nextDueDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [currentTenant?.nextDueDate]);

  const handleCopyId = () => {
    if (currentTenant?.uniqueLoginId) {
      navigator.clipboard?.writeText(currentTenant.uniqueLoginId);
      setCopied(true);
      showToast('Tenant ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsProcessing(true);
    setTimeout(() => {
      makeRentPayment(currentTenant.uniqueLoginId, payMonth, Number(payAmount), payMethod);
      setIsProcessing(false);
      setShowPaymentModal(false);
    }, 700);
  };

  if (!currentTenant) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h3 className="text-xl font-bold text-slate-800">
          No Tenant Logged In
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          Please log in with your Unique Tenant ID (e.g. TNT-2026-01).
        </p>
      </div>
    );
  }

  const isRentPaid = currentTenant.dueAmount === 0;

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Banner Matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Welcome Banner Box (Left) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            {/* Background Graphic */}
            <div className="absolute inset-0 z-0 opacity-25">
              <img
                src={assignedProperty.photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {t.tenant.portalTitle}
                </span>

                {/* Tenant ID Badge with Copy */}
                <div
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold cursor-pointer transition-all backdrop-blur-xs"
                  title="Click to copy ID"
                >
                  <span className="text-blue-300">ID:</span>
                  <span className="tracking-wider">{currentTenant.uniqueLoginId}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={currentTenant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentTenant.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-400 shadow-md ring-2 ring-blue-500/20 shrink-0"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.tenant.welcome}{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                      {currentTenant.fullName}
                    </span>
                  </h1>
                  <span className="text-xs text-slate-300 font-medium block mt-0.5">
                    {currentTenant.email} • {currentTenant.phoneNumber}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {t.tenant.subtitle}
              </p>
            </div>

            {/* Badges in Banner */}
            <div className="relative z-10 flex flex-wrap gap-4 pt-6 mt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure & Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Easy Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-blue-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Payment Status Card (Right) - Matching Screenshot 2 */}
          <div className="lg:col-span-4 rounded-3xl bg-linear-to-b from-blue-950 to-slate-900 text-white p-6 sm:p-7 flex flex-col justify-between shadow-lg border border-blue-900/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.tenant.paymentStatus}</h3>
                    <p className="text-xs text-slate-400">
                      {isRentPaid ? t.tenant.upToDate : t.tenant.overdueNotice}
                    </p>
                  </div>
                </div>

                {isRentPaid ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" />
                    <span>Paid</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Due</span>
                  </span>
                )}
              </div>

              {/* Next Rent Due Countdown Box */}
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{t.tenant.nextRentDue}</span>
                  </div>
                  <span className="font-mono text-cyan-300">{currentTenant.nextDueDate}</span>
                </div>

                {/* Dynamic Digits Countdown */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-2xl font-black font-mono text-white block">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {t.tenant.days}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-2xl font-black font-mono text-white block">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {t.tenant.hours}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-2xl font-black font-mono text-white block">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {t.tenant.minutes}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Monthly Rent:</span>
              <span className="text-base font-bold text-white font-mono">
                ${currentTenant.monthlyRent.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Lower Grid: My Assigned Property + Payment History & Pay Button (Matching Screenshot 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: My Assigned Property (Matching Screenshot 2) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.tenant.myProperty}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100">
                {t.tenant.activeTenancy}
              </span>
            </div>

            {/* Photo & Specs Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-slate-100">
              <img
                src={assignedProperty.photos[0]}
                alt={assignedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-bold text-lg">{assignedProperty.title}</h3>
                <p className="text-xs text-slate-300">{assignedProperty.location}</p>
              </div>
            </div>

            {/* Unit Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">{t.tenant.address}</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block truncate">
                  {assignedProperty.address}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">
                  {t.tenant.unitNo} & {t.tenant.floor}
                </span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  {assignedProperty.unitNo} (Floor {assignedProperty.floor})
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">{t.tenant.monthlyRent}</span>
                <span className="text-xs font-bold text-blue-600 mt-1 block">
                  ${currentTenant.monthlyRent}/month
                </span>
              </div>
            </div>

            {/* Key Specs Card */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                Key Property Specs & Interior Colors
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white shadow-2xs font-semibold text-slate-700 flex items-center justify-center gap-1.5">
                  <Bed className="w-4 h-4 text-blue-600" />
                  <span>{assignedProperty.bedrooms} Beds</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-2xs font-semibold text-slate-700 flex items-center justify-center gap-1.5">
                  <Bath className="w-4 h-4 text-blue-600" />
                  <span>{assignedProperty.bathrooms} Baths</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-2xs font-semibold text-slate-700 flex items-center justify-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-blue-600" />
                  <span>{assignedProperty.areaSqFt} Sq.Ft.</span>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-blue-100/60">
                <span className="font-bold text-slate-800">Interior Walls: </span>
                <span>{assignedProperty.colorDetails.walls}</span>
              </div>
            </div>

            {/* Additional Description / Lease Notes */}
            {currentTenant.notes && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <span>📝 Lease Terms & Additional Notes:</span>
                </span>
                <p className="text-amber-800 leading-relaxed whitespace-pre-wrap text-[11px]">{currentTenant.notes}</p>
              </div>
            )}

            {/* Quote Pill */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic flex items-center justify-between">
              <span>“A great place to call home, with great people around.”</span>
              <span className="font-bold text-blue-600 not-italic text-[11px]">RentFlow Tenant</span>
            </div>
          </div>

          {/* Right Column: Payment History & Pay Rent Button (Matching Screenshot 2) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.tenant.paymentHistory}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {currentTenant.payments.length} records
              </span>
            </div>

            {/* Payment History Table (Matching Screenshot 2) */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">{t.tenant.tableDate}</th>
                    <th className="py-3 px-3">{t.tenant.tableMonth}</th>
                    <th className="py-3 px-3">{t.tenant.tableAmount}</th>
                    <th className="py-3 px-3">{t.tenant.tableMethod}</th>
                    <th className="py-3 px-3">{t.tenant.tableStatus}</th>
                    <th className="py-3 px-3 text-center">{t.tenant.tableReceipt}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentTenant.payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No payment records found
                      </td>
                    </tr>
                  ) : (
                    currentTenant.payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                          {payment.paidDate}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {payment.month}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                            {payment.method}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Paid</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setViewingReceipt(payment)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-[11px] font-bold transition-colors cursor-pointer"
                            title="View PDF Receipt"
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Stripe Direct Online Payment Card (Visible ONLY when enabled by Landlord) */}
            {siteSettings.stripeEnabled && siteSettings.stripePaymentUrl && (
              <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl border border-indigo-500/30 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-base border border-indigo-500/30">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white">Stripe Online Payment</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-200">
                        {siteSettings.stripeAccountName || 'Landlord Stripe Account'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 font-mono bg-white/10 px-2 py-1 rounded-lg">
                    <span>VISA</span> • <span>MC</span> • <span>AMEX</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Pay your rent directly to your landlord’s verified Stripe checkout account via Credit/Debit card.
                </p>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <a
                    href={siteSettings.stripePaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/30 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>💳 Pay Online via Stripe</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('Stripe');
                      setShowPaymentModal(true);
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Record Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pay Rent Now Prominent Button (Matching Screenshot 2) */}
            <div className="pt-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-xl shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>{t.tenant.payRentNow}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                <span>🔒</span>
                <span>Secure payment powered by RentFlow Online Portal</span>
              </p>
            </div>

            {/* Flat Issue & Maintenance Reporting Card */}
            <div className="p-5 rounded-2xl bg-linear-to-r from-rose-950 via-slate-900 to-slate-900 text-white border border-rose-800/40 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Flat Issue & Repair Reporting</h4>
                    <p className="text-[11px] text-slate-300">
                      Have a plumbing, electrical, lock, or damage problem?
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Submit an instant report directly to the landlord admin dashboard. You will receive real-time status updates and repair schedules.
              </p>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Wrench className="w-4 h-4" />
                <span>Report Flat Issue / Maintenance</span>
              </button>
            </div>

            {/* Need Help Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    Need Help?
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Contact your landlord or support team anytime.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Landlord Hotline: +1 (800) 555-0199')}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Contact Support
              </button>
            </div>

          </div>

        </div>

        {/* My Flat Maintenance Tickets & Reports History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  My Flat Reports & Maintenance History
                </h3>
                <p className="text-xs text-slate-500">
                  Track progress, admin resolution notes, and maintenance visits for your flat.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Report New Issue</span>
            </button>
          </div>

          {/* List of reports for current tenant */}
          {(() => {
            const myReports = tenantReports.filter(
              r =>
                (currentTenant && r.tenantId === currentTenant.uniqueLoginId) ||
                (currentTenant && r.tenantName.toLowerCase() === currentTenant.fullName.toLowerCase()) ||
                (currentTenant && r.tenantPhone === currentTenant.phoneNumber)
            );

            if (myReports.length === 0) {
              return (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 space-y-2">
                  <Wrench className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">
                    No active maintenance issues reported for your flat.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    If you encounter any plumbing, electrical, or structural issue, click "Report New Issue" above.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {myReports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-2.5 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-600">
                          #{rep.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {rep.category}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        rep.status === 'pending'
                          ? 'bg-rose-100 text-rose-800'
                          : rep.status === 'in_review'
                          ? 'bg-amber-100 text-amber-800'
                          : rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        ● {rep.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900">{rep.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{rep.description}</p>

                    {rep.adminNote && (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                        <span className="font-bold text-blue-700 block text-[10px] uppercase">Landlord Admin Note:</span>
                        <span>{rep.adminNote}</span>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span>Submitted: {new Date(rep.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold uppercase text-slate-500">{rep.priority} priority</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

      </div>

      {/* Pay Rent Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {t.tenant.paymentModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Tenant: {currentTenant.fullName} ({currentTenant.uniqueLoginId})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.tenant.selectMonth}
                </label>
                <select
                  value={payMonth}
                  onChange={e => setPayMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:border-blue-600"
                >
                  <option value="November 2026">November 2026 (Upcoming)</option>
                  <option value="October 2026">October 2026 (Current)</option>
                  <option value="December 2026">December 2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rent Amount ($)
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold font-mono outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {t.tenant.selectMethod}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {((siteSettings.stripeEnabled
                    ? ['Stripe', 'Credit Card', 'Bank Transfer']
                    : ['Credit Card', 'Bank Transfer']
                  ) as PaymentMethod[]).map(method => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPayMethod(method)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        payMethod === method
                          ? method === 'Stripe'
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-extrabold shadow-2xs'
                            : 'border-blue-600 bg-blue-50/60 text-blue-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {method === 'Stripe' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                        <span>{method}</span>
                      </span>
                      {payMethod === method && <Check className={`w-3.5 h-3.5 ${method === 'Stripe' ? 'text-indigo-600' : 'text-blue-600'}`} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold block text-slate-800">
                  Official Gateway Information:
                </span>
                
                {payMethod === 'Stripe' && (
                  <div className="space-y-2 text-indigo-950 bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-indigo-900">
                        {siteSettings.stripeAccountName || 'Landlord Stripe Account'}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-indigo-200/60 text-indigo-800 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-800 leading-tight">
                      Pay directly to landlord's Stripe account using Visa, MasterCard, or AMEX:
                    </p>
                    {siteSettings.stripePaymentUrl && (
                      <a
                        href={siteSettings.stripePaymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
                      >
                        <span>Proceed to Stripe Checkout</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <span className="block text-[10px] text-indigo-600 italic">
                      * After completing payment, click the confirm button below to generate your official receipt.
                    </span>
                  </div>
                )}

                {payMethod === 'Credit Card' && (
                  <span className="block text-slate-700 font-mono">Direct Card Gateway (Visa / MasterCard / American Express SSL)</span>
                )}
                {payMethod === 'Bank Transfer' && (
                  <span className="block text-slate-700 font-mono">Chase / Wells Fargo Wire: A/C 9918237461 (RentFlow Escrow)</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.tenant.confirmPay} (${payAmount})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900">RentFlow Payment Receipt</h4>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                PAID IN FULL
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                ${viewingReceipt.amount.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500">Rent for {viewingReceipt.month}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-800">{viewingReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-slate-800">{viewingReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span className="text-slate-800 font-semibold">{viewingReceipt.paidDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-slate-800 font-semibold">{viewingReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tenant ID:</span>
                <span className="font-mono text-blue-600 font-bold">{currentTenant.uniqueLoginId}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Receipt downloaded as PDF.');
                setViewingReceipt(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Copy</span>
            </button>
          </div>
        </div>
      )}

      {/* Tenant Report Modal */}
      {showReportModal && (
        <TenantReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
};
