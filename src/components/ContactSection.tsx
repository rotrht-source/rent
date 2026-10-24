import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Sparkles
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t, addContactMessage, siteSettings } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const quickSubjects = [
    'Schedule Property Tour',
    'Tenant Lease Inquiry',
    'List New Property',
    'Rent & Payment Terms'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addContactMessage({
      name,
      email,
      phone: phone || 'N/A',
      subject: subject || 'General Rental Inquiry',
      message
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Concierge & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {siteSettings.contactTitle || t.contact.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            {siteSettings.contactSubtitle || t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Office Address & Info Cards (Left) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-7 rounded-2xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
              
              {/* Header with Live Status Beacon */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white">
                      {siteSettings.officeName || 'RentFlow Real Estate HQ'}
                    </h3>
                    <p className="text-xs text-slate-400">Property Management Division</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open Today</span>
                </div>
              </div>

              {/* Contact Specifics */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs uppercase tracking-wider">Corporate Office:</span>
                    <span className="text-slate-300 leading-relaxed block mt-0.5">
                      {siteSettings.contactAddress || t.contact.officeAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs uppercase tracking-wider">Direct Hotline:</span>
                    <span className="font-mono text-slate-200 block mt-0.5 font-medium">
                      {siteSettings.contactPhone || t.contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs uppercase tracking-wider">Inquiry Email:</span>
                    <span className="text-slate-200 block mt-0.5">
                      {siteSettings.contactEmail || t.contact.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs uppercase tracking-wider">Office Hours:</span>
                    <span className="text-slate-300 block mt-0.5">
                      {siteSettings.workingHours || t.contact.hours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assurance Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct concierge line: inquiries are assigned directly to verified portfolio managers.
              </p>
            </div>

          </div>

          {/* Contact Message Form (Right) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {t.contact.success}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Quick Topic Chips */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Inquiry Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickSubjects.map(topic => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setSubject(topic)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          subject === topic
                            ? 'bg-blue-600 border-blue-600 text-white font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.contact.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.contact.emailLabel} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.contact.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.contact.subjectLabel}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Schedule Flat Tour"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {t.contact.msgLabel} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write your questions or requested rental terms here..."
                    className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendBtn}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
