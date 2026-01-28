import axiosdb from '../axios';

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  points: number;
  type: 'earned_appointment' | 'earned_referral' | 'redeemed_service' | 'bonus' | 'adjustment';
  description: string;
  relatedId?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: 'pending' | 'completed' | 'rewarded';
  rewardGranted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const loyaltyApi = {
  // Get client loyalty points
  getLoyaltyPoints: async (): Promise<{
    points: number;
    tier: string;
    transactions: LoyaltyTransaction[];
  }> => {
    const { data } = await axiosdb.get('/loyalty/points');
    return data;
  },

  // Get referral code
  getReferralCode: async (): Promise<{
    code: string;
    referrals: number;
    // referralList: Referral[];
  }> => {
    const { data } = await axiosdb.get('/loyalty/referral-code');
    return data;
  },

  // Apply referral code
  applyReferralCode: async (code: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosdb.post('/loyalty/apply-referral', { code });
    return data;
  },
};
