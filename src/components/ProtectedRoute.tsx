
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import { useEffect } from 'react';

type Props = {
  allowedRole: 'admin' | 'user';
};

const ProtectedRoute = ({ allowedRole }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Store current admin path when navigating between admin pages
  useEffect(() => {
    if (allowedRole === 'admin' && isAuthenticated && user?.role === 'admin') {
      localStorage.setItem('lastAdminPath', location.pathname);
    }
  }, [location.pathname, isAuthenticated, user, allowedRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not authenticated or wrong role, redirect to login
  if (!isAuthenticated || user?.role !== allowedRole) {
    // For admin routes, store the intended path to redirect back after login
    if (allowedRole === 'admin') {
      localStorage.setItem('lastAdminPath', location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  // If allowedRole is admin, wrap the Outlet with AdminLayout
  return allowedRole === 'admin' ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
