import api from './api';

export const roomService = {
  getAllHostels: async () => {
    const response = await api.get('/rooms/hostels');
    return response.data;
  },

  getBlocksByHostel: async (hostelId) => {
    const response = await api.get(`/rooms/hostels/${hostelId}/blocks`);
    return response.data;
  },

  getRoomsByBlock: async (blockId) => {
    const response = await api.get(`/rooms/blocks/${blockId}/rooms`);
    return response.data;
  },

  getRoomsByHostel: async (hostelId) => {
    const response = await api.get(`/rooms/hostels/${hostelId}/rooms`);
    return response.data;
  },

  getRoomDetail: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },
};
