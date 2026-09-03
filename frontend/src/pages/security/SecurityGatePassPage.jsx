import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { ShieldCheck, LogOut, LogIn, Search, Phone, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SecurityGatePassPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getApprovedLeavesForGate(1);
      setLeaves(data || []);
    } catch (err) {
      console.error('Failed to load leaves for gate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGateCheckout = async (leaveId) => {
    try {
      await leaveService.gateCheckout(leaveId);
      loadLeaves();
    } catch (err) {
      console.error('Failed to checkout leave:', err);
      alert('Failed to log student checkout.');
    }
  };

  const handleGateCheckin = async (leaveId) => {
    try {
      await leaveService.gateCheckin(leaveId);
      loadLeaves();
    } catch (err) {
      console.error('Failed to checkin leave:', err);
      alert('Failed to log student checkin.');
    }
  };

  const filteredLeaves = leaves.filter((l) =>
    l.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    l.studentRollNo?.toLowerCase().includes(search.toLowerCase()) ||
    l.roomNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Active Digital Out-Pass &amp; Gate Security Scanner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Warden-approved out-passes ready for physical gate movement verification.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roll number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading approved out-passes...</div>
      ) : filteredLeaves.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No active approved out-passes currently pending gate action.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeaves.map((l) => (
            <div
              key={l.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                    {l.leaveType} Pass
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{l.studentName}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Roll: {l.studentRollNo} • Room {l.roomNumber} ({l.blockName})
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2 text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{l.startDate} to {l.endDate}</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    ✓ Parent Consent Verified
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{l.destinationAddress}</span>
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  Reason: "{l.reason}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                {l.status === 'APPROVED_WARDEN' && (
                  <button
                    onClick={() => handleGateCheckout(l.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Gate Check-Out</span>
                  </button>
                )}

                {l.status === 'CHECKED_OUT' && (
                  <button
                    onClick={() => handleGateCheckin(l.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log Gate Check-In</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
