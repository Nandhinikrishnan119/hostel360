import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs">
        Validating secure session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to respective dashboard if role does not match
    switch (user?.role) {
      case 'ROLE_STUDENT': return <Navigate to="/student/dashboard" replace />;
      case 'ROLE_WARDEN': return <Navigate to="/warden/dashboard" replace />;
      case 'ROLE_MAINTENANCE_STAFF': return <Navigate to="/maintenance/dashboard" replace />;
      case 'ROLE_MESS_MANAGER': return <Navigate to="/mess/dashboard" replace />;
      case 'ROLE_SECURITY_STAFF': return <Navigate to="/security/dashboard" replace />;
      case 'ROLE_SUPER_ADMIN': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};
