import React, { useState, useEffect } from 'react';
import { Property, PropertyDocument, OwnershipHistory, BlockchainTransaction } from '../types';
import { CheckCircle2, ShieldCheck, FileText, ArrowLeft, Search, Layers, ExternalLink, QrCode } from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';

interface VerifyPageProps {
  propertyId?: string;
  onNavigate: (page: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ propertyId = 'BH-MH-10245', onNavigate }) => {
  const [searchId, setSearchId] = useState(propertyId);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    property?: Property;
    documents?: PropertyDocument[];
    ownershipHistory?: OwnershipHistory[];
    blockchainTxs?: BlockchainTransaction[];
    error?: string;
  } | null>(null);

  const fetchPropertyData = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${id}`);
      const result = await res.json();
      if (result.success && result.property) {
        setData({
          property: result.property,
          documents: result.documents || [],
          ownershipHistory: result.ownershipHistory || [],
          blockchainTxs: result.blockchainTxs || [],
        });
      } else {
        setData({ error: result.error || 'Property record not found' });
      }
    } catch {
      setData({ error: 'Failed to fetch verification data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData(propertyId);
  }, [propertyId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchPropertyData(searchId.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
            Official Land Verification Record
          </h1>
          <p className="text-xs text-slate-500">
            Public verification registry powered by SHA-256 document hashing and EVM smart contract receipts.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Property ID"
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gov-800"
          />
          <button
            type="submit"
            className="bg-gov-900 text-white hover:bg-gov-800 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-500 font-semibold text-sm">
          Loading verification record from blockchain backend...
        </div>
      )}

      {!loading && data?.error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-xl text-center">
          <h3 className="font-bold text-base mb-1">VERIFICATION ERROR</h3>
          <p className="text-xs">{data.error}</p>
        </div>
      )}

      {!loading && data?.property && (
        <div className="space-y-8">
          {/* Main Status Header Card */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED LAND RECORD
                  </span>
                  <span className="font-mono text-sm font-bold text-gov-900">{data.property.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{data.property.title}</h2>
                <p className="text-xs text-slate-500">{data.property.address}</p>
              </div>

              {/* QR Badge */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 shrink-0">
                <QrCode className="w-10 h-10 text-gov-900" />
                <div className="text-[11px]">
                  <div className="font-bold text-gov-900">VERIFIED QR</div>
                  <div className="text-slate-500 font-mono text-[10px]">{data.property.qrCode || 'BH-MH-QR'}</div>
                </div>
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Survey Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{data.property.surveyNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">State & City</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {data.property.city}, {data.property.state} ({data.property.pin})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Property Area</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {data.property.area} {data.property.areaUnit}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Registered Owner</span>
                <span className="font-extrabold text-gov-900 text-sm">{data.property.currentOwner}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Documents & Ownership */}
            <div className="lg:col-span-7 space-y-8">
              {/* Document SHA-256 Fingerprints */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gov-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Registered Document Cryptographic Fingerprints
                </h3>

                <div className="space-y-3">
                  {data.documents?.map((doc) => (
                    <div key={doc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED HASH
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Type: {doc.type}</div>
                      <div className="bg-white font-mono text-[10px] text-slate-700 p-2 rounded border border-slate-200 break-all select-all">
                        SHA-256: {doc.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ownership History */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gov-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Chronological Ownership Registry
                </h3>

                <div className="space-y-3">
                  {data.ownershipHistory?.map((oh, idx) => (
                    <div key={oh.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-gov-900 text-sm">
                          {oh.year} • {oh.ownerName}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                          Tx Hash: {oh.txHash.substring(0, 18)}... • Block #{oh.blockNumber}
                        </div>
                      </div>
                      <div className="font-bold text-emerald-700 text-sm">
                        INR {oh.transferPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Map & Blockchain Receipts */}
            <div className="lg:col-span-5 space-y-8">
              {/* Map Location */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Geographic Survey Marker</h3>
                <LeafletMap properties={[data.property]} center={[data.property.lat, data.property.lng]} zoom={12} height="280px" />
              </div>

              {/* Blockchain Evidence */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  EVM Smart Contract Audit Trail
                </h3>

                <div className="space-y-3 font-mono text-[11px]">
                  {data.blockchainTxs?.map((tx) => (
                    <div key={tx.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1">
                      <div className="text-amber-300 font-bold flex justify-between">
                        <span>Event: {tx.eventName}</span>
                        <span>Block #{tx.blockNumber}</span>
                      </div>
                      <div className="text-slate-300 text-[10px]">From: {tx.fromAddress}</div>
                      <div className="text-slate-300 text-[10px]">To: {tx.toAddress}</div>
                      <div className="text-slate-400 text-[10px] break-all select-all">Tx: {tx.txHash}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
