import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { stockService } from '../services/stockService';
import { HiSearch, HiX, HiPlus } from 'react-icons/hi';

const SearchBar = ({ onAddStock, existingSymbols = [] }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const { data } = await stockService.search(debouncedQuery);
        setResults(data || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleAdd = (stock) => {
    onAddStock({
      symbol: stock.symbol,
      name: stock.description || stock.name,
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search stocks by name or symbol..."
          className="input-field pl-12 pr-10"
          id="stock-search-input"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1">
          <div className="h-0.5 bg-dark-700 rounded overflow-hidden">
            <div className="h-full w-1/3 bg-accent-cyan rounded animate-shimmer" />
          </div>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto animate-slide-down shadow-2xl shadow-black/50">
          {results.map((stock) => {
            const alreadyAdded = existingSymbols.includes(stock.symbol);
            return (
              <button
                key={stock.symbol}
                onClick={() => !alreadyAdded && handleAdd(stock)}
                disabled={alreadyAdded}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  alreadyAdded
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-white/5 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-accent-cyan">
                      {stock.symbol?.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {stock.symbol}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {stock.description || stock.name}
                    </p>
                  </div>
                </div>
                {alreadyAdded ? (
                  <span className="text-[10px] text-gray-500 font-medium">
                    Added
                  </span>
                ) : (
                  <HiPlus className="w-4 h-4 text-accent-cyan" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && !loading && results.length === 0 && query.length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-6 text-center z-50 animate-slide-down">
          <p className="text-sm text-gray-400">No stocks found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
