import api from './api';

export const watchlistService = {
  getAll: async () => {
    const { data } = await api.get('/watchlists');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/watchlists/${id}`);
    return data;
  },

  create: async (name) => {
    const { data } = await api.post('/watchlists', { name });
    return data;
  },

  update: async (id, name) => {
    const { data } = await api.put(`/watchlists/${id}`, { name });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/watchlists/${id}`);
    return data;
  },

  addStock: async (watchlistId, symbol, name) => {
    const { data } = await api.post(`/watchlists/${watchlistId}/stocks`, {
      symbol,
      name,
    });
    return data;
  },

  removeStock: async (watchlistId, symbol) => {
    const { data } = await api.delete(
      `/watchlists/${watchlistId}/stocks/${symbol}`
    );
    return data;
  },
};
