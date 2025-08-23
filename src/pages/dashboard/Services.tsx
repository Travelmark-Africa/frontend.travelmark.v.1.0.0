import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Edit3,
  Minus,
  Image as ImageIcon,
  Camera,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDateWithOrdinal, handleError } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

// Import TanStack Query hooks and utilities
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '@/hooks/useServicesQuery';
import {
  uploadToCloudinary,
  validateFileSize,
  ImageUploadStatus
} from '@/lib/utils';
import {
  SERVICE_CATEGORIES,
  SERVICE_ICONS,
  getIconComponent,
  truncateText
} from '@/constants';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const serviceId = searchParams.get('id');

  // TanStack Query hooks
  const { data: services, error, isLoading } = useGetServicesQuery();
  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

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
      serviceName: '',
      serviceTitle: '',
      serviceSummary: '',
      serviceDescription: '',
      category: '',
      iconIdentifier: 'Settings',
      mediaThumbnailUrl: '',
      mediaThumbnailAlt: '',
      mediaBannerUrl: '',
      mediaBannerAlt: '',
      subServices: [{ subServiceTitle: '', subServiceDescription: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subServices',
  });

  // Watch form values
  const watchedThumbnailUrl = watch('mediaThumbnailUrl');
  const watchedBannerUrl = watch('mediaBannerUrl');
  const watchedIconIdentifier = watch('iconIdentifier');

  // Navigation helpers
  const navigateToList = () => {
    navigate('/dashboard/services');
  };

  const navigateToCreate = () => {
    navigate('/dashboard/services?view=create');
  };

  const navigateToEdit = (id: string) => {
    navigate(`/dashboard/services?view=edit&id=${id}`);
  };

  const navigateToView = (id: string) => {
    navigate(`/dashboard/services?view=details&id=${id}`);
  };

  const resetForm = useCallback((): void => {
    reset({
      serviceName: '',
      serviceTitle: '',
      serviceSummary: '',
      serviceDescription: '',
      category: '',
      iconIdentifier: 'Settings',
      mediaThumbnailUrl: '',
      mediaThumbnailAlt: '',
      mediaBannerUrl: '',
      mediaBannerAlt: '',
      subServices: [{ subServiceTitle: '', subServiceDescription: '' }],
    });
    setUploadedThumbnailUrl('');
    setUploadedBannerUrl('');
    setThumbnailUploadStatus(null);
    setBannerUploadStatus(null);
  }, [reset]);

  // Find selected service based on URL params
  useEffect(() => {
    if (serviceId && services?.data) {
      const service = services.data.find((s: Service) => s.$id === serviceId);
      if (service) {
        setSelectedService(service);

        // Populate form for editing
        if (view === 'edit') {
          let parsedSubServices: SubService[];
          try {
            parsedSubServices = service.subServicesJson
              ? JSON.parse(service.subServicesJson)
              : [{ subServiceTitle: '', subServiceDescription: '' }];
          } catch (error) {
            handleError(error);
            parsedSubServices = [{ subServiceTitle: '', subServiceDescription: '' }];
          }

          reset({
            serviceName: service.serviceName,
            serviceTitle: service.serviceTitle,
            serviceSummary: service.serviceSummary,
            serviceDescription: service.serviceDescription,
            category: service.category,
            iconIdentifier: service.iconIdentifier,
            mediaThumbnailUrl: service.mediaThumbnailUrl || '',
            mediaThumbnailAlt: service.mediaThumbnailAlt || '',
            mediaBannerUrl: service.mediaBannerUrl || '',
            mediaBannerAlt: service.mediaBannerAlt || '',
            subServices: parsedSubServices,
          });

          setUploadedThumbnailUrl(service.mediaThumbnailUrl || '');
          setUploadedBannerUrl(service.mediaBannerUrl || '');
          setThumbnailUploadStatus(null);
          setBannerUploadStatus(null);
        }
      }
    } else if (view === 'create') {
      resetForm();
    }
  }, [serviceId, services?.data, view, reset, resetForm]);

  // Loading skeleton component
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-16'>SN</TableHead>
          <TableHead className='min-w-[250px]'>Service</TableHead>
          <TableHead className='hidden md:table-cell min-w-[120px]'>Category</TableHead>
          <TableHead className='hidden lg:table-cell min-w-[140px]'>Created At</TableHead>
          <TableHead className='w-16'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className='h-4 w-8' /></TableCell>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-12 w-12 rounded' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell className='hidden lg:table-cell'>
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell><Skeleton className='h-4 w-24' /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
          setThumbnailUploadStatus(prev =>
            prev ? { ...prev, status: 'completed', url, progress: 100 } : null
          );
          setUploadedThumbnailUrl(url);
          setValue('mediaThumbnailUrl', url);
        } else {
          setBannerUploadStatus(prev =>
            prev ? { ...prev, status: 'completed', url, progress: 100 } : null
          );
          setUploadedBannerUrl(url);
          setValue('mediaBannerUrl', url);
        }

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        handleError(error);
        if (type === 'thumbnail') {
          setThumbnailUploadStatus(prev =>
            prev ? { ...prev, status: 'error', error: 'Upload failed' } : null
          );
        } else {
          setBannerUploadStatus(prev =>
            prev ? { ...prev, status: 'error', error: 'Upload failed' } : null
          );
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
      setValue('mediaThumbnailUrl', '');
    } else {
      setBannerUploadStatus(null);
      setUploadedBannerUrl('');
      setValue('mediaBannerUrl', '');
    }
  };

  // CRUD handlers
  const handleDelete = (service: Service): void => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  // Form submission
  const onSubmit = async (data: ServiceFormData): Promise<void> => {
    try {
      const validSubServices = data.subServices.filter(sub =>
        sub.subServiceTitle.trim() && sub.subServiceDescription.trim()
      );

      const payload = {
        serviceName: data.serviceName.trim(),
        serviceTitle: data.serviceTitle.trim(),
        serviceSummary: data.serviceSummary.trim(),
        serviceDescription: data.serviceDescription.trim(),
        category: data.category,
        iconIdentifier: data.iconIdentifier,
        mediaThumbnailUrl: uploadedThumbnailUrl || watchedThumbnailUrl || '',
        mediaThumbnailAlt: data.mediaThumbnailAlt.trim(),
        mediaBannerUrl: uploadedBannerUrl || watchedBannerUrl || '',
        mediaBannerAlt: data.mediaBannerAlt.trim(),
        subServicesJson: JSON.stringify(validSubServices),
      };

      if (view === 'edit' && selectedService) {
        const result = await updateServiceMutation.mutateAsync({
          id: selectedService.$id,
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
    width = 'w-24',
    height = 'h-24',
  }) => (
      <div className='space-y-3'>
        <Label className='text-sm font-medium text-primary/80'>{label}</Label>
        <div className='flex items-start gap-4'>
          <div className='relative'>
            <input
              type='file'
              accept='image/*'
              onChange={onImageSelect}
              className='absolute inset-0 opacity-0 cursor-pointer z-10'
              disabled={uploadStatus?.status === 'uploading'}
            />
            <div className={`${width} ${height} rounded border overflow-hidden bg-gray-200 flex items-center justify-center hover:border-primary transition-colors cursor-pointer relative group`}>
              {uploadedUrl || watchedUrl ? (
                <img
                  src={uploadedUrl || watchedUrl}
                  alt={altTextValue || 'Upload preview'}
                  className='w-full h-full object-cover'
                />
              ) : (
                <ImageIcon className='w-8 h-8 text-primary/50' />
              )}

              {uploadStatus?.status === 'uploading' && (
                <div className='absolute inset-0 bg-white/80 flex items-center justify-center'>
                  <div className='text-center'>
                    <Loader2 className='w-6 h-6 text-primary animate-spin mx-auto mb-1' />
                    <div className='text-xs text-primary'>{Math.round(uploadStatus.progress)}%</div>
                  </div>
                </div>
              )}

              {(uploadedUrl || watchedUrl) && uploadStatus?.status !== 'uploading' && (
                <div className='absolute inset-0 opacity-0 group-hover:opacity-50 bg-black transition-opacity flex items-center justify-center'>
                  <Camera className='w-6 h-6 text-white' />
                </div>
              )}
            </div>

            {(uploadedUrl || watchedUrl) && uploadStatus?.status !== 'uploading' && (
              <button
                type='button'
                onClick={onRemove}
                className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20 shadow-md'
              >
                <X className='w-3 h-3' />
              </button>
            )}
          </div>

          <div className='flex-1 space-y-2'>
            <Input
              placeholder='Alt text'
              value={altTextValue}
              onChange={(e) => onAltTextChange(e.target.value)}
            />
            <p className='text-xs text-gray-500'>Click the image area to upload. PNG, JPG (max 10MB)</p>
            {uploadStatus?.status === 'error' && (
              <p className='text-xs text-red-500'>Upload failed. Please try again.</p>
            )}
          </div>
        </div>
      </div>
    );

  // Service form component
  const ServiceForm: React.FC<{ isEdit?: boolean; }> = ({ isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Basic Information */}
      <div className='space-y-4'>
        <h4 className='text-sm font-semibold text-primary/90 border-b pb-2'>Basic Information</h4>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Service Name */}
          <div className='space-y-2'>
            <Label htmlFor='serviceName'>
              Service Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='serviceName'
              placeholder='e.g. Event Consultation'
              {...register('serviceName', {
                required: 'Service name is required',
                minLength: { value: 2, message: 'Service name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Service name must not exceed 100 characters' },
              })}
              className={errors.serviceName ? '!border-red-500' : ''}
            />
            {errors.serviceName && (
              <p className='text-red-500 text-xs'>{errors.serviceName.message}</p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <Label>Category <span className='text-red-500'>*</span></Label>
            <Controller
              name='category'
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.category ? '!border-red-500' : ''}>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className='text-red-500 text-xs'>{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Service Title */}
        <div className='space-y-2'>
          <Label htmlFor='serviceTitle'>
            Service Title <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='serviceTitle'
            placeholder='e.g. Event Consultation Services'
            {...register('serviceTitle', {
              required: 'Service title is required',
              maxLength: { value: 200, message: 'Service title must not exceed 200 characters' },
            })}
            className={errors.serviceTitle ? '!border-red-500' : ''}
          />
          {errors.serviceTitle && (
            <p className='text-red-500 text-xs'>{errors.serviceTitle.message}</p>
          )}
        </div>

        {/* Icon Selection */}
        <div className='space-y-2'>
          <Label>Icon <span className='text-red-500'>*</span></Label>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-200 rounded flex items-center justify-center border'>
              {getIconComponent(watchedIconIdentifier)}
            </div>
            <Controller
              name='iconIdentifier'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='flex-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className='flex items-center gap-2'>
                          {getIconComponent(icon)}
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

        {/* Service Summary */}
        <div className='space-y-2'>
          <Label htmlFor='serviceSummary'>
            Service Summary <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='serviceSummary'
            placeholder='Brief summary of the service...'
            {...register('serviceSummary', {
              required: 'Service summary is required',
              maxLength: { value: 500, message: 'Service summary must not exceed 500 characters' },
            })}
            className={`resize-none ${errors.serviceSummary ? '!border-red-500' : ''}`}
            rows={3}
          />
          {errors.serviceSummary && (
            <p className='text-red-500 text-xs'>{errors.serviceSummary.message}</p>
          )}
        </div>

        {/* Service Description */}
        <div className='space-y-2'>
          <Label htmlFor='serviceDescription'>
            Service Description <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='serviceDescription'
            placeholder='Detailed description of the service...'
            {...register('serviceDescription', {
              required: 'Service description is required',
              maxLength: { value: 2000, message: 'Service description must not exceed 2000 characters' },
            })}
            className={`resize-none ${errors.serviceDescription ? '!border-red-500' : ''}`}
            rows={5}
          />
          {errors.serviceDescription && (
            <p className='text-red-500 text-xs'>{errors.serviceDescription.message}</p>
          )}
        </div>
      </div>

      {/* Media Section */}
      <div className='space-y-4'>
        <h4 className='text-sm font-semibold text-primary/90 border-b pb-2'>Media Assets</h4>

        {/* Thumbnail Image */}
        <ImageUpload
          label='Thumbnail Image'
          uploadStatus={thumbnailUploadStatus}
          uploadedUrl={uploadedThumbnailUrl}
          watchedUrl={watchedThumbnailUrl}
          altTextValue={watch('mediaThumbnailAlt')}
          onImageSelect={(e) => handleImageSelection(e, 'thumbnail')}
          onRemove={() => removeImage('thumbnail')}
          onAltTextChange={(value) => setValue('mediaThumbnailAlt', value)}
        />

        {/* Banner Image */}
        <ImageUpload
          label='Banner Image'
          uploadStatus={bannerUploadStatus}
          uploadedUrl={uploadedBannerUrl}
          watchedUrl={watchedBannerUrl}
          altTextValue={watch('mediaBannerAlt')}
          onImageSelect={(e) => handleImageSelection(e, 'banner')}
          onRemove={() => removeImage('banner')}
          onAltTextChange={(value) => setValue('mediaBannerAlt', value)}
          width='w-32'
          height='h-20'
        />
      </div>

      {/* Sub-Services Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b pb-2'>
          <h4 className='text-sm font-semibold text-primary/90'>Sub-Services</h4>
          <Button
            type='button'
            variant='outline'
            size='sm'
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
                    hideChevron
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-red-500 hover:text-red-700 !hover:bg-red-50 p-1'
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                )}
              </div>

              <div className='space-y-3'>
                <div>
                  <Input
                    placeholder='Sub-service title...'
                    {...register(`subServices.${index}.subServiceTitle` as const, {
                      required: 'Sub-service title is required',
                      maxLength: { value: 150, message: 'Title must not exceed 150 characters' },
                    })}
                    className={errors.subServices?.[index]?.subServiceTitle ? '!border-red-500' : ''}
                  />
                  {errors.subServices?.[index]?.subServiceTitle && (
                    <p className='text-red-500 text-xs mt-1'>{errors.subServices[index]?.subServiceTitle?.message}</p>
                  )}
                </div>

                <div>
                  <Textarea
                    placeholder='Sub-service description...'
                    {...register(`subServices.${index}.subServiceDescription` as const, {
                      required: 'Sub-service description is required',
                      maxLength: { value: 1000, message: 'Description must not exceed 1000 characters' },
                    })}
                    className={`resize-none ${errors.subServices?.[index]?.subServiceDescription ? '!border-red-500' : ''}`}
                    rows={3}
                  />
                  {errors.subServices?.[index]?.subServiceDescription && (
                    <p className='text-red-500 text-xs mt-1'>{errors.subServices[index]?.subServiceDescription?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          hideChevron
          size='sm'
          onClick={navigateToList}
          disabled={isSubmitting || isUploading}
        >
          <X className='w-4 h-4' />
          Cancel
        </Button>
        <Button
          type='submit'
          size='sm'
          hideChevron
          className='bg-primary hover:bg-primary/90'
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEdit ? <Edit3 className='w-4 h-4 mr-2' /> : <Plus className='w-4 h-4 mr-2' />}
              {isEdit ? 'Update Service' : 'Create Service'}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // Render different views based on URL params
  if (view === 'create') {
    return (
      <DashboardLayout>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              hideChevron
              onClick={navigateToList}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4' />
              Back to Services
            </Button>
            <h3 className='font-bold text-xl text-primary'>Create New Service</h3>
          </div>

          {/* Create Form */}
          <Card>
            <CardContent>
              <ServiceForm />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (view === 'edit' && selectedService) {
    return (
      <DashboardLayout>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              hideChevron
              onClick={navigateToList}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4' />
              Back to Services
            </Button>
            <h3 className='font-bold text-xl text-primary'>Edit Service</h3>
          </div>

          {/* Edit Form */}
          <Card>
            <CardContent>
              <ServiceForm isEdit={true} />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (view === 'details' && selectedService) {
    return (
      <DashboardLayout>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                hideChevron
                size='sm'
                onClick={navigateToList}
                className='flex items-center gap-2 hover:bg-gray-200!'
              >
                <ChevronLeft className='w-4 h-4' />
                Back to Services
              </Button>
              <h3 className='font-bold text-xl text-primary'>Service Details</h3>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                hideChevron
                onClick={() => navigateToEdit(selectedService.$id)}
              >
                <Edit className='w-4 h-4' />
                Edit Service
              </Button>
              <Button
                variant='outline'
                size='sm'
                hideChevron
                onClick={() => handleDelete(selectedService)}
                className='text-red-600 hover:text-red-700 !hover:bg-red-50'
              >
                <Trash2 className='w-4 h-4' />
                Delete
              </Button>
            </div>
          </div>

          {/* Service Details */}
          <Card>
            <CardContent className='p-6'>
              <div className='space-y-6'>
                {/* Header with Icon/Image */}
                <div className='flex items-start gap-4'>
                  <div className='w-16 h-16 rounded bg-gray-200 flex items-center justify-center border border-gray-200'>
                    {selectedService.mediaThumbnailUrl ? (
                      <img
                        src={selectedService.mediaThumbnailUrl}
                        alt={selectedService.mediaThumbnailAlt || selectedService.serviceName}
                        className='w-full h-full object-cover rounded'
                      />
                    ) : (
                      getIconComponent(selectedService.iconIdentifier)
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-xl font-semibold text-primary break-words'>{selectedService.serviceName}</h3>
                    <p className='text-sm text-primary/90 mt-1'>{selectedService.serviceTitle}</p>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2'>
                      {selectedService.category}
                    </span>
                  </div>
                </div>

                {/* Service Summary */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Summary</label>
                  <p className='text-primary/80 text-[0.9rem] leading-relaxed'>{selectedService.serviceSummary}</p>
                </div>

                {/* Service Description */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Description</label>
                  <div className='p-3 bg-gray-50 rounded-md border'>
                    <p className='text-primary/80 leading-relaxed whitespace-pre-wrap text-[0.9rem]'>
                      {selectedService.serviceDescription}
                    </p>
                  </div>
                </div>

                {/* Sub-Services */}
                {selectedService.subServicesJson && (
                  <div className='space-y-3'>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Sub-Services</label>
                    <div className='space-y-3'>
                      {JSON.parse(selectedService.subServicesJson).map((subService: SubService, index: number) => (
                        <div key={index} className='p-3 bg-gray-50 rounded-md border'>
                          <h6 className='text-base font-medium text-primary mb-1'>{subService.subServiceTitle}</h6>
                          <p className='text-primary/80 leading-relaxed text-[0.9rem]'>
                            {subService.subServiceDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Assets */}
                {(selectedService.mediaThumbnailUrl || selectedService.mediaBannerUrl) && (
                  <div className='space-y-3'>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Media Assets</label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {selectedService.mediaThumbnailUrl && (
                        <div className='space-y-2'>
                          <p className='text-xs font-medium text-gray-600'>Thumbnail</p>
                          <img
                            src={selectedService.mediaThumbnailUrl}
                            alt={selectedService.mediaThumbnailAlt || 'Thumbnail'}
                            className='w-full h-32 object-cover rounded border'
                          />
                        </div>
                      )}
                      {selectedService.mediaBannerUrl && (
                        <div className='space-y-2'>
                          <p className='text-xs font-medium text-gray-600'>Banner</p>
                          <img
                            src={selectedService.mediaBannerUrl}
                            alt={selectedService.mediaBannerAlt || 'Banner'}
                            className='w-full h-32 object-cover rounded border'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Created</label>
                    <p className='text-sm text-primary/80 mt-1'>
                      {selectedService.$createdAt ? formatDateWithOrdinal(selectedService.$createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Updated</label>
                    <p className='text-sm text-primary/80 mt-1'>
                      {selectedService.$updatedAt ? formatDateWithOrdinal(selectedService.$updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Default list view
  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-xl text-primary'>
            Services ({services?.data?.length || 0})
          </h3>
          <Button
            onClick={navigateToCreate}
            size='sm'
            hideChevron
            className='bg-primary hover:bg-primary/90'
          >
            <Plus className='w-4 h-4' />
            Add Service
          </Button>
        </div>

        {/* Services Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <TableSkeleton />
              </div>
            ) : error ? (
              <div className='p-6'>
                <Error description='Error loading services' />
              </div>
            ) : !services?.data?.length ? (
              <div className='p-6'>
                <Empty
                  description='No services found. Create your first service to get started.'
                />
              </div>
            ) : (
              <div className='overflow-x-auto p-4'>
                <Table>
                  <TableHeader>
                    
                    <TableRow>
                      <TableHead className='w-16 font-semibold text-primary/80'>SN</TableHead>
                      <TableHead className='min-w-[280px] font-semibold text-primary/80'>Service</TableHead>
                      <TableHead className='hidden md:table-cell min-w-[120px] font-semibold text-primary/80'>Category</TableHead>
                      <TableHead className='hidden lg:table-cell min-w-[140px] font-semibold text-primary/80'>Created At</TableHead>
                      <TableHead className='w-16 font-semibold text-primary/80'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services?.data?.map((service: Service, index: number) => (
                      <TableRow key={service.$id} className='hover:bg-gray-50/50 transition-colors'>
                        <TableCell className='font-medium text-primary/90'>{index + 1}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 rounded bg-gray-200 flex items-center justify-center border border-gray-200'>
                              {service.mediaThumbnailUrl ? (
                                <img
                                  src={service.mediaThumbnailUrl}
                                  alt={service.mediaThumbnailAlt || service.serviceName}
                                  className='w-full h-full object-cover rounded'
                                />
                              ) : (
                                getIconComponent(service.iconIdentifier)
                              )}
                            </div>
                            <div className='min-w-0 flex-1'>
                              <div className='font-medium text-primary truncate'>{service.serviceName}</div>
                              <div className='text-sm text-gray-500 truncate'>{truncateText(service.serviceSummary, 60)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-primary/90 hidden md:table-cell'>
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                            {service.category}
                          </span>
                        </TableCell>
                        <TableCell className='text-gray-500 text-sm hidden lg:table-cell'>
                          {service.$createdAt ? formatDateWithOrdinal(service.$createdAt) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' hideChevron size='sm' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => navigateToView(service.$id)}>
                                <Eye className='h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigateToEdit(service.$id)}>
                                <Edit className='h-4 w-4' />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(service)}
                                className='text-red-600 focus:text-red-600'
                              >
                                <Trash2 className='h-4 w-4' />
                                Delete Service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              ? `Are you sure you want to delete "${selectedService.serviceName}"? This action cannot be undone and will remove all associated data.`
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