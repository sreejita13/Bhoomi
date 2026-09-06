import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Building2, Layers, Home, UserCheck, ShieldCheck, ArrowRight, Smartphone, KeyRound, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { INDIAN_STATES_AND_CITIES } from '../data/statesAndCities';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialRole }) => {
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<UserRole>(initialRole || 'seller');

  // Identity Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('9999 9999 9999');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');

  // OTP State
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  // Demo Persona Quick Fill
  const applyDemoPersona = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'central') {
      setName('Rajiv Mehta');
      setPhone('9000000001');
      setAadhaar('9999 9999 0001');
    } else if (targetRole === 'state') {
      setName('Priya Sharma');
      setPhone('9000000002');
      setAadhaar('9999 9999 0002');
      setState('Maharashtra');
      setCity('Mumbai');
    } else if (targetRole === 'seller') {
      setName('Rahul Sharma');
      setPhone('9000000003');
      setAadhaar('9999 9999 0003');
    } else if (targetRole === 'buyer') {
      setName('Ananya Mehta');
      setPhone('9000000004');
      setAadhaar('9999 9999 0004');
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setStep(3);
    setTimer(30);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsVerifying(true);

    if (otp !== '123456') {
      setOtpError('Invalid OTP. Please enter fixed demo OTP: 123456');
      setIsVerifying(false);
      return;
    }

    const success = await login(role, name || 'Demo User', phone || '9999999999', state, city, aadhaar);
    setIsVerifying(false);

    if (success) {
      if (role === 'central') onNavigate('/central/dashboard');
      else if (role === 'state') onNavigate('/state/dashboard');
      else if (role === 'seller') onNavigate('/seller/dashboard');
      else if (role === 'buyer') onNavigate('/buyer/dashboard');
    } else {
      setOtpError('Failed to establish demo session.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="text-center max-w-lg mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          DEMO AUTHENTICATION — NO REAL IDENTITY VERIFICATION
        </div>
        <h1 className="text-3xl font-extrabold text-gov-900 tracking-tight">Access Bhoomi Ledger Portal</h1>
        <p className="text-xs text-slate-500">
          Select your portal role and authenticate using fictional demo identity credentials.
        </p>
      </div>

      {/* Quick Demo Persona Shortcuts */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 mb-8 space-y-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          One-Click Demo Account Access (Instant Prefill)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <button
            onClick={() => applyDemoPersona('central')}
            className="bg-white hover:bg-slate-50 p-2.5 rounded-lg border border-slate-300 text-left transition-all shadow-sm"
          >
            <div className="font-bold text-gov-900">Central Govt</div>
            <div className="text-[10px] text-slate-500">Rajiv Mehta</div>
          </button>
          <button
            onClick={() => applyDemoPersona('state')}
            className="bg-white hover:bg-slate-50 p-2.5 rounded-lg border border-slate-300 text-left transition-all shadow-sm"
          >
            <div className="font-bold text-gov-900">State Govt (MH)</div>
            <div className="text-[10px] text-slate-500">Priya Sharma</div>
          </button>
          <button
            onClick={() => applyDemoPersona('seller')}
            className="bg-white hover:bg-slate-50 p-2.5 rounded-lg border border-slate-300 text-left transition-all shadow-sm"
          >
            <div className="font-bold text-gov-900">Seller / Owner</div>
            <div className="text-[10px] text-slate-500">Rahul Sharma</div>
          </button>
          <button
            onClick={() => applyDemoPersona('buyer')}
            className="bg-white hover:bg-slate-50 p-2.5 rounded-lg border border-slate-300 text-left transition-all shadow-sm"
          >
            <div className="font-bold text-gov-900">Buyer Persona</div>
            <div className="text-[10px] text-slate-500">Ananya Mehta</div>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-gov-900 text-white' : 'bg-emerald-700 text-white'}`}>
            1
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-gov-900 text-white' : step > 2 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-gov-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            3
          </div>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gov-900 text-center">Select your role to continue</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Central */}
              <div
                onClick={() => setRole('central')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  role === 'central' ? 'border-gov-900 bg-gov-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-gov-900 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gov-900">Central Government</h3>
                  <p className="text-xs text-slate-500 mt-1">National-level administrative oversight and analytics</p>
                </div>
              </div>

              {/* State */}
              <div
                onClick={() => setRole('state')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  role === 'state' ? 'border-gov-900 bg-gov-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-blue-700 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gov-900">State Government</h3>
                  <p className="text-xs text-slate-500 mt-1">State & metropolitan administrative review and approvals</p>
                </div>
              </div>

              {/* Seller */}
              <div
                onClick={() => setRole('seller')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  role === 'seller' ? 'border-gov-900 bg-gov-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-emerald-700 shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gov-900">Owner / Seller</h3>
                  <p className="text-xs text-slate-500 mt-1">List and transfer your property with document hashes</p>
                </div>
              </div>

              {/* Buyer */}
              <div
                onClick={() => setRole('buyer')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  role === 'buyer' ? 'border-gov-900 bg-gov-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-purple-700 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gov-900">Buyer</h3>
                  <p className="text-xs text-slate-500 mt-1">Discover verified properties and initiate purchases</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-gov-900 hover:bg-gov-800 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 text-sm transition-all"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTITY FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5 max-w-md mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gov-900">Demo Identity Information</h2>
              <p className="text-xs text-slate-500">Selected Role: <span className="font-bold capitalize text-gov-900">{role}</span></p>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Demo mode only:</strong> Do not enter real Aadhaar or personal information.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 90000 00000"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gov-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Demo Aadhaar Number (12 Digits)</label>
              <input
                type="text"
                required
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="9999 9999 9999"
                maxLength={14}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gov-800"
              />
            </div>

            {/* State & City Dropdown for State Government Role */}
            {role === 'state' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State Administration</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      const firstCity = INDIAN_STATES_AND_CITIES.find((s) => s.state === e.target.value)?.cities[0]?.name;
                      if (firstCity) setCity(firstCity);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gov-800"
                  >
                    {INDIAN_STATES_AND_CITIES.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metropolitan City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gov-800"
                  >
                    {INDIAN_STATES_AND_CITIES.find((s) => s.state === state)?.cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                &larr; Back to Role Selection
              </button>

              <button
                type="submit"
                className="bg-gov-900 hover:bg-gov-800 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm text-sm transition-all"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 3 && (
          <form onSubmit={handleOtpVerify} className="space-y-6 max-w-sm mx-auto">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-gov-50 text-gov-900 mx-auto flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gov-900">Enter OTP Verification</h2>
              <p className="text-xs text-slate-500">
                OTP sent to <span className="font-mono font-bold text-slate-800">{phone || '+91 90000 00000'}</span>
              </p>
            </div>

            {/* Fixed OTP Banner */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs text-center font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Fixed Demo OTP: <span className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">123456</span>
            </div>

            {otpError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg text-center font-medium">
                {otpError}
              </div>
            )}

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center font-mono text-2xl tracking-widest py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-800"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gov-900 hover:bg-gov-800 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
            >
              {isVerifying ? (
                <span>Verifying Session...</span>
              ) : (
                <>
                  <span>Verify OTP & Enter Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Change Identity Info
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
