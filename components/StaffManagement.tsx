"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar as CalendarIcon, Clock, DollarSign, Star, TrendingUp, Award, CheckCircle, AlertCircle, Users } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchStaff = async () => {
//   const response = await axiosdb.get('/api/staff');
//   return response.data;
// };
// const updateStaffSchedule = async (staffId: string, schedule: any) => {
//   await axiosdb.patch(`/api/staff/${staffId}/schedule`, { schedule });
// };
// const calculateCommission = async (staffId: string, period: string) => {
//   const response = await axiosdb.get(`/api/staff/${staffId}/commission?period=${period}`);
//   return response.data;
// };

interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  workingDays: string[];
  workingHours: string;
  appointments: number;
  rating: number;
  revenue: string;
  clientRetention: string;
  upsellRate: string;
  commission: string;
  status: 'active' | 'off' | 'busy';
}

export default function StaffManagement() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Mock data - replace with API call
  const staff: StaffMember[] = [
    {
      id: '1',
      name: 'Marie Nkumu',
      role: 'Spécialiste Ongles',
      phone: '+243 810 111 222',
      email: 'marie.n@beautynails.com',
      workingDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      workingHours: '09:00 - 18:00',
      appointments: 62,
      rating: 4.9,
      revenue: '930 000 CDF',
      clientRetention: '92%',
      upsellRate: '45%',
      commission: '186 000 CDF',
      status: 'active'
    },
    {
      id: '2',
      name: 'Grace Lumière',
      role: 'Experte Cils',
      phone: '+243 820 222 333',
      email: 'grace.l@beautynails.com',
      workingDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
      workingHours: '10:00 - 19:00',
      appointments: 58,
      rating: 4.8,
      revenue: '870 000 CDF',
      clientRetention: '88%',
      upsellRate: '38%',
      commission: '174 000 CDF',
      status: 'busy'
    },
    {
      id: '3',
      name: 'Sophie Kabila',
      role: 'Coiffeuse',
      phone: '+243 830 333 444',
      email: 'sophie.k@beautynails.com',
      workingDays: ['Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      workingHours: '08:00 - 17:00',
      appointments: 48,
      rating: 4.7,
      revenue: '720 000 CDF',
      clientRetention: '85%',
      upsellRate: '42%',
      commission: '144 000 CDF',
      status: 'active'
    },
    {
      id: '4',
      name: 'Élise Makala',
      role: 'Maquilleuse',
      phone: '+243 840 444 555',
      email: 'elise.m@beautynails.com',
      workingDays: ['Lun', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      workingHours: '09:00 - 18:00',
      appointments: 38,
      rating: 4.9,
      revenue: '570 000 CDF',
      clientRetention: '90%',
      upsellRate: '50%',
      commission: '114 000 CDF',
      status: 'off'
    }
  ];

  const tasks = [
    { id: '1', task: 'Nettoyer et stériliser les outils', assignedTo: 'Marie Nkumu', priority: 'high', status: 'completed' },
    { id: '2', task: 'Vérifier stock vernis gel', assignedTo: 'Grace Lumière', priority: 'medium', status: 'in-progress' },
    { id: '3', task: 'Organiser vitrine produits', assignedTo: 'Sophie Kabila', priority: 'low', status: 'pending' },
    { id: '4', task: 'Préparer commande produits', assignedTo: 'Élise Makala', priority: 'high', status: 'completed' }
  ];

  const scheduleData = [
    { day: 'Lundi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { day: 'Mardi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { day: 'Mercredi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { day: 'Jeudi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { day: 'Vendredi', slots: ['09:00-12:00', '13:00-16:00', '16:00-19:00'] },
    { day: 'Samedi', slots: ['08:00-12:00', '13:00-17:00'] }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Gestion du Personnel</h2>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
          + Nouvelle Employée
        </Button>
      </div>

      {/* Staff Roster - Who's Working Now */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <h3 className="text-xl text-gray-900 mb-4">Personnel Aujourd'hui</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((member) => (
            <Card
              key={member.id}
              className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${member.status === 'active' ? 'border-green-300 bg-green-50' :
                member.status === 'busy' ? 'border-blue-300 bg-blue-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              onClick={() => setSelectedStaff(member)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg">
                  {member.name.charAt(0)}
                </div>
                <Badge className={`${member.status === 'active' ? 'bg-green-500' :
                  member.status === 'busy' ? 'bg-blue-500' : 'bg-gray-500'
                  } text-white`}>
                  {member.status === 'active' ? 'Disponible' :
                    member.status === 'busy' ? 'Occupée' : 'Absente'}
                </Badge>
              </div>
              <h4 className="text-gray-900 mb-1">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
              {member.status === 'busy' && (
                <p className="text-xs text-blue-600 mt-2">Cliente actuelle: Marie K.</p>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <Card className="border-0 shadow-lg rounded-2xl p-6">
          <h3 className="text-xl text-gray-900 mb-4">Toutes les Employées</h3>
          <div className="space-y-3">
            {staff.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedStaff(member)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedStaff?.id === member.id
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                  : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900">{member.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-gray-900">{member.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{member.role}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{member.appointments} RDV</span>
                  <span className="text-xs text-gray-900">{member.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Staff Details */}
        {selectedStaff ? (
          <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2">
            <Tabs defaultValue="performance" className="space-y-6">
              <TabsList className="bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="performance" className="rounded-lg">Performance</TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg">Horaires</TabsTrigger>
                <TabsTrigger value="commission" className="rounded-lg">Commission</TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-2">{selectedStaff.name}</h3>
                    <p className="text-lg text-gray-600 mb-4">{selectedStaff.role}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📞 {selectedStaff.phone}</p>
                      <p>📧 {selectedStaff.email}</p>
                      <p>🕒 {selectedStaff.workingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <span className="text-3xl text-gray-900">{selectedStaff.rating}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 p-4">
                    <CalendarIcon className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-2xl text-gray-900">{selectedStaff.appointments}</p>
                    <p className="text-xs text-gray-600">RDV ce mois</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 p-4">
                    <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-lg text-gray-900">{selectedStaff.revenue}</p>
                    <p className="text-xs text-gray-600">Revenus</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 p-4">
                    <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-2xl text-gray-900">{selectedStaff.clientRetention}</p>
                    <p className="text-xs text-gray-600">Rétention</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 p-4">
                    <Award className="w-6 h-6 text-amber-600 mb-2" />
                    <p className="text-2xl text-gray-900">{selectedStaff.upsellRate}</p>
                    <p className="text-xs text-gray-600">Taux Vente+</p>
                  </Card>
                </div>

                {/* Working Days */}
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="text-gray-900 mb-3">Jours de Travail</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <Badge
                        key={day}
                        className={selectedStaff.workingDays.includes(day)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-500'}
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    Modifier Horaires
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Voir Profil Complet
                  </Button>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <h4 className="text-xl text-gray-900 mb-4">Planning de la Semaine</h4>
                <div className="space-y-3">
                  {scheduleData.map((day, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-900">{day.day}</p>
                        <Badge className={
                          selectedStaff.workingDays.includes(day.day.substring(0, 3))
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-400 text-white'
                        }>
                          {selectedStaff.workingDays.includes(day.day.substring(0, 3))
                            ? 'Travaille' : 'Repos'}
                        </Badge>
                      </div>
                      {selectedStaff.workingDays.includes(day.day.substring(0, 3)) && (
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot, sidx) => (
                            <Badge key={sidx} variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                  Modifier Planning
                </Button>
              </TabsContent>

              {/* Commission Tab */}
              <TabsContent value="commission">
                <h4 className="text-xl text-gray-900 mb-4">Calcul Commission & Paie</h4>
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 p-6">
                    <h5 className="text-gray-900 mb-4">Ce Mois (Novembre)</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Revenus générés</span>
                        <span className="text-xl text-gray-900">{selectedStaff.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Taux commission</span>
                        <span className="text-xl text-gray-900">20%</span>
                      </div>
                      <div className="w-full h-px bg-gray-300" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-900">Commission totale</span>
                        <span className="text-2xl text-green-600">{selectedStaff.commission}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 p-6">
                    <h5 className="text-gray-900 mb-4">Détails de Paie</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Salaire de base</span>
                        <span className="text-gray-900">450 000 CDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Commission</span>
                        <span className="text-gray-900">{selectedStaff.commission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Bonus performance</span>
                        <span className="text-gray-900">50 000 CDF</span>
                      </div>
                      <div className="w-full h-px bg-gray-300" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-900">Total à payer</span>
                        <span className="text-2xl text-blue-600">686 000 CDF</span>
                      </div>
                    </div>
                  </Card>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                    Générer Fiche de Paie
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Sélectionnez une employée pour voir ses détails</p>
            </div>
          </Card>
        )}
      </div>

      {/* Task Assignment Board */}
      <Card className="border-0 shadow-lg rounded-2xl p-8">
        <h3 className="text-2xl text-gray-900 mb-6">Tableau des Tâches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-4 border-2 rounded-xl ${task.status === 'completed' ? 'border-green-300 bg-green-50' :
              task.status === 'in-progress' ? 'border-blue-300 bg-blue-50' :
                'border-gray-300 bg-gray-50'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <Badge className={`${task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-500'
                  } text-white text-xs`}>
                  {task.priority === 'high' ? 'Urgent' :
                    task.priority === 'medium' ? 'Moyen' : 'Bas'}
                </Badge>
                {task.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : task.status === 'in-progress' ? (
                  <Clock className="w-5 h-5 text-blue-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-900 mb-2">{task.task}</p>
              <p className="text-xs text-gray-600">Assignée: {task.assignedTo}</p>
              <Button size="sm" variant="outline" className="w-full mt-3 rounded-full">
                {task.status === 'completed' ? 'Complété' :
                  task.status === 'in-progress' ? 'En cours' : 'Commencer'}
              </Button>
            </Card>
          ))}
        </div>
        <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
          + Nouvelle Tâche
        </Button>
      </Card>
    </div>
  );
}
