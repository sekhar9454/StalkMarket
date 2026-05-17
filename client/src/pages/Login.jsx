import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { HiTrendingUp, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-dark-900">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent-purple/5 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent-cyan/5 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-blue/3 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple mb-4 shadow-lg shadow-accent-cyan/20">
            <HiTrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to manage your watchlists</p>
        </div>

        {/* Login Form */}
        <div className="glass-strong rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12"
              id="login-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Track your favorite stocks in real-time
        </p>
      </div>
    </div>
  );
};

export default Login;
