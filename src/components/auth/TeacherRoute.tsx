import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TeacherRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated && user?.role === 'teacher' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default TeacherRoute;