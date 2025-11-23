import apiClient from './client';

export const adminAPI = {
  getAllUsers: async () => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  registerStaff: async (staffData) => {
    const response = await apiClient.post('/api/admin/register', staffData);
    return response.data;
  },

  checkBarcode: async (barcode) => {
    const response = await apiClient.post('/api/admin/check', {
      barcode,
    });
    return response.data;
  },
};



