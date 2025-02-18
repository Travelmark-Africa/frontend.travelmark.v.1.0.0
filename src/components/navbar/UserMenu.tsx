import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout, setCredentials } from '@/redux/reducers/authSlice';
import { useLoginMutation, useCreateUserMutation, useLoginWithGoogleMutation } from '@/redux/api/apiSlice';
import { handleError } from '@/lib/utils';
import { toast } from 'sonner';

type Provider = 'LOCAL' | 'GOOGLE';

interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}
interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  provider: Provider;
}

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

const initialFormData: AuthFormData = {
  name: '',
  email: '',
  password: '',
};

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, mode }) => {
  const [formData, setFormData] = useState<AuthFormData>(initialFormData);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [createUser, { isLoading: isSignupLoading }] = useCreateUserMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading }] = useLoginWithGoogleMutation();

  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        const res = await login(credentials).unwrap();
        if (res.ok) {
          dispatch(setCredentials(res.token));
          onClose();
        }
      } else {
        const credentials: SignupCredentials = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          provider: 'LOCAL',
        };
        const res = await createUser(credentials).unwrap();
        if (res.ok) {
          toast.success(res.message);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle({ provider: 'GOOGLE' }).unwrap();
      onClose();
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {mode === 'login' ? 'Login' : 'Create an account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 py-4'>
          {mode === 'signup' && (
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input id='name' name='name' value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' value={formData.email} onChange={handleChange} required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-white rounded-md py-5'
            disabled={isLoginLoading || isSignupLoading}
          >
            {(isLoginLoading || isSignupLoading) && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {mode === 'login' ? 'Login' : 'Sign up'}
          </Button>

          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            )}
            Google
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleLogout = () => {
    dispatch(logout(user?.token));
    navigate('/');
  };

  const closeAuthDialog = () => setAuthMode(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='p-[2px] border border-primary/40 flex flex-row items-center rounded-full cursor-pointer hover:shadow-md transition'>
            <Avatar className='bg-primary text-white h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10'>
              <AvatarFallback className='text-xs sm:text-sm md:text-base'>{user?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[200px]' align='end' alignOffset={4} forceMount>
          {user ? (
            <>
              <DropdownMenuItem onClick={() => navigate('/my-trips-plans')}>My trip plans</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/favorites')}>My favorite destinations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/reservations')}>My bookings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setAuthMode('login')}>Login</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAuthMode('signup')}>Sign up</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {authMode && <AuthDialog isOpen={true} onClose={closeAuthDialog} mode={authMode} />}
    </>
  );
};

export default UserMenu;
