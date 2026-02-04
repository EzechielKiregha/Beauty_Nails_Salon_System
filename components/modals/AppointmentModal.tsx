import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle, AlertCircle, CreditCard, Banknote } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '../ui/utils';

interface AppointmentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  appointment?: any; // If provided, we are in edit mode
  trigger?: React.ReactNode;
}

export function AppointmentModal({ open, onOpenChange, appointment, trigger }: AppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [service, setService] = useState('');
  const [staff, setStaff] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('0');

  useEffect(() => {
    if (appointment) {
      setClientName(appointment.clientName || appointment.client || '');
      setClientPhone(appointment.clientPhone || '');
      setService(appointment.service || '');
      setStaff(appointment.staff || appointment.worker || '');
      setNotes(appointment.notes || '');
      setStartTime(appointment.time || appointment.startTime || '09:00');
      setEndTime(appointment.endTime || '10:00');
      setStatus(appointment.status || 'scheduled');
      setPaymentStatus(appointment.paymentStatus || 'unpaid');
      setPrice(appointment.price || '0');
      // Parse date if string
      if (typeof appointment.date === 'string') {
        setDate(new Date(appointment.date));
      } else if (appointment.date) {
        setDate(appointment.date);
      }
    }
  }, [appointment]);

  // Mock service prices
  useEffect(() => {
    switch (service) {
      case 'manucure': setPrice('30000'); break;
      case 'cils': setPrice('45000'); break;
      case 'tresses': setPrice('50000'); break;
      case 'makeup': setPrice('40000'); break;
      default: break;
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ date, startTime, endTime, clientName, service, staff, status, paymentStatus, notes });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
              {appointment ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
            </DialogTitle>
            <p className="text-pink-100 opacity-90">
              {appointment ? 'Gérez les détails du rendez-vous existant.' : 'Planifiez une nouvelle séance beauté.'}
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="payment">Paiement & Statut</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de la Cliente</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom complet"
                      className="pl-9"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    placeholder="081 234 5678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
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

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Début</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Service & Staff */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Sélectionner" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manucure">Manucure Gel (30k)</SelectItem>
                      <SelectItem value="cils">Extensions Cils (45k)</SelectItem>
                      <SelectItem value="tresses">Tresses Box (50k)</SelectItem>
                      <SelectItem value="makeup">Maquillage (40k)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Employée</Label>
                  <Select value={staff} onValueChange={setStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marie">Marie Nkumu</SelectItem>
                      <SelectItem value="grace">Grace Lumière</SelectItem>
                      <SelectItem value="sophie">Sophie Kabila</SelectItem>
                      <SelectItem value="elise">Élise Makala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Allergies, préférences, code promo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none h-20"
                />
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Montant à payer</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-32 text-right font-bold"
                    />
                    <span className="font-bold text-gray-600">CDF</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Statut du RDV</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className={cn(
                        status === 'confirmed' ? 'text-green-600 border-green-200 bg-green-50' :
                          status === 'cancelled' ? 'text-red-600 border-red-200 bg-red-50' :
                            'text-blue-600 border-blue-200 bg-blue-50'
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Planifié</SelectItem>
                        <SelectItem value="confirmed">Confirmé</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                        <SelectItem value="noshow">Absence (No-Show)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Statut Paiement</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger className={cn(
                        paymentStatus === 'paid' ? 'text-green-600 border-green-200 bg-green-50' :
                          paymentStatus === 'partial' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                            'text-gray-600'
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Non Payé</SelectItem>
                        <SelectItem value="partial">Acompte Versé</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentStatus !== 'unpaid' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label>Méthode de Paiement</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button type="button" variant="outline" className="flex flex-col gap-1 h-auto py-3">
                        <Banknote className="w-5 h-5 text-green-600" />
                        <span className="text-xs">Espèces</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex flex-col gap-1 h-auto py-3 border-pink-200 bg-pink-50">
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        <span className="text-xs">Mobile Money</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex flex-col gap-1 h-auto py-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-xs">Carte</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            {appointment && (
              <Button type="button" variant="destructive" className="mr-auto">
                Annuler RDV
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Fermer
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {appointment ? 'Enregistrer Modifications' : 'Confirmer Rendez-vous'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
