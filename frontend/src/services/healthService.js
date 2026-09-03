import api from './api';

export const healthService = {
  reportHealth: async (data) => {
    const response = await api.post('/health', data);
    return response.data;
  },

  getMyHealthRecords: async () => {
    const response = await api.get('/health/my');
    return response.data;
  },

  getActiveWelfareCases: async (hostelId) => {
    const response = await api.get('/health/warden/active', { params: { hostelId } });
    return response.data;
  },

  recordFollowUp: async (id, data) => {
    const response = await api.post(`/health/${id}/follow-up`, data);
    return response.data;
  },

  getFollowUps: async (id) => {
    const response = await api.get(`/health/${id}/follow-ups`);
    return response.data;
  },
};
