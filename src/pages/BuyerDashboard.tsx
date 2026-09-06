import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { Search, Filter, ShieldCheck, MapPin, CheckCircle2, ArrowRight, UserCheck, ExternalLink } from 'lucide-react';
import { INDIAN_STATES_AND_CITIES } from '../data/statesAndCities';

interface BuyerDashboardProps {
  onNavigate: (page: string) => void;
  onSelectProperty: (propertyId: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate, onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.properties) {
          setProperties(data.properties);
        }
      });
  }, []);

  const filtered = properties.filter((p) => {
    if (stateFilter && p.state !== stateFilter) return false;
    if (cityFilter && p.city !== cityFilter) return false;
    if (typeFilter && p.propertyType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    }
    return true;
  });

  if (sortOption === 'priceAsc') {
    filtered.sort((a, b) => a.listedPrice - b.listedPrice);
  } else if (sortOption === 'priceDesc') {
    filtered.sort((a, b) => b.listedPrice - a.listedPrice);
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            VERIFIED BUYER MARKETPLACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
            Discover Verified Land & Properties
          </h1>
          <p className="text-xs text-slate-500">
            Browse registered property records with cryptographic document fingerprints and blockchain ownership evidence.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Property ID, city, title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gov-800"
            />
          </div>

          {/* State Filter */}
          <div className="sm:col-span-3">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCityFilter('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="">All Indian States</option>
              {INDIAN_STATES_AND_CITIES.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="">All Classifications</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="sm:col-span-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-gov-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  {prop.id}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  SHA-256 VERIFIED
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 line-clamp-1">{prop.title}</h3>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{prop.city}, {prop.state}</span>
                </div>
                <div>Area: <span className="font-semibold text-slate-800">{prop.area} {prop.areaUnit}</span></div>
                <div>Current Owner: <span className="font-bold text-gov-900">{prop.currentOwner}</span></div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Listed Price</span>
                <span className="text-base font-extrabold text-emerald-700">₹{prop.listedPrice.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => {
                  onSelectProperty(prop.id);
                  onNavigate(`/property/${prop.id}`);
                }}
                className="bg-gov-900 text-white hover:bg-gov-800 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                Inspect & Make Offer
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
