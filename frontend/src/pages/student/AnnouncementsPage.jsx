import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../services/operationsService';
import { Megaphone, Calendar, Tag, AlertCircle } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await operationsService.getAnnouncements(user?.hostelId);
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load notices', err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hostel Notice Board</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official campus and hostel announcements, water maintenance, and inspection notices
        </p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-400">
            No active announcements at this time.
          </div>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {a.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.priority === 'URGENT'
                        ? 'bg-red-100 text-red-700'
                        : a.priority === 'IMPORTANT'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {a.priority}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Posted on {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{a.content}</p>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Author: <strong className="text-slate-700">{a.author?.fullName || 'Hostel Warden'}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
