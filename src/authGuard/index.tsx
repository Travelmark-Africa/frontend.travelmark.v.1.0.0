import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRoute({ redirectPath = '/auth/login' }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute({ redirectPath = '/dashboard' }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
