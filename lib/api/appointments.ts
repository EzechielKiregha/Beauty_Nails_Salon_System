import axiosdb from '../axios';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  workerId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  location: 'salon' | 'home';
  price: number;
  addOns?: string[];
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  client?: any;
  service?: any;
  worker?: any;
  review?: any;
}

export interface CreateAppointmentData {
  clientId?: string;
  serviceId: string;
  workerId: string;
  date: string;
  time: string;
  location?: 'salon' | 'home';
  addOns?: string[];
  notes?: string;
}

export interface UpdateAppointmentStatusData {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
}

export interface RescheduleAppointmentData {
  newTime: string;
  newDate?: string;
  newStaffId?: string;
}

export interface AvailableSlotsParams {
  date?: string;
  workerId: string;
}

export const appointmentsApi = {
  // Get appointments
  getAppointments: async (params?: {
    date?: string;
    status?: string;
    workerId?: string;
    clientId?: string;
  }): Promise<Appointment[]> => {
    const { data } = await axiosdb.get('/appointments', { params });
    return data;
  },

  // Get single appointment
  getAppointment: async (id: string): Promise<Appointment> => {
    const { data } = await axiosdb.get(`/appointments/${id}`);
    return data;
  },

  // Create appointment
  createAppointment: async (appointmentData: CreateAppointmentData): Promise<{ appointment: Appointment; message: string }> => {
    const { data } = await axiosdb.post('/appointments', appointmentData);
    return data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, statusData: UpdateAppointmentStatusData): Promise<{ appointment: Appointment; message: string }> => {
    const { data } = await axiosdb.put(`/appointments/${id}/status`, statusData);
    return data;
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: string, rescheduleData: RescheduleAppointmentData): Promise<Appointment> => {
    const { data } = await axiosdb.patch(`/appointments/${id}/reschedule`, rescheduleData);
    return data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string): Promise<{ appointment: Appointment; message: string }> => {
    const { data } = await axiosdb.delete(`/appointments/${id}`, {
      data: { reason },
    });
    return data;
  },

  // Get available slots
  getAvailableSlots: async (params: AvailableSlotsParams): Promise<{ slots: {
    time: string,
    available: boolean
  }[] }> => {
    const { data } = await axiosdb.get('/appointments/available-slots', { params });
    return data;
  },

  // Send reminder
  sendReminder: async (id: string, type: 'sms' | 'email' | 'both'): Promise<{ success: boolean }> => {
    const { data } = await axiosdb.post(`/appointments/${id}/reminder`, { type });
    return data;
  },
};
