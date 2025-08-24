import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Trash2, Loader2, ArrowLeft, Copy, Check, Phone, Eye, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { getRelativeTime, handleError } from '@/lib/utils';
import Error from '@/components/Error';
import Empty from '@/components/Empty';

import { useGetMessagesQuery, useDeleteMessageMutation } from '@/hooks/useMessagesQuery';

type Message = MessageFormData;

const Contacts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedMessageId = searchParams.get('view');

  // TanStack Query hooks
  const { data: messages, error, isLoading } = useGetMessagesQuery();
  const deleteMessageMutation = useDeleteMessageMutation();

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Find the currently viewed message
  const viewedMessage = React.useMemo(() => {
    if (!selectedMessageId || !messages?.data) return null;
    return messages.data.find((msg: Message) => msg.$id === selectedMessageId) || null;
  }, [selectedMessageId, messages?.data]);

  // Handle view message
  const handleViewMessage = (messageId: string) => {
    setSearchParams({ view: messageId });
  };

  // Handle copy email
  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success('Email copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle back to list
  const handleBackToList = () => {
    setSearchParams({});
  };

  // Open delete modal
  const handleDeleteClick = (message: Message, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };

  // Delete message handler
  const handleDeleteConfirm = async () => {
    if (!selectedMessage) return;

    try {
      setDeletingMessageId(selectedMessage.$id);
      const result = await deleteMessageMutation.mutateAsync(selectedMessage.$id);

      if (result.ok) {
        toast.success(result.message || 'Message deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedMessage(null);

        // If we're viewing the deleted message, go back to list
        if (selectedMessageId === selectedMessage.$id) {
          handleBackToList();
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Get avatar colors based on person's name
  const getAvatarColors = (firstName: string, lastName: string) => {
    const colors = [
      { bg: 'bg-blue-500', text: 'text-white' },
      { bg: 'bg-green-500', text: 'text-white' },
      { bg: 'bg-purple-500', text: 'text-white' },
      { bg: 'bg-orange-500', text: 'text-white' },
      { bg: 'bg-pink-500', text: 'text-white' },
      { bg: 'bg-indigo-500', text: 'text-white' },
      { bg: 'bg-red-500', text: 'text-white' },
      { bg: 'bg-teal-500', text: 'text-white' },
    ];

    // Use full name to determine color index consistently
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const index = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Loading skeleton component
  const ContactsSkeleton = () => (
    <div className='divide-y divide-gray-100'>
      {[...Array(15)].map((_, i) => (
        <div key={i} className='flex items-center px-4 py-3 '>
          <div className='flex items-center flex-1 min-w-0'>
            <div className='w-8 h-8  rounded-full mr-4 flex-shrink-0'></div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center flex-1 min-w-0 gap-4'>
                  <Skeleton className='h-4 w-32 flex-shrink-0' />
                  <Skeleton className='h-4 w-64 flex-1' />
                </div>
                <Skeleton className='h-4 w-16 ml-4 flex-shrink-0' />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Show message detail view
  if (viewedMessage) {
    return (
      <DashboardLayout>
        <div className='h-full flex flex-col bg-white'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                hideChevron
                onClick={handleBackToList}
                className='text-gray-600 hover:text-gray-900'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
              </Button>
              <h2 className='text-lg font-medium text-gray-900'>Message Details</h2>
            </div>
          </div>

          {/* Message Content */}
          <div className='flex-1 overflow-auto'>
            <div className='max-w-4xl mx-auto p-6'>
              {/* Message Header */}
              <div className='mb-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-start gap-3'>
                    {(() => {
                      const avatarColors = getAvatarColors(viewedMessage.firstName, viewedMessage.lastName);
                      return (
                        <div
                          className={`w-10 h-10 ${avatarColors.bg} rounded-full flex items-center justify-center ${avatarColors.text} font-medium`}
                        >
                          {viewedMessage.firstName.charAt(0)}
                          {viewedMessage.lastName.charAt(0)}
                        </div>
                      );
                    })()}
                    <div>
                      <h1 className='text-xl font-medium text-gray-900 mb-1'>{viewedMessage.subject}</h1>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <div className='flex items-center gap-1'>
                          <span className='font-medium'>
                            {viewedMessage.firstName} {viewedMessage.lastName}
                          </span>
                          <span>&lt;{viewedMessage.email}&gt;</span>
                          <Button
                            variant='ghost'
                            size='sm'
                            hideChevron
                            onClick={() => handleCopyEmail(viewedMessage.email)}
                            className='h-5 w-5 p-0 ml-1'
                          >
                            {copiedEmail ? <Check className='w-3 h-3 text-green-600' /> : <Copy className='w-3 h-3' />}
                          </Button>
                        </div>
                        <div className='flex items-center gap-4'>
                          <span>to me</span>
                          <span>{viewedMessage.$createdAt ? getRelativeTime(viewedMessage.$createdAt) : 'N/A'}</span>
                          <div className='flex items-center gap-1'>
                            <Phone className='w-3 h-3' />
                            <span>{viewedMessage.telephone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='border-t border-gray-200 pt-4'>
                  <div className='prose max-w-none'>
                    <p className='whitespace-pre-wrap text-gray-800 leading-relaxed'>{viewedMessage.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show message list view
  return (
    <DashboardLayout>
      <div className='space-y-6 py-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-xl text-primary'>Contact Messages ({messages?.data?.length || 0})</h3>
        </div>

        {/* Contact Messages Card */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='p-6'>
                <ContactsSkeleton />
              </div>
            ) : error ? (
              <div className='p-8 text-center'>
                <Error description='Error loading contact messages' />
              </div>
            ) : !messages?.data?.length ? (
              <div className='p-8 text-center'>
                <Empty description='No contact messages found' />
              </div>
            ) : (
              <div className='divide-y divide-gray-100 p-4'>
                {messages?.data?.map((message, index) => {
                  const isNew = index < 3;
                  const messageDate = message.$createdAt ? getRelativeTime(message.$createdAt) : '';

                  return (
                    <div
                      key={message.$id}
                      className={`bg-white flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50/50 transition-colors ${
                        isNew ? 'bg-blue-50/30' : ''
                      } transition-colors duration-150`}
                      onClick={() => handleViewMessage(message.$id)}
                    >
                      {/* Avatar */}
                      {(() => {
                        const avatarColors = getAvatarColors(message.firstName, message.lastName);
                        return (
                          <div
                            className={`w-8 h-8 ${avatarColors.bg} rounded-full flex items-center justify-center ${avatarColors.text} text-sm font-medium mr-4 flex-shrink-0`}
                          >
                            {message.firstName.charAt(0)}
                            {message.lastName.charAt(0)}
                          </div>
                        );
                      })()}

                      {/* Message Content */}
                      <div className='flex items-center flex-1 min-w-0'>
                        <div className='flex items-center justify-between w-full'>
                          <div className='flex items-center flex-1 min-w-0 gap-4'>
                            {/* Sender Name */}
                            <div
                              className={`font-medium text-sm flex-shrink-0 w-48 truncate ${
                                isNew ? 'text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              {message.firstName} {message.lastName}
                            </div>

                            {/* Subject and Preview */}
                            <div className='flex-1 min-w-0 flex items-center gap-2'>
                              <span className={`font-medium text-sm ${isNew ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.subject}
                              </span>
                              <span className='text-gray-500 text-sm'>-</span>
                              <span className='text-gray-500 text-sm truncate'>
                                {message.message.replace(/\n/g, ' ').substring(0, 80)}
                                {message.message.length > 80 ? '...' : ''}
                              </span>
                            </div>
                          </div>

                          {/* Right Side */}
                          <div className='flex items-center gap-3 ml-4 flex-shrink-0'>
                            {/* Date */}
                            <div className='text-xs text-gray-500 w-16 text-right'>{messageDate}</div>

                            {/* New indicator */}
                            {isNew && <div className='w-2 h-2 bg-blue-500 rounded-full'></div>}

                            {/* Actions Dropdown */}
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  hideChevron
                                  className='h-8 w-8 p-0'
                                  onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                >
                                  <span className='sr-only'>Open menu</span>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleViewMessage(message.$id);
                                  }}
                                >
                                  <Eye className='h-4 w-4 mr-2' />
                                  View Message
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteClick(message);
                                  }}
                                  className='text-red-600 focus:text-red-600'
                                  disabled={deletingMessageId === message.$id}
                                >
                                  {deletingMessageId === message.$id ? (
                                    <>
                                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className='h-4 w-4 mr-2' />
                                      Delete Message
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
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
          title='Delete Message'
          description={
            selectedMessage
              ? `Delete this message from "${selectedMessage.firstName} ${selectedMessage.lastName}"?`
              : 'Delete this message?'
          }
          confirmText='Delete'
          cancelText='Cancel'
          type='destructive'
          isLoading={deleteMessageMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
