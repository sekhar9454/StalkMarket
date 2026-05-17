const stockService = require('../services/stockService');

// @desc    Search stocks
// @route   GET /api/stocks/search?q=
// @access  Private
const searchStocks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      res.status(400);
      throw new Error('Please provide a search query');
    }

    const results = await stockService.searchStocks(q);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stock quote
// @route   GET /api/stocks/quote/:symbol
// @access  Private
const getQuote = async (req, res, next) => {
  try {
    const quote = await stockService.getQuote(req.params.symbol);
    if (!quote) {
      res.status(404);
      throw new Error('Stock not found');
    }
    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company profile
// @route   GET /api/stocks/profile/:symbol
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const profile = await stockService.getCompanyProfile(req.params.symbol);
    if (!profile) {
      res.status(404);
      throw new Error('Company profile not found');
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending stocks
// @route   GET /api/stocks/trending
// @access  Private
const getTrending = async (req, res, next) => {
  try {
    const stocks = await stockService.getTrendingStocks();
    res.json({ success: true, data: stocks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get batch quotes
// @route   POST /api/stocks/batch
// @access  Private
const getBatchQuotes = async (req, res, next) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols)) {
      res.status(400);
      throw new Error('Please provide an array of symbols');
    }

    const quotes = await stockService.getBatchQuotes(symbols);
    res.json({ success: true, data: quotes });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchStocks, getQuote, getProfile, getTrending, getBatchQuotes };
