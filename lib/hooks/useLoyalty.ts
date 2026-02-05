import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loyaltyApi } from '../api/loyalty';
import { toast } from 'sonner';

export function useLoyalty() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['loyalty', 'points'],
    queryFn: loyaltyApi.getLoyaltyPoints,
  });

  return {
    points: data?.points || 0,
    tier: data?.tier,
    transactions: data?.transactions || [],
    isLoading,
    error,
  };
}

export function useReferral() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['loyalty', 'referral'],
    queryFn: loyaltyApi.getReferralCode,
  });

  // Apply referral code
  const applyReferralMutation = useMutation({
    mutationFn: loyaltyApi.applyReferralCode,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Code de parrainage invalide');
    },
  });

  return {
    referralCode: data?.code,
    referrals: data?.referrals || 0,
    // referralList: data?.referralList || [],
    isLoading,
    error,
    applyReferralCode: applyReferralMutation.mutate,
    isApplying: applyReferralMutation.isPending,
  };
}
