"use client"
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useServices } from '@/lib/hooks/useServices';
import { useAppointments, useAvailableSlots } from '@/lib/hooks/useAppointments';
import { useAddOns } from '@/lib/hooks/useServices';
import { useDiscounts } from '@/lib/hooks/useMarketing';
import { Service } from '@/lib/api/services';
import { useAvailableStaff } from '@/lib/hooks/useStaff';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Scissors,
  Eye,
  Sparkles,
  Home,
  Calendar as CalendarIcon,
  HardHatIcon,
  RefreshCcw
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { format } from 'date-fns';
import { fr, se } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import LoaderBN from '../Loader-BN';
import { clearBookingProgress, loadBookingProgress, saveBookingProgress } from '@/lib/local/booking-storage';

export default function AppointmentsV3() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from quick appointment form
  const paramService = searchParams.get("service");
  const paramCategory = searchParams.get("category");
  const paramDate = searchParams.get("date");
  const paramTime = searchParams.get("time");
  const servicePackage = searchParams.get('package');
  const packagePrice = parseInt(searchParams.get('price') || '0', 10);

  // Initialize states with URL parameters
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (paramDate) {
      const date = new Date(paramDate);
      return !isNaN(date.getTime()) ? date : new Date();
    }
    return new Date();
  });
  const [selectedServiceId, setSelectedServiceId] = useState(paramService || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(paramCategory || null);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(paramTime || "");
  const [location, setLocation] = useState<"salon" | "home">("salon");
  const [activeAddOns, setActiveAddOns] = useState<string[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [addOnsTotalPrice, setAddOnsTotalPrice] = useState<number>(0);
  const [baseServicePrice, setBaseServicePrice] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(false);
  const [payerPhone, setPayerPhone] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [tip, setTip] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<"mobile" | "card" | "cash">("mobile");

  const TAX_RATE = 0.16; // 16% tax

  const { user } = useAuth();

  const { discounts, isLoading: discountsLoading } = useDiscounts();
  const { services, isLoading: servicesLoading } = useServices();
  const { staff, isLoading: staffLoading } = useAvailableStaff();
  const { createAppointment, isCreating, isLoading: appointmentLoading } = useAppointments();
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots({
    date: selectedDate ? selectedDate.toString() : undefined,
    workerId: selectedWorker ? selectedWorker : "",
  })

  // Fetch add-ons for selected service
  const { data: addOns = [], isLoading: addOnsLoading } = useAddOns(selectedServiceId);

  // Calculate total add-ons price
  useEffect(() => {
    if (addOns.length > 0 && activeAddOns.length > 0) {
      const total = addOns
        .filter(addOn => activeAddOns.includes(addOn.id))
        .reduce((sum, addOn) => sum + addOn.price, 0);
      setAddOnsTotalPrice(total);
    } else {
      setAddOnsTotalPrice(0);
    }
  }, [addOns, activeAddOns]);

  useEffect(() => {
    if (!paramCategory && (!paramTime && !paramDate) && !paramService) {
      const savedBooking = loadBookingProgress();

      if (savedBooking) {
        setSelectedCategory(savedBooking.category);
        setSelectedServiceId(savedBooking.serviceId);
        setSelectedWorker(savedBooking.workerId);
        setSelectedDate(new Date(savedBooking.date));
        setSelectedTime(savedBooking.time);
        setLocation(savedBooking.location);
        setActiveAddOns(savedBooking.addOns);
        toast("Booking restored", {
          description: "Your previous booking progress has been restored."
        });
      }
    }
  }, []);

  const subtotal = useMemo(() => {
    const servicePrice = baseServicePrice || 0;
    return servicePrice + addOnsTotalPrice;
  }, [baseServicePrice, addOnsTotalPrice]);

  const appliedDiscount = useMemo(() => {
    if (!discountCode) return null;

    return discounts.find(
      (d) =>
        d.code.toLowerCase() === discountCode.toLowerCase() &&
        d.isActive
    );
  }, [discountCode, discounts]);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;

    if (appliedDiscount.type === "percentage") {
      return subtotal * (appliedDiscount.value / 100);
    }

    return appliedDiscount.value;
  }, [appliedDiscount, subtotal]);

  const taxAmount = useMemo(() => {
    return (subtotal - discountAmount) * TAX_RATE;
  }, [subtotal, discountAmount]);

  const total = useMemo(() => {
    return subtotal - discountAmount + taxAmount + tip;
  }, [subtotal, discountAmount, taxAmount, tip]);

  // Sync service when services load from API
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find((s: Service) => s.id === selectedServiceId);

      if (!service) return;

      setService(service);
      setSelectedServiceId(service.id)
      setBaseServicePrice(service.price);

      // Reset active add-ons when service changes
      setActiveAddOns([]);
    } else {
      setBaseServicePrice(0);
      setActiveAddOns([]);
    }

    if (paramService && services.length > 0) {
      const service = services.find((s: Service) => s.id === paramService);
      if (!service) return;
      (service.id);
      setSelectedCategory(service.category);
      setService(service);
      setSelectedServiceId(service.id)
      setBaseServicePrice(service.price);
    }
  }, [services, paramService, selectedServiceId]);

  const weekDay = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
  ];

  const categoryIcons: Record<string, React.ReactElement> = {
    "onglerie": <Scissors className="w-6 h-6" />,
    "cils": <Eye className="w-6 h-6" />,
    "tresses": <HardHatIcon className="w-6 h-6" />,
    "maquillage": <Sparkles className="w-6 h-6" />,
  };


  const paymentInfo = useMemo(() => ({
    discountCode,
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    tip,
    total,
    method: selectedMethod,
    status: 'completed', // Default to pending
    receipt: `RCT-${Date.now()}`,
    transactionId: null
  }), [
    discountCode,
    subtotal,
    discountAmount,
    taxAmount,
    tip,
    total,
    selectedMethod
  ]);

  if (servicesLoading || staffLoading || appointmentLoading || discountsLoading) {
    return (
      <LoaderBN />
    )
  }

  const handleSubmit = () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      router.push("/auth/login");
      return;
    }

    if (!servicePackage) {
      if (
        !selectedCategory ||
        !selectedServiceId ||
        !selectedWorker ||
        !selectedDate ||
        !selectedTime
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const appointmentData = {
        serviceId: selectedServiceId,
        workerId: selectedWorker,
        date: selectedDate.toISOString(),
        time: selectedTime,
        location: location,
        addOns: activeAddOns,
        paymentInfo,
      };

      createAppointment(appointmentData);

      clearBookingProgress();
    } else {
      if (
        !selectedWorker ||
        !selectedDate ||
        !selectedTime
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const appointmentData = {
        packageId: servicePackage,
        price: packagePrice,
        workerId: selectedWorker,
        date: selectedDate.toISOString(),
        time: selectedTime,
        location: location,
        addOns: activeAddOns,
        paymentInfo,
      };

      createAppointment(appointmentData, {
        onSuccess: () => {
          toast.success('Rendez-vous créé avec succès!');
          router.push('/appointments/success');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error?.message || 'Erreur lors de la création du rendez-vous');
        }
      });
    }
  };

  const handleRequireAuth = () => {
    const appointmentData = {
      serviceId: selectedServiceId,
      workerId: selectedWorker,
      date: selectedDate && selectedDate.toISOString(),
      time: selectedTime,
      location: location,
      addOns: activeAddOns,
      paymentInfo
    };

    saveBookingProgress({
      ...appointmentData,
      category: selectedCategory
    });

    router.push("/auth/login?redirect=appointments");
  };

  // Filter services by category
  const filteredServices = selectedCategory
    ? services.filter((s: Service) => s.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Header */}
      <section className="bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="my-8 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Réservation
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100 mb-6">
            Prenez rendez-vous en quelques clics
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choisissez votre service, votre spécialiste et votre
            créneau horaire
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">

        {/* Category Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Catégorie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['onglerie', 'cils', 'tresses', 'maquillage'].map((category) => (
              <Card
                key={category}
                className={`p-4 cursor-pointer transition-all ${selectedCategory === category
                  ? 'border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                  }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedServiceId("");
                  setSelectedWorker(null);
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-pink-500 mb-2">
                    {categoryIcons[category]}
                  </div>
                  <p className="text-2xl font-bold dark:text-gray-200 text-gray-700">
                    {category}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        {selectedCategory && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols lg:grid-cols-3 gap-4">
              {filteredServices.map((service: Service) => (
                <Card
                  key={service.id}
                  className={`p-4 cursor-pointer transition-all ${selectedServiceId === service.id
                    ? 'border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                    }`}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setService(service);
                    setBaseServicePrice(service.price);
                    setSelectedWorker(null);
                  }}
                >
                  <div className="flex justify-center mb-3">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-36 rounded-lg object-cover border border-gray-200 dark:border00"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{service.name}</h4>
                    <Badge className="bg-green-500 dark:bg-green-600 text-white">
                      {service.price.toLocaleString()} CDF
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{service.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{service.duration} min</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons Selection */}
        {selectedServiceId && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Services additionnels</h3>
            <p className="text-md text-gray-500 dark:text-gray-400 font-light  mb-4">Veillez cochez les services additionnels qui vous intéressent </p>
            {addOnsLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Chargement des add-ons...</p>
            ) : addOns.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Malheureusement aucun add-on est disponible pour ce service</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addOns.map((addOn) => {
                  const isActive = activeAddOns.includes(addOn.id);

                  return (
                    <Card
                      key={addOn.id}
                      className={`p-4 cursor-pointer transition-all ${isActive
                        ? 'border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                        }`}
                      onClick={() => {
                        if (isActive) {
                          setActiveAddOns(activeAddOns.filter(id => id !== addOn.id));
                        } else {
                          setActiveAddOns([...activeAddOns, addOn.id]);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{addOn.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            +{addOn.price.toLocaleString()} CDF • +{addOn.duration} min
                          </p>
                        </div>
                        <Badge
                          className={`${isActive ? 'bg-pink-500 dark:bg-pink-600' : 'bg-gray-200 dark:bg-gray-700'} text-white`}
                        >
                          {isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>

                      {!isActive && (
                        <div className="mt-3">
                          <Label className="text-sm text-gray-600 dark:text-gray-400">
                            Confirmez que vous avez votre propre {addOn.name.toLowerCase()}
                          </Label>
                          <Input
                            placeholder={`Ex: J'ai mon propre ${addOn.name.toLowerCase()}`}
                            className="mt-1 text-sm"
                            disabled
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Staff Selection */}
        {selectedServiceId && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Esthéticienne</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((worker: any) => (
                <Card
                  key={worker.id}
                  className={`p-4 cursor-pointer transition-all ${selectedWorker === worker.id
                    ? 'border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                    }`}
                  onClick={() => {
                    setSelectedWorker(worker.id)
                    setSelectedWorkerName(worker.user.name)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {worker.user.avatar ? (
                        <img
                          src={worker.user.avatar}
                          alt={worker.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-lg">
                          {worker.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{worker.user.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{worker.position}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Date and Time Selection */}
        {selectedWorker && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Choisir date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date.getDate() < new Date().getDate()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              {slots?.slots.length != 0
                ? <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Les Heures <span className="text-md font-bold text-pink-600">{selectedWorkerName}</span> sera disponible le <span className="text-md font-bold text-pink-600">{selectedDate ? format(selectedDate, "PPP", { locale: fr }) : ''}</span></h3>
                : <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Malheureusement <span className="text-md font-bold text-pink-600">{selectedWorkerName}</span> ne travaille pas <span className="text-md font-bold text-pink-600">le {selectedDate ? weekDay[selectedDate.getDay()] : ''}</span></h3>
              }
              <div className={`grid ${slots?.slots.length != 0 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' : ''} gap-2`}>
                {slots?.slots.length === 0 ? (
                  <p className='p-12 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-400 border-gray-300 dark:border-gray-700'>
                    Malheureusement aucune heure n'est disponible pour cette date {'. '}
                    Choisi un autre specialiste ou une autre date.
                  </p>
                )
                  :
                  slots?.slots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg border ${selectedTime === time
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700'
                        } ${(selectedDate && selectedDate < new Date() && Number(time.split(":")[0]) < new Date().getHours()) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      disabled={(selectedDate && selectedDate < new Date() && Number(time.split(":")[0]) < new Date().getHours()) ? true : false}
                    >
                      {time}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        )}
        {/* Location */}
        {selectedTime && (
          <div className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
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
                        Quartier HIMBI, Commune de Goma, Ville de Goma
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
          </div>
        )}

        {!user && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
              Vous devez être connecté(e) pour réserver un
              rendez-vous
            </p>
            <Button
              variant="link"
              onClick={handleRequireAuth}
              className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline mt-2 inline-block"
            >
              Se connecter
            </Button>
          </div>
        )}

        {/* Payment Info */}
        {user && location && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Informations de Paiement</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code de Réduction</label>
                <input
                  type="text"

                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="CODE10"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pourboire</label>
                <input
                  type="number"
                  value={tip}
                  onChange={(e) => setTip(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Méthode de Paiement</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {["mobile", "card", "cash"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method as any)}
                    className={`p-3 rounded-lg border ${selectedMethod === method
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700'
                      }`}
                  >
                    {method === 'mobile' && 'Mobile Money'}
                    {method === 'card' && 'Virement Bancaire'}
                    {method === 'cash' && 'Espèces'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Premium Payment Details */}
        {user && selectedMethod && selectedMethod !== "cash" && (
          <div className="mt-6 space-y-6">

            {/* Mobile Money Card */}
            {selectedMethod === "mobile" && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6 transition-all duration-300">

                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    💳 Mobile Money
                  </h3>

                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className="flex flex-row gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <RefreshCcw className='h-5 w-5' /> Rafraîchir
                  </button>
                </div>

                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Numéro à payer
                    </p>
                    <p className="text-xl font-semibold tracking-wide mt-1">
                      +243 978 87148
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nom</p>
                      <p className="font-medium">Therese Zawadi</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">MoMoPay</p>
                      <p className="font-medium">66666 (TIGer-6)</p>
                    </div>
                  </div>

                  {/* Payer Phone Field */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <label className="block text-xs mb-1 text-gray-500 dark:text-gray-400">
                      Numéro utilisé pour le paiement
                    </label>
                    <input
                      type="text"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="Ex: 0790XXXXXX"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="pt-4">
                    {isPaid ? (
                      <div className="flex justify-between items-center rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-4 py-3">
                        <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                          Paiement confirmé
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {total.toLocaleString()} CDF
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        En attente de confirmation...
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Bank Transfer Card */}
            {selectedMethod === "card" && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6">

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                  🏦 Virement Bancaire
                </h3>

                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Banque
                    </p>
                    <p className="font-medium">
                      Bank of Kigali
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Numéro de compte
                    </p>
                    <p className="text-xl font-semibold tracking-wide">
                      123456789
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nom du compte
                    </p>
                    <p className="font-medium">
                      Salon Beauty
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    Après le virement, veuillez confirmer le paiement pour finaliser la réservation.
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Premium Summary */}
        {user && selectedMethod && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 shadow-2xl text-white">

            {/* Soft glow overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

            <div className="relative z-10 space-y-5">

              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold tracking-wide">
                  Récapitulatif du Paiement
                </h3>
                <p className="text-sm text-indigo-200">
                  Vérifiez les détails avant confirmation
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20"></div>

              {/* Amounts */}
              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-indigo-100">
                  <span>Sous-total</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString()} CDF
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Réduction</span>
                    <span className="font-medium">
                      -{discountAmount.toLocaleString()} CDF
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-indigo-100">
                  <span>Taxe</span>
                  <span className="font-medium">
                    {taxAmount.toLocaleString()} CDF
                  </span>
                </div>

                {tip > 0 && (
                  <div className="flex justify-between text-indigo-100">
                    <span>Pourboire</span>
                    <span className="font-medium">
                      {tip.toLocaleString()} CDF
                    </span>
                  </div>
                )}
              </div>

              {/* Total Section */}
              <div className="pt-4 border-t border-white/20">

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold tracking-wide">
                    TOTAL
                  </span>

                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    {total.toLocaleString()} CDF
                  </span>
                </div>

                <p className="text-xs text-indigo-300 mt-1">
                  Paiement via {selectedMethod}
                </p>

              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {total > 0 && selectedDate && selectedTime && user && (
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium disabled:opacity-50"
          >
            {isCreating ? 'Traitement...' : 'Confirmer le Rendez-vous'}
          </button>
        )}
      </div>
    </div>
  );
}