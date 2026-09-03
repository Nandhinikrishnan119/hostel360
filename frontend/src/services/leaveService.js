import api from './api';

export const leaveService = {
  submitLeave: async (data) => {
    const response = await api.post('/leave', data);
    return response.data;
  },

  getMyLeaves: async () => {
    const response = await api.get('/leave/my');
    return response.data;
  },

  getPendingLeaves: async (hostelId) => {
    const response = await api.get('/leave/pending', { params: { hostelId } });
    return response.data;
  },

  approveLeave: async (id, remarks) => {
    const response = await api.put(`/leave/${id}/approve`, { remarks });
    return response.data;
  },

  rejectLeave: async (id, remarks) => {
    const response = await api.put(`/leave/${id}/reject`, { remarks });
    return response.data;
  },

  getActiveApprovedLeavesForSecurity: async () => {
    const response = await api.get('/leave/security/active');
    return response.data;
  },

  recordCheckout: async (id) => {
    const response = await api.put(`/leave/${id}/checkout`);
    return response.data;
  },

  recordCheckin: async (id) => {
    const response = await api.put(`/leave/${id}/checkin`);
    return response.data;
  },

  // Late Entry
  submitLateEntry: async (data) => {
    const response = await api.post('/leave/late-entry', data);
    return response.data;
  },

  getLateEntriesToday: async (hostelId) => {
    const response = await api.get('/leave/late-entry/today', { params: { hostelId } });
    return response.data;
  },

  getMyLateEntries: async () => {
    const response = await api.get('/leave/late-entry/my');
    return response.data;
  },

  recordLateEntryArrival: async (id, remarks) => {
    const response = await api.put(`/leave/late-entry/${id}/record-arrival`, { remarks });
    return response.data;
  },
};
