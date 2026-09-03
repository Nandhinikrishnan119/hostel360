import api from './api';

export const operationsService = {
  // Announcements
  publishAnnouncement: async (data) => {
    const response = await api.post('/operations/announcements', data);
    return response.data;
  },

  getAnnouncements: async (hostelId) => {
    const response = await api.get('/operations/announcements', { params: { hostelId } });
    return response.data;
  },

  // Parcels
  registerParcel: async (data) => {
    const response = await api.post('/operations/parcels', data);
    return response.data;
  },

  getMyParcels: async () => {
    const response = await api.get('/operations/parcels/my');
    return response.data;
  },

  getActiveParcels: async () => {
    const response = await api.get('/operations/parcels/active');
    return response.data;
  },

  collectParcel: async (id, otp) => {
    const response = await api.post(`/operations/parcels/${id}/collect`, { otp });
    return response.data;
  },

  // Emergency
  triggerEmergency: async (data) => {
    const response = await api.post('/operations/emergency', data);
    return response.data;
  },

  getEmergencies: async () => {
    const response = await api.get('/operations/emergency');
    return response.data;
  },

  resolveEmergency: async (id, actionTaken) => {
    const response = await api.put(`/operations/emergency/${id}/resolve`, { actionTaken });
    return response.data;
  },

  // Notifications
  getMyNotifications: async () => {
    const response = await api.get('/operations/notifications');
    return response.data;
  },

  getUnreadNotificationCount: async () => {
    const response = await api.get('/operations/notifications/unread-count');
    return response.data.unreadCount;
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/operations/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await api.put('/operations/notifications/read-all');
    return response.data;
  },
};
