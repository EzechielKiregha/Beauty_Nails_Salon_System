"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useStaff } from "@/lib/hooks/useStaff";
import { toast } from "sonner";

export default function CreateWorkerModal({ triggerLabel = "Ajouter un employé" }: { triggerLabel?: string }) {
  // User info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Worker profile
  const [position, setPosition] = useState('');
  const [specialties, setSpecialties] = useState(''); // comma-separated
  const [commissionRate, setCommissionRate] = useState<number | ''>('');
  const [workingHours, setWorkingHours] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const { createWorker, isCreating } = useStaff();

  const onSubmit = () => {
    // Validation
    if (!name || !email || !phone || !password || !position) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email invalide');
      return;
    }

    // Phone validation (basic)
    if (phone.length < 9) {
      toast.error('Numéro de téléphone invalide');
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      password,
      role: 'worker',
      workerProfile: {
        position,
        specialties: specialties ? specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
        commissionRate: Number(commissionRate) || 0,
        workingHours: workingHours || undefined,
      },
    };

    createWorker(payload as any);

    // Reset form
    setIsOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPosition('');
    setSpecialties('');
    setCommissionRate('');
    setWorkingHours('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl ">
        <DialogHeader>
          <DialogTitle>Créer un nouvel employé</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
          {/* Column 1: User Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Informations personnelles</h3>

            <div>
              <Label htmlFor="worker-name" className="text-xs sm:text-sm dark:text-gray-200">Nom complet *</Label>
              <Input
                id="worker-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Marie Nkumu"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="worker-email" className="text-xs sm:text-sm dark:text-gray-200">Email *</Label>
              <Input
                id="worker-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marie@example.com"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="worker-phone" className="text-xs sm:text-sm dark:text-gray-200">Téléphone *</Label>
              <Input
                id="worker-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+243 123 456 789"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="worker-password" className="text-xs sm:text-sm dark:text-gray-200">Mot de passe *</Label>
              <Input
                id="worker-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 caractères"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Column 2: Position & Specialties */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Professionnel</h3>

            <div>
              <Label htmlFor="worker-position" className="text-xs sm:text-sm dark:text-gray-200">Poste *</Label>
              <Input
                id="worker-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="ex: Spécialiste Ongles"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="worker-specialties" className="text-xs sm:text-sm dark:text-gray-200">Spécialités</Label>
              <Input
                id="worker-specialties"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="ex: manucure, gel, nail art"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Virgule séparées</p>
            </div>

            <div>
              <Label htmlFor="worker-commission" className="text-xs sm:text-sm dark:text-gray-200">Commission (%)</Label>
              <Input
                id="worker-commission"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="ex: 15"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Column 3: Working Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Horaires</h3>

            <div className="flex-1">
              <Label htmlFor="worker-hours" className="text-xs sm:text-sm dark:text-gray-200">Horaires de travail</Label>
              <Input
                id="worker-hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="ex: Lun-Ven 09:00-18:00"
                className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Facultatif</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Un compte avec profil client et profil employé sera créé automatiquement.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              Annuler
            </Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={isCreating}
            className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
          >
            {isCreating ? 'Création...' : 'Créer l\'employé'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
