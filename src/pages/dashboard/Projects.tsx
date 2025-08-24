import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '@/hooks/useProjectsQuery';
import {
  Edit,
  Trash2,
  Plus,
  X,
  Loader2,
  Check,
  Camera,
  Eye,
  MoreVertical,
  Calendar,
  MapPin,
  Target,
  Star,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleError, uploadToCloudinary, validateFileSize, ImageUploadStatus, getRelativeTime } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';
import { CATEGORIES } from '@/constants';

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects, error, isLoading } = useGetProjectsQuery();
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  // Get current view from URL params
  const currentView = searchParams.get('view') || 'list';
  const projectId = searchParams.get('id');

  // Modal and UI states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Image upload states
  const [uploadStatus, setUploadStatus] = useState<ImageUploadStatus | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      category: '',
      impact: '',
      location: '',
      year: new Date().getFullYear(),
      image: '',
    },
  });

  const watchedImageUrl = watch('image');

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

  // Loading skeleton component
  const ProjectsSkeleton = () => (
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

  // Sort and filter projects
  const sortedProjects = useMemo(() => {
    if (!projects?.data) return [];

    // Sort by year (newest first), then by creation date
    return [...projects.data].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [projects?.data]);

  // Get current project for edit/view
  const currentProject = useMemo(() => {
    if (!projectId || !projects?.data) return null;
    return projects.data.find(p => p.$id === projectId) || null;
  }, [projectId, projects?.data]);

  // Reset form when switching to create or edit view
  useEffect(() => {
    if (currentView === 'create') {
      reset({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        impact: '',
        location: '',
        year: new Date().getFullYear(),
        image: '',
      });
      setUploadedImageUrl('');
      setUploadStatus(null);
    } else if (currentView === 'edit' && currentProject) {
      reset({
        title: currentProject.title,
        subtitle: currentProject.subtitle,
        description: currentProject.description,
        category: currentProject.category,
        impact: currentProject.impact,
        location: currentProject.location,
        year: currentProject.year,
        image: currentProject.image,
      });
      setUploadedImageUrl(currentProject.image);
      setUploadStatus(null);
    }
  }, [currentView, currentProject, reset]);

  // Image upload handler
  const handleImageSelection = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setUploadStatus(newUploadStatus);

      try {
        setUploadStatus(prev => (prev ? { ...prev, status: 'uploading' } : null));

        const url = await uploadToCloudinary(file, progress => {
          setUploadStatus(prev => (prev ? { ...prev, progress } : null));
        });

        setUploadStatus(prev =>
          prev
            ? {
                ...prev,
                status: 'completed',
                url,
                progress: 100,
              }
            : null
        );

        setUploadedImageUrl(url);
        setValue('image', url);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        handleError(error);
        setUploadStatus(prev =>
          prev
            ? {
                ...prev,
                status: 'error',
                error: 'Upload failed',
              }
            : null
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    },
    [setValue]
  );

  const removeImage = () => {
    setUploadStatus(null);
    setUploadedImageUrl('');
    setValue('image', '');
  };

  // CRUD handlers
  const handleView = (project: Project): void => {
    navigateToView(project.$id);
  };

  const handleEdit = (project: Project): void => {
    navigateToEdit(project.$id);
  };

  const handleDelete = (project: Project): void => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    navigateToCreate();
  };

  // Handle card click to navigate to view
  const handleCardClick = (project: Project, event: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown menu
    if ((event.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    navigateToView(project.$id);
  };

  // Form submission
  const onSubmit = async (data: ProjectFormData): Promise<void> => {
    try {
      // Check if image is required and uploaded
      if (!uploadedImageUrl && !watchedImageUrl) {
        toast.error('Project image is required');
        return;
      }

      const payload = {
        title: data.title.trim(),
        subtitle: data.subtitle.trim(),
        description: data.description.trim(),
        category: data.category,
        impact: data.impact.trim(),
        location: data.location.trim(),
        year: data.year,
        image: uploadedImageUrl || watchedImageUrl,
      };

      if (currentView === 'edit' && currentProject) {
        // Update existing project
        const res = await updateProjectMutation.mutateAsync({
          id: currentProject.$id,
          data: payload,
        });

        if (res.ok) {
          navigateToList();
          toast.success(res.message || 'Project updated successfully');
        }
      } else {
        // Create new project
        const res = await createProjectMutation.mutateAsync(payload);

        if (res.ok) {
          navigateToList();
          toast.success(res.message || 'Project created successfully');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedProject) return;

    try {
      const res = await deleteProjectMutation.mutateAsync(selectedProject.$id);

      if (res.ok) {
        setIsDeleteModalOpen(false);
        toast.success(res.message || 'Project deleted successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isUploading = uploadStatus?.status === 'uploading';

  // Image Upload Component
  const ImageUpload: React.FC = () => (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Label className='text-sm font-medium text-primary/80'>
          Project Image <span className='text-red-500'>*</span>
        </Label>
        <span className='text-xs text-primary/80'>(Required)</span>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Image Preview - Reasonable height */}
        <div className='relative w-full h-64'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageSelection}
            className='absolute inset-0 opacity-0 cursor-pointer z-10'
            disabled={isUploading}
          />

          <div className='w-full h-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer relative group'>
            {uploadedImageUrl || watchedImageUrl ? (
              <img
                src={uploadedImageUrl || watchedImageUrl}
                alt='Project preview'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='text-center'>
                <ImageIcon className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                <p className='text-sm text-gray-500'>Click to upload image</p>
                <p className='text-xs text-gray-400'>PNG, JPG, or JPEG (max 10MB)</p>
              </div>
            )}

            {/* Hover overlay for existing image */}
            {(uploadedImageUrl || watchedImageUrl) && !isUploading && (
              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center'>
                <div className='text-center text-white'>
                  <Camera className='w-8 h-8 mx-auto mb-1' />
                  <p className='text-sm'>Change Image</p>
                </div>
              </div>
            )}

            {/* Upload Progress Overlay */}
            {uploadStatus && uploadStatus.status === 'uploading' && (
              <div className='absolute inset-0 rounded-lg bg-white/95 flex items-center justify-center'>
                <div className='text-center'>
                  <Loader2 className='w-8 h-8 text-primary animate-spin mx-auto mb-2' />
                  <div className='text-sm text-primary font-medium'>Uploading...</div>
                  <div className='text-xs text-primary/70'>{Math.round(uploadStatus.progress)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {(uploadedImageUrl || watchedImageUrl) && !isUploading && (
            <button
              type='button'
              onClick={removeImage}
              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg z-20'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Upload Status */}
        {uploadStatus?.status === 'completed' && (
          <div className='flex items-center justify-center gap-2 text-green-600'>
            <Check className='w-4 h-4' />
            <span className='text-sm'>Image uploaded successfully!</span>
          </div>
        )}
        {uploadStatus?.status === 'error' && (
          <div className='flex items-center justify-center gap-2 text-red-600'>
            <X className='w-4 h-4' />
            <span className='text-sm'>Upload failed. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  );

  // Project Form Component
  const ProjectForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' size='sm' hideChevron onClick={navigateToList}>
          <ChevronLeft className='w-4 h-4 ' />
          Back to Projects
        </Button>
        <h3 className='font-bold text-xl text-primary'>{isEdit ? 'Edit Project' : 'Create New Project'}</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Header */}
        <Card className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start p-6'>
          {/* Left Column - Form Fields */}
          <div className='space-y-6'>
            {/* Title and Subtitle */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title' className='text-sm font-medium text-primary/80'>
                  Project Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  type='text'
                  placeholder='Enter your project title (e.g., Clean Water Initiative for Rural Communities)'
                  {...register('title', {
                    required: 'Project title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
                  })}
                  className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.title && <p className='text-red-500 text-xs mt-1'>{errors.title.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subtitle' className='text-sm font-medium text-primary/80'>
                  Subtitle <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='subtitle'
                  type='text'
                  placeholder='Brief description of your project impact (e.g., Providing safe drinking water to over 5,000 families)'
                  {...register('subtitle', {
                    required: 'Subtitle is required',
                    minLength: { value: 5, message: 'Subtitle must be at least 5 characters' },
                    maxLength: { value: 150, message: 'Subtitle must not exceed 150 characters' },
                  })}
                  className={errors.subtitle ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.subtitle && <p className='text-red-500 text-xs mt-1'>{errors.subtitle.message}</p>}
              </div>
            </div>

            {/* Category and Year */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-primary/80'>
                  Category <span className='text-red-500'>*</span>
                </Label>
                <Select onValueChange={value => setValue('category', value)} value={watch('category')}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder='Choose project category' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className='text-red-500 text-xs mt-1'>{errors.category.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='year' className='text-sm font-medium text-primary/80'>
                  Year <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='year'
                  type='number'
                  min='2000'
                  max='2030'
                  placeholder='2024'
                  {...register('year', {
                    required: 'Year is required',
                    min: { value: 2000, message: 'Year must be 2000 or later' },
                    max: { value: 2030, message: 'Year must be 2030 or earlier' },
                  })}
                  className={errors.year ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.year && <p className='text-red-500 text-xs mt-1'>{errors.year.message}</p>}
              </div>
            </div>

            {/* Location and Impact */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='location' className='text-sm font-medium text-primary/80'>
                  Location <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='location'
                  type='text'
                  placeholder='Project location (e.g., Kigali, Rwanda or Remote villages in Kenya)'
                  {...register('location', {
                    required: 'Location is required',
                    minLength: { value: 2, message: 'Location must be at least 2 characters' },
                    maxLength: { value: 100, message: 'Location must not exceed 100 characters' },
                  })}
                  className={errors.location ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.location && <p className='text-red-500 text-xs mt-1'>{errors.location.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='impact' className='text-sm font-medium text-primary/80'>
                  Impact <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='impact'
                  type='text'
                  placeholder='Measurable impact (e.g., 5,000+ people served, 50 schools built, 100% increase in literacy)'
                  {...register('impact', {
                    required: 'Impact is required',
                    minLength: { value: 5, message: 'Impact must be at least 5 characters' },
                    maxLength: { value: 150, message: 'Impact must not exceed 150 characters' },
                  })}
                  className={errors.impact ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.impact && <p className='text-red-500 text-xs mt-1'>{errors.impact.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description' className='text-sm font-medium text-primary/80'>
                Description <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='description'
                placeholder='Provide a detailed description of your project including its goals, implementation strategy, challenges overcome, and outcomes achieved. Be specific about how the project made a difference in the community...'
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' },
                  maxLength: { value: 2000, message: 'Description must not exceed 2000 characters' },
                })}
                className={`resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                rows={8}
              />
              {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>}
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className='h-full'>
            <ImageUpload />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className='flex justify-end gap-3 pt-6 border-t border-primary/10'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={navigateToList}
            disabled={isSubmitting || isUploading}
            className='flex items-center gap-2'
            hideChevron
          >
            <X className='w-4 h-4' />
            Cancel
          </Button>
          <Button
            type='submit'
            size='sm'
            className='bg-primary hover:bg-primary/80 flex items-center gap-2'
            disabled={isSubmitting || isUploading}
            hideChevron
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                {isEdit ? 'Update Project' : 'Create Project'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  // View Project Component
  const ViewProject = () => {
    if (!currentProject) {
      return (
        <div className='text-center py-8'>
          <Error description='Project not found' />
          <Button onClick={navigateToList} className='mt-4' size='sm' hideChevron>
            Back to Projects
          </Button>
        </div>
      );
    }

    return (
      <div className='max-w-4xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-primary'>Project Details</h2>
            <p className='text-primary/70 mt-1'>View project information and details.</p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEdit(currentProject)}
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
              Back to Projects
            </Button>
          </div>
        </div>

        {/* Project Content */}
        <div className='space-y-8'>
          {/* Hero Section */}
          <div className='relative rounded-xl overflow-hidden shadow-lg'>
            <img src={currentProject.image} alt={currentProject.title} className='w-full h-64 object-cover' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />

            {/* Category and Year */}
            <div className='absolute top-6 right-6 flex flex-col gap-2'>
              <span className='px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30'>
                {currentProject.category}
              </span>
              <div className='flex items-center gap-2 text-white/90 text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30'>
                <Calendar className='w-4 h-4' />
                {currentProject.year}
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className='absolute bottom-6 left-6 right-6'>
              <h1 className='text-3xl font-bold text-white mb-2'>{currentProject.title}</h1>
              <p className='text-white/90 text-lg'>{currentProject.subtitle}</p>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Key Metrics */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-primary'>Key Information</h3>

              <div className='space-y-4'>
                <div className='flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200'>
                  <Target className='w-5 h-5 text-green-600' />
                  <div>
                    <label className='text-xs font-medium text-green-700 uppercase tracking-wide'>Impact</label>
                    <p className='text-sm text-green-900 font-medium'>{currentProject.impact}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <MapPin className='w-5 h-5 text-blue-600' />
                  <div>
                    <label className='text-xs font-medium text-blue-700 uppercase tracking-wide'>Location</label>
                    <p className='text-sm text-blue-900'>{currentProject.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-primary'>Timeline</h3>

              <div className='space-y-4'>
                <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Created</label>
                  <p className='text-sm text-gray-900'>
                    {currentProject.$createdAt ? getRelativeTime(currentProject.$createdAt) : 'N/A'}
                  </p>
                </div>

                <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Last Updated</label>
                  <p className='text-sm text-gray-900'>
                    {currentProject.$updatedAt ? getRelativeTime(currentProject.$updatedAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-primary'>Project Description</h3>
            <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
              <p className='text-primary/80 leading-relaxed whitespace-pre-wrap'>{currentProject.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render different views based on current view
  if (currentView === 'create') {
    return (
      <DashboardLayout>
        <div className='space-y-3 py-4'>
          <ProjectForm isEdit={false} />
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'edit') {
    return (
      <DashboardLayout>
        <div className='space-y-3 py-4'>
          <ProjectForm isEdit={true} />
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'view') {
    return (
      <DashboardLayout>
        <div className='space-y-3 py-4'>
          <ViewProject />
        </div>
      </DashboardLayout>
    );
  }

  // Default list view
  return (
    <DashboardLayout>
      <div className='space-y-6 py-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-xl text-primary'>Projects ({sortedProjects.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        <Card>
          <CardContent className='p-6'>
            {isLoading ? (
              <ProjectsSkeleton />
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading projects' />
              </div>
            ) : !sortedProjects?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No projects found. Add your first project to get started.' />
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sortedProjects.map((project, index) => {
                  const isNew = index < 3;

                  return (
                    <Card
                      key={project.$id}
                      className='group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer'
                      onClick={e => handleCardClick(project, e)}
                    >
                      {/* Project Image */}
                      <div className='relative h-48 overflow-hidden'>
                        <img
                          src={project.image}
                          alt={project.title}
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        />

                        {/* Overlay gradient */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                        {/* Category Badge */}
                        <div className='absolute top-4 left-4'>
                          <span className='px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30'>
                            {project.category}
                          </span>
                        </div>

                        {/* Year */}
                        <div className='absolute bottom-4 left-4'>
                          <div className='flex items-center gap-1 text-white/90 text-sm'>
                            <Calendar className='w-4 h-4' />
                            {project.year}
                          </div>
                        </div>

                        {/* Actions Menu - Positioned at bottom right */}
                        <div className='absolute bottom-4 right-4'>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                hideChevron
                                className='h-8 w-8 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30'
                                onClick={e => e.stopPropagation()}
                              >
                                <span className='sr-only'>Open menu</span>
                                <MoreVertical className='h-4 w-4 text-white' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => handleView(project)}>
                                <Eye className='h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(project)}>
                                <Edit className='h-4 w-4' />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(project)}
                                className='text-red-600 focus:text-red-600'
                              >
                                <Trash2 className='h-4 w-4' />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Project Content */}
                      <CardContent className='p-6'>
                        <div className='space-y-3'>
                          {/* Title and New Badge */}
                          <div className='flex items-start justify-between gap-3'>
                            <h4 className='font-semibold text-lg text-primary line-clamp-2 leading-tight'>
                              {project.title}
                            </h4>
                            {isNew && (
                              <div className='flex-shrink-0'>
                                <Star className='w-4 h-4 text-yellow-500 fill-current' />
                              </div>
                            )}
                          </div>

                          {/* Subtitle */}
                          <p className='text-primary/80 text-sm line-clamp-2'>{project.subtitle}</p>

                          {/* Impact */}
                          <div className='flex items-center gap-2 text-sm'>
                            <Target className='w-4 h-4 text-green-600' />
                            <span className='text-primary/90 font-medium'>{project.impact}</span>
                          </div>

                          {/* Location */}
                          <div className='flex items-center gap-2 text-sm text-primary/70'>
                            <MapPin className='w-4 h-4' />
                            <span>{project.location}</span>
                          </div>

                          {/* Description Preview */}
                          <p className='text-primary/70 text-xs line-clamp-3 leading-relaxed'>{project.description}</p>
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
          title='Delete Project'
          description={
            selectedProject
              ? `Are you sure you want to delete "${selectedProject.title}"? This action cannot be undone.`
              : 'Are you sure you want to delete this project? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteProjectMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
