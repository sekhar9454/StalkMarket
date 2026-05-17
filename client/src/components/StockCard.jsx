import { HiTrendingUp, HiTrendingDown, HiMinus } from 'react-icons/hi';

const StockCard = ({ stock, onRemove, showRemove = false, compact = false }) => {
  const isPositive = stock.change > 0;
  const isNeutral = stock.change === 0;
  const ticker = stock.displaySymbol || stock.symbol?.replace('.NS', '').replace('.BO', '');

  if (compact) {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent-cyan">
              {ticker?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{ticker}</p>
            <p className="text-xs text-gray-500 truncate max-w-[120px]">
              {stock.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          {stock.price ? (
            <>
              <p className="text-sm font-mono font-semibold text-white">
                ₹{stock.price?.toFixed(2)}
              </p>
              <p
                className={`text-xs font-mono font-medium ${
                  isPositive ? 'text-gain' : isNeutral ? 'text-gray-400' : 'text-loss'
                }`}
              >
                {isPositive ? '+' : ''}
                {stock.changePercent?.toFixed(2)}%
              </p>
            </>
          ) : (
            <div className="skeleton w-16 h-4 rounded" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 flex items-center justify-center">
            <span className="text-sm font-bold text-accent-cyan">
              {ticker?.substring(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{ticker}</h3>
            <p className="text-xs text-gray-400 truncate max-w-[140px]">
              {stock.name}
            </p>
          </div>
        </div>
        {showRemove && onRemove && (
          <button
            onClick={() => onRemove(stock.symbol)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-loss hover:bg-loss/10 rounded-lg transition-all duration-200"
            title="Remove stock"
          >
            <HiMinus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          {stock.price ? (
            <p className="text-lg font-mono font-bold text-white">
              ₹{stock.price?.toFixed(2)}
            </p>
          ) : (
            <div className="skeleton w-20 h-6 rounded" />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {stock.price ? (
            <>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold ${
                  isPositive
                    ? 'bg-gain/10 text-gain'
                    : isNeutral
                    ? 'bg-gray-500/10 text-gray-400'
                    : 'bg-loss/10 text-loss'
                }`}
              >
                {isPositive ? (
                  <HiTrendingUp className="w-3.5 h-3.5" />
                ) : isNeutral ? (
                  <HiMinus className="w-3.5 h-3.5" />
                ) : (
                  <HiTrendingDown className="w-3.5 h-3.5" />
                )}
                {isPositive ? '+' : ''}
                {stock.changePercent?.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="skeleton w-16 h-6 rounded" />
          )}
        </div>
      </div>

      {stock.high && (
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">High</p>
            <p className="text-xs font-mono text-gray-300">₹{stock.high?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Low</p>
            <p className="text-xs font-mono text-gray-300">₹{stock.low?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Open</p>
            <p className="text-xs font-mono text-gray-300">₹{stock.open?.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;
