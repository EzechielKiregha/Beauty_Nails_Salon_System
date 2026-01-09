import { useMutation, useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';
import { toast } from 'sonner';

export function useRevenueReport(params: {
  from: string;
  to: string;
}) {
  return useQuery({
    queryKey: ['reports', 'revenue', params],
    queryFn: () => reportsApi.getRevenueReport(params),
    enabled: !!params.from && !!params.to,
  });
}

export function useClientAnalytics(period?: string) {
  return useQuery({
    queryKey: ['reports', 'clients', period],
    queryFn: () => reportsApi.getClientAnalytics(period),
  });
}

export function useServicePerformance(period?: string) {
  return useQuery({
    queryKey: ['reports', 'services', period],
    queryFn: () => reportsApi.getServicePerformance(period),
  });
}

export function useCustomReport() {
  const createMutation = useMutation({
    mutationFn: reportsApi.createCustomReport,
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de génération du rapport');
    },
  });

  return {
    createReport: createMutation.mutate,
    isCreating: createMutation.isPending,
    reportData: createMutation.data,
  };
}
