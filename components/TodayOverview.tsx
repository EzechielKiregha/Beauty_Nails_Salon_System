import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, DollarSign, Users, AlertCircle, UserCheck, Activity, Plus, CreditCard, Package } from 'lucide-react';
import { useAppointments } from '@/lib/hooks/useAppointments';
import { useRevenueReport, useServicePerformance } from '@/lib/hooks/useReports';
import { useStaff } from '@/lib/hooks/useStaff';
import { useInventory } from '@/lib/hooks/useInventory';


export default function TodayOverview({ showMock }: { showMock?: boolean }) {
  const today = new Date().toISOString().split('T')[0];

  // Hooks
  const { appointments: apiAppointments = [] } = useAppointments({ date: today });
  const { data: revenueData } = useRevenueReport({ from: today, to: today });
  const { staff: apiStaff = [] } = useStaff();
  const { inventory: apiInventory = [] } = useInventory();
  const { data: servicePerformance } = useServicePerformance('daily');

  // Local mocks (used only when showMock=true)
  const MOCK_STATS = {
    upcomingAppointments: 8,
    completedAppointments: 12,
    walkInAvailable: true,
    currentOccupancy: 75,
    dailyRevenue: 1250000,
    clientsServed: 12,
    staffOnDuty: 6,
    averageWaitTime: 15,
  };

  const MOCK_UPCOMING = [
    { time: '14:00', client: 'Marie Kabila', service: 'Manucure Gel', staff: 'Marie N.', duration: 60 },
    { time: '14:30', client: 'Grace Lumière', service: 'Extensions Cils', staff: 'Grace L.', duration: 90 },
    { time: '15:00', client: 'Sophie Makala', service: 'Tresses', staff: 'Sophie K.', duration: 120 },
    { time: '15:30', client: 'Élise Nkumu', service: 'Maquillage', staff: 'Élise M.', duration: 45 }
  ];

  const MOCK_STAFF = [
    { name: 'Marie Nkumu', status: 'busy', currentClient: 'Rose Mbala', service: 'Manucure', nextAvailable: '14:00' },
    { name: 'Grace Lumière', status: 'busy', currentClient: 'Annie Bokele', service: 'Extension Cils', nextAvailable: '15:00' },
    { name: 'Sophie Kabila', status: 'available', currentClient: null, service: null, nextAvailable: 'Maintenant' },
    { name: 'Élise Makala', status: 'break', currentClient: null, service: null, nextAvailable: '13:30' }
  ];

  // Compose data using API first; fall back to mocks only if showMock is true
  const upcomingAppointments = (apiAppointments && apiAppointments.length > 0)
    ? apiAppointments.map((apt: any) => ({
      time: apt.time || apt.startTime || new Date(apt.startsAt || apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      client: apt.client?.name || apt.client?.user?.name || apt.clientName || (typeof apt.client === 'string' ? apt.client : 'Client'),
      service: apt.service?.name || apt.serviceName || (typeof apt.service === 'string' ? apt.service : 'Service'),
      staff: apt.staff?.name || apt.staff?.user?.name || apt.staffName || (typeof apt.staff === 'string' ? apt.staff : 'Staff'),
      duration: apt.duration || 60,
    }))
    : (showMock ? MOCK_UPCOMING : []);

  const staffRoster = (apiStaff && apiStaff.length > 0)
    ? apiStaff.map((s: any) => ({ name: s.name || s.fullName || 'Employé', status: s.isAvailable ? 'available' : 'busy', currentClient: null, service: null, nextAvailable: 'Maintenant' }))
    : (showMock ? MOCK_STAFF : []);

  const urgentAlerts = [] as any[];
  const lowStock = (apiInventory || []).filter((i: any) => i.status === 'low' || i.status === 'critical' || i.status === 'out');
  if (lowStock.length > 0) urgentAlerts.push({ type: 'stock', message: `${lowStock.length} article(s) avec stock bas`, priority: 'high', icon: Package });

  const popularServices = (servicePerformance && servicePerformance.services && servicePerformance.services.length > 0)
    ? servicePerformance.services.slice(0, 4).map((s: any) => ({ name: s.name, count: s.count || 0, revenue: `${(s.revenue || 0).toLocaleString()} Fc` }))
    : (showMock ? [{ name: 'Manucure Gel', count: 8, revenue: '240 000 Fc' }] : []);

  const todayStats = {
    upcomingAppointments: upcomingAppointments.length,
    completedAppointments: apiAppointments ? apiAppointments.filter((a: any) => a.status === 'completed').length : (showMock ? MOCK_STATS.completedAppointments : 0),
    walkInAvailable: showMock ? MOCK_STATS.walkInAvailable : false,
    currentOccupancy: showMock ? MOCK_STATS.currentOccupancy : Math.round((staffRoster.filter(s => s.status === 'busy').length / Math.max(1, staffRoster.length)) * 100),
    dailyRevenue: revenueData?.totalRevenue ?? (showMock ? MOCK_STATS.dailyRevenue : 0),
    clientsServed: apiAppointments ? apiAppointments.length : (showMock ? MOCK_STATS.clientsServed : 0),
    staffOnDuty: staffRoster.length,
    averageWaitTime: showMock ? MOCK_STATS.averageWaitTime : 0,
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-0 shadow-lg p-5 sm:p-6 transition-all duration-300 hover:shadow-xl dark:border dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">RDV Aujourd'hui</p>
              <p className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 font-black">{todayStats.upcomingAppointments}</p>
              <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-1 font-bold">+ {todayStats.completedAppointments} complétés</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg p-5 sm:p-6 transition-all duration-300 hover:shadow-xl dark:border dark:border-green-900/30">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Revenus du Jour</p>
              <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 font-black">{todayStats.dailyRevenue.toLocaleString()} Fc</p>
              <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-1 font-bold">+8% vs hier</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-lg p-5 sm:p-6 transition-all duration-300 hover:shadow-xl dark:border dark:border-pink-900/30">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Clientes Servies</p>
              <p className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 font-black">{todayStats.clientsServed}</p>
              <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-1 font-bold">En cours: 3</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className={`border-0 shadow-lg p-5 sm:p-6 transition-all duration-300 hover:shadow-xl dark:border ${todayStats.walkInAvailable
          ? 'bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-900/30'
          : 'bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-900/30'
          }`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Sans RDV</p>
              <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 font-black">
                {todayStats.walkInAvailable ? 'Disponible' : 'Complet'}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1 font-bold italic">Attente: ~{todayStats.averageWaitTime} min</p>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg ${todayStats.walkInAvailable
              ? 'bg-linear-to-br from-amber-400 to-orange-400 shadow-amber-500/30'
              : 'bg-linear-to-br from-red-400 to-pink-400 shadow-red-500/30'
              }`}>
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Current Occupancy */}
      <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900 dark:border dark:border-pink-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold">Occupation Actuelle</h3>
          </div>
          <Badge className={`${todayStats.currentOccupancy >= 80 ? 'bg-red-500 dark:bg-red-900/40 text-white dark:text-red-200' :
            todayStats.currentOccupancy >= 60 ? 'bg-amber-500 dark:bg-amber-900/40 text-white dark:text-amber-200' : 'bg-green-500 dark:bg-green-900/40 text-white dark:text-green-200'
            } border-0 px-4 py-2 text-xs sm:text-sm font-bold`}>
            {todayStats.currentOccupancy}% Occupé
          </Badge>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 sm:h-4 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${todayStats.currentOccupancy >= 80 ? 'bg-linear-to-r from-red-500 to-pink-500' :
              todayStats.currentOccupancy >= 60 ? 'bg-linear-to-r from-amber-500 to-orange-500' :
                'bg-linear-to-r from-green-500 to-emerald-500'
              }`}
            style={{ width: `${todayStats.currentOccupancy}%` }}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
          <span className="text-gray-900 dark:text-gray-200 font-bold">{staffRoster.filter(s => s.status === 'busy').length}</span> employées occupées • {' '}
          <span className="text-gray-900 dark:text-gray-200 font-bold">{staffRoster.filter(s => s.status === 'available').length}</span> disponibles
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 lg:col-span-2 bg-white dark:bg-gray-900 dark:border dark:border-pink-900/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold">Prochains Rendez-vous</h3>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-linear-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl border border-pink-100/50 dark:border-pink-900/20">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                      <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 font-black">{apt.time}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{apt.duration} min</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-bold truncate">{apt.client}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{apt.service}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-pink-200 dark:bg-pink-800/30" />
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-1">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">avec <span className="font-bold">{apt.staff}</span></p>
                    <Badge className="bg-blue-500 dark:bg-blue-900/40 text-white dark:text-blue-200 border-0 text-[10px] sm:text-xs font-black">Confirmé</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                Aucun rendez-vous à venir pour aujourd'hui
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900 dark:border dark:border-pink-900/30">
          <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold mb-6">Actions Rapides</h3>
          <div className="space-y-3">
            <Button className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6 justify-start px-6 font-bold shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02]">
              <Plus className="w-5 h-5 mr-3" />
              Nouveau Rendez-vous
            </Button>
            <Button className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full py-6 justify-start px-6 font-bold shadow-lg shadow-green-500/25 transition-all hover:scale-[1.02]">
              <CreditCard className="w-5 h-5 mr-3" />
              Encaisser Cliente
            </Button>
            <Button className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-6 justify-start px-6 font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]">
              <Package className="w-5 h-5 mr-3" />
              Ajouter Stock
            </Button>
            <Button variant="outline" className="w-full rounded-full py-6 justify-start px-6 font-bold dark:border-gray-700 dark:hover:bg-gray-800 transition-all hover:scale-[1.02]">
              <Users className="w-5 h-5 mr-3 text-purple-500" />
              Nouvelle Cliente
            </Button>
            <Button variant="outline" className="w-full rounded-full py-6 justify-start px-6 font-bold dark:border-gray-700 dark:hover:bg-gray-800 transition-all hover:scale-[1.02]">
              <Clock className="w-5 h-5 mr-3 text-blue-500" />
              Voir Planning
            </Button>
          </div>
        </Card>
      </div>

      {/* Staff Roster */}
      <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900 dark:border dark:border-pink-900/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold">Personnel Aujourd'hui</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffRoster.map((staff, idx) => (
            <Card key={idx} className={`p-4 border-2 transition-all duration-300 ${staff.status === 'busy' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30' :
              staff.status === 'available' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' :
                'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-base text-gray-900 dark:text-gray-100 font-bold">{staff.name}</p>
                <Badge className={`${staff.status === 'busy' ? 'bg-blue-500 dark:bg-blue-900/40 text-white dark:text-blue-200' :
                  staff.status === 'available' ? 'bg-green-500 dark:bg-green-900/40 text-white dark:text-green-200' : 'bg-amber-500 dark:bg-amber-900/40 text-white dark:text-amber-200'
                  } border-0 text-[10px] sm:text-xs font-black`}>
                  {staff.status === 'busy' ? 'Occupée' :
                    staff.status === 'available' ? 'Disponible' : 'Pause'}
                </Badge>
              </div>
              <div className="space-y-1.5 mb-4">
                {staff.currentClient ? (
                  <>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">Cliente: <span className="font-bold">{staff.currentClient}</span></p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 italic">{staff.service}</p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">Aucune cliente actuellement</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Clock className="w-3 h-3" />
                <span>Disponible: <span className="font-bold text-gray-700 dark:text-gray-300">{staff.nextAvailable}</span></span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 dark:border dark:border-red-900/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold">Alertes Urgentes</h3>
            <Badge className="bg-red-600 dark:bg-red-900/40 text-white dark:text-red-200 border-0 ml-auto px-3 font-black">{urgentAlerts.length}</Badge>
          </div>
          <div className="space-y-3">
            {urgentAlerts.map((alert, idx) => {
              const Icon = alert.icon;
              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-red-100 dark:border-red-900/20 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'
                      }`}>
                      <Icon className={`w-5 h-5 ${alert.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                        }`} />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-bold">{alert.message}</p>
                      <Badge className={`text-[10px] sm:text-xs mt-1 border-0 font-bold ${alert.priority === 'high' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                        {alert.priority === 'high' ? 'Urgent' : 'Attention'}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto rounded-full py-5 px-6 font-bold dark:border-gray-700 dark:hover:bg-gray-800">
                    Résoudre
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Popular Services Today */}
      <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-6 bg-white dark:bg-gray-900 dark:border dark:border-pink-900/30">
        <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-bold mb-6">Services Populaires Aujourd'hui</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((service, idx) => (
            <Card key={idx} className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-0 p-5 shadow-sm transition-all hover:scale-[1.03]">
              <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-bold mb-3 truncate">{service.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 font-black tracking-tight">{service.count}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Réservations</p>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-lg text-pink-600 dark:text-pink-400 font-black">{service.revenue}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Revenu</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
