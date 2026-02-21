'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate, isPending } = useResetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!token) {
      toast.error('Token de réinitialisation manquant');
      return;
    }

    mutate({ token, newPassword: password }, {
      onSuccess: () => {
        toast.success('Mot de passe réinitialisé avec succès');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border-0">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Réinitialiser votre mot de passe</h1>
          <p className="text-gray-600">Entrez votre nouveau mot de passe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-gray-700">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 rounded-xl py-3"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 rounded-xl py-3"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-medium"
          >
            {isPending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      </Card>
    </div>
  );
}