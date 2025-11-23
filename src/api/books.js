import apiClient from './client';

export const booksAPI = {
  getAll: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/books', {
      params: { skip, limit },
    });
    return response.data;
  },

  getByISBN: async (isbn) => {
    const response = await apiClient.get(`/api/books/isbn/${isbn}`);
    return response.data;
  },

  search: async (query, skip = 0, limit = 50) => {
    const response = await apiClient.post('/api/books/search', 
      { query },
      { params: { skip, limit } }
    );
    return response.data;
  },

  create: async (bookData) => {
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('isbn', bookData.isbn);
    
    if (bookData.description) {
      formData.append('description', bookData.description);
    }
    
    if (bookData.genre) {
      formData.append('genre', bookData.genre);
    }
    
    if (bookData.image && bookData.image instanceof File) {
      formData.append('image', bookData.image);
    }
    
    const response = await apiClient.post('/api/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (bookId, bookData) => {
    const response = await apiClient.put(`/api/books/${bookId}`, bookData);
    return response.data;
  },

  addInstance: async (bookId, instanceData) => {
    const response = await apiClient.post(
      `/api/books/${bookId}/instances`,
      instanceData
    );
    return response.data;
  },
};
