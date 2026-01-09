import axiosdb from '../axios';

export interface Sale {
  id: string;
  appointmentId?: string;
  clientId: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'mixed';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  discountCode?: string;
  loyaltyPointsUsed: number;
  receiptNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: any[];
  payments?: any[];
}

export interface ProcessPaymentData {
  appointmentId?: string;
  clientId?: string;
  items: Array<{
    serviceId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'mixed';
  discountCode?: string;
  loyaltyPointsUsed?: number;
  tip?: number;
}

export interface CloseRegisterData {
  date: string;
  expectedCash: number;
  actualCash: number;
}

export const paymentsApi = {
  // Process payment
  processPayment: async (paymentData: ProcessPaymentData): Promise<{
    sale: Sale;
    receiptNumber: string;
    message: string;
  }> => {
    const { data } = await axiosdb.post('/payments/process', paymentData);
    return data;
  },

  // Get receipt
  getReceipt: async (saleId: string): Promise<any> => {
    const { data } = await axiosdb.get(`/sales/${saleId}/receipt`);
    return data;
  },

  // Close daily register
  closeRegister: async (registerData: CloseRegisterData): Promise<{
    totalSales: number;
    cashSales: number;
    cardSales: number;
    mobileSales: number;
    discrepancy: number;
  }> => {
    const { data } = await axiosdb.post('/sales/close-register', registerData);
    return data;
  },

  // Get sales
  getSales: async (params?: {
    from?: string;
    to?: string;
    clientId?: string;
  }): Promise<Sale[]> => {
    const { data } = await axiosdb.get('/sales', { params });
    return data;
  },
};
