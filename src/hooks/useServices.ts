import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetServicesQuery = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.SERVICES);
      return {
        data: response.documents as unknown as Service[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ServiceFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.SERVICES, data);
      return { ok: true, message: 'Service created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: error => {
      console.error('Error creating service:', error);
      return { ok: false, message: 'Failed to create service' };
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.SERVICES, id, data);
      return { ok: true, message: 'Service updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: error => {
      console.error('Error updating service:', error);
      return { ok: false, message: 'Failed to update service' };
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.SERVICES, id);
      return { ok: true, message: 'Service deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: error => {
      console.error('Error deleting service:', error);
      return { ok: false, message: 'Failed to delete service' };
    },
  });
};
