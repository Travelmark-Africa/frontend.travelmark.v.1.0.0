// hooks/useMessagesQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export interface MessageFormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
}

// TanStack Query hooks for Messages
export const useGetMessagesQuery = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.CONTACTS);
      return {
        data: response.documents as unknown as MessageFormData[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MessageFormData) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.CONTACTS, data);
      return { ok: true, message: 'Message sent successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: error => {
      console.error('Error creating message:', error);
      throw error; // Re-throw to handle in component
    },
  });
};

export const useUpdateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MessageFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.CONTACTS, id, data);
      return { ok: true, message: 'Message updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: error => {
      console.error('Error updating message:', error);
      throw error;
    },
  });
};

export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.CONTACTS, id);
      return { ok: true, message: 'Message deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: error => {
      console.error('Error deleting message:', error);
      throw error;
    },
  });
};
