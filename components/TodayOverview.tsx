import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, DollarSign, Users, AlertCircle, UserCheck, Activity, Plus, CreditCard, Package } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchTodayOverview = async () => {
//   const response = await axiosdb.get('/api/dashboard/today');
//   return response.data;
// };
// const updateOccupancy = async (status: string) => {
//   await axiosdb.patch('/api/salon/occupancy', { status });
// };

export default function TodayOverview() {
  // Mock data
  const todayStats = {
    upcomingAppointments: 8,
    completedAppointments: 12,
    walkInAvailable: true,
    currentOccupancy: 75, // percentage
    dailyRevenue: 1250000,
    clientsServed: 12,
    staffOnDuty: 6,
    averageWaitTime: 15 // minutes
  };

  const upcomingAppointments = [
    { time: '14:00', client: 'Marie Kabila', service: 'Manucure Gel', staff: 'Marie N.', duration: 60 },
    { time: '14:30', client: 'Grace Lumière', service: 'Extensions Cils', staff: 'Grace L.', duration: 90 },
    { time: '15:00', client: 'Sophie Makala', service: 'Tresses', staff: 'Sophie K.', duration: 120 },
    { time: '15:30', client: 'Élise Nkumu', service: 'Maquillage', staff: 'Élise M.', duration: 45 }
  ];

  const staffRoster = [
    { name: 'Marie Nkumu', status: 'busy', currentClient: 'Rose Mbala', service: 'Manucure', nextAvailable: '14:00' },
    { name: 'Grace Lumière', status: 'busy', currentClient: 'Annie Bokele', service: 'Extension Cils', nextAvailable: '15:00' },
    { name: 'Sophie Kabila', status: 'available', currentClient: null, service: null, nextAvailable: 'Maintenant' },
    { name: 'Élise Makala', status: 'break', currentClient: null, service: null, nextAvailable: '13:30' },
    { name: 'Patricia Kala', status: 'available', currentClient: null, service: null, nextAvailable: 'Maintenant' },
    { name: 'Joséphine Nzuzi', status: 'busy', currentClient: 'Claire Mukendi', service: 'Pédicure', nextAvailable: '13:45' }
  ];

  const urgentAlerts = [
    { type: 'stock', message: 'Colle Cils - Stock épuisé', priority: 'high', icon: Package },
    { type: 'appointment', message: '2 rendez-vous annulés aujourd\'hui', priority: 'medium', icon: Calendar },
    { type: 'payment', message: '3 factures impayées à relancer', priority: 'high', icon: CreditCard }
  ];

  const popularServices = [
    { name: 'Manucure Gel', count: 8, revenue: '240 000 CDF' },
    { name: 'Extension Cils', count: 6, revenue: '270 000 CDF' },
    { name: 'Tresses', count: 4, revenue: '200 000 CDF' },
    { name: 'Maquillage', count: 5, revenue: '200 000 CDF' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">RDV Aujourd'hui</p>
              <p className="text-3xl text-gray-900">{todayStats.upcomingAppointments}</p>
              <p className="text-xs text-blue-600 mt-1">+ {todayStats.completedAppointments} complétés</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus du Jour</p>
              <p className="text-2xl text-gray-900">{todayStats.dailyRevenue.toLocaleString()} CDF</p>
              <p className="text-xs text-green-600 mt-1">+8% vs hier</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes Servies</p>
              <p className="text-3xl text-gray-900">{todayStats.clientsServed}</p>
              <p className="text-xs text-gray-500 mt-1">En cours: 3</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className={`border-0 shadow-lg p-6 ${todayStats.walkInAvailable
          ? 'bg-gradient-to-br from-amber-50 to-orange-50'
          : 'bg-gradient-to-br from-red-50 to-pink-50'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sans RDV</p>
              <p className="text-2xl text-gray-900">
                {todayStats.walkInAvailable ? 'Disponible' : 'Complet'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Attente: ~{todayStats.averageWaitTime} min</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${todayStats.walkInAvailable
              ? 'bg-gradient-to-br from-amber-400 to-orange-400'
              : 'bg-gradient-to-br from-red-400 to-pink-400'
              }`}>
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Current Occupancy */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl text-gray-900">Occupation Actuelle</h3>
          </div>
          <Badge className={`${todayStats.currentOccupancy >= 80 ? 'bg-red-500' :
            todayStats.currentOccupancy >= 60 ? 'bg-amber-500' : 'bg-green-500'
            } text-white px-4 py-2`}>
            {todayStats.currentOccupancy}% Occupé
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${todayStats.currentOccupancy >= 80 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
              todayStats.currentOccupancy >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
            style={{ width: `${todayStats.currentOccupancy}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {staffRoster.filter(s => s.status === 'busy').length} employées occupées • {' '}
          {staffRoster.filter(s => s.status === 'available').length} disponibles
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-lg rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-pink-500" />
            Prochains Rendez-vous
          </h3>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                <div className="text-center min-w-[60px]">
                  <p className="text-lg text-gray-900">{apt.time}</p>
                  <p className="text-xs text-gray-600">{apt.duration}min</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex-1">
                  <p className="text-gray-900">{apt.client}</p>
                  <p className="text-sm text-gray-600">{apt.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">avec {apt.staff}</p>
                  <Badge className="bg-blue-500 text-white text-xs mt-1">Confirmé</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg rounded-2xl p-6">
          <h3 className="text-xl text-gray-900 mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Rendez-vous
            </Button>
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Encaisser Cliente
            </Button>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full justify-start">
              <Package className="w-4 h-4 mr-2" />
              Ajouter Stock
            </Button>
            <Button variant="outline" className="w-full rounded-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Nouvelle Cliente
            </Button>
            <Button variant="outline" className="w-full rounded-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Voir Planning
            </Button>
          </div>
        </Card>
      </div>

      {/* Staff Roster */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          Personnel Aujourd'hui
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffRoster.map((staff, idx) => (
            <Card key={idx} className={`p-4 border-2 ${staff.status === 'busy' ? 'bg-blue-50 border-blue-300' :
              staff.status === 'available' ? 'bg-green-50 border-green-300' :
                'bg-amber-50 border-amber-300'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-900">{staff.name}</p>
                <Badge className={`${staff.status === 'busy' ? 'bg-blue-500' :
                  staff.status === 'available' ? 'bg-green-500' : 'bg-amber-500'
                  } text-white`}>
                  {staff.status === 'busy' ? 'Occupée' :
                    staff.status === 'available' ? 'Disponible' : 'Pause'}
                </Badge>
              </div>
              {staff.currentClient ? (
                <>
                  <p className="text-sm text-gray-700">Cliente: {staff.currentClient}</p>
                  <p className="text-xs text-gray-600">{staff.service}</p>
                </>
              ) : (
                <p className="text-sm text-gray-600">Aucune cliente actuellement</p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                Disponible: {staff.nextAvailable}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <Card className="border-0 shadow-lg rounded-2xl p-6 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl text-gray-900">Alertes Urgentes</h3>
            <Badge className="bg-red-600 text-white ml-auto">{urgentAlerts.length}</Badge>
          </div>
          <div className="space-y-3">
            {urgentAlerts.map((alert, idx) => {
              const Icon = alert.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.priority === 'high' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                      <Icon className={`w-5 h-5 ${alert.priority === 'high' ? 'text-red-600' : 'text-amber-600'
                        }`} />
                    </div>
                    <div>
                      <p className="text-gray-900">{alert.message}</p>
                      <Badge className={`text-xs mt-1 ${alert.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        } text-white`}>
                        {alert.priority === 'high' ? 'Urgent' : 'Attention'}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Résoudre
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Popular Services Today */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <h3 className="text-xl text-gray-900 mb-4">Services Populaires Aujourd'hui</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((service, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 p-4">
              <p className="text-gray-900 mb-2">{service.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl text-gray-900">{service.count}</p>
                  <p className="text-xs text-gray-600">réservations</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-green-600">{service.revenue}</p>
                  <p className="text-xs text-gray-600">revenus</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
