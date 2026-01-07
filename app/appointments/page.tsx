import { redirect } from 'next/navigation';
import Appointments from '@/components/pages/Appointments';
import { auth } from '@/lib/auth/auth';

export const metadata = {
  title: 'Appointments - Beauty Nails',
};

export default async function AppointmentsPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect('/auth/login');
    }
    return <Appointments user={session?.user} />;
  } catch (error) {
    redirect('/auth/login');
  }
}
