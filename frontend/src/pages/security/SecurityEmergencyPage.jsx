import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { ShieldAlert, AlertCircle, CheckCircle2, Phone, MapPin, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SecurityEmergencyPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const data = await operationsService.getActiveEmergencies();
      setEmergencies(data || []);
    } catch (err) {
      console.error('Failed to load emergency reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveEmergency = async (id) => {
    try {
      await operationsService.resolveEmergency(id, 'Security response team dispatched to room and situation secured.');
      loadEmergencies();
    } catch (err) {
      console.error('Failed to resolve emergency:', err);
      alert('Failed to update emergency status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <span>Hostel Red Alert &amp; Emergency Incident Monitor</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-priority SOS alarms triggered from resident rooms requiring immediate security and warden dispatch.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Incident Stream</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Scanning emergency reports...</div>
        ) : emergencies.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No active red alert incidents! All hostel blocks are secure.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {emergencies.map((em) => (
              <div key={em.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rose-50/30">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider animate-pulse">
                      {em.type || 'RED ALERT'}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Room {em.roomNumber || 'B-204'} ({em.blockName || 'Block B'})
                    </span>
                    <StatusBadge status={em.status} />
                  </div>
                  <p className="text-xs font-semibold text-rose-950">"{em.description}"</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>Resident: {em.studentName} ({em.studentPhone})</span>
                    <span>Reported: {em.reportedAt}</span>
                  </div>
                </div>

                {em.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolveEmergency(em.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 self-start md:self-center"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Log Situation Resolved</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 self-start md:self-center">
                    ✓ Secured &amp; Resolved
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
