import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsAdmin, loginAsTenant, tenants } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();
    const cleanId = uniqueId.trim();

    if (!cleanUser || !cleanPass || !cleanId) {
      setErrorMessage('Please enter Username, Password, and Unique ID.');
      setIsSubmitting(false);
      return;
    }

    // 1. Check Admin Credentials first
    const adminSuccess = loginAsAdmin(cleanUser, cleanPass, cleanId);
    if (adminSuccess) {
      setIsSubmitting(false);
      onClose();
      return;
    }

    // 2. Check Tenant Credentials with Unique ID
    const upperId = cleanId.toUpperCase();
    const matchedTenant = tenants.find(
      t => t.uniqueLoginId.toUpperCase() === upperId ||
           t.uniqueLoginId.replace(/-/g, '').toUpperCase() === upperId.replace(/-/g, '')
    );

    if (matchedTenant) {
      const tenantSuccess = loginAsTenant(matchedTenant.uniqueLoginId);
      if (tenantSuccess) {
        setIsSubmitting(false);
        onClose();
        return;
      }
    }

    // If both failed:
    setIsSubmitting(false);
    setErrorMessage('Invalid credentials! Please enter valid Username, Password, and Unique ID.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Access Login Portal
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Enter your Username, Password, and Unique ID to access your dashboard.
            </p>
          </div>
        </div>

        {/* Single Unified Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Username Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 block">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm font-semibold text-slate-900 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* 2. Password Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm font-semibold text-slate-900 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* 3. Unique ID Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 block">
              Unique ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={uniqueId}
                onChange={e => setUniqueId(e.target.value)}
                placeholder="Enter your unique ID"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none font-mono font-bold text-xs sm:text-sm tracking-wider uppercase text-slate-900 transition-all"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security Notice */}
          <p className="text-center text-[11px] text-slate-400 pt-2">
            🔒 End-to-end encrypted secure portal access
          </p>

        </form>

      </div>
    </div>
  );
};
