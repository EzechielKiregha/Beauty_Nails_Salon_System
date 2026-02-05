"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Settings, Clock, Users, Bell, FileText, CreditCard, Globe } from 'lucide-react';

export default function SystemSettings() {
  const [autoReminders, setAutoReminders] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);

  // Mock data
  const salonProfile = {
    name: 'Beauty Nails',
    address: 'Avenue du Commerce, Gombe, Kinshasa, RD Congo',
    phone: '+243 810 000 000',
    email: 'contact@beautynails.cd',
    website: 'www.beautynails.cd',
    businessHours: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 19:00',
      saturday: '08:00 - 17:00',
      sunday: 'Fermé'
    }
  };

  const userRoles = [
    { id: '1', name: 'Marie Kabongo', email: 'marie@beautynails.cd', role: 'Admin', permissions: ['Tout'] },
    { id: '2', name: 'Grace Lumière', email: 'grace@beautynails.cd', role: 'Manager', permissions: ['Planning', 'Finances', 'Staff'] },
    { id: '3', name: 'Sophie Nzuzi', email: 'sophie@beautynails.cd', role: 'Réceptionniste', permissions: ['RDV', 'Clients', 'Caisse'] },
    { id: '4', name: 'Élise Makala', email: 'elise@beautynails.cd', role: 'Technicienne', permissions: ['RDV propres', 'Clients'] }
  ];

  const notificationTemplates = [
    { id: '1', name: 'Confirmation RDV', channel: 'SMS + Email', status: 'active' },
    { id: '2', name: 'Rappel 24h avant', channel: 'SMS', status: 'active' },
    { id: '3', name: 'Rappel 2h avant', channel: 'SMS', status: 'active' },
    { id: '4', name: 'Remerciement après visite', channel: 'Email', status: 'active' },
    { id: '5', name: 'Anniversaire cliente', channel: 'SMS + Email', status: 'active' }
  ];

  const integrations = [
    { name: 'Réservation en Ligne', status: 'connected', icon: Globe },
    { name: 'Paiement Mobile Money', status: 'connected', icon: CreditCard },
    { name: 'SMS Gateway', status: 'connected', icon: Bell },
    { name: 'Email Service', status: 'connected', icon: Bell },
    { name: 'Comptabilité', status: 'not-connected', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl  sm:text-3xl text-gray-900 dark:text-gray-100 ">Paramètres du Système</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="rounded-lg text-xs sm:text-sm">Profil Salon</TabsTrigger>
          <TabsTrigger value="hours" className="rounded-lg text-xs sm:text-sm">Horaires</TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg text-xs sm:text-sm">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-xs sm:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="receipts" className="rounded-lg text-xs sm:text-sm">Reçus</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg text-xs sm:text-sm">Intégrations</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              </div>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Profil du Salon</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Nom du Salon</label>
                <Input defaultValue={salonProfile.name} className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Adresse</label>
                <Textarea defaultValue={salonProfile.address} rows={3} className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Téléphone</label>
                  <Input defaultValue={salonProfile.phone} className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Email</label>
                  <Input type="email" defaultValue={salonProfile.email} className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Site Web</label>
                <Input defaultValue={salonProfile.website} className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
              </div>

              <Button className="w-full bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full py-6 text-sm sm:text-base  shadow-lg shadow-pink-500/25">
                Sauvegarder les Modifications
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Hours Tab */}
        <TabsContent value="hours">
          <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Horaires d'Ouverture</h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {Object.entries(salonProfile.businessHours).map(([day, hours]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-full sm:w-32">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold capitalize">{
                      day === 'monday' ? 'Lundi' :
                        day === 'tuesday' ? 'Mardi' :
                          day === 'wednesday' ? 'Mercredi' :
                            day === 'thursday' ? 'Jeudi' :
                              day === 'friday' ? 'Vendredi' :
                                day === 'saturday' ? 'Samedi' : 'Dimanche'
                    }</p>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      {hours === 'Fermé' ? (
                        <Badge className="bg-red-500 dark:bg-red-900/40 text-white dark:text-red-200 border-0">Fermé</Badge>
                      ) : (
                        <Input defaultValue={hours} className="rounded-xl text-xs sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
                      )}
                    </div>
                    <Switch defaultChecked={hours !== 'Fermé'} />
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full py-6 text-sm sm:text-base  shadow-lg shadow-blue-500/25">
              Sauvegarder Horaires
            </Button>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users">
          <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Utilisateurs & Permissions</h3>
              </div>
              <Button className="bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full py-5 sm:py-6 px-6 text-xs sm:text-sm  shadow-lg shadow-purple-500/25">
                + Nouvel Utilisateur
              </Button>
            </div>

            <div className="space-y-4">
              {userRoles.map((user) => (
                <Card key={user.id} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 rounded-xl">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100  truncate">{user.name}</p>
                        <Badge className={`${user.role === 'Admin' ? 'bg-red-500 dark:bg-red-900/40 text-red-50 dark:text-red-200' :
                          user.role === 'Manager' ? 'bg-purple-500 dark:bg-purple-900/40 text-purple-50 dark:text-purple-200' :
                            user.role === 'Réceptionniste' ? 'bg-blue-500 dark:bg-blue-900/40 text-blue-50 dark:text-blue-200' : 'bg-green-500 dark:bg-green-900/40 text-green-50 dark:text-green-200'
                          } border-0 text-[10px] sm:text-xs `}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{user.email}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {user.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none rounded-full text-xs sm:text-sm py-5 dark:border-gray-700 dark:hover:bg-gray-700">
                        Modifier
                      </Button>
                      {user.role !== 'Admin' && (
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none rounded-full text-red-600 dark:text-red-400 dark:border-gray-700 dark:hover:bg-red-900/20 text-xs sm:text-sm py-5">
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-0 p-5 sm:p-6 mt-6 shadow-sm">
              <h4 className="text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-4 ">Rôles et Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">👑</span>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100  mb-0.5">Admin:</p>
                    <p className="text-gray-700 dark:text-gray-400 leading-tight">Accès complet à toutes les fonctionnalités</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100  mb-0.5">Manager:</p>
                    <p className="text-gray-700 dark:text-gray-400 leading-tight">Planning, finances, staff, inventaire</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">📅</span>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100  mb-0.5">Réceptionniste:</p>
                    <p className="text-gray-700 dark:text-gray-400 leading-tight">Rendez-vous, clients, caisse</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">✨</span>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100  mb-0.5">Technicienne:</p>
                    <p className="text-gray-700 dark:text-gray-400 leading-tight">Ses propres RDV et clients assignés</p>
                  </div>
                </div>
              </div>
            </Card>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Paramètres Notifications</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold">Rappels Automatiques</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Envoyer rappels RDV automatiquement</p>
                  </div>
                  <Switch checked={autoReminders} onCheckedChange={setAutoReminders} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold">Notifications SMS</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Activer les notifications par SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold">Notifications Email</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Activer les notifications par email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold">Réservation en Ligne</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Permettre réservations via le site web</p>
                  </div>
                  <Switch checked={onlineBooking} onCheckedChange={setOnlineBooking} />
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
              <h3 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-6 ">Modèles de Notifications</h3>
              <div className="space-y-3">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 ">{template.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{template.channel}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <Badge className={`${template.status === 'active' ? 'bg-green-500 dark:bg-green-900/40 text-green-50 dark:text-green-200' : 'bg-gray-400 dark:bg-gray-700 dark:text-gray-300'
                        } border-0 text-[10px] sm:text-xs `}>
                        {template.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button size="sm" variant="outline" className="rounded-full text-xs sm:text-sm dark:border-gray-700 dark:hover:bg-gray-700">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-full py-6 text-sm sm:text-base  dark:border-gray-700 dark:hover:bg-gray-800">
                + Nouveau Modèle
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts">
          <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              </div>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Personnalisation des Reçus</h3>
            </div>

            <div className="space-y-8">
              <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-6 ">Aperçu du Reçu</h4>
                <div className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 max-w-md mx-auto shadow-inner">
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 font-black mb-1">{salonProfile.name}</h2>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{salonProfile.address}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{salonProfile.phone}</p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4 space-y-1">
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 flex justify-between"><span>Date:</span> <span>04/12/2024</span></p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 flex justify-between"><span>N° Reçu:</span> <span className="font-mono">#2024-0432</span></p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 flex justify-between"><span>Cliente:</span> <span className="">Marie Kabila</span></p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 py-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Manucure Gel</span>
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 ">30 000 Fc</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Extension Cils</span>
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 ">45 000 Fc</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-double border-gray-200 dark:border-gray-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-black">TOTAL:</span>
                      <span className="text-base sm:text-xl text-pink-600 dark:text-pink-400 font-black">75 000 Fc</span>
                    </div>
                  </div>
                  <div className="text-center mt-8 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 italic">
                    <p>Merci pour votre visite!</p>
                    <p>À bientôt chez Beauty Nails</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Message de Remerciement</label>
                  <Textarea
                    defaultValue="Merci pour votre visite! À bientôt chez Beauty Nails"
                    rows={3}
                    className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Conditions Générales (pied de page)</label>
                  <Textarea
                    defaultValue="Paiement non remboursable. Valable 30 jours."
                    rows={2}
                    className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <Button className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full py-6 text-sm sm:text-base  shadow-lg shadow-amber-500/25">
                Sauvegarder Personnalisation
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card className="border-0 shadow-lg rounded-2xl p-5 sm:p-8 bg-white dark:bg-gray-950 dark:border dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
              </div>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">Intégrations & Services</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, idx) => {
                const Icon = integration.icon;
                return (
                  <Card key={idx} className={`p-5 sm:p-6 border-2 transition-all duration-300 ${integration.status === 'connected'
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
                    }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${integration.status === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                          <Icon className={`w-5 h-5 ${integration.status === 'connected' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                            }`} />
                        </div>
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 ">{integration.name}</p>
                      </div>
                      <Badge className={`${integration.status === 'connected' ? 'bg-green-500 dark:bg-green-900/40 text-green-50 dark:text-green-200' : 'bg-gray-400 dark:bg-gray-700 dark:text-gray-400'
                        } border-0 text-[10px] sm:text-xs  shrink-0`}>
                        {integration.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={integration.status === 'connected' ? 'outline' : 'default'}
                      className={`w-full rounded-full py-5 text-xs sm:text-sm  ${integration.status === 'connected' ? 'dark:border-green-900/50 dark:hover:bg-green-900/20' : 'bg-gray-900 dark:bg-gray-700 text-white'}`}
                    >
                      {integration.status === 'connected' ? 'Configurer' : 'Connecter'}
                    </Button>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-0 p-5 sm:p-6 mt-6 shadow-sm">
              <h4 className="text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 ">API & Webhooks</h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 mb-4 leading-relaxed">
                Intégrez Beauty Nails avec vos propres systèmes ou applications tierces pour automatiser votre flux de travail.
              </p>
              <Button variant="outline" className="rounded-full py-5 text-xs sm:text-sm  dark:border-blue-900/50 dark:hover:bg-blue-900/20">
                Voir Documentation API
              </Button>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
