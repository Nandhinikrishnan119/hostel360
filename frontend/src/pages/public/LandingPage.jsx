import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Zap,
  HeartPulse,
  Utensils,
  DoorClosed,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Activity,
  Users,
  Building,
  Package,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (username, password) => {
    try {
      const u = await login(username, password);
      redirectUser(u.role);
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case 'ROLE_STUDENT': navigate('/student/dashboard'); break;
      case 'ROLE_WARDEN': navigate('/warden/dashboard'); break;
      case 'ROLE_MAINTENANCE_STAFF': navigate('/maintenance/dashboard'); break;
      case 'ROLE_MESS_MANAGER': navigate('/mess/dashboard'); break;
      case 'ROLE_SECURITY_STAFF': navigate('/security/dashboard'); break;
      case 'ROLE_SUPER_ADMIN': navigate('/admin/dashboard'); break;
      default: navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
              360
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">Hostel360</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => redirectUser(user.role)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                Go to My Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                Sign In
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          From Hostel Complaints to Intelligent Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
          One Centralized Platform for the{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Complete Hostel Ecosystem
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Say goodbye to manual registers, WhatsApp complaint groups, and lost parcels. Hostel360 delivers automated SLA-based escalations, mess reservations, gate pass checkouts, and student welfare monitoring.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            Launch Web App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Instant Role Demo Logins Bar */}
        <div className="mt-14 w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1-Click Interactive Role Switcher
            </span>
            <span className="text-[11px] text-slate-400">Click any role to test its live dashboard &amp; APIs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { role: 'Student Resident', user: 'student1', pass: 'student123', color: 'hover:border-emerald-500 hover:bg-emerald-950/30', badge: 'bg-emerald-500/10 text-emerald-400' },
              { role: 'Hostel Warden', user: 'warden1', pass: 'warden123', color: 'hover:border-blue-500 hover:bg-blue-950/30', badge: 'bg-blue-500/10 text-blue-400' },
              { role: 'Maintenance Staff', user: 'maint1', pass: 'maint123', color: 'hover:border-amber-500 hover:bg-amber-950/30', badge: 'bg-amber-500/10 text-amber-400' },
              { role: 'Mess Manager', user: 'mess1', pass: 'mess123', color: 'hover:border-orange-500 hover:bg-orange-950/30', badge: 'bg-orange-500/10 text-orange-400' },
              { role: 'Security Desk', user: 'security1', pass: 'security123', color: 'hover:border-slate-400 hover:bg-slate-800/40', badge: 'bg-slate-500/10 text-slate-300' },
              { role: 'Super Admin', user: 'admin', pass: 'admin123', color: 'hover:border-purple-500 hover:bg-purple-950/30', badge: 'bg-purple-500/10 text-purple-400' },
            ].map((item) => (
              <button
                key={item.user}
                onClick={() => handleQuickDemoLogin(item.user, item.pass)}
                className={`p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-left transition-all ${item.color} group`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badge}`}>
                    {item.user}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-xs font-bold text-white mt-2">{item.role}</h4>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered for Real-World College Hostels</h2>
          <p className="text-xs text-slate-400 mt-2">Every core module connects with Java Spring Boot REST services and live MySQL data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated SLA Escalation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Configurable SLA windows for Low, Medium, High, and Critical tickets. A background `@Scheduled` engine elevates overdue complaints from Technician $\rightarrow$ Supervisor $\rightarrow$ Warden.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Student Welfare &amp; Health Checks</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Voluntary medical issue logs protected with strict authorization. Wardens receive health follow-up reminders to ensure sick students receive meals and medical attention.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Keep My Food &amp; Mess Schedules</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Students running late for lab or sports can reserve packed meals. Includes weekly menus, meal satisfaction ratings, and hygiene complaint tracking.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <DoorClosed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Visual Room Occupancy</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Interactive room grid for Wardens showing capacity, available beds, and active occupants with roommate emergency contacts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Hostel Health Score &amp; Predictive Maintenance</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explainable 100-point health score calculated from resolution rates, mess feedback, and sanitation audits. Intelligent recurring defect alerts flag faulty assets.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Parcel Desk with OTP</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Security registers parcels upon arrival, triggering instant in-app alerts with a 6-digit verification OTP for secure pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>Hostel360 — From Hostel Complaints to Intelligent Hostel Management.</p>
        <p className="mt-1 text-slate-600">Built with React, Java Spring Boot, MySQL &amp; JWT Security</p>
      </footer>
    </div>
  );
};
