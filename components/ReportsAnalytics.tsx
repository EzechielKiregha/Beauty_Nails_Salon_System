// reports/ReportAnalysis.tsx
"use client"

import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download, Calendar, DollarSign, Users, Award, Clock, Target, Loader2 } from 'lucide-react';
import { useRevenueReport, useClientAnalytics, useServicePerformance, useStaffReport, usePeakHours, useMembershipAnalytics, useMarketingCampaigns, useDownloadPdf } from '../lib/hooks/useReports';

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState('month');
  const [isDownloading, setIsDownloading] = useState(false);

  // derive from/to ISO strings from the selected period
  const { from, to } = useMemo(() => {
    const getPeriodRange = (p: string) => {
      const now = new Date();
      const to = now.toISOString();
      let fromDate = new Date();
      switch (p) {
        case 'week':
          fromDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          fromDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          fromDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          fromDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          fromDate.setMonth(now.getMonth() - 1);
      }
      return { from: fromDate.toISOString(), to };
    };
    return getPeriodRange(period);
  }, [period]); // Only recalculate when period changes

  // Memoize the params object to prevent unnecessary re-renders
  const revenueParams = useMemo(() => ({ from, to }), [from, to]);
  const staffParams = useMemo(() => ({ from, to }), [from, to]);
  const peakHoursParams = useMemo(() => ({ from, to }), [from, to]);
  const membershipParams = useMemo(() => ({ from, to }), [from, to]);
  const marketingParams = useMemo(() => ({ from, to }), [from, to]);

  // Hooks to fetch real data - using memoized params
  const { data: revenueReport, isLoading: revenueLoading } = useRevenueReport(revenueParams);
  const { data: servicesResp, isLoading: servicesLoading } = useServicePerformance(period);
  const { data: clientsResp, isLoading: clientsLoading } = useClientAnalytics(period);

  // Process revenue data
  const revenueSeries = useMemo(() => {
    if (!revenueReport) return [];
    // For demonstration, we'll create a simple series from the breakdown
    // In real implementation, you'd transform the data appropriately
    const breakdown = revenueReport.breakdown;
    return Object.entries(breakdown).map(([k, v]) => ({
      month: k,
      revenue: v,
      target: v * 1.1, // Example target
      appointments: Math.floor(v / 100000) // Example appointment count
    }));
  }, [revenueReport]);

  const services = (servicesResp as any)?.services ?? [];

  // Process client frequency data
  const clientFrequency = useMemo(() => {
    if (!clientsResp || !clientsResp.totalClients) return [];
    const total = clientsResp.totalClients || 0;
    const newClients = clientsResp.newClients || 0;
    const retainedPct = Math.round(clientsResp.retentionRate || 0);
    const retained = Math.round((retainedPct / 100) * total);
    const others = Math.max(0, total - newClients - retained);
    return [
      { frequency: 'Nouveaux', clients: newClients, percentage: Math.round((newClients / total) * 100) },
      { frequency: 'Retenus', clients: retained, percentage: retainedPct },
      { frequency: 'Autres', clients: others, percentage: Math.max(0, 100 - Math.round((newClients / total) * 100) - retainedPct) }
    ];
  }, [clientsResp]);

  // Reports from API: staff, peak hours, membership, marketing - using memoized params
  const { data: staffResp, isLoading: staffLoading } = useStaffReport(staffParams);
  const { data: peakResp, isLoading: peakLoading } = usePeakHours(peakHoursParams);
  const { data: membershipResp, isLoading: membershipLoading } = useMembershipAnalytics(membershipParams);
  const { data: marketingResp, isLoading: marketingLoading } = useMarketingCampaigns(marketingParams);

  const staffUtilization = (staffResp as any)?.workers ?? [];
  const peakHours = (peakResp as any)?.peakHours ?? [];
  const membershipAnalytics = (membershipResp ?? (clientsResp && {
    totalMembers: clientsResp.totalClients || 0,
    vip: 0,
    premium: 0,
    regular: 0,
    memberRevenue: (revenueReport as any)?.totalRevenue ?? 0,
    nonMemberRevenue: (revenueReport as any)?.totalRevenue ?? 0,
    averageMemberSpend: 0,
    averageNonMemberSpend: 0,
  })) || { totalMembers: 0, vip: 0, premium: 0, regular: 0, memberRevenue: 0, nonMemberRevenue: 0, averageMemberSpend: 0, averageNonMemberSpend: 0 };

  const marketingCampaigns = (marketingResp as any)?.campaigns ?? [];

  // Hook for PDF downloads
  const downloadPdf = useDownloadPdf();

  const handlePdfDownload = (reportType: string) => {
    setIsDownloading(true);
    downloadPdf.mutate(
      { reportType, params: { from, to } },
      {
        onSuccess: () => setIsDownloading(false),
        onError: () => setIsDownloading(false)
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl  sm:text-3xl  text-gray-900 dark:text-gray-100">Rapports & Analyses</h2>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-40 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="week">Cette Semaine</SelectItem>
              <SelectItem value="month">Ce Mois</SelectItem>
              <SelectItem value="quarter">Ce Trimestre</SelectItem>
              <SelectItem value="year">Cette Année</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handlePdfDownload('revenue')}
            disabled={isDownloading || revenueLoading}
            className="flex-1 sm:flex-none bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full transition-all"
          >
            {isDownloading ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenus Mensuels</p>
          <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
            {revenueReport ? `${(revenueReport.totalRevenue / 1000000).toFixed(1)}M Fc` : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {revenueReport ? `+16% vs objectif` : '...'}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rendez-vous</p>
          <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
            {revenueReport ? revenueReport.salesCount : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {revenueReport ? `+7.5% vs période précédente` : '...'}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nouvelles Clientes</p>
          <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
            {clientsResp ? clientsResp.newClients : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              {clientsResp ? `+18% ce mois` : '...'}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rétention</p>
          <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100">
            {clientsResp ? `${Math.round(clientsResp.retentionRate)}%` : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              {clientsResp ? `+3% vs période précédente` : '...'}
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6  bg-white dark:bg-gray-950 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl justify-start sm:justify-center ">
          <TabsTrigger value="revenue" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Revenus</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Services</TabsTrigger>
          <TabsTrigger value="clients" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Clientes</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Personnel</TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Marketing</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <h3 className="text-lg sm:text-xl  text-gray-900 dark:text-gray-100 mb-6">Évolution des Revenus</h3>
              <div className="h-[300px] w-full">
                {revenueLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500"><Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" /></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Revenus Réels" />
                      <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Objectif" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <h3 className="text-lg sm:text-xl  text-gray-900 dark:text-gray-100 mb-6">Rendez-vous par Mois</h3>
              <div className="h-[300px] w-full">
                {revenueLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500"><Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" /></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="appointments" fill="#ec4899" radius={[6, 6, 0, 0]} name="Rendez-vous" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 lg:col-span-2">
              <h3 className="text-lg sm:text-xl  text-gray-900 dark:text-gray-100 mb-6">Heures de Pointe</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Réservations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center italic">
                💡 Heures de pointe: {peakHours.length > 0 ? `${peakHours[0].hour} (${peakHours[0].bookings} réservations)` : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />} • Heures creuses: {peakHours.length > 1 ? `${peakHours[peakHours.length - 1].hour} (${peakHours[peakHours.length - 1].bookings} réservations)` : <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />}
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
            <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100 mb-6">Performance des Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesLoading ? (
                <div className="p-6 text-gray-500"><Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" /></div>
              ) : (
                services.map((service: any, idx: any) => (
                  <Card key={idx} className="p-5 sm:p-6 border border-pink-50 dark:border-pink-900/30 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{service.name}</h4>
                      <Badge className="bg-green-500 dark:bg-green-600 text-white border-0">
                        {service.growth || '0%'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Revenus</p>
                        <p className="text-sm sm:text-lg  text-gray-900 dark:text-gray-100">
                          {service.revenue ? `${(service.revenue / 1000000).toFixed(1)}M Fc` : '0M Fc'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Réservations</p>
                        <p className="text-sm sm:text-lg  text-gray-900 dark:text-gray-100">{service.count || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Prix Moyen</p>
                        <p className="text-sm sm:text-lg  text-gray-900 dark:text-gray-100">
                          {service.avgPrice ? `${(service.avgPrice / 1000).toFixed(0)}K Fc` : '0K Fc'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-5">
                      <div
                        className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                        style={{ width: `${(service.revenue / 13500000) * 100}%` }}
                      />
                    </div>
                  </Card>
                )))}
            </div>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <h3 className="text-lg sm:text-xl  text-gray-900 dark:text-gray-100 mb-6">Fréquence des Visites</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
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
              </div>
            </Card>

            <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
              <h3 className="text-lg sm:text-xl  text-gray-900 dark:text-gray-100 mb-6">Analyse Membres vs Non-Membres</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Membres VIP</p>
                    <p className="text-2xl  text-gray-900 dark:text-gray-100">{membershipAnalytics.vip}</p>
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Membres Premium</p>
                    <p className="text-2xl  text-gray-900 dark:text-gray-100">{membershipAnalytics.premium}</p>
                  </div>
                </div>

                <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Revenus Membres</p>
                  <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100 mb-2">
                    {(membershipAnalytics.memberRevenue / 1000000).toFixed(1)}M Fc
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Dépense moyenne: <span className="">{(membershipAnalytics.averageMemberSpend / 1000).toFixed(0)}K Fc</span>
                  </p>
                </div>

                <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Revenus Non-Membres</p>
                  <p className="text-2xl sm:text-3xl  text-gray-900 dark:text-gray-100 mb-2">
                    {(membershipAnalytics.nonMemberRevenue / 1000000).toFixed(1)}M Fc
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Dépense moyenne: <span className="">{(membershipAnalytics.averageNonMemberSpend / 1000).toFixed(0)}K Fc</span>
                  </p>
                </div>

                <div className="bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-900/30 flex items-center gap-3">
                  <span className="text-xl">💡</span>
                  <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Les membres dépensent <span className="text-lg ">{membershipAnalytics.averageMemberSpend > 0 ? Math.round((membershipAnalytics.averageMemberSpend / Math.max(1, membershipAnalytics.averageNonMemberSpend)) * 100) : 0}%</span> de plus que les non-membres!</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
            <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100 mb-6">Taux d'Utilisation du Personnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffLoading ? (
                <div className="p-6 text-gray-500"><Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" /></div>
              ) : (
                staffUtilization.map((staff: any, idx: any) => (
                  <Card key={idx} className="p-5 sm:p-6 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg  text-gray-900 dark:text-gray-100">{staff.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{staff.completedAppointments || 0} rendez-vous</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl  text-pink-600 dark:text-pink-400">{staff.utilization || 0}%</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Utilisation</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full shadow-sm ${staff.utilization >= 85 ? 'bg-linear-to-r from-green-500 to-emerald-500' :
                          staff.utilization >= 75 ? 'bg-linear-to-r from-blue-500 to-cyan-500' :
                            'bg-linear-to-r from-amber-500 to-orange-500'
                          }`}
                        style={{ width: `${staff.utilization}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Revenus générés:</span>
                      <span className=" text-gray-900 dark:text-gray-100">{(staff.totalRevenue / 1000).toFixed(0)}K Fc</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
            <div className="mt-8 p-6 sm:p-8 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-lg  text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Statistiques Moyennes du Mois
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-3xl  text-blue-600 dark:text-blue-400">{staffUtilization.length > 0 ? Math.round(staffUtilization.reduce((sum: any, s: any) => sum + (s.utilization || 0), 0) / staffUtilization.length) : 0}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mt-1 tracking-wider">Taux Moyen</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-3xl  text-blue-600 dark:text-blue-400">{staffUtilization.length > 0 ? Math.round(staffUtilization.reduce((sum: any, s: any) => sum + (s.completedAppointments || 0), 0) / staffUtilization.length) : 0}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mt-1 tracking-wider">RDV / Staff</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-2xl  text-blue-600 dark:text-blue-400">
                    {staffUtilization.length > 0 ? Math.round(staffUtilization.reduce((sum: any, s: any) => sum + (s.totalRevenue || 0), 0) / staffUtilization.length / 1000) : 0}K Fc
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase mt-1 tracking-wider">Revenus / Staff</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
            <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100 mb-6">Performance des Campagnes Marketing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketingLoading ? (
                <div className="p-6 text-gray-500"><Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" /></div>
              ) : (
                marketingCampaigns.map((campaign: any, idx: any) => (
                  <Card key={idx} className="p-5 sm:p-6 border border-green-50 dark:border-green-900/30 bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg  text-gray-900 dark:text-gray-100">{campaign.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.conversions || 0} conversions</p>
                      </div>
                      <Badge className="bg-green-600 text-white px-4 py-2">
                        ROI: {campaign.revenue ? Math.round((campaign.revenue / (campaign.cost || 1)) * 100) : 0}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Revenus générés:</span>
                      </div>
                      <span className="text-xl text-gray-900">{(campaign.revenue / 1000).toFixed(0)}K Fc</span>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-900/30 p-6 rounded-xl">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Conversions</p>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100">
                  {marketingCampaigns.reduce((sum: any, camp: any) => sum + (camp.conversions || 0), 0)}
                </p>
              </Card>
              <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenus Marketing</p>
                <p className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  {(marketingCampaigns.reduce((sum: any, camp: any) => sum + (camp.revenue || 0), 0) / 1000000).toFixed(1)}M Fc
                </p>
              </Card>
              <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/30 p-6 rounded-xl">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">ROI Moyen</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {marketingCampaigns.length > 0 ?
                    Math.round(marketingCampaigns.reduce((sum: any, camp: any) => sum + (Math.round((camp.revenue / (camp.cost || 1)) * 100) || 0), 0) / marketingCampaigns.length) : 0}%
                </p>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Report Generator */}
      <Card className="border border-indigo-100 dark:border-indigo-900/50 shadow-xl rounded-2xl p-6 sm:p-10 bg-linear-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 text-center sm:text-left">
          <div className="w-16 h-16 bg-white dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Target className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Générateur de Rapport Personnalisé</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Créez des rapports sur mesure selon vos indicateurs clés de performance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="rounded-full py-7  border-indigo-100 dark:border-indigo-900 dark:text-gray-300 dark:hover:bg-indigo-900/20 bg-white dark:bg-gray-900/50">
            📊 Financier
          </Button>
          <Button variant="outline" className="rounded-full py-7  border-indigo-100 dark:border-indigo-900 dark:text-gray-300 dark:hover:bg-indigo-900/20 bg-white dark:bg-gray-900/50">
            👥 Clientes
          </Button>
          <Button variant="outline" className="rounded-full py-7  border-indigo-100 dark:border-indigo-900 dark:text-gray-300 dark:hover:bg-indigo-900/20 bg-white dark:bg-gray-900/50">
            ⭐ Personnel
          </Button>
          <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full py-7 font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            + Nouveau Rapport
          </Button>
        </div>
      </Card>
    </div>
  );
}