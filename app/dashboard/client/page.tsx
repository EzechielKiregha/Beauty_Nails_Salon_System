import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/pages/ClientDashboard';
import { auth } from '@/lib/auth/auth';

export const metadata = {
  title: 'Client Dashboard - Beauty Nails',
};

export default async function ClientDashboardPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect('/auth/login');
    }
    return <ClientDashboard user={session?.user} />;
  } catch (error) {
    redirect('/auth/login');
  }
}