import { redirect } from 'next/navigation';
import WorkerDashboard from '@/components/pages/WorkerDashboard';
import { auth } from '@/lib/auth/auth';

export const metadata = {
  title: 'Worker Dashboard - Beauty Nails',
};

export default async function WorkerDashboardPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect('/auth/login');
    }
    return <WorkerDashboard user={session?.user} />;
  } catch (error) {
    redirect('/login');
  }
}