import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { setCredentials } from '@/redux/reducers/authSlice';
import { useLoginMutation, useCreateUserMutation, useLoginWithGoogleMutation } from '@/redux/api/apiSlice';
import { handleError } from '@/lib/utils';
import { toast } from 'sonner';
import { Alert } from './ui/alert';
import { useForm } from 'react-hook-form';

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

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, mode: initialMode }) => {
  const [mode, setMode] = useState(initialMode);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [createUser, { isLoading: isSignupLoading }] = useCreateUserMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading }] = useLoginWithGoogleMutation();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (mode === 'login') {
        const credentials: LoginCredentials = {
          email: data.email,
          password: data.password,
        };
        const res = await login(credentials).unwrap();
        if (res.ok) {
          dispatch(setCredentials(res.token));
          reset();
          onClose();
        }
      } else {
        const credentials: SignupCredentials = {
          name: data.name,
          email: data.email,
          password: data.password,
          provider: 'LOCAL',
        };
        const res = await createUser(credentials).unwrap();
        if (res.ok) {
          toast.success(res.message);
          reset();
          onClose();
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
      handleError(error);
    }
  };

  const toggleMode = () => {
    reset();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            {mode === 'login' ? (
              <Alert variant='info' className='mt-2 py-2 font-poppins'>
                <span className='text-blue-900 font-medium'>Enter your credentials to sign in</span>
              </Alert>
            ) : (
              <Alert variant='info' className='mt-2 py-2 font-poppins'>
                <span className='text-blue-900 font-medium'>Register a new account with email or google</span>
              </Alert>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pb-4'>
          {mode === 'signup' && (
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                placeholder='Enter your full name'
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='your.email@example.com'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-white py-2 h-10'
            disabled={isLoginLoading || isSignupLoading}
          >
            {(isLoginLoading || isSignupLoading) && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {mode === 'login' ? 'Login' : 'Sign up'}
          </Button>

          <div className='text-center text-sm'>
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type='button'
                  className='text-primary hover:underline font-medium cursor-pointer'
                  onClick={toggleMode}
                >
                  Signup here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type='button'
                  className='text-primary hover:underline font-medium cursor-pointer'
                  onClick={toggleMode}
                >
                  Login here
                </button>
              </p>
            )}
          </div>

          <div className='relative my-3'>
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
            className='w-full hover:bg-secondary/10 h-10'
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
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

export default AuthDialog;
