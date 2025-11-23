import apiClient from './client';

export const recommendationsAPI = {
  retrain: async () => {
    const response = await apiClient.post('/api/recommendations/retrain');
    return response.data;
  },
};

