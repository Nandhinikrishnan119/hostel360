import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services/leaveService';
import { History, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const LateEntryMonitorPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLateEntries = async () => {
      try {
        const data = await leaveService.getLateEntriesToday(user?.hostelId);
        setEntries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLateEntries();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Late Entry Monitor</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Declared late student returns for today and security gate arrival timestamps
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student &amp; Room</th>
                <th className="px-6 py-4">Declared Reason</th>
                <th className="px-6 py-4">Expected Arrival</th>
                <th className="px-6 py-4">Actual Gate Entry</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No students expected to return late today.
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">{e.student?.user?.fullName}</span>
                      <span className="text-[11px] text-slate-500">
                        Roll: {e.student?.studentId} • Room {e.student?.room?.roomNumber || 'B-204'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">{e.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-900">{e.expectedTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      {e.actualEntryTime ? (
                        <span className="font-mono font-bold text-emerald-700">
                          {new Date(e.actualEntryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Pending Gate Scan</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        e.status === 'ARRIVED_ON_TIME' ? 'bg-emerald-100 text-emerald-800' :
                        e.status === 'ARRIVED_LATE' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
