import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { healthService } from '../../services/healthService';
import { Modal } from '../../components/common/Modal';
import { HeartPulse, Plus, CheckCircle2, Phone, Building, ShieldAlert } from 'lucide-react';

export const WelfareFollowUpPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [condition, setCondition] = useState('FEELING_BETTER');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const loadWelfareRecords = async () => {
    try {
      const data = await healthService.getActiveWelfareCases(user?.hostelId);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWelfareRecords();
  }, [user]);

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    try {
      await healthService.recordFollowUp(selectedRecord.id, {
        followUpDate: new Date().toISOString().split('T')[0],
        studentCondition: condition,
        notes: followUpNotes,
      });
      showToast('Welfare follow-up check logged successfully!', 'success');
      setShowFollowUpModal(false);
      setFollowUpNotes('');
      loadWelfareRecords();
    } catch (err) {
      showToast('Failed to log check-in', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Welfare &amp; Health Follow-Ups</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Conduct wellness visits, log student recovery progress, and arrange mess sick diets
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student &amp; Room</th>
                <th className="px-6 py-4">Reported Illness</th>
                <th className="px-6 py-4">Symptoms &amp; Doctor Notes</th>
                <th className="px-6 py-4">Status &amp; Follow-up Due</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No active student medical cases.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">{r.student?.user?.fullName}</span>
                      <span className="text-[11px] text-slate-500">
                        Roll: {r.student?.studentId} • Room {r.student?.room?.roomNumber || 'B-204'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{r.illnessType}</span>
                      {r.hospitalVisit && (
                        <span className="text-[10px] font-bold text-blue-700 block">🏥 {r.hospitalName || 'Clinic Visit'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 block line-clamp-1">{r.symptoms}</span>
                      {r.doctorNotes && (
                        <span className="text-[10px] text-slate-500 truncate block">Rx: {r.doctorNotes}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 block w-fit">
                        {r.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block">
                        Follow-up: {r.nextFollowUpDate || 'Today'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecord(r);
                          setShowFollowUpModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition-all"
                      >
                        Log Check-in
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow Up Modal */}
      <Modal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        title={`Log Welfare Check-in for ${selectedRecord?.student?.user?.fullName}`}
        subtitle={`Room ${selectedRecord?.student?.room?.roomNumber || 'B-204'} • Condition: ${selectedRecord?.illnessType}`}
      >
        <form onSubmit={handleFollowUpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assessed Recovery Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="FEELING_BETTER">Feeling Better / Recovering</option>
              <option value="RECOVERED">Fully Recovered (Close Case)</option>
              <option value="STILL_UNWELL">Still Unwell (Maintain Sick Care)</option>
              <option value="NEEDS_FURTHER_SUPPORT">Requires Attention / Hospital Escalation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Warden Visit Notes &amp; Actions Taken *
            </label>
            <textarea
              required
              rows={3}
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              placeholder="e.g. Visited student in room B-204, arranged hot porridge and electrolyte drink from mess..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowFollowUpModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Save Follow-up Check
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
