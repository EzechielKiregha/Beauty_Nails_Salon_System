import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Upload, Users, Scissors, Percent, Package as PackageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '../ui/utils';

// --- Service Modal ---

interface ServiceModalProps {
  service?: any;
  trigger?: React.ReactNode;
}

export function ServiceModal({ service, trigger }: ServiceModalProps) {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-pink-500" />
            {service ? 'Modifier Service' : 'Nouveau Service'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du Service</Label>
              <Input placeholder="Ex: Manucure Gel" defaultValue={service?.name} />
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select defaultValue={service?.category || 'nails'}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nails">Onglerie</SelectItem>
                  <SelectItem value="lashes">Cils</SelectItem>
                  <SelectItem value="hair">Coiffure</SelectItem>
                  <SelectItem value="makeup">Maquillage</SelectItem>
                  <SelectItem value="spa">Soins Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (CDF)</Label>
                <div className="relative">
                  <Input type="number" placeholder="30000" defaultValue={service?.price} className="pl-9" />
                  <span className="absolute left-3 top-2.5 text-xs text-gray-500">Fr</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Durée (min)</Label>
                <Input type="number" placeholder="60" defaultValue={service?.duration} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Détails du service pour le site web..." defaultValue={service?.description} className="h-24 resize-none" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-pink-300 hover:bg-pink-50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">Photo du Service</span>
            </div>

            <div className="space-y-2">
              <Label>Employées Qualifiées</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-[150px] overflow-y-auto">
                {['Marie Nkumu', 'Grace Lumière', 'Sophie Kabila', 'Élise Makala'].map((staff) => (
                  <div key={staff} className="flex items-center space-x-2">
                    <Checkbox id={`staff-${staff}`} />
                    <Label htmlFor={`staff-${staff}`} className="text-sm cursor-pointer">{staff}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Réservation en ligne</Label>
                  <p className="text-xs text-gray-500">Visible sur le site</p>
                </div>
                <Switch defaultChecked={service?.onlineBookable ?? true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Service Populaire</Label>
                  <p className="text-xs text-gray-500">Mettre en avant</p>
                </div>
                <Switch defaultChecked={service?.popular ?? false} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Annuler</Button>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            {service ? 'Enregistrer Modifications' : 'Créer Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Package Modal ---

interface PackageModalProps {
  pkg?: any;
  trigger?: React.ReactNode;
}

export function PackageModal({ pkg, trigger }: PackageModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [price, setPrice] = useState(pkg?.price || '');

  // Mock calculation
  const totalValue = selectedServices.length * 35000;

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-purple-500" />
            {pkg ? 'Modifier Forfait' : 'Nouveau Forfait'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nom du Forfait</Label>
            <Input placeholder="Ex: Pack Mariée VIP" defaultValue={pkg?.name} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Services Inclus</Label>
              <div className="border rounded-lg p-4 space-y-2 h-[200px] overflow-y-auto bg-gray-50">
                {['Manucure Gel (30$)', 'Pédicure Spa (25$)', 'Maquillage Soirée (40$)', 'Coiffure Complète (50$)', 'Soin Visage (35$)', 'Massage (45$)'].map((svc, i) => (
                  <div key={i} className="flex items-center space-x-2 p-2 hover:bg-white rounded-md transition-colors">
                    <Checkbox
                      id={`svc-${i}`}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedServices([...selectedServices, svc]);
                        else setSelectedServices(selectedServices.filter(s => s !== svc));
                      }}
                    />
                    <Label htmlFor={`svc-${i}`} className="cursor-pointer flex-1 text-sm">{svc}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-900">Valeur Totale (Estimée)</Label>
                  <div className="text-2xl font-bold text-gray-400 line-through decoration-red-500">
                    {totalValue > 0 ? totalValue.toLocaleString() : '0'} CDF
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-900">Prix du Forfait</Label>
                  <Input
                    type="number"
                    placeholder="Prix spécial"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-lg font-bold border-purple-200 focus-visible:ring-purple-500"
                  />
                </div>

                {totalValue > 0 && price && (
                  <Badge className="bg-green-500 text-white w-full justify-center py-1">
                    Économie: {(totalValue - Number(price)).toLocaleString()} CDF
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label>Validité</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue placeholder="Durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Mois</SelectItem>
                    <SelectItem value="3">3 Mois</SelectItem>
                    <SelectItem value="6">6 Mois</SelectItem>
                    <SelectItem value="12">1 An</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description Marketing</Label>
            <Textarea placeholder="Pourquoi choisir ce forfait ?" className="resize-none" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Annuler</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            {pkg ? 'Mettre à jour' : 'Créer Forfait'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Promo Modal ---

interface PromoModalProps {
  promo?: any;
  trigger?: React.ReactNode;
}

export function PromoModal({ promo, trigger }: PromoModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState('percentage');

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-amber-500" />
            {promo ? 'Modifier Promotion' : 'Nouvelle Promotion'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Nom de la campagne</Label>
            <Input placeholder="Ex: Offre Spéciale Fêtes" defaultValue={promo?.name} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Code Promo</Label>
              <div className="relative">
                <Input placeholder="FETES2024" className="uppercase font-mono pl-9 bg-amber-50 border-amber-200 text-amber-800" defaultValue={promo?.code} />
                <span className="absolute left-3 top-2.5 text-xs text-amber-500">#</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type de réduction</Label>
              <Select defaultValue="percentage" onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                  <SelectItem value="fixed">Montant Fixe (CDF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-4 border">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valeur</Label>
                <div className="relative">
                  <Input type="number" placeholder="20" defaultValue={promo?.value} className="font-bold text-lg" />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    {type === 'percentage' ? '%' : 'CDF'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Limite Usage</Label>
                <Input type="number" placeholder="100" defaultValue={promo?.limit} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expire le</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="active" defaultChecked />
            <Label htmlFor="active">Activer immédiatement cette promotion</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Brouillon</Button>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Lancer Promotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
