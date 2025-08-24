import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Plus, Edit, Trash2, MoreVertical, Loader2, MessageSquare, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateWithOrdinal, handleError } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

// Import TanStack Query hooks
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '@/hooks/useFAQsQuery';

const FAQsPage: React.FC = () => {
  // TanStack Query hooks
  const { data: faqs, error, isLoading } = useGetFAQsQuery();
  const createFAQMutation = useCreateFAQMutation();
  const updateFAQMutation = useUpdateFAQMutation();
  const deleteFAQMutation = useDeleteFAQMutation();

  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [deletingFAQId, setDeletingFAQId] = useState<string | null>(null);

  // React Hook Form for Create
  const createForm = useForm<FAQFormData>({
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  // React Hook Form for Edit
  const editForm = useForm<FAQFormData>({
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  // Reset create form
  const resetCreateForm = () => {
    createForm.reset({
      question: '',
      answer: '',
    });
  };

  // Open create dialog
  const handleCreateClick = () => {
    resetCreateForm();
    setIsCreateDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (faq: FAQ) => {
    setSelectedFAQ(faq);
    editForm.reset({
      question: faq.question,
      answer: faq.answer,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteModalOpen(true);
  };

  // Create FAQ handler
  const onCreateSubmit = async (data: FAQFormData) => {
    try {
      const result = await createFAQMutation.mutateAsync({
        ...data,
        question: data.question.trim(),
        answer: data.answer.trim(),
      });

      if (result.ok) {
        toast.success(result.message || 'FAQ created successfully');
        setIsCreateDialogOpen(false);
        resetCreateForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Update FAQ handler
  const onEditSubmit = async (data: FAQFormData) => {
    if (!selectedFAQ) return;

    try {
      const result = await updateFAQMutation.mutateAsync({
        id: selectedFAQ.$id,
        data: {
          ...data,
          question: data.question.trim(),
          answer: data.answer.trim(),
        },
      });

      if (result.ok) {
        toast.success(result.message || 'FAQ updated successfully');
        setIsEditDialogOpen(false);
        setSelectedFAQ(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Delete FAQ handler
  const handleDeleteConfirm = async () => {
    if (!selectedFAQ) return;

    try {
      setDeletingFAQId(selectedFAQ.$id); // Set loading state for specific FAQ
      const result = await deleteFAQMutation.mutateAsync(selectedFAQ.$id);

      if (result.ok) {
        toast.success(result.message || 'FAQ deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedFAQ(null);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setDeletingFAQId(null); // Clear loading state
    }
  };

  // Loading skeleton component
  const FAQSkeleton = () => (
    <div className='space-y-4'>
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <Skeleton className='h-8 w-8' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // FAQ Form Component
  const FAQForm: React.FC<{
    form: typeof createForm | typeof editForm;
    onSubmit: (data: FAQFormData) => void;
    isSubmitting: boolean;
    submitText: string;
    isEdit?: boolean;
  }> = ({ form, onSubmit, isSubmitting, submitText, isEdit = false }) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {/* Question */}
      <div className='space-y-2'>
        <Label htmlFor='question'>
          Question <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='question'
          placeholder='Enter the FAQ question...'
          {...form.register('question', {
            required: 'Question is required',
            minLength: { value: 10, message: 'Question must be at least 10 characters' },
            maxLength: { value: 200, message: 'Question must not exceed 200 characters' },
          })}
          className={form.formState.errors.question ? '!border-red-500' : ''}
        />
        {form.formState.errors.question && (
          <p className='text-red-500 text-xs'>{form.formState.errors.question.message}</p>
        )}
      </div>

      {/* Answer */}
      <div className='space-y-2'>
        <Label htmlFor='answer'>
          Answer <span className='text-red-500'>*</span>
        </Label>
        <Textarea
          id='answer'
          placeholder='Enter the FAQ answer...'
          {...form.register('answer', {
            required: 'Answer is required',
            minLength: { value: 10, message: 'Answer must be at least 10 characters' },
            maxLength: { value: 1000, message: 'Answer must not exceed 1000 characters' },
          })}
          className={`resize-none ${form.formState.errors.answer ? '!border-red-500' : ''}`}
          rows={5}
        />
        {form.formState.errors.answer && <p className='text-red-500 text-xs'>{form.formState.errors.answer.message}</p>}
      </div>

      {/* Order - Only show for create, not edit */}
      {!isEdit && (
        <div className='space-y-2'>
          <Label>FAQ #{((faqs?.data?.length || 0) + 1).toString().padStart(3, '0')}</Label>
          <p className='text-xs text-gray-500'>This will be FAQ number {(faqs?.data?.length || 0) + 1}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          hideChevron
          onClick={() => {
            setIsCreateDialogOpen(false);
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

  // Sort FAQs by creation date (newest first)
  const sortedFAQs = React.useMemo(() => {
    if (!faqs?.data) return [];
    return [...faqs.data].sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [faqs?.data]);

  return (
    <DashboardLayout>
      <div className='space-y-6 py-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <HelpCircle className='w-6 h-6 text-primary' />
            <h3 className='font-bold text-xl text-primary'>Frequently Asked Questions ({faqs?.data?.length || 0})</h3>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick} size='sm' hideChevron className='bg-primary hover:bg-primary/90'>
                <Plus className='w-4 h-4' />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <MessageSquare className='w-5 h-5 text-primary' />
                  Create New FAQ
                </DialogTitle>
                <DialogDescription>
                  Add a new frequently asked question and answer to help your users.
                </DialogDescription>
              </DialogHeader>
              <FAQForm
                form={createForm}
                onSubmit={onCreateSubmit}
                isSubmitting={createFAQMutation.isPending}
                submitText='Create FAQ'
                isEdit={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* FAQs Content */}
        <Card>
          <CardContent className='p-6'>
            {isLoading ? (
              <FAQSkeleton />
            ) : error ? (
              <Error description='Error loading FAQs' />
            ) : !sortedFAQs?.length ? (
              <Empty description='No FAQs found. Create your first FAQ to help your users find answers quickly.' />
            ) : (
              <div className='space-y-4'>
                <Accordion type='single' collapsible className='space-y-2'>
                  {sortedFAQs.map((faq, index) => (
                    <AccordionItem
                      key={faq.$id}
                      value={faq.$id || `faq-${index}`}
                      className='border-1 rounded-lg px-4 hover:bg-gray-50/50 transition-colors'
                    >
                      <div className='flex items-center justify-between pr-2'>
                        <AccordionTrigger className='flex-1 text-left hover:no-underline py-4'>
                          <div className='flex items-start gap-3 text-left'>
                            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5 flex-shrink-0'>
                              {index + 1}
                            </div>
                            <span className='text-primary leading-relaxed'>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              hideChevron
                              className='h-8 w-8 p-0 ml-2'
                              disabled={deletingFAQId === faq.$id}
                            >
                              {deletingFAQId === faq.$id ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <MoreVertical className='h-4 w-4' />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleEditClick(faq)} disabled={deletingFAQId === faq.$id}>
                              <Edit className='h-4 w-4' />
                              Edit FAQ
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(faq)}
                              className='text-red-600 focus:text-red-600'
                              disabled={deletingFAQId === faq.$id}
                            >
                              <Trash2 className='h-4 w-4' />
                              Delete FAQ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <AccordionContent className='pb-4 pt-2'>
                        <div className='pl-9 pr-4'>
                          <div className='p-4 bg-gray-50 rounded-md border-l-2 border-primary'>
                            <p className='text-primary/80 leading-relaxed whitespace-pre-wrap'>{faq.answer}</p>
                            <div className='mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between'>
                              <span>Created: {faq.$createdAt ? formatDateWithOrdinal(faq.$createdAt) : 'N/A'}</span>
                              <span>Updated: {faq.$updatedAt ? formatDateWithOrdinal(faq.$updatedAt) : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Edit className='w-5 h-5 text-primary' />
                Edit FAQ
              </DialogTitle>
              <DialogDescription>Update the question and answer for this FAQ.</DialogDescription>
            </DialogHeader>
            <FAQForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={updateFAQMutation.isPending}
              submitText='Update FAQ'
              isEdit={true}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title='Delete FAQ'
          description={
            selectedFAQ
              ? `Are you sure you want to delete this FAQ: "${selectedFAQ.question}"? This action cannot be undone.`
              : 'Are you sure you want to delete this FAQ? This action cannot be undone.'
          }
          confirmText='Delete FAQ'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteFAQMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default FAQsPage;
