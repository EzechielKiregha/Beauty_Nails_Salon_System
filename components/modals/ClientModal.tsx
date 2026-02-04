import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useClients } from '@/lib/hooks/useClients';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { Calendar as CalendarComponent } from '../ui/calendar';
interface ClientModalProps {
  trigger?: React.ReactNode;
  client?: any;
}

export function ClientModal({ trigger, client }: ClientModalProps) {
  const [name, setName] = useState(client?.name || '');
  const [email, setEmail] = useState(client?.email || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [tier, setTier] = useState<'Regular' | 'VIP' | 'Premium'>(client?.tier || 'Regular');
  const [notes, setNotes] = useState(client?.notes || '');
  const [birthday, setBirthday] = useState<string>(client?.birthday || '');
  const [address, setAddress] = useState(client?.address || '');
  const [allergies, setAllergies] = useState(client?.allergies || '');
  const [favoriteServices, setFavoriteServices] = useState(client?.favoriteServices?.join(', ') || '');
  const [prepaymentBalance, setPrepaymentBalance] = useState<number | ''>(client?.prepaymentBalance ?? '');
  const [giftCardBalance, setGiftCardBalance] = useState<number | ''>(client?.giftCardBalance ?? '');
  const [referrals, setReferrals] = useState<number | ''>(client?.referrals ?? '');

  const { createClient, isCreatingClient } = useClients();

  const reset = () => {
    setName(''); setEmail(''); setPhone(''); setTier('Regular'); setNotes(''); setBirthday(''); setAddress(''); setAllergies(''); setFavoriteServices(''); setPrepaymentBalance(''); setGiftCardBalance(''); setReferrals('');
  };

  const onSubmit = () => {
    if (!name || !email || !phone) { toast.error('Nom, email et téléphone requis'); return; }

    const payload: any = {
      name,
      email,
      phone,
      tier,
      notes,
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
  };

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Nouvelle Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nom Complet</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Marie Kabila" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+243..." />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@email.com" />
            </div>
          </div>
          <div>
            <Label>Tier</Label>
            <Select onValueChange={(v) => setTier(v as any)}>
              <SelectTrigger size="sm"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date de Naissance</Label>
            <Input value={birthday} onChange={(e) => setBirthday(e.target.value)} type="date" />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(new Date(birthday), 'PPP') : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={birthday ? new Date(birthday) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setBirthday(date.toISOString().split('T')[0]);
                    }
                  }}
                // disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover> */}
          </div>
          <div>
            <Label>Adresse</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div>
            <Label>Allergies</Label>
            <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Ex: Aucune, Parfums" />
          </div>

          <div>
            <Label>Services favoris (virgule séparés)</Label>
            <Input value={favoriteServices} onChange={(e) => setFavoriteServices(e.target.value)} placeholder="Manucure, Pedicure" />
          </div>

          <div>
            <Label>Solde prépaiement</Label>
            <Input type="number" value={prepaymentBalance === '' ? '' : String(prepaymentBalance)} onChange={(e) => setPrepaymentBalance(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div>
            <Label>Solde carte cadeau</Label>
            <Input type="number" value={giftCardBalance === '' ? '' : String(giftCardBalance)} onChange={(e) => setGiftCardBalance(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>

          <div>
            <Label>Parrainages</Label>
            <Input type="number" value={referrals === '' ? '' : String(referrals)} onChange={(e) => setReferrals(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Notes (Préférences)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes importantes..." />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isCreatingClient} className="bg-linear-to-r from-pink-500 to-purple-500 text-white">{isCreatingClient ? 'Création...' : 'Créer une fiche cliente'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
