import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ClientModalProps {
  trigger?: React.ReactNode;
}

export function ClientModal({ trigger }: ClientModalProps) {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nom Complet</Label>
            <Input placeholder="Ex: Marie Kabila" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input placeholder="+243..." />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="marie@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date de Naissance</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Notes (Allergies, Préférences)</Label>
            <Textarea placeholder="Notes importantes..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">Créer Fiche Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
