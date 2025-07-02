import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import SettingsPage from './pages/SettingsPage';
import QuizonePage from './pages/QuizonePage';
import LiveStreamDashboard from './pages/LiveStreamDashboard';
import LiveStreamViewer from './pages/LiveStreamViewer';

// Auth Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import TeacherRoute from './components/auth/TeacherRoute';

function App() {
  const { isDarkMode } = useTheme();
  const { checkAuth } = useAuth();
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:videoId" element={<VideoPlayerPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/teacher/:teacherId" element={<TeacherProfilePage />} />
          <Route path="/quizone" element={<QuizonePage />} />
          <Route path="/live/:streamId" element={<LiveStreamViewer />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Teacher routes */}
          <Route element={<TeacherRoute />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/upload" element={<TeacherDashboard />} />
            <Route path="/teacher/livestream/create" element={<LiveStreamDashboard />} />
            <Route path="/teacher/quiz/create" element={<QuizonePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;