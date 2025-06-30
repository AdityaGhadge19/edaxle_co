import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, Bell, User, LogOut, Settings, Plus, Video, Radio, Brain } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { searchService } from '../../lib/services/searchService';

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    
    if (value.trim().length > 2) {
      try {
        const results = await searchService.getGlobalSearchResults(value.trim());
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleCreateMenuClick = (path: string) => {
    setShowCreateMenu(false);
    navigate(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border-color transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">L1</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">EdAxle</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for videos, courses, teachers..."
                className="w-full px-4 py-2 pl-10 pr-16 rounded-full border border-border-color bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchResults && setShowSearchResults(true)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                {searchQuery && (
                  <button
                    type="button"
                    className="p-1 mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 mr-1 bg-primary text-white rounded-full hover:bg-primary-dark transition"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border border-border-color rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.videos.length > 0 && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Videos</h3>
                    {searchResults.videos.slice(0, 3).map((video: any) => (
                      <Link
                        key={video._id}
                        to={`/video/${video._id}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <img src={video.thumbnailUrl} alt={video.title} className="w-12 h-8 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.author.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.courses.length > 0 && (
                  <div className="p-3 border-t border-border-color">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Courses</h3>
                    {searchResults.courses.slice(0, 2).map((course: any) => (
                      <Link
                        key={course._id}
                        to={`/course/${course._id}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <img src={course.thumbnailUrl} alt={course.title} className="w-12 h-8 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.instructor.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.teachers.length > 0 && (
                  <div className="p-3 border-t border-border-color">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Teachers</h3>
                    {searchResults.teachers.slice(0, 2).map((teacher: any) => (
                      <Link
                        key={teacher._id}
                        to={`/teacher/${teacher.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <img src={teacher.avatar} alt={teacher.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium">{teacher.name}</p>
                          <p className="text-xs text-gray-500">{teacher.followerCount} followers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="flex items-center space-x-2">
            {/* Teacher Create Menu */}
            {user?.role === 'teacher' && (
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  aria-label="Create content"
                >
                  <Plus size={20} />
                </button>
                
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-border-color rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => handleCreateMenuClick('/teacher/upload')}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      <Video size={16} />
                      <span>Upload Video</span>
                    </button>
                    
                    <button
                      onClick={() => handleCreateMenuClick('/teacher/livestream/create')}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      <Radio size={16} />
                      <span>Start Live Stream</span>
                    </button>
                    
                    <button
                      onClick={() => handleCreateMenuClick('/teacher/quiz/create')}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      <Brain size={16} />
                      <span>Create Quiz</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1"
                >
                  <div className="relative">
                    <Bell size={20} className="mr-2" />
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                      3
                    </span>
                  </div>
                  
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-border-color rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border-color">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    
                    <Link 
                      to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        <span>Settings</span>
                      </div>
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-red-600 dark:text-red-400"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-full transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;