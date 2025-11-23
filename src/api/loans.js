import apiClient from './client';

export const loansAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/loans/all');
    return response.data;
  },

  reserve: async (reserveData) => {
    const response = await apiClient.post('/api/loans/reserve', reserveData);
    return response.data;
  },

  issue: async (loanId) => {
    const response = await apiClient.post(`/api/loans/${loanId}/issue`);
    return response.data;
  },

  return: async (loanId) => {
    const response = await apiClient.post(`/api/loans/${loanId}/return`);
    return response.data;
  },
};


