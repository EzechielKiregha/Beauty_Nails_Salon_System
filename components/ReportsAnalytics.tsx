import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download, Calendar, DollarSign, Users, Award, Clock, Target } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchRevenueReport = async (period: string) => {
//   const response = await axios.get(`/api/reports/revenue?period=${period}`);
//   return response.data;
// };
// const fetchClientAnalytics = async (period: string) => {
//   const response = await axios.get(`/api/reports/clients?period=${period}`);
//   return response.data;
// };
// const generateCustomReport = async (filters: any) => {
//   const response = await axios.post('/api/reports/custom', filters);
//   return response.data;
// };

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState('month');

  // Mock data
  const revenueData = [
    { month: 'Juin', revenue: 22000000, target: 20000000, appointments: 180 },
    { month: 'Juillet', revenue: 25000000, target: 22000000, appointments: 205 },
    { month: 'Août', revenue: 23500000, target: 23000000, appointments: 192 },
    { month: 'Septembre', revenue: 27000000, target: 24000000, appointments: 225 },
    { month: 'Octobre', revenue: 28500000, target: 25000000, appointments: 240 },
    { month: 'Novembre', revenue: 30200000, target: 26000000, appointments: 258 }
  ];

  const servicePerformance = [
    { service: 'Onglerie', revenue: 13500000, count: 450, avgPrice: 30000, growth: '+15%' },
    { service: 'Cils', revenue: 9800000, count: 218, avgPrice: 45000, growth: '+22%' },
    { service: 'Tresses', revenue: 4200000, count: 84, avgPrice: 50000, growth: '+8%' },
    { service: 'Maquillage', revenue: 2700000, count: 68, avgPrice: 40000, growth: '+12%' }
  ];

  const clientFrequency = [
    { frequency: '1 visite', clients: 98, percentage: 40 },
    { frequency: '2-3 visites', clients: 75, percentage: 30 },
    { frequency: '4-6 visites', clients: 49, percentage: 20 },
    { frequency: '7+ visites', clients: 25, percentage: 10 }
  ];

  const staffUtilization = [
    { name: 'Marie Nkumu', utilization: 92, appointments: 62, revenue: 930000 },
    { name: 'Grace Lumière', utilization: 88, appointments: 58, revenue: 870000 },
    { name: 'Sophie Kabila', utilization: 78, appointments: 48, revenue: 720000 },
    { name: 'Élise Makala', utilization: 72, appointments: 38, revenue: 570000 },
    { name: 'Patricia Kala', utilization: 85, appointments: 52, revenue: 780000 },
    { name: 'Joséphine Nzuzi', utilization: 80, appointments: 46, revenue: 690000 }
  ];

  const peakHours = [
    { hour: '08:00', bookings: 8 },
    { hour: '09:00', bookings: 22 },
    { hour: '10:00', bookings: 35 },
    { hour: '11:00', bookings: 42 },
    { hour: '12:00', bookings: 28 },
    { hour: '13:00', bookings: 18 },
    { hour: '14:00', bookings: 32 },
    { hour: '15:00', bookings: 45 },
    { hour: '16:00', bookings: 38 },
    { hour: '17:00', bookings: 30 },
    { hour: '18:00', bookings: 15 }
  ];

  const membershipAnalytics = {
    totalMembers: 247,
    vip: 45,
    premium: 87,
    regular: 115,
    memberRevenue: 18500000,
    nonMemberRevenue: 11700000,
    averageMemberSpend: 75000,
    averageNonMemberSpend: 35000
  };

  const marketingCampaigns = [
    { name: 'Promo Novembre', conversions: 23, revenue: 690000, roi: '340%' },
    { name: 'SMS Rappels', conversions: 12, revenue: 360000, roi: '280%' },
    { name: 'Email Anniversaires', conversions: 8, revenue: 240000, roi: '400%' },
    { name: 'Parrainage', conversions: 15, revenue: 450000, roi: '∞' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Rapports & Analyses</h2>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette Semaine</SelectItem>
              <SelectItem value="month">Ce Mois</SelectItem>
              <SelectItem value="quarter">Ce Trimestre</SelectItem>
              <SelectItem value="year">Cette Année</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Revenus Mensuels</p>
          <p className="text-3xl text-gray-900">30,2M CDF</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600">+16% vs objectif</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg p-6">
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Rendez-vous</p>
          <p className="text-3xl text-gray-900">258</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-600">+7.5% vs oct</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6">
          <Users className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Nouvelles Clientes</p>
          <p className="text-3xl text-gray-900">32</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-purple-600">+18% ce mois</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg p-6">
          <Award className="w-8 h-8 text-amber-600 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Rétention</p>
          <p className="text-3xl text-gray-900">87%</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-amber-600">+3% vs oct</p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="revenue" className="rounded-lg">Revenus</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
          <TabsTrigger value="clients" className="rounded-lg">Clientes</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-lg">Personnel</TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-lg">Marketing</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <h3 className="text-xl text-gray-900 mb-6">Évolution des Revenus</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenus Réels" />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Objectif" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <h3 className="text-xl text-gray-900 mb-6">Rendez-vous par Mois</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#ec4899" radius={[8, 8, 0, 0]} name="Rendez-vous" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2">
              <h3 className="text-xl text-gray-900 mb-6">Heures de Pointe</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Réservations" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                💡 Heures de pointe: 15:00-16:00 (45 réservations) • Heures creuses: 13:00-14:00 (18 réservations)
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl text-gray-900 mb-6">Performance des Services</h3>
            <div className="space-y-4">
              {servicePerformance.map((service, idx) => (
                <Card key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg text-gray-900">{service.service}</h4>
                    <Badge className="bg-green-500 text-white">
                      {service.growth}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Revenus</p>
                      <p className="text-xl text-gray-900">
                        {(service.revenue / 1000000).toFixed(1)}M CDF
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Réservations</p>
                      <p className="text-xl text-gray-900">{service.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Prix Moyen</p>
                      <p className="text-xl text-gray-900">
                        {(service.avgPrice / 1000).toFixed(0)}K CDF
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${(service.revenue / 13500000) * 100}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <h3 className="text-xl text-gray-900 mb-6">Fréquence des Visites</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientFrequency}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.frequency}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="clients"
                  >
                    {clientFrequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ec4899', '#a855f7', '#f59e0b', '#10b981'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <h3 className="text-xl text-gray-900 mb-6">Analyse Membres vs Non-Membres</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 p-4">
                    <p className="text-sm text-gray-600 mb-1">Membres VIP</p>
                    <p className="text-3xl text-gray-900">{membershipAnalytics.vip}</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 p-4">
                    <p className="text-sm text-gray-600 mb-1">Membres Premium</p>
                    <p className="text-3xl text-gray-900">{membershipAnalytics.premium}</p>
                  </Card>
                </div>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 p-6">
                  <p className="text-sm text-gray-700 mb-3">Revenus Membres</p>
                  <p className="text-3xl text-gray-900 mb-2">
                    {(membershipAnalytics.memberRevenue / 1000000).toFixed(1)}M CDF
                  </p>
                  <p className="text-sm text-gray-600">
                    Dépense moyenne: {(membershipAnalytics.averageMemberSpend / 1000).toFixed(0)}K CDF
                  </p>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 p-6">
                  <p className="text-sm text-gray-700 mb-3">Revenus Non-Membres</p>
                  <p className="text-3xl text-gray-900 mb-2">
                    {(membershipAnalytics.nonMemberRevenue / 1000000).toFixed(1)}M CDF
                  </p>
                  <p className="text-sm text-gray-600">
                    Dépense moyenne: {(membershipAnalytics.averageNonMemberSpend / 1000).toFixed(0)}K CDF
                  </p>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 p-4">
                  <p className="text-sm text-gray-700">💡 Les membres dépensent 114% de plus que les non-membres!</p>
                </Card>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl text-gray-900 mb-6">Taux d'Utilisation du Personnel</h3>
            <div className="space-y-4">
              {staffUtilization.map((staff, idx) => (
                <Card key={idx} className="bg-gray-50 border-0 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg text-gray-900">{staff.name}</p>
                      <p className="text-sm text-gray-600">{staff.appointments} rendez-vous</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">{staff.utilization}%</p>
                      <p className="text-sm text-gray-600">Utilisation</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className={`h-3 rounded-full ${staff.utilization >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        staff.utilization >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                      style={{ width: `${staff.utilization}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenus générés:</span>
                    <span className="text-gray-900">{(staff.revenue / 1000).toFixed(0)}K CDF</span>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <h4 className="text-lg text-gray-900 mb-2">Statistiques Moyennes</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl text-gray-900">82.5%</p>
                  <p className="text-sm text-gray-600">Taux Moyen</p>
                </div>
                <div>
                  <p className="text-3xl text-gray-900">50.7</p>
                  <p className="text-sm text-gray-600">RDV/Mois</p>
                </div>
                <div>
                  <p className="text-2xl text-gray-900">760K CDF</p>
                  <p className="text-sm text-gray-600">Revenus/Mois</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl text-gray-900 mb-6">Performance des Campagnes Marketing</h3>
            <div className="space-y-4">
              {marketingCampaigns.map((campaign, idx) => (
                <Card key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{campaign.conversions} conversions</p>
                    </div>
                    <Badge className="bg-green-600 text-white px-4 py-2">
                      ROI: {campaign.roi}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Revenus générés:</span>
                    </div>
                    <span className="text-xl text-gray-900">{(campaign.revenue / 1000).toFixed(0)}K CDF</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">Total Conversions</p>
                <p className="text-3xl text-gray-900">58</p>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">Total Revenus Marketing</p>
                <p className="text-2xl text-gray-900">1,74M CDF</p>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">ROI Moyen</p>
                <p className="text-3xl text-green-600">355%</p>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Report Generator */}
      <Card className="border-0 shadow-lg rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-indigo-600" />
          <div>
            <h3 className="text-2xl text-gray-900">Générateur de Rapport Personnalisé</h3>
            <p className="text-sm text-gray-600">Créez des rapports sur mesure selon vos besoins</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="rounded-full">
            📊 Rapport Financier
          </Button>
          <Button variant="outline" className="rounded-full">
            👥 Analyse Clientes
          </Button>
          <Button variant="outline" className="rounded-full">
            ⭐ Performance Personnel
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
            + Rapport Personnalisé
          </Button>
        </div>
      </Card>
    </div>
  );
}
