import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteService } from '@/appwrite/utils';
import { DATABASES, COLLECTIONS } from '@/appwrite/config';

export const useGetCompanySettingsQuery = () => {
  return useQuery({
    queryKey: ['companySettings'],
    queryFn: async () => {
      const response = await AppwriteService.listDocuments(DATABASES.MAIN, COLLECTIONS.COMPANY_SETTINGS);
      // Assuming company settings is a single document
      const settings = response.documents[0] as unknown as CompanySettings;
      return {
        data: settings,
        total: response.total,
      };
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateCompanySettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompanySettingsPayload) => {
      // Changed from CompanySettingsFormData
      const response = await AppwriteService.createDocument(DATABASES.MAIN, COLLECTIONS.COMPANY_SETTINGS, data);
      return { ok: true, message: 'Company settings created successfully', data: response };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
    },
    onError: error => {
      console.error('Error creating company settings:', error);
      throw error;
    },
  });
};

export const useUpdateCompanySettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CompanySettingsPayload> }) => {
      // Changed from Partial<CompanySettingsFormData>
      const response = await AppwriteService.updateDocument(DATABASES.MAIN, COLLECTIONS.COMPANY_SETTINGS, id, data);
      return { ok: true, message: 'Company settings updated successfully', data: response };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
    },
    onError: error => {
      console.error('Error updating company settings:', error);
      throw error;
    },
  });
};

export const useDeleteCompanySettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await AppwriteService.deleteDocument(DATABASES.MAIN, COLLECTIONS.COMPANY_SETTINGS, id);
      return { ok: true, message: 'Company settings deleted successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
    },
    onError: error => {
      console.error('Error deleting company settings:', error);
      throw error;
    },
  });
};
