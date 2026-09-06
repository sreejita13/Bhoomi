import React, { useState, useEffect } from 'react';
import { Property, AuditLog } from '../types';
import { Building2, Shield, Layers, FileCheck, MapPin, Search, CheckCircle2, AlertTriangle, Activity, BarChart2, Filter } from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CentralDashboardProps {
  onNavigate: (page: string) => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filter States for Nationwide Map & Buy/Sell Monitor
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Fetch Analytics
    fetch('/api/central/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
          setAuditLogs(data.recentAuditLogs || []);
        }
      });

    // 2. Fetch Properties
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.properties) {
          setProperties(data.properties);
        }
      });

    // 3. Fetch Approvals
    fetch('/api/approvals')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.approvals) {
          setApprovals(data.approvals);
        }
      });
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (selectedState && p.state !== selectedState) return false;
    if (selectedCity && p.city !== selectedCity) return false;
    if (selectedType && p.propertyType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.currentOwner.toLowerCase().includes(q);
    }
    return true;
  });

  const stateChartData = [
    { name: 'Maharashtra', count: 3 },
    { name: 'Delhi', count: 1 },
    { name: 'Karnataka', count: 1 },
    { name: 'West Bengal', count: 1 },
  ];

  const COLORS = ['#0f172a', '#0284c7', '#059669', '#d97706', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              CENTRAL GOVERNMENT
            </span>
            <span className="text-slate-300 text-xs font-mono">NATIONAL LAND OVERSIGHT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            National Land Registry Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time analytics, nationwide GIS property map, macro verification, and transaction monitoring.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/verify')}
          className="bg-gov-700 hover:bg-gov-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Search className="w-4 h-4 text-amber-300" />
          Verify Land ID
        </button>
      </div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
        {[
          { label: 'Total Properties', val: metrics?.totalProperties || 6, color: 'text-gov-900' },
          { label: 'Total Owners', val: metrics?.totalOwners || 6, color: 'text-slate-800' },
          { label: 'Total Buyers', val: metrics?.totalBuyers || 12, color: 'text-slate-800' },
          { label: 'Active Listings', val: metrics?.totalListed || 5, color: 'text-blue-700' },
          { label: 'Pending Approvals', val: metrics?.pendingApprovals || 1, color: 'text-amber-700' },
          { label: 'Completed Transfers', val: metrics?.completedTransfers || 3, color: 'text-emerald-700' },
          { label: 'Blockchain Txs', val: metrics?.totalBlockchainTxs || 14, color: 'text-purple-700' },
          { label: 'Disputes Flagged', val: metrics?.totalDisputes || 0, color: 'text-rose-700' },
        ].map((m, idx) => (
          <div key={idx} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight">{m.label}</div>
            <div className={`text-lg sm:text-xl font-extrabold ${m.color}`}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Distribution Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gov-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gov-700" />
            Properties Distribution by State
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gov-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            Live Platform Audit Event Stream
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gov-900">{log.action}</span>
                  <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-600 text-[11px] font-sans">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NATIONWIDE LEAFLET MAP SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <h3 className="text-lg font-bold text-gov-900">Nationwide GIS Property Map</h3>
            <p className="text-xs text-slate-500">Filter registered land parcels across Indian states and cities.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="West Bengal">West Bengal</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
          </div>
        </div>

        <LeafletMap
          properties={filteredProperties}
          onSelectProperty={(prop) => onNavigate(`/verify?property=${prop.id}`)}
          height="480px"
        />
      </div>

      {/* BUY & SELL MONITORING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gov-900">Buy & Sell National Transaction Monitor</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Property ID or Owner..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Property ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">State / City</th>
                <th className="p-3">Current Owner</th>
                <th className="p-3">Listed Price (INR)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-gov-900">{prop.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{prop.title}</td>
                  <td className="p-3">{prop.city}, {prop.state}</td>
                  <td className="p-3 font-bold text-slate-800">{prop.currentOwner}</td>
                  <td className="p-3 font-semibold text-emerald-700">₹{prop.listedPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prop.status === 'TRANSFERRED' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'PENDING_GOVERNMENT_APPROVAL' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate(`/verify?property=${prop.id}`)}
                      className="bg-gov-900 text-white hover:bg-gov-800 text-[11px] font-semibold px-3 py-1 rounded transition-colors"
                    >
                      Inspect
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
