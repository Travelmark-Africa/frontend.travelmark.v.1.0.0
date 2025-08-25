import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

// Loading component for auth checks
const AuthLoadingScreen = () => (
  <div className='min-h-screen flex items-center justify-center bg-background '>
    <div className='flex flex-col items-center gap-4'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      <p className='text-sm text-muted-foreground'>Checking authentication...</p>
    </div>
  </div>
);

export default function ProtectedRoute({ redirectPath = '/auth/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute({ redirectPath = '/dashboard/company-settings' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
