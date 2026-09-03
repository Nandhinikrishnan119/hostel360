import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { leaveService } from '../../services/leaveService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FileCheck, Phone, Check, X, ShieldAlert } from 'lucide-react';

export const LeaveApprovalsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    try {
      const data = await leaveService.getPendingLeaves(user?.hostelId);
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await leaveService.approveLeave(id, 'Approved by Warden after review');
      showToast('Leave approved and digitally signed for gate pass!', 'success');
      loadLeaves();
    } catch (err) {
      showToast('Approval failed', 'error');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      await leaveService.rejectLeave(selectedLeave.id, remarks || 'Leave request rejected by Warden.');
      showToast('Leave request rejected', 'info');
      setShowRejectModal(false);
      setRemarks('');
      loadLeaves();
    } catch (err) {
      showToast('Rejection failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Leave Approvals</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review out-pass requests, verify parental consent, and approve digital campus exits
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student &amp; Room</th>
                <th className="px-6 py-4">Leave Type &amp; Dates</th>
                <th className="px-6 py-4">Destination &amp; Mode</th>
                <th className="px-6 py-4">Parent Phone &amp; Consent</th>
                <th className="px-6 py-4 text-right">Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No pending leave requests awaiting approval.
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">{l.student?.user?.fullName}</span>
                      <span className="text-[11px] text-slate-500">
                        Roll: {l.student?.studentId} • Room {l.student?.room?.roomNumber || 'B-204'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 block">{l.leaveType} Leave</span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        {l.startDate} $\rightarrow$ {l.endDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block truncate max-w-[180px]">{l.destinationAddress}</span>
                      <span className="text-[10px] text-slate-500">{l.travelMode || 'Bus / Train'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-800 block flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {l.student?.parentPhone || 'N/A'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {l.parentConsentVerified ? '✓ Parent Consent Declared' : '⚠️ Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(l.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeave(l);
                          setShowRejectModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-all"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Leave Application"
        subtitle="Specify reasons to notify student"
      >
        <form onSubmit={handleReject} className="space-y-4">
          <textarea
            required
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Parental verification failed over phone, Attendance shortage..."
            className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-red-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
