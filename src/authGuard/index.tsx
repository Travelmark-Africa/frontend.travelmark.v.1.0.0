import { useAuth } from '../hooks/useAuth';
import { Outlet, Navigate } from 'react-router-dom';

const AuthGuard = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to='/auth/login' replace />;
};

export default AuthGuard;
