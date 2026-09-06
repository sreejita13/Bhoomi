import React, { useState, useEffect } from 'react';
import { Search, Shield, CheckCircle2, ArrowRight, FileCheck, Layers, Building2, Home, UserCheck, AlertTriangle, ChevronRight, Lock, ExternalLink } from 'lucide-react';
import { Property } from '../types';
import { LeafletMap } from '../components/LeafletMap';
import { TamperDemo } from '../components/TamperDemo';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSelectProperty?: (propertyId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectProperty }) => {
  const [verifyId, setVerifyId] = useState('BH-MH-10245');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    property?: Property;
    error?: string;
    documentsCount?: number;
    historyCount?: number;
  } | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.properties) {
          setProperties(data.properties);
        }
      })
      .catch(() => {});
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyId.trim()) return;

    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await fetch(`/api/properties/${verifyId.trim()}`);
      const data = await res.json();

      if (data.success && data.property) {
        setVerifyResult({
          property: data.property,
          documentsCount: data.documents?.length || 0,
          historyCount: data.ownershipHistory?.length || 0,
        });
      } else {
        setVerifyResult({ error: data.error || 'No registered property found with this ID.' });
      }
    } catch {
      setVerifyResult({ error: 'Verification service error. Please try again.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gov-50 text-gov-800 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-gov-100">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>DIGITAL LAND REGISTRY DPI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-gov-900 tracking-tight leading-tight">
              A verifiable digital history for every property.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Bhoomi Ledger brings property records, document fingerprints, ownership history and blockchain-backed transactions into one transparent, India-focused digital public infrastructure.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#verify-section"
                className="bg-gov-900 text-white hover:bg-gov-800 font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <Search className="w-4 h-4 text-amber-400" />
                Verify a Property
              </a>

              <button
                onClick={() => onNavigate('/login')}
                className="bg-white text-slate-800 hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl border border-slate-300 shadow-sm flex items-center gap-2 transition-all"
              >
                Access Portal
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200">
                <div className="text-xl sm:text-2xl font-bold text-gov-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">SHA-256 Fingerprinted</div>
              </div>
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200">
                <div className="text-xl sm:text-2xl font-bold text-gov-900">EVM</div>
                <div className="text-xs text-slate-500 font-medium">Tamper-Evident Ledger</div>
              </div>
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200">
                <div className="text-xl sm:text-2xl font-bold text-gov-900">4 Roles</div>
                <div className="text-xs text-slate-500 font-medium">Govt, Seller & Buyer</div>
              </div>
            </div>
          </div>

          {/* Hero Visual System */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>VERIFICATION PIPELINE</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  01
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Land Title Document</div>
                  <div className="text-slate-500 font-mono text-[11px]">BH-MH-10245 • Worli Sea Face</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  02
                </div>
                <div className="text-xs font-mono">
                  <div className="font-bold text-slate-900 font-sans">SHA-256 Document Fingerprint</div>
                  <div className="text-slate-500 truncate text-[11px]">0x7a8f...39b44e11a33cd</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  03
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Chronological Ownership</div>
                  <div className="text-slate-500 text-[11px]">1998 &rarr; 2005 &rarr; 2018 (Rahul Sharma)</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-emerald-900 text-white p-3.5 rounded-xl border border-emerald-800 flex items-center justify-between shadow">
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold">EVM Blockchain Transaction</div>
                    <div className="text-[11px] text-emerald-300 font-mono">Block #104201 • Confirmed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC LAND VERIFICATION SECTION */}
      <section id="verify-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Live Land Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
              Verify before you trust.
            </h2>
            <p className="text-sm text-slate-600">
              Check a property's registered details, document fingerprints, and ownership history using its Property ID without logging in.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleVerify} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                placeholder="Enter Property ID (e.g. BH-MH-10245)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gov-800 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="bg-gov-900 hover:bg-gov-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all whitespace-nowrap"
            >
              {verifying ? (
                <span>Checking API...</span>
              ) : (
                <>
                  <span>Verify Land</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          {/* Verification Result Display */}
          {verifyResult && (
            <div className="max-w-3xl mx-auto mt-6">
              {verifyResult.error ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-xl flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-900">PROPERTY NOT FOUND</h4>
                    <p className="text-xs text-rose-700 mt-1">{verifyResult.error}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Try searching demo property ID: <span className="font-mono font-bold text-slate-800">BH-MH-10245</span>
                    </p>
                  </div>
                </div>
              ) : (
                verifyResult.property && (
                  <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            PROPERTY VERIFIED
                          </span>
                          <span className="font-mono font-bold text-gov-900 text-sm">{verifyResult.property.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{verifyResult.property.title}</h3>
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectProperty) onSelectProperty(verifyResult.property!.id);
                          onNavigate(`/verify?property=${verifyResult.property!.id}`);
                        }}
                        className="bg-gov-900 hover:bg-gov-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        View Full Verification
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Location</span>
                        <span className="font-semibold text-slate-900">
                          {verifyResult.property.city}, {verifyResult.property.state}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block font-medium">Area</span>
                        <span className="font-semibold text-slate-900">
                          {verifyResult.property.area} {verifyResult.property.areaUnit}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block font-medium">Current Registered Owner</span>
                        <span className="font-semibold text-gov-900">{verifyResult.property.currentOwner}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block font-medium">Document Status</span>
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          SHA-256 Verified
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
            How Bhoomi Ledger Works
          </h2>
          <p className="text-sm text-slate-600">
            Four simple steps to digitize, verify, transfer, and audit property ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Register',
              desc: 'Create official digital property record with survey number and geographic bounds.',
            },
            {
              step: '02',
              title: 'Fingerprint',
              desc: 'Generate immutable SHA-256 cryptographic document fingerprints.',
            },
            {
              step: '03',
              title: 'Transfer',
              desc: 'Execute buyer-seller negotiations and mandatory state government review.',
            },
            {
              step: '04',
              title: 'Verify',
              desc: 'Anyone can verify property timeline and blockchain receipts independently.',
            },
          ].map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-2xl font-extrabold text-gov-800 font-mono">{item.step}</div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTAL SELECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gov-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              ACCESS PORTAL SELECTOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              One registry. Four ways to use it.
            </h2>
            <p className="text-sm text-slate-300">
              Select your administrative or citizen portal to access tailored tools and workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Central */}
            <div
              onClick={() => onNavigate('/login?role=central')}
              className="bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-amber-400/60 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  Central Government
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nationwide administrative oversight, macro-analytics, map filters, and buy/sell monitoring.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:underline">
                Central Portal &rarr;
              </div>
            </div>

            {/* State */}
            <div
              onClick={() => onNavigate('/login?role=state')}
              className="bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-amber-400/60 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  State Government
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Approve transactions, inspect document hashes, flag anomalies, and manage city subportals.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:underline">
                State Portal &rarr;
              </div>
            </div>

            {/* Owner / Seller */}
            <div
              onClick={() => onNavigate('/login?role=seller')}
              className="bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-amber-400/60 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  Owner / Seller
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  List property with survey bounds, upload document hashes, and manage buyer negotiations.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:underline">
                Owner Portal &rarr;
              </div>
            </div>

            {/* Buyer */}
            <div
              onClick={() => onNavigate('/login?role=buyer')}
              className="bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-amber-400/60 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  Buyer
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discover verified properties, submit offers, negotiate terms, and track ownership transfer.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:underline">
                Buyer Portal &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE OWNERSHIP TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gov-900">Interactive Ownership Audit Timeline</h3>
            <p className="text-xs text-slate-500">Example property timeline for Worli Apartment (BH-MH-10245)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { year: '1998', owner: 'Owner A (Allottee)', price: 'INR 25,00,000', block: '#10012' },
              { year: '2005', owner: 'Vikram Malhotra', price: 'INR 65,00,000', block: '#45201' },
              { year: '2018', owner: 'Rahul Sharma', price: 'INR 1,20,00,000', block: '#104201' },
              { year: '2026', owner: 'Pending Approval (Ananya Mehta)', price: 'INR 1,85,00,000', block: 'Pending State Govt' },
            ].map((item, idx) => (
              <div key={item.year} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gov-900 font-mono">{item.year}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                    {item.block}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900">{item.owner}</div>
                <div className="text-xs text-emerald-700 font-semibold">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAMPER DETECTION DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TamperDemo />
      </section>

      {/* MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-gov-900">Explore Registered Property Network</h3>
              <p className="text-xs text-slate-500">Live Leaflet map of verified properties across Indian metropolitan states.</p>
            </div>
            <button
              onClick={() => onNavigate('/login?role=buyer')}
              className="bg-gov-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gov-800 transition-colors"
            >
              Browse All Properties
            </button>
          </div>

          <LeafletMap
            properties={properties}
            onSelectProperty={(prop) => {
              if (onSelectProperty) onSelectProperty(prop.id);
              onNavigate(`/verify?property=${prop.id}`);
            }}
            height="450px"
          />
        </div>
      </section>
    </div>
  );
};
