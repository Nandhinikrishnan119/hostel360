import React, { useState } from 'react';
import { Modal } from './Modal';
import { AlertOctagon, Flame, Zap, ShieldAlert, HeartPulse, HelpCircle } from 'lucide-react';
import { operationsService } from '../../services/operationsService';
import { useNotifications } from '../../context/NotificationContext';

export const EmergencyModal = ({ isOpen, onClose }) => {
  const { showToast } = useNotifications();
  const [category, setCategory] = useState('MEDICAL');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'MEDICAL', label: 'Medical Emergency', icon: HeartPulse, color: 'text-red-600 bg-red-50 border-red-200' },
    { id: 'FIRE', label: 'Fire Hazard', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'ELECTRICAL_HAZARD', label: 'Electrical Danger', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'SECURITY', label: 'Security & Safety', icon: ShieldAlert, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'OTHER', label: 'Other Urgent', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide brief emergency details', 'error');
      return;
    }

    setLoading(true);
    try {
      await operationsService.triggerEmergency({
        category,
        description,
      });
      showToast('🚨 Emergency alert dispatched to Wardens & Security personnel!', 'success');
      setDescription('');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to dispatch alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 Trigger Red Emergency Broadcast"
      subtitle="This alert is immediately broadcasted to all active wardens and campus security officers."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Emergency Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50/80 text-red-800 ring-2 ring-red-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Location &amp; Situation Details *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the immediate danger, exact location (Block, Floor, Room number), and required assistance..."
            className="w-full text-xs rounded-2xl border border-slate-200 p-3.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <AlertOctagon className="w-4 h-4" />
            {loading ? 'Broadcasting Alert...' : 'Broadcast Emergency Now'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
