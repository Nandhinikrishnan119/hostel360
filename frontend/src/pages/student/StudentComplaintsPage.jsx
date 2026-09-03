import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { complaintService } from '../../services/complaintService';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  Building,
  Send,
  Zap,
  Trash2,
} from 'lucide-react';

export const StudentComplaintsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Duplicate warning state
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Comment state
  const [commentText, setCommentText] = useState('');

  // Reopen state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const loadComplaints = async () => {
    try {
      const [compData, catData] = await Promise.all([
        complaintService.getMyComplaints(),
        complaintService.getCategories(),
      ]);
      setComplaints(compData);
      setCategories(catData);
      if (catData.length > 0 && !categoryId) {
        setCategoryId(catData[0].id);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Check duplicates when category changes
  useEffect(() => {
    const checkDup = async () => {
      if (categoryId && user?.hostelId && user?.blockId) {
        try {
          const res = await complaintService.checkDuplicates(categoryId, user.hostelId, user.blockId);
          if (res.isPotentialDuplicate) {
            setDuplicateWarning(res);
          } else {
            setDuplicateWarning(null);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkDup();
  }, [categoryId, user]);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await complaintService.createComplaint({
        categoryId,
        title,
        description,
      });
      showToast('Complaint ticket registered with auto-assigned SLA window!', 'success');
      setTitle('');
      setDescription('');
      setShowCreateModal(false);
      loadComplaints();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComplaint = async (e, complaint) => {
    e.stopPropagation();
    if (!window.confirm(`Delete complaint #${complaint.complaintNumber}? This cannot be undone.`)) return;

    try {
      await complaintService.deleteComplaint(complaint.id);
      setComplaints((current) => current.filter((item) => item.id !== complaint.id));
      if (selectedComplaint?.id === complaint.id) {
        setSelectedComplaint(null);
      }
      showToast('Complaint deleted successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete complaint', 'error');
    }
  };

  const handleConfirmResolution = async (id) => {
    try {
      await complaintService.confirmResolution(id);
      showToast('Resolution confirmed! Ticket closed.', 'success');
      loadComplaints();
      if (selectedComplaint?.id === id) {
        const fresh = await complaintService.getComplaintById(id);
        setSelectedComplaint(fresh);
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    try {
      await complaintService.reopenComplaint(selectedComplaint.id, reopenReason);
      showToast('Ticket reopened with extended 24h SLA.', 'info');
      setShowReopenModal(false);
      setReopenReason('');
      loadComplaints();
      const fresh = await complaintService.getComplaintById(selectedComplaint.id);
      setSelectedComplaint(fresh);
    } catch (err) {
      showToast('Reopen failed', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await complaintService.addComment(selectedComplaint.id, commentText, false);
      setCommentText('');
      const fresh = await complaintService.getComplaintById(selectedComplaint.id);
      setSelectedComplaint(fresh);
    } catch (err) {
      showToast('Failed to post comment', 'error');
    }
  };

  const selectedCategory = categories.find((c) => c.id === Number(categoryId));

  return (
    <div className="space-y-8">
      {/* Header with Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hostel Complaints &amp; Repairs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit maintenance requests with guaranteed SLAs and automatic tier escalations
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Report New Complaint
        </button>
      </div>

      {/* Complaints Grid & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Complaint Cards List */}
        <div className="lg:col-span-2 space-y-4">
          {complaints.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Complaints Logged</h3>
              <p className="text-xs text-slate-500 mt-1">You currently have no active or historical tickets.</p>
            </div>
          ) : (
            complaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedComplaint(c)}
                className={`p-6 rounded-3xl bg-white border transition-all cursor-pointer shadow-soft hover:shadow-card ${
                  selectedComplaint?.id === c.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                        #{c.complaintNumber}
                      </span>
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                      {c.isRecurring && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          ⚠️ Recurring Issue
                        </span>
                      )}
                      {c.isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 animate-pulse">
                          🚨 Overdue (Tier {c.escalationLevel})
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                  </div>
                  {c.status === 'SUBMITTED' && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteComplaint(e, c)}
                      title="Delete complaint"
                      aria-label={`Delete complaint ${c.complaintNumber}`}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>
                    Location: <strong className="text-slate-700">{c.hostelName}</strong> • {c.blockName} • Room {c.roomNumber}
                  </span>
                  <span>
                    SLA Deadline: <strong className={c.isOverdue ? 'text-red-600 font-bold' : 'text-slate-700'}>{new Date(c.slaDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Col: Selected Complaint Details & Discussion */}
        <div className="space-y-6">
          {selectedComplaint ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6 sticky top-20">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Ticket Details</span>
                  <h3 className="text-base font-extrabold text-slate-900">#{selectedComplaint.complaintNumber}</h3>
                </div>
                <StatusBadge status={selectedComplaint.status} />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">{selectedComplaint.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{selectedComplaint.description}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-700">{selectedComplaint.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority:</span>
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assignee:</span>
                  <span className="font-bold text-slate-700">{selectedComplaint.assignedToName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Window:</span>
                  <span className={`font-bold ${selectedComplaint.isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                    {selectedComplaint.isOverdue ? 'Overdue' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Resolution Notes & Actions */}
              {selectedComplaint.status === 'RESOLVED' && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                  <h4 className="text-xs font-bold text-teal-900">Technician Marked Resolved</h4>
                  <p className="text-xs text-teal-800">{selectedComplaint.resolutionNotes || 'Repairs completed.'}</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleConfirmResolution(selectedComplaint.id)}
                      className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      ✓ Confirm Resolution
                    </button>
                    <button
                      onClick={() => setShowReopenModal(true)}
                      className="px-3 py-2 bg-white border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-all"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Thread */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Ticket Activity &amp; Discussion
                </span>

                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                  {(!selectedComplaint.comments || selectedComplaint.comments.length === 0) ? (
                    <p className="text-[11px] text-slate-400 text-center py-2">No comments yet</p>
                  ) : (
                    selectedComplaint.comments.map((cm) => (
                      <div key={cm.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                          <span className="text-slate-700 font-bold">{cm.authorName} ({cm.authorRole.replace('ROLE_', '')})</span>
                          <span>{new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700">{cm.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type a message to technician..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/60"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-xs text-slate-400">
              Select any complaint from the list to track live timeline and discuss with technician.
            </div>
          )}
        </div>
      </div>

      {/* Create Complaint Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Report New Hostel Complaint"
        subtitle={`Auto-attaching: ${user?.hostelName || 'Hostel'} • ${user?.blockName || 'Block'} • Room ${user?.roomNumber || 'B-204'}`}
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          {duplicateWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Possible Common Issue in Your Block:</span>
                <p className="mt-0.5">{duplicateWarning.message}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — {cat.description} (Standard SLA: {cat.slaHoursMedium}h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceiling fan regulator sparking, Tap dripping continuously"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide precise details on when the issue started, exact location within room, and any safety hazards..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              {submitting ? 'Submitting Ticket...' : 'Register Complaint'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reopen Modal */}
      <Modal
        isOpen={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        title="Reopen Complaint Ticket"
        subtitle="Please specify why the resolution was unsatisfactory"
      >
        <form onSubmit={handleReopen} className="space-y-4">
          <textarea
            required
            rows={3}
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            placeholder="e.g. Water is still leaking after technician left, Fan noise continues..."
            className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReopenModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
            >
              Confirm Reopen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
