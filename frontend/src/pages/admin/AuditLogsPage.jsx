import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { History, ShieldCheck, Lock, UserCheck } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await analyticsService.getAuditLogs(0, 50);
        setLogs(data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security &amp; Operations Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable logging of system escalations, gate checkpoints, welfare check-ins, and user actions
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">Entity &amp; ID</th>
                <th className="px-6 py-4">User / Performer</th>
                <th className="px-6 py-4">Details &amp; Audit Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-sans text-xs">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {l.entityName} #{l.entityId}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {l.performedBy || 'System Engine'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-sans text-xs max-w-md truncate">
                      {l.details}
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
