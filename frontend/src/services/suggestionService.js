import api from './api';

export const suggestionService = {
  submitSuggestion: async (data) => {
    const response = await api.post('/suggestions', data);
    return response.data;
  },

  getSuggestions: async (status) => {
    const response = await api.get('/suggestions', { params: { status } });
    return response.data;
  },

  upvoteSuggestion: async (id) => {
    const response = await api.post(`/suggestions/${id}/upvote`);
    return response.data;
  },

  updateSuggestionStatus: async (id, status, adminFeedback) => {
    const response = await api.put(`/suggestions/${id}/status`, { status, adminFeedback });
    return response.data;
  },

  submitWeeklyFeedback: async (data) => {
    const response = await api.post('/suggestions/feedback/weekly', data);
    return response.data;
  },

  getWeeklyFeedback: async (hostelId) => {
    const response = await api.get('/suggestions/feedback/weekly', { params: { hostelId } });
    return response.data;
  },
};
