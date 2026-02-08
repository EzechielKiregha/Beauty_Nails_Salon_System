"use client"
import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import {
  Calendar,
  Users,
  Clock,
  Star,
  Package,
  CheckCircle,
  Gift,
  Award,
  TrendingUp,
  MapPin,
  Bell,
  Phone,
  MessageSquare,
  Share2,
  XCircle,
  Crown,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useLoyalty, useReferral } from "@/lib/hooks/useLoyalty";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import LoaderBN from "../Loader-BN";
import { LoyaltyTransaction } from "@/lib/api/loyalty";

export default function ClientDashboardV2() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();
  const { transactions: loyaltyTransactions, isLoading: loyaltyLoading } = useLoyalty();
  // Get authenticated user
  const { user, isLoading: isAuthLoading } = useAuth();
  // Get appointments
  const {
    appointments = [],
    isLoading: isAppointmentsLoading,
    cancelAppointment,
  } = useAppointments({
    clientId: user?.clientProfile?.id,
  });

  // Get loyalty data
  const {
    points: loyaltyPoints,
    tier: loyaltyTier,
    transactions = [],
    isLoading: isLoyaltyLoading,
  } = useLoyalty();

  // Get referral data
  const {
    referralCode = "",
    referrals = 0,
    isLoading: isReferralLoading,
  } = useReferral();

  // Get notifications
  const {
    notifications: notificationList = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ limit: 50 });

  // Filter appointments
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending"
  );

  const appointmentHistory = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled"
  );

  // Calculate stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const nextFreeService = Math.max(0, 5 - (completedAppointments % 5));
  const nextFreeReferral = Math.max(0, 5 - referrals);

  const stats = {
    loyaltyPoints,
    totalAppointments: completedAppointments,
    referrals,
    status: loyaltyTier,
    unreadNotifications: unreadCount,
    nextFreeService,
    nextFreeReferral,
  };

  // Handle cancel appointment
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;

    cancelAppointment(
      { id: selectedAppointment.id, reason: "Annulé par le client" },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          toast.success("Rendez-vous annulé");
          setSelectedAppointment(null);
        },
      }
    );
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!selectedAppointment || rating === 0) {
      toast.error("Veuillez donner une note");
      return;
    }

    // TODO: Implement review submission API
    toast.success("Merci pour votre avis !");
    setReviewDialogOpen(false);
    setSelectedAppointment(null);
    setRating(0);
    setReviewText("");
  };

  // Copy referral code
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("https://beauty-nails.vercel.app/auth/signup?ref=" + referralCode.toLocaleLowerCase());
    toast.success("Code de parrainage copié !");
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_reminder":
      case "appointment_confirmed":
      case "appointment_cancelled":
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case "marketing":
        return <PartyPopper className="w-5 h-5 text-pink-500" />;
      case "loyalty_reward":
        return <Gift className="w-5 h-5 text-amber-500" />;
      case "birthday":
        return <Crown className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Annulé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (isAuthLoading || isAppointmentsLoading || isLoyaltyLoading) {
    return (
      <LoaderBN />
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen py-8 bg-linear-to-br from-pink-50 via-purple-50 to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl  bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Bonjour, {user?.name} 👋
              </h1>
              <p className="text-gray-900  dark:text-gray-300 text-base sm:text-lg">
                Bienvenue dans votre espace beauté
              </p>
            </div>

            {/* Notifications */}
            <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative dark:border-gray-700 dark:text-gray-200">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="p-2 border-r-0 border-pink-100 dark:border-pink-900 shadow-xl rounded-l-2xl bg-white dark:bg-gray-950">
                <div className="mb-6">
                  <h2 className="text-2xl   mb-2 dark:text-gray-100">Notifications</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900  dark:text-gray-300">
                      {unreadCount} non lues
                    </p>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllAsRead()}
                        className="dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        Tout marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4">
                    {notificationList.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Aucune notification</p>
                      </div>
                    ) : (
                      notificationList.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${notification.isRead
                            ? "bg-white"
                            : "bg-pink-50 border-pink-200"
                            }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Loyalty Points Card */}
            <Card className="p-4 sm:p-6 bg-linear-to-br from-pink-500 to-purple-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {loyaltyTier === "VIP" && <Crown className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />}
                {loyaltyTier === "Premium" && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />}
              </div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">Points de fidélité</p>
              <p className="text-2xl sm:text-3xl  mb-2">{loyaltyPoints}</p>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs sm:text-sm">
                {loyaltyTier}
              </Badge>
            </Card>

            {/* Total Appointments */}
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 mb-1">Rendez-vous</p>
              <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
                {completedAppointments}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {upcomingAppointments.length} à venir
              </p>
            </Card>

            {/* Referrals */}
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-900  dark:text-gray-300 mb-1">Parrainages</p>
              <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">{referrals}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {nextFreeReferral} pour service gratuit
              </p>
            </Card>

            {/* Next Free Service */}
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-300 mb-1">Service gratuit dans</p>
              <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
                {nextFreeService}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">rendez-vous</p>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="appointments" >
              <Calendar className="w-4 h-4 mr-2" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="loyalty">
              <Gift className="w-4 h-4 mr-2" />
              Fidélité
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <Users className="w-4 h-4 mr-2" />
              Parrainage
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="p-6">
              <h2 className="text-2xl   mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-pink-500" />
                Rendez-vous à venir
              </h2>

              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-900 dark:text-gray-100 mb-4">
                    Aucun rendez-vous prévu
                  </p>
                  <Link href="/appointments">
                    <Button className="bg-linear-to-r from-pink-500 to-purple-500">
                      Réserver un rendez-vous
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-6 hover:shadow-lg border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl ">
                              {appointment.service?.name || "Service"}
                            </h3>
                            {getStatusBadge(appointment.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-900 dark:text-gray-100">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-pink-500" />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-amber-500" />
                              <span>
                                {appointment.worker?.user?.name || "Non assigné"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <span>
                                {appointment.location === "salon"
                                  ? "Salon"
                                  : "Domicile"}
                              </span>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-right mb-2">
                            <p className="text-2xl  text-pink-600">
                              {appointment.price?.toLocaleString()} Fc
                            </p>
                          </div>

                          {appointment.status !== "cancelled" && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Phone className="w-4 h-4 mr-2" />
                                Contacter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setCancelDialogOpen(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Annuler
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Appointment History */}
            <Card className="p-6">
              <h2 className="text-2xl   mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-purple-500" />
                Historique
              </h2>

              {appointmentHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Aucun historique</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointmentHistory.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {appointment.service?.name}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-900 dark:text-gray-100">
                          <span>{formatDate(appointment.date)}</span>
                          <span>•</span>
                          <span>{appointment.worker?.user?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className=" text-gray-900">
                          {appointment.price?.toLocaleString()} Fc
                        </p>
                        {appointment.status === "completed" &&
                          !appointment.review && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setReviewDialogOpen(true);
                              }}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Noter
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card className="p-6">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Award className="w-8 h-8 text-amber-500" />
                  <h2 className="  text-2xl  text-gray-900 dark:text-gray-100">
                    Programme Fidélité
                  </h2>

                </div>
                <div className="space-y-6">
                  <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-900 shadow-xl rounded-3xl p-6 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl  text-gray-900 dark:text-gray-100">Votre Statut</h3>
                        <Badge className="bg-amber-500 text-white">{loyaltyTier || 'Standard'}</Badge>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-4">
                      <p className="text-center text-gray-700 dark:text-gray-300">
                        Points actuels: <span className=" text-amber-600 dark:text-amber-400">{loyaltyPoints}</span>
                      </p>
                    </div>
                  </Card>

                  <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-2 border-green-200 dark:border-green-900 shadow-xl rounded-3xl p-6 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl  text-gray-900 dark:text-gray-100">Récompenses Disponibles</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Consultez le catalogue</p>
                      </div>
                    </div>
                    <Link href="/catalog#loyalty">
                      <Button variant="secondary" className="w-full border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full py-3 ">
                        Explorer
                      </Button>
                    </Link>
                  </Card>

                  <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-2 border-blue-200 dark:border-blue-900 shadow-xl rounded-3xl p-6 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl  text-gray-900 dark:text-gray-100">Historique Récent</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Vos dernières activités</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {loyaltyTransactions.length > 0 ? (
                        loyaltyTransactions.map((tx, idx) => (
                          <div key={tx.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800/30 rounded-lg">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{tx.type}</span>
                            <Badge variant="outline" className="text-xs">{tx.points} pts</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">Aucune activité récente</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
              {/* Loyalty Stats & Info */}
              <div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment accumuler des points ?</AccordionTrigger>
                    <AccordionContent>
                      Gagnez 1 point pour chaque 1000 Fc dépensés. Obtenez des points bonus pour les anniversaires, parrainages et participation à des événements.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Quels sont les paliers de récompenses ?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>100 points: Manucure gratuite</li>
                        <li>250 points: Extension cils gratuite</li>
                        <li>500 points: 50% sur tous services</li>
                        <li>1000 points: Journée beauté complète gratuite</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Loyalty Transactions */}
              <h3 className="text-lg font-semibold mb-4">
                Historique des points
              </h3>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucune transaction</p>
                  </div>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${transaction.points > 0
                            ? "bg-green-100"
                            : "bg-red-100"
                            }`}
                        >
                          <TrendingUp
                            className={`w-4 h-4 ${transaction.points > 0
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-lg  ${transaction.points > 0
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {transaction.points > 0 ? "+" : ""}
                        {transaction.points} pts
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl   mb-6 flex items-center">
                <Share2 className="w-6 h-6 mr-2 text-pink-500" />
                Programme de Parrainage
              </h2>

              {/* Referral Code */}
              <div className="mb-8 p-6 border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                <h3 className="text-lg font-semibold mb-4">
                  Votre code de parrainage
                </h3>
                <div className="flex items-center gap-3 mb-4 flex-col">
                  <div className="flex-1 p-4 bg-background rounded-lg border-2 border-dashed border-pink-300">
                    <p className="text-sm lg:text-3xl text-center text-pink-600 tracking-wider">
                      {referralCode ? "https://beauty-nails.vercel.app/auth/signup?ref=" + referralCode.toLocaleLowerCase() : "Chargement..."}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCopyReferralCode}
                    className="bg-linear-to-r from-pink-500 to-purple-500"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Copier
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl  text-pink-600">
                      {referrals}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">Parrainages réussis</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl  text-purple-600">
                      {nextFreeReferral}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      Restants pour service gratuit
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comment ça marche ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl  text-pink-600">
                        1
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Partagez</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      Partagez votre code avec vos amis
                    </p>
                  </div>
                  <div className="p-4 border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl  text-purple-600">
                        2
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Ils s'inscrivent</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      Vos amis utilisent votre code à l'inscription
                    </p>
                  </div>
                  <div className="p-4 border border-pink-100 hover:border-pink-400  dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl  text-amber-600">
                        3
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Gagnez des points</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      Recevez des points à chaque parrainage réussi
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ?
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="font-semibold">{selectedAppointment.service?.name}</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(selectedAppointment.date)} à {selectedAppointment.time}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Retour
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
            >
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donner votre avis</DialogTitle>
            <DialogDescription>
              Comment s'est passé votre rendez-vous ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Commentaire (optionnel)
              </label>
              <Textarea
                placeholder="Partagez votre expérience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0}
              className="bg-linear-to-r from-pink-500 to-purple-500"
            >
              Envoyer l'avis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
