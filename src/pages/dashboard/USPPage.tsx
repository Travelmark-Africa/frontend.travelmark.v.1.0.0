import { useState, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useGetUSPsQuery, useCreateUSPMutation, useUpdateUSPMutation, useDeleteUSPMutation } from '@/hooks/useUSPs';
import { Edit, Trash2, Plus, X, Loader2, Edit3, MoreVertical, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { handleError, getRelativeTime } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';
import { ICONS, getIconComponent } from '@/constants';

const USPPage = () => {
  const { data: usps, error, isLoading } = useGetUSPsQuery();
  const createUSPMutation = useCreateUSPMutation();
  const updateUSPMutation = useUpdateUSPMutation();
  const deleteUSPMutation = useDeleteUSPMutation();

  // Modal and UI states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUSP, setSelectedUSP] = useState<USP | null>(null);

  // React Hook Form - Added setValue
  const {
    register,
    handleSubmit,
    reset,
    setValue, // Added setValue
    watch,
    formState: { errors, isSubmitting },
  } = useForm<USPFormData>({
    defaultValues: {
      title: '',
      description: '',
      iconName: '',
    },
  });

  // Loading skeleton component
  const USPSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-16'>SN</TableHead>
          <TableHead className='min-w-[120px]'>Icon</TableHead>
          <TableHead className='min-w-[200px]'>Title</TableHead>
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
              <Skeleton className='h-8 w-8 rounded-md' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton className='h-4 w-64' />
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

  // Sort and filter USPs
  const sortedUSPs = useMemo(() => {
    if (!usps?.data) return [];

    // Sort by creation date (newest first)
    return [...usps.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [usps?.data]);

  // CRUD handlers
  const handleView = (usp: USP): void => {
    setSelectedUSP(usp);
    setIsViewModalOpen(true);
  };

  const handleEdit = (usp: USP): void => {
    setSelectedUSP(usp);
    reset({
      title: usp.title,
      description: usp.description,
      iconName: usp.iconName,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (usp: USP): void => {
    setSelectedUSP(usp);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    setSelectedUSP(null);
    reset({
      title: '',
      description: '',
      iconName: '',
    });
    setIsCreateModalOpen(true);
  };

  // Form submission
  const onSubmit = async (data: USPFormData): Promise<void> => {
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        iconName: data.iconName,
      };

      if (selectedUSP) {
        // Update existing USP
        const res = await updateUSPMutation.mutateAsync({
          id: selectedUSP.$id,
          data: payload,
        });

        if (res.ok) {
          setIsEditModalOpen(false);
          reset();
          toast.success(res.message || 'USP updated successfully');
        }
      } else {
        // Create new USP
        const res = await createUSPMutation.mutateAsync(payload);

        if (res.ok) {
          setIsCreateModalOpen(false);
          reset();
          toast.success(res.message || 'USP created successfully');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedUSP) return;

    try {
      const res = await deleteUSPMutation.mutateAsync(selectedUSP.$id);

      if (res.ok) {
        setIsDeleteModalOpen(false);
        toast.success(res.message || 'USP deleted successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Modal close handlers
  const closeCreateModal = (): void => {
    setIsCreateModalOpen(false);
    reset();
  };

  const closeEditModal = (): void => {
    setIsEditModalOpen(false);
    reset();
  };

  // Icon selection component - Fixed to use getIconComponent
  const IconSelector = () => {
    const selectedIcon = watch('iconName');

    return (
      <div className='space-y-3'>
        <Label className='text-sm font-medium text-primary/80'>
          Icon <span className='text-red-500'>*</span>
        </Label>

        <div className='grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md'>
          {ICONS.map(iconName => {
            const IconComponent = getIconComponent(iconName);
            return (
              <button
                type='button'
                key={iconName}
                onClick={() => setValue('iconName', iconName)}
                className={`p-2 rounded-md border transition-colors ${
                  selectedIcon === iconName
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-primary border-gray-200 hover:border-primary'
                }`}
              >
                <IconComponent className='w-5 h-5 mx-auto' />
              </button>
            );
          })}
        </div>

        {errors.iconName && <p className='text-red-500 text-xs mt-1'>{errors.iconName.message}</p>}
      </div>
    );
  };

  // USP Form Component
  const USPForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5 py-4'>
      {/* Title */}
      <div className='space-y-2'>
        <Label htmlFor='title' className='text-sm font-medium text-primary/80'>
          Title <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='title'
          type='text'
          placeholder='Fast Delivery'
          {...register('title', {
            required: 'Title is required',
            minLength: { value: 2, message: 'Title must be at least 2 characters' },
            maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
          })}
          className={`w-full ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.title && <p className='text-red-500 text-xs mt-1'>{errors.title.message}</p>}
      </div>

      {/* Icon Selector */}
      <IconSelector />

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-sm font-medium text-primary/80'>
          Description <span className='text-red-500'>*</span>
        </Label>
        <Textarea
          id='description'
          placeholder='Describe your unique selling point...'
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
          })}
          className={`w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
          rows={4}
        />
        {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-3 border-t border-primary/5'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          hideChevron
          onClick={isEdit ? closeEditModal : closeCreateModal}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEdit ? <Edit3 className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
              {isEdit ? 'Update USP' : 'Add USP'}
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
          <h3 className='font-bold text-xl text-primary'>Unique Selling Points ({sortedUSPs.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add USP
          </Button>
        </div>

        {/* USPs Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <USPSkeleton />
              </div>
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading USPs' />
              </div>
            ) : !sortedUSPs?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No USPs found. Add your first USP to get started.' />
              </div>
            ) : (
              <div className='overflow-x-auto p-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-16 font-semibold text-primary/80'>SN</TableHead>
                      <TableHead className='min-w-[120px] font-semibold text-primary/80'>Icon</TableHead>
                      <TableHead className='min-w-[200px] font-semibold text-primary/80'>Title</TableHead>
                      <TableHead className='hidden lg:table-cell min-w-[140px] font-semibold text-primary/80'>
                        Created At
                      </TableHead>
                      <TableHead className='w-16 font-semibold text-primary/80'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUSPs.map((usp, index) => {
                      const uspDate = usp.$createdAt ? getRelativeTime(usp.$createdAt) : '';
                      const IconComponent = getIconComponent(usp.iconName);

                      return (
                        <TableRow key={usp.$id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-primary/90'>{index + 1}</TableCell>
                          <TableCell>
                            <div className='w-8 h-8 flex items-center justify-center rounded-md bg-primary/10'>
                              <IconComponent className='w-5 h-5 text-primary' />
                            </div>
                          </TableCell>
                          <TableCell className='font-medium text-primary/90'>{usp.title}</TableCell>

                          <TableCell className='text-gray-500 text-sm hidden lg:table-cell'>{uspDate}</TableCell>
                          <TableCell>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' hideChevron className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(usp)}>
                                  <Eye className='h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(usp)}>
                                  <Edit className='h-4 w-4' />
                                  Edit USP
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(usp)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  Delete USP
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
              <DialogTitle className='text-lg font-semibold'>Add New USP</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Add a new unique selling point for your business.
              </DialogDescription>
            </DialogHeader>
            <USPForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit USP</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Update the details of this unique selling point.
              </DialogDescription>
            </DialogHeader>
            <USPForm isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[550px] max-h-[85vh] overflow-y-auto'>
            <DialogHeader className='pb-3'>
              <DialogTitle className='text-lg font-semibold text-primary'>USP Details</DialogTitle>
              <DialogDescription className='text-sm text-gray-500'>
                View information about this unique selling point.
              </DialogDescription>
            </DialogHeader>

            {selectedUSP && (
              <div className='space-y-4 py-3'>
                {/* Icon and Title */}
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center'>
                    {(() => {
                      const IconComponent = getIconComponent(selectedUSP.iconName);
                      return <IconComponent className='w-6 h-6 text-primary' />;
                    })()}
                  </div>
                  <h3 className='text-xl font-semibold text-primary'>{selectedUSP.title}</h3>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Description</label>
                  <div className='p-3 bg-gray-50 rounded-md border'>
                    <p className='text-primary/80 text-sm leading-relaxed whitespace-pre-wrap'>
                      {selectedUSP.description}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Created</label>
                    <p className='text-sm text-primary/80'>
                      {selectedUSP.$createdAt ? getRelativeTime(selectedUSP.$createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Updated</label>
                    <p className='text-sm text-primary/80'>
                      {selectedUSP.$updatedAt ? getRelativeTime(selectedUSP.$updatedAt) : 'N/A'}
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
          title='Delete USP'
          description={
            selectedUSP
              ? `Are you sure you want to delete "${selectedUSP.title}"? This action cannot be undone.`
              : 'Are you sure you want to delete this USP? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteUSPMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default USPPage;
