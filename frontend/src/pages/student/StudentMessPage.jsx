import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { messService } from '../../services/messService';
import { Modal } from '../../components/common/Modal';
import {
  UtensilsCrossed,
  Package,
  Star,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const StudentMessPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep My Food Modal
  const [showKeepFoodModal, setShowKeepFoodModal] = useState(false);
  const [mealType, setMealType] = useState('DINNER');
  const [expectedTime, setExpectedTime] = useState('21:30');
  const [reason, setReason] = useState('');

  // Rating Modal
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingMealType, setRatingMealType] = useState('LUNCH');
  const [stars, setStars] = useState(5);
  const [comments, setComments] = useState('');

  // Food Complaint Modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintMealType, setComplaintMealType] = useState('DINNER');
  const [issueType, setIssueType] = useState('COLD');
  const [complaintDesc, setComplaintDesc] = useState('');

  const loadMessData = async () => {
    try {
      const [menuData, resvData] = await Promise.all([
        messService.getWeeklyMenu(user?.hostelId || 1),
        messService.getMyReservations(),
      ]);
      setWeeklyMenu(menuData);
      setReservations(resvData);
    } catch (err) {
      console.error('Failed to load mess data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessData();
  }, [user]);

  const handleKeepFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      await messService.createReservation({
        mealDate: new Date().toISOString().split('T')[0],
        mealType,
        expectedArrivalTime: expectedTime + ':00',
        reason,
      });
      showToast('Keep-My-Food box reservation submitted to mess supervisor!', 'success');
      setShowKeepFoodModal(false);
      setReason('');
      loadMessData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit reservation', 'error');
    }
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await messService.rateMeal({
        mealDate: new Date().toISOString().split('T')[0],
        mealType: ratingMealType,
        rating: stars,
        comments,
      });
      showToast('Thank you! Your meal rating has been logged.', 'success');
      setShowRateModal(false);
      setComments('');
    } catch (err) {
      showToast('Failed to submit rating', 'error');
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await messService.reportFoodComplaint({
        mealDate: new Date().toISOString().split('T')[0],
        mealType: complaintMealType,
        issueType,
        description: complaintDesc,
      });
      showToast('Food quality issue flagged to Mess Head & Warden.', 'success');
      setShowComplaintModal(false);
      setComplaintDesc('');
    } catch (err) {
      showToast('Failed to report issue', 'error');
    }
  };

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const [activeDay, setActiveDay] = useState(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  });

  const currentDayMeals = weeklyMenu.filter((m) => m.dayOfWeek === activeDay);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mess Menu &amp; Food Services</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly dining schedule, packed meal reservations, and food feedback
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowKeepFoodModal(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Order 'Keep My Food' Pack
          </button>
          <button
            onClick={() => setShowRateModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Rate Meal
          </button>
          <button
            onClick={() => setShowComplaintModal(true)}
            className="px-3.5 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Food Issue
          </button>
        </div>
      </div>

      {/* Active Keep My Food Reservations */}
      {reservations.length > 0 && (
        <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-slate-900 rounded-3xl p-6 text-white border border-orange-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Keep-My-Food Reservations
            </span>
            <span className="text-[10px] text-slate-400">Collect packed hot-boxes from Mess Counter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.slice(0, 3).map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-400">{r.mealType} ({r.mealDate})</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Expected: <strong>{r.expectedArrivalTime}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-1 truncate">Reason: {r.reason}</p>
                {r.packingNotes && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-2 pt-2 border-t border-slate-800">
                    🍱 {r.packingNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Schedule Days Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {daysOfWeek.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeDay === d
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Meals Grid for Active Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map((mType) => {
          const meal = currentDayMeals.find((m) => m.mealType === mType);
          return (
            <div key={mType} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {mType}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {meal?.startTime || '07:30'} - {meal?.endTime || '09:30'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">{meal?.menuTitle || 'Special Buffet'}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {meal?.items || 'Fresh daily meal prepared as per nutrition standard.'}
                </p>
              </div>

              {meal?.specialDietOptions && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
                  🌱 Special Diet: {meal.specialDietOptions}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Keep Food Modal */}
      <Modal
        isOpen={showKeepFoodModal}
        onClose={() => setShowKeepFoodModal(false)}
        title="🍱 Request 'Keep My Food' Packed Meal"
        subtitle="Mess staff will pack your meal in an insulated hot box labeled with your name and roll number."
      >
        <form onSubmit={handleKeepFoodSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meal Session *
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-orange-500 font-bold"
            >
              <option value="DINNER">Dinner (Packed at 8:30 PM)</option>
              <option value="LUNCH">Lunch (Packed at 1:30 PM)</option>
              <option value="BREAKFAST">Breakfast (Packed at 8:30 AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expected Collection Time *
            </label>
            <input
              type="time"
              required
              value={expectedTime}
              onChange={(e) => setExpectedTime(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-orange-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Late Collection *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Lab experiment, Sports training, Placement preparation"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowKeepFoodModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Confirm Pack Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Rate Meal Modal */}
      <Modal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        title="⭐ Rate Today's Meal"
        subtitle="Your feedback helps improve food quality and menu curation"
      >
        <form onSubmit={handleRateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meal Session *
            </label>
            <select
              value={ratingMealType}
              onChange={(e) => setRatingMealType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="SNACKS">Evening Snacks</option>
              <option value="DINNER">Dinner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rating Stars (1 to 5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setStars(num)}
                  className={`p-3 rounded-xl border text-base font-bold transition-all ${
                    stars >= num
                      ? 'bg-amber-50 border-amber-300 text-amber-600 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  ★ {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Taste was great, Rotis were soft, Paneer quantity was good..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </Modal>

      {/* Food Complaint Modal */}
      <Modal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        title="⚠️ Report Food Quality / Hygiene Issue"
        subtitle="This report is directly reviewed by the Mess Supervisor and Hostel Warden"
      >
        <form onSubmit={handleComplaintSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Category *
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="COLD">Food Served Cold</option>
              <option value="UNDERCOOKED">Undercooked / Raw</option>
              <option value="POOR_QUALITY">Poor Quality Ingredients</option>
              <option value="HYGIENE">Hygiene / Sanitation Problem</option>
              <option value="INSUFFICIENT">Insufficient Quantity</option>
              <option value="LATE">Meal Served Late</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Please describe specifically what was wrong with the meal..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowComplaintModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Flag Issue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
