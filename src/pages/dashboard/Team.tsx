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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import {
  useGetTeamMembersQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} from '@/hooks/useTeamMembersQuery';
import { Edit, Trash2, Plus, X, Loader2, Edit3, Check, Camera, Users, Mail, Eye, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { handleError, uploadToCloudinary, validateFileSize, ImageUploadStatus, getRelativeTime } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

const TeamPage = () => {
  const { data: teamMembers, error, isLoading } = useGetTeamMembersQuery();
  const createTeamMemberMutation = useCreateTeamMemberMutation();
  const updateTeamMemberMutation = useUpdateTeamMemberMutation();
  const deleteTeamMemberMutation = useDeleteTeamMemberMutation();

  // Modal and UI states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

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
  } = useForm<TeamMemberFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      position: '',
      bio: '',
      profileImageUrl: '',
    },
  });

  const watchedImageUrl = watch('profileImageUrl');

  // Loading skeleton component
  const TeamMembersSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-16'>SN</TableHead>
          <TableHead className='min-w-[280px]'>Team Member</TableHead>
          <TableHead className='hidden md:table-cell min-w-[200px]'>Position</TableHead>
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
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-40' />
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

  // Sort and filter team members
  const sortedMembers = useMemo(() => {
    if (!teamMembers?.data) return [];

    // Sort by creation date (newest first)
    return [...teamMembers.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [teamMembers?.data]);

  // Image upload handler
  const handleImageSelection = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Fix: Use validateFileSize function correctly (single parameter)
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
        setValue('profileImageUrl', url);
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
    setValue('profileImageUrl', '');
  };

  // CRUD handlers
  const handleView = (teamMember: TeamMember): void => {
    setSelectedTeamMember(teamMember);
    setIsViewModalOpen(true);
  };

  const handleEdit = (teamMember: TeamMember): void => {
    setSelectedTeamMember(teamMember);
    reset({
      fullName: teamMember.fullName,
      email: teamMember.email,
      position: teamMember.position,
      bio: teamMember.bio || '',
      profileImageUrl: teamMember.profileImageUrl || '',
    });
    setUploadedImageUrl(teamMember.profileImageUrl || '');
    setUploadStatus(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (teamMember: TeamMember): void => {
    setSelectedTeamMember(teamMember);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = (): void => {
    setSelectedTeamMember(null);
    reset({
      fullName: '',
      email: '',
      position: '',
      bio: '',
      profileImageUrl: '',
    });
    setUploadedImageUrl('');
    setUploadStatus(null);
    setIsCreateModalOpen(true);
  };

  // Form submission
  const onSubmit = async (data: TeamMemberFormData): Promise<void> => {
    try {
      // Check if image is required and uploaded
      if (!uploadedImageUrl && !watchedImageUrl) {
        toast.error('Profile image is required');
        return;
      }

      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        position: data.position.trim(),
        bio: data.bio.trim() || undefined,
        profileImageUrl: uploadedImageUrl || watchedImageUrl,
      };

      if (selectedTeamMember) {
        // Update existing team member
        const res = await updateTeamMemberMutation.mutateAsync({
          id: selectedTeamMember.$id,
          data: payload,
        });

        if (res.ok) {
          setIsEditModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Team member updated successfully');
        }
      } else {
        // Create new team member
        const res = await createTeamMemberMutation.mutateAsync(payload);

        if (res.ok) {
          setIsCreateModalOpen(false);
          reset();
          setUploadedImageUrl('');
          setUploadStatus(null);
          toast.success(res.message || 'Team member created successfully');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedTeamMember) return;

    try {
      const res = await deleteTeamMemberMutation.mutateAsync(selectedTeamMember.$id);

      if (res.ok) {
        setIsDeleteModalOpen(false);
        toast.success(res.message || 'Team member deleted successfully');
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
          Profile Image <span className='text-red-500'>*</span>
        </Label>
        <span className='text-xs text-primary/80'>(Required)</span>
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

          <div className='w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-primary transition-colors cursor-pointer relative group'>
            {uploadedImageUrl || watchedImageUrl ? (
              <img
                src={uploadedImageUrl || watchedImageUrl}
                alt='Profile image'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                <Camera className='w-6 h-6 text-primary' />
              </div>
            )}

            {/* Hover overlay for existing image */}
            {(uploadedImageUrl || watchedImageUrl) && !isUploading && (
              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center'>
                <Camera className='w-6 h-6 text-white' />
              </div>
            )}

            {/* Upload Progress Overlay - Completely covers the content */}
            {uploadStatus && uploadStatus.status === 'uploading' && (
              <div className='absolute inset-0 rounded-full bg-white flex items-center justify-center'>
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
          <p className='text-sm text-primary/90 mb-1'>Click to upload a profile image</p>
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

  // Team Member Form Component
  const TeamMemberForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5 py-4'>
      {/* Avatar Upload */}
      <ImageUpload />

      {/* Full Name and Email */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Full Name */}
        <div className='space-y-2'>
          <Label htmlFor='fullName' className='text-sm font-medium text-primary/80'>
            Full Name <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='fullName'
            type='text'
            placeholder='John Doe'
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
            })}
            className={`w-full ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium text-primary/80'>
            Email Address <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='john.doe@company.com'
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
              maxLength: { value: 255, message: 'Email must not exceed 255 characters' },
            })}
            className={`w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>
      </div>

      {/* Position */}
      <div className='space-y-2'>
        <Label htmlFor='position' className='text-sm font-medium text-primary/80'>
          Position/Title <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='position'
          type='text'
          placeholder='Senior Software Engineer'
          {...register('position', {
            required: 'Position is required',
            minLength: { value: 2, message: 'Position must be at least 2 characters' },
            maxLength: { value: 100, message: 'Position must not exceed 100 characters' },
          })}
          className={`w-full ${errors.position ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.position && <p className='text-red-500 text-xs mt-1'>{errors.position.message}</p>}
      </div>

      {/* Bio */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label htmlFor='bio' className='text-sm font-medium text-primary/80'>
            Bio/Description
          </Label>
          <span className='text-xs text-primary/80'>(Optional)</span>
        </div>
        <Textarea
          id='bio'
          placeholder='Tell us about this team member, their background, expertise, and what they bring to the team...'
          {...register('bio', {
            maxLength: { value: 1000, message: 'Bio must not exceed 1000 characters' },
          })}
          className={`w-full resize-none ${errors.bio ? 'border-red-500 focus:ring-red-500' : ''}`}
          rows={4}
        />
        {errors.bio && <p className='text-red-500 text-xs mt-1'>{errors.bio.message}</p>}
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
              {isEdit ? 'Update Team Member' : 'Add Team Member'}
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
          <h3 className='font-bold text-xl text-primary'>Team Members ({sortedMembers.length})</h3>
          <Button onClick={handleCreate} size='sm' hideChevron className='bg-primary hover:bg-primary/80'>
            <Plus className='w-4 h-4' />
            Add Team Member
          </Button>
        </div>

        {/* Team Members Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <TeamMembersSkeleton />
              </div>
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading team members' />
              </div>
            ) : !sortedMembers?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No team members found. Add your first team member to get started.' />
              </div>
            ) : (
              <div className='overflow-x-auto p-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-16 font-semibold text-primary/80'>SN</TableHead>
                      <TableHead className='min-w-[280px] font-semibold text-primary/80'>Team Member</TableHead>
                      <TableHead className='hidden md:table-cell min-w-[200px] font-semibold text-primary/80'>
                        Position
                      </TableHead>
                      <TableHead className='hidden lg:table-cell min-w-[140px] font-semibold text-primary/80'>
                        Created At
                      </TableHead>
                      <TableHead className='w-16 font-semibold text-primary/80'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMembers.map((member, index) => {
                      const isNew = index < 3;
                      const memberDate = member.$createdAt ? getRelativeTime(member.$createdAt) : '';
                      return (
                        <TableRow key={member.$id} className='hover:bg-gray-50/50 transition-colors'>
                          <TableCell className='font-medium text-primary/90'>{index + 1}</TableCell>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              {/* Profile Image */}
                              <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200'>
                                <img
                                  src={member.profileImageUrl}
                                  alt={member.fullName}
                                  className='w-full h-full object-cover'
                                />
                              </div>

                              {/* Member Info */}
                              <div className='min-w-0 flex-1'>
                                <div className='font-medium text-primary truncate'>{member.fullName}</div>
                                <div className='text-sm text-gray-500 truncate flex items-center gap-1'>
                                  <Mail className='w-3 h-3' />
                                  {member.email}
                                </div>
                              </div>

                              {/* New indicator */}
                              {isNew && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}
                            </div>
                          </TableCell>
                          <TableCell className='text-primary/90 hidden md:table-cell'>
                            <span className='font-medium'>{member.position}</span>
                          </TableCell>
                          <TableCell className='text-gray-500 text-sm hidden lg:table-cell'>{memberDate}</TableCell>
                          <TableCell>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' hideChevron className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleView(member)}>
                                  <Eye className='h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(member)}>
                                  <Edit className='h-4 w-4' />
                                  Edit Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(member)}
                                  className='text-red-600 focus:text-red-600'
                                >
                                  <Trash2 className='h-4 w-4' />
                                  Delete Member
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
              <DialogTitle className='text-lg font-semibold'>Add New Team Member</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Add a new member to your team by filling out the form below.
              </DialogDescription>
            </DialogHeader>
            <TeamMemberForm />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>Edit Team Member</DialogTitle>
              <DialogDescription className='text-sm text-primary/90'>
                Update the details of this team member.
              </DialogDescription>
            </DialogHeader>
            <TeamMemberForm isEdit={true} />
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className='sm:max-w-[550px] max-h-[85vh] overflow-y-auto'>
            <DialogHeader className='pb-3'>
              <DialogTitle className='text-lg font-semibold text-primary flex items-center gap-2'>
                <Users className='w-4 h-4 text-primary/90' />
                Team Member Details
              </DialogTitle>
              <DialogDescription className='text-sm text-gray-500'>
                View information about this team member.
              </DialogDescription>
            </DialogHeader>

            {selectedTeamMember && (
              <div className='space-y-4 py-3'>
                {/* Profile Image and Name */}
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200'>
                    <img
                      src={selectedTeamMember.profileImageUrl}
                      alt={selectedTeamMember.fullName}
                      className='w-full h-full object-cover object-top'
                    />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-primary'>{selectedTeamMember.fullName}</h3>
                    <p className='text-sm text-primary/90'>{selectedTeamMember.position}</p>
                  </div>
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Email Address</label>
                  <div className='flex items-center gap-2'>
                    <Mail className='w-4 h-4 text-gray-400' />
                    <p className='text-sm text-primary/80'>{selectedTeamMember.email}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Bio</label>
                  <div className='p-3 bg-gray-50 rounded-md border'>
                    <p className='text-primary/80 text-sm leading-relaxed whitespace-pre-wrap'>
                      {selectedTeamMember.bio || 'No bio provided'}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Created</label>
                    <p className='text-sm text-primary/80'>
                      {selectedTeamMember.$createdAt ? getRelativeTime(selectedTeamMember.$createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Updated</label>
                    <p className='text-sm text-primary/80'>
                      {selectedTeamMember.$updatedAt ? getRelativeTime(selectedTeamMember.$updatedAt) : 'N/A'}
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
          title='Delete Team Member'
          description={
            selectedTeamMember
              ? `Are you sure you want to delete "${selectedTeamMember.fullName}"? This action cannot be undone.`
              : 'Are you sure you want to delete this team member? This action cannot be undone.'
          }
          confirmText='Delete Permanently'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteTeamMemberMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeamPage;
