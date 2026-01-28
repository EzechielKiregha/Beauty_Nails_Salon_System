"use client"

import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Calendar, Clock, CheckCircle, Star, TrendingUp, Award,
  Bell, Phone, MessageSquare, MapPin,
  PlayCircle, CheckCheck, XCircle, AlertCircle,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAppointments } from '@/lib/hooks/useAppointments';
import { useWorkerCommission, useWorkerSchedule } from '@/lib/hooks/useStaff';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

export default function WorkerDashboardV2() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter()

  // Get authenticated user
  const { user, isLoading: isAuthLoading } = useAuth();

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Get appointments (today for schedule tab)
  const {
    appointments = [],
    isLoading: isAppointmentsLoading,
    updateStatus,
  } = useAppointments({
    workerId: user?.workerProfile?.id,
    date: today,
  });

  console.log('Appointments:', appointments);

  // Get weekly appointments for stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const {
    appointments: weeklyAppointments = [],
  } = useAppointments({
    workerId: user?.workerProfile?.id,
  });

  // Get worker commission
  const { data: commissionData, isLoading: isCommissionLoading } = useWorkerCommission(
    user?.workerProfile?.id || '',
    'weekly'
  );

  // Get worker schedule
  // const { schedule = [], isLoading: isScheduleLoading } = useWorkerSchedule(
  //   user?.workerProfile?.id || ''
  // );

  // Get notifications
  const {
    notifications: notificationList = [],
    unreadCount = 0,
    markAsRead,
  } = useNotifications({ limit: 50 });

  // Filter appointments by status
  const todaySchedule = appointments.filter(
    apt => apt.status === 'confirmed' || apt.status === 'in_progress'
  );

  const completedToday = appointments.filter(
    apt => apt.status === 'completed'
  );

  const pendingAppointments = appointments.filter(
    apt => apt.status === 'pending'
  );

  // Calculate stats
  const stats = {
    todayAppointments: todaySchedule.length,
    completed: completedToday.length,
    pending: pendingAppointments.length,
    rating: user?.workerProfile?.rating || 0,
    commission: commissionData?.commission || 0,
    revenue: commissionData?.totalRevenue || 0,
  };

  // Handle update status
  const handleUpdateStatus = (appointmentId: string, newStatus: string) => {
    updateStatus(
      {
        id: appointmentId,
        statusData: { status: newStatus as any },
      },
      {
        onSuccess: () => {
          toast.success('Statut mis à jour');
          setDetailsOpen(false);
        },
      }
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Confirmé
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            <PlayCircle className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Annulé
          </Badge>
        );
      case 'no_show':
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'appointment_cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate weekly data from appointments
  const weeklyData = (() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const data = days.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + index);
      const dayStr = dayDate.toISOString().split('T')[0];

      const dayAppointments = weeklyAppointments.filter(
        apt => apt.date?.toString().split('T')[0] === dayStr ||
          apt.date === dayStr ||
          new Date(apt.date).toISOString().split('T')[0] === dayStr
      );

      return {
        day,
        rendezVous: dayAppointments.length,
        revenus: dayAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0),
      };
    });
    return data;
  })();

  // Calculate service statistics from appointments
  const serviceStats = (() => {
    const serviceCounts: Record<string, number> = {};

    weeklyAppointments.forEach(apt => {
      const serviceName = apt.service?.name || 'Autre';
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
    });

    const total = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
    return Object.entries(serviceCounts)
      .map(([name, count]) => ({
        name,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  })();

  // Loading state
  if (isAuthLoading || isAppointmentsLoading) {
    return (
      <LoadingSpinner />
    );
  }

  // Redirect if not authenticated or not a worker
  if (!user || user.role !== 'worker') {
    router.push('/');
  }

  return (
    <div className="min-h-screen py-24 bg-linear-to-br from-purple-50 via-pink-50 to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Espace Employé
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                Bonjour, {user?.name} 👋
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
              <SheetContent className="dark:bg-gray-900 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Notifications</h2>
                <ScrollArea className="h-[calc(100vh-150px)]">
                  <div className="space-y-4">
                    {notificationList.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Aucune notification</p>
                      </div>
                    ) : (
                      notificationList.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border cursor-pointer dark:border-gray-700 ${notification.isRead ? 'bg-white dark:bg-gray-800' : 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                            }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.message}</p>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-800 dark:hover:shadow-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Aujourd'hui</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.todayAppointments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stats.completed} terminés</p>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-800 dark:hover:shadow-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Complétés</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">aujourd'hui</p>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-800 dark:hover:shadow-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">En attente</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">à confirmer</p>
            </Card>
            <Card className="p-4 sm:p-6 bg-linear-to-br from-amber-500 to-pink-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">Note moyenne</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.rating.toFixed(1)}</p>
              <p className="text-xs opacity-80 mt-2">
                {user?.workerProfile?.totalReviews || 0} avis
              </p>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="performance">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <DollarSign className="w-4 h-4 mr-2" />
              Commissions
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-purple-500" />
                Planning d'aujourd'hui
              </h2>

              {todaySchedule.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Aucun rendez-vous aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySchedule.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-xl p-6 hover:shadow-lg transition-all bg-linear-to-r from-white to-purple-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {appointment.time}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appointment.duration} min
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar>
                                <AvatarFallback>
                                  {appointment.client?.user?.name?.charAt(0) || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {appointment.client?.user?.name || 'Client'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {appointment.service?.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {appointment.client?.user?.phone || 'N/A'}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {appointment.location === 'salon' ? 'Salon' : 'Domicile'}
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                                <MessageSquare className="w-4 h-4 inline mr-1" />
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {getStatusBadge(appointment.status)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setDetailsOpen(true);
                            }}
                          >
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Pending Confirmations */}
            {pendingAppointments.length > 0 && (
              <Card className="p-6 border-yellow-200 bg-yellow-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  En attente de confirmation ({pendingAppointments.length})
                </h3>
                <div className="space-y-3">
                  {pendingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{appointment.client?.user?.name}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.service?.name} - {appointment.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() =>
                            handleUpdateStatus(appointment.id, 'cancelled')
                          }
                        >
                          Refuser
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(appointment.id, 'confirmed')
                          }
                        >
                          Confirmer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Performance hebdomadaire</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rendezVous" fill="#a855f7" name="Rendez-vous" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Rendez-vous cette semaine</span>
                    <span className="font-bold">{commissionData?.appointmentsCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Taux de complétion</span>
                    <span className="font-bold text-green-600">
                      {completedToday.length > 0
                        ? Math.round((completedToday.length / todaySchedule.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Note moyenne</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{stats.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Services populaires</h3>
                <div className="space-y-3">
                  {serviceStats.length === 0 ? (
                    <p className="text-gray-500">Aucun rendez-vous cette semaine</p>
                  ) : (
                    serviceStats.map((service, index) => {
                      const colors = ['bg-purple-50', 'bg-pink-50', 'bg-amber-50'];
                      return (
                        <div
                          key={service.name}
                          className={`flex items-center justify-between p-3 ${colors[index] || 'bg-gray-50'} rounded-lg`}
                        >
                          <span>{service.name}</span>
                          <Badge>{service.percentage}%</Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Commissions</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-linear-to-br from-green-100 to-emerald-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Cette semaine</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.commission.toLocaleString()} Fc
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Taux: {user?.workerProfile?.commissionRate || 0}%
                  </p>
                </div>

                <div className="p-6 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Revenus générés</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.revenue.toLocaleString()} Fc
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {commissionData?.appointmentsCount || 0} rendez-vous
                  </p>
                </div>

                <div className="p-6 bg-linear-to-br from-amber-100 to-orange-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Moyenne par service</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {commissionData?.appointmentsCount
                      ? Math.round(stats.revenue / commissionData.appointmentsCount).toLocaleString()
                      : 0}{' '}
                    Fc
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Commission actuelle</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div>
                    <p className="font-semibold">Période actuelle (Semaine)</p>
                    <p className="text-sm text-gray-600">
                      {commissionData?.appointmentsCount || 0} rendez-vous
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      {stats.commission.toLocaleString()} Fc
                    </p>
                  </div>
                </div>

                {commissionData?.appointmentsCount === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aucun rendez-vous complété cette semaine</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Client</label>
                  <p className="font-semibold">{selectedAppointment.client?.user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Service</label>
                  <p className="font-semibold">{selectedAppointment.service?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date & Heure</label>
                  <p className="font-semibold">
                    {formatDate(selectedAppointment.date)} à {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Durée</label>
                  <p className="font-semibold">{selectedAppointment.duration} min</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Lieu</label>
                  <p className="font-semibold">
                    {selectedAppointment.location === 'salon' ? 'Salon' : 'Domicile'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Prix</label>
                  <p className="font-semibold">{selectedAppointment.price?.toLocaleString()} Fc</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <label className="text-sm text-gray-600 block mb-1">Notes</label>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedAppointment.status === 'confirmed' && (
                  <>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'in_progress')}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  </>
                )}

                {selectedAppointment.status === 'in_progress' && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'completed')}
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Terminer
                  </Button>
                )}

                {(selectedAppointment.status === 'confirmed' ||
                  selectedAppointment.status === 'pending') && (
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'cancelled')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
