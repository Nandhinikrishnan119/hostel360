import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { healthService } from '../../services/healthService';
import { Modal } from '../../components/common/Modal';
import {
  HeartPulse,
  Plus,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const StudentHealthPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Report Modal
  const [showModal, setShowModal] = useState(false);
  const [illnessType, setIllnessType] = useState('Viral Fever / Flu');
  const [symptoms, setSymptoms] = useState('');
  const [hospitalVisit, setHospitalVisit] = useState(false);
  const [hospitalName, setHospitalName] = useState('Campus Health Center');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [recoveryDate, setRecoveryDate] = useState('');

  const loadHealthRecords = async () => {
    try {
      const data = await healthService.getMyHealthRecords();
      setHealthRecords(data);
    } catch (err) {
      console.error('Failed to load health records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await healthService.reportHealth({
        illnessType,
        symptoms,
        reportedDate: new Date().toISOString().split('T')[0],
        hospitalVisit,
        hospitalName: hospitalVisit ? hospitalName : null,
        doctorNotes,
        expectedRecoveryDate: recoveryDate || null,
      });
      showToast('Health update reported to Hostel Warden. Get well soon!', 'success');
      setShowModal(false);
      setSymptoms('');
      setDoctorNotes('');
      loadHealthRecords();
    } catch (err) {
      showToast('Failed to report health record', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Health &amp; Welfare Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voluntary medical status updates, sick meal coordination, and confidential warden wellness checks
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <HeartPulse className="w-4 h-4" />
          Report Unwell Condition
        </button>
      </div>

      {/* Confidentiality Alert Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900">
          <span className="font-bold">Confidential Health Privacy:</span>
          <p className="mt-0.5 text-emerald-800">
            Medical information is strictly restricted. Only you and authorized hostel welfare wardens have access. It is never exposed to other students or maintenance teams.
          </p>
        </div>
      </div>

      {/* Health History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900">Medical Reports &amp; Warden Follow-Ups</h3>

        {healthRecords.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            No medical records reported. Stay healthy!
          </p>
        ) : (
          <div className="space-y-4">
            {healthRecords.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{r.illnessType}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {r.status}
                    </span>
                    {r.hospitalVisit && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        🏥 Hospital Visit
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">Reported: {r.reportedDate}</span>
                </div>

                <p className="text-xs text-slate-700">Symptoms: {r.symptoms}</p>
                {r.doctorNotes && (
                  <p className="text-[11px] text-slate-600 font-medium">Doctor Notes: {r.doctorNotes}</p>
                )}
                {r.hospitalName && (
                  <p className="text-[11px] text-slate-500">Facility: {r.hospitalName}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="🏥 Report Unwell Condition"
        subtitle="Informs Hostel Warden to arrange sick diet, check-ins, or clinic transport if required."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Illness / Condition *
            </label>
            <input
              type="text"
              required
              value={illnessType}
              onChange={(e) => setIllnessType(e.target.value)}
              placeholder="e.g. Fever, Severe Migraine, Food Poisoning, Fracture"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Symptoms Details *
            </label>
            <textarea
              required
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe temperature, fatigue level, pain, when it began..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hospVisit"
              checked={hospitalVisit}
              onChange={(e) => setHospitalVisit(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="hospVisit" className="text-xs text-slate-700 font-semibold">
              Visited Hospital / Campus Health Center
            </label>
          </div>

          {hospitalVisit && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hospital / Clinic Name &amp; Doctor Advice
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. Campus Health Center, Apollo Clinic"
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 mb-2"
              />
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Doctor's prescription or rest advice..."
                className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Welfare Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
