import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, RefreshCw, ShieldAlert } from 'lucide-react';

export const TamperDemo: React.FC = () => {
  const originalText = `BHOOMI LEDGER — DEED OF CONVEYANCE
PROPERTY ID: BH-MH-10245
SURVEY NUMBER: MH/MUM/WRL/2021/10245
LOCATION: Worli Sea Face, Mumbai, Maharashtra
REGISTERED OWNER: Rahul Sharma
CONSIDERATION VALUE: INR 18,500,000`;

  const [documentText, setDocumentText] = useState(originalText);

  // SHA-256 implementation using Browser Web Crypto API
  const [hash, setHash] = useState<string>('');
  const [originalHash, setOriginalHash] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState(false);

  // Helper to hash string asynchronously via crypto.subtle
  const asyncHash = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  React.useEffect(() => {
    asyncHash(originalText).then((h) => {
      setOriginalHash(h);
      setHash(h);
      setIsCalculated(true);
    });
  }, []);

  const handleTextChange = async (newText: string) => {
    setDocumentText(newText);
    const h = await asyncHash(newText);
    setHash(h);
  };

  const isMatched = hash === originalHash;

  const simulateTampering = () => {
    const tampered = documentText.replace('INR 18,500,000', 'INR 8,500,000 (SILENTLY MODIFIED)');
    handleTextChange(tampered);
  };

  const resetOriginal = () => {
    handleTextChange(originalText);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Cryptographic Integrity Demonstration
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Can a registered document be silently changed?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Test how Bhoomi Ledger's SHA-256 fingerprinting instantly detects even a single character change in a legal land document.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isMatched ? (
            <button
              onClick={resetOriginal}
              className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Restore Original Document
            </button>
          ) : (
            <button
              onClick={simulateTampering}
              className="bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Document Tampering
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {/* Document Editor */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Document Content (Editable Sandbox)
            </span>
            <span className="text-[11px] text-slate-400">Edit text below to test real-time SHA-256</span>
          </label>
          <textarea
            value={documentText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={7}
            className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-slate-600 leading-relaxed shadow-inner"
          />
        </div>

        {/* Real-time Hash Comparison & Verification Result */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                REGISTERED SHA-256 FINGERPRINT (ON BLOCKCHAIN)
              </div>
              <div className="bg-slate-950 font-mono text-[11px] text-emerald-400 p-2.5 rounded-lg border border-slate-800 break-all select-all">
                {originalHash || 'Calculating...'}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                CURRENT DOCUMENT SHA-256 FINGERPRINT (REAL-TIME)
              </div>
              <div
                className={`bg-slate-950 font-mono text-[11px] p-2.5 rounded-lg border break-all select-all transition-colors ${
                  isMatched ? 'text-emerald-400 border-slate-800' : 'text-rose-400 border-rose-900/50 bg-rose-950/20'
                }`}
              >
                {hash || 'Calculating...'}
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
              isMatched
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800 text-rose-300 animate-pulse'
            }`}
          >
            {isMatched ? (
              <>
                <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-emerald-200 uppercase tracking-wide">
                    DOCUMENT INTEGRITY VERIFIED
                  </div>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    The document hash perfectly matches the registered record on the blockchain.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-rose-200 uppercase tracking-wide">
                    DOCUMENT INTEGRITY FAILURE — TAMPER DETECTED
                  </div>
                  <p className="text-xs text-rose-300/90 mt-0.5">
                    The document fingerprint does not match the registered record. Any unauthorized modification is instantly caught!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
