import { Suspense } from 'react';
import LoaderBN from '@/components/Loader-BN';

export const metadata = {
  title: 'Reset Password - Beauty Nails',
};

export default async function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoaderBN />}>
      <ResetPasswordPage />
    </Suspense>
  );
}