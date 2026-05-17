import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiTrendingUp, HiLogout, HiMenu, HiX, HiUser } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent-cyan/25 transition-all duration-300">
              <HiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              StalkMarket
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/'
                  ? 'text-accent-cyan'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Dashboard
            </Link>

            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                  <HiUser className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 font-medium">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-loss hover:bg-loss/10 rounded-lg transition-all duration-200"
                id="logout-button"
              >
                <HiLogout className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/'
                  ? 'text-accent-cyan bg-accent-cyan/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                <HiUser className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-loss hover:bg-loss/10 rounded-lg transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
