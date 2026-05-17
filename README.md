# 📈 Proffnitt — Stock Watchlist Application

A full-stack MERN application for creating and managing personalized stock watchlists with real-time market data.

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4)

## ✨ Features

- **🔐 Secure Authentication** — JWT-based signup, login, and logout
- **📋 Watchlist Management** — Create, rename, and delete multiple watchlists
- **📊 Stock Tracking** — Add/remove stocks with real-time price data
- **🔍 Stock Search** — Search stocks by name or symbol with instant results
- **📈 Market Overview** — Trending stocks ticker and market data dashboard
- **🎨 Premium UI** — Dark glassmorphism theme with smooth animations
- **📱 Responsive Design** — Works on desktop, tablet, and mobile
- **🐳 Docker Ready** — One-command deployment with Docker Compose
- **🔄 Auto-Refresh** — Stock prices update every 30 seconds

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Backend | Express.js + Node.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Stock Data | Finnhub API + Mock fallback |
| Containerization | Docker + Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Docker)
- (Optional) Finnhub API key from [finnhub.io](https://finnhub.io)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd Proffnitt

# Set your Finnhub API key (optional)
export FINNHUB_API_KEY=your_key_here

# Start all services
docker-compose up --build
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Option 2: Local Development

```bash
# 1. Start MongoDB (via Docker or locally)
docker run -d -p 27017:27017 --name mongodb mongo:7

# 2. Setup backend
cd server
cp .env.example .env
# Edit .env with your FINNHUB_API_KEY
npm install
npm run dev

# 3. Setup frontend (new terminal)
cd client
npm install
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
Proffnitt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API call abstraction
│   │   ├── hooks/          # Custom React hooks
│   │   └── index.css       # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express backend
│   ├── config/             # DB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth & error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── data/               # Mock stock data
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Watchlists
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/watchlists` | Get all watchlists |
| POST | `/api/watchlists` | Create watchlist |
| GET | `/api/watchlists/:id` | Get single watchlist |
| PUT | `/api/watchlists/:id` | Rename watchlist |
| DELETE | `/api/watchlists/:id` | Delete watchlist |
| POST | `/api/watchlists/:id/stocks` | Add stock |
| DELETE | `/api/watchlists/:id/stocks/:symbol` | Remove stock |

### Stocks
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/stocks/search?q=` | Search stocks |
| GET | `/api/stocks/quote/:symbol` | Get stock quote |
| GET | `/api/stocks/profile/:symbol` | Get company profile |
| GET | `/api/stocks/trending` | Get trending stocks |
| POST | `/api/stocks/batch` | Get batch quotes |

## 🔑 Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/proffnitt` |
| `JWT_SECRET` | JWT signing secret | Required |
| `FINNHUB_API_KEY` | Finnhub API key | Optional (uses mock data if empty) |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 📝 License

MIT
