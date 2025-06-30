import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Collapse sidebar by default on video page
  useEffect(() => {
    const isVideoPage = /^\/video\/[\w-]+$/.test(location.pathname);
    setSidebarCollapsed(isVideoPage);
  }, [location.pathname]);

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      // On desktop, toggle collapse
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // On mobile, toggle open/close
      setSidebarOpen(!sidebarOpen);
    }
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 256; // 16 * 4 = 64px, 64 * 4 = 256px

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative pt-16">
        {' '}
        {/* Added pt-16 to account for fixed header */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          isCollapsed={sidebarCollapsed}
        />
        {/* Main content with proper spacing for sidebar */}
        <main
          className={`flex-1 transition-all duration-200 ease-in-out px-4 pt-6 pb-16 md:px-6 lg:px-8 overflow-x-hidden`}
          style={{
            marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0px',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
