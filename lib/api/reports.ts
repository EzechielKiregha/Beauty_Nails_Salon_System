import axiosdb from '../axios';

export interface RevenueReport {
  totalRevenue: number;
  salesCount: number;
  breakdown: Record<string, number>;
  period: {
    from: string;
    to: string;
  };
}

export interface ClientAnalytics {
  totalClients: number;
  newClients: number;
  retentionRate: number;
  topClients: any[];
}

export interface ServicePerformance {
  services: any[];
  mostPopular: any;
}

export const reportsApi = {
  // Revenue report
  getRevenueReport: async (params: {
    from: string;
    to: string;
  }): Promise<RevenueReport> => {
    const { data } = await axiosdb.get('/reports/revenue', { params });
    return data;
  },

  // Client analytics
  getClientAnalytics: async (period?: string): Promise<ClientAnalytics> => {
    const { data } = await axiosdb.get('/reports/clients', {
      params: { period },
    });
    return data;
  },

  // Service performance
  getServicePerformance: async (period?: string): Promise<ServicePerformance> => {
    const { data } = await axiosdb.get('/reports/services', {
      params: { period },
    });
    return data;
  },

  // Custom report
  createCustomReport: async (reportData: {
    metrics: string[];
    filters: any;
    groupBy: string;
    period: string;
  }): Promise<any> => {
    const { data } = await axiosdb.post('/reports/custom', reportData);
    return data;
  },
};
