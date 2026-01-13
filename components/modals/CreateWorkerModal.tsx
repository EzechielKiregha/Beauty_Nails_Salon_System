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

export default function CreateWorkerModal({ triggerLabel = "Créer un employé" }: { triggerLabel?: string }) {
  const [userId, setUserId] = useState('');
  const [position, setPosition] = useState('');
  const [specialties, setSpecialties] = useState(''); // comma-separated
  const [commissionRate, setCommissionRate] = useState<number | ''>('');
  const [workingHours, setWorkingHours] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { createWorker, isCreating } = useStaff();

  const onSubmit = () => {
    if (!userId || !position) { toast.error('Veuillez renseigner l\'identifiant utilisateur et le poste'); return; }

    const payload = {
      userId,
      position,
      specialties: specialties ? specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
      commissionRate: Number(commissionRate) || 0,
      workingHours: workingHours || undefined,
    } as import('@/lib/api/staff').CreateWorkerData;

    createWorker(payload);

    setIsOpen(false);
    setUserId('');
    setPosition('');
    setSpecialties('');
    setCommissionRate('');
    setWorkingHours('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel employé</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="worker-user">ID Utilisateur (existant)</Label>
            <Input id="worker-user" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID user (ex: usr_123)" />
          </div>

          <div>
            <Label htmlFor="worker-position">Poste</Label>
            <Input id="worker-position" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="worker-specialties">Spécialités (virgule séparées)</Label>
            <Input id="worker-specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="ex: onglerie,cils" />
          </div>

          <div>
            <Label htmlFor="worker-commission">Commission (%)</Label>
            <Input id="worker-commission" type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="worker-hours">Horaires / Notes (optionnel)</Label>
            <Input id="worker-hours" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="e.g., Lun-Ven 09:00-18:00" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isCreating}>{isCreating ? 'Création...' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
