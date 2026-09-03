import api from './api';

export const messService = {
  getTodayMenu: async (hostelId = 1) => {
    const response = await api.get('/mess/menu/today', { params: { hostelId } });
    return response.data;
  },

  getWeeklyMenu: async (hostelId = 1) => {
    const response = await api.get('/mess/menu/weekly', { params: { hostelId } });
    return response.data;
  },

  saveMenuItem: async (menuData) => {
    const response = await api.post('/mess/manage/menu', menuData);
    return response.data;
  },

  createReservation: async (data) => {
    const response = await api.post('/mess/reservations', data);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/mess/reservations/my');
    return response.data;
  },

  getHostelReservations: async (hostelId, date) => {
    const response = await api.get('/mess/manage/reservations', { params: { hostelId, date } });
    return response.data;
  },

  updateReservationStatus: async (id, status, packingNotes) => {
    const response = await api.put(`/mess/manage/reservations/${id}/status`, { status, packingNotes });
    return response.data;
  },

  rateMeal: async (data) => {
    const response = await api.post('/mess/rating', data);
    return response.data;
  },

  reportFoodComplaint: async (data) => {
    const response = await api.post('/mess/complaint', data);
    return response.data;
  },

  getHostelFoodComplaints: async (hostelId) => {
    const response = await api.get('/mess/complaints', { params: { hostelId } });
    return response.data;
  },
};
