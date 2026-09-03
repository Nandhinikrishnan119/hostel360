import api from './api';

export const studentService = {
  getMyProfile: async () => {
    const response = await api.get('/students/me');
    return response.data;
  },

  getAllStudents: async (hostelId) => {
    const response = await api.get('/students', { params: { hostelId } });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
};
