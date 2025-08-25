import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetUSPsQuery = () => {
  return useQuery({
    queryKey: ['usps'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.USPS);
      return {
        data: response.documents as unknown as USP[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateUSPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<USPFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.USPS, data);
      return { ok: true, message: 'USP created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch USPs
      queryClient.invalidateQueries({ queryKey: ['usps'] });
    },
    onError: error => {
      console.error('Error creating USP:', error);
      throw error;
    },
  });
};

export const useUpdateUSPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<USPFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.USPS, id, data);
      return { ok: true, message: 'USP updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch USPs
      queryClient.invalidateQueries({ queryKey: ['usps'] });
    },
    onError: error => {
      console.error('Error updating USP:', error);
      throw error;
    },
  });
};

export const useDeleteUSPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.USPS, id);
      return { ok: true, message: 'USP deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch USPs
      queryClient.invalidateQueries({ queryKey: ['usps'] });
    },
    onError: error => {
      console.error('Error deleting USP:', error);
      throw error;
    },
  });
};
