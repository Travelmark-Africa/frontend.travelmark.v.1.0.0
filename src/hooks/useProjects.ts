import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

// TanStack Query hooks for Projects
export const useGetProjectsQuery = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.PROJECTS);
      return {
        data: response.documents as unknown as Project[],
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ProjectFormData>) => {
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.PROJECTS, data);
      return { ok: true, message: 'Project created successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: error => {
      console.error('Error creating project:', error);
      throw error;
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => {
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.PROJECTS, id, data);
      return { ok: true, message: 'Project updated successfully', data: response };
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: error => {
      console.error('Error updating project:', error);
      throw error;
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.PROJECTS, id);
      return { ok: true, message: 'Project deleted successfully' };
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: error => {
      console.error('Error deleting project:', error);
      throw error;
    },
  });
};
