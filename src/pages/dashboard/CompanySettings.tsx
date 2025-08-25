import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Save,
  Settings,
  Plus,
  X,
  Loader2,
  Edit,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  useGetCompanySettingsQuery,
  useCreateCompanySettingsMutation,
  useUpdateCompanySettingsMutation,
} from '@/hooks/useCompanySettings';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { handleError } from '@/lib/utils';

const CompanySettings = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: settingsResponse, isLoading: isLoadingSettings, error: fetchError } = useGetCompanySettingsQuery();
  const createMutation = useCreateCompanySettingsMutation();
  const updateMutation = useUpdateCompanySettingsMutation();

  // Extract the single company settings record (always at index 0 if exists)
  const existingSettings = settingsResponse?.data;
  const isFirstTimeSetup = !existingSettings;

  // Auto-enable edit mode for first time setup only - but wait for loading to complete
  useEffect(() => {
    if (!isLoadingSettings && isFirstTimeSetup) {
      setIsEditMode(true);
    } else if (!isLoadingSettings && existingSettings) {
      setIsEditMode(false);
    }
  }, [isLoadingSettings, isFirstTimeSetup, existingSettings]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CompanySettingsFormData>({
    mode: 'onBlur',
    defaultValues: {
      vision: '',
      mission: '',
      calendlyLink: '',
      phoneNumber: '',
      email: '',
      address: '',
      statistics: [{ key: '', value: '' }],
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'statistics',
  });

  // Parse statistics for display
  const parseStatistics = (statisticsString: string) => {
    if (!statisticsString) return [];
    try {
      const parsedStats = JSON.parse(statisticsString);
      if (Array.isArray(parsedStats)) {
        return parsedStats;
      }
    } catch {
      const lines = statisticsString.split('\n').filter(line => line.trim());
      return lines.map(line => {
        const [key, ...valueParts] = line.split(':');
        return {
          key: key?.trim() || '',
          value: valueParts.join(':').trim() || '',
        };
      });
    }
    return [];
  };

  // Loading skeleton component
  const CompanySettingsSkeleton = () => (
    <div className='space-y-8'>
      {/* Header Skeleton */}
      <div className='flex items-start justify-between'>
        <div className='space-y-1'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-5 w-96' />
        </div>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-6 w-20 rounded-full' />
          <Skeleton className='h-7 w-16' />
        </div>
      </div>

      {/* Cards Skeleton */}
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-4 w-80' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4'>
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className='h-16 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // View Mode Component
  const ViewModeContent = ({ settings }: { settings: CompanySettings }) => {
    const statistics = parseStatistics(settings.statistics || '');

    return (
      <div className='space-y-8'>
        {/* Company Identity */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>Company Identity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <Label className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Vision</Label>
                </div>
                <div className='bg-white p-4 rounded-xl border border-gray-100'>
                  <p className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap'>
                    {settings.vision || 'No vision statement provided'}
                  </p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-2 h-2 bg-indigo-500 rounded-full'></div>
                  <Label className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Mission</Label>
                </div>
                <div className='bg-white p-4 rounded-xl border border-gray-100'>
                  <p className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap'>
                    {settings.mission || 'No mission statement provided'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                  <Mail className='w-5 h-5 text-gray-500' />
                  <div>
                    <p className='text-xs text-gray-500 uppercase font-medium tracking-wide'>Email</p>
                    <p className='text-sm text-gray-900 font-medium'>{settings.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                  <Phone className='w-5 h-5 text-gray-500' />
                  <div>
                    <p className='text-xs text-gray-500 uppercase font-medium tracking-wide'>Phone</p>
                    <p className='text-sm text-gray-900 font-medium'>{settings.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                  <MapPin className='w-5 h-5 text-gray-500 mt-0.5' />
                  <div>
                    <p className='text-xs text-gray-500 uppercase font-medium tracking-wide mb-1'>Address</p>
                    <p className='text-sm text-gray-900 font-medium whitespace-pre-wrap leading-relaxed'>
                      {settings.address || 'No address provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                  <Calendar className='w-5 h-5 text-blue-600' />
                  <div className='flex-1'>
                    <p className='text-xs text-blue-700 uppercase font-medium tracking-wide'>Calendly Link</p>
                    <a
                      href={settings.calendlyLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 group'
                    >
                      Book a Meeting
                      <ExternalLink className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Statistics */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>Company Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {statistics.length > 0 ? (
              <div className='grid md:grid-cols-3 gap-4'>
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className='bg-white p-6 rounded-xl border border-gray-100 text-center group transition-shadow'
                  >
                    <div className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors'>
                      {stat.value}
                    </div>
                    <div className='text-sm text-gray-600 font-medium uppercase tracking-wide'>{stat.key}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Settings className='w-8 h-8 text-gray-400' />
                </div>
                <p className='text-gray-500'>No statistics configured yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-base font-bold text-gray-900'>Social Media Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-3 gap-4'>
              <a
                href={settings.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 transition-all group'
              >
                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                  <Linkedin className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-medium tracking-wide'>LinkedIn</p>
                  <p className='text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors'>
                    Company Page
                  </p>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors' />
              </a>

              <a
                href={settings.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 transition-all group'
              >
                <div className='w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors'>
                  <Instagram className='w-5 h-5 text-pink-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-medium tracking-wide'>Instagram</p>
                  <p className='text-sm text-gray-900 font-medium group-hover:text-pink-600 transition-colors'>
                    Profile
                  </p>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 ml-auto group-hover:text-pink-600 transition-colors' />
              </a>

              <a
                href={settings.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 transition-all group'
              >
                <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors'>
                  <Twitter className='w-5 h-5 text-gray-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-medium tracking-wide'>Twitter</p>
                  <p className='text-sm text-gray-900 font-medium group-hover:text-gray-700 transition-colors'>
                    Profile
                  </p>
                </div>
                <ExternalLink className='w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors' />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Load existing settings into form when available or switching to edit mode
  useEffect(() => {
    if (existingSettings && isEditMode) {
      // Parse statistics string back to array format for the form
      let statisticsArray = [{ key: '', value: '' }];
      if (existingSettings.statistics) {
        const parsedStats = parseStatistics(existingSettings.statistics);
        statisticsArray = parsedStats.length > 0 ? parsedStats : [{ key: '', value: '' }];
      }

      reset({
        vision: existingSettings.vision || '',
        mission: existingSettings.mission || '',
        calendlyLink: existingSettings.calendlyLink || '',
        phoneNumber: existingSettings.phoneNumber || '',
        email: existingSettings.email || '',
        address: existingSettings.address || '',
        statistics: statisticsArray,
        instagram: existingSettings.instagram || '',
        twitter: existingSettings.twitter || '',
        linkedin: existingSettings.linkedin || '',
      });
    }
  }, [existingSettings, reset, isEditMode]);

  const onSubmit = async (data: CompanySettingsFormData) => {
    try {
      // Filter out empty statistics pairs and validate at least one pair
      const validStatistics = data.statistics.filter(stat => stat.key.trim() && stat.value.trim());

      if (validStatistics.length === 0) {
        return;
      }

      // Use spread operator and type cast - simple and clean
      const payload = {
        ...data,
        statistics: JSON.stringify(validStatistics),
      } as CompanySettingsPayload;

      if (isFirstTimeSetup) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: existingSettings.$id!,
          data: payload,
        });
      }

      setShowSuccess(true);
      setIsEditMode(false);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancelEdit = () => {
    if (!isFirstTimeSetup) {
      setIsEditMode(false);
      reset();
    }
  };

  const isSubmittingForm = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const hasError = createMutation.error || updateMutation.error;

  // Loading state
  if (isLoadingSettings) {
    return (
      <DashboardLayout>
        <div className='py-8'>
          <CompanySettingsSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <DashboardLayout>
        <div className='py-8'>
          <Alert variant='error'>
            <div>Failed to load company settings. Please refresh the page or contact support.</div>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='py-8'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <h1 className='text-xl font-bold text-gray-900'>Company Settings</h1>
              <p className='text-base text-gray-600'>
                {isFirstTimeSetup
                  ? 'Set up your company information to get started'
                  : isEditMode
                  ? 'Edit your company information'
                  : 'Manage your company information and settings'}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  isFirstTimeSetup
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                <Settings className='h-3 w-3' />
                {isFirstTimeSetup ? 'Setup' : 'Active'}
              </div>

              {!isFirstTimeSetup && (
                <Button
                  onClick={() => (isEditMode ? handleCancelEdit() : setIsEditMode(true))}
                  variant={isEditMode ? 'outline' : 'default'}
                  size='sm'
                  className='h-6.5! text-xs px-2'
                  hideChevron
                >
                  {isEditMode ? (
                    <>
                      <X className='h-3 w-3' />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className='h-3 w-3' />
                      Edit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className='mb-8 space-y-4'>
          {isFirstTimeSetup && (
            <Alert variant='info'>
              <div>
                <strong>Welcome!</strong> Complete your company setup to activate all dashboard features.
              </div>
            </Alert>
          )}

          {showSuccess && (
            <Alert variant='success'>
              <div>
                <strong>Settings saved successfully!</strong> Your company information has been{' '}
                {isFirstTimeSetup ? 'created' : 'updated'}.
              </div>
            </Alert>
          )}

          {hasError && (
            <Alert variant='error'>
              <div>
                <strong>Failed to save settings.</strong> Please check your information and try again.
              </div>
            </Alert>
          )}
        </div>

        {/* Content - either view mode or edit mode */}
        {!isEditMode && existingSettings ? (
          <ViewModeContent settings={existingSettings} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            {/* Company Identity */}
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='font-bold text-base text-gray-900'>Company Identity</CardTitle>
                <CardDescription className='text-gray-600'>
                  Define your company's vision and mission statements
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='vision' className='text-sm font-medium text-gray-700'>
                      Vision Statement <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                      id='vision'
                      placeholder="Enter your company's vision statement"
                      className={`min-h-[120px] resize-none ${
                        errors.vision ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      {...register('vision', {
                        required: 'Vision statement is required',
                      })}
                    />
                    {errors.vision && <p className='text-red-500 text-xs'>{errors.vision.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='mission' className='text-sm font-medium text-gray-700'>
                      Mission Statement <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                      id='mission'
                      placeholder="Enter your company's mission statement"
                      className={`min-h-[120px] resize-none ${
                        errors.mission ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      {...register('mission', {
                        required: 'Mission statement is required',
                      })}
                    />
                    {errors.mission && <p className='text-red-500 text-xs'>{errors.mission.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='font-bold text-base text-gray-900'>Contact Information</CardTitle>
                <CardDescription className='text-gray-600'>
                  Essential contact details for business operations
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
                      Business Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='hello@company.com'
                      className={`${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                    />
                    {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phoneNumber' className='text-sm font-medium text-gray-700'>
                      Phone Number <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='phoneNumber'
                      placeholder='+1 (555) 123-4567'
                      className={`${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                      })}
                    />
                    {errors.phoneNumber && <p className='text-red-500 text-xs'>{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='address' className='text-sm font-medium text-gray-700'>
                    Business Address <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id='address'
                    placeholder='Enter your complete business address'
                    className={`min-h-[80px] resize-none ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    {...register('address', {
                      required: 'Business address is required',
                    })}
                  />
                  {errors.address && <p className='text-red-500 text-xs'>{errors.address.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='calendlyLink' className='text-sm font-medium text-gray-700'>
                    Calendly Booking Link <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='calendlyLink'
                    placeholder='https://calendly.com/your-username'
                    className={`${errors.calendlyLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                    {...register('calendlyLink', {
                      required: 'Calendly link is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                  />
                  {errors.calendlyLink && <p className='text-red-500 text-xs'>{errors.calendlyLink.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Company Statistics */}
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='font-bold text-base text-gray-900'>Company Statistics</CardTitle>
                <CardDescription className='text-gray-600'>
                  Key performance metrics and achievements (up to 3)
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='grid md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-gray-700'>
                          Statistic Name <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          placeholder='e.g., Projects Completed'
                          {...register(`statistics.${index}.key`, {
                            required: 'Statistic name is required',
                          })}
                          className={`${
                            errors.statistics?.[index]?.key ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                          }`}
                        />
                        {errors.statistics?.[index]?.key && (
                          <p className='text-red-500 text-xs'>{errors.statistics[index]?.key?.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-gray-700'>
                          Value <span className='text-red-500'>*</span>
                        </Label>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='e.g., 500+'
                            {...register(`statistics.${index}.value`, {
                              required: 'Statistic value is required',
                            })}
                            className={`${
                              errors.statistics?.[index]?.value
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-200'
                            }`}
                          />
                          {fields.length > 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => remove(index)}
                              className='px-3'
                              hideChevron
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                        {errors.statistics?.[index]?.value && (
                          <p className='text-red-500 text-xs'>{errors.statistics[index]?.value?.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {fields.length < 3 && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append({ key: '', value: '' })}
                    className='w-full'
                    hideChevron
                  >
                    <Plus className='h-4 w-4 ' />
                    Add Statistic ({fields.length}/3)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader className='space-y-1'>
                <CardTitle className='font-bold text-base text-gray-900'>Social Media Presence</CardTitle>
                <CardDescription className='text-gray-600'>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='linkedin' className='text-sm font-medium text-gray-700'>
                      LinkedIn Company Page <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='linkedin'
                      placeholder='https://linkedin.com/company/your-company'
                      className={`${errors.linkedin ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                      {...register('linkedin', {
                        required: 'LinkedIn URL is required',
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: 'Please enter a valid URL',
                        },
                      })}
                    />
                    {errors.linkedin && <p className='text-red-500 text-xs'>{errors.linkedin.message}</p>}
                  </div>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='instagram' className='text-sm font-medium text-gray-700'>
                        Instagram Profile <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='instagram'
                        placeholder='https://instagram.com/yourcompany'
                        className={`${errors.instagram ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                        {...register('instagram', {
                          required: 'Instagram URL is required',
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL',
                          },
                        })}
                      />
                      {errors.instagram && <p className='text-red-500 text-xs'>{errors.instagram.message}</p>}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='twitter' className='text-sm font-medium text-gray-700'>
                        Twitter/X Profile <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='twitter'
                        placeholder='https://twitter.com/yourcompany'
                        className={`${errors.twitter ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
                        {...register('twitter', {
                          required: 'Twitter URL is required',
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL',
                          },
                        })}
                      />
                      {errors.twitter && <p className='text-red-500 text-xs'>{errors.twitter.message}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className='flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200'>
              <div className='space-y-1'>
                <p className='font-medium text-gray-900'>
                  {isFirstTimeSetup ? 'Complete Company Setup' : 'Update Company Settings'}
                </p>
                <p className='text-sm text-gray-600'>
                  {isFirstTimeSetup ? 'All required fields must be completed' : 'Changes will be applied immediately'}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                {!isFirstTimeSetup && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleCancelEdit}
                    disabled={isSubmittingForm}
                    className='h-7 text-xs px-2'
                    hideChevron
                  >
                    <X className='mr-1 h-3 w-3' />
                    Cancel
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={isSubmittingForm}
                  className='bg-gray-900 hover:bg-gray-800 text-white'
                  hideChevron
                  size='sm'
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2 className=' h-4 w-4 animate-spin' />
                      {isFirstTimeSetup ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className=' h-4 w-4' />
                      {isFirstTimeSetup ? 'Complete Setup' : 'Save Changes'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanySettings;
