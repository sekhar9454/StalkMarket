const express = require('express');
const {
  getWatchlists,
  getWatchlist,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addStock,
  removeStock,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All watchlist routes require authentication
router.use(protect);

router.route('/').get(getWatchlists).post(createWatchlist);
router
  .route('/:id')
  .get(getWatchlist)
  .put(updateWatchlist)
  .delete(deleteWatchlist);
router.post('/:id/stocks', addStock);
router.delete('/:id/stocks/:symbol', removeStock);

module.exports = router;
