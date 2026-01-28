import Appointments from '@/components/pages/Appointments';
import AppointmentsV2 from '@/components/pages/Appointments-v2';

export const metadata = {
  title: 'Reservation - Beauty Nails',
};

export default async function AppointmentsPage() {
  // return <Appointments />;
  return <AppointmentsV2 />;
}
