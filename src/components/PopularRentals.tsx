import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  Bed,
  Bath,
  MapPin,
  ArrowRight,
  Heart,
  Home,
  Building,
  Building2,
  ChevronRight,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Car
} from 'lucide-react';

interface PopularRentalsProps {
  onSelectProperty: (property: Property) => void;
  onViewAllClick: () => void;
  onCategoryClick?: (category: string) => void;
  onListPropertyClick?: () => void;
}

export const PopularRentals: React.FC<PopularRentalsProps> = ({
  onSelectProperty,
  onViewAllClick,
  onCategoryClick,
  onListPropertyClick
}) => {
  const { properties } = useApp();
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleCategorySelect = (cat: string) => {
    if (onCategoryClick) {
      onCategoryClick(cat);
    } else {
      onViewAllClick();
    }
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Top 3 properties for featured spotlight
  const featuredProperties = properties.slice(0, 3);

  return (
    <section id="featured-properties-section" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. Category Quick-Filter Row */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Browse By Property Type
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Select a category to filter listings</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* 1. Apartments */}
            <button
              onClick={() => handleCategorySelect('Apartment')}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group text-left shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <Home className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 block transition-colors truncate">
                  Apartments
                </span>
                <span className="text-xs text-slate-400 block truncate">Modern flats & lofts</span>
              </div>
            </button>

            {/* 2. Houses */}
            <button
              onClick={() => handleCategorySelect('House')}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group text-left shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 block transition-colors truncate">
                  Houses & Villas
                </span>
                <span className="text-xs text-slate-400 block truncate">Spacious family homes</span>
              </div>
            </button>

            {/* 3. Commercial */}
            <button
              onClick={() => handleCategorySelect('Office')}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group text-left shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <Building className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 block transition-colors truncate">
                  Commercial
                </span>
                <span className="text-xs text-slate-400 block truncate">Offices & workspaces</span>
              </div>
            </button>

            {/* 4. Parking & Garages */}
            <button
              onClick={() => handleCategorySelect('Parking/Garage')}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group text-left shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <Car className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 block transition-colors truncate">
                  Parking / Garage
                </span>
                <span className="text-xs text-slate-400 block truncate">Secure spots & storage</span>
              </div>
            </button>

          </div>
        </div>

        {/* 2. Section Header: Featured Properties */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-t border-slate-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Handpicked rental homes verified for comfort, prime locations, and transparent landlord terms.
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 transition-all cursor-pointer shadow-2xs group self-start sm:self-auto"
          >
            <span>View All Properties</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3. The 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map(property => {
            const isFav = favorites.includes(property.id);

            return (
              <div
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with badges */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={property.photos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* For Rent Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-white bg-blue-600 shadow-md">
                      For Rent
                    </div>

                    {/* Saved Heart Button */}
                    <button
                      onClick={e => toggleFavorite(e, property.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-md transition-all active:scale-90"
                      aria-label="Save residence"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Category Overlay Tag */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 bg-white/95 backdrop-blur-xs shadow-xs">
                      {property.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {property.currency}{property.rentAmount.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          / month
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Available
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    {/* Specifications Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectProperty(property);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white shadow-2xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Landlord CTA Banner */}
        <div className="rounded-3xl bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
            <Building2 className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>For Property Owners & Landlords</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Are You a Landlord Looking for Verified Tenants?
            </h3>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              List your properties with RentFlow. Benefit from tenant background verification, automated monthly rent tracking, and digital lease agreements.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (onListPropertyClick) {
                    onListPropertyClick();
                  } else {
                    onViewAllClick();
                  }
                }}
                className="px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
              >
                List Your Property
              </button>

              <button
                onClick={onViewAllClick}
                className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                Browse Active Units
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
