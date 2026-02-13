"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar as CalendarIcon, Clock, DollarSign, Star, TrendingUp, Award, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useAvailableStaff, useStaff } from '@/lib/hooks/useStaff';
import CreateWorkerModal from '@/components/modals/CreateWorkerModal';
import { EditScheduleModal, PayrollModal, StaffProfileModal } from './modals/StaffModals';
import { Worker } from '@/lib/api/staff';
// import CreateTaskModal from './modals/CreateTaskModal';

export interface StaffMember {
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

export default function StaffManagement({ showMock }: { showMock?: boolean }) {
  const [selectedStaff, setSelectedStaff] = useState<Worker | null>(null);

  // API hook
  const { staff, isLoading: staffLoading } = useStaff();

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl  sm:text-3xl text-gray-900 dark:text-gray-100">Gestion du Personnel</h2>
        <CreateWorkerModal triggerLabel="+ Nouvelle Employée" />
      </div>

      {/* Staff Roster - Who's Working Now */}
      <Card className="border-0 shadow-lg rounded-2xl p-4 sm:p-6 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
        <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4">Personnel Aujourd'hui</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((member) => (
            <Card
              key={member.id}
              className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${member.status === 'active' ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' :
                member.status === 'busy' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/50' :
                  'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                }`}
              onClick={() => setSelectedStaff(member)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-base sm:text-lg">
                  {member.name ? member.name.charAt(0) : "E"}
                </div>
                <Badge className={`${member.status === 'active' ? 'bg-green-500' :
                  member.status === 'busy' ? 'bg-blue-500' : 'bg-gray-500'
                  } text-white text-[10px] sm:text-xs`}>
                  {member.status === 'active' ? 'Disponible' :
                    member.status === 'busy' ? 'Occupée' : 'Absente'}
                </Badge>
              </div>
              <h4 className="text-gray-900 dark:text-gray-100 mb-1 font-medium">{member.name}</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              {member.status === 'busy' && (
                <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Cliente actuelle: Marie K.</p>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <Card className="border-0 shadow-lg rounded-2xl p-4 sm:p-6 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
          <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4">Toutes les Employées</h3>
          <div className="space-y-3">
            {staff.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedStaff(member)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedStaff?.id === member.id
                  ? 'bg-linear-to-r from-purple-100/50 to-pink-100/50 border-2 border-purple-300 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{member.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">{member.rating}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">{member.appointments} RDV</span>
                  <span className="text-[10px] sm:text-xs text-gray-900 dark:text-gray-200 font-medium">{member.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Staff Details */}
        {selectedStaff ? (
          <Card className="border-0 shadow-lg rounded-2xl p-4 sm:p-8 lg:col-span-2 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <Tabs defaultValue="performance" className="space-y-6">
              <TabsList className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
                <TabsTrigger value="performance" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Performance</TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Horaires</TabsTrigger>
                <TabsTrigger value="commission" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Commission</TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-2">{selectedStaff.name}</h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">{selectedStaff.role}</p>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2"><span>📞</span> {selectedStaff.phone}</p>
                      <p className="flex items-center gap-2"><span>📧</span> {selectedStaff.email}</p>
                      <p className="flex items-center gap-2"><span>🕒</span> {selectedStaff.workingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 p-3 sm:p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                    <span className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 ">{selectedStaff.rating}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-0 p-3 sm:p-4 shadow-sm">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{selectedStaff.appointments}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">RDV ce mois</p>
                  </Card>
                  <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 p-3 sm:p-4 shadow-sm">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mb-2" />
                    <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">{selectedStaff.revenue}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Revenus</p>
                  </Card>
                  <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 p-3 sm:p-4 shadow-sm">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{selectedStaff.clientRetention}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Rétention</p>
                  </Card>
                  <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-0 p-3 sm:p-4 shadow-sm">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 mb-2" />
                    <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{selectedStaff.upsellRate}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Taux Vente+</p>
                  </Card>
                </div>

                {/* Working Days */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <h4 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-3 font-medium">Jours de Travail</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <Badge
                        key={day}
                        className={selectedStaff.workingDays.includes(day)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500'}
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <EditScheduleModal
                    staffId={selectedStaff.id}
                    staffName={selectedStaff.name}
                    trigger={
                      <Button className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
                        Modifier Horaires
                      </Button>
                    }
                  />
                  <StaffProfileModal
                    staff={selectedStaff}
                    trigger={
                      <Button variant="outline" className="rounded-full">
                        Voir Profil Complet
                      </Button>
                    }
                  />
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-6">
                <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4 font-medium">Planning de la Semaine</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {scheduleData.map((day, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{day.day}</p>
                        <Badge className={
                          selectedStaff.workingDays.includes(day.day.substring(0, 3))
                            ? 'bg-green-500 text-white text-[10px]'
                            : 'bg-gray-400 text-white text-[10px]'
                        }>
                          {selectedStaff.workingDays.includes(day.day.substring(0, 3))
                            ? 'Travaille' : 'Repos'}
                        </Badge>
                      </div>
                      {selectedStaff.workingDays.includes(day.day.substring(0, 3)) && (
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot, sidx) => (
                            <Badge key={sidx} variant="outline" className="text-[10px] sm:text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <EditScheduleModal
                  staffId={selectedStaff.id}
                  staffName={selectedStaff.name}
                  trigger={
                    <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                      Modifier Planning
                    </Button>
                  }
                />
              </TabsContent>

              {/* Commission Tab */}
              <TabsContent value="commission" className="space-y-6">
                <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4 font-medium">Calcul Commission & Paie</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-0 p-5 sm:p-6 shadow-sm">
                    <h5 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-4  flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Ce Mois (Novembre)
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Revenus générés</span>
                        <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">{selectedStaff.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Taux commission</span>
                        <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">20%</span>
                      </div>
                      <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">Commission totale</span>
                        <span className="text-xl sm:text-2xl text-green-600 dark:text-green-400 font-black">{selectedStaff.commission}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-0 p-5 sm:p-6 shadow-sm">
                    <h5 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-4  flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Détails de Paie
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Salaire de base</span>
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">450 000 Fc</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Commission</span>
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{selectedStaff.commission}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Bonus performance</span>
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">50 000 Fc</span>
                      </div>
                      <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">Total à payer</span>
                        <span className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-black">686 000 Fc</span>
                      </div>
                    </div>
                  </Card>

                  <PayrollModal
                    staffName={selectedStaff.name}
                    trigger={
                      <Button size="sm" className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full">
                        Générer Fiche de Paie
                      </Button>
                    }
                  />
                </div>

                {/* <Button className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full py-5 sm:py-6">
                  Générer Fiche de Paie
                </Button> */}
              </TabsContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2 flex items-center justify-center bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
              <p className="text-base sm:text-lg font-medium">Sélectionnez une employée pour voir ses détails</p>
            </div>
          </Card>
        )}
      </div>

      {/* Task Assignment Board */}
      {/* <Card className="border-0 shadow-lg rounded-2xl p-4 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
        <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-6">Tableau des Tâches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-4 border-2 rounded-xl ${task.status === 'completed' ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' :
              task.status === 'in-progress' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/50' :
                'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <Badge className={`${task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-500'
                  } text-white text-[10px]`}>
                  {task.priority === 'high' ? 'Urgent' :
                    task.priority === 'medium' ? 'Moyen' : 'Bas'}
                </Badge>
                {task.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : task.status === 'in-progress' ? (
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 font-medium">{task.task}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Assignée: {task.assignedTo}</p>
              <Button size="sm" variant="outline" className="w-full mt-3 rounded-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs py-4 sm:py-5">
                {task.status === 'completed' ? 'Complété' :
                  task.status === 'in-progress' ? 'En cours' : 'Commencer'}
              </Button>
            </Card>
          ))}
        </div>
        <Button className="w-full mt-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full py-5 sm:py-6">
          + Nouvelle Tâche
        </Button>
      </Card> */}
    </div>
  );
}
