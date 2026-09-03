import React, { useState, useEffect } from 'react';
import { messService } from '../../services/messService';
import { Utensils, Clock, Plus, Edit2, Check, Sparkles } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const MenuManagementPage = () => {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    hostelId: 1,
    dayOfWeek: 'MONDAY',
    mealType: 'BREAKFAST',
    menuTitle: '',
    items: '',
    startTime: '07:30',
    endTime: '09:30',
    specialDietOptions: '',
  });

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await messService.getWeeklyMenu(1);
      setWeeklyMenu(data || []);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditForm({
      hostelId: 1,
      dayOfWeek: item.dayOfWeek,
      mealType: item.mealType,
      menuTitle: item.menuTitle || '',
      items: item.items || '',
      startTime: item.startTime || '07:30',
      endTime: item.endTime || '09:30',
      specialDietOptions: item.specialDietOptions || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      await messService.saveMenuItem(editForm);
      setIsModalOpen(false);
      loadMenu();
    } catch (err) {
      console.error('Failed to save menu item:', err);
      alert('Failed to save menu changes.');
    }
  };

  const filteredMeals = weeklyMenu.filter((m) => m.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Weekly Dining Menu Schedule Editor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure meal courses, nutritional items, and meal timings for Kaveri Girls Hostel.
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              selectedDay === d
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Meals Grid for Selected Day */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading daily menus...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No meals recorded for {selectedDay}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 uppercase">
                      {meal.mealType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{meal.menuTitle}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(meal)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {meal.items}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{meal.startTime || '07:30'} – {meal.endTime || '09:30'}</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Published &amp; Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${editForm.dayOfWeek} ${editForm.mealType} Menu`}
      >
        <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Meal Title</label>
            <input
              type="text"
              required
              placeholder="e.g. South Indian Special Breakfast"
              value={editForm.menuTitle}
              onChange={(e) => setEditForm({ ...editForm, menuTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Food Items (Comma separated)</label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Idli, Vada, Sambar, Coconut Chutney, Tea, Coffee"
              value={editForm.items}
              onChange={(e) => setEditForm({ ...editForm, items: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Serving Time</label>
              <input
                type="text"
                placeholder="07:30"
                value={editForm.startTime}
                onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Serving Time</label>
              <input
                type="text"
                placeholder="09:30"
                value={editForm.endTime}
                onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              Update Dining Menu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
