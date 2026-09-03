import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  DoorClosed,
  Wrench,
  UtensilsCrossed,
  PlaneTakeoff,
  HeartPulse,
  Lightbulb,
  Package,
  Megaphone,
  Grid3X3,
  ShieldCheck,
  TrendingUp,
  History,
  FileCheck,
  Users,
  Activity,
  CreditCard,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const getNavLinks = () => {
    switch (role) {
      case 'ROLE_STUDENT':
        return [
          { to: '/student/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/student/room', label: 'My Room & Roommates', icon: DoorClosed },
          { to: '/student/complaints', label: 'Hostel Complaints', icon: Wrench },
          { to: '/student/mess', label: 'Mess & Keep My Food', icon: UtensilsCrossed },
          { to: '/student/leave', label: 'Leave & Late Entry', icon: PlaneTakeoff },
          { to: '/student/health', label: 'Health & Welfare', icon: HeartPulse },
          { to: '/student/payments', label: 'Fees & Receipts', icon: CreditCard },
          { to: '/student/suggestions', label: 'Ideas & Feedback', icon: Lightbulb },
          { to: '/student/parcels', label: 'Parcel Desk', icon: Package },
          { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
        ];

      case 'ROLE_WARDEN':
        return [
          { to: '/warden/dashboard', label: 'Warden Overview', icon: LayoutDashboard },
          { to: '/warden/occupancy', label: 'Room Occupancy Map', icon: Grid3X3 },
          { to: '/warden/complaints', label: 'Complaints & Escalation', icon: Wrench },
          { to: '/warden/leaves', label: 'Leave Approvals', icon: FileCheck },
          { to: '/warden/late-entries', label: 'Late Entry Monitor', icon: History },
          { to: '/warden/welfare', label: 'Student Welfare Checks', icon: HeartPulse },
          { to: '/warden/suggestions', label: 'Student Suggestions', icon: Lightbulb },
          { to: '/warden/announcements', label: 'Hostel Notices', icon: Megaphone },
        ];

      case 'ROLE_MAINTENANCE_STAFF':
        return [
          { to: '/maintenance/dashboard', label: 'Assigned Work Orders', icon: LayoutDashboard },
          { to: '/maintenance/work-orders', label: 'Active Repairs & SLAs', icon: Wrench },
        ];

      case 'ROLE_MESS_MANAGER':
        return [
          { to: '/mess/dashboard', label: 'Mess Dashboard', icon: LayoutDashboard },
          { to: '/mess/menu-management', label: 'Weekly Menu Schedule', icon: UtensilsCrossed },
          { to: '/mess/keep-food-orders', label: 'Keep-My-Food Orders', icon: Package },
          { to: '/mess/food-feedback', label: 'Food Quality Ratings', icon: TrendingUp },
        ];

      case 'ROLE_SECURITY_STAFF':
        return [
          { to: '/security/dashboard', label: 'Gate Security Desk', icon: ShieldCheck },
          { to: '/security/gate-pass', label: 'Active Gate Passes', icon: FileCheck },
          { to: '/security/late-entry', label: 'Late Entry Register', icon: History },
          { to: '/security/parcels', label: 'Parcel Inward Desk', icon: Package },
          { to: '/security/emergency', label: 'Emergency Alerts', icon: Activity },
        ];

      case 'ROLE_SUPER_ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
          { to: '/admin/payments', label: 'Hostel Fees & Payments', icon: CreditCard },
          { to: '/admin/hostel-health', label: 'Hostel Health Score', icon: Activity },
          { to: '/admin/predictive', label: 'Predictive Maintenance', icon: TrendingUp },
          { to: '/admin/occupancy', label: 'Room Occupancy Matrix', icon: Grid3X3 },
          { to: '/admin/complaints', label: 'All Campus Complaints', icon: Wrench },
          { to: '/admin/students', label: 'Student Roster', icon: Users },
          { to: '/admin/audit-logs', label: 'Security Audit Trail', icon: History },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-61px)]">
      {/* Navigation Group */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-indigo-950">Hostel360 Online</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 leading-tight">
            Intelligent escalation engine &amp; welfare monitor active.
          </p>
        </div>
      </div>
    </aside>
  );
};
