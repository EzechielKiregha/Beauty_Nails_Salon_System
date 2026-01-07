"use client"

import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Calendar, Clock, User, CheckCircle, Star, TrendingUp, Award,
  Bell, MoreVertical, Phone, Mail, MessageSquare, MapPin, Info,
  PlayCircle, CheckCheck, XCircle, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

interface WorkerDashboardProps {
  user: any;
}

export default function WorkerDashboard({ user }: WorkerDashboardProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Mock notifications
  const notifications = [
    { id: 1, type: 'appointment', title: 'Nouveau rendez-vous', message: 'Sophie Makala - 14:00 Extensions Ongles', time: '5 min', unread: true },
    { id: 2, type: 'feedback', title: 'Nouveau commentaire', message: 'Marie Kabila a laissé 5⭐', time: '1h', unread: true },
    { id: 3, type: 'update', title: 'Changement d\'horaire', message: 'Rendez-vous 16:00 reporté', time: '2h', unread: false },
    { id: 4, type: 'system', title: 'Rappel', message: 'Pause déjeuner dans 30 minutes', time: '3h', unread: false },
  ];

  const todaySchedule = [
    {
      id: 1,
      time: '09:00',
      client: 'Marie Kabila',
      phone: '+243 812 345 678',
      email: 'marie.k@email.com',
      service: 'Manucure Gel',
      duration: '60 min',
      price: '15 000 CDF',
      status: 'completed',
      notes: 'Préfère les couleurs claires'
    },
    {
      id: 2,
      time: '10:30',
      client: 'Grace Lumière',
      phone: '+243 823 456 789',
      email: 'grace.l@email.com',
      service: 'Pédicure Spa',
      duration: '60 min',
      price: '20 000 CDF',
      status: 'in-progress',
      notes: 'Allergie aux parfums forts'
    },
    {
      id: 3,
      time: '14:00',
      client: 'Sophie Makala',
      phone: '+243 834 567 890',
      email: 'sophie.m@email.com',
      service: 'Extensions Ongles',
      duration: '90 min',
      price: '25 000 CDF',
      status: 'upcoming',
      notes: 'Première visite'
    },
    {
      id: 4,
      time: '16:00',
      client: 'Élise Nkumu',
      phone: '+243 845 678 901',
      email: 'elise.n@email.com',
      service: 'Nail Art',
      duration: '45 min',
      price: '18 000 CDF',
      status: 'upcoming',
      notes: 'Design personnalisé demandé'
    }
  ];

  const completedServices = [
    {
      id: 1,
      date: '05 Nov 2025',
      client: 'Marie Dupont',
      service: 'Manucure Classique',
      rating: 5,
      feedback: 'Excellent travail, très professionnelle !',
      amount: '12 000 CDF'
    },
    {
      id: 2,
      date: '04 Nov 2025',
      client: 'Sophie Laurent',
      service: 'Pédicure Spa',
      rating: 5,
      feedback: 'Service impeccable, je reviendrai !',
      amount: '20 000 CDF'
    },
    {
      id: 3,
      date: '03 Nov 2025',
      client: 'Grace Mbala',
      service: 'Extensions Ongles',
      rating: 4,
      feedback: 'Très satisfaite du résultat',
      amount: '25 000 CDF'
    }
  ];

  const performanceData = [
    { month: 'Jun', clients: 45, revenue: 680000 },
    { month: 'Jul', clients: 52, revenue: 780000 },
    { month: 'Aug', clients: 48, revenue: 720000 },
    { month: 'Sep', clients: 58, revenue: 870000 },
    { month: 'Oct', clients: 62, revenue: 930000 },
    { month: 'Nov', clients: 38, revenue: 570000 }
  ];

  const stats = {
    todayClients: 4,
    completedToday: 1,
    avgRating: 4.8,
    totalRevenue: '930 000 CDF',
    unreadNotifications: notifications.filter(n => n.unread).length
  };

  // API calls for future backend integration
  /* 
  const fetchTodaySchedule = async () => {
    try {
      const response = await axios.get('/api/worker/schedule/today');
      // setTodaySchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status });
      // Refresh schedule
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      // Update notifications
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  */

  const handleStartAppointment = (appointment: any) => {
    console.log('Starting appointment:', appointment);
    // updateAppointmentStatus(appointment.id, 'in-progress');
  };

  const handleCompleteAppointment = (appointment: any) => {
    console.log('Completing appointment:', appointment);
    // updateAppointmentStatus(appointment.id, 'completed');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCheck className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'feedback':
        return <Star className="w-5 h-5 text-amber-500" />;
      case 'update':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Notifications */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">
              Bonjour, {user?.name} ! 💜
            </h1>
            <p className="text-xl text-gray-600">
              Votre planning du jour
            </p>
          </div>

          {/* Notification Drawer */}
          <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full w-12 h-12 border-2 border-purple-200 hover:bg-purple-50"
              >
                <Bell className="w-5 h-5 text-purple-600" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {stats.unreadNotifications}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <div className="p-6">
                <h2 className="text-2xl text-gray-900 mb-4">Notifications</h2>
                <ScrollArea className="h-[calc(100vh-120px)]">
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`p-4 rounded-xl border ${notification.unread
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm text-gray-900">{notification.title}</h3>
                              {notification.unread && (
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Clientes Aujourd'hui</p>
                <p className="text-3xl text-gray-900">{stats.todayClients}</p>
                <p className="text-xs text-purple-600 mt-1">Planning complet</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Complétées</p>
                <p className="text-3xl text-gray-900">{stats.completedToday}/{stats.todayClients}</p>
                <p className="text-xs text-green-600 mt-1">Bon rythme</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note Moyenne</p>
                <p className="text-3xl text-gray-900">{stats.avgRating}/5</p>
                <p className="text-xs text-amber-600 mt-1">Excellence!</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus ce mois</p>
                <p className="text-2xl text-gray-900">{stats.totalRevenue}</p>
                <p className="text-xs text-pink-600 mt-1">+8% vs Oct</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="schedule" className="rounded-lg px-6">
              Planning du Jour
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg px-6">
              Services Complétés
            </TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg px-6">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Planning - Mercredi 5 Nov 2025</h2>
                <Badge className="bg-purple-500 text-white">
                  {stats.todayClients} rendez-vous
                </Badge>
              </div>

              <div className="space-y-4">
                {todaySchedule.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className={`p-6 rounded-2xl border-0 transition-all hover:shadow-lg ${appointment.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : appointment.status === 'in-progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                      } border`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          {getStatusIcon(appointment.status)}
                          <p className="text-sm text-gray-900 mt-1">{appointment.time}</p>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />

                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                            {appointment.client.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg text-gray-900">{appointment.client}</h3>
                            <Badge
                              className={`text-white ${appointment.status === 'completed'
                                ? 'bg-green-500'
                                : appointment.status === 'in-progress'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-400'
                                }`}
                            >
                              {appointment.status === 'completed'
                                ? 'Complété'
                                : appointment.status === 'in-progress'
                                  ? 'En cours'
                                  : 'À venir'}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{appointment.service}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-500">Durée : {appointment.duration}</p>
                            <p className="text-sm text-gray-700">{appointment.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {/* Client Info Popover */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-200 rounded-full"
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Détails du Rendez-vous</DialogTitle>
                              <DialogDescription>
                                Informations sur le client et le service
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-16 h-16">
                                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                                    {appointment.client.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-lg text-gray-900">{appointment.client}</h3>
                                  <p className="text-sm text-gray-600">{appointment.service}</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                  <Phone className="w-4 h-4 text-purple-500" />
                                  <span className="text-gray-600">{appointment.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <Mail className="w-4 h-4 text-purple-500" />
                                  <span className="text-gray-600">{appointment.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <Clock className="w-4 h-4 text-purple-500" />
                                  <span className="text-gray-600">{appointment.time} • {appointment.duration}</span>
                                </div>
                              </div>

                              <Separator />

                              <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-gray-900 mb-1">Notes spéciales :</p>
                                <p className="text-sm text-gray-600">{appointment.notes}</p>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 gap-2"
                                  onClick={() => window.location.href = `tel:${appointment.phone}`}
                                >
                                  <Phone className="w-4 h-4" />
                                  Appeler
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 gap-2"
                                  onClick={() => window.location.href = `mailto:${appointment.email}`}
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Action Buttons */}
                        {appointment.status === 'upcoming' && (
                          <Button
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full"
                            onClick={() => handleStartAppointment(appointment)}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Commencer
                          </Button>
                        )}
                        {appointment.status === 'in-progress' && (
                          <Button
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full"
                            onClick={() => handleCompleteAppointment(appointment)}
                          >
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Terminer
                          </Button>
                        )}

                        {/* More Options */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="border-gray-200 rounded-full">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                              <MessageSquare className="w-4 h-4" />
                              Envoyer SMS
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              Reprogrammer
                            </Button>
                            <Separator className="my-1" />
                            <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-red-600">
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
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Services Récemment Complétés</h2>
              <div className="space-y-4">
                {completedServices.map((service) => (
                  <Card key={service.id} className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-400 text-white">
                              {service.client.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg text-gray-900">{service.client}</h3>
                            <Badge variant="outline" className="text-gray-600 text-xs">
                              {service.date}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{service.service}</p>
                        <p className="text-sm text-gray-900 mb-2">{service.amount}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < service.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{service.rating}/5</span>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3 mt-2">
                          <p className="text-sm text-gray-600 italic">"{service.feedback}"</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Performance Mensuelle</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg text-gray-700 mb-4">Nombre de Clientes</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clients" fill="#ec4899" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg text-gray-700 mb-4">Revenus (CDF)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">Excellente Performance !</h3>
                    <p className="text-gray-600">
                      Vous êtes parmi les meilleures performeuses ce mois-ci. Continue comme ça !
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
