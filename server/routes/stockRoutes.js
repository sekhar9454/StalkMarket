const express = require('express');
const {
  searchStocks,
  getQuote,
  getProfile,
  getTrending,
  getBatchQuotes,
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All stock routes require authentication
router.use(protect);

router.get('/search', searchStocks);
router.get('/quote/:symbol', getQuote);
router.get('/profile/:symbol', getProfile);
router.get('/trending', getTrending);
router.post('/batch', getBatchQuotes);

module.exports = router;
