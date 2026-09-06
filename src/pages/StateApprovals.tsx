import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApprovalRequest, Property } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, ArrowLeft, ExternalLink, Lock } from 'lucide-react';

interface StateApprovalsProps {
  onNavigate: (page: string) => void;
}

export const StateApprovals: React.FC<StateApprovalsProps> = ({ onNavigate }) => {
  const { session } = useAuth();
  const userState = session?.state || 'Maharashtra';

  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [propertyData, setPropertyData] = useState<any>(null);

  // Rejection Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Incomplete or Mismatched Document Verification');

  // Success / Execution State
  const [actionSuccess, setActionSuccess] = useState<{
    type: 'APPROVED' | 'REJECTED';
    txHash?: string;
    blockNumber?: number;
    message: string;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchApprovals = () => {
    setLoading(true);
    fetch(`/api/approvals?state=${userState}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.approvals) {
          setApprovals(data.approvals);
          if (data.approvals.length > 0) {
            inspectApproval(data.approvals[0]);
          }
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApprovals();
  }, [userState]);

  const inspectApproval = (app: ApprovalRequest) => {
    setSelectedApproval(app);
    setActionSuccess(null);
    fetch(`/api/properties/${app.propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPropertyData(data);
        }
      });
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;
    setProcessing(true);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/approvals/${selectedApproval.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'APPROVE',
          reviewedBy: session?.name || 'State Government Official',
          userState,
          userRole: session?.role || 'state',
        }),
      });

      const data = await res.json();
      setProcessing(false);

      if (data.success) {
        setActionSuccess({
          type: 'APPROVED',
          txHash: data.txHash,
          blockNumber: data.blockNumber,
          message: `Ownership Transfer APPROVED! Blockchain transaction executed cleanly on Block #${data.blockNumber}.`,
        });
        fetchApprovals();
      } else {
        alert(data.error || 'Failed to approve transfer');
      }
    } catch {
      setProcessing(false);
      alert('Approval request failed.');
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectionReason.trim()) return;
    setProcessing(true);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/approvals/${selectedApproval.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'REJECT',
          reviewedBy: session?.name || 'State Government Official',
          rejectionReason,
          userState,
          userRole: session?.role || 'state',
        }),
      });

      const data = await res.json();
      setProcessing(false);
      setShowRejectModal(false);

      if (data.success) {
        setActionSuccess({
          type: 'REJECTED',
          message: `Transfer Request REJECTED. Recorded reason: ${rejectionReason}`,
        });
        fetchApprovals();
      } else {
        alert(data.error || 'Failed to reject transfer');
      }
    } catch {
      setProcessing(false);
      alert('Rejection request failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('/state/dashboard')}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to State Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-900 tracking-tight">
            Government Review & Approval Workflow
          </h1>
          <p className="text-xs text-slate-500">
            Government of {userState} &bull; Official review of property deeds, SHA-256 document hashes, and buyer-seller transactions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pending Approvals List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Transfer Requests ({approvals.length})
          </h3>

          <div className="space-y-3">
            {approvals.map((app) => (
              <div
                key={app.id}
                onClick={() => inspectApproval(app)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedApproval?.id === app.id
                    ? 'border-gov-900 bg-gov-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-gov-900">{app.propertyId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  Seller: {app.sellerName} &rarr; Buyer: {app.buyerName}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Agreed Value: <span className="font-semibold text-emerald-700">INR {app.agreedPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Government Review Screen */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApproval && propertyData ? (
            <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xl space-y-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">APPROVAL REQUEST REVIEW</div>
                  <h2 className="text-xl font-bold text-gov-900 mt-1">{propertyData.property?.title}</h2>
                  <p className="text-xs text-slate-500 font-mono">Property ID: {selectedApproval.propertyId} &bull; Survey: {propertyData.property?.surveyNumber}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500">Negotiated Transfer Value</div>
                  <div className="text-xl font-extrabold text-emerald-700">₹{selectedApproval.agreedPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Action Success Alert */}
              {actionSuccess && (
                <div
                  className={`p-4 rounded-xl border ${
                    actionSuccess.type === 'APPROVED'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="font-bold text-sm flex items-center gap-2">
                    {actionSuccess.type === 'APPROVED' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                    {actionSuccess.message}
                  </div>
                  {actionSuccess.txHash && (
                    <div className="text-xs font-mono mt-1 text-slate-700 break-all">
                      Transaction Receipt: {actionSuccess.txHash}
                    </div>
                  )}
                </div>
              )}

              {/* Parties Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">CURRENT REGISTERED SELLER</span>
                  <div className="font-extrabold text-gov-900 text-sm">{selectedApproval.sellerName}</div>
                  <div className="text-slate-500">ID: {selectedApproval.sellerId}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">VERIFIED PROPOSED BUYER</span>
                  <div className="font-extrabold text-gov-900 text-sm">{selectedApproval.buyerName}</div>
                  <div className="text-slate-500">ID: {selectedApproval.buyerId}</div>
                </div>
              </div>

              {/* Anomaly Detection Review */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gov-800" />
                  Deterministic Anomaly & Document Risk Review
                </h4>

                {propertyData.documents && propertyData.documents.length > 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All document SHA-256 fingerprints verified cleanly against the registered blockchain hash.</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No document anomalies detected.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedApproval.status === 'PENDING' && !actionSuccess && (
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={processing}
                    className="bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Transfer
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    {processing ? (
                      <span>Executing EVM Smart Contract...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>Approve Transfer & Update Blockchain</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              Select a pending approval request from the left list to review.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-300">
            <h3 className="font-bold text-lg text-gov-900">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-500">
              Provide an official administrative reason for rejecting this property ownership transfer.
            </p>

            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="Invalid or Mismatched Document Verification">Invalid or Mismatched Document Verification</option>
              <option value="Ownership Mismatch in Revenue Records">Ownership Mismatch in Revenue Records</option>
              <option value="Incomplete Stamp Duty or Registration Payment">Incomplete Stamp Duty or Registration Payment</option>
              <option value="Encumbrance Dispute Flagged">Encumbrance Dispute Flagged</option>
            </select>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-rose-800"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
