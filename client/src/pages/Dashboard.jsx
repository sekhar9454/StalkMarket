import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { watchlistService } from '../services/watchlistService';
import { stockService } from '../services/stockService';
import WatchlistCard from '../components/WatchlistCard';
import StockCard from '../components/StockCard';
import { toast } from '../components/Toast';
import {
  HiPlus,
  HiX,
  HiCollection,
  HiTrendingUp,
  HiChartBar,
  HiLightningBolt,
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState([]);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [watchlistRes, trendingRes] = await Promise.all([
        watchlistService.getAll(),
        stockService.getTrending(),
      ]);
      setWatchlists(watchlistRes.data || []);
      setTrendingStocks(trendingRes.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) {
      toast.error('Please enter a watchlist name');
      return;
    }

    setCreating(true);
    try {
      const { data } = await watchlistService.create(newWatchlistName.trim());
      setWatchlists((prev) => [data, ...prev]);
      setNewWatchlistName('');
      setShowCreateModal(false);
      toast.success(`"${data.name}" created!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create watchlist');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWatchlist = async (id) => {
    const wl = watchlists.find((w) => w._id === id);
    if (!confirm(`Delete "${wl?.name}"? This cannot be undone.`)) return;

    try {
      await watchlistService.delete(id);
      setWatchlists((prev) => prev.filter((w) => w._id !== id));
      toast.success('Watchlist deleted');
    } catch {
      toast.error('Failed to delete watchlist');
    }
  };

  // Count total stocks across all watchlists
  const totalStocks = watchlists.reduce(
    (acc, wl) => acc + (wl.stocks?.length || 0),
    0
  );

  return (
    <div className="page-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back,{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400">
            Track and manage your stock watchlists
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                <HiCollection className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {watchlists.length}
                </p>
                <p className="text-xs text-gray-500">Watchlists</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                <HiChartBar className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalStocks}</p>
                <p className="text-xs text-gray-500">Stocks Tracked</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gain/10 flex items-center justify-center">
                <HiTrendingUp className="w-5 h-5 text-gain" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {trendingStocks.filter((s) => s.change > 0).length}
                </p>
                <p className="text-xs text-gray-500">Gainers</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <HiLightningBolt className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">NSE</p>
                <p className="text-xs text-gray-500">Market Data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Stocks Ticker */}
        {trendingStocks.length > 0 && (
          <div className="mb-8 glass rounded-xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <HiLightningBolt className="w-4 h-4 text-accent-cyan" />
              <h2 className="text-sm font-semibold text-gray-300">
                Trending Stocks
              </h2>
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-3 animate-ticker hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
                {[...trendingStocks, ...trendingStocks].map((stock, i) => (
                  <div
                    key={`${stock.symbol}-${i}`}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/[0.03] flex-shrink-0 min-w-[200px]"
                  >
                    <span className="text-sm font-bold text-white">
                      {stock.displaySymbol || stock.symbol?.replace('.NS', '')}
                    </span>
                    <span className="text-sm font-mono text-gray-300">
                      ₹{stock.price?.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        stock.change > 0 ? 'text-gain' : 'text-loss'
                      }`}
                    >
                      {stock.change > 0 ? '+' : ''}
                      {stock.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Watchlists Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">My Watchlists</h2>
              <p className="text-sm text-gray-500">
                Organize and track your investments
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
              id="create-watchlist-button"
            >
              <HiPlus className="w-4 h-4 relative z-10" />
              <span className="relative z-10 hidden sm:inline">New Watchlist</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl skeleton" />
                    <div className="flex-1">
                      <div className="skeleton w-24 h-5 rounded mb-1" />
                      <div className="skeleton w-16 h-3 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton w-full h-8 rounded-lg" />
                    <div className="skeleton w-full h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : watchlists.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4">
                <HiCollection className="w-8 h-8 text-accent-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No watchlists yet
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                Create your first watchlist to start tracking stocks and
                monitoring the market.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <HiPlus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Create Your First Watchlist</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlists.map((wl) => (
                <WatchlistCard
                  key={wl._id}
                  watchlist={wl}
                  onDelete={handleDeleteWatchlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trending Stocks Grid */}
        {trendingStocks.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">NSE Market Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingStocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Watchlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative glass-strong rounded-2xl p-8 w-full max-w-md animate-scale-in">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Create New Watchlist
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Give your watchlist a meaningful name
              </p>
            </div>

            <form onSubmit={handleCreateWatchlist}>
              <input
                type="text"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="e.g., Nifty 50, Banking Stocks, IT Portfolio..."
                className="input-field mb-4"
                autoFocus
                id="watchlist-name-input"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  id="confirm-create-watchlist"
                >
                  {creating ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiPlus className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
