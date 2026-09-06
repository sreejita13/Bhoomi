import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Shield className="w-6 h-6 text-amber-400" />
              <span>BHOOMI LEDGER</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A verifiable digital history for every property. Building transparent land record infrastructure for India with SHA-256 cryptographic document fingerprints and blockchain audit trails.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Public Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/verify')} className="hover:text-amber-400 transition-colors">
                  Verify Property ID
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login?role=central')} className="hover:text-amber-400 transition-colors">
                  Central Government Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login?role=state')} className="hover:text-amber-400 transition-colors">
                  State Government Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login?role=seller')} className="hover:text-amber-400 transition-colors">
                  Owner / Seller Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login?role=buyer')} className="hover:text-amber-400 transition-colors">
                  Buyer Marketplace Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Infrastructure Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Infrastructure</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Smart Contract: EVM LandRegistry</span>
              </li>
              <li>
                <span className="text-slate-400">Document Fingerprinting: SHA-256</span>
              </li>
              <li>
                <span className="text-slate-400">GIS Layer: OpenStreetMap / Leaflet</span>
              </li>
              <li>
                <span className="text-slate-400">Identity Mode: Demo Aadhaar OTP</span>
              </li>
            </ul>
          </div>

          {/* Persona Shortcuts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Demo Shortcuts</h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate('/login?role=central')}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2 rounded border border-slate-700 transition-colors block"
              >
                <div className="font-semibold text-white">Central Govt Demo</div>
                <div className="text-[10px] text-slate-400">Rajiv Mehta (+91 9000000001)</div>
              </button>
              <button
                onClick={() => onNavigate('/login?role=state')}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 p-2 rounded border border-slate-700 transition-colors block"
              >
                <div className="font-semibold text-white">State Govt Demo</div>
                <div className="text-[10px] text-slate-400">Priya Sharma (Maharashtra)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-start gap-2 max-w-3xl">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-300">Prototype Disclaimer:</span> Bhoomi Ledger is a demonstration prototype for blockchain-backed digital land registry workflows and is not a substitute for legally recognized government land records. All Aadhaar identity numbers used in this application are fictional demo values.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            &copy; 2026 Bhoomi Ledger DPI Platform
          </div>
        </div>
      </div>
    </footer>
  );
};
