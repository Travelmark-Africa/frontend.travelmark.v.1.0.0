import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import {
  useGetRegionsQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} from '@/hooks/useRegionsQuery';
import { Edit, Trash2, Plus, X, Loader2, Edit3, Check, Camera, MapPin, Eye, MoreVertical, Map } from 'lucide-react';
import { toast } from 'sonner';
import { handleError, uploadToCloudinary, validateFileSize, ImageUploadStatus } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

const RegionsPage = () => {
  const { data: regions, error, isLoading } = useGetRegionsQuery();
  const createRegionMutation = useCreateRegionMutation();
  const updateRegionMutation = useUpdateRegionMutation();
  const deleteRegionMutation = useDeleteRegionMutation();

  // Modal and UI states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

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
  } = useForm<RegionFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: '',
    },
  });

  const watchedImageUrl = watch('image');

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Loading skeleton component
  const RegionsSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-16'>SN</TableHead>
          <TableHead className='min-w-[280px]'>Region</TableHead>
          <TableHead className='hidden md:table-cell min-w-[300px]'>Description</TableHead>
          <TableHead className='hidden lg:table-cell min-w-[140px]'>Created At</TableHead>
          <TableHead className='w-16'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-12 w-16 rounded' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton className='h-4 w-48' />
            </TableCell>
            <TableCell className='hidden lg:table-cell'>
              <Skeleton className='h-4 w-24' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Sort regions
  const sortedRegions = useMemo(() => {
    if (!regions?.data) return [];

    // Sort by creation date (newest first)
    return [...regions.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [regions?.data]);

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
  const handleView = (region: Region): void => {
    setSelectedRegion(region);
    setIsViewModalOpen(true);
  };

  const handleEdit = (region: Region): void => {
    setSelectedRegion(region);
    reset({
      name: region.name,
      description: region.description,
      image: region.image || '',
    });
    setUploadedImageUrl(region.image || '');
    setUploadStatus(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (region: Region): void => {
    setSelectedRegion(region);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    setSelectedRegion(null);
    reset({
      name: '',
      description: '',
      image: '',
    });
    setUploadedImageUrl('');
    setUploadStatus(null);
    setIsCreateModalOpen(true);
  };

  // Form submission
  const onSubmit = async (data: RegionFormData): Promise<void> => {
    try {
      // Check if image is required and uploaded
      if (!uploadedImageUrl && !watchedImageUrl) {
        toast.error('Region image is required');
        return;
      }

      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        image: uploadedImageUrl || watchedImageUrl,
      };

      if (selectedRegion) {
        // Update existing region
        const res = await updateRegionMutation.mutateAsync({
          id: selectedRegion.$id,
          data: payload,
        });

        if (res.ok) {
          setIsEditModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Region updated successfully');
        }
      } else {
        // Create new region
        const res = await createRegionMutation.mutateAsync(payload);

        if (res.ok) {
          setIsCreateModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Region created successfully');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedRegion) return;

    try {
      const res = await deleteRegionMutation.mutateAsync(selectedRegion.$id);

      if (res.ok) {
        setIsDeleteModalOpen(false);
        toast.success(res.message || 'Region deleted successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Modal close handlers
  const closeCreateModal = (): void => {
    setIsCreateModalOpen(false);
    reset();
    setUploadedImageUrl('');
    setUploadStatus(null);
  };

  const closeEditModal = (): void => {
    setIsEditModalOpen(false);
    reset();
    setUploadedImageUrl('');
    setUploadStatus(null);
  };

  const isUploading = uploadStatus?.status === 'uploading';

  // Image Upload Component
  const ImageUpload: React.FC = () => (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Label className='text-sm font-medium text-primary/80'>
          Region Image <span className='text-red-500'>*</span>
        </Label>
      </div>

      <div className='flex items-center gap-6'>
        <div className='relative'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageSelection}
            className='absolute inset-0 opacity-0 cursor-pointer z-10'
            disabled={isUploading}
          />

          <div className='w-24 h-20 rounded bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-primary transition-colors cursor-pointer relative group'>
            {uploadedImageUrl || watchedImageUrl ? (
              <img
                src={uploadedImageUrl || watchedImageUrl}
                alt='Region image'
                className='w-full h-full object-cover rounded'
              />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center rounded'>
                <Camera className='w-6 h-6 text-primary' />
              </div>
            )}

            {/* Hover overlay for existing image */}
            {(uploadedImageUrl || watchedImageUrl) && !isUploading && (
              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center rounded'>
                <Camera className='w-6 h-6 text-white' />
              </div>
            )}

            {/* Upload Progress Overlay */}
            {uploadStatus && uploadStatus.status === 'uploading' && (
              <div className='absolute inset-0 rounded bg-white flex items-center justify-center'>
                <div className='text-center'>
                  <Loader2 className='w-6 h-6 text-primary animate-spin mx-auto mb-1' />
                  <div className='text-xs text-primary font-medium'>{Math.round(uploadStatus.progress)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {(uploadedImageUrl || watchedImageUrl) && !isUploading && (
            <button
              type='button'
              onClick={removeImage}
              className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md z-20'
            >
              <X className='w-3 h-3' />
            </button>
          )}
        </div>

        <div className='flex-1'>
          <p className='text-sm text-primary/90 mb-1'>Click to upload a region image</p>
          <p className='text-xs text-gray-500'>PNG, JPG, or JPEG (max 10MB) - Required</p>
          {uploadStatus?.status === 'completed' && (
            <div className='flex items-center gap-2 text-green-600 mt-2'>
              <Check className='w-4 h-4' />
              <span className='text-sm'>Image uploaded successfully!</span>
            </div>
          )}
          {uploadStatus?.status === 'error' && (
            <div className='flex items-center gap-2 text-red-600 mt-2'>
              <X className='w-4 h-4' />
              <span className='text-sm'>Upload failed. Please try again.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Region Form Component
  const RegionForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5 py-4'>
      {/* Image Upload */}
      <ImageUpload />

      {/* Region Name */}
      <div className='space-y-2'>
        <Label htmlFor='name' className='text-sm font-medium text-primary/80'>
          Region Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='name'
          type='text'
          placeholder='Region Name'
          {...register('name', {
            required: 'Region name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
          })}
          className={`w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-sm font-medium text-primary/80'>
          Description
        </Label>
        <Textarea
          id='description'
          placeholder='Enter a description of the region...'
          rows={4}
          {...register('description')}
          className={`w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-3 border-t border-primary/5'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          hideChevron
          onClick={isEdit ? closeEditModal : closeCreateModal}
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
              {isEdit ? <Edit3 className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
              {isEdit ? 'Update Region' : 'Add Region'}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <DashboardLayout>
      <div className='space-y-6 py-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-xl text-primary'>Regions ({sortedRegions.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add Region
          </Button>
        </div>

        {/* Regions Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <RegionsSkeleton />
              </div>
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading regions' />
              </div>
            ) : !sortedRegions?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No regions found. Add your first region to get started.' />
              </div>
            ) : (
              <div className='overflow-x-auto p-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-16 font-semibold text-primary/80'>SN</TableHead>
                      <TableHead className='min-w-[280px] font-semibold text-primary/80'>Region</TableHead>
                      <TableHead className='hidden md:table-cell min-w-[300px] font-semibold text-primary/80'>
                        Description
                      </TableHead>
                      <TableHead className='hidden lg:table-cell min-w-[140px] font-semibold text-primary/80'>
                        Created At
                      </TableHead>
                      <TableHead className='w-16 font-semibold text-primary/80'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRegions.map((region, index) => {
                      const isNew = index < 3;
                      const regionDate = region.$createdAt ? getRelativeTime(region.$createdAt) : '';

                      return (
                        <TableRow key={region.$id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-primary/90'>{index + 1}</TableCell>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              {/* Image */}
                              <div className='w-16 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden'>
                                <img src={region.image} alt={region.name} className='w-full h-full object-cover' />
                              </div>

                              {/* Region Info */}
                              <div className='min-w-0 flex-1'>
                                <div className='font-medium text-primary truncate'>{region.name}</div>
                              </div>

                              {/* New indicator */}
                              {isNew && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}
                            </div>
                          </TableCell>
                          <TableCell className='text-primary/90 hidden md:table-cell'>
                            <div className='max-w-xs'>
                              <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
                                {region.description ? region.description : 'No description available'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm hidden lg:table-cell'>{regionDate}</TableCell>
                          <TableCell>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' hideChevron className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(region)}>
                                  <Eye className='h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(region)}>
                                  <Edit className='h-4 w-4' />
                                  Edit Region
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(region)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  Delete Region
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
          <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Add New Region</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Add a new region by filling out the form below. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <RegionForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Region</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Update the details of this region. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <RegionForm isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[85vh] overflow-y-auto'>
            <DialogHeader className='pb-3'>
              <DialogTitle className='text-lg font-semibold text-primary flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-primary/90' />
                Region Details
              </DialogTitle>
              <DialogDescription className='text-sm text-gray-500'>
                View information about this region.
              </DialogDescription>
            </DialogHeader>

            {selectedRegion && (
              <div className='space-y-4 py-3'>
                {/* Image and Name */}
                <div className='space-y-3'>
                  <div className='w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden'>
                    <img src={selectedRegion.image} alt={selectedRegion.name} className='w-full h-full object-cover' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-primary'>{selectedRegion.name}</h3>
                  </div>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Description</label>
                  <div className='flex items-start gap-2'>
                    <Map className='w-4 h-4 text-gray-400 mt-1 flex-shrink-0' />
                    <p className='text-sm text-gray-700 leading-relaxed'>{selectedRegion.description}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Created</label>
                    <p className='text-sm text-primary/80'>
                      {selectedRegion.$createdAt ? getRelativeTime(selectedRegion.$createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Updated</label>
                    <p className='text-sm text-primary/80'>
                      {selectedRegion.$updatedAt ? getRelativeTime(selectedRegion.$updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='flex justify-end pt-3 border-t'>
              <Button size='sm' variant='outline' hideChevron onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title='Delete Region'
          description={
            selectedRegion
              ? `Are you sure you want to delete "${selectedRegion.name}"? This action cannot be undone.`
              : 'Are you sure you want to delete this region? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteRegionMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default RegionsPage;
