import { Suspense } from 'react';
import AppointmentsV2 from '@/components/pages/Appointments-v2';
import LoadingSpinner from '@/components/LoadingSpinner'; // Optional: if you have a loader
import LoaderBN from '@/components/Loader-BN';

export const metadata = {
  title: 'Reservation - Beauty Nails',
};

export default async function AppointmentsPage() {
  return (
    <Suspense fallback={<LoaderBN />}>
      <AppointmentsV2 />
    </Suspense>
  );
}

