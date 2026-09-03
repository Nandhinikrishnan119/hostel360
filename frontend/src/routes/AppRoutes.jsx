import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LoginPage } from '../pages/public/LoginPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyRoomPage } from '../pages/student/MyRoomPage';
import { StudentComplaintsPage } from '../pages/student/StudentComplaintsPage';
import { StudentMessPage } from '../pages/student/StudentMessPage';
import { StudentLeavePage } from '../pages/student/StudentLeavePage';
import { StudentHealthPage } from '../pages/student/StudentHealthPage';
import { StudentPaymentsPage } from '../pages/student/StudentPaymentsPage';
import { SuggestionsPage } from '../pages/student/SuggestionsPage';
import { StudentParcelsPage } from '../pages/student/StudentParcelsPage';
import { AnnouncementsPage } from '../pages/student/AnnouncementsPage';

// Warden Pages
import { WardenDashboard } from '../pages/warden/WardenDashboard';
import { RoomOccupancyVisualizer } from '../pages/warden/RoomOccupancyVisualizer';
import { WardenComplaintsPage } from '../pages/warden/WardenComplaintsPage';
import { LeaveApprovalsPage } from '../pages/warden/LeaveApprovalsPage';
import { LateEntryMonitorPage } from '../pages/warden/LateEntryMonitorPage';
import { WelfareFollowUpPage } from '../pages/warden/WelfareFollowUpPage';
import { WardenSuggestionsPage } from '../pages/warden/WardenSuggestionsPage';
import { WardenAnnouncementsPage } from '../pages/warden/WardenAnnouncementsPage';

// Maintenance Staff Pages
import { MaintenanceDashboard } from '../pages/maintenance/MaintenanceDashboard';
import { MaintenanceWorkOrdersPage } from '../pages/maintenance/MaintenanceWorkOrdersPage';

// Mess Manager Pages
import { MessManagerDashboard } from '../pages/mess/MessManagerDashboard';
import { MenuManagementPage } from '../pages/mess/MenuManagementPage';
import { KeepFoodOrdersPage } from '../pages/mess/KeepFoodOrdersPage';
import { FoodFeedbackPage } from '../pages/mess/FoodFeedbackPage';

// Security Staff Pages
import { SecurityDashboard } from '../pages/security/SecurityDashboard';
import { SecurityGatePassPage } from '../pages/security/SecurityGatePassPage';
import { SecurityLateEntryPage } from '../pages/security/SecurityLateEntryPage';
import { SecurityParcelsPage } from '../pages/security/SecurityParcelsPage';
import { SecurityEmergencyPage } from '../pages/security/SecurityEmergencyPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { HostelHealthScoreView } from '../pages/admin/HostelHealthScoreView';
import { PredictiveMaintenanceView } from '../pages/admin/PredictiveMaintenanceView';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Student Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
        <Route element={<MainLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/room" element={<MyRoomPage />} />
          <Route path="/student/complaints" element={<StudentComplaintsPage />} />
          <Route path="/student/mess" element={<StudentMessPage />} />
          <Route path="/student/leave" element={<StudentLeavePage />} />
          <Route path="/student/health" element={<StudentHealthPage />} />
          <Route path="/student/payments" element={<StudentPaymentsPage />} />
          <Route path="/student/suggestions" element={<SuggestionsPage />} />
          <Route path="/student/parcels" element={<StudentParcelsPage />} />
          <Route path="/student/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Route>

      {/* Protected Warden Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_WARDEN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/occupancy" element={<RoomOccupancyVisualizer />} />
          <Route path="/warden/complaints" element={<WardenComplaintsPage />} />
          <Route path="/warden/leaves" element={<LeaveApprovalsPage />} />
          <Route path="/warden/late-entries" element={<LateEntryMonitorPage />} />
          <Route path="/warden/welfare" element={<WelfareFollowUpPage />} />
          <Route path="/warden/suggestions" element={<WardenSuggestionsPage />} />
          <Route path="/warden/announcements" element={<WardenAnnouncementsPage />} />
        </Route>
      </Route>

      {/* Protected Maintenance Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_MAINTENANCE_STAFF']} />}>
        <Route element={<MainLayout />}>
          <Route path="/maintenance/dashboard" element={<MaintenanceDashboard />} />
          <Route path="/maintenance/work-orders" element={<MaintenanceWorkOrdersPage />} />
        </Route>
      </Route>

      {/* Protected Mess Manager Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_MESS_MANAGER']} />}>
        <Route element={<MainLayout />}>
          <Route path="/mess/dashboard" element={<MessManagerDashboard />} />
          <Route path="/mess/menu-management" element={<MenuManagementPage />} />
          <Route path="/mess/keep-food-orders" element={<KeepFoodOrdersPage />} />
          <Route path="/mess/food-feedback" element={<FoodFeedbackPage />} />
        </Route>
      </Route>

      {/* Protected Security Desk Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_SECURITY_STAFF']} />}>
        <Route element={<MainLayout />}>
          <Route path="/security/dashboard" element={<SecurityDashboard />} />
          <Route path="/security/gate-pass" element={<SecurityGatePassPage />} />
          <Route path="/security/late-entry" element={<SecurityLateEntryPage />} />
          <Route path="/security/parcels" element={<SecurityParcelsPage />} />
          <Route path="/security/emergency" element={<SecurityEmergencyPage />} />
        </Route>
      </Route>

      {/* Protected Super Admin Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/hostel-health" element={<HostelHealthScoreView />} />
          <Route path="/admin/predictive" element={<PredictiveMaintenanceView />} />
          <Route path="/admin/occupancy" element={<RoomOccupancyVisualizer />} />
          <Route path="/admin/complaints" element={<WardenComplaintsPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
