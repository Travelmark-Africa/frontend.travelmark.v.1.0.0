// hooks/useSubscriptionsQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetSubscriptionsQuery = () => {
  return useQuery<SubscriptionsResponse>({
    queryKey: ['subscriptions'],
    queryFn: async (): Promise<SubscriptionsResponse> => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.SUBSCRIPTIONS);
      return {
        data: response.documents as unknown as Subscription[],
        total: response.total,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, SubscriptionFormData>({
    mutationFn: async (data: SubscriptionFormData): Promise<MutationResponse> => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.SUBSCRIPTIONS, data);
      return { ok: true, message: 'Successfully subscribed to newsletter!', data: response as unknown as Subscription };
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error: Error) => {
      console.error('Error creating subscription:', error);
      throw error;
    },
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, { id: string; data: Partial<SubscriptionFormData> }>({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SubscriptionFormData>;
    }): Promise<MutationResponse> => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.SUBSCRIPTIONS, id, data);
      return { ok: true, message: 'Subscription updated successfully', data: response as unknown as Subscription };
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error: Error) => {
      console.error('Error updating subscription:', error);
      throw error;
    },
  });
};

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteMutationResponse, Error, string>({
    mutationFn: async (id: string): Promise<DeleteMutationResponse> => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.SUBSCRIPTIONS, id);
      return { ok: true, message: 'Subscription deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting subscription:', error);
      throw error;
    },
  });
};
