import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { watchlistService } from '../services/watchlistService';
import { stockService } from '../services/stockService';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import { toast } from '../components/Toast';
import {
  HiArrowLeft,
  HiPencil,
  HiCheck,
  HiX,
  HiTrash,
  HiRefresh,
  HiClock,
  HiChartBar,
} from 'react-icons/hi';

const WatchlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState(null);
  const [stockQuotes, setStockQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    try {
      const { data } = await watchlistService.getById(id);
      setWatchlist(data);
      setNewName(data.name);

      // Fetch quotes for all stocks
      if (data.stocks?.length > 0) {
        const symbols = data.stocks.map((s) => s.symbol);
        const { data: quotes } = await stockService.getBatchQuotes(symbols);
        const quotesMap = {};
        quotes.forEach((q) => {
          quotesMap[q.symbol] = q;
        });
        setStockQuotes(quotesMap);
      }
    } catch (error) {
      toast.error('Failed to load watchlist');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Auto-refresh quotes every 30 seconds
  useEffect(() => {
    if (!watchlist?.stocks?.length) return;
    const interval = setInterval(async () => {
      try {
        const symbols = watchlist.stocks.map((s) => s.symbol);
        const { data: quotes } = await stockService.getBatchQuotes(symbols);
        const quotesMap = {};
        quotes.forEach((q) => {
          quotesMap[q.symbol] = q;
        });
        setStockQuotes(quotesMap);
      } catch {
        // Silent fail on auto-refresh
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [watchlist?.stocks]);

  const handleRefresh = async () => {
    if (!watchlist?.stocks?.length) return;
    setRefreshing(true);
    try {
      const symbols = watchlist.stocks.map((s) => s.symbol);
      const { data: quotes } = await stockService.getBatchQuotes(symbols);
      const quotesMap = {};
      quotes.forEach((q) => {
        quotesMap[q.symbol] = q;
      });
      setStockQuotes(quotesMap);
      toast.success('Prices refreshed');
    } catch {
      toast.error('Failed to refresh prices');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === watchlist.name) {
      setEditingName(false);
      setNewName(watchlist.name);
      return;
    }

    try {
      const { data } = await watchlistService.update(id, newName.trim());
      setWatchlist(data);
      setEditingName(false);
      toast.success('Watchlist renamed');
    } catch {
      toast.error('Failed to rename watchlist');
    }
  };

  const handleAddStock = async ({ symbol, name }) => {
    try {
      const { data } = await watchlistService.addStock(id, symbol, name);
      setWatchlist(data);

      // Fetch quote for new stock
      const { data: quote } = await stockService.getQuote(symbol);
      if (quote) {
        setStockQuotes((prev) => ({ ...prev, [symbol]: quote }));
      }

      toast.success(`${symbol} added to watchlist`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to add ${symbol}`
      );
    }
  };

  const handleRemoveStock = async (symbol) => {
    try {
      const { data } = await watchlistService.removeStock(id, symbol);
      setWatchlist(data);
      setStockQuotes((prev) => {
        const updated = { ...prev };
        delete updated[symbol];
        return updated;
      });
      toast.success(`${symbol} removed`);
    } catch {
      toast.error(`Failed to remove ${symbol}`);
    }
  };

  const handleDeleteWatchlist = async () => {
    if (!confirm(`Delete "${watchlist.name}"? This cannot be undone.`)) return;
    try {
      await watchlistService.delete(id);
      toast.success('Watchlist deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete watchlist');
    }
  };

  if (loading) {
    return (
      <div className="page-bg">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-xl" />
              <div className="skeleton w-48 h-8 rounded" />
            </div>
            <div className="skeleton w-full h-12 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton w-full h-36 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const existingSymbols = watchlist?.stocks?.map((s) => s.symbol) || [];

  return (
    <div className="page-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2.5 glass rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <HiArrowLeft className="w-5 h-5" />
            </Link>

            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setEditingName(false);
                      setNewName(watchlist.name);
                    }
                  }}
                  className="input-field text-xl font-bold py-2 w-64"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="p-2 text-gain hover:bg-gain/10 rounded-lg transition-colors"
                >
                  <HiCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNewName(watchlist.name);
                  }}
                  className="p-2 text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {watchlist?.name}
                </h1>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-2 text-gray-500 hover:text-accent-cyan hover:bg-white/5 rounded-lg transition-colors"
                  title="Rename watchlist"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`btn-ghost flex items-center gap-2 ${
                refreshing ? 'animate-spin' : ''
              }`}
              title="Refresh prices"
            >
              <HiRefresh className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleDeleteWatchlist}
              className="btn-danger flex items-center gap-2"
            >
              <HiTrash className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiChartBar className="w-4 h-4" />
            <span>
              {watchlist?.stocks?.length || 0}{' '}
              {watchlist?.stocks?.length === 1 ? 'stock' : 'stocks'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiClock className="w-4 h-4" />
            <span>
              Updated{' '}
              {new Date(watchlist?.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-up">
          <SearchBar
            onAddStock={handleAddStock}
            existingSymbols={existingSymbols}
          />
        </div>

        {/* Stocks Grid */}
        {watchlist?.stocks?.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
              <HiChartBar className="w-8 h-8 text-accent-purple" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No stocks in this watchlist
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Use the search bar above to find and add stocks to your watchlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watchlist?.stocks?.map((stock) => {
              const quote = stockQuotes[stock.symbol];
              return (
                <StockCard
                  key={stock.symbol}
                  stock={{
                    ...stock,
                    ...(quote || {}),
                  }}
                  showRemove
                  onRemove={handleRemoveStock}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistDetail;
