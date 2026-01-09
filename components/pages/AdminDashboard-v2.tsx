"use client"

import { use, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  Users, Calendar, DollarSign, TrendingUp, Award,
  Package, Star,
  Activity, BarChart3, Settings as SettingsIcon, MessageSquare, Scissors, ShoppingCart, Bell,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TodayOverview from '../TodayOverview';
import ClientManagement from '../ClientManagement';
import StaffManagement from '../StaffManagement';
import BookingCalendar from '../BookingCalendar';
import InventoryManagement from '../InventoryManagement';
import POSCheckout from '../POSCheckout';
import ReportsAnalytics from '../ReportsAnalytics';
import MarketingLoyalty from '../MarketingLoyalty';
import ServiceManagement from '../ServiceManagement';
import SystemSettings from '../SystemSettings';
import NotificationCenter from '../NotificationCenter';
import { useAuth } from '@/lib/hooks/useAuth';
import { useClients } from '@/lib/hooks/useClients';
import { useStaff } from '@/lib/hooks/useStaff';
import { useAppointments } from '@/lib/hooks/useAppointments';
import { useClientAnalytics, useRevenueReport, useServicePerformance } from '@/lib/hooks/useReports';
import { useInventory } from '@/lib/hooks/useInventory';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useRouter } from 'next/navigation';

export default function AdminDashboardV2() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();

  // Get authenticated user
  const { user, isLoading: isAuthLoading } = useAuth();

  // Get clients data
  const { clients = [], isLoading: isClientsLoading } = useClients();

  // Get staff data
  const { staff = [], isLoading: isStaffLoading } = useStaff();

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const { appointments: todayAppointments = [], isLoading: isAppointmentsLoading } = useAppointments({
    date: today,
  });

  // Get revenue report (current month)
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: revenueData, isLoading: isRevenueLoading } = useRevenueReport({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  });

  // Get client analytics
  const { data: clientAnalytics, isLoading: isAnalyticsLoading } = useClientAnalytics('monthly');

  // Get service performance
  const { data: servicePerformance, isLoading: isServicePerformanceLoading } = useServicePerformance('monthly');

  // Get inventory data
  const { inventory = [], isLoading: isInventoryLoading } = useInventory();

  // Get notifications
  const {
    // notifications: notificationList = [],
    unreadCount = 0,
    // markAsRead,
  } = useNotifications({ limit: 50 });

  // Calculate stats
  const stats = {
    totalClients: clients.length,
    activeWorkers: staff.filter(w => w.isAvailable).length,
    todayRevenue: revenueData?.totalRevenue || 0,
    todayAppointments: todayAppointments.length,
    monthlyRevenue: revenueData?.totalRevenue || 0,
    avgRating: staff.reduce((acc, w) => acc + (w.rating || 0), 0) / (staff.length || 1),
    completedAppointments: todayAppointments.filter(apt => apt.status === 'completed').length,
    pendingAppointments: todayAppointments.filter(apt => apt.status === 'pending').length,
    lowStockItems: inventory.filter(item => item.status === 'low' || item.status === 'critical').length,
    newClients: clientAnalytics?.newClients || 0,
  };

  // Prepare revenue chart data (last 6 months)
  const monthlyRevenueData = [
    { month: 'Jun', revenue: 220000, appointments: 180 },
    { month: 'Jul', revenue: 250000, appointments: 105 },
    { month: 'Aug', revenue: 235000, appointments: 192 },
    { month: 'Sep', revenue: 270000, appointments: 125 },
    { month: 'Oct', revenue: 285000, appointments: 140 },
    { month: 'Nov', revenue: stats.monthlyRevenue, appointments: stats.todayAppointments },
  ];

  // Service distribution
  const serviceDistribution = servicePerformance?.services?.slice(0, 4).map((service: any, index: number) => ({
    name: service.name,
    value: service.count || 0,
    color: ['#ec4899', '#a855f7', '#f59e0b', '#10b981'][index],
  })) || [
      { name: 'Onglerie', value: 45, color: '#ec4899' },
      { name: 'Cils', value: 30, color: '#a855f7' },
      { name: 'Tresses', value: 15, color: '#f59e0b' },
      { name: 'Maquillage', value: 10, color: '#10b981' },
    ];

  // Loading state
  if (isAuthLoading || isClientsLoading || isStaffLoading || isAnalyticsLoading || isRevenueLoading || isServicePerformanceLoading || isInventoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not an admin
  if (!user || user.role !== 'admin') {
    router.push('/');
  }

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Tableau de Bord Admin
              </h1>
              <p className="text-gray-600 text-lg">
                Bienvenue, {user?.name} 👋
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
                <NotificationCenter />
              </SheetContent>
            </Sheet>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <Card className="p-6 bg-linear-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Revenus du mois</p>
              <p className="text-3xl font-bold mb-2">
                {(stats.monthlyRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs opacity-80">
                {stats.todayRevenue.toLocaleString()} CDF aujourd'hui
              </p>
            </Card>

            {/* Clients Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
              <p className="text-xs text-gray-500 mt-2">
                +{stats.newClients} ce mois
              </p>
            </Card>

            {/* Appointments Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Rendez-vous aujourd'hui</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.completedAppointments} terminés
              </p>
            </Card>

            {/* Staff Card */}
            <Card className="p-6 bg-linear-to-br from-amber-500 to-orange-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <Star className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Personnel actif</p>
              <p className="text-3xl font-bold mb-2">{stats.activeWorkers}</p>
              <p className="text-xs opacity-80">
                Note moyenne: {stats.avgRating.toFixed(1)}⭐
              </p>
            </Card>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Complétés</p>
                  <p className="text-xl font-bold">{stats.completedAppointments}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">En attente</p>
                  <p className="text-xl font-bold">{stats.pendingAppointments}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stats.lowStockItems > 0 ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                  <Package className={`w-5 h-5 ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-gray-600'
                    }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Stock bas</p>
                  <p className="text-xl font-bold">{stats.lowStockItems}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Taux occupation</p>
                  <p className="text-xl font-bold">
                    {stats.todayAppointments > 0
                      ? Math.round((stats.completedAppointments / stats.todayAppointments) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Évolution des Revenus
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${(value / 1000000).toFixed(1)}M CDF`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Service Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Scissors className="w-5 h-5 mr-2 text-pink-500" />
              Distribution des Services
            </h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">
              <Activity className="w-4 h-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Award className="w-4 h-4 mr-2" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="more">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Plus
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <TodayOverview />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>

          {/* More Tab */}
          <TabsContent value="more" className="space-y-6">
            <Tabs defaultValue="services">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="services">
                  <Scissors className="w-4 h-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="inventory">
                  <Package className="w-4 h-4 mr-2" />
                  Inventaire
                </TabsTrigger>
                <TabsTrigger value="pos">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Caisse
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Rapports
                </TabsTrigger>
                <TabsTrigger value="marketing">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Marketing
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-6">
                <ServiceManagement />
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <InventoryManagement />
              </TabsContent>

              <TabsContent value="pos" className="mt-6">
                <POSCheckout />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <ReportsAnalytics />
              </TabsContent>

              <TabsContent value="marketing" className="mt-6">
                <MarketingLoyalty />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SystemSettings />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Alerts Section */}
        {(stats.lowStockItems > 0 || stats.pendingAppointments > 5) && (
          <Card className="p-6 mt-8 border-yellow-200 bg-yellow-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Alertes & Actions requises
            </h3>
            <div className="space-y-3">
              {stats.lowStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold">Stock bas</p>
                      <p className="text-sm text-gray-600">
                        {stats.lowStockItems} articles nécessitent un réapprovisionnement
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Voir les articles
                  </Button>
                </div>
              )}

              {stats.pendingAppointments > 5 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold">Rendez-vous en attente</p>
                      <p className="text-sm text-gray-600">
                        {stats.pendingAppointments} rendez-vous nécessitent une confirmation
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Voir le calendrier
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
