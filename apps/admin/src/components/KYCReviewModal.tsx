'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, FileText, X } from 'lucide-react';

export interface KYCApplication {
  id: string;
  captainName: string;
  phone: string;
  dlNumber: string;
  dlExpiry: string;
  vehicleModel: string;
  vehiclePlate: string;
  submittedAt: string;
}

export interface KYCReviewModalProps {
  application: KYCApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const REJECTION_REASONS = [
  'Driving Licence expired or invalid',
  'Photograph or document scan is blurry/unreadable',
  'Vehicle Registration (RC) name does not match applicant',
  'Commercial insurance document missing',
  'Underage applicant (minimum 18 years required)',
];

export function KYCReviewModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: KYCReviewModalProps) {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Captain KYC Review</h3>
            <p className="text-xs text-slate-500">Application #{application.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Captain Personal Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Applicant Name</span>
              <p className="text-sm font-bold text-slate-900">{application.captainName}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Mobile Number</span>
              <p className="text-sm font-bold text-slate-900">+91 {application.phone}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Driving Licence</span>
              <p className="text-sm font-mono font-bold text-slate-900">{application.dlNumber}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">DL Expiry</span>
              <p className="text-sm font-semibold text-slate-700">{application.dlExpiry}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Vehicle Make/Model</span>
              <p className="text-sm font-semibold text-slate-800">{application.vehicleModel}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Plate Number</span>
              <p className="text-sm font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                {application.vehiclePlate}
              </p>
            </div>
          </div>

          {/* Document Preview Box */}
          <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Scanned_Driving_Licence_Front.pdf</p>
                <p className="text-[11px] text-slate-400">Verified digitally on DigiLocker / Parivahan</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer">
              View Document ↗
            </span>
          </div>

          {/* Rejection Form Drawer */}
          {isRejecting && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Select Reason for Rejection</h4>
              </div>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-medium text-slate-800"
              >
                {REJECTION_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          {!isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              >
                Reject Application
              </button>
              <button
                onClick={() => onApprove(application.id)}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Captain</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(application.id, selectedReason)}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
