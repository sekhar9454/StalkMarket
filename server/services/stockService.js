const axios = require('axios');
const { mockStocks, getRandomizedStock } = require('../data/mockStocks');

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

const finnhubClient = axios.create({
  baseURL: FINNHUB_BASE_URL,
  timeout: 10000,
});

// Check if Finnhub API key is available
const hasApiKey = () => {
  return process.env.FINNHUB_API_KEY && process.env.FINNHUB_API_KEY.trim() !== '';
};

// Search stocks by query
const searchStocks = async (query) => {
  if (!hasApiKey()) {
    // Use mock data for search
    const q = query.toLowerCase();
    const results = mockStocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map((s) => ({
        symbol: s.symbol,
        description: s.name,
        type: 'Common Stock',
      }));
    return results;
  }

  try {
    const { data } = await finnhubClient.get('/search', {
      params: { q: query, token: process.env.FINNHUB_API_KEY },
    });
    return (data.result || [])
      .filter((r) => r.type === 'Common Stock')
      .slice(0, 10);
  } catch (error) {
    console.error('Finnhub search error:', error.message);
    // Fallback to mock data
    const q = query.toLowerCase();
    return mockStocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map((s) => ({
        symbol: s.symbol,
        description: s.name,
        type: 'Common Stock',
      }));
  }
};

// Get quote for a specific symbol
const getQuote = async (symbol) => {
  if (!hasApiKey()) {
    // Use mock data
    const stock = mockStocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );
    if (stock) {
      return getRandomizedStock(stock);
    }
    return null;
  }

  try {
    const { data } = await finnhubClient.get('/quote', {
      params: { symbol: symbol.toUpperCase(), token: process.env.FINNHUB_API_KEY },
    });

    if (!data || data.c === 0) {
      // No data from API, try mock
      const stock = mockStocks.find(
        (s) => s.symbol === symbol.toUpperCase()
      );
      return stock ? getRandomizedStock(stock) : null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      prevClose: data.pc,
    };
  } catch (error) {
    console.error('Finnhub quote error:', error.message);
    const stock = mockStocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );
    return stock ? getRandomizedStock(stock) : null;
  }
};

// Get company profile
const getCompanyProfile = async (symbol) => {
  if (!hasApiKey()) {
    const stock = mockStocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );
    if (stock) {
      return {
        name: stock.name,
        ticker: stock.symbol,
        marketCapitalization: stock.marketCap,
        finnhubIndustry: stock.industry,
      };
    }
    return null;
  }

  try {
    const { data } = await finnhubClient.get('/stock/profile2', {
      params: { symbol: symbol.toUpperCase(), token: process.env.FINNHUB_API_KEY },
    });
    return data;
  } catch (error) {
    console.error('Finnhub profile error:', error.message);
    const stock = mockStocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );
    return stock
      ? {
          name: stock.name,
          ticker: stock.symbol,
          marketCapitalization: stock.marketCap,
          finnhubIndustry: stock.industry,
        }
      : null;
  }
};

// Get trending/popular stocks
const getTrendingStocks = async () => {
  // Return a curated list of trending stocks with live quotes
  const trendingSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
    'NVDA', 'META', 'NFLX', 'AMD', 'UBER',
  ];

  const quotes = await Promise.all(
    trendingSymbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      if (quote) {
        const stock = mockStocks.find((s) => s.symbol === symbol);
        return {
          ...quote,
          symbol,
          name: quote.name || (stock ? stock.name : symbol),
        };
      }
      return null;
    })
  );

  return quotes.filter(Boolean);
};

// Get batch quotes for multiple symbols
const getBatchQuotes = async (symbols) => {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      return quote ? { ...quote, symbol } : null;
    })
  );
  return quotes.filter(Boolean);
};

module.exports = {
  searchStocks,
  getQuote,
  getCompanyProfile,
  getTrendingStocks,
  getBatchQuotes,
};
