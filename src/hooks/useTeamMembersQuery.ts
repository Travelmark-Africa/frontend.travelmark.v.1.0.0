import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

// TanStack Query hooks for Team Members
export const useGetTeamMembersQuery = () => {
  return useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.TEAM);
      return {
        data: response.documents as unknown as TeamMember[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TeamMemberFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.TEAM, data);
      return { ok: true, message: 'Team member created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: error => {
      console.error('Error creating team member:', error);
      throw error;
    },
  });
};

export const useUpdateTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TeamMemberFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.TEAM, id, data);
      return { ok: true, message: 'Team member updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: error => {
      console.error('Error updating team member:', error);
      throw error;
    },
  });
};

export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.TEAM, id);
      return { ok: true, message: 'Team member deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: error => {
      console.error('Error deleting team member:', error);
      throw error;
    },
  });
};
