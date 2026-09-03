import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { complaintService } from '../../services/complaintService';
import { leaveService } from '../../services/leaveService';
import { healthService } from '../../services/healthService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Users,
  Grid3X3,
  FileCheck,
  HeartPulse,
  History,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const WardenDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [unwellStudents, setUnwellStudents] = useState([]);
  const [overdueComplaints, setOverdueComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWardenData = async () => {
      setLoading(true);
      try {
        const sum = await analyticsService.getDashboardSummary().catch(() => null);
        const leaves = await leaveService.getPendingLeaves(user?.hostelId || 1).catch(() => []);
        const welfare = await healthService.getActiveWelfareCases(user?.hostelId || 1).catch(() => []);
        const complaintsRes = await complaintService.filterComplaints({ size: 5, status: 'ESCALATED' }).catch(() => ({ content: [] }));

        if (sum) setSummary(sum);
        if (leaves) setPendingLeaves(leaves);
        if (welfare) setUnwellStudents(welfare.filter((w) => w.status !== 'RECOVERED'));
        if (complaintsRes?.content) setOverdueComplaints(complaintsRes.content);
      } catch (err) {
        console.error('Failed to load warden dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWardenData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
              Hostel Warden Administration Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              {user?.fullName || 'Dr. Anandita Kumar (Senior Warden)'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Assigned: <strong className="text-white">{user?.assignedHostelName || 'Kaveri Girls Hostel'}</strong> • Live Operations
            </p>
          </div>

          <div className="flex gap-2.5">
            <Link
              to="/warden/occupancy"
              className="px-4 py-2.5 bg-white text-blue-950 hover:bg-blue-50 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Grid3X3 className="w-4 h-4" />
              Occupancy Visualizer
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Leave Approvals"
          value={pendingLeaves.length}
          subtitle="Awaiting warden review"
          icon={FileCheck}
          color="amber"
        />
        <StatCard
          title="Active Medical Cases"
          value={unwellStudents.length}
          subtitle="Welfare follow-ups due"
          icon={HeartPulse}
          color="rose"
        />
        <StatCard
          title="Escalated / Overdue Tickets"
          value={summary?.overdueComplaints || overdueComplaints.length || 0}
          subtitle="Tier 1 &amp; Tier 2 SLA breaches"
          icon={Wrench}
          color="indigo"
        />
        <StatCard
          title="Late Entries Expected Today"
          value={summary?.lateEntriesToday || 0}
          subtitle="Gate security tracking"
          icon={History}
          color="purple"
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Leaves Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Leave Approvals</h3>
              <p className="text-xs text-slate-500">Parent consent status &amp; destination</p>
            </div>
            <Link to="/warden/leaves" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Review Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingLeaves.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No pending leave requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.slice(0, 4).map((l) => (
                <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{l.studentName || l.student?.user?.fullName} ({l.studentRollNo || l.student?.studentId})</h4>
                    <p className="text-[11px] text-slate-500">
                      {l.leaveType} • {l.startDate} to {l.endDate}
                    </p>
                    <p className="text-[10px] text-slate-400">Parent Consent: {l.parentConsentVerified ? '✓ Verified' : 'Pending Verification'}</p>
                  </div>
                  <Link
                    to="/warden/leaves"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Action
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Welfare & Health Attention Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Welfare &amp; Sick List</h3>
              <p className="text-xs text-slate-500">Residents currently unwell or visiting hospital</p>
            </div>
            <Link to="/warden/welfare" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Log Visit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {unwellStudents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">All hostel residents currently in good health.</p>
          ) : (
            <div className="space-y-3">
              {unwellStudents.slice(0, 4).map((w) => (
                <div key={w.id} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{w.studentName || w.student?.user?.fullName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {w.illnessType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Room: <strong>{w.roomNumber || w.student?.room?.roomNumber || 'B-204'}</strong> • Follow-up: {w.nextFollowUpDate || 'Today'}
                    </p>
                  </div>
                  <Link
                    to="/warden/welfare"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Follow Up
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
