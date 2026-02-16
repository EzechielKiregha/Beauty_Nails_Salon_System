import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useClients } from '@/lib/hooks/useClients';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ClientModalProps {
  trigger?: React.ReactNode;
  client?: any;
  edit?: boolean;
}

export function ClientModal({ trigger, client, edit }: ClientModalProps) {
  const [id, setId] = useState(client?.id || '');
  const [name, setName] = useState(client?.name || '');
  const [email, setEmail] = useState(client?.email || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState<'Regular' | 'VIP' | 'Premium'>(client?.tier || 'Regular');
  const [notes, setNotes] = useState(client?.notes || '');
  const [birthday, setBirthday] = useState(client?.birthday || '');
  const [address, setAddress] = useState(client?.address || '');
  const [allergies, setAllergies] = useState(client?.allergies || '');
  const [favoriteServices, setFavoriteServices] = useState(client?.favoriteServices?.join(', ') || '');
  const [prepaymentBalance, setPrepaymentBalance] = useState<number | ''>(client?.prepaymentBalance ?? '');
  const [giftCardBalance, setGiftCardBalance] = useState<number | ''>(client?.giftCardBalance ?? '');
  const [referrals, setReferrals] = useState<number | ''>(client?.referrals ?? '');
  const { createClient, updateClient, isCreatingClient, isUpdatingClient } = useClients();

  const reset = () => {
    setName(''); setEmail(''); setPhone(''); setTier('Regular'); setNotes(''); setBirthday('');
    setAddress(''); setAllergies(''); setFavoriteServices(''); setPrepaymentBalance('');
    setGiftCardBalance(''); setReferrals('');
  };

  const onSubmit = () => {
    if (!name || !email || !phone) {
      toast.error('Nom, email et téléphone requis');
      return;
    }

    if (!edit) {
      const payload: any = {
        name,
        email,
        phone,
        tier,
        notes,
        password: password ?? '25854565',
        birthday: birthday || undefined,
        address: address || undefined,
        allergies: allergies || undefined,
        favoriteServices: favoriteServices ? favoriteServices.split(',').map((s: any) => s.trim()).filter(Boolean) : undefined,
        prepaymentBalance: prepaymentBalance !== '' ? Number(prepaymentBalance) : undefined,
        giftCardBalance: giftCardBalance !== '' ? Number(giftCardBalance) : undefined,
        referrals: referrals !== '' ? Number(referrals) : undefined,
      };

      createClient(payload);
      reset();
    } else {
      const payload: any = {
        id,
        name,
        email,
        phone,
        tier,
        notes,
        password: password ?? '25854565',
        birthday: birthday || undefined,
        address: address || undefined,
        allergies: allergies || undefined,
        favoriteServices: favoriteServices ? favoriteServices.split(',').map((s: any) => s.trim()).filter(Boolean) : undefined,
        prepaymentBalance: prepaymentBalance !== '' ? Number(prepaymentBalance) : undefined,
        giftCardBalance: giftCardBalance !== '' ? Number(giftCardBalance) : undefined,
        referrals: referrals !== '' ? Number(referrals) : undefined,
      };

      updateClient(payload);
      reset();
    }
  };

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {edit ? 'Modifier cette fiche cliente' : 'Nouvelle Cliente'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Nom Complet</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marie Kabila"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Téléphone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+243..."
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@email.com"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Mot de passe</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*****"
              type="password"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Tier</Label>
            <Select onValueChange={(v) => setTier(v as any)} value={tier}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Date de Naissance</Label>
            <Input
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              type="date"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Adresse</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Allergies</Label>
            <Input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ex: Aucune, Parfums"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Services favoris (virgule séparés)</Label>
            <Input
              value={favoriteServices}
              onChange={(e) => setFavoriteServices(e.target.value)}
              placeholder="Manucure, Pedicure"
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Solde prépaiement</Label>
            <Input
              type="number"
              value={prepaymentBalance === '' ? '' : String(prepaymentBalance)}
              onChange={(e) => setPrepaymentBalance(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Solde carte cadeau</Label>
            <Input
              type="number"
              value={giftCardBalance === '' ? '' : String(giftCardBalance)}
              onChange={(e) => setGiftCardBalance(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Parrainages</Label>
            <Input
              type="number"
              value={referrals === '' ? '' : String(referrals)}
              onChange={(e) => setReferrals(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Notes (Préférences)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes importantes..."
              className="h-24 resize-none text-base"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Annuler
            </Button>
          </DialogClose>

          {edit ? (
            <Button
              onClick={onSubmit}
              disabled={isUpdatingClient}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              {isUpdatingClient ? 'Modification...' : 'Enregistrer les modifications'}
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isCreatingClient}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              {isCreatingClient ? 'Création...' : 'Créer une fiche cliente'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}