import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Wrench, Clock, CheckCircle, AlertTriangle, MessageSquare, Play, Send } from 'lucide-react';

export const MaintenanceWorkOrdersPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionProof, setResolutionProof] = useState('');

  // Comment Modal
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getStaffWorkOrders();
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (id) => {
    try {
      await complaintService.updateStatus(id, 'IN_PROGRESS', 'Technician is actively working on the reported asset.');
      loadTasks();
    } catch (err) {
      console.error('Failed to start work order:', err);
    }
  };

  const handleOpenResolveModal = (task) => {
    setSelectedTask(task);
    setResolutionNotes('');
    setResolutionProof('https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop');
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await complaintService.resolveComplaint(selectedTask.id, {
        resolutionNotes,
        resolutionProofUrl: resolutionProof,
      });
      setIsResolveModalOpen(false);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      console.error('Failed to resolve work order:', err);
      alert('Failed to submit resolution.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;
    try {
      await complaintService.addComment(selectedTask.id, {
        comment: newComment,
        isInternalStaffOnly: false,
      });
      setIsCommentModalOpen(false);
      setNewComment('');
      loadTasks();
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = priorityFilter ? t.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Active Maintenance Work Orders &amp; SLA Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assigned repair tickets with automated SLA timer countdowns and proof-of-resolution uploads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical SLA (4 hrs)</option>
            <option value="HIGH">High Priority (12 hrs)</option>
            <option value="MEDIUM">Medium Priority (24 hrs)</option>
            <option value="LOW">Low Priority (48 hrs)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ASSIGNED">Pending Start (ASSIGNED)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved (Awaiting Student Close)</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading work orders...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No work orders matching the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-indigo-600">
                    {task.complaintNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{task.title}</h3>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {task.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Location:</span>
                  <span>Room {task.roomNumber || 'B-204'} ({task.blockName || 'Block B'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{task.categoryName || 'General'}</span>
                </div>
                <div className="flex justify-between items-center text-amber-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> SLA Target:
                  </span>
                  <span className="font-mono text-[11px]">{task.slaDeadline}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <StatusBadge status={task.status} />

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsCommentModalOpen(true);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Add Progress Note"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Repair</span>
                    </button>
                  )}

                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleOpenResolveModal(task)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Fixed</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={`Complete Work Order — ${selectedTask?.complaintNumber}`}
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Work Performed &amp; Resolution Notes
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Replaced burnt capacitor, replaced internal wiring and tested with multi-meter..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Proof-of-Resolution Photo Link
            </label>
            <input
              type="text"
              value={resolutionProof}
              onChange={(e) => setResolutionProof(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResolveModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20"
            >
              Submit &amp; Notify Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Progress Note Modal */}
      <Modal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title={`Add Progress Update — ${selectedTask?.complaintNumber}`}
      >
        <form onSubmit={handleAddComment} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Progress Message for Resident
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Spare component ordered from hardware store, arriving at 3 PM..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCommentModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Update</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
