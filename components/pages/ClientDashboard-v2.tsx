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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useLoyalty, useReferral } from "@/lib/hooks/useLoyalty";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  // Get appointments
  const {
    appointments = [],
    isLoading: isAppointmentsLoading,
    cancelAppointment,
  } = useAppointments({
    clientId: user?.id,
  });

  // Get loyalty data
  const {
    points = 0,
    tier = "Regular",
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
    loyaltyPoints: points,
    totalAppointments: completedAppointments,
    referrals,
    status: tier,
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
    navigator.clipboard.writeText(referralCode);
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-purple-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen py-24 bg-linear-to-br from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Bonjour, {user?.name} 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Bienvenue dans votre espace beauté
              </p>
            </div>

            {/* Notifications */}
            <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {unreadCount} non lues
                    </p>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllAsRead()}
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
                              <p className="text-sm text-gray-600 mb-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loyalty Points Card */}
            <Card className="p-6 bg-linear-to-br from-pink-500 to-purple-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Gift className="w-6 h-6" />
                </div>
                {tier === "VIP" && <Crown className="w-5 h-5 opacity-80" />}
                {tier === "Premium" && <Sparkles className="w-5 h-5 opacity-80" />}
              </div>
              <p className="text-sm opacity-90 mb-1">Points de fidélité</p>
              <p className="text-3xl font-bold mb-2">{points}</p>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                {tier}
              </Badge>
            </Card>

            {/* Total Appointments */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Rendez-vous</p>
              <p className="text-3xl font-bold text-gray-900">
                {completedAppointments}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {upcomingAppointments.length} à venir
              </p>
            </Card>

            {/* Referrals */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Parrainages</p>
              <p className="text-3xl font-bold text-gray-900">{referrals}</p>
              <p className="text-xs text-gray-500 mt-2">
                {nextFreeReferral} pour service gratuit
              </p>
            </Card>

            {/* Next Free Service */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Service gratuit dans</p>
              <p className="text-3xl font-bold text-gray-900">
                {nextFreeService}
              </p>
              <p className="text-xs text-gray-500 mt-2">rendez-vous</p>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="appointments">
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
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-pink-500" />
                Rendez-vous à venir
              </h2>

              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-4">
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
                      className="border rounded-xl p-6 hover:shadow-lg transition-all bg-linear-to-r from-white to-pink-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold">
                              {appointment.service?.name || "Service"}
                            </h3>
                            {getStatusBadge(appointment.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
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
                            <p className="text-2xl font-bold text-pink-600">
                              {appointment.price?.toLocaleString()} CDF
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
              <h2 className="text-2xl font-bold mb-6 flex items-center">
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
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {appointment.service?.name}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatDate(appointment.date)}</span>
                          <span>•</span>
                          <span>{appointment.worker?.user?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-gray-900">
                          {appointment.price?.toLocaleString()} CDF
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
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-pink-500" />
                Programme de Fidélité
              </h2>

              {/* Loyalty Progress */}
              <div className="mb-8 p-6 bg-linear-to-br from-pink-100 to-purple-100 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vos points</p>
                    <p className="text-4xl font-bold text-gray-900">{points}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-linear-to-r from-pink-500 to-purple-500 text-white border-0 text-lg px-4 py-2">
                      {tier}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Prochain service gratuit
                    </span>
                    <span className="font-semibold">
                      {nextFreeService} rendez-vous restants
                    </span>
                  </div>
                  <Progress value={(5 - nextFreeService) * 20} className="h-3" />
                </div>
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
                        className={`text-lg font-bold ${transaction.points > 0
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
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Share2 className="w-6 h-6 mr-2 text-pink-500" />
                Programme de Parrainage
              </h2>

              {/* Referral Code */}
              <div className="mb-8 p-6 bg-linear-to-br from-amber-100 to-pink-100 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Votre code de parrainage
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 p-4 bg-white rounded-lg border-2 border-dashed border-pink-300">
                    <p className="text-3xl font-bold text-center text-pink-600 tracking-wider">
                      {referralCode || "Chargement..."}
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
                  <div className="p-4 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">
                      {referrals}
                    </p>
                    <p className="text-sm text-gray-600">Parrainages réussis</p>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {nextFreeReferral}
                    </p>
                    <p className="text-sm text-gray-600">
                      Restants pour service gratuit
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comment ça marche ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-pink-600">
                        1
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Partagez</h4>
                    <p className="text-sm text-gray-600">
                      Partagez votre code avec vos amis
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-purple-600">
                        2
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Ils s'inscrivent</h4>
                    <p className="text-sm text-gray-600">
                      Vos amis utilisent votre code à l'inscription
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-amber-600">
                        3
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">Gagnez des points</h4>
                    <p className="text-sm text-gray-600">
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
                <p className="text-sm text-gray-600">
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
