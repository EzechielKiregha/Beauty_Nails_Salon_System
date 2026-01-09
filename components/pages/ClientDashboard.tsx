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
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
} from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import {
  Calendar,
  Users,
  Clock,
  Star,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Gift,
  Award,
  TrendingUp,
  MapPin,
  User,
  Bell,
  MoreVertical,
  Phone,
  Mail,
  MessageSquare,
  Info,
  Share2,
  XCircle,
  Edit,
  Heart,
  Crown,
  Sparkles,
  PartyPopper,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useLoyalty } from "@/lib/hooks/useLoyalty";
import { useNotifications } from "@/lib/hooks/useNotifications";
import axiosdb from "@/lib/axios";
// import axios from 'axios';

interface ClientDashboardProps {
  user: any;
}

export default function ClientDashboard({
  user,
}: ClientDashboardProps) {
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] =
    useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const {
    appointments,
    isLoading: isAppointmentsLoading,
    cancelAppointment,
  } = useAppointments({
    clientId: user?.id,
    status: 'confirmed',
  });

  // Get loyalty data
  const {
    points: loyaltyPoints,
    tier,
    transactions,
    isLoading: isLoyaltyLoading,
  } = useLoyalty();

  // Get notifications
  const {
    notifications,
    unreadCount,
    markAsRead,
  } = useNotifications({ unread: true });

  // Handle cancel appointment
  // const handleCancelAppointment = (id: string) => {
  //   if (confirm('Voulez-vous annuler ce rendez-vous ?')) {
  //     cancelAppointment({ id, reason: 'Annulé par le client' });
  //   }
  // };

  // Loading state
  if (isAppointmentsLoading || isLoyaltyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Mock notifications
  // const notifications = [
  //   {
  //     id: 1,
  //     type: "appointment",
  //     title: "Rappel rendez-vous",
  //     message: "Manucure Gel demain à 14:30",
  //     time: "2h",
  //     unread: true,
  //   },
  //   {
  //     id: 2,
  //     type: "promo",
  //     title: "Nouvelle promotion!",
  //     message: "20% sur les extensions de cils",
  //     time: "1j",
  //     unread: true,
  //   },
  //   {
  //     id: 3,
  //     type: "loyalty",
  //     title: "Points gagnés!",
  //     message: "+50 points de fidélité",
  //     time: "2j",
  //     unread: false,
  //   },
  //   {
  //     id: 4,
  //     type: "membership",
  //     title: "Abonnement",
  //     message: "Découvrez nos formules VIP",
  //     time: "3j",
  //     unread: false,
  //   },
  // ];

  // const upcomingAppointments = [
  //   {
  //     id: 1,
  //     service: "Manucure Gel",
  //     date: "10 Nov 2025",
  //     time: "14:30",
  //     worker: "Marie Nkumu",
  //     workerRating: 4.9,
  //     location: "Salon",
  //     address: "Avenue de la Liberté, Kinshasa",
  //     price: "15 000 CDF",
  //     status: "confirmed",
  //     canCancel: true,
  //   },
  //   {
  //     id: 2,
  //     service: "Extensions de Cils",
  //     date: "15 Nov 2025",
  //     time: "10:00",
  //     worker: "Grace Lumière",
  //     workerRating: 4.8,
  //     location: "Domicile",
  //     address: "Votre adresse",
  //     price: "25 000 CDF",
  //     status: "pending",
  //     canCancel: true,
  //   },
  // ];

  // const appointmentHistory = [
  //   {
  //     id: 1,
  //     service: "Maquillage Soirée",
  //     date: "25 Oct 2025",
  //     worker: "Élise Makala",
  //     rating: 5,
  //     cost: "30 000 CDF",
  //     hasReviewed: true,
  //   },
  //   {
  //     id: 2,
  //     service: "Pédicure Spa",
  //     date: "18 Oct 2025",
  //     worker: "Marie Nkumu",
  //     rating: 5,
  //     cost: "20 000 CDF",
  //     hasReviewed: true,
  //   },
  //   {
  //     id: 3,
  //     service: "Tresses Box Braids",
  //     date: "10 Oct 2025",
  //     worker: "Sophie Kabila",
  //     rating: 4,
  //     cost: "45 000 CDF",
  //     hasReviewed: false,
  //   },
  // ];

  // API calls for future backend integration

  const fetchAppointments = async () => {
    try {
      const response = await axiosdb.get('/api/client/appointments');
      // setUpcomingAppointments(response.data.upcoming);
      // setAppointmentHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // const cancelAppointment = async (appointmentId: number) => {
  //   try {
  //     await axiosdb.delete(`/api/appointments/${appointmentId}`);
  //     // Refresh appointments
  //   } catch (error) {
  //     console.error('Error canceling appointment:', error);
  //   }
  // };

  const submitReview = async (id: string, rating: number, review: string) => {
    try {
      await axiosdb.post(`/api/appointments/${id}/review`, { rating, review });
      // Refresh appointments
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const shareReferralCode = async () => {
    try {
      const response = await axiosdb.get('/api/client/referral-code');
      // Share code
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }
  };

  // const loyaltyPoints = 450;
  const pointsToNextReward = 550;
  const totalAppointments = appointments.length;
  const referrals = 2;

  const stats = {
    loyaltyPoints,
    totalAppointments,
    referrals,
    status: "VIP",
    unreadNotifications: notifications.length,
    nextFreeService: Math.ceil(5 - (totalAppointments % 5)),
    nextFreeReferral: Math.ceil(5 - referrals),
  };

  const rewards = [
    {
      id: 1,
      title: "Cliente VIP",
      description: "Plus de 5 rendez-vous",
      unlocked: true,
      icon: Award,
      color: "from-amber-400 to-orange-400",
    },
    {
      id: 2,
      title: "Ambassadrice",
      description: "3 parrainages réussis",
      unlocked: true,
      icon: Crown,
      color: "from-purple-400 to-pink-400",
    },
    {
      id: 3,
      title: "Best Client",
      description: "10 rendez-vous requis",
      unlocked: false,
      icon: Star,
      color: "from-gray-300 to-gray-400",
    },
    {
      id: 4,
      title: "Première Classe",
      description: "15 rendez-vous requis",
      unlocked: false,
      icon: Sparkles,
      color: "from-gray-300 to-gray-400",
    },
  ];

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    console.log("Canceling appointment:", selectedAppointment);
    // cancelAppointment(selectedAppointment.id);
    setCancelDialogOpen(false);
  };

  const handleReview = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRating(0);
    setReviewText("");
    setReviewDialogOpen(true);
  };

  const submitReviewHandler = () => {
    console.log("Submitting review:", { rating, reviewText });
    // submitReview(selectedAppointment.id, rating, reviewText);
    setReviewDialogOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case "promo":
        return (
          <PartyPopper className="w-5 h-5 text-pink-500" />
        );
      case "loyalty":
        return <Gift className="w-5 h-5 text-amber-500" />;
      case "membership":
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen py-24 bg-linear-to-br from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl text-gray-900 mb-2">
                Bienvenue, {user?.name?.split(" ")[0]} ! 💖
              </h1>
              <p className="text-xl text-gray-600">
                Bienvenue dans votre espace client
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Drawer */}
              <Sheet
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full w-12 h-12 border-2 border-pink-200 hover:bg-pink-50"
                  >
                    <Bell className="w-5 h-5 text-pink-600" />
                    {stats.unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                        {stats.unreadNotifications}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md p-0"
                >
                  <div className="p-6">
                    <h2 className="text-2xl text-gray-900 mb-4">
                      Notifications
                    </h2>
                    <ScrollArea className="h-[calc(100vh-120px)]">
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <Card
                            key={notification.id}
                            className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow ${notification.isRead
                              ? "bg-pink-50 border-pink-200"
                              : "bg-white border-gray-200"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                {getNotificationIcon(
                                  notification.type,
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm text-gray-900">
                                    {notification.title}
                                  </h3>
                                  {notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-1" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notification.createdAt}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/appointments">
                <Button className="bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Calendar className="w-4 h-4 mr-2" />
                  Nouveau rendez-vous
                </Button>
              </Link>
            </div>
            <Card className="p-6 mb-8 bg-gradient-to-br from-pink-500 to-amber-400 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {loyaltyPoints} Points
                  </h2>
                  <Badge variant="secondary" className="bg-white/20">
                    {tier}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">
                    {5 - (appointments.length % 5)} rendez-vous avant service gratuit
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-linear-to-br from-pink-50 to-rose-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Rendez-vous</h3>
                    <p className="text-3xl font-bold">{appointments.length}</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Points de fidélité</h3>
                    <p className="text-3xl font-bold">{loyaltyPoints}</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Notifications</h3>
                    <p className="text-3xl font-bold">{unreadCount}</p>
                  </Card>
                </div>
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-400 to-rose-400 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Rendez-vous
                  </p>
                  <p className="text-3xl text-gray-900">
                    {totalAppointments}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Depuis juin
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Parrainages
                  </p>
                  <p className="text-3xl text-gray-900">
                    {referrals}/5
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {stats.nextFreeReferral} pour cadeau
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Statut
                  </p>
                  <Badge className="bg-green-500 text-white mt-1">
                    VIP
                  </Badge>
                  <p className="text-xs text-green-600 mt-1">
                    Privilèges actifs
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Loyalty Progress Banner */}
        <Card className="bg-linear-to-br from-pink-500 via-purple-500 to-amber-500 border-0 shadow-2xl p-8 rounded-3xl mb-12 text-white hover:shadow-3xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8" />
              <h2 className="text-2xl">
                Progression vers votre prochain cadeau
              </h2>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <Info className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h3 className="text-gray-900">
                    Comment gagner des récompenses
                  </h3>
                  <Separator />
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• 5 rendez-vous = 1 service gratuit</p>
                    <p>• 5 parrainages = 1 service gratuit</p>
                    <p>• 1000 points = réductions exclusives</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Progress
            value={
              (loyaltyPoints /
                (loyaltyPoints + pointsToNextReward)) *
              100
            }
            className="h-4 mb-4 bg-white/30"
          />
          <div className="flex items-center justify-between">
            <p className="text-pink-100">
              Plus que{" "}
              <span className="text-white">
                {pointsToNextReward} points
              </span>{" "}
              pour débloquer votre service gratuit !
            </p>
            <p className="text-pink-100">
              {stats.nextFreeService} rendez-vous restants
            </p>
          </div>
        </Card>

        {/* Recent Loyalty Transactions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Historique de points
          </h2>

          <div className="space-y-3">
            {transactions.slice(0, 5).map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p
                  className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="appointments"
              className="rounded-lg px-6"
            >
              Mes Rendez-vous
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg px-6"
            >
              Historique
            </TabsTrigger>
            <TabsTrigger
              value="loyalty"
              className="rounded-lg px-6"
            >
              Fidélité & Récompenses
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="rounded-lg px-6"
            >
              Mon Abonnement
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">
                Rendez-vous à venir
              </h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="bg-linear-to-br from-pink-50 to-purple-50 border-0 shadow-md p-6 rounded-2xl hover:shadow-xl transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="bg-linear-to-br from-pink-400 to-purple-400 text-white text-lg">
                              {appointment.worker?.name
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl text-gray-900">
                                {appointment.service?.name}
                              </h3>
                              <Badge
                                variant={
                                  appointment.status === 'confirmed' ? 'default' :
                                    appointment.status === 'pending' ? 'secondary' :
                                      'destructive'
                                }
                              >
                                {appointment.status === 'confirmed' ? 'Confirmé' :
                                  appointment.status === 'pending' ? 'En attente' :
                                    'Annulé'}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-gray-600">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                                  <span>
                                    {appointment.date}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-pink-500" />
                                  <span>
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-pink-500" />
                                <span>
                                  {appointment?.worker?.name}
                                </span>
                                <div className="flex items-center ml-2">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                                  <span className="text-sm">
                                    {appointment.notes}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                                <span>
                                  {appointment.location} -{" "}
                                  {appointment.location}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-900">
                                  {appointment.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {/* Appointment Details Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-pink-200 rounded-full"
                              >
                                <Info className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Détails du Rendez-vous
                                </DialogTitle>
                                <DialogDescription>
                                  {appointment.service?.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-16 h-16">
                                    <AvatarFallback className="bg-linear-to-br from-pink-400 to-purple-400 text-white text-xl">
                                      {appointment.worker?.name
                                        .split(" ")
                                        .map((n: any) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg text-gray-900">
                                      {appointment.worker?.name}
                                    </h3>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                      <span className="text-sm text-gray-600">
                                        {
                                          appointment.notes
                                        }
                                        /5
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-pink-500" />
                                    <span className="text-gray-600">
                                      {appointment.date} à{" "}
                                      {appointment.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-pink-500" />
                                    <span className="text-gray-600">
                                      {appointment.location} -{" "}
                                      {appointment.location}
                                    </span>
                                  </div>
                                </div>

                                <Separator />

                                <div className="bg-pink-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-900">
                                      Prix du service :
                                    </p>
                                    <p className="text-lg text-gray-900">
                                      {appointment.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Link href="/appointments">
                            <Button
                              variant="outline"
                              className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Button>
                          </Link>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-gray-200 rounded-full"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2">
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-sm"
                              >
                                <Phone className="w-4 h-4" />
                                Appeler le salon
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Envoyer un message
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-sm"
                              >
                                <MapPin className="w-4 h-4" />
                                Voir l'itinéraire
                              </Button>
                              <Separator className="my-1" />
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-sm text-red-600"
                                onClick={() =>
                                  handleCancelAppointment(
                                    appointment,
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4" />
                                Annuler
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Aucun rendez-vous à venir
                  </p>
                  <Link href="/appointments">
                    <Button className="bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-6">
                      Réserver maintenant
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">
                Historique des rendez-vous
              </h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-linear-to-br from-purple-400 to-pink-400 text-white">
                            {appointment.worker?.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-2">
                            {appointment.service?.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{appointment.worker?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {appointment.review ? (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < appointment.price
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-200 text-amber-600 hover:bg-amber-50"
                            onClick={() =>
                              handleReview(appointment)
                            }
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Noter
                          </Button>
                        )}
                        <p className="text-gray-900">
                          {appointment.price}
                        </p>
                        <Link href="/appointments">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-600 hover:text-pink-700"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Réserver à nouveau
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl text-gray-900 mb-6">
                  Programme de Fidélité
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">
                        5 rendez-vous = 1 gratuit
                      </span>
                      <span className="text-gray-900">
                        {totalAppointments % 5}/5
                      </span>
                    </div>
                    <Progress
                      value={
                        ((totalAppointments % 5) / 5) * 100
                      }
                      className="h-3 mb-2"
                    />
                    <p className="text-xs text-gray-600">
                      Plus que {stats.nextFreeService}{" "}
                      rendez-vous!
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">
                        5 parrainages = 1 gratuit
                      </span>
                      <span className="text-gray-900">
                        {referrals}/5
                      </span>
                    </div>
                    <Progress
                      value={(referrals / 5) * 100}
                      className="h-3 mb-2"
                    />
                    <p className="text-xs text-gray-600">
                      Plus que {stats.nextFreeReferral}{" "}
                      parrainages!
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-linear-to-br from-pink-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-5 h-5 text-pink-600" />
                    <h3 className="text-gray-900">
                      Votre code de parrainage
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white px-4 py-2 rounded-lg text-gray-900">
                      BEAUTY2025
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-pink-200"
                    >
                      Copier
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Parrainer une amie
                </Button>
              </Card>

              <Card className="border-0 shadow-xl rounded-2xl p-8 bg-linear-to-br from-amber-50 to-orange-50">
                <h2 className="text-2xl text-gray-900 mb-6">
                  Badges & Récompenses
                </h2>
                <div className="space-y-4">
                  {rewards.map((reward) => {
                    const Icon = reward.icon;
                    return (
                      <div
                        key={reward.id}
                        className={`flex items-center gap-4 p-4 bg-white rounded-xl transition-all ${reward.unlocked
                          ? "shadow-sm hover:shadow-md"
                          : "opacity-50"
                          }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full bg-linear-to-br ${reward.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900">
                            {reward.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {reward.description}
                          </p>
                        </div>
                        <Badge
                          className={
                            reward.unlocked
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }
                        >
                          {reward.unlocked
                            ? "Débloqué"
                            : "Verrouillé"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">
                Mon Abonnement
              </h2>
              <div className="bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">
                      Devenez Membre VIP
                    </h3>
                    <p className="text-gray-600">
                      Accès privilégié et avantages exclusifs
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>
                      Réductions jusqu'à 30% sur tous les
                      services
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priorité sur les réservations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Services gratuits chaque mois</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Accès aux événements exclusifs</span>
                  </div>
                </div>

                <Link href="/memberships">
                  <Button className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
                    <Crown className="w-4 h-4 mr-2" />
                    Découvrir les abonnements
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous ?</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 mb-1">
                  {selectedAppointment.service?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.date} à{" "}
                  {selectedAppointment.time}
                </p>
                <p className="text-sm text-gray-600">
                  Avec {selectedAppointment.worker?.name}
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
              onClick={confirmCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluer votre expérience</DialogTitle>
            <DialogDescription>
              Votre avis nous aide à améliorer nos services
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Comment évaluez-vous ce service ?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer ${star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-600 mb-2">
                Laissez un commentaire (optionnel)
              </p>
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
              onClick={submitReviewHandler}
              className="bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white"
              disabled={rating === 0}
            >
              Envoyer l'évaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}