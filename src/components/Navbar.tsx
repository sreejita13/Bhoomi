import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, CheckCircle2, MapPin, Layers, Menu, X, Home, Building2, UserCheck, Search } from 'lucide-react';
import { INDIAN_STATES_AND_CITIES } from '../data/statesAndCities';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { session, logout, setCity, setState } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentStateData = INDIAN_STATES_AND_CITIES.find((s) => s.state === session?.state);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Banner for State Government Context */}
      {session && session.role === 'state' && (
        <div className="bg-gov-900 text-white text-[11px] px-3 sm:px-4 py-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gov-700 gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5 font-medium">
            <span className="bg-gov-700 px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px] font-bold">
              STATE ADMIN
            </span>
            <span className="text-slate-200 font-semibold">{session.state || 'Maharashtra'}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-amber-300 font-bold">{session.city || 'Mumbai'} Subportal</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t border-gov-800 sm:border-none">
            {/* State Quick Switcher */}
            <div className="flex items-center gap-1 bg-gov-800 px-2 py-0.5 rounded border border-gov-700 text-slate-200 text-[10px]">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <select
                value={session.state || 'Maharashtra'}
                onChange={(e) => {
                  setState(e.target.value);
                  const firstCity = INDIAN_STATES_AND_CITIES.find((s) => s.state === e.target.value)?.cities[0]?.name;
                  if (firstCity) setCity(firstCity);
                }}
                className="bg-transparent text-white text-[11px] border-none focus:outline-none cursor-pointer py-0.5"
              >
                {INDIAN_STATES_AND_CITIES.map((s) => (
                  <option key={s.state} value={s.state} className="bg-gov-900 text-white">
                    {s.state}
                  </option>
                ))}
              </select>
            </div>

            {/* City Quick Switcher */}
            {currentStateData && (
              <div className="flex items-center gap-1 bg-gov-800 px-2 py-0.5 rounded border border-gov-700 text-slate-200 text-[10px]">
                <Layers className="w-3 h-3 text-emerald-400 shrink-0" />
                <select
                  value={session.city || currentStateData.cities[0].name}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-white text-[11px] border-none focus:outline-none cursor-pointer py-0.5"
                >
                  {currentStateData.cities.map((c) => (
                    <option key={c.name} value={c.name} className="bg-gov-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Banner for Central Government */}
      {session && session.role === 'central' && (
        <div className="bg-slate-900 text-white text-[11px] px-3 sm:px-4 py-1.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px] font-bold">
              NATIONAL OVERSIGHT
            </span>
            <span className="text-slate-200 font-semibold truncate text-[11px] sm:text-xs">
              Government of India — Central Land Registry Portal
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">ADMIN</span>
        </div>
      )}

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
            onClick={() => handleNav(session ? `/${session.role}/dashboard` : '/')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gov-900 flex items-center justify-center text-white shadow font-bold group-hover:bg-gov-800 transition-colors shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-lg text-gov-900 tracking-tight whitespace-nowrap">
                  BHOOMI LEDGER
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-300 shrink-0">
                  DPI DEMO
                </span>
              </div>
              <p className="hidden md:block text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none truncate">
                India Verifiable Digital Land Infrastructure
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium">
            {!session ? (
              <>
                <button
                  onClick={() => handleNav('/')}
                  className={`${currentPage === '/' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'} transition-colors`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNav('/verify')}
                  className={`${currentPage.startsWith('/verify') ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'} transition-colors flex items-center gap-1`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verify Land
                </button>
                <button
                  onClick={() => handleNav('/login')}
                  className={`${currentPage.startsWith('/login') ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'} transition-colors`}
                >
                  How It Works
                </button>
              </>
            ) : (
              <>
                {session.role === 'central' && (
                  <>
                    <button
                      onClick={() => handleNav('/central/dashboard')}
                      className={`${currentPage.includes('/central') ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'}`}
                    >
                      Overview
                    </button>
                    <button onClick={() => handleNav('/verify')} className="text-slate-600 hover:text-gov-800">
                      Verify Record
                    </button>
                  </>
                )}

                {session.role === 'state' && (
                  <>
                    <button
                      onClick={() => handleNav('/state/dashboard')}
                      className={`${currentPage === '/state/dashboard' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('/state/approvals')}
                      className={`${currentPage === '/state/approvals' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'} flex items-center gap-1`}
                    >
                      Approvals Workflow
                    </button>
                    <button onClick={() => handleNav('/verify')} className="text-slate-600 hover:text-gov-800">
                      Verification
                    </button>
                  </>
                )}

                {session.role === 'seller' && (
                  <>
                    <button
                      onClick={() => handleNav('/seller/dashboard')}
                      className={`${currentPage === '/seller/dashboard' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'}`}
                    >
                      My Properties
                    </button>
                    <button
                      onClick={() => handleNav('/seller/properties/new')}
                      className={`${currentPage === '/seller/properties/new' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'}`}
                    >
                      List New Property
                    </button>
                    <button onClick={() => handleNav('/verify')} className="text-slate-600 hover:text-gov-800">
                      Verify Record
                    </button>
                  </>
                )}

                {session.role === 'buyer' && (
                  <>
                    <button
                      onClick={() => handleNav('/buyer/dashboard')}
                      className={`${currentPage === '/buyer/dashboard' ? 'text-gov-900 font-bold border-b-2 border-gov-900 pb-1' : 'text-slate-600 hover:text-gov-800'}`}
                    >
                      Browse Marketplace
                    </button>
                    <button onClick={() => handleNav('/verify')} className="text-slate-600 hover:text-gov-800">
                      Verify Land
                    </button>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right Desktop & Mobile Action Area */}
          <div className="flex items-center gap-2 shrink-0">
            {!session ? (
              <button
                onClick={() => handleNav('/login')}
                className="bg-gov-900 text-white hover:bg-gov-800 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Access Portal</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-gov-900 leading-tight">{session.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{session.role} Portal</div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  className="p-1.5 sm:p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg md:hidden border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {session && (
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs space-y-0.5">
              <div className="font-bold text-gov-900">{session.name}</div>
              <div className="text-[11px] text-slate-600 capitalize">
                Role: <span className="font-semibold text-gov-800">{session.role}</span>
                {session.state && ` • ${session.state}`}
                {session.city && ` (${session.city})`}
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-2 text-xs font-semibold">
            {!session ? (
              <>
                <button
                  onClick={() => handleNav('/')}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentPage === '/' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  Overview
                </button>

                <button
                  onClick={() => handleNav('/verify')}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentPage.startsWith('/verify') ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verify Property ID
                </button>

                <button
                  onClick={() => handleNav('/login')}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${currentPage.startsWith('/login') ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <User className="w-4 h-4 text-amber-600" />
                  Login & Access Portals
                </button>
              </>
            ) : (
              <>
                {session.role === 'central' && (
                  <>
                    <button
                      onClick={() => handleNav('/central/dashboard')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage.includes('/central') ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Central National Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('/verify')}
                      className="w-full text-left p-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Verify Property Record
                    </button>
                  </>
                )}

                {session.role === 'state' && (
                  <>
                    <button
                      onClick={() => handleNav('/state/dashboard')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage === '/state/dashboard' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      State & Metropolitan Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('/state/approvals')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage === '/state/approvals' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Government Approvals Workflow
                    </button>
                    <button
                      onClick={() => handleNav('/verify')}
                      className="w-full text-left p-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Verify Property Record
                    </button>
                  </>
                )}

                {session.role === 'seller' && (
                  <>
                    <button
                      onClick={() => handleNav('/seller/dashboard')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage === '/seller/dashboard' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      My Properties & Offers
                    </button>
                    <button
                      onClick={() => handleNav('/seller/properties/new')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage === '/seller/properties/new' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      List New Property
                    </button>
                    <button
                      onClick={() => handleNav('/verify')}
                      className="w-full text-left p-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Verify Property Record
                    </button>
                  </>
                )}

                {session.role === 'buyer' && (
                  <>
                    <button
                      onClick={() => handleNav('/buyer/dashboard')}
                      className={`w-full text-left p-2 rounded-lg ${currentPage === '/buyer/dashboard' ? 'bg-gov-50 text-gov-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Browse Marketplace
                    </button>
                    <button
                      onClick={() => handleNav('/verify')}
                      className="w-full text-left p-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      Verify Property Record
                    </button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
