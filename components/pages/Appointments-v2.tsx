'use client'
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroSection from "../HeroSection";
import { useAuth } from "@/lib/hooks/useAuth";
import { useServices } from "@/lib/hooks/useServices";
import { useAvailableStaff } from "@/lib/hooks/useStaff";
import { useAppointments, useAvailableSlots } from "@/lib/hooks/useAppointments";
import { CreateAppointmentData } from "@/lib/api/appointments";
import { Service } from "@/lib/api/services";
import LoadingSpinner from "../LoadingSpinner";

export default function AppointmentsV2() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from quick appointment form
  const paramService = searchParams.get("service");
  const paramDate = searchParams.get("date");
  const paramTime = searchParams.get("time");

  // Initialize states with URL parameters
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >(() => {
    if (paramDate) {
      const date = new Date(paramDate);
      return !isNaN(date.getTime()) ? date : new Date();
    }
    return new Date();
  });
  const [selectedServiceId, setSelectedServiceId] = useState(paramService || "");
  const [selectedCategory, setSelectedCategory] = useState(paramService || "");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedTime, setSelectedTime] = useState(paramTime || "");
  const [location, setLocation] = useState<"salon" | "home">(
    "salon",
  );
  const [addOns, setAddOns] = useState<string[]>([]);

  const { user } = useAuth();
  const { services, isLoading: servicesLoading } = useServices();
  const { staff, isLoading: staffLoading } = useAvailableStaff();
  const { data: availableSlotsData, isLoading: slotsLoading } = useAvailableSlots({ date: selectedDate?.toLocaleDateString(), workerId: selectedWorker });
  const { createAppointment, isLoading: appointmentLoading } = useAppointments();

  // Sync service when services load from API
  useEffect(() => {
    if (paramService && services.length > 0) {
      const service = services.find((s: Service) => s.id === paramService);
      if (service) {
        setSelectedServiceId(service.id);
        setSelectedCategory(service.category); // Set to actual category, not service ID
      }
    }
  }, [services, paramService]);

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

  const availableAddOns = [
    "Prestation à domicile (+20 000 CDF)",
    "Rendez-vous express (+10 000 CDF)",
    "Produits premium (+15 000 CDF)",
  ];

  const availableMap = useMemo(() => {
    if (!availableSlotsData?.slots) return null;
    return new Map(availableSlotsData.slots.map((s: any) => [s.time, s.available]));
  }, [availableSlotsData]);

  if (servicesLoading || staffLoading || appointmentLoading) {
    return (
      <LoadingSpinner />
    )
  }

  const handleSubmit = () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      router.push("/auth/login");
      return;
    }

    if (
      !selectedCategory ||
      !selectedServiceId ||
      !selectedWorker ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error(
        "Veuillez remplir tous les champs obligatoires",
      );
      return;
    }

    const appointmentData: CreateAppointmentData = {
      clientId: user.clientProfile?.id,
      serviceId: selectedServiceId,
      workerId: selectedWorker,
      date: selectedDate.toISOString(),
      time: selectedTime,
      location: location,
      addOns: addOns,
    };

    createAppointment(appointmentData)
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        imageUrl='/reservation.jpg'
        title="Réservation"
        description="Choisissez votre service, votre spécialiste et votre
                  créneau horaire."
        badgeText='reservation'
      />
      <div id="reservation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Step 1: Service Category */}
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white mr-4 shrink-0">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                  Choisissez votre service
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-2 block font-medium">
                    Catégorie de service
                  </Label>
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
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </Card>

            {/* Step 2: Worker */}
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white mr-4 shrink-0">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                  Choisissez votre spécialiste
                </h2>
              </div>

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
            </Card>

            {/* Step 3: Date & Time */}
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white mr-4 shrink-0">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                  Date et heure
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block font-medium">
                    Date
                  </Label>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 p-4 overflow-x-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="dark:text-gray-100"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block font-medium">
                    Heure
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      // const isAvailable = availableMap instanceof Map ? !!availableMap.get(time) : true;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 sm:px-4 py-3 rounded-xl border transition-all text-sm sm:text-base ${selectedTime === time
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900 text-pink-600 dark:text-pink-200"
                            : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 4: Location */}
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white mr-4 shrink-0">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                  Lieu du rendez-vous
                </h2>
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
                          +20 000 CDF - Dans la zone de Goma
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Step 5: Add-ons */}
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white mr-4 shrink-0">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                  Options supplémentaires
                </h2>
              </div>

              <div className="space-y-3">
                {availableAddOns.map((addon) => (
                  <div
                    key={addon}
                    className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-300 dark:hover:border-pink-600 transition-colors"
                  >
                    <Checkbox
                      id={addon}
                      checked={addOns.includes(addon)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAddOns([...addOns, addon]);
                        } else {
                          setAddOns(
                            addOns.filter((a) => a !== addon),
                          );
                        }
                      }}
                      className="mt-1 sm:mt-0"
                    />
                    <Label
                      htmlFor={addon}
                      className="cursor-pointer flex-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {addon}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:p-8 border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl sticky top-24 bg-white dark:bg-gray-900">
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-6">
                Récapitulatif
              </h3>

              <div className="space-y-4 mb-6">
                {services?.filter((service: Service) => service.id === selectedServiceId).map((service: Service) => (
                  <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Service
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">
                      {service.name}
                    </p>
                  </div>
                ))}

                {staff?.filter((worker) => worker.id === selectedWorker).map((worker) => (
                  <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Spécialiste
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">
                      {worker?.user?.name}
                    </p>
                  </div>
                ))}


                {selectedDate && selectedTime && (
                  <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Date et heure
                    </p>
                    <div className="flex items-center text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      <CalendarIcon className="w-4 h-4 mr-2 text-pink-500 shrink-0" />
                      <span>
                        {selectedDate.toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-900 dark:text-gray-100 mt-1 text-sm sm:text-base">
                      <Clock className="w-4 h-4 mr-2 text-pink-500 shrink-0" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                )}

                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Lieu
                  </p>
                  <div className="flex items-center text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    {location === "salon" ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 text-pink-500 shrink-0" />
                        <span>Au salon</span>
                      </>
                    ) : (
                      <>
                        <Home className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                        <span>À domicile</span>
                      </>
                    )}
                  </div>
                </div>

                {addOns.length > 0 && (
                  <div className="pb-4">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Options
                    </p>
                    <ul className="space-y-1">
                      {addOns.map((addon) => (
                        <li
                          key={addon}
                          className="text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                        >
                          • {addon}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {!user && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                    Vous devez être connecté(e) pour réserver un
                    rendez-vous
                  </p>
                  <Link
                    href="/auth/login"
                    className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline mt-2 inline-block"
                  >
                    Se connecter
                  </Link>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!user}
                className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full py-4 sm:py-6 text-sm sm:text-base font-medium"
              >
                Confirmer le rendez-vous
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Vous recevrez une confirmation par email et
                WhatsApp
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}