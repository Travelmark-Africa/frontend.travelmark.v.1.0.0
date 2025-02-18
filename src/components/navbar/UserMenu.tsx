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
      <DialogContent className='sm:max-w-md mx-4 md:mx-auto'>
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
              <img src='/google.svg' alt='Google' className='mr-2 h-4 w-4' />
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
            <div className='hidden md:block'>
              <Avatar className='bg-primary text-white'>
                <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
            </div>
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
