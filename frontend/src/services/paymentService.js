import api from './api';

export const paymentService = {
  // Admin & Warden: Filter payments
  getPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Admin & Warden: Get summary stats
  getSummary: async () => {
    const response = await api.get('/payments/summary');
    return response.data;
  },

  // Admin & Warden: Generate new fee invoice
  createInvoice: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  // Admin & Warden: Record payment against invoice
  recordPayment: async (paymentId, data) => {
    const response = await api.put(`/payments/${paymentId}/record`, data);
    return response.data;
  },

  // Student: Get my payment invoices & receipts
  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  },

  // Get invoice by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};
