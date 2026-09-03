import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { leaveService } from '../../services/leaveService';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  PlaneTakeoff,
  Clock,
  Plus,
  ShieldCheck,
  Calendar,
  MapPin,
  Car,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const StudentLeavePage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [leaves, setLeaves] = useState([]);
  const [lateEntries, setLateEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leave Modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState('HOME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('Train / Bus');
  const [parentConsent, setParentConsent] = useState(true);

  // Late Entry Modal
  const [showLateModal, setShowLateModal] = useState(false);
  const [lateDate, setLateDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedTime, setExpectedTime] = useState('22:00');
  const [lateReason, setLateReason] = useState('');

  const loadLeaveData = async () => {
    try {
      const [leavesData, lateData] = await Promise.all([
        leaveService.getMyLeaves(),
        leaveService.getMyLateEntries(),
      ]);
      setLeaves(leavesData);
      setLateEntries(lateData);
    } catch (err) {
      console.error('Failed to load leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.submitLeave({
        leaveType,
        startDate,
        endDate,
        reason,
        destinationAddress: destination,
        travelMode,
        parentConsentVerified: parentConsent,
      });
      showToast('Leave application submitted to Hostel Warden for approval!', 'success');
      setShowLeaveModal(false);
      setReason('');
      setDestination('');
      loadLeaveData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit leave', 'error');
    }
  };

  const handleLateSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.submitLateEntry({
        date: lateDate,
        expectedTime: expectedTime + ':00',
        reason: lateReason,
      });
      showToast('Late entry notice registered with Gate Security Desk.', 'success');
      setShowLateModal(false);
      setLateReason('');
      loadLeaveData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to declare late entry', 'error');
    }
  };

  const activeApprovedPass = leaves.find((l) => l.status === 'APPROVED_WARDEN' || l.status === 'CHECKED_OUT');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leave &amp; Late Entry Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital out-pass approvals, parental consent verification, and gate security clearance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <PlaneTakeoff className="w-4 h-4" />
            Apply for Out-Pass / Leave
          </button>
          <button
            onClick={() => setShowLateModal(true)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-purple-600" />
            Declare Late Entry
          </button>
        </div>
      </div>

      {/* Active Digital Gate Pass if Approved */}
      {activeApprovedPass && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Verified Digital Gate Pass
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Pass #{activeApprovedPass.id} • {activeApprovedPass.leaveType} Leave
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {activeApprovedPass.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <p className="text-slate-400">Valid From:</p>
              <p className="font-bold text-white mt-0.5">{activeApprovedPass.startDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Valid Until:</p>
              <p className="font-bold text-white mt-0.5">{activeApprovedPass.endDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Destination:</p>
              <p className="font-bold text-white mt-0.5 truncate">{activeApprovedPass.destinationAddress}</p>
            </div>
            <div>
              <p className="text-slate-400">Warden Remarks:</p>
              <p className="font-bold text-emerald-300 mt-0.5">{activeApprovedPass.wardenRemarks || 'Approved'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Tables: Leaves & Late Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Requests Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">My Leave Applications</h3>
            <span className="text-xs text-slate-400">{leaves.length} records</span>
          </div>

          {leaves.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No leave requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{l.leaveType} Leave</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {l.startDate} $\rightarrow$ {l.endDate}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">Reason: {l.reason}</p>
                  {l.wardenRemarks && (
                    <p className="text-[11px] text-indigo-600 font-semibold">Warden note: {l.wardenRemarks}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Late Entries Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Declared Late Entries</h3>
            <span className="text-xs text-slate-400">{lateEntries.length} entries</span>
          </div>

          {lateEntries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No late entry declarations.</p>
          ) : (
            <div className="space-y-3">
              {lateEntries.map((e) => (
                <div key={e.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{e.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Expected: {e.expectedTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Reason: {e.reason}</p>
                  {e.actualEntryTime && (
                    <p className="text-[11px] text-emerald-600 font-bold">
                      ✓ Gate entry verified at: {new Date(e.actualEntryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Apply for Hostel Out-Pass / Leave"
        subtitle="Ensure parental consent is obtained prior to submission"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Leave Category *
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="HOME">Going Home</option>
              <option value="OUTING">Local City Outing</option>
              <option value="MEDICAL">Medical Emergency / Consultation</option>
              <option value="INTERNSHIP_EVENT">College Event / Placement / Internship</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Destination Address *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. 45, Temple Street, Bangalore"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Leave *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for travel..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="parentConsent"
              checked={parentConsent}
              onChange={(e) => setParentConsent(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="parentConsent" className="text-xs text-slate-700 font-medium">
              I confirm that my parents/guardians are fully informed of this travel plan.
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLeaveModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Late Entry Modal */}
      <Modal
        isOpen={showLateModal}
        onClose={() => setShowLateModal(false)}
        title="Declare Expected Late Arrival"
        subtitle="Informs gate security and hostel warden of your expected entry time"
      >
        <form onSubmit={handleLateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={lateDate}
                onChange={(e) => setLateDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Time *
              </label>
              <input
                type="time"
                required
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Late Return *
            </label>
            <input
              type="text"
              required
              value={lateReason}
              onChange={(e) => setLateReason(e.target.value)}
              placeholder="e.g. Lab experiment, Hackathon prep, Library study"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Declare Late Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
