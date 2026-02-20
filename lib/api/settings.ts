import axiosdb from '../axios';

export interface SalonProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  logo?: string;
  openingHours?: any;
  socialMedia?: any;
  currency: string;
  timezone: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSettings {
  [key: string]: any;
}

export const settingsApi = {
  // Get salon profile
  getSalonProfile: async (): Promise<SalonProfile> => {
    const { data } = await axiosdb.get('/settings/profile');
    return data;
  },

  // Update salon profile
  updateSalonProfile: async (profile: Partial<SalonProfile>): Promise<SalonProfile> => {
    const { data } = await axiosdb.put('/settings/profile', profile);
    return data;
  },

  // Get system settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    const { data } = await axiosdb.get('/settings/system');
    return data;
  },

  // Update system settings
  updateSystemSettings: async (settings: SystemSettings): Promise<SystemSettings> => {
    const { data } = await axiosdb.post('/settings/system', settings);
    return data;
  },
};