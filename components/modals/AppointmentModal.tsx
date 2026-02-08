import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle, AlertCircle, CreditCard, Banknote, Sparkles, Home } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '../ui/utils';
import { useServices } from '@/lib/hooks/useServices';
import { useAvailableStaff } from '@/lib/hooks/useStaff';
import { useAppointments, useAvailableSlots } from '@/lib/hooks/useAppointments';
import { Service } from '@/lib/api/services';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { usePayments } from '@/lib/hooks/usePayments';
import { ProcessPaymentData } from '@/lib/api/payments';

interface AppointmentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  appointment?: any; // If provided, we are in edit mode
  trigger?: React.ReactNode;
  client?: any;
  setClient?: (client: any) => void;
}

export interface CreateAppointmentData {
  clientId?: string;
  serviceId: string;
  workerId: string;
  date: string;
  time: string;
  location?: 'salon' | 'home';
  addOns?: string[];
  notes?: string;

}

export function AppointmentModal({ open, onOpenChange, appointment, trigger, client }: AppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [clientName, setClientName] = useState(client?.name || '');
  const [clientPhone, setClientPhone] = useState(client?.phone || '');
  const [clientId, setClientId] = useState(client?.id || '');
  const [status, setStatus] = useState('scheduled');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile'>('card');
  const [discountCode, setDiscountCode] = useState('');
  const [service, setService] = useState<Service>();
  // Initialize states with URL parameters
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >();
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState<"salon" | "home">(
    "salon",
  );
  const [addOns, setAddOns] = useState<string[]>([]);

  const { services, isLoading: servicesLoading } = useServices();
  const { staff, isLoading: staffLoading } = useAvailableStaff();
  const { data: availableSlotsData } = useAvailableSlots(
    selectedWorker && selectedDate
      ? {
        workerId: selectedWorker,
        date: selectedDate?.toLocaleDateString(),
      }
      : undefined
  );

  const { createAppointmentAsAdmin, isLoading: appointmentLoading } = useAppointments();
  const { processPayment, isLoading: paymentProcessing } = usePayments();

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  // Sync service when services load from API
  useEffect(() => {
    if (services.length > 0) {
      const service = services.find((s: Service) => s.id === selectedServiceId);
      if (service) {
        setSelectedCategory(service.category); // Set to actual category, not service ID
      }
    }
  }, [services]);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedWorker, selectedDate]);


  useEffect(() => {
    if (appointment) {
      setClientName(appointment.clientName || appointment.client || '');
      setClientPhone(appointment.clientPhone || '');
      setClientId(appointment.clientId || '');
      // setStaff(appointment.staff || appointment.worker || '');
      setNotes(appointment.notes || '');
      setStatus(appointment.status || 'scheduled');
      setPaymentStatus(appointment.paymentStatus || 'unpaid');
      // setPrice(appointment.price || '0');
      // Parse date if string
      if (typeof appointment.date === 'string') {
        setDate(new Date(appointment.date));
      } else if (appointment.date) {
        setDate(appointment.date);
      }
    }
  }, [appointment]);

  const availableMap = useMemo(() => {
    if (!availableSlotsData?.slots) return null;
    return new Map(availableSlotsData.slots.map((s: any) => [s.time, s.available]));
  }, [availableSlotsData]);

  const handleSubmit = () => {
    if (
      !selectedCategory ||
      !selectedServiceId ||
      !selectedWorker ||
      !selectedDate ||
      !selectedTime ||
      !clientId ||
      !clientName ||
      !clientPhone
    ) {
      toast.error(
        "Veuillez remplir tous les champs obligatoires",
      );
      return;
    }

    const appointmentData: CreateAppointmentData = {
      clientId: clientId,
      serviceId: selectedServiceId,
      workerId: selectedWorker,
      date: selectedDate.toISOString(),
      time: selectedTime,
      location: location,
      addOns: addOns,
    };

    const paymentData: ProcessPaymentData = {
      clientId: clientId,
      items: [
        {
          serviceId: selectedServiceId,
          quantity: 1,
          price: parseFloat(price),
        },
      ],
      paymentMethod: paymentStatus === 'completed' ? paymentMethod : 'mixed',
      appointmentId: appointment ? appointment.id : undefined,
      discountCode: "",
      loyaltyPointsUsed: 0,
      tip: 0,
    }

    createAppointmentAsAdmin(appointmentData)
    processPayment(paymentData)
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl  flex items-center gap-2 text-white">
              {appointment ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
            </DialogTitle>
            <p className="text-pink-100 opacity-90">
              {appointment ? 'Gérez les détails du rendez-vous existant.' : 'Planifiez une nouvelle séance beauté.'}
            </p>
          </DialogHeader>
        </div>

        {/* <form onSubmit={handleSubmit} className="p-6 space-y-6"> */}
        <div className="p-6 space-y-6">
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
                      // onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    placeholder="081 234 5678"
                    value={clientPhone}
                  // onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                {/* Service & Staff */}
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setSelectedServiceId("");
                    }}
                  >
                    <SelectTrigger className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onglerie">
                        💅 Onglerie
                      </SelectItem>
                      <SelectItem value="cils">
                        👁️ Cils
                      </SelectItem>
                      <SelectItem value="tresses">
                        💇‍♀️ Tresses
                      </SelectItem>
                      <SelectItem value="maquillage">
                        💄 Maquillage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                      Prestation
                    </Label>
                    <Select
                      value={selectedServiceId}
                      onValueChange={setSelectedServiceId}
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                        <SelectValue placeholder="Sélectionner une prestation" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.filter((service: Service) => service.category === selectedCategory).map((service: Service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            onClick={() => setService(service)}
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employée</Label>
                  <Select
                    value={selectedWorker}
                    onValueChange={setSelectedWorker}
                  >
                    <SelectTrigger className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                      <SelectValue placeholder="Sélectionner une spécialiste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        Peu importe (première disponible)
                      </SelectItem>
                      {staff.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker?.user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Date & Time */}
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
                </div>

                {/* <div className="grid grid-cols-2 gap-2">
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
                </div> */}
                {availableSlotsData ? (<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlotsData?.slots.map((slot: any) => {
                    const isAvailable = slot.available;

                    return (
                      <button
                        key={slot.time}
                        disabled={!isAvailable}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "px-2 py-2 rounded-xl border transition-all text-sm",
                          selectedTime === slot.time
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : isAvailable
                              ? "border-gray-200 hover:border-pink-300"
                              : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>)
                  : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-1 sm:px-2 py-2 rounded-xl border transition-all text-sm sm:text-base ${selectedTime === time
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900 text-pink-600 dark:text-pink-200"
                            : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}

              </div>

              <RadioGroup
                value={location}
                onValueChange={(value: any) =>
                  setLocation(value)
                }
              >
                <div className="space-y-4">
                  <div className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-300 dark:hover:border-pink-600 transition-colors">
                    <RadioGroupItem value="salon" id="salon" className="mt-1 sm:mt-0" />
                    <Label
                      htmlFor="salon"
                      className="flex items-start sm:items-center cursor-pointer flex-1"
                    >
                      <Sparkles className="w-5 h-5 mr-3 text-pink-500 shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          Au salon
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Q. HIMBI, C. de Goma, Ville de Goma
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-300 dark:hover:border-pink-600 transition-colors">
                    <RadioGroupItem value="home" id="home" className="mt-1 sm:mt-0" />
                    <Label
                      htmlFor="home"
                      className="flex items-start sm:items-center cursor-pointer flex-1"
                    >
                      <Home className="w-5 h-5 mr-3 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          À domicile
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          +20 000 Fc - Dans la zone de Goma
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <div className="p-4 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-950 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Montant à payer</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      // value={service ? service.price.toString() : '0'}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-32 text-right "
                    />
                    <span className=" text-gray-600 dark:text-gray-400">Fc</span>
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
                            'text-gray-600 dark:text-gray-400'
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Use Promo code</Label>
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
                </div>

                {paymentStatus !== 'unpaid' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label>Méthode de Paiement</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button type="button" onClick={() => setPaymentMethod("cash")} variant="outline" className={`flex flex-col gap-1 h-auto py-3 border ${paymentMethod === "cash" ? " border-green-500 dark:border-green-500 bg-green-50" : " border-green-200 bg-green-50"}`}>
                        <Banknote className="w-5 h-5 text-green-600" />
                        <span className="text-xs">Espèces</span>
                      </Button>
                      <Button type="button" onClick={() => setPaymentMethod("mobile")} variant="outline" className={`flex flex-col gap-1 h-auto py-3 border ${paymentMethod === "mobile" ? " border-pink-500 dark:border-pink-500 bg-pink-50" : " border-pink-200 bg-pink-50"}`}>
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        <span className="text-xs">Mobile Money</span>
                      </Button>
                      <Button type="button" onClick={() => setPaymentMethod("card")} variant="outline" className={`flex flex-col gap-1 h-auto py-3 border ${paymentMethod === "card" ? " border-blue-500 dark:border-blue-500 bg-blue-50" : " border-blue-200 bg-blue-50"}`}>
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
            <Button onClick={handleSubmit} className="bg-linear-to-r from-pink-500 to-purple-500 text-white">
              {appointment ? 'Enregistrer Modifications' : 'Confirmer Rendez-vous'}
            </Button>
          </DialogFooter>
        </div>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}
