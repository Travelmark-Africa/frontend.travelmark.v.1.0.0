import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

interface User {
  token: string;
  fullName: string;
  role: string;
}

export const useAuth = (): { user: User | null } => {
  const { userToken } = useSelector((state: RootState) => state.auth);

  if (!userToken) {
    return { user: null };
  }

  try {
    const decodedToken = jwtDecode<Omit<User, 'token'>>(userToken);
    return {
      user: {
        token: userToken,
        fullName: decodedToken.fullName,
        role: decodedToken.role,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';
    toast.error(errorMessage, {
      duration: 2000,
    });
    return { user: null };
  }
};
