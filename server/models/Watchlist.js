const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a watchlist name'],
      trim: true,
      maxlength: [100, 'Watchlist name cannot exceed 100 characters'],
    },
    stocks: [stockItemSchema],
  },
  { timestamps: true }
);

// Compound index for efficient user-specific queries
watchlistSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
