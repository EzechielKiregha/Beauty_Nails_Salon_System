"use client"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi, CreateAppointmentData, UpdateAppointmentStatusData, RescheduleAppointmentData } from '../api/appointments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useAppointments(params?: {
  date?: string;
  status?: string;
  workerId?: string;
  clientId?: string;
}) {
  const queryClient = useQueryClient();

  // Get appointments
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.getAppointments(params),
  });

  // Create appointment
  const createMutation = useMutation({
    mutationFn: appointmentsApi.createAppointment,
    onSuccess: (data) => {
      const router = useRouter();
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success("Rendez-vous confirmé !", {
          description: `Votre rendez-vous est prévu le ${data.appointment.date} à ${data.appointment.time}`,
        });

        setTimeout(() => {
          router.push("/dashboard/client");
        }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur lors de la création');
    },
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }: { id: string; statusData: UpdateAppointmentStatusData }) =>
      appointmentsApi.updateAppointmentStatus(id, statusData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de mise à jour');
    },
  });

  // Cancel appointment
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.cancelAppointment(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur d\'annulation');
    },
  });

  // Reschedule appointment
  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RescheduleAppointmentData }) =>
      appointmentsApi.rescheduleAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous reprogrammé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Erreur de reprogrammation');
    },
  });

  return {
    appointments,
    isLoading,
    error,
    createAppointment: createMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    cancelAppointment: cancelMutation.mutate,
    rescheduleAppointment: rescheduleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
  };
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => appointmentsApi.getAppointment(id),
    enabled: !!id,
  });
}

export function useAvailableSlots(params: { date?: string; workerId: string }) {

  const { data, isLoading } =  useQuery({
    queryKey: ['appointments', 'available-slots', params],
    queryFn: () => appointmentsApi.getAvailableSlots(params),
    enabled: !!params.date && !!params.workerId,
  });
  return {
    data,
    isLoading,
  }
}
