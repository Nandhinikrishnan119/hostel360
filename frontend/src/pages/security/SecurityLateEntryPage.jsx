import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { History, Clock, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SecurityLateEntryPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getLateEntries(1);
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to load late entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordArrival = async (id) => {
    try {
      await leaveService.recordActualLateEntry(id, 'Student arrived safely at main gate.');
      loadEntries();
    } catch (err) {
      console.error('Failed to record arrival:', err);
      alert('Failed to log actual entry time.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Late Night Entry Register &amp; Verification
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor resident student self-declarations for late arrivals and stamp gate entry timestamps.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Declared Late Arrivals for Today</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading late entry records...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No late entries recorded for today.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.studentName}</span>
                    <span className="text-xs font-mono text-indigo-600 font-semibold">{item.studentRollNo}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Room: <strong>{item.roomNumber || 'B-204'}</strong></span>
                    <span>Expected Time: <strong>{item.expectedTime}</strong></span>
                    <span>Reason: <em>"{item.reason}"</em></span>
                  </div>
                </div>

                {item.status === 'DECLARED' ? (
                  <button
                    onClick={() => handleRecordArrival(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 self-start md:self-center"
                  >
                    <Check className="w-4 h-4" />
                    <span>Stamp Gate In-Time</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 self-start md:self-center flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Entry Stamped ({item.actualEntryTime || 'Checked'})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
