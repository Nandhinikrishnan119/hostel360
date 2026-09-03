import React, { useState, useEffect } from 'react';
import { messService } from '../../services/messService';
import { Package, Clock, CheckCircle2, AlertCircle, User, Check, Box } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const KeepFoodOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [packingNotes, setPackingNotes] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await messService.getKeepFoodReservations(1, statusFilter || undefined);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load food reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPackModal = (order) => {
    setSelectedOrder(order);
    setPackingNotes(`Box #${Math.floor(10 + Math.random() * 90)} labeled in Hot-case Unit A (Shelf 2)`);
    setIsPackModalOpen(true);
  };

  const handleConfirmPacked = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await messService.updateReservationStatus(selectedOrder.id, 'PACKED', packingNotes);
      setIsPackModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      console.error('Failed to update packing status:', err);
      alert('Failed to update packed order status.');
    }
  };

  const handleMarkCollected = async (orderId) => {
    try {
      await messService.updateReservationStatus(orderId, 'COLLECTED', 'Collected by student from counter');
      loadOrders();
    } catch (err) {
      console.error('Failed to mark collected:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Keep-My-Food Packed Box Dispatch Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage hot meal reservations for late-returning students and track insulated container locations.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
        >
          <option value="">All Orders</option>
          <option value="RESERVED">Pending Packing (RESERVED)</option>
          <option value="PACKED">Ready in Hot-Case (PACKED)</option>
          <option value="COLLECTED">Collected by Resident</option>
        </select>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading food orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No Keep-My-Food requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                    {ord.mealType}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{ord.studentName || 'Resident Student'}</h3>
                  <p className="text-xs text-slate-500 font-mono">{ord.studentRollNo} (Room {ord.roomNumber || 'B-204'})</p>
                </div>
                <StatusBadge status={ord.status} />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expected Arrival: <strong>{ord.expectedArrivalTime}</strong></span>
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  "{ord.reason}"
                </div>
                {ord.packingNotes && (
                  <div className="pt-2 border-t border-slate-200/80 font-medium text-emerald-700 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    <span>{ord.packingNotes}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                {ord.status === 'RESERVED' && (
                  <button
                    onClick={() => handleOpenPackModal(ord)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Pack &amp; Assign Shelf Slot</span>
                  </button>
                )}
                {ord.status === 'PACKED' && (
                  <button
                    onClick={() => handleMarkCollected(ord.id)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Handed Over / Collected</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pack Modal */}
      <Modal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        title="Pack Hot Meal &amp; Assign Shelf Unit"
      >
        <form onSubmit={handleConfirmPacked} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hot-Case Storage Unit / Box Label
            </label>
            <input
              type="text"
              required
              value={packingNotes}
              onChange={(e) => setPackingNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The student will receive an instant in-app notification with this hot-box shelf location.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPackModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              Confirm Packed &amp; Alert Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
