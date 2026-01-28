import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  Users, Calendar, DollarSign, TrendingUp, Award,
  Package, Star,
  Activity, BarChart3, Settings as SettingsIcon, MessageSquare, Scissors, ShoppingCart, Bell
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
import { User } from '@/lib/auth/session';

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const stats = {
    totalClients: 247,
    activeWorkers: 8,
    todayRevenue: '1 250 000 Fc',
    todayAppointments: 32,
    monthlyRevenue: '28 500 000 Fc',
    avgRating: 4.9
  };

  const revenueData = [
    { month: 'Jun', revenue: 22000000, appointments: 180 },
    { month: 'Jul', revenue: 25000000, appointments: 205 },
    { month: 'Aug', revenue: 23500000, appointments: 192 },
    { month: 'Sep', revenue: 27000000, appointments: 225 },
    { month: 'Oct', revenue: 28500000, appointments: 240 },
    { month: 'Nov', revenue: 15200000, appointments: 128 }
  ];

  const serviceDistribution = [
    { name: 'Onglerie', value: 45, color: '#ec4899' },
    { name: 'Cils', value: 25, color: '#a855f7' },
    { name: 'Tresses', value: 20, color: '#f59e0b' },
    { name: 'Maquillage', value: 10, color: '#f43f5e' }
  ];

  const topClients = [
    { name: 'Marie Kabila', appointments: 15, spent: '450 000 Fc', status: 'VIP' },
    { name: 'Grace Lumière', appointments: 12, spent: '380 000 Fc', status: 'VIP' },
    { name: 'Sophie Makala', appointments: 10, spent: '320 000 Fc', status: 'Premium' },
    { name: 'Élise Nkumu', appointments: 9, spent: '285 000 Fc', status: 'Premium' },
    { name: 'Rose Mbala', appointments: 8, spent: '250 000 Fc', status: 'Regular' }
  ];

  const workers = [
    { name: 'Marie Nkumu', role: 'Spécialiste Ongles', appointments: 62, rating: 4.9, revenue: '930 000 Fc' },
    { name: 'Grace Lumière', role: 'Experte Cils', appointments: 58, rating: 4.8, revenue: '870 000 Fc' },
    { name: 'Sophie Kabila', role: 'Coiffeuse', appointments: 48, rating: 4.7, revenue: '720 000 Fc' },
    { name: 'Élise Makala', role: 'Maquilleuse', appointments: 38, rating: 4.9, revenue: '570 000 Fc' }
  ];

  const recentAppointments = [
    { time: '09:00', client: 'Marie K.', service: 'Manucure Gel', worker: 'Marie N.', status: 'completed' },
    { time: '09:30', client: 'Grace L.', service: 'Extensions Cils', worker: 'Grace L.', status: 'in-progress' },
    { time: '10:00', client: 'Sophie M.', service: 'Tresses', worker: 'Sophie K.', status: 'upcoming' },
    { time: '10:30', client: 'Élise N.', service: 'Maquillage', worker: 'Élise M.', status: 'upcoming' }
  ];

  const inventory = [
    { item: 'Vernis Gel', stock: 45, minStock: 30, status: 'good' },
    { item: 'Extensions Cils', stock: 28, minStock: 30, status: 'low' },
    { item: 'Rajouts Cheveux', stock: 15, minStock: 20, status: 'critical' },
    { item: 'Produits Maquillage', stock: 60, minStock: 40, status: 'good' }
  ];

  return (
    <div className="min-h-screen py-24 bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">
              Tableau de Bord Admin
            </h1>
            <p className="text-xl text-gray-600">
              Vue d'ensemble de Beauty Nails
            </p>
          </div>

          {/* Notification Bell */}
          <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full w-12 h-12 border-2"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  4
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <div className="p-6">
                <NotificationCenter />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                <p className="text-3xl text-gray-900">{stats.totalClients}</p>
                <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Employées Actives</p>
                <p className="text-3xl text-gray-900">{stats.activeWorkers}</p>
                <p className="text-xs text-gray-500 mt-1">Staff complet</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus Aujourd'hui</p>
                <p className="text-2xl text-gray-900">{stats.todayRevenue}</p>
                <p className="text-xs text-green-600 mt-1">+8% vs hier</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">RDV Aujourd'hui</p>
                <p className="text-3xl text-gray-900">{stats.todayAppointments}</p>
                <p className="text-xs text-gray-500 mt-1">Taux remplissage: 89%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-pink-50 to-rose-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus Mensuel</p>
                <p className="text-2xl text-gray-900">{stats.monthlyRevenue}</p>
                <p className="text-xs text-green-600 mt-1">+15% vs mois dernier</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-400 to-rose-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-yellow-50 to-amber-50 border-0 shadow-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note Moyenne</p>
                <p className="text-3xl text-gray-900">{stats.avgRating}/5</p>
                <p className="text-xs text-gray-500 mt-1">247 avis</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-amber-400 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl flex-wrap gap-1">
            <TabsTrigger value="today" className="rounded-lg px-3 py-2 text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Aujourd'hui
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-lg px-3 py-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg px-3 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="clients" className="rounded-lg px-3 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="workers" className="rounded-lg px-3 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg px-3 py-2 text-sm">
              <Scissors className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg px-3 py-2 text-sm">
              <Package className="w-4 h-4 mr-2" />
              Inventaire
            </TabsTrigger>
            <TabsTrigger value="pos" className="rounded-lg px-3 py-2 text-sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Caisse
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg px-3 py-2 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Rapports
            </TabsTrigger>
            <TabsTrigger value="marketing" className="rounded-lg px-3 py-2 text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-3 py-2 text-sm">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Today's Overview Tab */}
          <TabsContent value="today">
            <TodayOverview />
          </TabsContent>

          {/* Calendar/Booking Tab */}
          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServiceManagement />
          </TabsContent>

          {/* POS Tab */}
          <TabsContent value="pos">
            <POSCheckout />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <MarketingLoyalty />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl text-gray-900 mb-6">Revenus Mensuels</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="border-0 shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl text-gray-900 mb-6">Distribution des Services</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers">
            <StaffManagement />
          </TabsContent>



          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
