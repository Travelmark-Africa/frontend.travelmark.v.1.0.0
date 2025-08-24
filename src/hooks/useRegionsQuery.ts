import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetRegionsQuery = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.REGIONS);
      return {
        data: response.documents as unknown as Region[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateRegionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<RegionFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.REGIONS, data);
      return { ok: true, message: 'Region created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch regions
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: error => {
      console.error('Error creating region:', error);
      throw error;
    },
  });
};

export const useUpdateRegionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RegionFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.REGIONS, id, data);
      return { ok: true, message: 'Region updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch regions
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: error => {
      console.error('Error updating region:', error);
      throw error;
    },
  });
};

export const useDeleteRegionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.REGIONS, id);
      return { ok: true, message: 'Region deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch regions
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: error => {
      console.error('Error deleting region:', error);
      throw error;
    },
  });
};
