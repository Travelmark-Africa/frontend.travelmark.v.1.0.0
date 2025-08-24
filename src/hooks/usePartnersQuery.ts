import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetPartnersQuery = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.PARTNERS);
      return {
        data: response.documents as unknown as Partner[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreatePartnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PartnerFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.PARTNERS, data);
      return { ok: true, message: 'Partner created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch partners
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: error => {
      console.error('Error creating partner:', error);
      throw error;
    },
  });
};

export const useUpdatePartnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PartnerFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.PARTNERS, id, data);
      return { ok: true, message: 'Partner updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch partners
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: error => {
      console.error('Error updating partner:', error);
      throw error;
    },
  });
};

export const useDeletePartnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.PARTNERS, id);
      return { ok: true, message: 'Partner deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch partners
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: error => {
      console.error('Error deleting partner:', error);
      throw error;
    },
  });
};
