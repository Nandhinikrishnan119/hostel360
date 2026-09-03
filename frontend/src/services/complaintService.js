import api from './api';

export const complaintService = {
  getCategories: async () => {
    const response = await api.get('/complaints/categories');
    return response.data;
  },

  createComplaint: async (data) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  getMyComplaints: async () => {
    const response = await api.get('/complaints/my');
    return response.data;
  },

  getAssignedComplaints: async () => {
    const response = await api.get('/complaints/assigned');
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  filterComplaints: async (params) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  assignComplaint: async (id, staffUserId, assignmentNotes) => {
    const response = await api.put(`/complaints/${id}/assign`, { staffUserId, assignmentNotes });
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.put(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  confirmResolution: async (id) => {
    const response = await api.put(`/complaints/${id}/confirm`);
    return response.data;
  },

  reopenComplaint: async (id, reason) => {
    const response = await api.post(`/complaints/${id}/reopen`, { reason });
    return response.data;
  },

  addComment: async (id, comment, isInternalStaffOnly = false) => {
    const response = await api.post(`/complaints/${id}/comments`, { comment, isInternalStaffOnly });
    return response.data;
  },

  checkDuplicates: async (categoryId, hostelId, blockId) => {
    const response = await api.get('/complaints/duplicates', {
      params: { categoryId, hostelId, blockId },
    });
    return response.data;
  },

  triggerSlaCheck: async () => {
    const response = await api.post('/escalations/trigger-sla');
    return response.data;
  },

  manualEscalate: async (complaintId, reason) => {
    const response = await api.post(`/escalations/${complaintId}/manual`, { reason });
    return response.data;
  },
};
