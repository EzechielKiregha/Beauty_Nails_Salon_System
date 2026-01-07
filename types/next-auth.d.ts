import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'client' | 'worker' | 'admin';
    phone: string;
    avatar: string | null;
    isActive: boolean;
    clientProfile?: {
      id: string;
      tier: 'Regular' | 'VIP' | 'Premium';
      loyaltyPoints: number;
      totalAppointments: number;
      totalSpent: number;
      referralCode: string;
      referredBy?: string;
      preferences?: any;
      notes?: string;
    } | null;
    workerProfile?: {
      id: string;
      position: string;
      specialties: string[];
      commissionRate: number;
      rating: number;
      isAvailable: boolean;
      workingHours?: any;
    } | null;
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'client' | 'worker' | 'admin';
    phone: string;
    avatar: string | null;
    isActive: boolean;
    clientProfile?: any;
    workerProfile?: any;
  }
}