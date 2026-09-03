import api from './api';

export const analyticsService = {
  getDashboardSummary: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getHostelHealthScore: async (hostelId = 1) => {
    const response = await api.get('/admin/hostel-health-score', { params: { hostelId } });
    return response.data;
  },

  getPredictiveInsights: async () => {
    const response = await api.get('/admin/predictive-maintenance');
    return response.data;
  },

  getAuditLogs: async (page = 0, size = 25) => {
    const response = await api.get('/admin/audit-logs', { params: { page, size } });
    return response.data;
  },
};
