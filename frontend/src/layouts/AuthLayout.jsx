import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Zap, HeartPulse, Building2, BellRing, Utensils } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Left Hero Graphic Section */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-r border-slate-800">
        {/* Background glow accents */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
              360
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">Hostel360</span>
          </Link>
          <p className="text-xs text-indigo-300 font-semibold tracking-wide uppercase mt-2">
            Intelligent Hostel Operations &amp; Student Welfare Platform
          </p>
        </div>

        {/* Hero Features Highlights */}
        <div className="relative z-10 my-8 space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Automated SLA Escalation Engine</h4>
              <p className="text-[11px] text-slate-400">Auto-elevates overdue repairs through 3 escalation tiers.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Confidential Student Welfare &amp; Health</h4>
              <p className="text-[11px] text-slate-400">Voluntary medical condition tracking with warden visits.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Mess &amp; 'Keep My Food' Late Pack Reservations</h4>
              <p className="text-[11px] text-slate-400">Hot-case meal reservations for late-returning students.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Hostel360 Enterprise</span>
          <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Bank-Grade JWT &amp; RBAC Security
          </span>
        </div>
      </div>

      {/* Right Login / Auth Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
