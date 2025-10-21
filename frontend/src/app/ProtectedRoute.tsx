import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export const ProtectedRoute = () => {
  const { isAdmin } = useAuthStore();

  if (!isAdmin) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
