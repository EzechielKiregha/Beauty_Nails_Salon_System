import axiosdb from '../axios';

export interface Worker {
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
  totalSales: number;
  totalEarnings: number;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    isActive: boolean;
  };
  schedules?: WorkerSchedule[];
  appointments?: any[];
  name: string;
  role: string;
  phone: string;
  email: string;
  workingDays: string[];
  workingHoursString: string;
  appointmentsCount: number;
  revenue: string;
  clientRetention: string;
  upsellRate: string;
  commission: string;
  status: 'active' | 'off' | 'busy';
}

export interface WorkerSchedule {
  id: string;
  workerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkerData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  workerProfile: {
    position: string;
    specialties: string[];
    commissionRate: number;
    workingHours?: any;
  };
}

export interface CreateWorkerResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string | null;
    isActive: boolean;
    emailVerified: string;
    createdAt: string;
    updatedAt: string;
    clientProfile?: any;
    workerProfile?: any;
  };
  message: string;
}

export interface UpdateScheduleData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const staffApi = {
  // Get all staff
  getStaff: async (params?: {
    role?: string;
    isAvailable?: boolean;
  }): Promise<Worker[]> => {
    const { data } = await axiosdb.get('/staff', { params });
    return data;
  },

  // Get single worker
  getWorker: async (id: string): Promise<Worker> => {
    const { data } = await axiosdb.get(`/staff/${id}`);
    return data;
  },

  // Create worker (registers a new user with worker profile)
  createWorker: async (workerData: CreateWorkerData): Promise<CreateWorkerResponse> => {
    const { data } = await axiosdb.post('/staff', workerData);
    return data;
  },

  // Get worker schedule
  getWorkerSchedule: async (id: string, params?: {
    date?: string;
    week?: string;
  }): Promise<{
    schedule: WorkerSchedule[];
    workingHours: any;
  }> => {
    const { data } = await axiosdb.get(`/staff/${id}/schedule`, { params });
    return data;
  },

  // Update worker schedule
  updateWorkerSchedule: async (id: string, scheduleData: UpdateScheduleData): Promise<{ schedule: WorkerSchedule; message: string }> => {
    const { data } = await axiosdb.patch(`/staff/${id}/schedule`, scheduleData);
    return data;
  },

  // Get worker commission
  getWorkerCommission: async (id: string, period?: string): Promise<{
    totalRevenue: number;
    commission: number;
    appointmentsCount: number;
  }> => {
    const { data } = await axiosdb.get(`/staff/${id}/commission`, {
      params: { period },
    });
    return data;
  },

  // Get available staff
  getAvailableStaff: async (params?: {
    category?: string;
    date?: string;
    time?: string;
  }): Promise<Worker[]> => {
    const { data } = await axiosdb.get('/staff/available', { params });
    return data;
  },
};
