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
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from '@/hooks/usePartners';
import {
  Edit,
  Trash2,
  Plus,
  X,
  Loader2,
  Edit3,
  Check,
  Camera,
  Building2,
  ExternalLink,
  Eye,
  MoreVertical,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { handleError, uploadToCloudinary, validateFileSize, ImageUploadStatus } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

// Type definitions
interface Partner {
  $id: string;
  name: string;
  logo?: string;
  website?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface PartnerFormData {
  name: string;
  logo: string;
  website: string;
}

const PartnersPage = () => {
  const { data: partners, error, isLoading } = useGetPartnersQuery();
  const createPartnerMutation = useCreatePartnerMutation();
  const updatePartnerMutation = useUpdatePartnerMutation();
  const deletePartnerMutation = useDeletePartnerMutation();

  // Modal and UI states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

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
  } = useForm<PartnerFormData>({
    defaultValues: {
      name: '',
      logo: '',
      website: '',
    },
  });

  const watchedImageUrl = watch('logo');

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
  const PartnersSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-16'>SN</TableHead>
          <TableHead className='min-w-[280px]'>Partner</TableHead>
          <TableHead className='hidden md:table-cell min-w-[200px]'>Website</TableHead>
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
                <Skeleton className='h-12 w-12 rounded' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton className='h-4 w-32' />
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

  // Sort partners
  const sortedPartners = useMemo(() => {
    if (!partners?.data) return [];

    // Sort by creation date (newest first)
    return [...partners.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [partners?.data]);

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
        setValue('logo', url);
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
    setValue('logo', '');
  };

  // CRUD handlers
  const handleView = (partner: Partner): void => {
    setSelectedPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleEdit = (partner: Partner): void => {
    setSelectedPartner(partner);
    reset({
      name: partner.name,
      logo: partner.logo || '',
      website: partner.website || '',
    });
    setUploadedImageUrl(partner.logo || '');
    setUploadStatus(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (partner: Partner): void => {
    setSelectedPartner(partner);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    setSelectedPartner(null);
    reset({
      name: '',
      logo: '',
      website: '',
    });
    setUploadedImageUrl('');
    setUploadStatus(null);
    setIsCreateModalOpen(true);
  };

  // Form submission
  const onSubmit = async (data: PartnerFormData): Promise<void> => {
    try {
      // Check if logo is required and uploaded
      if (!uploadedImageUrl && !watchedImageUrl) {
        toast.error('Partner logo is required');
        return;
      }

      const payload = {
        name: data.name.trim(),
        website: data.website.trim(),
        logo: uploadedImageUrl || watchedImageUrl,
      };

      if (selectedPartner) {
        // Update existing partner
        const res = await updatePartnerMutation.mutateAsync({
          id: selectedPartner.$id,
          data: payload,
        });

        if (res.ok) {
          setIsEditModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Partner updated successfully');
        }
      } else {
        // Create new partner
        const res = await createPartnerMutation.mutateAsync(payload);

        if (res.ok) {
          setIsCreateModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Partner created successfully');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedPartner) return;

    try {
      const res = await deletePartnerMutation.mutateAsync(selectedPartner.$id);

      if (res.ok) {
        setIsDeleteModalOpen(false);
        toast.success(res.message || 'Partner deleted successfully');
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

  // Logo Upload Component
  const LogoUpload: React.FC = () => (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Label className='text-sm font-medium text-primary/80'>
          Partner Logo <span className='text-red-500'>*</span>
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

          <div className='w-20 h-20 rounded bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-primary transition-colors cursor-pointer relative group'>
            {uploadedImageUrl || watchedImageUrl ? (
              <img
                src={uploadedImageUrl || watchedImageUrl}
                alt='Partner logo'
                className='w-full h-full object-contain p-2'
              />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
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
          <p className='text-sm text-primary/90 mb-1'>Click to upload a partner logo</p>
          <p className='text-xs text-gray-500'>PNG, JPG, or JPEG (max 10MB) - Required</p>
          {uploadStatus?.status === 'completed' && (
            <div className='flex items-center gap-2 text-green-600 mt-2'>
              <Check className='w-4 h-4' />
              <span className='text-sm'>Logo uploaded successfully!</span>
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

  // Partner Form Component
  const PartnerForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5 py-4'>
      {/* Logo Upload */}
      <LogoUpload />

      {/* Partner Name */}
      <div className='space-y-2'>
        <Label htmlFor='name' className='text-sm font-medium text-primary/80'>
          Partner Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='name'
          type='text'
          placeholder='Company Name'
          {...register('name', {
            required: 'Partner name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
          })}
          className={`w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
      </div>

      {/* Website - Now Required */}
      <div className='space-y-2'>
        <Label htmlFor='website' className='text-sm font-medium text-primary/80'>
          Website URL <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='website'
          type='url'
          placeholder='https://example.com'
          {...register('website', {
            required: 'Website URL is required',
            pattern: {
              value: /^https?:\/\/.+\..+/,
              message: 'Please enter a valid URL (e.g., https://example.com)',
            },
            maxLength: { value: 255, message: 'Website URL must not exceed 255 characters' },
          })}
          className={`w-full ${errors.website ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.website && <p className='text-red-500 text-xs mt-1'>{errors.website.message}</p>}
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
              {isEdit ? 'Update Partner' : 'Add Partner'}
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
          <h3 className='font-bold text-xl text-primary'>Partners ({sortedPartners.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add Partner
          </Button>
        </div>

        {/* Partners Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <PartnersSkeleton />
              </div>
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading partners' />
              </div>
            ) : !sortedPartners?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No partners found. Add your first partner to get started.' />
              </div>
            ) : (
              <div className='overflow-x-auto p-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-16 font-semibold text-primary/80'>SN</TableHead>
                      <TableHead className='min-w-[280px] font-semibold text-primary/80'>Partner</TableHead>
                      <TableHead className='hidden md:table-cell min-w-[200px] font-semibold text-primary/80'>
                        Website
                      </TableHead>
                      <TableHead className='hidden lg:table-cell min-w-[140px] font-semibold text-primary/80'>
                        Created At
                      </TableHead>
                      <TableHead className='w-16 font-semibold text-primary/80'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPartners.map((partner, index) => {
                      const isNew = index < 3;
                      const partnerDate = partner.$createdAt ? getRelativeTime(partner.$createdAt) : '';

                      return (
                        <TableRow key={partner.$id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-primary/90'>{index + 1}</TableCell>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              {/* Logo */}
                              <div className='w-12 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200'>
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className='w-full h-full object-contain p-1'
                                />
                              </div>

                              {/* Partner Info */}
                              <div className='min-w-0 flex-1'>
                                <div className='font-medium text-primary truncate'>{partner.name}</div>
                              </div>

                              {/* New indicator */}
                              {isNew && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}
                            </div>
                          </TableCell>
                          <TableCell className='text-primary/90 hidden md:table-cell'>
                            {partner.website ? (
                              <a
                                href={partner.website}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-1 text-blue-600 hover:text-blue-800 truncate'
                                onClick={e => e.stopPropagation()}
                              >
                                <Globe className='w-3 h-3' />
                                {partner.website.replace(/^https?:\/\//, '')}
                                <ExternalLink className='w-3 h-3' />
                              </a>
                            ) : (
                              <span className='text-gray-400'>No website</span>
                            )}
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm hidden lg:table-cell'>{partnerDate}</TableCell>
                          <TableCell>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' hideChevron className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(partner)}>
                                  <Eye className='h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(partner)}>
                                  <Edit className='h-4 w-4' />
                                  Edit Partner
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(partner)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  Delete Partner
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
              <DialogTitle className='text-lg font-semibold'>Add New Partner</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Add a new partner by filling out the form below. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <PartnerForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Partner</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Update the details of this partner. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <PartnerForm isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[550px] max-h-[85vh] overflow-y-auto'>
            <DialogHeader className='pb-3'>
              <DialogTitle className='text-lg font-semibold text-primary flex items-center gap-2'>
                <Building2 className='w-4 h-4 text-primary/90' />
                Partner Details
              </DialogTitle>
              <DialogDescription className='text-sm text-gray-500'>
                View information about this partner.
              </DialogDescription>
            </DialogHeader>

            {selectedPartner && (
              <div className='space-y-4 py-3'>
                {/* Logo and Name */}
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 rounded bg-gray-100 flex items-center justify-center border-2 border-gray-200'>
                    <img
                      src={selectedPartner.logo}
                      alt={selectedPartner.name}
                      className='w-full h-full object-contain p-2'
                    />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-primary'>{selectedPartner.name}</h3>
                  </div>
                </div>

                {/* Website */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Website</label>
                  <div className='flex items-center gap-2'>
                    <Globe className='w-4 h-4 text-gray-400' />
                    {selectedPartner.website ? (
                      <a
                        href={selectedPartner.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
                      >
                        {selectedPartner.website}
                        <ExternalLink className='w-3 h-3' />
                      </a>
                    ) : (
                      <p className='text-sm text-gray-400'>No website provided</p>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Created</label>
                    <p className='text-sm text-primary/80'>
                      {selectedPartner.$createdAt ? getRelativeTime(selectedPartner.$createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Updated</label>
                    <p className='text-sm text-primary/80'>
                      {selectedPartner.$updatedAt ? getRelativeTime(selectedPartner.$updatedAt) : 'N/A'}
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
          title='Delete Partner'
          description={
            selectedPartner
              ? `Are you sure you want to delete "${selectedPartner.name}"? This action cannot be undone.`
              : 'Are you sure you want to delete this partner? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deletePartnerMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default PartnersPage;
