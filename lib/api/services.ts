import axiosdb from '../axios';

export interface Service {
  id: string;
  name: string;
  category: 'onglerie' | 'cils' | 'tresses' | 'maquillage';
  price: number;
  duration: number;
  description: string;
  imageUrl?: string;
  onlineBookable: boolean;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  addOns?: ServiceAddOn[];
}

export interface ServiceAddOn {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface CreateServiceData {
  name: string;
  category: 'onglerie' | 'cils' | 'tresses' | 'maquillage';
  price: number;
  duration: number;
  description: string;
  imageUrl?: string;
  onlineBookable?: boolean;
  isPopular?: boolean;
}

export const servicesApi = {
  // Get all services
  getServices: async (params?: {
    category?: string;
    available?: boolean;
  }): Promise<Service[]> => {
    const { data } = await axiosdb.get('/services', { params });
    return data;
  },

  // Get single service
  getService: async (id: string): Promise<Service> => {
    const { data } = await axiosdb.get(`/services/${id}`);
    return data;
  },

  // Create service (admin only)
  createService: async (serviceData: CreateServiceData): Promise<{ service: Service; message: string }> => {
    const { data } = await axiosdb.post('/services', serviceData);
    return data;
  },

  // Update service
  updateService: async (id: string, updates: Partial<Service>): Promise<Service> => {
    const { data } = await axiosdb.patch(`/services/${id}`, updates);
    return data;
  },

  // Delete service
  deleteService: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await axiosdb.delete(`/services/${id}`);
    return data;
  },
};
