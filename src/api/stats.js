import apiClient from './client';

export const statsAPI = {
  getSummary: async () => {
    const response = await apiClient.get('/api/stats/summary');
    return response.data;
  },

  getActivity: async (from, to) => {
    const response = await apiClient.get('/api/stats/activity', {
      params: { from, to },
    });
    return response.data;
  },
};





