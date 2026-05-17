const Watchlist = require('../models/Watchlist');

// @desc    Get all watchlists for current user
// @route   GET /api/watchlists
// @access  Private
const getWatchlists = async (req, res, next) => {
  try {
    const watchlists = await Watchlist.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: watchlists.length,
      data: watchlists,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single watchlist
// @route   GET /api/watchlists/:id
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      res.status(404);
      throw new Error('Watchlist not found');
    }

    res.json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new watchlist
// @route   POST /api/watchlists
// @access  Private
const createWatchlist = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a watchlist name');
    }

    const watchlist = await Watchlist.create({
      user: req.user._id,
      name,
      stocks: [],
    });

    res.status(201).json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Update watchlist name
// @route   PUT /api/watchlists/:id
// @access  Private
const updateWatchlist = async (req, res, next) => {
  try {
    const { name } = req.body;

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      res.status(404);
      throw new Error('Watchlist not found');
    }

    if (name) watchlist.name = name;
    await watchlist.save();

    res.json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a watchlist
// @route   DELETE /api/watchlists/:id
// @access  Private
const deleteWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      res.status(404);
      throw new Error('Watchlist not found');
    }

    res.json({ success: true, message: 'Watchlist deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add stock to a watchlist
// @route   POST /api/watchlists/:id/stocks
// @access  Private
const addStock = async (req, res, next) => {
  try {
    const { symbol, name } = req.body;

    if (!symbol || !name) {
      res.status(400);
      throw new Error('Please provide stock symbol and name');
    }

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      res.status(404);
      throw new Error('Watchlist not found');
    }

    // Check if stock already exists in watchlist
    const stockExists = watchlist.stocks.find(
      (s) => s.symbol === symbol.toUpperCase()
    );
    if (stockExists) {
      res.status(400);
      throw new Error('Stock already in this watchlist');
    }

    watchlist.stocks.push({
      symbol: symbol.toUpperCase(),
      name,
      addedAt: new Date(),
    });

    await watchlist.save();
    res.json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove stock from a watchlist
// @route   DELETE /api/watchlists/:id/stocks/:symbol
// @access  Private
const removeStock = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      res.status(404);
      throw new Error('Watchlist not found');
    }

    const stockIndex = watchlist.stocks.findIndex(
      (s) => s.symbol === req.params.symbol.toUpperCase()
    );

    if (stockIndex === -1) {
      res.status(404);
      throw new Error('Stock not found in this watchlist');
    }

    watchlist.stocks.splice(stockIndex, 1);
    await watchlist.save();

    res.json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlists,
  getWatchlist,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addStock,
  removeStock,
};
