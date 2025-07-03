import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, BookOpen, Award, Clock, Bookmark, 
  Heart, Video, Upload, BarChart2, Users, 
  Brain
} from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
};

const Sidebar = ({ isOpen, onClose, isCollapsed }: SidebarProps) => {
  const { user, isAuthenticated } = useAuth();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`fixed top-16 bottom-0 left-0 z-30 ${sidebarWidth} bg-sidebar-bg border-r border-border-color transform transition-all duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <nav className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-1`}>
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                }`
              }
              title={isCollapsed ? 'Home' : ''}
            >
              <Home size={20} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Home</span>}
            </NavLink>
            
            <NavLink
              to="/category/education"
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                }`
              }
              title={isCollapsed ? 'Explore' : ''}
            >
              <BookOpen size={20} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Explore</span>}
            </NavLink>
            
            <NavLink
              to="/quizone"
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                }`
              }
              title={isCollapsed ? 'Quizone' : ''}
            >
              <Brain size={20} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Quizone</span>}
            </NavLink>

            <NavLink
              to="/certifications"
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                }`
              }
              title={isCollapsed ? 'Certifications' : ''}
            >
              <Award size={20} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Certifications</span>}
            </NavLink>
            
            {isAuthenticated && (
              <>
                {!isCollapsed && <hr className="my-4 border-border-color" />}
                
                {!isCollapsed && (
                  <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Your Library
                  </h3>
                )}
                
                <NavLink
                  to="/history"
                  onClick={handleLinkClick}
                  className={({ isActive }) => 
                    `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                      isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                    }`
                  }
                  title={isCollapsed ? 'History' : ''}
                >
                  <Clock size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span>History</span>}
                </NavLink>
                
                <NavLink
                  to="/saved"
                  onClick={handleLinkClick}
                  className={({ isActive }) => 
                    `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                      isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                    }`
                  }
                  title={isCollapsed ? 'Saved' : ''}
                >
                  <Bookmark size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span>Saved</span>}
                </NavLink>
                
                <NavLink
                  to="/following"
                  onClick={handleLinkClick}
                  className={({ isActive }) => 
                    `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                      isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                    }`
                  }
                  title={isCollapsed ? 'Following' : ''}
                >
                  <Heart size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span>Following</span>}
                </NavLink>
                
                {user?.role === 'teacher' && (
                  <>
                    {!isCollapsed && <hr className="my-4 border-border-color" />}
                    
                    {!isCollapsed && (
                      <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Teacher Tools
                      </h3>
                    )}
                    
                    <NavLink
                      to="/teacher/dashboard"
                      onClick={handleLinkClick}
                      className={({ isActive }) => 
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                          isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                        }`
                      }
                      title={isCollapsed ? 'Dashboard' : ''}
                    >
                      <BarChart2 size={20} className={isCollapsed ? '' : 'mr-3'} />
                      {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                    
                    <NavLink
                      to="/teacher/videos"
                      onClick={handleLinkClick}
                      className={({ isActive }) => 
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                          isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                        }`
                      }
                      title={isCollapsed ? 'My Videos' : ''}
                    >
                      <Video size={20} className={isCollapsed ? '' : 'mr-3'} />
                      {!isCollapsed && <span>My Videos</span>}
                    </NavLink>
                    
                    <NavLink
                      to="/teacher/upload"
                      onClick={handleLinkClick}
                      className={({ isActive }) => 
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                          isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                        }`
                      }
                      title={isCollapsed ? 'Upload' : ''}
                    >
                      <Upload size={20} className={isCollapsed ? '' : 'mr-3'} />
                      {!isCollapsed && <span>Upload</span>}
                    </NavLink>
                  </>
                )}
                
                {user?.role === 'student' && (
                  <>
                    {!isCollapsed && <hr className="my-4 border-border-color" />}
                    
                    {!isCollapsed && (
                      <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Student Tools
                      </h3>
                    )}
                    
                    <NavLink
                      to="/student/dashboard"
                      onClick={handleLinkClick}
                      className={({ isActive }) => 
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                          isActive ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium' : ''
                        }`
                      }
                      title={isCollapsed ? 'Dashboard' : ''}
                    >
                      <BarChart2 size={20} className={isCollapsed ? '' : 'mr-3'} />
                      {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                  </>
                )}
              </>
            )}
          </nav>
          
          {!isAuthenticated && !isCollapsed && (
            <div className="p-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm mb-3">Sign in to access personalized learning experiences</p>
                <NavLink
                  to="/login"
                  onClick={handleLinkClick}
                  className="inline-block py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-full transition text-sm font-medium"
                >
                  Sign In
                </NavLink>
              </div>
            </div>
          )}

          {/* Footer - Now inside the scrollable area at the bottom */}
          {!isCollapsed && (
            <div className="border-t border-border-color p-4 mt-8">
              <div className="space-y-4">
                <div>
                  <NavLink to="/" className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Ed</span>
                    </div>
                    <span className="text-lg font-bold">EdAxle</span>
                  </NavLink>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Empowering education worldwide.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold mb-2">Platform</h4>
                    <ul className="space-y-1">
                      <li>
                        <NavLink to="/about" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          About
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/careers" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          Careers
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/help" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          Help
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Legal</h4>
                    <ul className="space-y-1">
                      <li>
                        <NavLink to="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          Terms
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          Privacy
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/cookies" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                          Cookies
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border-color text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} EdAxle. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;