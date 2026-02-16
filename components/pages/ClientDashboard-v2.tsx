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
  User,
  DollarSign,
  Cake,
  Mail,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useLoyalty, useReferral } from "@/lib/hooks/useLoyalty";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import LoaderBN from "../Loader-BN";
import { useClient, useClients } from "@/lib/hooks/useClients";
import ManageClientMembership from "../ManageClientMembership";

export default function ClientDashboardV2() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();
  // Get authenticated user
  const { user, isLoading: isAuthLoading } = useAuth();

  // API hook
  const { clients: allClients = [] } = useClients()

  // Use API data first, fallback to mock only when showMock is true
  const clients = (allClients && allClients.length > 0)
    ? allClients.map((c: any) => ({
      id: c.id || c.user?.id || String(c.user?.name ?? c.user?.email ?? 'unknown'),
      userId: c.user?.id || undefined,
      name: c.user?.name || c.user?.email || 'Platform User',
      phone: c.user?.phone || '',
      email: c.user?.email || '',
      birthday: c.birthday ? new Date(c.birthday).toISOString().split('T')[0] : undefined,
      address: c.address || undefined,
      totalAppointments: c.totalAppointments || 0,
      totalSpent: typeof c.totalSpent === 'number' ? `${c.totalSpent}` : (c.totalSpent || '0'),
      loyaltyPoints: c.loyaltyPoints || 0,
      membershipStatus: c.tier || 'Standard',
      lastVisit: (c as any).lastVisit || undefined,
      preferences: typeof c.preferences === 'string' ? c.preferences : JSON.stringify(c.preferences || ''),
      allergies: c.allergies || undefined,
      favoriteServices: c.favoriteServices || [],
      prepaymentBalance: c.prepaymentBalance ?? '0',
      giftCardBalance: c.giftCardBalance ?? '0',
      referrals: c.referrals || 0
    }))
    : [];

  const selectedClient = clients.find((client: any) => client.userId === user?.id);
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

            <div className="space-x-4">
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
              <Link href="/appointments">
                <Button className="bg-linear-to-r from-pink-500 to-purple-500">
                  Réserver un rendez-vous
                </Button>
              </Link>
            </div>
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
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
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profil
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
          <TabsContent value="profile" className="space-y-6">
            {/* Client Profile */}
            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-950 lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-8">
                <TabsList className="bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
                  <TabsTrigger value="profile" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-pink-400 shadow-sm">Profil</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-pink-400 shadow-sm">Historique</TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-pink-400 shadow-sm">Notifications</TabsTrigger>
                  <TabsTrigger value="finances" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-pink-400 shadow-sm">Finances</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-8">
                  {selectedClient && <>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg shadow-pink-500/20">
                          {selectedClient.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 font-black mb-2">{selectedClient.name}</h3>
                          <div className="flex flex-wrap gap-3">
                            <Badge className="bg-amber-500 dark:bg-amber-600 text-white border-0 px-3 py-1  shadow-md shadow-amber-500/10">
                              {selectedClient.membershipStatus}
                            </Badge>
                            <Badge variant="outline" className="border-pink-200 dark:border-pink-900 text-pink-600 dark:text-pink-400 px-3 py-1 ">
                              ID: #{selectedClient.id.slice(0, 4)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xs sm:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Informations de Contact</h4>
                        <div className="space-y-3 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <p className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                              <Phone className="w-4 h-4 text-pink-500" />
                            </div>
                            {selectedClient.phone}
                          </p>
                          <p className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                              <Mail className="w-4 h-4 text-pink-500" />
                            </div>
                            {selectedClient.email}
                          </p>
                          <p className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                              <Cake className="w-4 h-4 text-pink-500" />
                            </div>
                            {selectedClient.birthday}
                          </p>
                          <p className="flex items-center gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                              <MapPin className="w-4 h-4 text-pink-500" />
                            </div>
                            {selectedClient.address}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs sm:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Notes & Préférences</h4>
                        <div className="space-y-4">
                          <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                            <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">Préférences</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{selectedClient.preferences}</p>
                          </div>
                          <div className="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">Allergies / Notes</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{selectedClient?.allergies}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">{selectedClient?.preferences}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 text-center shadow-sm">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{selectedClient.totalAppointments}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  tracking-tight">Visites</p>
                      </div>
                      <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-3xl border border-green-100 dark:border-green-900/30 text-center shadow-sm">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-lg font-black text-gray-900 dark:text-gray-100 truncate px-1">{selectedClient.totalSpent}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  tracking-tight">Dépensé en Fc</p>
                      </div>
                      <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-3xl border border-purple-100 dark:border-purple-900/30 text-center shadow-sm">
                        <Award className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{selectedClient.loyaltyPoints}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  tracking-tight">Points</p>
                      </div>
                      <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30 text-center shadow-sm">
                        <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{selectedClient.referrals}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  tracking-tight">Parrains</p>
                      </div>
                    </div>

                    {selectedClient && (
                      <Card className="p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-900/30 rounded-3xl">
                        <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-purple-500" />
                          Abonnement
                        </h4>
                        <ManageClientMembership clientId={selectedClient.id} />
                      </Card>
                    )}

                    <div className="p-6 bg-pink-50 dark:bg-pink-900/10 rounded-3xl border border-pink-100 dark:border-pink-900/30">
                      <h4 className="text-xs font-black text-pink-600 dark:text-pink-400 uppercase tracking-[0.2em] mb-4">Services Favoris</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient?.favoriteServices?.map((service: any, idx: any) => (
                          <Badge key={idx} className="bg-white dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/50 py-2 px-4 text-xs  rounded-full transition-all">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                  }
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100  flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      Historique des Visites
                    </h4>
                    <Button variant="outline" size="sm" className="rounded-full text-xs  dark:border-gray-700">Exporter PDF</Button>
                  </div>
                  <div className="space-y-3">
                    {appointmentHistory.map((apt, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                            <Calendar className="w-5 h-5 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 ">{apt.service.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">avec {apt.worker.name} • {apt.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <p className="text-sm sm:text-base font-black text-gray-900 dark:text-gray-100">{apt.price}</p>
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30 px-3 py-1 text-[10px] ">
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100  flex items-center gap-2">
                      <Bell className="w-5 h-5 text-pink-500" />
                      Communications Envoyées
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {notificationList.slice(0, 10).map((notif, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                            {notif.type === 'appointment_reminder' ? <Clock className="w-5 h-5 text-blue-500" /> :
                              notif.type === 'appointment_confirmed' ? <Mail className="w-5 h-5 text-green-500" /> :
                                <Gift className="w-5 h-5 text-purple-500" />}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 ">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notif.type} • {notif.createdAt}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 text-[10px] ">
                          {notif.isRead ? 'Lu' : 'Non Lu'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Finances Tab */}
                <TabsContent value="finances" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-100 dark:border-green-900/30 rounded-3xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Solde Prépayé</p>
                          <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{selectedClient?.prepaymentBalance}</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full  shadow-md shadow-green-500/20">
                        Recharger Compte
                      </Button>
                    </Card>
                    <Card className="p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-100 dark:border-pink-900/30 rounded-3xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md">
                          <Gift className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Carte Cadeau</p>
                          <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{selectedClient?.giftCardBalance}</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full  shadow-md shadow-purple-500/20">
                        Gérer Carte
                      </Button>
                    </Card>
                  </div>

                  <Card className="p-6 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-100 dark:border-amber-900/30 rounded-3xl">
                    <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      Programme de Fidélité
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-700 dark:text-gray-400 font-medium">Points actuels</span>
                        <span className="text-2xl text-gray-900 dark:text-gray-100 font-black">{selectedClient?.loyaltyPoints || 0} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(selectedClient?.loyaltyPoints / 500) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        Encore {500 - (selectedClient?.loyaltyPoints || 0)} points pour votre prochaine récompense !
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
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
