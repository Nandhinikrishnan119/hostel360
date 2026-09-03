import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { leaveService } from '../../services/leaveService';
import { operationsService } from '../../services/operationsService';
import { studentService } from '../../services/studentService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  PlaneTakeoff,
  History,
  Package,
  AlertOctagon,
  Plus,
  CheckCircle2,
  Phone,
  Search,
} from 'lucide-react';

export const SecurityDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeLeaves, setActiveLeaves] = useState([]);
  const [lateEntries, setLateEntries] = useState([]);
  const [activeParcels, setActiveParcels] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parcel Register Modal
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [studentId, setStudentId] = useState('1');
  const [courierName, setCourierName] = useState('Amazon Logistics');
  const [trackingNumber, setTrackingNumber] = useState('AMZN-IN-88992211');
  const [parcelRemarks, setParcelRemarks] = useState('Gate 1 Shelf');

  // Parcel OTP Verify Modal
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Late Entry Arrival Modal
  const [selectedLateEntry, setSelectedLateEntry] = useState(null);
  const [lateRemarks, setLateRemarks] = useState('');
  const [showLateModal, setShowLateModal] = useState(false);

  const loadSecurityData = async () => {
    try {
      const [leaves, late, parcels, emerg] = await Promise.all([
        leaveService.getActiveApprovedLeavesForSecurity(),
        leaveService.getLateEntriesToday(),
        operationsService.getActiveParcels(),
        operationsService.getEmergencies(),
      ]);
      setActiveLeaves(leaves);
      setLateEntries(late);
      setActiveParcels(parcels);
      setEmergencies(emerg.filter((e) => e.status === 'ACTIVE'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleCheckout = async (id) => {
    try {
      await leaveService.recordCheckout(id);
      showToast('Student gate exit checked out successfully!', 'success');
      loadSecurityData();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleCheckin = async (id) => {
    try {
      await leaveService.recordCheckin(id);
      showToast('Student gate return checked in successfully!', 'success');
      loadSecurityData();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleParcelSubmit = async (e) => {
    e.preventDefault();
    try {
      const p = await operationsService.registerParcel({
        studentId: Number(studentId),
        courierName,
        trackingNumber,
        remarks: parcelRemarks,
      });
      showToast(`Parcel registered! OTP (${p.collectionOtp}) generated & notified to student.`, 'success');
      setShowParcelModal(false);
      loadSecurityData();
    } catch (err) {
      showToast('Failed to register parcel', 'error');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await operationsService.collectParcel(selectedParcel.id, otpInput);
      showToast('OTP verified! Parcel handed over to student.', 'success');
      setShowOtpModal(false);
      setOtpInput('');
      loadSecurityData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid OTP code', 'error');
    }
  };

  const handleLateArrivalSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.recordLateEntryArrival(selectedLateEntry.id, lateRemarks);
      showToast('Late arrival recorded with security timestamp!', 'success');
      setShowLateModal(false);
      setLateRemarks('');
      loadSecurityData();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              Campus Main Gate Security Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Gate 1 Security Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Live Gate Passes • Late Arrival Time Stamps • Parcel Desk OTP Check
            </p>
          </div>

          <button
            onClick={() => setShowParcelModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Inward New Parcel
          </button>
        </div>
      </div>

      {/* Emergency Active Alert */}
      {emergencies.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-600/20 flex items-center justify-between animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-7 h-7 flex-shrink-0 animate-spin" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">ACTIVE EMERGENCY BROADCAST</h3>
              <p className="text-xs text-red-100">{emergencies[0].category}: {emergencies[0].description}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white text-red-700 text-xs font-bold shadow">
            Urgent Response Required
          </span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Active Gate Passes"
          value={activeLeaves.length}
          subtitle="Approved by Hostel Warden"
          icon={PlaneTakeoff}
          color="indigo"
        />
        <StatCard
          title="Late Entries Expected"
          value={lateEntries.length}
          subtitle="Declared student late returns"
          icon={History}
          color="purple"
        />
        <StatCard
          title="Uncollected Parcels"
          value={activeParcels.length}
          subtitle="Awaiting student OTP pickup"
          icon={Package}
          color="amber"
        />
      </div>

      {/* 2-Column Tables: Gate Passes & Parcel Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Approved Gate Passes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Approved Gate Passes</h3>
              <p className="text-xs text-slate-500">Verify student ID and record gate exit/entry</p>
            </div>
            <span className="text-xs font-bold text-indigo-600">{activeLeaves.length} Passes</span>
          </div>

          {activeLeaves.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No active approved passes for today.</p>
          ) : (
            <div className="space-y-3">
              {activeLeaves.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">{l.student?.user?.fullName}</span>
                    <p className="text-[11px] text-slate-500">
                      Roll: {l.student?.studentId} • Room {l.student?.room?.roomNumber || 'B-204'}
                    </p>
                    <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                      {l.leaveType} Leave ({l.startDate} to {l.endDate})
                    </p>
                    <StatusBadge status={l.status} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {l.status === 'APPROVED_WARDEN' && (
                      <button
                        onClick={() => handleCheckout(l.id)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        Check Out Exit
                      </button>
                    )}
                    {l.status === 'CHECKED_OUT' && (
                      <button
                        onClick={() => handleCheckin(l.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        Check In Return
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parcel Inward Desk */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Parcel Pickup &amp; OTP Verification</h3>
              <p className="text-xs text-slate-500">Verify student's 6-digit OTP code before handover</p>
            </div>
            <span className="text-xs font-bold text-amber-600">{activeParcels.length} Parcels</span>
          </div>

          {activeParcels.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No parcels waiting at security desk.</p>
          ) : (
            <div className="space-y-3">
              {activeParcels.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">{p.student?.user?.fullName}</span>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                      Courier: {p.courierName} ({p.trackingNumber || 'No track #' })
                    </p>
                    <p className="text-[10px] text-slate-500">Shelf: {p.remarks || 'Gate 1'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedParcel(p);
                      setShowOtpModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Verify OTP
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Parcel Inward Modal */}
      <Modal
        isOpen={showParcelModal}
        onClose={() => setShowParcelModal(false)}
        title="📦 Register Inward Parcel at Security Desk"
        subtitle="Generates unique OTP and notifies student instantaneously"
      >
        <form onSubmit={handleParcelSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Resident Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="1">Aarav Sundar (23CS101 - Kaveri B-204)</option>
              <option value="2">Rohan Chawla (23CS102 - Kaveri B-204)</option>
              <option value="3">Kavya Nambiar (23IT205 - Ganga A-101)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Courier Partner *
            </label>
            <input
              type="text"
              required
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tracking / AWB Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shelf Location / Shelf Note
            </label>
            <input
              type="text"
              value={parcelRemarks}
              onChange={(e) => setParcelRemarks(e.target.value)}
              placeholder="e.g. Gate 1 Shelf Unit B"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowParcelModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Log Parcel &amp; Dispatch OTP
            </button>
          </div>
        </form>
      </Modal>

      {/* OTP Verify Modal */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title={`Verify OTP for ${selectedParcel?.student?.user?.fullName}`}
        subtitle="Ask student for the 6-digit OTP visible on their Parcel Desk page"
      >
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter 6-Digit Collection OTP *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="e.g. 492815"
              className="w-full text-center text-2xl font-black font-mono tracking-widest rounded-2xl border border-slate-300 p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Verify OTP &amp; Release Parcel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
