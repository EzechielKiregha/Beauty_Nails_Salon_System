"use client"
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { useAppointments } from '@/lib/hooks/useAppointments';
import { useStaff } from '@/lib/hooks/useStaff';

interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  staff: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reminderSent: boolean;
  notes: string;
}

export default function BookingCalendar({ showMock }: { showMock?: boolean }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  const dateStr = currentDate.toISOString().split('T')[0];

  // Hooks (prefer API data)
  const { staff: apiStaff = [] } = useStaff();
  const { appointments: apiAppointments = [] } = useAppointments({ date: dateStr });

  // Fallback mock staff (used only if showMock=true and API returned nothing)
  const MOCK_STAFF = [
    { id: '1', name: 'Marie Nkumu', color: '#ec4899' },
    { id: '2', name: 'Grace Lumière', color: '#a855f7' },
    { id: '3', name: 'Sophie Kabila', color: '#f59e0b' },
    { id: '4', name: 'Élise Makala', color: '#f43f5e' }
  ];

  const MOCK_APPOINTMENTS: Appointment[] = [
    {
      id: '1',
      time: '09:00',
      duration: 60,
      clientName: 'Marie Kabila',
      clientPhone: '+243 812 345 678',
      clientEmail: 'marie.k@email.com',
      service: 'Manucure Gel',
      staff: 'Marie Nkumu',
      status: 'confirmed',
      reminderSent: true,
      notes: 'Cliente régulière, préfère les couleurs roses'
    },
    {
      id: '2',
      time: '09:30',
      duration: 90,
      clientName: 'Grace Lumière',
      clientPhone: '+243 823 456 789',
      clientEmail: 'grace.l@email.com',
      service: 'Extensions Cils Volume',
      staff: 'Grace Lumière',
      status: 'confirmed',
      reminderSent: true,
      notes: 'Sensible, utiliser produits hypoallergéniques'
    }
  ];

  // Use API lists if available, otherwise fallback to mocks only when showMock is true
  const staff = (apiStaff && apiStaff.length > 0)
    ? apiStaff.map((s: any) => ({ id: s.id || s._id || s.staffId || s.name, name: s.name || s.fullName || s, color: '#a855f7' }))
    : (showMock ? MOCK_STAFF : []);

  const appointments: Appointment[] = (apiAppointments && apiAppointments.length > 0)
    ? apiAppointments.map((apt: any) => ({
      id: apt.id || apt._id || `${apt.date}_${apt.time}`,
      time: apt.time || apt.startTime || new Date(apt.startsAt || apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: apt.duration || 60,
      clientName: apt.client?.name || apt.clientName || apt.client || 'Client',
      clientPhone: apt.client?.phone || apt.clientPhone || '',
      clientEmail: apt.client?.email || apt.clientEmail || '',
      service: apt.service?.name || apt.service || apt.serviceName || 'Service',
      staff: apt.staff?.name || apt.staff || apt.staffName || 'Staff',
      status: apt.status || 'confirmed',
      reminderSent: !!apt.reminderSent,
      notes: apt.notes || ''
    }))
    : (showMock ? MOCK_APPOINTMENTS : []);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const filteredStaff = selectedStaff === 'all' ? staff : staff.filter(s => s.id === selectedStaff);

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={goToPreviousDay} variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-2xl text-gray-900 dark:text-white">{formatDate(currentDate)}</h2>
            </div>
            <Button onClick={goToNextDay} variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button onClick={goToToday} variant="outline" className="rounded-full">
              Aujourd'hui
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-48 rounded-full">
                <SelectValue placeholder="Toutes les employées" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les employées</SelectItem>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                onClick={() => setView('day')}
                className="rounded-full"
              >
                Jour
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                onClick={() => setView('week')}
                className="rounded-full"
              >
                Semaine
              </Button>
            </div>

            <Button className="bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full">
              + Nouveau RDV
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Row - Staff Names */}
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `100px repeat(${filteredStaff.length}, 1fr)` }}>
              <div className="p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-gray-400 dark:text-gray-500" />
              </div>
              {filteredStaff.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl text-center text-white"
                  style={{ backgroundColor: s.color }}
                >
                  <p className="font-medium">{s.name}</p>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `100px repeat(${filteredStaff.length}, 1fr)` }}
                >
                  {/* Time Label */}
                  <div className="p-2 text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center">
                    {time}
                  </div>

                  {/* Staff Columns */}
                  {filteredStaff.map((s) => {
                    const appointment = appointments.find(
                      apt => apt.time === time && apt.staff === s.name
                    );

                    return (
                      <div
                        key={s.id}
                        className={`min-h-15 rounded-lg border-2 border-dashed p-2 ${appointment
                          ? 'bg-linear-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 border-pink-300 dark:border-pink-700'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          } cursor-pointer transition-all`}
                      >
                        {appointment && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.clientName}</p>
                              <Badge className={`text-xs ${appointment.status === 'confirmed' ? 'bg-green-500' :
                                appointment.status === 'pending' ? 'bg-amber-500' :
                                  appointment.status === 'completed' ? 'bg-blue-500' :
                                    'bg-red-500'
                                } text-white`}>
                                {appointment.status === 'confirmed' ? 'Confirmé' :
                                  appointment.status === 'pending' ? 'En attente' :
                                    appointment.status === 'completed' ? 'Complété' : 'Annulé'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.service}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{appointment.duration} min</p>
                            {appointment.reminderSent && (
                              <Badge variant="outline" className="text-xs">
                                <Mail className="w-3 h-3 mr-1" />
                                Rappel envoyé
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <h3 className="text-xl text-gray-900 dark:text-white mb-4">Liste des Rendez-vous du Jour</h3>
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id} className="bg-gray-50 dark:bg-gray-800 border-0 p-4 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="text-center min-w-[60px]">
                  <Clock className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-900">{apt.time}</p>
                  <p className="text-xs text-gray-500">{apt.duration}min</p>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white">{apt.clientName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{apt.service}</p>
                    </div>
                    <Badge className={`${apt.status === 'confirmed' ? 'bg-green-500' :
                      apt.status === 'pending' ? 'bg-amber-500' :
                        apt.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                      } text-white`}>
                      {apt.status === 'confirmed' ? 'Confirmé' :
                        apt.status === 'pending' ? 'En attente' :
                          apt.status === 'completed' ? 'Complété' : 'Annulé'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1 dark:text-gray-400">
                      <User className="w-3 h-3" />
                      avec {apt.staff}
                    </span>
                    <span className="flex items-center gap-1 dark:text-gray-400">
                      <Phone className="w-3 h-3" />
                      {apt.clientPhone}
                    </span>
                    <span className="flex items-center gap-1 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      {apt.clientEmail}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                      📝 {apt.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      Reprogrammer
                    </Button>
                    {!apt.reminderSent && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                        Envoyer Rappel
                      </Button>
                    )}
                    {apt.status === 'pending' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                        Confirmer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-0 p-6">
          <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-3xl text-gray-900 dark:text-white">{appointments.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">RDV Aujourd'hui</p>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0 p-6">
          <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-3xl text-gray-900 dark:text-white">
            {appointments.filter(a => a.status === 'confirmed').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Confirmés</p>
        </Card>
        <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-0 p-6">
          <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-2" />
          <p className="text-3xl text-gray-900 dark:text-white">
            {appointments.filter(a => a.reminderSent).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rappels Envoyés</p>
        </Card>
        <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-0 p-6">
          <User className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-3xl text-gray-900 dark:text-white">{staff.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Personnel Disponible</p>
        </Card>
      </div>
    </div>
  );
}
