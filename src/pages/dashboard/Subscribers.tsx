import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Edit, Trash2, MoreVertical, Loader2, Users, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateWithOrdinal, handleError } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

import {
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from '@/hooks/useSubscriptionsQuery';

const Subscribers: React.FC = () => {
  // TanStack Query hooks
  const { data: subscriptions, error, isLoading } = useGetSubscriptionsQuery();
  const updateSubscriptionMutation = useUpdateSubscriptionMutation();
  const deleteSubscriptionMutation = useDeleteSubscriptionMutation();

  // Modal states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState<string | null>(null);

  // React Hook Form for Edit
  const editForm = useForm<SubscriptionFormData>({
    defaultValues: {
      email: '',
    },
  });

  // Open edit dialog
  const handleEditClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    editForm.reset({
      email: subscription.email,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  // Update subscription handler
  const onEditSubmit = async (data: SubscriptionFormData) => {
    if (!selectedSubscription) return;

    try {
      const result = await updateSubscriptionMutation.mutateAsync({
        id: selectedSubscription.$id!,
        data: {
          ...data,
          email: data.email.trim().toLowerCase(),
        },
      });

      if (result.ok) {
        toast.success(result.message || 'Subscriber updated successfully');
        setIsEditDialogOpen(false);
        setSelectedSubscription(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Delete subscription handler
  const handleDeleteConfirm = async () => {
    if (!selectedSubscription) return;

    try {
      setDeletingSubscriptionId(selectedSubscription.$id!); // Set loading state for specific subscription
      const result = await deleteSubscriptionMutation.mutateAsync(selectedSubscription.$id!);

      if (result.ok) {
        toast.success(result.message || 'Subscriber deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedSubscription(null);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setDeletingSubscriptionId(null); // Clear loading state
    }
  };

  // Loading skeleton component
  const SubscribersSkeleton = () => (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>#</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Last Updated</TableHead>
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
                  <Skeleton className='h-4 w-48' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-8 w-8' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Subscription Form Component
  const SubscriptionForm: React.FC<{
    form: typeof editForm;
    onSubmit: (data: SubscriptionFormData) => void;
    isSubmitting: boolean;
    submitText: string;
  }> = ({ form, onSubmit, isSubmitting, submitText }) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Email */}
      <div className='space-y-2'>
        <Label htmlFor='email'>
          Email Address <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='email'
          type='email'
          placeholder='Enter email address...'
          {...form.register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          className={form.formState.errors.email ? '!border-red-500' : ''}
        />
        {form.formState.errors.email && <p className='text-red-500 text-xs'>{form.formState.errors.email.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          hideChevron
          onClick={() => {
            setIsEditDialogOpen(false);
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' size='sm' hideChevron disabled={isSubmitting} className='bg-primary hover:bg-primary/90'>
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              {submitText}...
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );

  // Sort subscriptions by creation date (newest first)
  const sortedSubscriptions = React.useMemo(() => {
    if (!subscriptions?.data) return [];
    return [...subscriptions.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [subscriptions?.data]);

  return (
    <DashboardLayout>
      <div className='space-y-6 py-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Users className='w-6 h-6 text-primary' />
            <h3 className='font-bold text-xl text-primary'>
              Newsletter Subscribers ({subscriptions?.data?.length || 0})
            </h3>
          </div>
        </div>

        {/* Subscribers Content */}
        <Card>
          <CardContent className='p-6'>
            {isLoading ? (
              <SubscribersSkeleton />
            ) : error ? (
              <Error description='Error loading subscribers' />
            ) : !sortedSubscriptions?.length ? (
              <Empty description='No subscribers found. Subscribers will appear here when users sign up for your newsletter.' />
            ) : (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-12'>#</TableHead>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Subscribed Date</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className='w-16'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubscriptions.map((subscription, index) => (
                      <TableRow key={subscription.$id}>
                        <TableCell className='font-medium'>{index + 1}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Mail className='w-4 h-4 text-gray-400' />
                            <span className='font-medium'>{subscription.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {subscription.$createdAt ? formatDateWithOrdinal(subscription.$createdAt) : 'N/A'}
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {subscription.$updatedAt ? formatDateWithOrdinal(subscription.$updatedAt) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                hideChevron
                                className='h-8 w-8 p-0'
                                disabled={deletingSubscriptionId === subscription.$id}
                              >
                                {deletingSubscriptionId === subscription.$id ? (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                  <MoreVertical className='h-4 w-4' />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(subscription)}
                                disabled={deletingSubscriptionId === subscription.$id}
                              >
                                <Edit className='h-4 w-4' />
                                Edit Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(subscription)}
                                className='text-red-600 focus:text-red-600'
                                disabled={deletingSubscriptionId === subscription.$id}
                              >
                                <Trash2 className='h-4 w-4' />
                                Delete Subscriber
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Edit className='w-5 h-5 text-primary' />
                Edit Subscriber
              </DialogTitle>
              <DialogDescription>Update the email address for this subscriber.</DialogDescription>
            </DialogHeader>
            <SubscriptionForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={updateSubscriptionMutation.isPending}
              submitText='Update Subscriber'
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title='Delete Subscriber'
          description={
            selectedSubscription
              ? `Are you sure you want to delete the subscriber "${selectedSubscription.email}"? This action cannot be undone.`
              : 'Are you sure you want to delete this subscriber? This action cannot be undone.'
          }
          confirmText='Delete Subscriber'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteSubscriptionMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default Subscribers;
