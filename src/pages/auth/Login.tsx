import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logo1, missionImage } from '@/assets';
import BlurImage from '@/components/BlurImage';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticating } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = async data => {
    try {
      const session = await login(data.email, data.password);

      if (session) {
        navigate('/dashboard/company-settings');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      handleError(error);
    }
  };

  const currentYear: number = new Date().getFullYear();

  return (
    <div className='grid min-h-svh lg:grid-cols-2 bg-background'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <Link to='/' className='flex justify-center gap-2 md:justify-start'>
          <img className='mx-auto h-[52px] md:h-[64px] w-auto' src={logo1} alt='TravelMark Africa' />
        </Link>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-xl font-bold text-primary'>Login to your account</h1>
                <p className='text-balance text-sm text-primary/70'>
                  Enter your credentials below to login to your staff account
                </p>
              </div>

              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email' className='text-primary'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    className='border-border focus:border-primary focus:ring-primary'
                    disabled={isAuthenticating}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid email format',
                      },
                    })}
                  />
                  {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='password' className='text-primary'>
                    Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      placeholder='Enter your password'
                      type={showPassword ? 'text' : 'password'}
                      className='border-border focus:border-primary focus:ring-primary'
                      disabled={isAuthenticating}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isAuthenticating}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50'
                    >
                      {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                    </button>
                  </div>
                  {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
                </div>

                <Button
                  type='submit'
                  isLoading={isAuthenticating}
                  loadingText='Logging you in...'
                  disabled={isAuthenticating}
                  hideChevron
                >
                  Login
                </Button>
              </div>
            </form>

            <div className='text-center text-xs text-balance text-primary/60 mt-6'>
              &copy; {currentYear} TravelMark Africa. All rights reserved.
            </div>
          </div>
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block overflow-hidden'>
        {/* Loading state - Enhanced gradient bubbles/ripples background */}
        <div className='absolute inset-0 bg-gradient-to-br from-secondary/20 via-secondary/10 to-primary/20'>
          <div className='absolute inset-0 opacity-60'>
            <div
              className='absolute top-10 left-10 w-40 h-40 rounded-full blur-2xl animate-pulse'
              style={{
                background: 'radial-gradient(circle, hsl(36 80% 51% / 0.4) 0%, transparent 70%)',
              }}
            ></div>
            <div
              className='absolute top-1/4 right-20 w-64 h-64 rounded-full blur-3xl'
              style={{
                background: 'radial-gradient(circle, hsl(224 37% 21% / 0.3) 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite',
              }}
            ></div>
            <div
              className='absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full blur-2xl'
              style={{
                background: 'radial-gradient(circle, hsl(36 80% 51% / 0.35) 0%, transparent 70%)',
                animation: 'float 8s ease-in-out infinite reverse',
              }}
            ></div>
            <div
              className='absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse'
              style={{
                background: 'radial-gradient(circle, hsl(224 37% 21% / 0.25) 0%, transparent 70%)',
                animationDelay: '2s',
              }}
            ></div>
            <div
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl'
              style={{
                background: 'radial-gradient(circle, hsl(36 80% 51% / 0.3) 0%, transparent 70%)',
                animation: 'float 10s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div>

        {/* Actual login background image */}
        <BlurImage src={missionImage} alt='Login background' className='absolute inset-0 h-full w-full object-cover' />

        {/* Floating animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(2deg); }
            50% { transform: translateY(-10px) rotate(-1deg); }
            75% { transform: translateY(-15px) rotate(1deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoginPage;
