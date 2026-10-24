import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize2,
  Armchair,
  Car,
  ShieldCheck,
  Wifi,
  MapPin,
  ExternalLink,
  Check,
  Send,
  User,
  Phone,
  Mail,
  Palette,
  Play,
  HelpCircle,
  Clock,
  Sparkles,
  Share2,
  Utensils,
  Tag
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onOpenContact: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenContact
}) => {
  const { t, addBookingRequest } = useApp();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addBookingRequest({
        propertyId: property.id,
        propertyTitle: property.title,
        fullName,
        phoneNumber,
        email,
        message: message || 'Interested in booking this property.'
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Top Bar with Back Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.propertyDetail.backBtn}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-stone-100 text-stone-700">
              Unit {property.unitNo}
            </span>
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Share property"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={property.photos[activePhotoIdx] || property.photos[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.videoUrl && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md transition-all shadow-lg cursor-pointer"
                >
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{t.propertyDetail.videoTour}</span>
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {property.photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {property.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx ? 'border-blue-600 shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Specs, Description, Color details & Features */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* About Heading & Description */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {t.propertyDetail.aboutHeading}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Interior Wall & Palette Details */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>{t.propertyDetail.colorHeading}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-slate-500 font-semibold block">{t.propertyDetail.wallColorLabel}</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5 block">{property.colorDetails.walls}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-slate-500 font-semibold block">{t.propertyDetail.livingRoomColorLabel}</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5 block">{property.colorDetails.livingRoom}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-slate-500 font-semibold block">{t.propertyDetail.accentColorLabel}</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5 block">{property.colorDetails.accentColor}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-slate-500 font-semibold block">{t.propertyDetail.flooringColorLabel}</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5 block">{property.colorDetails.flooring}</span>
                  </div>
                </div>
              </div>

              {/* Key Features Checklist */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {t.propertyDetail.featuresHeading}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Mini Map */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {t.propertyDetail.locationHeading}
                </h3>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-44 h-28 rounded-xl bg-blue-50 border border-blue-200 relative overflow-hidden flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {property.address}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Close to shopping malls, restaurants, schools, and public transport. Great location for comfortable city living.
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>{t.propertyDetail.viewMaps}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Booking Form */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Price & Title Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {property.currency}{property.rentAmount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-sm font-medium"> /month</span>
                  </div>
                  <div>
                    {property.status === 'available' ? (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200">
                        {t.propertyDetail.available}
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
                        {t.propertyDetail.rented}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{property.address}</span>
                  </div>
                </div>

                {/* 4 Metric Cards: Bedrooms, Bathrooms, Kitchen, Sq. Ft. */}
                <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <Bed className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">{property.bedrooms}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Bedrooms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <Bath className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">{property.bathrooms}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Bathrooms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <Utensils className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">{property.kitchens ?? 1}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Kitchen</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <Maximize2 className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">{property.areaSqFt}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Sq. Ft.</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-2">
                  {property.furnished && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-xs font-semibold">
                      <Armchair className="w-3.5 h-3.5 text-blue-600" />
                      <span>Furnished</span>
                    </div>
                  )}
                  {property.parking && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-xs font-semibold">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      <span>Parking</span>
                    </div>
                  )}
                  {property.security && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Security</span>
                    </div>
                  )}
                  {property.wifi && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-800 text-xs font-semibold">
                      <Wifi className="w-3.5 h-3.5 text-blue-600" />
                      <span>Wi-Fi</span>
                    </div>
                  )}
                  {property.amenities?.filter(a => !['Furnished', 'Parking', 'Security', 'Wi-Fi'].includes(a)).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-xs font-semibold">
                      <Tag className="w-3 h-3 text-indigo-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book This Property Form */}
              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 shadow-sm space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {t.propertyDetail.bookTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t.propertyDetail.bookSubtitle}
                    </p>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Booking Request Sent!
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {t.propertyDetail.bookingSuccess}
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-3 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t.propertyDetail.fullName} *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm font-medium"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t.propertyDetail.phone} *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 012-3456"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm font-medium"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t.propertyDetail.email} *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm font-medium"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Preferred date or message */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {t.propertyDetail.message}
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Preferred move-in date or questions..."
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm font-medium"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t.propertyDetail.submitBooking}</span>
                        </>
                      )}
                    </button>

                    {/* Guarantee Pills */}
                    <div className="grid grid-cols-3 gap-1 pt-3 text-[11px] text-slate-600 font-medium text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-blue-600">✓</span>
                        <span>{t.propertyDetail.guaranteeNoHidden}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-blue-600">🛡️</span>
                        <span>{t.propertyDetail.guaranteeSecure}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-blue-600">⏰</span>
                        <span>{t.propertyDetail.guarantee247}</span>
                      </div>
                    </div>

                  </form>
                )}
              </div>

              {/* Bottom Support Callout */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Have any questions?
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Our support team is here to help you.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Contact Support
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Video Modal if Opened */}
      {showVideoModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-700">
            <div className="p-3 bg-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold">Property Video Tour</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-16/9 bg-black flex items-center justify-center">
              <iframe
                src={property.videoUrl}
                title="Property Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
