import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, ProcessPaymentData, CloseRegisterData } from '../api/payments';
import { toast } from 'sonner';

export function usePayments(params?: {
  from?: string;
  to?: string;
  clientId?: string;
}) {
  const queryClient = useQueryClient();

  const {
    data: sales = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sales', params],
    queryFn: () => paymentsApi.getSales(params),
  });

  // Process payment
  const processPaymentMutation = useMutation({
    mutationFn: paymentsApi.processPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de traitement du paiement');
    },
  });

  // Close register
  const closeRegisterMutation = useMutation({
    mutationFn: paymentsApi.closeRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Caisse clôturée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de clôture de caisse');
    },
  });

  return {
    sales,
    isLoading,
    error,
    processPayment: processPaymentMutation.mutate,
    closeRegister: closeRegisterMutation.mutate,
    isProcessing: processPaymentMutation.isPending,
    isClosing: closeRegisterMutation.isPending,
    paymentResult: processPaymentMutation.data,
  };
}

export function useReceipt(saleId: string) {
  return useQuery({
    queryKey: ['sales', saleId, 'receipt'],
    queryFn: () => paymentsApi.getReceipt(saleId),
    enabled: !!saleId,
  });
}
