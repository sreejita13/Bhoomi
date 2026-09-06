import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, Offer } from '../types';
import { Home, Plus, CheckCircle2, XCircle, ArrowRight, MessageSquare, Tag, FileText } from 'lucide-react';

interface SellerDashboardProps {
  onNavigate: (page: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigate }) => {
  const { session } = useAuth();
  const sellerId = session?.id || 'USER-003';
  const sellerName = session?.name || 'Rahul Sharma';

  const [properties, setProperties] = useState<Property[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Counter Offer Modal
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState<number>(18000000);
  const [counterMessage, setCounterMessage] = useState('');

  const fetchSellerData = () => {
    setLoading(true);
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.properties) {
          const myProps = data.properties.filter((p: Property) => p.currentOwner.includes('Rahul') || p.currentOwnerId === sellerId);
          setProperties(myProps.length > 0 ? myProps : data.properties.slice(0, 1));
        }
      });

    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.offers) {
          setOffers(data.offers);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const handleRespondOffer = async (offerId: string, status: 'ACCEPTED' | 'REJECTED' | 'COUNTERED') => {
    if (status === 'COUNTERED') {
      const offer = offers.find((o) => o.id === offerId);
      if (offer) {
        setCounterModalOffer(offer);
        setCounterAmount(offer.amount + 500000);
      }
      return;
    }

    try {
      const res = await fetch(`/api/offers/${offerId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sellerId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(status === 'ACCEPTED' ? 'Deal Agreed! Buyer can now submit the transfer request to Government.' : 'Offer updated.');
        fetchSellerData();
      }
    } catch {
      alert('Action failed.');
    }
  };

  const submitCounterOffer = async () => {
    if (!counterModalOffer) return;
    try {
      const res = await fetch(`/api/offers/${counterModalOffer.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COUNTERED',
          counterAmount,
          counterMessage,
          sellerId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCounterModalOffer(null);
        alert('Counter offer sent to buyer.');
        fetchSellerData();
      }
    } catch {
      alert('Failed to send counter offer.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Home className="w-3.5 h-3.5" />
            PROPERTY OWNER & SELLER PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
            Welcome, {sellerName}
          </h1>
          <p className="text-xs text-slate-500">
            Manage your registered property listings, inspect buyer offers, negotiate terms, and track transfers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/seller/properties/new')}
          className="bg-gov-900 hover:bg-gov-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow flex items-center gap-2 text-xs transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          List New Property
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">My Properties</div>
          <div className="text-2xl font-extrabold text-gov-900">{properties.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Offers Received</div>
          <div className="text-2xl font-extrabold text-amber-600">{offers.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Pending Transfers</div>
          <div className="text-2xl font-extrabold text-blue-700">1</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Verification Status</div>
          <div className="text-2xl font-extrabold text-emerald-700">VERIFIED</div>
        </div>
      </div>

      {/* Offers & Negotiation Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gov-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            Buyer Offers & Bidding Negotiations
          </h3>
          <p className="text-xs text-slate-500">
            Review incoming buyer purchase offers, issue counter-offers, or accept final deal terms.
          </p>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="font-mono text-xs font-bold text-gov-900">{offer.propertyId}</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">Offer from: {offer.buyerName}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Offer Amount</div>
                    <div className="text-lg font-extrabold text-emerald-700">₹{offer.amount.toLocaleString('en-IN')}</div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      offer.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : offer.status === 'COUNTERED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>

              {offer.message && <p className="text-xs text-slate-600 italic">"{offer.message}"</p>}

              {/* Action Buttons for Pending Offers */}
              {offer.status === 'PENDING' && (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleRespondOffer(offer.id, 'REJECTED')}
                    className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleRespondOffer(offer.id, 'COUNTERED')}
                    className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Counter Offer
                  </button>
                  <button
                    onClick={() => handleRespondOffer(offer.id, 'ACCEPTED')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm"
                  >
                    Accept Deal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Properties List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gov-900">My Registered Land Listings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gov-900">{prop.id}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {prop.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900">{prop.title}</h4>
                <p className="text-xs text-slate-500">{prop.address}</p>
                <div className="text-xs font-semibold text-emerald-700 pt-1">
                  Listed Price: ₹{prop.listedPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">SHA-256 Verified Record</span>
                <button
                  onClick={() => onNavigate(`/verify?property=${prop.id}`)}
                  className="bg-gov-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-gov-800"
                >
                  View Public Registry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-300">
            <h3 className="font-bold text-lg text-gov-900">Submit Counter Offer</h3>
            <p className="text-xs text-slate-500">
              Buyer offered ₹{counterModalOffer.amount.toLocaleString('en-IN')}. Enter your counter-proposal.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Counter Amount (INR)</label>
              <input
                type="number"
                value={counterAmount}
                onChange={(e) => setCounterAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message to Buyer</label>
              <textarea
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="Enter counter offer terms..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCounterModalOffer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={submitCounterOffer}
                className="bg-gov-900 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-gov-800"
              >
                Send Counter Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
