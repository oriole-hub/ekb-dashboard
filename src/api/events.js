import apiClient from './client';

export const eventsAPI = {
  getAll: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/events/admin/all', {
      params: { skip, limit },
    });
    return response.data;
  },

  getUpcoming: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/events', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (eventId) => {
    const response = await apiClient.get(`/api/events/${eventId}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await apiClient.post('/api/events', eventData);
    return response.data;
  },

  update: async (eventId, eventData) => {
    const response = await apiClient.put(`/api/events/${eventId}`, eventData);
    return response.data;
  },

  cancel: async (eventId) => {
    return eventsAPI.update(eventId, { status: 'cancelled' });
  },
};




