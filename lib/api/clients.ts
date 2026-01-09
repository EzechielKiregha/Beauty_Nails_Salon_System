import axiosdb from '../axios';
export interface Client {
  id: string;
  userId: string;
  tier: 'Regular' | 'VIP' | 'Premium';
  loyaltyPoints: number;
  totalAppointments: number;
  totalSpent: number;
  referralCode: string;
  referredBy?: string;
  preferences?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    isActive: boolean;
    createdAt: string;
  };
  appointments?: any[];
  loyaltyTransactions?: any[];
  membershipPurchases?: any[];
}

export interface ClientsParams {
  search?: string;
  status?: string;
  tier?: string;
  page?: number;
  limit?: number;
}

export const clientsApi = {
  // Get all clients
  getClients: async (params?: ClientsParams): Promise<{
    clients: Client[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const { data } = await axiosdb.get('/clients', { params });
    return data;
  },

  // Get client profile
  getClient: async (id: string): Promise<Client> => {
    const { data } = await axiosdb.get(`/clients/${id}`);
    return data;
  },

  // Update client notes
  updateClientNotes: async (id: string, notes: string): Promise<{ client: Client; message: string }> => {
    const { data } = await axiosdb.patch(`/clients/${id}/notes`, { notes });
    return data;
  },

  // Get client appointments
  getClientAppointments: async (id: string, params?: {
    status?: string;
    from?: string;
    to?: string;
  }): Promise<any[]> => {
    const { data } = await axiosdb.get(`/clients/${id}/appointments`, { params });
    return data;
  },
};
