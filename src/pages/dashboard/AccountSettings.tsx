import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Phone, ShieldCheck, AlertCircle, Calendar, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthService } from '@/appwrite/auth';
import { formatDateWithOrdinal, handleError } from '@/lib/utils';

interface PasswordChangeInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings = () => {
  const { user, isLoading } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const authService = new AuthService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordChangeInputs>();

  const newPassword = watch('newPassword');

  if (isLoading) {
    return (
      <Layout>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300'></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='text-center p-8 bg-red-50 border border-red-200 rounded-lg'>
            <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
            <h2 className='text-xl font-semibold text-red-700'>Authentication Error</h2>
            <p className='mt-2 text-red-600'>Unable to load user information. Please log in again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const onPasswordSubmit: SubmitHandler<PasswordChangeInputs> = async data => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (data.currentPassword === data.newPassword) {
      toast.error('New password must be different from your current password');
      return;
    }

    try {
      setIsChangingPassword(true);

      try {
        await authService.updatePassword(data.newPassword, data.currentPassword);
        toast.success('Password changed successfully');
        reset();

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } catch (authError) {
        handleError(authError);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Layout>
      <div className='max-w-4xl py-4'>
        <div className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900'>Account Settings</h3>
          <p className='text-gray-600 mt-2'>Manage your account information and security settings</p>
        </div>

        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='mb-6 bg-primary/5 border'>
            <TabsTrigger
              value='profile'
              className='data-[state=active]:bg-white! data-[state=active]:text-gray-900! text-gray-600!'
            >
              Profile Information
            </TabsTrigger>
            <TabsTrigger
              value='security'
              className='data-[state=active]:bg-white! data-[state=active]:text-gray-900! text-gray-600!'
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value='profile'>
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Your personal account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
                    <div className='h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4'>
                      <span className='text-xl font-bold text-blue-700'>{user.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900'>{user.name}</h3>
                      <div className='flex items-center mt-1 gap-2'>
                        {user.labels && user.labels.includes('admin') && (
                          <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                            ADMIN
                          </span>
                        )}
                        <span
                          className={`flex items-center text-sm ${user.status ? 'text-green-600' : 'text-red-600'}`}
                        >
                          <ShieldCheck className='h-4 w-4 mr-1' />
                          {user.status ? 'Active Account' : 'Inactive Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Mail className='h-4 w-4' />
                        <span className='text-sm font-medium'>Email Address</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-900'>{user.email}</span>
                        {user.emailVerification && (
                          <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700'>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Phone className='h-4 w-4' />
                        <span className='text-sm font-medium'>Phone Number</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-900'>{user.phone || 'Not set'}</span>
                        {user.phoneVerification ? (
                          <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700'>
                            Verified
                          </span>
                        ) : (
                          user.phone && (
                            <span className='inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700'>
                              Not Verified
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Calendar className='h-4 w-4' />
                        <span className='text-sm font-medium'>Account Created</span>
                      </div>
                      <div className='text-gray-900'>
                        {user.registration ? formatDateWithOrdinal(user.registration) : 'Unknown'}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Key className='h-4 w-4' />
                        <span className='text-sm font-medium'>Last Password Update</span>
                      </div>
                      <div className='text-gray-900'>
                        {user.passwordUpdate ? formatDateWithOrdinal(user.passwordUpdate) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='security'>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to enhance your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onPasswordSubmit)} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <div className='relative'>
                      <Input
                        id='currentPassword'
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder='Enter your current password'
                        className='pr-10'
                        {...register('currentPassword', {
                          required: 'Current password is required',
                        })}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className='text-sm text-red-600'>{errors.currentPassword.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder='Enter your new password'
                        className='pr-10'
                        {...register('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                            message: 'Password must include lowercase, uppercase, number and special character',
                          },
                        })}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    {errors.newPassword && <p className='text-sm text-red-600'>{errors.newPassword.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm your new password'
                        className='pr-10'
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === newPassword || "Passwords don't match",
                        })}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className='text-sm text-red-600'>{errors.confirmPassword.message}</p>}
                  </div>

                  <div className='pt-2'>
                    <Button
                      type='submit'
                      size='sm'
                      isLoading={isChangingPassword}
                      loadingText='Updating password...'
                      disabled={isChangingPassword}
                      className='text-[0.87rem]!'
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className='mt-6'>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <h6 className='font-bold text-gray-900'>Multi-Factor Authentication (MFA)</h6>
                    <p className='text-sm text-gray-600 mt-1'>Protect your account with an additional security layer</p>
                  </div>
                  <Button size='sm' className='text-[0.87rem]!' variant={user.mfa ? 'destructive' : 'default'} disabled>
                    {user.mfa ? 'Disable MFA' : 'Enable MFA'}
                  </Button>
                </div>
                {!user.mfa && (
                  <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start'>
                    <AlertCircle className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-600' />
                    <p className='text-sm text-yellow-800'>
                      We strongly recommend enabling two-factor authentication for enhanced account security.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountSettings;
