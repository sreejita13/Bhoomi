import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, ApprovalRequest } from '../types';
import { Layers, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Building2, Search, FileCheck } from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { INDIAN_STATES_AND_CITIES } from '../data/statesAndCities';

interface StateDashboardProps {
  onNavigate: (page: string) => void;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({ onNavigate }) => {
  const { session, setCity, setState } = useAuth();
  const userState = session?.state || 'Maharashtra';
  const userCity = session?.city || 'Mumbai';

  const [properties, setProperties] = useState<Property[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const currentStateData = INDIAN_STATES_AND_CITIES.find((s) => s.state === userState);

  useEffect(() => {
    setLoading(true);
    // Fetch State scoped properties
    fetch(`/api/properties?state=${userState}${userCity ? `&city=${userCity}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.properties) {
          setProperties(data.properties);
        }
      });

    // Fetch State scoped approvals
    fetch(`/api/approvals?state=${userState}${userCity ? `&city=${userCity}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.approvals) {
          setApprovals(data.approvals);
        }
        setLoading(false);
      });
  }, [userState, userCity]);

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gov-900 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gov-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-gov-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              STATE ADMINISTRATION
            </span>
            <span className="text-slate-300 text-xs">Government of {userState}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {userCity} Metropolitan Portal
          </h1>
          <p className="text-xs text-slate-300">
            Regional land administration, transaction verification, and official ownership transfer approvals.
          </p>
        </div>

        {/* City Subportal Switcher */}
        <div className="bg-gov-800 p-3 rounded-xl border border-gov-700 space-y-1 w-full sm:w-auto">
          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Switch Metropolitan Subportal
          </div>
          <div className="flex items-center gap-2">
            <select
              value={userState}
              onChange={(e) => {
                setState(e.target.value);
                const first = INDIAN_STATES_AND_CITIES.find((s) => s.state === e.target.value)?.cities[0]?.name;
                if (first) setCity(first);
              }}
              className="bg-gov-900 text-white text-xs font-semibold px-3 py-1.5 rounded border border-gov-700 focus:outline-none"
            >
              {INDIAN_STATES_AND_CITIES.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>

            {currentStateData && (
              <select
                value={userCity}
                onChange={(e) => setCity(e.target.value)}
                className="bg-gov-900 text-white text-xs font-semibold px-3 py-1.5 rounded border border-gov-700 focus:outline-none"
              >
                {currentStateData.cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Action Banner for Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shrink-0">
              {pendingApprovals.length}
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-950">
                {pendingApprovals.length} Pending Ownership Transfer Approval Request
              </h3>
              <p className="text-xs text-amber-800">
                Requires official government review of document SHA-256 hashes before executing blockchain transfer.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/state/approvals')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            Review Pending Approvals
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* State Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500">{userCity} Properties</div>
          <div className="text-2xl font-extrabold text-gov-900">{properties.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500">Pending Approvals</div>
          <div className="text-2xl font-extrabold text-amber-600">{pendingApprovals.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500">Completed Transfers</div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {approvals.filter((a) => a.status === 'APPROVED').length + 2}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-medium text-slate-500">Document Anomalies</div>
          <div className="text-2xl font-extrabold text-slate-800">0</div>
        </div>
      </div>

      {/* Metropolitan GIS Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gov-900">{userCity} Regional Property GIS Map</h3>
          <span className="text-xs text-slate-500 font-mono">Scope: {userState} &bull; {userCity}</span>
        </div>
        <LeafletMap
          properties={properties}
          onSelectProperty={(p) => onNavigate(`/verify?property=${p.id}`)}
          height="400px"
        />
      </div>

      {/* Regional Properties List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gov-900">Registered Land Parcels in {userCity}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Property ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Survey No</th>
                <th className="p-3">Current Owner</th>
                <th className="p-3">Listed Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-gov-900">{p.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{p.title}</td>
                  <td className="p-3 font-mono text-slate-600">{p.surveyNumber}</td>
                  <td className="p-3 font-bold text-slate-800">{p.currentOwner}</td>
                  <td className="p-3 font-semibold text-emerald-700">₹{p.listedPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate(`/verify?property=${p.id}`)}
                      className="bg-gov-900 text-white text-[11px] font-semibold px-3 py-1 rounded hover:bg-gov-800"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
