import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreVertical,
  X,
  Loader2,
  Minus,
  Image as ImageIcon,
  Camera,
  ChevronLeft,
  Star,
  Check,
  Save,
  ArrowLeft,
  Layers,
  Home,
  Info,
  FileText,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleError, getRelativeTime } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

// Import TanStack Query hooks and utilities
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '@/hooks/useServices';
import { uploadToCloudinary, validateFileSize, ImageUploadStatus } from '@/lib/utils';
import { CATEGORIES, ICONS, getIconComponent } from '@/constants';

// Updated interfaces
interface SubService {
  subServiceTitle: string;
  subServiceDescription: string;
}

interface Service {
  $id: string;
  homepageHeroStepDescriptionText: string;
  homepageCardTitleText: string;
  homepageCardDescriptionText: string;
  homepageCardThumbnailImageUrl?: string;
  homepageCardThumbnailImageAltText?: string;
  aboutPageServiceFullTitleText: string;
  aboutPageServiceFullDescriptionText: string;
  aboutPageServiceCategoryText: string;
  aboutPageServiceIconIdentifier: string;
  servicesPageFullTitleText: string;
  servicesPageFullDescriptionText: string;
  servicesPageBannerImageUrl?: string;
  servicesPageBannerImageAltText?: string;
  servicesPageSubServicesJson?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface ServiceFormData {
  homepageHeroStepDescriptionText: string;
  homepageCardTitleText: string;
  homepageCardDescriptionText: string;
  homepageCardThumbnailImageUrl: string;
  homepageCardThumbnailImageAltText: string;
  aboutPageServiceFullTitleText: string;
  aboutPageServiceFullDescriptionText: string;
  aboutPageServiceCategoryText: string;
  aboutPageServiceIconIdentifier: string;
  servicesPageFullTitleText: string;
  servicesPageFullDescriptionText: string;
  servicesPageBannerImageUrl: string;
  servicesPageBannerImageAltText: string;
  servicesPageSubServices: SubService[];
}

const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // TanStack Query hooks
  const { data: services, error, isLoading } = useGetServicesQuery();
  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  // Get current view from URL params
  const currentView = searchParams.get('view') || 'list';
  const serviceId = searchParams.get('id');

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Image upload states
  const [thumbnailUploadStatus, setThumbnailUploadStatus] = useState<ImageUploadStatus | null>(null);
  const [bannerUploadStatus, setBannerUploadStatus] = useState<ImageUploadStatus | null>(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>('');
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string>('');

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<ServiceFormData>({
    defaultValues: {
      homepageHeroStepDescriptionText: '',
      homepageCardTitleText: '',
      homepageCardDescriptionText: '',
      homepageCardThumbnailImageUrl: '',
      homepageCardThumbnailImageAltText: '',
      aboutPageServiceFullTitleText: '',
      aboutPageServiceFullDescriptionText: '',
      aboutPageServiceCategoryText: '',
      aboutPageServiceIconIdentifier: 'Settings',
      servicesPageFullTitleText: '',
      servicesPageFullDescriptionText: '',
      servicesPageBannerImageUrl: '',
      servicesPageBannerImageAltText: '',
      servicesPageSubServices: [{ subServiceTitle: '', subServiceDescription: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'servicesPageSubServices',
  });

  // Watch form values
  const watchedThumbnailUrl = watch('homepageCardThumbnailImageUrl');
  const watchedBannerUrl = watch('servicesPageBannerImageUrl');
  const watchedIconIdentifier = watch('aboutPageServiceIconIdentifier');

  // Navigation helpers
  const navigateToList = () => {
    setSearchParams({});
  };

  const navigateToCreate = () => {
    setSearchParams({ view: 'create' });
  };

  const navigateToEdit = (id: string) => {
    setSearchParams({ view: 'edit', id });
  };

  const navigateToView = (id: string) => {
    setSearchParams({ view: 'view', id });
  };

  // Sort services
  const sortedServices = useMemo(() => {
    if (!services?.data) return [];

    return [...services.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [services?.data]);

  // Get current service for edit/view
  const currentService = useMemo(() => {
    if (!serviceId || !services?.data) return null;
    return services.data.find(s => s.$id === serviceId) || null;
  }, [serviceId, services?.data]);

  // Loading skeleton component
  const ServicesSkeleton = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className='overflow-hidden'>
          <div className='relative'>
            <Skeleton className='h-48 w-full' />
            <div className='absolute top-4 right-4'>
              <Skeleton className='h-6 w-16 rounded-full' />
            </div>
          </div>
          <CardContent className='p-6'>
            <div className='space-y-3'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
              <div className='flex items-center justify-between pt-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-32' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const resetForm = useCallback((): void => {
    reset({
      homepageHeroStepDescriptionText: '',
      homepageCardTitleText: '',
      homepageCardDescriptionText: '',
      homepageCardThumbnailImageUrl: '',
      homepageCardThumbnailImageAltText: '',
      aboutPageServiceFullTitleText: '',
      aboutPageServiceFullDescriptionText: '',
      aboutPageServiceCategoryText: '',
      aboutPageServiceIconIdentifier: 'Settings',
      servicesPageFullTitleText: '',
      servicesPageFullDescriptionText: '',
      servicesPageBannerImageUrl: '',
      servicesPageBannerImageAltText: '',
      servicesPageSubServices: [{ subServiceTitle: '', subServiceDescription: '' }],
    });
    setUploadedThumbnailUrl('');
    setUploadedBannerUrl('');
    setThumbnailUploadStatus(null);
    setBannerUploadStatus(null);
  }, [reset]);

  // Reset form when switching views
  useEffect(() => {
    if (currentView === 'create') {
      resetForm();
    } else if (currentView === 'edit' && currentService) {
      let parsedSubServices: SubService[];
      try {
        parsedSubServices = currentService.servicesPageSubServicesJson
          ? JSON.parse(currentService.servicesPageSubServicesJson)
          : [{ subServiceTitle: '', subServiceDescription: '' }];
      } catch (error) {
        handleError(error);
        parsedSubServices = [{ subServiceTitle: '', subServiceDescription: '' }];
      }

      reset({
        homepageHeroStepDescriptionText: currentService.homepageHeroStepDescriptionText,
        homepageCardTitleText: currentService.homepageCardTitleText,
        homepageCardDescriptionText: currentService.homepageCardDescriptionText,
        homepageCardThumbnailImageUrl: currentService.homepageCardThumbnailImageUrl || '',
        homepageCardThumbnailImageAltText: currentService.homepageCardThumbnailImageAltText || '',
        aboutPageServiceFullTitleText: currentService.aboutPageServiceFullTitleText,
        aboutPageServiceFullDescriptionText: currentService.aboutPageServiceFullDescriptionText,
        aboutPageServiceCategoryText: currentService.aboutPageServiceCategoryText,
        aboutPageServiceIconIdentifier: currentService.aboutPageServiceIconIdentifier,
        servicesPageFullTitleText: currentService.servicesPageFullTitleText,
        servicesPageFullDescriptionText: currentService.servicesPageFullDescriptionText,
        servicesPageBannerImageUrl: currentService.servicesPageBannerImageUrl || '',
        servicesPageBannerImageAltText: currentService.servicesPageBannerImageAltText || '',
        servicesPageSubServices: parsedSubServices,
      });

      setUploadedThumbnailUrl(currentService.homepageCardThumbnailImageUrl || '');
      setUploadedBannerUrl(currentService.servicesPageBannerImageUrl || '');
      setThumbnailUploadStatus(null);
      setBannerUploadStatus(null);
    }
  }, [currentView, currentService, reset, resetForm]);

  // Icon Component Helper
  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className={className} />;
  };

  // Image upload handler
  const handleImageSelection = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'banner') => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateFileSize(file)) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return;
      }

      const newUploadStatus: ImageUploadStatus = {
        file,
        progress: 0,
        status: 'pending',
      };

      if (type === 'thumbnail') {
        setThumbnailUploadStatus(newUploadStatus);
      } else {
        setBannerUploadStatus(newUploadStatus);
      }

      try {
        if (type === 'thumbnail') {
          setThumbnailUploadStatus(prev => (prev ? { ...prev, status: 'uploading' } : null));
        } else {
          setBannerUploadStatus(prev => (prev ? { ...prev, status: 'uploading' } : null));
        }

        const url = await uploadToCloudinary(file, progress => {
          if (type === 'thumbnail') {
            setThumbnailUploadStatus(prev => (prev ? { ...prev, progress } : null));
          } else {
            setBannerUploadStatus(prev => (prev ? { ...prev, progress } : null));
          }
        });

        if (type === 'thumbnail') {
          setThumbnailUploadStatus(prev => (prev ? { ...prev, status: 'completed', url, progress: 100 } : null));
          setUploadedThumbnailUrl(url);
          setValue('homepageCardThumbnailImageUrl', url);
        } else {
          setBannerUploadStatus(prev => (prev ? { ...prev, status: 'completed', url, progress: 100 } : null));
          setUploadedBannerUrl(url);
          setValue('servicesPageBannerImageUrl', url);
        }

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        handleError(error);
        if (type === 'thumbnail') {
          setThumbnailUploadStatus(prev => (prev ? { ...prev, status: 'error', error: 'Upload failed' } : null));
        } else {
          setBannerUploadStatus(prev => (prev ? { ...prev, status: 'error', error: 'Upload failed' } : null));
        }
        toast.error(`Failed to upload ${file.name}`);
      }
    },
    [setValue]
  );

  const removeImage = (type: 'thumbnail' | 'banner') => {
    if (type === 'thumbnail') {
      setThumbnailUploadStatus(null);
      setUploadedThumbnailUrl('');
      setValue('homepageCardThumbnailImageUrl', '');
    } else {
      setBannerUploadStatus(null);
      setUploadedBannerUrl('');
      setValue('servicesPageBannerImageUrl', '');
    }
  };

  // CRUD handlers
  const handleView = (service: Service): void => {
    navigateToView(service.$id);
  };

  const handleEdit = (service: Service): void => {
    navigateToEdit(service.$id);
  };

  const handleDelete = (service: Service): void => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    navigateToCreate();
  };

  // Handle card click to navigate to view
  const handleCardClick = (service: Service, event: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown menu
    if ((event.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    navigateToView(service.$id);
  };

  // Form submission
  const onSubmit = async (data: ServiceFormData): Promise<void> => {
    try {
      const validSubServices = data.servicesPageSubServices.filter(
        sub => sub.subServiceTitle.trim() && sub.subServiceDescription.trim()
      );

      const payload = {
        homepageHeroStepDescriptionText: data.homepageHeroStepDescriptionText.trim(),
        homepageCardTitleText: data.homepageCardTitleText.trim(),
        homepageCardDescriptionText: data.homepageCardDescriptionText.trim(),
        homepageCardThumbnailImageUrl: uploadedThumbnailUrl || watchedThumbnailUrl || '',
        homepageCardThumbnailImageAltText: data.homepageCardThumbnailImageAltText.trim(),
        aboutPageServiceFullTitleText: data.aboutPageServiceFullTitleText.trim(),
        aboutPageServiceFullDescriptionText: data.aboutPageServiceFullDescriptionText.trim(),
        aboutPageServiceCategoryText: data.aboutPageServiceCategoryText,
        aboutPageServiceIconIdentifier: data.aboutPageServiceIconIdentifier,
        servicesPageFullTitleText: data.servicesPageFullTitleText.trim(),
        servicesPageFullDescriptionText: data.servicesPageFullDescriptionText.trim(),
        servicesPageBannerImageUrl: uploadedBannerUrl || watchedBannerUrl || '',
        servicesPageBannerImageAltText: data.servicesPageBannerImageAltText.trim(),
        servicesPageSubServicesJson: JSON.stringify(validSubServices),
      };

      if (currentView === 'edit' && currentService) {
        const result = await updateServiceMutation.mutateAsync({
          id: currentService.$id,
          data: payload,
        });

        if (result.ok) {
          toast.success(result.message || 'Service updated successfully');
          navigateToList();
        }
      } else {
        const result = await createServiceMutation.mutateAsync(payload);

        if (result.ok) {
          toast.success(result.message || 'Service created successfully');
          navigateToList();
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedService) return;

    try {
      const result = await deleteServiceMutation.mutateAsync(selectedService.$id);

      if (result.ok) {
        setIsDeleteModalOpen(false);
        toast.success(result.message || 'Service deleted successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isUploading = thumbnailUploadStatus?.status === 'uploading' || bannerUploadStatus?.status === 'uploading';

  // Image Upload Component
  const ImageUpload: React.FC<{
    label: string;
    uploadStatus: ImageUploadStatus | null;
    uploadedUrl: string;
    watchedUrl: string;
    altTextValue: string;
    onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    onAltTextChange: (value: string) => void;
    width?: string;
    height?: string;
  }> = ({
    label,
    uploadStatus,
    uploadedUrl,
    watchedUrl,
    altTextValue,
    onImageSelect,
    onRemove,
    onAltTextChange,
    width = 'w-full',
    height = 'h-32',
  }) => (
    <div className='space-y-3'>
      <Label className='text-sm font-medium text-primary/80'>{label}</Label>
      <div className='space-y-3'>
        <div className='relative'>
          <input
            type='file'
            accept='image/*'
            onChange={onImageSelect}
            className='absolute inset-0 opacity-0 cursor-pointer z-10'
            disabled={uploadStatus?.status === 'uploading'}
          />
          <div
            className={`${width} ${height} rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center hover:border-primary transition-colors cursor-pointer relative group`}
          >
            {uploadedUrl || watchedUrl ? (
              <img
                src={uploadedUrl || watchedUrl}
                alt={altTextValue || 'Upload preview'}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='text-center'>
                <ImageIcon className='w-8 h-8 text-gray-400 mx-auto mb-1' />
                <p className='text-xs text-gray-500'>Click to upload</p>
              </div>
            )}

            {/* Upload Progress Overlay */}
            {uploadStatus?.status === 'uploading' && (
              <div className='absolute inset-0 bg-white/95 flex items-center justify-center'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 text-primary animate-spin mx-auto mb-1' />
                  <div className='text-xs text-primary'>{Math.round(uploadStatus.progress)}%</div>
                </div>
              </div>
            )}

            {/* Hover overlay for existing image */}
            {(uploadedUrl || watchedUrl) && uploadStatus?.status !== 'uploading' && (
              <div className='absolute inset-0 opacity-0 group-hover:opacity-50 bg-black transition-opacity flex items-center justify-center'>
                <div className='text-center text-white'>
                  <Camera className='w-6 h-6 mx-auto mb-1' />
                  <p className='text-xs'>Change Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {(uploadedUrl || watchedUrl) && uploadStatus?.status !== 'uploading' && (
            <button
              type='button'
              onClick={onRemove}
              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20 shadow-lg'
            >
              <X className='w-3 h-3' />
            </button>
          )}
        </div>

        <Input
          placeholder='Alt text for accessibility'
          value={altTextValue}
          onChange={e => onAltTextChange(e.target.value)}
        />

        {/* Upload Status */}
        {uploadStatus?.status === 'completed' && (
          <div className='flex items-center gap-2 text-green-600'>
            <Check className='w-4 h-4' />
            <span className='text-sm'>Image uploaded successfully!</span>
          </div>
        )}
        {uploadStatus?.status === 'error' && (
          <div className='flex items-center gap-2 text-red-600'>
            <X className='w-4 h-4' />
            <span className='text-sm'>Upload failed. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  );

  // Service form component
  const ServiceForm: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' size='sm' hideChevron onClick={navigateToList}>
          <ChevronLeft className='w-4 h-4' />
          Back to Services
        </Button>
        <h3 className='font-bold text-xl text-primary'>{isEdit ? 'Edit Service' : 'Create New Service'}</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Homepage Section */}
        <Card className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3 border-b pb-3'>
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Home className='w-4 h-4 text-blue-600' />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-primary'>Homepage Content</h4>
                <p className='text-xs text-primary/60'>Content that appears on the homepage</p>
              </div>
            </div>

            {/* Homepage Hero Step Description */}
            <div className='space-y-2'>
              <Label htmlFor='homepageHeroStepDescriptionText'>
                Hero Step Description <span className='text-red-500'>*</span>
              </Label>
              <p className='text-xs text-gray-600 mb-2'>Brief description for the homepage hero step cards</p>
              <Textarea
                id='homepageHeroStepDescriptionText'
                placeholder='From concept to execution, we help design and deliver strategic, impactful events.'
                {...register('homepageHeroStepDescriptionText', {
                  required: 'Homepage hero step description is required',
                  maxLength: { value: 200, message: 'Description must not exceed 200 characters' },
                })}
                className={`resize-none ${
                  errors.homepageHeroStepDescriptionText ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={2}
              />
              {errors.homepageHeroStepDescriptionText && (
                <p className='text-red-500 text-xs'>{errors.homepageHeroStepDescriptionText.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Homepage Card Title */}
              <div className='space-y-2'>
                <Label htmlFor='homepageCardTitleText'>
                  Card Title <span className='text-red-500'>*</span>
                </Label>
                <p className='text-xs text-gray-600 mb-2'>Title for the homepage service card</p>
                <Input
                  id='homepageCardTitleText'
                  placeholder='Event Consultation'
                  {...register('homepageCardTitleText', {
                    required: 'Homepage card title is required',
                    maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
                  })}
                  className={errors.homepageCardTitleText ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.homepageCardTitleText && (
                  <p className='text-red-500 text-xs'>{errors.homepageCardTitleText.message}</p>
                )}
              </div>

              {/* Homepage Card Thumbnail */}
              <div>
                <ImageUpload
                  label='Card Thumbnail Image'
                  uploadStatus={thumbnailUploadStatus}
                  uploadedUrl={uploadedThumbnailUrl}
                  watchedUrl={watchedThumbnailUrl}
                  altTextValue={watch('homepageCardThumbnailImageAltText')}
                  onImageSelect={e => handleImageSelection(e, 'thumbnail')}
                  onRemove={() => removeImage('thumbnail')}
                  onAltTextChange={value => setValue('homepageCardThumbnailImageAltText', value)}
                  height='h-24'
                />
              </div>
            </div>

            {/* Homepage Card Description */}
            <div className='space-y-2'>
              <Label htmlFor='homepageCardDescriptionText'>
                Card Description <span className='text-red-500'>*</span>
              </Label>
              <p className='text-xs text-gray-600 mb-2'>Description for the homepage service card</p>
              <Textarea
                id='homepageCardDescriptionText'
                placeholder='From concept to coordination, we design experiences that reflect purpose and professionalism.'
                {...register('homepageCardDescriptionText', {
                  required: 'Homepage card description is required',
                  maxLength: { value: 300, message: 'Description must not exceed 300 characters' },
                })}
                className={`resize-none ${
                  errors.homepageCardDescriptionText ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={3}
              />
              {errors.homepageCardDescriptionText && (
                <p className='text-red-500 text-xs'>{errors.homepageCardDescriptionText.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* About Page Section */}
        <Card className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3 border-b pb-3'>
              <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                <Info className='w-4 h-4 text-green-600' />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-primary'>About Page Content</h4>
                <p className='text-xs text-primary/60'>Content that appears on the about us page</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* About Page Service Title */}
              <div className='space-y-2'>
                <Label htmlFor='aboutPageServiceFullTitleText'>
                  Service Title <span className='text-red-500'>*</span>
                </Label>
                <p className='text-xs text-gray-600 mb-2'>Full title for the about page</p>
                <Input
                  id='aboutPageServiceFullTitleText'
                  placeholder='Event Consultation Services'
                  {...register('aboutPageServiceFullTitleText', {
                    required: 'About page service title is required',
                    maxLength: { value: 150, message: 'Title must not exceed 150 characters' },
                  })}
                  className={errors.aboutPageServiceFullTitleText ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.aboutPageServiceFullTitleText && (
                  <p className='text-red-500 text-xs'>{errors.aboutPageServiceFullTitleText.message}</p>
                )}
              </div>

              {/* Category */}
              <div className='space-y-2'>
                <Label>
                  Service Category <span className='text-red-500'>*</span>
                </Label>
                <p className='text-xs text-gray-600 mb-2'>Category for grouping services</p>
                <Controller
                  name='aboutPageServiceCategoryText'
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.aboutPageServiceCategoryText ? 'border-red-500 focus:ring-red-500' : ''}
                      >
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.aboutPageServiceCategoryText && (
                  <p className='text-red-500 text-xs'>{errors.aboutPageServiceCategoryText.message}</p>
                )}
              </div>
            </div>

            {/* Icon Selection */}
            <div className='space-y-2'>
              <Label>
                Service Icon <span className='text-red-500'>*</span>
              </Label>
              <p className='text-xs text-gray-600 mb-2'>Icon to represent the service</p>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gray-100 rounded flex items-center justify-center border'>
                  {renderIcon(watchedIconIdentifier)}
                </div>
                <Controller
                  name='aboutPageServiceIconIdentifier'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='flex-1'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICONS.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            <div className='flex items-center gap-2'>
                              {renderIcon(icon, 'w-4 h-4')}
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* About Page Service Description */}
            <div className='space-y-2'>
              <Label htmlFor='aboutPageServiceFullDescriptionText'>
                Service Description <span className='text-red-500'>*</span>
              </Label>
              <p className='text-xs text-gray-600 mb-2'>Detailed description for the about page</p>
              <Textarea
                id='aboutPageServiceFullDescriptionText'
                placeholder='Expert guidance in designing and implementing impactful events and conferences tailored to your unique objectives and strategic goals.'
                {...register('aboutPageServiceFullDescriptionText', {
                  required: 'About page service description is required',
                  maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                })}
                className={`resize-none ${
                  errors.aboutPageServiceFullDescriptionText ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={4}
              />
              {errors.aboutPageServiceFullDescriptionText && (
                <p className='text-red-500 text-xs'>{errors.aboutPageServiceFullDescriptionText.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Services Page Section */}
        <Card className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3 border-b pb-3'>
              <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                <FileText className='w-4 h-4 text-purple-600' />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-primary'>Services Page Content</h4>
                <p className='text-xs text-primary/60'>Detailed content for the dedicated services page</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Services Page Title */}
              <div className='space-y-2'>
                <Label htmlFor='servicesPageFullTitleText'>
                  Full Service Title <span className='text-red-500'>*</span>
                </Label>
                <p className='text-xs text-gray-600 mb-2'>Complete title for the services page</p>
                <Input
                  id='servicesPageFullTitleText'
                  placeholder='Event Consultation'
                  {...register('servicesPageFullTitleText', {
                    required: 'Services page title is required',
                    maxLength: { value: 150, message: 'Title must not exceed 150 characters' },
                  })}
                  className={errors.servicesPageFullTitleText ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.servicesPageFullTitleText && (
                  <p className='text-red-500 text-xs'>{errors.servicesPageFullTitleText.message}</p>
                )}
              </div>

              {/* Services Page Banner */}
              <div>
                <ImageUpload
                  label='Service Banner Image'
                  uploadStatus={bannerUploadStatus}
                  uploadedUrl={uploadedBannerUrl}
                  watchedUrl={watchedBannerUrl}
                  altTextValue={watch('servicesPageBannerImageAltText')}
                  onImageSelect={e => handleImageSelection(e, 'banner')}
                  onRemove={() => removeImage('banner')}
                  onAltTextChange={value => setValue('servicesPageBannerImageAltText', value)}
                  height='h-32'
                />
              </div>
            </div>

            {/* Services Page Description */}
            <div className='space-y-2'>
              <Label htmlFor='servicesPageFullDescriptionText'>
                Full Service Description <span className='text-red-500'>*</span>
              </Label>
              <p className='text-xs text-gray-600 mb-2'>Complete detailed description for the services page</p>
              <Textarea
                id='servicesPageFullDescriptionText'
                placeholder='We work with institutions, corporates, and development partners to design and execute impactful events, summits, and conferences. From concept to delivery, we ensure every event is purpose-driven, well-managed, and aligns with your organizational goals.'
                {...register('servicesPageFullDescriptionText', {
                  required: 'Services page description is required',
                  maxLength: { value: 1000, message: 'Description must not exceed 1000 characters' },
                })}
                className={`resize-none ${
                  errors.servicesPageFullDescriptionText ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={6}
              />
              {errors.servicesPageFullDescriptionText && (
                <p className='text-red-500 text-xs'>{errors.servicesPageFullDescriptionText.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Sub-Services Section */}
        <Card className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between border-b pb-3'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
                  <Layers className='w-4 h-4 text-orange-600' />
                </div>
                <div>
                  <h4 className='text-sm font-semibold text-primary'>Sub-Services</h4>
                  <p className='text-xs text-primary/60'>Detailed breakdown of service offerings</p>
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                hideChevron
                onClick={() => append({ subServiceTitle: '', subServiceDescription: '' })}
                className='flex items-center gap-1'
              >
                <Plus className='w-4 h-4' />
                Add Sub-Service
              </Button>
            </div>

            <div className='space-y-4 max-h-96 overflow-y-auto'>
              {fields.map((field, index) => (
                <div key={field.id} className='space-y-3 p-4 border rounded-lg bg-gray-50/50'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-primary/80'>Sub-Service {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        hideChevron
                        onClick={() => remove(index)}
                        className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1'
                      >
                        <Minus className='w-4 h-4' />
                      </Button>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <Input
                        placeholder='Sub-service title (e.g., Event & Conference Concepts)'
                        {...register(`servicesPageSubServices.${index}.subServiceTitle` as const, {
                          required: 'Sub-service title is required',
                          maxLength: { value: 150, message: 'Title must not exceed 150 characters' },
                        })}
                        className={
                          errors.servicesPageSubServices?.[index]?.subServiceTitle
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
                      />
                      {errors.servicesPageSubServices?.[index]?.subServiceTitle && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.servicesPageSubServices[index]?.subServiceTitle?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Textarea
                        placeholder='Sub-service description (e.g., We co-create strong themes, formats, agendas, and delivery frameworks tailored to your audience and outcomes.)'
                        {...register(`servicesPageSubServices.${index}.subServiceDescription` as const, {
                          required: 'Sub-service description is required',
                          maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                        })}
                        className={`resize-none ${
                          errors.servicesPageSubServices?.[index]?.subServiceDescription
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        rows={3}
                      />
                      {errors.servicesPageSubServices?.[index]?.subServiceDescription && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.servicesPageSubServices[index]?.subServiceDescription?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className='flex justify-end gap-3 pt-6 border-t border-primary/10'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            hideChevron
            onClick={navigateToList}
            disabled={isSubmitting || isUploading}
            className='flex items-center gap-2'
          >
            <X className='w-4 h-4' />
            Cancel
          </Button>
          <Button
            type='submit'
            size='sm'
            hideChevron
            className='bg-primary hover:bg-primary/80 flex items-center gap-2'
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                {isEdit ? 'Update Service' : 'Create Service'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  // View Service Component
  const ViewService = () => {
    if (!currentService) {
      return (
        <div className='text-center py-8'>
          <Error description='Service not found' />
          <Button onClick={navigateToList} className='mt-4' size='sm' hideChevron>
            Back to Services
          </Button>
        </div>
      );
    }

    const subServices = currentService.servicesPageSubServicesJson
      ? JSON.parse(currentService.servicesPageSubServicesJson)
      : [];

    return (
      <div className='max-w-4xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-primary'>Service Details</h2>
            <p className='text-primary/70 mt-1'>View comprehensive service information across all pages.</p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEdit(currentService)}
              className='flex items-center gap-2'
              hideChevron
            >
              <Edit className='w-4 h-4' />
              Edit
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={navigateToList}
              className='flex items-center gap-2'
              hideChevron
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Services
            </Button>
          </div>
        </div>

        {/* Service Content */}
        <div className='space-y-8'>
          {/* Hero Section */}
          <div className='relative rounded-xl overflow-hidden shadow-lg'>
            {currentService.servicesPageBannerImageUrl ? (
              <img
                src={currentService.servicesPageBannerImageUrl}
                alt={currentService.servicesPageBannerImageAltText || currentService.servicesPageFullTitleText}
                className='w-full h-64 object-cover'
              />
            ) : (
              <div className='w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                {renderIcon(currentService.aboutPageServiceIconIdentifier, 'w-16 h-16 text-white')}
              </div>
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />

            {/* Category Badge */}
            <div className='absolute top-6 right-6'>
              <span className='px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm rounded-full border border-white/30'>
                {currentService.aboutPageServiceCategoryText}
              </span>
            </div>

            {/* Service Info */}
            <div className='absolute bottom-6 left-6 right-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30'>
                  {currentService.homepageCardThumbnailImageUrl ? (
                    <img
                      src={currentService.homepageCardThumbnailImageUrl}
                      alt={currentService.homepageCardThumbnailImageAltText || currentService.homepageCardTitleText}
                      className='w-full h-full object-cover rounded-lg'
                    />
                  ) : (
                    renderIcon(currentService.aboutPageServiceIconIdentifier, 'w-6 h-6 text-white')
                  )}
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>{currentService.servicesPageFullTitleText}</h1>
                  <p className='text-white/90 text-lg'>{currentService.aboutPageServiceFullTitleText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content by Page Sections */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Homepage Content */}
            <Card className='p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Home className='w-4 h-4 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-primary'>Homepage</h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-blue-700 uppercase tracking-wide'>Hero Step</label>
                  <p className='text-sm text-blue-900 mt-1'>{currentService.homepageHeroStepDescriptionText}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-blue-700 uppercase tracking-wide'>Card Title</label>
                  <p className='text-sm text-blue-900 font-medium mt-1'>{currentService.homepageCardTitleText}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-blue-700 uppercase tracking-wide'>Card Description</label>
                  <p className='text-sm text-blue-900 mt-1'>{currentService.homepageCardDescriptionText}</p>
                </div>
              </div>
            </Card>

            {/* About Page Content */}
            <Card className='p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <Info className='w-4 h-4 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-primary'>About Page</h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-green-700 uppercase tracking-wide'>Service Title</label>
                  <p className='text-sm text-green-900 font-medium mt-1'>
                    {currentService.aboutPageServiceFullTitleText}
                  </p>
                </div>

                <div>
                  <label className='text-xs font-medium text-green-700 uppercase tracking-wide'>Category</label>
                  <p className='text-sm text-green-900 mt-1'>{currentService.aboutPageServiceCategoryText}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-green-700 uppercase tracking-wide'>Description</label>
                  <p className='text-sm text-green-900 mt-1'>{currentService.aboutPageServiceFullDescriptionText}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-green-700 uppercase tracking-wide'>Icon</label>
                  <div className='flex items-center gap-2 mt-1'>
                    {renderIcon(currentService.aboutPageServiceIconIdentifier)}
                    <span className='text-sm text-green-900'>{currentService.aboutPageServiceIconIdentifier}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Services Page Content */}
            <Card className='p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <FileText className='w-4 h-4 text-purple-600' />
                </div>
                <h3 className='text-lg font-semibold text-primary'>Services Page</h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-purple-700 uppercase tracking-wide'>Full Title</label>
                  <p className='text-sm text-purple-900 font-medium mt-1'>{currentService.servicesPageFullTitleText}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-purple-700 uppercase tracking-wide'>Sub-Services</label>
                  <p className='text-sm text-purple-900 mt-1'>
                    {subServices.length} sub-service{subServices.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Services Page Description */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold text-primary mb-4'>Services Page Description</h3>
            <p className='text-primary/80 leading-relaxed whitespace-pre-wrap'>
              {currentService.servicesPageFullDescriptionText}
            </p>
          </Card>

          {/* Sub-Services */}
          {subServices.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold text-primary mb-4'>Sub-Services</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {subServices.map((subService: SubService, index: number) => (
                  <div key={index} className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                    <h4 className='font-semibold text-primary mb-2 text-base'>{subService.subServiceTitle}</h4>
                    <p className='text-primary/80 text-sm leading-relaxed'>{subService.subServiceDescription}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card className='p-4'>
              <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Created</label>
              <p className='text-sm text-gray-900'>
                {currentService.$createdAt ? getRelativeTime(currentService.$createdAt) : 'N/A'}
              </p>
            </Card>

            <Card className='p-4'>
              <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Last Updated</label>
              <p className='text-sm text-gray-900'>
                {currentService.$updatedAt ? getRelativeTime(currentService.$updatedAt) : 'N/A'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Render different views based on current view
  if (currentView === 'create') {
    return (
      <DashboardLayout>
        <div className='py-4 pb-0'>
          <ServiceForm isEdit={false} />
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'edit') {
    return (
      <DashboardLayout>
        <div className='py-4 pb-0'>
          <ServiceForm isEdit={true} />
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'view') {
    return (
      <DashboardLayout>
        <div className='py-4 pb-0'>
          <ViewService />
        </div>
      </DashboardLayout>
    );
  }

  // Default list view with cards
  return (
    <DashboardLayout>
      <div className='space-y-6 py-4 pb-0'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-xl text-primary'>Services ({sortedServices.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        <Card className='mb-0'>
          <CardContent className='p-6'>
            {isLoading ? (
              <ServicesSkeleton />
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading services' />
              </div>
            ) : !sortedServices?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No services found. Add your first service to get started.' />
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sortedServices.map((service, index) => {
                  const isNew = index < 3;
                  const subServices = service.servicesPageSubServicesJson
                    ? JSON.parse(service.servicesPageSubServicesJson)
                    : [];

                  return (
                    <Card
                      key={service.$id}
                      className='group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer'
                      onClick={e => handleCardClick(service, e)}
                    >
                      {/* Service Image/Icon */}
                      <div className='relative h-48 overflow-hidden'>
                        {service.servicesPageBannerImageUrl || service.homepageCardThumbnailImageUrl ? (
                          <img
                            src={service.servicesPageBannerImageUrl || service.homepageCardThumbnailImageUrl}
                            alt={
                              service.servicesPageBannerImageAltText ||
                              service.homepageCardThumbnailImageAltText ||
                              service.homepageCardTitleText
                            }
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        ) : (
                          <div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300'>
                            {renderIcon(service.aboutPageServiceIconIdentifier, 'w-16 h-16 text-white')}
                          </div>
                        )}

                        {/* Overlay gradient */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                        {/* Category Badge */}
                        <div className='absolute top-4 left-4'>
                          <span className='px-3 py-1 bg-white/80 backdrop-blur-md text-primary text-xs rounded-full border border-white/30'>
                            {service.aboutPageServiceCategoryText}
                          </span>
                        </div>

                        {/* Sub-services count */}
                        <div className='absolute bottom-4 left-4'>
                          <div className='flex items-center gap-1 text-white/90 text-sm'>
                            <Layers className='w-4 h-4' />
                            {subServices.length} sub-service{subServices.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Actions Menu */}
                        <div className='absolute bottom-4 right-4'>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                hideChevron
                                className='h-8 w-8 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30'
                                onClick={e => e.stopPropagation()}
                              >
                                <span className='sr-only'>Open menu</span>
                                <MoreVertical className='h-4 w-4 text-white' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleView(service);
                                }}
                              >
                                <Eye className='h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleEdit(service);
                                }}
                              >
                                <Edit className='h-4 w-4' />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDelete(service);
                                }}
                                className='text-red-600 focus:text-red-600'
                              >
                                <Trash2 className='h-4 w-4' />
                                Delete Service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Service Content */}
                      <CardContent className='p-6'>
                        <div className='space-y-3'>
                          {/* Title and New Badge */}
                          <div className='flex items-start justify-between gap-3'>
                            <h4 className='font-semibold text-lg text-primary line-clamp-2 leading-tight'>
                              {service.homepageCardTitleText}
                            </h4>
                            {isNew && (
                              <div className='flex-shrink-0'>
                                <Star className='w-4 h-4 text-yellow-500 fill-current' />
                              </div>
                            )}
                          </div>

                          {/* Service Subtitle */}
                          <p className='text-primary/80 text-sm line-clamp-2'>
                            {service.aboutPageServiceFullTitleText}
                          </p>

                          {/* Homepage Description */}
                          <div className='flex items-start gap-2 text-sm'>
                            <Home className='w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0' />
                            <span className='text-primary/90 line-clamp-2'>{service.homepageCardDescriptionText}</span>
                          </div>

                          {/* Sub-services indicator */}
                          <div className='flex items-center gap-2 text-sm text-primary/70'>
                            <Layers className='w-4 h-4' />
                            <span>
                              {subServices.length} sub-service{subServices.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Hero Step Preview */}
                          <p className='text-primary/70 text-xs line-clamp-2 leading-relaxed'>
                            <Globe className='w-3 h-3 inline mr-1' />
                            {service.homepageHeroStepDescriptionText}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title='Delete Service'
          description={
            selectedService
              ? `Are you sure you want to delete "${selectedService.homepageCardTitleText}"? This action cannot be undone and will remove all associated data.`
              : 'Are you sure you want to delete this service? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteServiceMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
