import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { messService } from '../../services/messService';
import { leaveService } from '../../services/leaveService';
import { operationsService } from '../../services/operationsService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Utensils,
  PlaneTakeoff,
  Package,
  HeartPulse,
  Lightbulb,
  DoorClosed,
  Megaphone,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [todayMenu, setTodayMenu] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [myParcels, setMyParcels] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [complaintsData, menuData, leavesData, parcelsData, noticesData] = await Promise.all([
          complaintService.getMyComplaints(),
          messService.getTodayMenu(user?.hostelId || 1),
          leaveService.getMyLeaves(),
          operationsService.getMyParcels(),
          operationsService.getAnnouncements(user?.hostelId),
        ]);

        setComplaints(complaintsData);
        setTodayMenu(menuData);
        setMyLeaves(leavesData);
        setMyParcels(parcelsData);
        setAnnouncements(noticesData);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const activeComplaints = complaints.filter(
    (c) => c.status !== 'STUDENT_CONFIRMED' && c.status !== 'CLOSED'
  );
  const pendingParcels = myParcels.filter((p) => p.status === 'ARRIVED');
  const activeLeave = myLeaves.find((l) => l.status === 'APPROVED_WARDEN' || l.status === 'CHECKED_OUT');

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Digital Hostel Profile Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.fullName || 'Student'} 👋
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1">
              Roll No: <span className="font-bold text-white">{user?.studentId || '23CS101'}</span> • {user?.departmentName || 'Computer Science'} • Year {user?.yearOfStudy || '3'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="p-3 bg-white/10 rounded-xl">
              <DoorClosed className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider">Allocated Room</p>
              <h3 className="text-xl font-extrabold text-white">
                {user?.roomNumber || 'B-204'} <span className="text-xs font-semibold text-indigo-300">({user?.bedLabel ? `Bed ${user.bedLabel}` : 'Bed A'})</span>
              </h3>
              <p className="text-[11px] text-indigo-200">{user?.hostelName || 'Kaveri Boys Hostel'} • {user?.blockName || 'Block B'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Report Ticket', to: '/student/complaints', icon: Wrench, color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:border-indigo-300' },
          { label: 'Mess Menu', to: '/student/mess', icon: Utensils, color: 'text-orange-600 bg-orange-50 border-orange-100 hover:border-orange-300' },
          { label: 'Apply Leave', to: '/student/leave', icon: PlaneTakeoff, color: 'text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300' },
          { label: 'Late Entry', to: '/student/leave', icon: Clock, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300' },
          { label: 'Health Report', to: '/student/health', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
          { label: 'Parcel Desk', to: '/student/parcels', icon: Package, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300' },
          { label: 'Suggestions', to: '/student/suggestions', icon: Lightbulb, color: 'text-teal-600 bg-teal-50 border-teal-100 hover:border-teal-300' },
          { label: 'Notices', to: '/student/announcements', icon: Megaphone, color: 'text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.to}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all hover:shadow-soft group ${action.color}`}
            >
              <Icon className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Complaints"
          value={activeComplaints.length}
          subtitle="SLA tracking active"
          icon={Wrench}
          color="indigo"
        />
        <StatCard
          title="Pending Parcels"
          value={pendingParcels.length}
          subtitle={pendingParcels.length > 0 ? 'OTP available for pickup' : 'No parcels waiting'}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Active Gate Pass"
          value={activeLeave ? 'Approved' : 'None'}
          subtitle={activeLeave ? `${activeLeave.startDate} to ${activeLeave.endDate}` : 'Campus Resident'}
          icon={PlaneTakeoff}
          color="emerald"
        />
        <StatCard
          title="Notices"
          value={announcements.length}
          subtitle="Hostel announcements"
          icon={Megaphone}
          color="purple"
        />
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Complaints & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaints Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Open Complaints &amp; SLA Status</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tickets automatically escalate if SLA deadline expires</p>
              </div>
              <Link
                to="/student/complaints"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No complaints submitted. Everything is in order!
              </div>
            ) : (
              <div className="space-y-3.5">
                {complaints.slice(0, 3).map((cmp) => (
                  <div
                    key={cmp.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">#{cmp.complaintNumber}</span>
                        <PriorityBadge priority={cmp.priority} />
                        <StatusBadge status={cmp.status} />
                        {cmp.isOverdue && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                            ⚠️ SLA Breached (Tier {cmp.escalationLevel})
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800">{cmp.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Category: <span className="font-semibold">{cmp.categoryName}</span> • Assignee: <span className="font-semibold">{cmp.assignedToName}</span>
                      </p>
                    </div>

                    <Link
                      to={`/student/complaints`}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-xl transition-all text-center"
                    >
                      Track Ticket
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements Banner */}
          {announcements.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/80 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-950">Hostel Notice Board</h3>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{announcements[0].title}</h4>
              <p className="text-xs text-slate-700 mt-1">{announcements[0].content}</p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Today's Mess Menu Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Today's Mess Menu</h3>
              </div>
              <Link to="/student/mess" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                Weekly
              </Link>
            </div>

            {todayMenu.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Menu not published for today.</p>
            ) : (
              <div className="space-y-3">
                {todayMenu.map((m) => (
                  <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                        {m.mealType}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {m.startTime || '12:30'} - {m.endTime || '14:30'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 leading-snug">{m.items}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                to="/student/mess"
                className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                🍱 Order 'Keep My Food' Pack
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
