import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { servicesApi, CreateServiceData, Service } from '../api/services';
import { toast } from 'sonner';

export function useServices(params?: {
  category?: string;
  available?: boolean;
}) {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getServices(params),
  });

  // Create service
  const createMutation = useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de création');
    },
  });

  // Update service
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Service> }) =>
      servicesApi.updateService(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service mis à jour');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de mise à jour');
    },
  });

  // Delete service
  const deleteMutation = useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service supprimé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de suppression');
    },
  });

  return {
    services,
    isLoading,
    error,
    createService: createMutation.mutate,
    updateService: updateMutation.mutate,
    deleteService: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
  });
}
