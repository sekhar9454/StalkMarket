import api from './api';

export const stockService = {
  search: async (query) => {
    const { data } = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
    return data;
  },

  getQuote: async (symbol) => {
    const { data } = await api.get(`/stocks/quote/${symbol}`);
    return data;
  },

  getProfile: async (symbol) => {
    const { data } = await api.get(`/stocks/profile/${symbol}`);
    return data;
  },

  getTrending: async () => {
    const { data } = await api.get('/stocks/trending');
    return data;
  },

  getBatchQuotes: async (symbols) => {
    const { data } = await api.post('/stocks/batch', { symbols });
    return data;
  },
};
