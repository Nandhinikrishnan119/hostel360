import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { complaintService } from '../../services/complaintService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Modal } from '../../components/common/Modal';
import { Wrench, CheckCircle2, Clock, AlertTriangle, PlayCircle, CheckSquare, MessageSquare } from 'lucide-react';

export const MaintenanceDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [assignedTickets, setAssignedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [nextStatus, setNextStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const data = await complaintService.getAssignedComplaints();
      setAssignedTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await complaintService.updateStatus(selectedTicket.id, {
        status: nextStatus,
        resolutionNotes,
        resolutionProofUrl: proofUrl,
      });
      showToast(`Work order updated to ${nextStatus}!`, 'success');
      setShowStatusModal(false);
      setResolutionNotes('');
      setProofUrl('');
      loadTickets();
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const openTickets = assignedTickets.filter((t) => t.status !== 'STUDENT_CONFIRMED' && t.status !== 'CLOSED');
  const overdueTickets = assignedTickets.filter((t) => t.isOverdue);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/20">
              Maintenance Technician Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              {user?.fullName || 'Technician'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 mt-1">
              Designation: <strong className="text-white">{user?.designation || 'Electrician'}</strong> • Active Work Orders
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Assigned Work Orders"
          value={openTickets.length}
          subtitle="Active repair jobs"
          icon={Wrench}
          color="indigo"
        />
        <StatCard
          title="SLA Breaches"
          value={overdueTickets.length}
          subtitle="Tier 1 auto-escalations"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Completed Today"
          value={assignedTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'STUDENT_CONFIRMED').length}
          subtitle="Resolution records"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Active Work Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Assigned Maintenance Tasks</h3>
          <span className="text-xs text-slate-400">{openTickets.length} pending repairs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Priority &amp; Category</th>
                <th className="px-6 py-4">Location &amp; Resident</th>
                <th className="px-6 py-4">SLA Countdown</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No work orders assigned to you right now.
                  </td>
                </tr>
              ) : (
                assignedTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">#{t.complaintNumber}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">{t.title}</span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <span className="font-bold text-slate-700 block">{t.categoryName}</span>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{t.blockName} • Room {t.roomNumber}</span>
                      <span className="text-[11px] text-slate-500">{t.studentName} ({t.studentPhone})</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.isOverdue ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 animate-pulse">
                          🚨 Overdue
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {new Date(t.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(t);
                          setNextStatus(t.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'RESOLVED');
                          setShowStatusModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Transition Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Update Status: #${selectedTicket?.complaintNumber}`}
        subtitle={`Location: ${selectedTicket?.blockName} • Room ${selectedTicket?.roomNumber}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              New Status *
            </label>
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="IN_PROGRESS">IN_PROGRESS (Technician on site / testing)</option>
              <option value="RESOLVED">RESOLVED (Repairs completed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Resolution Proof / Work Notes *
            </label>
            <textarea
              required
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Replaced capacitor and tested fan regulator. Verified working with student..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Work Order Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
