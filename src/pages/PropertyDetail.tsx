import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyDocument, OwnershipHistory, BlockchainTransaction, Offer } from '../types';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, MessageSquare, Tag, QrCode, ExternalLink, ArrowRight, Building2 } from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';

interface PropertyDetailProps {
  propertyId: string;
  onNavigate: (page: string) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId = 'BH-MH-10245', onNavigate }) => {
  const { session } = useAuth();
  const buyerId = session?.id || 'USER-004';
  const buyerName = session?.name || 'Ananya Mehta';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    property?: Property;
    documents?: PropertyDocument[];
    ownershipHistory?: OwnershipHistory[];
    blockchainTxs?: BlockchainTransaction[];
    pendingApproval?: any;
    activeOffers?: Offer[];
    error?: string;
  } | null>(null);

  // Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(17500000);
  const [offerMessage, setOfferMessage] = useState('Interested in purchasing property.');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  const fetchDetails = () => {
    setLoading(true);
    fetch(`/api/properties/${propertyId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.property) {
          setData(result);
          setOfferAmount(result.property.listedPrice);
        } else {
          setData({ error: result.error || 'Property not found' });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [propertyId]);

  const handleMakeOffer = async () => {
    setSubmittingOffer(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          sellerId: data?.property?.currentOwnerId || 'USER-003',
          buyerId,
          buyerName,
          amount: offerAmount,
          message: offerMessage,
        }),
      });

      const result = await res.json();
      setSubmittingOffer(false);
      setShowOfferModal(false);

      if (result.success) {
        alert('Offer submitted successfully to seller.');
        fetchDetails();
      } else {
        alert(result.error || 'Failed to submit offer');
      }
    } catch {
      setSubmittingOffer(false);
      alert('Error submitting offer.');
    }
  };

  const handleTransferRequest = async () => {
    try {
      const res = await fetch('/api/transfer-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          buyerId,
          buyerName,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setTransferSubmitted(true);
        alert('Transfer request submitted to Government of ' + data?.property?.state);
        fetchDetails();
      }
    } catch {
      alert('Failed to submit transfer request.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-semibold text-sm">Loading property data...</div>;
  }

  if (!data?.property) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-rose-50 border border-rose-200 p-6 rounded-xl text-rose-800">
        <h3 className="font-bold">PROPERTY NOT FOUND</h3>
        <p className="text-xs mt-1">{data?.error}</p>
      </div>
    );
  }

  const prop = data.property;
  const acceptedOffer = data.activeOffers?.find((o) => o.status === 'ACCEPTED');
  const isDealAgreed = prop.status === 'DEAL_AGREED' || acceptedOffer;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('/buyer/dashboard')}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
              REGISTERED LAND PARCEL
            </span>
            <span className="font-mono text-xs font-bold text-gov-900">{prop.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight mt-1">{prop.title}</h1>
          <p className="text-xs text-slate-500">{prop.address}</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium">Listed Asking Price</div>
          <div className="text-2xl font-extrabold text-emerald-700">₹{prop.listedPrice.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* DEAL AGREED BANNER */}
      {isDealAgreed && (
        <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-700">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              DEAL AGREED WITH SELLER
            </div>
            <h3 className="text-xl font-bold text-white">Negotiation Agreed! Next: Submit Government Transfer Request</h3>
            <p className="text-xs text-emerald-200">
              Agreed Purchase Price: <span className="font-bold text-amber-300">₹{(acceptedOffer?.amount || prop.listedPrice).toLocaleString('en-IN')}</span>. Ownership changes only after government approval.
            </p>
          </div>

          {prop.status !== 'PENDING_GOVERNMENT_APPROVAL' && !transferSubmitted ? (
            <button
              onClick={handleTransferRequest}
              className="bg-amber-500 hover:bg-amber-400 text-gov-900 font-extrabold px-6 py-3 rounded-xl shadow text-xs flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <span>Submit Transfer Request to Government</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-4 py-2 rounded-lg">
              Pending Government Review & Approval
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Attributes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gov-900 uppercase tracking-wider">Property Specification</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Survey Number</span>
                <span className="font-mono font-bold text-slate-900">{prop.surveyNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">State & City</span>
                <span className="font-semibold text-slate-900">{prop.city}, {prop.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Property Area</span>
                <span className="font-semibold text-slate-900">{prop.area} {prop.areaUnit}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Current Registered Owner</span>
                <span className="font-extrabold text-gov-900">{prop.currentOwner}</span>
              </div>
            </div>
          </div>

          {/* Leaflet Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geographic Map Marker</h3>
            <LeafletMap properties={[prop]} center={[prop.lat, prop.lng]} zoom={12} height="320px" />
          </div>

          {/* Documents SHA-256 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gov-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              Cryptographic Document Fingerprints
            </h3>
            <div className="space-y-3">
              {data.documents?.map((doc) => (
                <div key={doc.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{doc.name}</span>
                    <span className="text-emerald-700 font-bold text-[10px]">SHA-256 VERIFIED</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200 break-all select-all">
                    {doc.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Bidding / Action Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gov-900">Purchase Action Center</h3>
            <p className="text-xs text-slate-500">
              Submit an official purchase offer to seller <span className="font-bold text-slate-800">{prop.currentOwner}</span>.
            </p>

            <button
              onClick={() => setShowOfferModal(true)}
              className="w-full bg-gov-900 hover:bg-gov-800 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center gap-2 text-xs transition-all"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Make an Offer</span>
            </button>

            <button
              onClick={() => onNavigate(`/verify?property=${prop.id}`)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl border border-slate-300 text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Inspect Full Verification Record</span>
            </button>
          </div>

          {/* Active Negotiation Offers Stream */}
          {data.activeOffers && data.activeOffers.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Negotiation Offer Stream</h4>
              <div className="space-y-2">
                {data.activeOffers.map((off) => (
                  <div key={off.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{off.buyerName}</span>
                      <span className="font-extrabold text-emerald-700">₹{off.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>Status: {off.status}</span>
                      <span>{new Date(off.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAKE OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-300">
            <h3 className="font-bold text-lg text-gov-900">Submit Purchase Offer</h3>
            <p className="text-xs text-slate-500">
              Submit your offer for <span className="font-bold text-slate-900">{prop.title}</span>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Amount (INR)</label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-lg font-bold text-emerald-700 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">₹{offerAmount.toLocaleString('en-IN')}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message to Seller</label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={submittingOffer}
                className="bg-gov-900 text-white font-bold px-5 py-2 rounded-lg text-xs hover:bg-gov-800"
              >
                {submittingOffer ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
