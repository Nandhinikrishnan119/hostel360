import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { complaintService } from '../../services/complaintService';
import { StatCard } from '../../components/common/StatCard';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  DoorClosed,
  Wrench,
  Activity,
  TrendingUp,
  AlertTriangle,
  History,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [predictive, setPredictive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [sum, score, pred] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getHostelHealthScore(1),
          analyticsService.getPredictiveInsights(),
        ]);
        setSummary(sum);
        setHealthScore(score);
        setPredictive(pred);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const categoryChartData = summary?.complaintsByCategory
    ? Object.entries(summary.complaintsByCategory).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Electrical', value: 4 },
        { name: 'Plumbing', value: 3 },
        { name: 'Carpentry', value: 1 },
        { name: 'Wi-Fi', value: 2 },
      ];

  const hostelChartData = summary?.complaintsByHostel
    ? Object.entries(summary.complaintsByHostel).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Kaveri Boys Hostel', value: 8 },
        { name: 'Ganga Girls Hostel', value: 4 },
      ];

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/20">
              Hostel360 Central Command &amp; Executive Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Campus Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Cross-Hostel Real-Time Analytics • Predictive Failure Detection • Health Index
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/hostel-health"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              Explainable Health Score
            </Link>
            <Link
              to="/admin/predictive"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-pink-300" />
              Predictive Insights
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students Enrolled"
          value={summary?.totalStudents || 0}
          subtitle="Across all campus blocks"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Hostel Health Score"
          value={`${healthScore?.overallScore || 92} / 100`}
          subtitle={`Grade: ${healthScore?.ratingGrade || 'EXCELLENT'}`}
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Critical Overdue Tickets"
          value={summary?.overdueComplaints || 0}
          subtitle="Tier 1-3 escalated"
          icon={Wrench}
          color="rose"
        />
        <StatCard
          title="Recurring Defect Risks"
          value={predictive?.recurringIssues?.length || 0}
          subtitle="Asset overhaul recommended"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket Categories Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Complaints by Maintenance Category</h3>
            <span className="text-xs text-slate-400">All Campuses</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Hostel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Hostel Workload Breakdown</h3>
            <span className="text-xs text-slate-400">Ticket volume</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hostelChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {hostelChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Predictive Maintenance Snapshot */}
      {predictive?.recurringIssues && predictive.recurringIssues.length > 0 && (
        <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-amber-950">Intelligent Predictive Maintenance Alerts</h3>
            </div>
            <Link to="/admin/predictive" className="text-xs font-bold text-amber-800 hover:text-amber-950">
              View All Insights $\rightarrow$
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictive.recurringIssues.map((ri, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-amber-200/80">
                <span className="font-extrabold text-xs text-amber-900 block">
                  {ri.blockName} • Room {ri.roomNumber} ({ri.categoryName})
                </span>
                <p className="text-xs text-slate-700 mt-1">{ri.recommendation}</p>
                <span className="text-[10px] font-bold text-rose-600 mt-2 block">
                  {ri.complaintCount} repeat failures recorded
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
