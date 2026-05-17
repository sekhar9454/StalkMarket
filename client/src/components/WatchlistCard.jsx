import { Link } from 'react-router-dom';
import { HiFolder, HiChevronRight, HiTrash, HiClock } from 'react-icons/hi';

const WatchlistCard = ({ watchlist, onDelete }) => {
  const stockCount = watchlist.stocks?.length || 0;
  const previewStocks = watchlist.stocks?.slice(0, 3) || [];
  const timeAgo = getTimeAgo(watchlist.updatedAt);

  return (
    <div className="card-interactive group animate-slide-up">
      <Link to={`/watchlist/${watchlist._id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center group-hover:border-accent-cyan/30 transition-colors">
              <HiFolder className="w-5 h-5 text-accent-purple group-hover:text-accent-cyan transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-accent-cyan transition-colors">
                {watchlist.name}
              </h3>
              <p className="text-xs text-gray-500">
                {stockCount} {stockCount === 1 ? 'stock' : 'stocks'}
              </p>
            </div>
          </div>
          <HiChevronRight className="w-5 h-5 text-gray-600 group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stock Preview */}
        {previewStocks.length > 0 ? (
          <div className="space-y-1.5 mb-4">
            {previewStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03]"
              >
                <span className="text-xs font-medium text-gray-300">
                  {stock.symbol}
                </span>
                <span className="text-xs text-gray-500 truncate ml-2 max-w-[120px]">
                  {stock.name}
                </span>
              </div>
            ))}
            {stockCount > 3 && (
              <p className="text-xs text-gray-500 pl-3">
                +{stockCount - 3} more
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4 px-3 py-4 rounded-lg border border-dashed border-white/10 text-center">
            <p className="text-xs text-gray-500">No stocks added yet</p>
          </div>
        )}

        <div className="flex items-center gap-1 text-[10px] text-gray-600">
          <HiClock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </Link>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(watchlist._id);
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-loss hover:bg-loss/10 rounded-lg transition-all duration-200"
        title="Delete watchlist"
      >
        <HiTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default WatchlistCard;
