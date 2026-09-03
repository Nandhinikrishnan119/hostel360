import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { messService } from '../../services/messService';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { UtensilsCrossed, Package, Star, AlertTriangle, CheckCircle2, Clock, Plus } from 'lucide-react';

export const MessManagerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [reservations, setReservations] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Pack Modal
  const [selectedResv, setSelectedResv] = useState(null);
  const [packStatus, setPackStatus] = useState('PACKED');
  const [packNotes, setPackNotes] = useState('Box #14 labeled in Hot-case A');
  const [showPackModal, setShowPackModal] = useState(false);

  // Menu CRUD Modal
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuDay, setMenuDay] = useState('MONDAY');
  const [menuMeal, setMenuMeal] = useState('LUNCH');
  const [menuTitle, setMenuTitle] = useState('Special Veg/Non-Veg Thali');
  const [menuItems, setMenuItems] = useState('Steamed Rice, Paneer Butter Masala / Chicken Curry, Dal, Phulka, Curd, Gulab Jamun');
  const [specialDiet, setSpecialDiet] = useState('Jain options available');

  const loadData = async () => {
    try {
      const [resvData, compData] = await Promise.all([
        messService.getHostelReservations(user?.hostelId || 1),
        messService.getHostelFoodComplaints(user?.hostelId || 1),
      ]);
      setReservations(resvData);
      setComplaints(compData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdatePackStatus = async (e) => {
    e.preventDefault();
    try {
      await messService.updateReservationStatus(selectedResv.id, packStatus, packNotes);
      showToast('Keep-My-Food order status updated!', 'success');
      setShowPackModal(false);
      loadData();
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      await messService.saveMenuItem({
        hostelId: user?.hostelId || 1,
        dayOfWeek: menuDay,
        mealType: menuMeal,
        menuTitle,
        items: menuItems,
        specialDietOptions: specialDiet,
      });
      showToast(`Menu updated for ${menuDay} ${menuMeal}!`, 'success');
      setShowMenuModal(false);
    } catch (err) {
      showToast('Menu update failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-orange-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-400/20">
              Hostel Mess &amp; Catering Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              {user?.fullName || 'Mess Manager'}
            </h1>
            <p className="text-xs sm:text-sm text-orange-200 mt-1">
              {user?.assignedHostelName || 'Kaveri Boys Hostel'} • Meal Prep &amp; Keep-My-Food Dispatch
            </p>
          </div>

          <button
            onClick={() => setShowMenuModal(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Edit Meal Menu
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Keep-My-Food Orders Today"
          value={reservations.length}
          subtitle="Late return packed meals"
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Food Quality Issues"
          value={complaints.length}
          subtitle="Reported student tickets"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Average Rating"
          value="4.4 ★"
          subtitle="Across 350 student reviews"
          icon={Star}
          color="emerald"
        />
      </div>

      {/* 2-Column Section: Keep-My-Food Orders & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keep My Food Packing Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Keep-My-Food Packing Orders</h3>
              <p className="text-xs text-slate-500">Pack meals into hot-cases with student labels</p>
            </div>
            <span className="text-xs font-bold text-orange-600">{reservations.length} Orders</span>
          </div>

          {reservations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No packed meal reservations for today.</p>
          ) : (
            <div className="space-y-3">
              {reservations.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{r.student?.user?.fullName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                        {r.mealType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Expected: <strong>{r.expectedArrivalTime}</strong> • Room: {r.student?.room?.roomNumber || 'B-204'}
                    </p>
                    <p className="text-[10px] text-slate-500">Reason: {r.reason}</p>
                    {r.packingNotes && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">🍱 {r.packingNotes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedResv(r);
                      setShowPackModal(true);
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Pack / Dispatch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Food Quality Complaints Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Food Quality Grievances</h3>
              <p className="text-xs text-slate-500">Student reports regarding temperature, taste, or hygiene</p>
            </div>
            <span className="text-xs font-bold text-red-600">{complaints.length} flagged</span>
          </div>

          {complaints.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No food complaints recorded.</p>
          ) : (
            <div className="space-y-3">
              {complaints.map((fc) => (
                <div key={fc.id} className="p-4 rounded-2xl bg-red-50/60 border border-red-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-950">{fc.issueType.replace('_', ' ')}</span>
                    <span className="text-[10px] text-slate-500">{fc.mealDate} ({fc.mealType})</span>
                  </div>
                  <p className="text-xs text-slate-700">{fc.description}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Reported by: {fc.student?.user?.fullName} (Room {fc.student?.room?.roomNumber || 'B-204'})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pack Order Modal */}
      <Modal
        isOpen={showPackModal}
        onClose={() => setShowPackModal(false)}
        title={`Update Pack Status for ${selectedResv?.student?.user?.fullName}`}
        subtitle={`Session: ${selectedResv?.mealType} • Expected: ${selectedResv?.expectedArrivalTime}`}
      >
        <form onSubmit={handleUpdatePackStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Order Status *
            </label>
            <select
              value={packStatus}
              onChange={(e) => setPackStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="APPROVED">APPROVED (Order received in kitchen)</option>
              <option value="PACKED">PACKED (Hot box ready on shelf)</option>
              <option value="COLLECTED">COLLECTED (Student picked up meal)</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Packing Location / Container Label *
            </label>
            <input
              type="text"
              required
              value={packNotes}
              onChange={(e) => setPackNotes(e.target.value)}
              placeholder="e.g. Box #14 in Hot-case Unit A (Counter 2)"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPackModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Save &amp; Notify Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Menu Edit Modal */}
      <Modal
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        title="Edit Weekly Mess Schedule"
        subtitle="Update daily meal items published on the student portal"
      >
        <form onSubmit={handleSaveMenu} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Day of Week *
              </label>
              <select
                value={menuDay}
                onChange={(e) => setMenuDay(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
              >
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Meal Session *
              </label>
              <select
                value={menuMeal}
                onChange={(e) => setMenuMeal(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
              >
                {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Menu Title *
            </label>
            <input
              type="text"
              required
              value={menuTitle}
              onChange={(e) => setMenuTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Menu Items Description *
            </label>
            <textarea
              required
              rows={3}
              value={menuItems}
              onChange={(e) => setMenuItems(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Special Diet / Vegetarian Options
            </label>
            <input
              type="text"
              value={specialDiet}
              onChange={(e) => setSpecialDiet(e.target.value)}
              placeholder="e.g. Jain options, Gluten-free rotis"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowMenuModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Publish Meal Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
