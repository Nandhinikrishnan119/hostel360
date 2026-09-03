import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectByRole = (role) => {
    switch (role) {
      case 'ROLE_STUDENT': navigate('/student/dashboard'); break;
      case 'ROLE_WARDEN': navigate('/warden/dashboard'); break;
      case 'ROLE_MAINTENANCE_STAFF': navigate('/maintenance/dashboard'); break;
      case 'ROLE_MESS_MANAGER': navigate('/mess/dashboard'); break;
      case 'ROLE_SECURITY_STAFF': navigate('/security/dashboard'); break;
      case 'ROLE_SUPER_ADMIN': navigate('/admin/dashboard'); break;
      default: navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(usernameOrEmail, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');
      redirectByRole(user.role);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (u, p) => {
    setUsernameOrEmail(u);
    setPassword(p);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Hostel360</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your digital hostel dashboard and real-time operations
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. student1 or admin@hostel360.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In to Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Credentials Autofill Helper */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick Test Credentials
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => fillDemoCreds('student1', 'student123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-emerald-400 block">Student (Ananya)</span>
            student1 / student123
          </button>

          <button
            type="button"
            onClick={() => fillDemoCreds('warden1', 'warden123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-blue-400 block">Girls Hostel Warden</span>
            warden1 / warden123
          </button>

          <button
            type="button"
            onClick={() => fillDemoCreds('maint1', 'maint123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-amber-400 block">Electrician</span>
            maint1 / maint123
          </button>

          <button
            type="button"
            onClick={() => fillDemoCreds('mess1', 'mess123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-orange-400 block">Mess Manager</span>
            mess1 / mess123
          </button>

          <button
            type="button"
            onClick={() => fillDemoCreds('security1', 'security123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-slate-400 block">Security Desk</span>
            security1 / security123
          </button>

          <button
            type="button"
            onClick={() => fillDemoCreds('admin', 'admin123')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-slate-300 transition-all"
          >
            <span className="font-bold text-purple-400 block">Super Admin</span>
            admin / admin123
          </button>
        </div>
      </div>
    </div>
  );
};
