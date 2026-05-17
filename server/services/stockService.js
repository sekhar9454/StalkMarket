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

// Check if symbol is an Indian stock (Finnhub free tier doesn't support .NS/.BO)
const isIndianSymbol = (symbol) => {
  const s = symbol.toUpperCase().trim();
  if (s.includes('.NS') || s.includes('.BO')) return true;
  return mockStocks.some((stock) => stock.symbol.replace('.NS', '') === s);
};

// Normalize symbol — ensure Indian stocks get .NS suffix
const normalizeSymbol = (symbol) => {
  const s = symbol.toUpperCase().trim();
  if (s.includes('.')) return s;
  if (isIndianSymbol(s)) return `${s}.NS`;
  return s;
};

// Strip the .NS suffix for display purposes
const displaySymbol = (symbol) => {
  return symbol.replace('.NS', '').replace('.BO', '');
};

// Find stock from mock data
const findMockStock = (symbol) => {
  const s = symbol.toUpperCase().trim();
  return mockStocks.find(
    (stock) =>
      stock.symbol === s ||
      stock.symbol.replace('.NS', '') === s ||
      stock.symbol.replace('.NS', '') === s.replace('.NS', '')
  );
};

// Search stocks by query
const searchStocks = async (query) => {
  const q = query.toLowerCase();

  // Search mock data for Indian stocks
  const mockResults = mockStocks
    .filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.symbol.replace('.NS', '').toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .map((s) => ({
      symbol: s.symbol,
      description: s.name,
      displaySymbol: displaySymbol(s.symbol),
      type: 'Common Stock',
      exchange: 'NSE',
    }));

  // For Indian market, mock data is our primary source since
  // Finnhub free tier doesn't support Indian stocks
  return mockResults;
};

// Get quote for a specific symbol
const getQuote = async (symbol) => {
  const normalizedSymbol = normalizeSymbol(symbol);
  const mockStock = findMockStock(symbol);

  // Indian stocks: always use mock data (Finnhub free tier doesn't support .NS)
  if (isIndianSymbol(normalizedSymbol)) {
    return mockStock ? getRandomizedStock(mockStock) : null;
  }

  // Non-Indian stocks: try Finnhub API if key exists
  if (!hasApiKey()) {
    return mockStock ? getRandomizedStock(mockStock) : null;
  }

  try {
    const { data } = await finnhubClient.get('/quote', {
      params: { symbol: normalizedSymbol, token: process.env.FINNHUB_API_KEY },
    });

    if (!data || data.c === 0) {
      return mockStock ? getRandomizedStock(mockStock) : null;
    }

    return {
      symbol: normalizedSymbol,
      displaySymbol: displaySymbol(normalizedSymbol),
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
    return mockStock ? getRandomizedStock(mockStock) : null;
  }
};

// Get company profile
const getCompanyProfile = async (symbol) => {
  const normalizedSymbol = normalizeSymbol(symbol);
  const mockStock = findMockStock(symbol);

  const mockProfile = mockStock
    ? {
        name: mockStock.name,
        ticker: displaySymbol(mockStock.symbol),
        marketCapitalization: mockStock.marketCap,
        finnhubIndustry: mockStock.industry,
        exchange: 'NSE',
        country: 'IN',
        currency: 'INR',
      }
    : null;

  // Indian stocks: use mock data directly
  if (isIndianSymbol(normalizedSymbol)) {
    return mockProfile;
  }

  if (!hasApiKey()) {
    return mockProfile;
  }

  try {
    const { data } = await finnhubClient.get('/stock/profile2', {
      params: { symbol: normalizedSymbol, token: process.env.FINNHUB_API_KEY },
    });
    if (data && data.name) {
      return { ...data, displaySymbol: displaySymbol(normalizedSymbol) };
    }
    return mockProfile;
  } catch (error) {
    console.error('Finnhub profile error:', error.message);
    return mockProfile;
  }
};

// Get trending/popular Indian stocks (always from mock data)
const getTrendingStocks = async () => {
  const trendingSymbols = [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'BHARTIARTL.NS', 'SBIN.NS', 'ITC.NS', 'TATAMOTORS.NS', 'LT.NS',
  ];

  const quotes = trendingSymbols.map((symbol) => {
    const stock = mockStocks.find((s) => s.symbol === symbol);
    if (stock) {
      const randomized = getRandomizedStock(stock);
      return {
        ...randomized,
        symbol,
        displaySymbol: displaySymbol(symbol),
        name: stock.name,
      };
    }
    return null;
  });

  return quotes.filter(Boolean);
};

// Get batch quotes for multiple symbols
const getBatchQuotes = async (symbols) => {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      return quote ? { ...quote, symbol, displaySymbol: displaySymbol(symbol) } : null;
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
  displaySymbol,
};
