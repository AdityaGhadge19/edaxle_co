import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const AuthLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">L1</span>
          </div>
          <span className="text-xl font-bold text-text-primary">EdAxle</span>
        </Link>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 mx-4 bg-card-bg rounded-lg shadow-lg">
          <Outlet />
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} LearnOne. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;