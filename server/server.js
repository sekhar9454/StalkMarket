const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const stockRoutes = require('./routes/stockRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/stocks', stockRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Proffnitt API is running 🚀' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Finnhub API: ${process.env.FINNHUB_API_KEY ? 'Enabled' : 'Using mock data'}`);
});
