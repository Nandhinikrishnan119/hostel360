import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { complaintService } from '../../services/complaintService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Modal } from '../../components/common/Modal';
import {
  Wrench,
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

export const WardenComplaintsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Assign Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [staffId, setStaffId] = useState('4'); // Maint staff user ID
  const [assignNotes, setAssignNotes] = useState('');

  const loadComplaints = async () => {
    try {
      const [data, cats] = await Promise.all([
        complaintService.filterComplaints({
          hostelId: user?.hostelId,
          status: statusFilter || null,
          priority: priorityFilter || null,
          search: search || null,
          size: 50,
        }),
        complaintService.getCategories(),
      ]);
      setComplaints(data.content || []);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, priorityFilter, search, user]);

  const handleTriggerSla = async () => {
    try {
      await complaintService.triggerSlaCheck();
      showToast('SLA sweep executed! Overdue tickets elevated.', 'success');
      loadComplaints();
    } catch (err) {
      showToast('SLA trigger failed', 'error');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintService.assignComplaint(selectedComplaint.id, Number(staffId), assignNotes);
      showToast('Ticket assigned to technician with instant notification.', 'success');
      setShowAssignModal(false);
      loadComplaints();
    } catch (err) {
      showToast('Assignment failed', 'error');
    }
  };

  const handleManualEscalate = async (id) => {
    try {
      await complaintService.manualEscalate(id, 'Warden escalated ticket due to urgency');
      showToast('Complaint manually escalated to next tier.', 'success');
      loadComplaints();
    } catch (err) {
      showToast('Escalation failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hostel Complaints &amp; Escalations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor resolution times, reassign work orders, and supervise SLA breaches
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerSla}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Run SLA Overdue Check
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #, description, room..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-700 font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="STUDENT_CONFIRMED">Confirmed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-700 font-semibold"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Category &amp; Priority</th>
                <th className="px-6 py-4">Resident &amp; Room</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">SLA Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No complaints matching criteria.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">#{c.complaintNumber}</span>
                      <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[200px] block mt-0.5">
                        {c.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <span className="font-bold text-slate-700 block">{c.categoryName}</span>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{c.studentName}</span>
                      <span className="text-[11px] text-slate-500">
                        {c.blockName} • Room {c.roomNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{c.assignedToName}</span>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4">
                      {c.isOverdue ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          ⚠️ Breached (Tier {c.escalationLevel})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600 font-medium">
                          Due: {new Date(c.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setShowAssignModal(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleManualEscalate(c.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-all"
                      >
                        Escalate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Ticket #${selectedComplaint?.complaintNumber}`}
        subtitle={`Select technician for: ${selectedComplaint?.title}`}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Maintenance Technician *
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="4">Ramesh Patel (Senior Electrician)</option>
              <option value="5">Suresh Verma (Lead Plumber)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work Order Instructions
            </label>
            <textarea
              rows={3}
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
              placeholder="e.g. Inspect regulator capacitors, carry 5A spare fuse..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
