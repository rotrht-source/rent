import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  Eye,
  RefreshCw,
  Globe
} from 'lucide-react';

export const StripeSetupPanel: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useApp();

  const [enabled, setEnabled] = useState<boolean>(siteSettings.stripeEnabled);
  const [paymentUrl, setPaymentUrl] = useState<string>(siteSettings.stripePaymentUrl || '');
  const [accountName, setAccountName] = useState<string>(siteSettings.stripeAccountName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    updateSiteSettings({
      stripeEnabled: enabled,
      stripePaymentUrl: paymentUrl.trim(),
      stripeAccountName: accountName.trim()
    });

    setTimeout(() => {
      setIsSaving(false);
      showToast('Stripe payment configuration saved and activated for tenants!', 'success');
    }, 500);
  };

  const handleSetSampleLink = () => {
    setPaymentUrl('https://buy.stripe.com/test_rentflow_landlord_demo');
    setAccountName('RentFlow Official Landlord Account');
    setEnabled(true);
    showToast('Sample Stripe link loaded for demo testing!', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 font-black text-xl">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Stripe Online Rent Payment Setup
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Instant Card Checkout
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                Allow your tenants to pay rent directly from their Tenant Portal using Visa, MasterCard, American Express, or Apple Pay. Connect your Stripe link in under 3 minutes.
              </p>
            </div>
          </div>

          {/* Master Toggle Status */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Tenant Portal Status
              </span>
              <span className={`text-xs font-black block ${enabled && paymentUrl ? 'text-emerald-600' : 'text-slate-500'}`}>
                {enabled && paymentUrl ? '✓ Active & Visible' : '✕ Disabled (Off)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !enabled;
                setEnabled(nextState);
                updateSiteSettings({ stripeEnabled: nextState });
                showToast(nextState ? 'Stripe payment enabled!' : 'Stripe payment disabled.', 'info');
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title={enabled ? 'Click to disable' : 'Click to enable'}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md block transform transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Landlord Setup Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Step 1 Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">
              STEP 1 • SIGN UP
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              Create Free Stripe Account
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you don't already have one, create a free Stripe account to receive rental payments directly into your bank.
            </p>
          </div>
          <a
            href="https://dashboard.stripe.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Open Stripe Registration</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step 2 Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">
              STEP 2 • GET LINK
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              Create a Payment Link
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inside Stripe Dashboard, go to <strong>Payment Links</strong>, click <strong>+ New</strong>, set your rent product, and copy the link.
            </p>
          </div>
          <a
            href="https://dashboard.stripe.com/payment-links"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm shadow-indigo-600/20"
          >
            <span>Open Stripe Payment Links</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step 3 Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">
              STEP 3 • PASTE & SAVE
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              Paste Link in Box Below
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste your link into the configuration form below and click <strong>Save & Activate</strong>. Your tenants can pay instantly!
            </p>
          </div>
          <button
            type="button"
            onClick={handleSetSampleLink}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Load Demo Test Link</span>
          </button>
        </div>

      </div>

      {/* 3. Link Configuration Form & Live Tenant Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-base text-slate-900">
                Stripe Payment Details
              </h4>
            </div>
            {enabled && paymentUrl && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Ready for Tenants
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* 1. Stripe Payment URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Stripe Payment Link URL *</span>
                <span className="text-[10px] font-mono text-indigo-600">e.g. buy.stripe.com/abc123xyz</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={paymentUrl}
                  onChange={e => setPaymentUrl(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:border-indigo-600 outline-none transition-all pr-20"
                />
                {paymentUrl && (
                  <button
                    type="button"
                    onClick={() => setPaymentUrl('')}
                    className="absolute right-2 top-2.5 px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                This is the checkout link generated in your Stripe dashboard.
              </p>
            </div>

            {/* 2. Landlord / Business Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Landlord / Property Business Display Name *
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="e.g. RentFlow Property Management / Sarah Jenkins"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400">
                This name will be displayed to tenants so they know they are paying the right landlord.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Activate for Tenants</span>
                  </>
                )}
              </button>

              {paymentUrl && (
                <button
                  type="button"
                  onClick={() => window.open(paymentUrl, '_blank')}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link in New Tab</span>
                </button>
              )}
            </div>

          </form>

          {/* Security & Guarantees */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">🔒 256-bit SSL Secure</span>
            <span>•</span>
            <span className="flex items-center gap-1">💳 Visa / MasterCard / Apple Pay</span>
            <span>•</span>
            <span className="flex items-center gap-1">⚡ Direct Bank Deposit</span>
          </div>
        </div>

        {/* Right Preview (5 Cols): What Tenant Sees */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Live Tenant Portal Preview
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              enabled && paymentUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {enabled && paymentUrl ? 'Preview: Active' : 'Preview: Disabled'}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            This is the exact payment card your tenants will see on their Tenant Portal:
          </p>

          {enabled && paymentUrl ? (
            <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl border border-indigo-500/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-base border border-indigo-500/30">
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
                      {accountName || 'Landlord Stripe Account'}
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
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/30 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>💳 Pay Online via Stripe</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="px-4 py-3 rounded-xl bg-white/10 text-indigo-100 font-bold text-xs flex items-center justify-center">
                  <span>Record Receipt</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold text-slate-700">Stripe Payment is Inactive</h5>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Enter your payment link and turn ON the toggle above to enable card payments for your tenants.
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">💡 How Tenants Use This:</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When a tenant logs into their portal, they see this Stripe button next to their upcoming rent amount. Clicking it takes them directly to your Stripe checkout page to pay via card.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
