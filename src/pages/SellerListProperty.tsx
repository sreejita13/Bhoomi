import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../components/LeafletMap';
import { ArrowLeft, CheckCircle2, FileText, MapPin, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { INDIAN_STATES_AND_CITIES } from '../data/statesAndCities';

interface SellerListPropertyProps {
  onNavigate: (page: string) => void;
}

export const SellerListProperty: React.FC<SellerListPropertyProps> = ({ onNavigate }) => {
  const { session } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial' | 'Agricultural' | 'Industrial'>('Residential');
  const [area, setArea] = useState<number>(1800);
  const [areaUnit, setAreaUnit] = useState('sq.ft');

  const [address, setAddress] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [pin, setPin] = useState('400001');
  const [lat, setLat] = useState<number>(19.076);
  const [lng, setLng] = useState<number>(72.8777);

  const [listedPrice, setListedPrice] = useState<number>(15000000);

  const [docName, setDocName] = useState('Deed of Conveyance');
  const [docContent, setDocContent] = useState('OFFICIAL REGISTRATION OF CONVEYANCE DEED FOR PROPERTY');

  const [submitting, setSubmitting] = useState(false);
  const [createdPropId, setCreatedPropId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          surveyNumber,
          propertyType,
          area,
          areaUnit,
          address,
          state,
          city,
          pin,
          lat,
          lng,
          currentOwner: session?.name || 'Rahul Sharma',
          currentOwnerId: session?.id || 'USER-003',
          listedPrice,
          documents: [
            {
              name: docName,
              type: 'Sale Deed',
              content: docContent,
            },
          ],
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success && data.propertyId) {
        setCreatedPropId(data.propertyId);
        setStep(5);
      } else {
        alert('Failed to register property.');
      }
    } catch {
      setSubmitting(false);
      alert('Property registration error.');
    }
  };

  const currentStateData = INDIAN_STATES_AND_CITIES.find((s) => s.state === state);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => onNavigate('/seller/dashboard')}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Owner Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
          Multi-Step Digital Property Registration
        </h1>
        <p className="text-xs text-slate-500">
          Register new land parcel with survey bounds, SHA-256 document hashing, and EVM smart contract entry.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s ? 'bg-gov-900 text-white' : step > s ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {s}
            </div>
            {s < 5 && <div className="w-8 h-0.5 bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Container */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-xl">
        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gov-900">Step 1: Property Identification Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3 BHK Luxury Apartment in Worli"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Survey / Gat / Plot Number</label>
                  <input
                    type="text"
                    required
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    placeholder="MH/MUM/WRL/2026/55102"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gov-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Classification</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Area</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="acres">acres</option>
                    <option value="hectares">hectares</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!title || !surveyNumber}
                className="bg-gov-900 hover:bg-gov-800 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm text-sm flex items-center gap-2"
              >
                Next: Location & Maps &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & MAP */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gov-900">Step 2: Location & Geographic Boundaries</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Postal Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, building name, landmark..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      const first = INDIAN_STATES_AND_CITIES.find((s) => s.state === e.target.value)?.cities[0]?.name;
                      if (first) setCity(first);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {INDIAN_STATES_AND_CITIES.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  {currentStateData && (
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                    >
                      {currentStateData.cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Leaflet Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interactive Leaflet Location Marker (Click map to adjust pin)
                </label>
                <LeafletMap
                  center={[lat, lng]}
                  zoom={10}
                  interactiveSelect={true}
                  selectedLat={lat}
                  selectedLng={lng}
                  onLocationSelect={(l1, l2) => {
                    setLat(l1);
                    setLng(l2);
                  }}
                  height="260px"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-xs font-semibold text-slate-500">
                &larr; Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!address}
                className="bg-gov-900 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
              >
                Next: Valuation &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gov-900">Step 3: Property Valuation & Listing Price</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Listing Price (INR)</label>
              <input
                type="number"
                value={listedPrice}
                onChange={(e) => setListedPrice(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xl font-bold text-emerald-700 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Value in words: ₹{listedPrice.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-xs font-semibold text-slate-500">
                &larr; Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-gov-900 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
              >
                Next: Document Hashing &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DOCUMENTS */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gov-900">Step 4: Upload Legal Deed & SHA-256 Hashing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Content Text</label>
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setStep(3)} className="text-xs font-semibold text-slate-500">
                &larr; Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow flex items-center gap-2"
              >
                {submitting ? 'Registering on Chain...' : 'Publish Property & Register'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 5 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-gov-900">Property Successfully Registered!</h2>

            <p className="text-xs text-slate-500">
              Assigned Property ID: <span className="font-mono font-bold text-gov-900 text-sm">{createdPropId}</span>
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => onNavigate(`/verify?property=${createdPropId}`)}
                className="bg-gov-900 text-white font-semibold px-5 py-2 rounded-lg text-xs"
              >
                Inspect Public Record
              </button>

              <button
                onClick={() => onNavigate('/seller/dashboard')}
                className="bg-slate-100 border border-slate-300 text-slate-800 font-semibold px-5 py-2 rounded-lg text-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
