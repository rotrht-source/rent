import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  Bed,
  Bath,
  MapPin,
  Search,
  Maximize2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Filter,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AllPropertiesViewProps {
  onSelectProperty: (property: Property) => void;
  onBackToHome?: () => void;
  initialFilter?: {
    location?: string;
    category?: string;
    maxPrice?: number;
  };
}

export const AllPropertiesView: React.FC<AllPropertiesViewProps> = ({
  onSelectProperty,
  onBackToHome,
  initialFilter
}) => {
  const { properties, setCurrentView, siteSettings } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>(initialFilter?.category || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilter?.location || '');
  const [maxPrice, setMaxPrice] = useState<number>(initialFilter?.maxPrice || 100000);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All Properties', value: 'all' },
    { label: 'Apartments', value: 'Apartment' },
    { label: 'Houses & Villas', value: 'House' },
    { label: 'Commercial', value: 'Office' },
    { label: 'Parking & Garages', value: 'Parking/Garage' }
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Category filter
      if (categoryFilter !== 'all' && prop.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && prop.status !== statusFilter) return false;

      // Price filter
      if (prop.rentAmount > maxPrice) return false;

      // Bedroom filter
      if (bedroomFilter !== 'all') {
        const beds = parseInt(bedroomFilter);
        if (beds === 4 && prop.bedrooms < 4) return false;
        if (beds < 4 && prop.bedrooms !== beds) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesLoc = prop.location.toLowerCase().includes(q) || prop.address.toLowerCase().includes(q);
        const matchesCat = prop.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCat) return false;
      }

      return true;
    });
  }, [properties, categoryFilter, statusFilter, maxPrice, bedroomFilter, searchQuery]);

  return (
    <div id="all-properties" className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header Banner */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-12 sm:py-16 text-white border-b border-slate-800">
        
        {/* Full-bleed Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={siteSettings.allPropertiesBannerImage || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=85"}
            alt="All Rental Properties Banner"
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-900/80 to-slate-950/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Back to Home Button */}
          <div>
            <button
              onClick={() => {
                if (onBackToHome) {
                  onBackToHome();
                } else {
                  setCurrentView('public');
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-blue-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{siteSettings.companyName.toUpperCase()} PROPERTY DIRECTORY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              {siteSettings.allPropertiesBannerHeadline || 'Explore All Rental Properties'}
            </h1>
            <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
              {siteSettings.allPropertiesBannerSubtitle || 'Browse premium apartments, duplex homes, offices, and garages with verified details.'}
            </p>
          </div>

          {/* Quick Badges in Banner */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs text-slate-300 border-t border-slate-800">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-400 font-bold">✓</span> 100% Inspected Listings
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-amber-400 font-bold">⚡</span> Direct Landlord Lease
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-sky-400 font-bold">📍</span> Prime Locations
            </span>
          </div>

        </div>

      </div>

      {/* Main Content Area Below Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Category Pill Tabs */}
        <div id="rental-categories" className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 gap-2 no-scrollbar mb-6">
          {categories.map(cat => {
            const active = categoryFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, location or area..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-blue-600 focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>

            {/* Bedroom Filter */}
            <div>
              <select
                value={bedroomFilter}
                onChange={e => setBedroomFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="all">Bedrooms: Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="available">Available Only</option>
                <option value="rented">Rented</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
                <span>Max Monthly Rent:</span>
                <span className="text-blue-600 font-bold">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="accent-blue-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm font-semibold text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredProperties.length}</strong> Properties
          </span>
          {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || maxPrice < 10000 || bedroomFilter !== 'all') && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
                setStatusFilter('all');
                setMaxPrice(100000);
                setBedroomFilter('all');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No properties match your search
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your filters or search term to discover more homes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                {/* Photo & Badges */}
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={property.photos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {property.status === 'available' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 shadow-xs border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-slate-700 bg-slate-200 shadow-xs border border-slate-300">
                          <XCircle className="w-3 h-3 text-slate-600" />
                          Leased
                        </span>
                      )}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 px-2.5 py-1 rounded-md backdrop-blur-xs shadow-xs">
                      {property.category}
                    </div>

                    {/* Color Snippet Badge */}
                    <div className="absolute bottom-2 left-3 right-3 text-[10px] font-mono font-medium text-white/95 bg-slate-950/75 px-2 py-0.5 rounded backdrop-blur-xs truncate">
                      Finishes: {property.colorDetails.walls}
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {property.currency}{property.rentAmount.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          / month
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Unit {property.unitNo}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Features row */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.areaSqFt} sqft</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
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
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
