import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/pages/AdminDashboard';
import { auth } from '@/lib/auth/auth';

export const metadata = {
  title: 'Admin Dashboard - Beauty Nails',
};

export default async function AdminDashboardPage() {
  try {
    const session = await auth();

    if (!session?.user) {
      redirect('/auth/login');
    }
    return <AdminDashboard user={session?.user} />;
  } catch (error) {
    redirect('/auth/login');
  }
}