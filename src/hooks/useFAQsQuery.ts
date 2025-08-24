import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetFAQsQuery = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.FAQS);
      return {
        data: response.documents as unknown as FAQ[],
        total: response.total,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - FAQs don't change frequently
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateFAQMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FAQFormData) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.FAQS, data);
      return { ok: true, message: 'FAQ created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch FAQs
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: error => {
      console.error('Error creating FAQ:', error);
      throw error;
    },
  });
};

export const useUpdateFAQMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FAQFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.FAQS, id, data);
      return { ok: true, message: 'FAQ updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch FAQs
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: error => {
      console.error('Error updating FAQ:', error);
      throw error;
    },
  });
};

export const useDeleteFAQMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.FAQS, id);
      return { ok: true, message: 'FAQ deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch FAQs
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: error => {
      console.error('Error deleting FAQ:', error);
      throw error;
    },
  });
};
