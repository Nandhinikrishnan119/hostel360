import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { Megaphone, Plus, Bell, Calendar, Pin, AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const WardenAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    hostelId: 1,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await operationsService.getAnnouncements(1);
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await operationsService.createAnnouncement(form);
      setIsModalOpen(false);
      setForm({
        title: '',
        content: '',
        category: 'GENERAL',
        priority: 'NORMAL',
        hostelId: 1,
      });
      loadAnnouncements();
    } catch (err) {
      console.error('Failed to post announcement:', err);
      alert('Failed to post announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hostel Notice Board &amp; Urgent Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast official notices, water/power maintenance schedules, and hostel rules to all resident portals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Post Official Notice</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading notices...</div>
      ) : announcements.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No notices posted currently.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.priority === 'IMPORTANT' || item.priority === 'URGENT'
                  ? 'bg-amber-50/50 border-amber-200/80 shadow-sm'
                  : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.priority === 'IMPORTANT' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{item.createdAt || 'Today'}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mt-3 font-medium">
                {item.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Posted by: <strong>{item.authorName || 'Dr. Anandita Kumar (Warden)'}</strong></span>
                <span>Audience: <strong>Kaveri Girls Hostel Residents</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast New Notice to Residents"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Scheduled Maintenance for Solar Water Heating"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="GENERAL">General Notice</option>
                <option value="WATER_MAINTENANCE">Water / Electricity Maintenance</option>
                <option value="MESS">Mess &amp; Dining Update</option>
                <option value="RULES">Hostel Rules &amp; Curfew</option>
                <option value="HOLIDAY">Holiday / Vacation Schedule</option>
                <option value="INSPECTION">Room Hygiene Inspection</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="IMPORTANT">Important (Highlighted in Yellow)</option>
                <option value="URGENT">Urgent (Immediate Banner Alert)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Content</label>
            <textarea
              rows="4"
              required
              placeholder="Write the full announcement text here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
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
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
