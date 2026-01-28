import axiosdb from '../axios';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'worker' | 'admin';
  avatar: string | null;
  isActive: boolean;
  clientProfile?: ClientProfile | null;
  workerProfile?: WorkerProfile | null;
}

export interface ClientProfile {
  id: string;
  tier: 'Regular' | 'VIP' | 'Premium';
  loyaltyPoints: number;
  totalAppointments: number;
  totalSpent: number;
  referralCode: string;
  preferences?: any;
  notes?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  position: string;
  specialties: string[];
  commissionRate: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  workingHours?: any;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'client' | 'worker' | 'admin';
}

export const authApi = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axiosdb.get('/auth/me');
    return data;
  },

  // Login user
  login: async (credentials: LoginData): Promise<{ user: User }> => {
    const { data } = await axiosdb.post('/auth/login', credentials);
    return data;
  },

  // Register user
  register: async (userData: RegisterData): Promise<{ user: User; message: string }> => {
    const { data } = await axiosdb.post('/auth/register', userData);
    return data;
  },

  // Update profile
  updateProfile: async (updates: Partial<User>): Promise<{ user: User; message: string }> => {
    const { data } = await axiosdb.patch('/auth/profile', updates);
    return data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await axiosdb.post('/auth/logout');
  },
};
