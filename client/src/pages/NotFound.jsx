import { Link } from 'react-router-dom';
import { HiHome, HiTrendingUp } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-dark-900">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-accent-purple/5 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center animate-slide-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 border border-white/10 mb-6">
          <HiTrendingUp className="w-10 h-10 text-accent-cyan" />
        </div>
        <h1 className="text-7xl font-black gradient-text mb-4">404</h1>
        <p className="text-xl text-gray-300 font-medium mb-2">Page Not Found</p>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <HiHome className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
