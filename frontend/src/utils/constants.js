export const ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  WARDEN: 'ROLE_WARDEN',
  STUDENT: 'ROLE_STUDENT',
  MAINTENANCE_STAFF: 'ROLE_MAINTENANCE_STAFF',
  MESS_MANAGER: 'ROLE_MESS_MANAGER',
  SECURITY_STAFF: 'ROLE_SECURITY_STAFF',
};

export const ROLE_LABELS = {
  ROLE_SUPER_ADMIN: 'Super Administrator',
  ROLE_WARDEN: 'Hostel Warden',
  ROLE_STUDENT: 'Hostel Resident',
  ROLE_MAINTENANCE_STAFF: 'Maintenance Technician',
  ROLE_MESS_MANAGER: 'Mess Manager',
  ROLE_SECURITY_STAFF: 'Security Desk',
};

export const ROLE_COLORS = {
  ROLE_SUPER_ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  ROLE_WARDEN: 'bg-blue-100 text-blue-700 border-blue-200',
  ROLE_STUDENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ROLE_MAINTENANCE_STAFF: 'bg-amber-100 text-amber-700 border-amber-200',
  ROLE_MESS_MANAGER: 'bg-orange-100 text-orange-700 border-orange-200',
  ROLE_SECURITY_STAFF: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const PRIORITY_CONFIG = {
  CRITICAL: {
    label: 'Critical',
    badge: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20',
    dot: 'bg-red-500',
  },
  HIGH: {
    label: 'High',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  MEDIUM: {
    label: 'Medium',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  LOW: {
    label: 'Low',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export const STATUS_CONFIG = {
  SUBMITTED: {
    label: 'Submitted',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  ASSIGNED: {
    label: 'Assigned',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  RESOLVED: {
    label: 'Resolved',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  STUDENT_CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  ESCALATED: {
    label: 'Escalated',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
  },
  REOPENED: {
    label: 'Reopened',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  CLOSED: {
    label: 'Closed',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  // Leave statuses
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  APPROVED_WARDEN: {
    label: 'Approved',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    badge: 'bg-red-50 text-red-700 border-red-200',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  CHECKED_IN: {
    label: 'Returned',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};
