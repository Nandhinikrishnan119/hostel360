import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { Package, Search, Plus, KeyRound, Check, Clock, User, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const SecurityParcelsPage = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');

  const [logForm, setLogForm] = useState({
    studentId: '1',
    courierName: 'Amazon Prime',
    trackingNumber: '',
    remarks: 'Main Gate Parcel Desk Shelf A',
  });

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    try {
      setLoading(true);
      const data = await operationsService.getAllParcels();
      setParcels(data || []);
    } catch (err) {
      console.error('Failed to load parcels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogParcel = async (e) => {
    e.preventDefault();
    try {
      await operationsService.logParcelInward({
        ...logForm,
        studentId: Number(logForm.studentId),
        trackingNumber: logForm.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      setIsLogModalOpen(false);
      setLogForm({
        studentId: '1',
        courierName: 'Amazon Prime',
        trackingNumber: '',
        remarks: 'Main Gate Parcel Desk Shelf A',
      });
      loadParcels();
    } catch (err) {
      console.error('Failed to log parcel:', err);
      alert('Failed to log parcel arrival.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!selectedParcel) return;
    try {
      await operationsService.verifyParcelOtp(selectedParcel.id, enteredOtp);
      setIsVerifyModalOpen(false);
      setSelectedParcel(null);
      setEnteredOtp('');
      loadParcels();
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      alert('Invalid OTP. Please ask the resident to check their Hostel360 mobile app.');
    }
  };

  const openVerifyModal = (p) => {
    setSelectedParcel(p);
    setEnteredOtp('');
    setIsVerifyModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security Parcel Inward &amp; OTP Hand-Over Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log couriers from Amazon, Flipkart, BlueDart, and verify 6-digit OTPs before handing over packages.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Parcel Arrival</span>
        </button>
      </div>

      {/* Parcels Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Courier &amp; Tracking</th>
                <th className="px-5 py-3.5">Resident</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Shelf Location</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Hand-Over Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                    Loading parcel records...
                  </td>
                </tr>
              ) : parcels.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                    No parcels currently at the security counter.
                  </td>
                </tr>
              ) : (
                parcels.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{p.courierName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{p.trackingNumber}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{p.studentName}</div>
                      <div className="text-[11px] text-slate-500">{p.studentRollNo}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {p.roomNumber || 'B-204'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {p.remarks || 'Shelf B'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'COLLECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status === 'ARRIVED' ? 'Awaiting OTP' : 'COLLECTED'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status === 'ARRIVED' ? (
                        <button
                          onClick={() => openVerifyModal(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm ml-auto"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Verify OTP &amp; Deliver</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                          <Check className="w-4 h-4" /> Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inward Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Inward Courier Package"
      >
        <form onSubmit={handleLogParcel} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resident Student</label>
            <select
              value={logForm.studentId}
              onChange={(e) => setLogForm({ ...logForm, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <option value="1">Ananya Sundar (23CS101 - Room B-204)</option>
              <option value="2">Pooja Chawla (23CS102 - Room B-204)</option>
              <option value="3">Kavya Nambiar (23IT205 - Room A-101)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Courier Carrier</label>
              <select
                value={logForm.courierName}
                onChange={(e) => setLogForm({ ...logForm, courierName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="Amazon Prime">Amazon Prime</option>
                <option value="Flipkart Logistics">Flipkart Logistics</option>
                <option value="BlueDart Express">BlueDart Express</option>
                <option value="DTDC Courier">DTDC Courier</option>
                <option value="India Post EMS">India Post EMS</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. AMZN-88992211"
                value={logForm.trackingNumber}
                onChange={(e) => setLogForm({ ...logForm, trackingNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Shelf / Storage Unit</label>
            <input
              type="text"
              required
              value={logForm.remarks}
              onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              Generate OTP &amp; Log Parcel
            </button>
          </div>
        </form>
      </Modal>

      {/* OTP Verify Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify In-App 6-Digit Collection OTP"
      >
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900">
            <p className="font-bold">{selectedParcel?.courierName} ({selectedParcel?.trackingNumber})</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Resident: <strong>{selectedParcel?.studentName}</strong> (Roll: {selectedParcel?.studentRollNo})
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Enter 6-Digit Collection OTP shown on Student's Phone
            </label>
            <input
              type="text"
              maxLength="6"
              required
              placeholder="e.g. 492815"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsVerifyModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20"
            >
              Verify &amp; Hand Over Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
