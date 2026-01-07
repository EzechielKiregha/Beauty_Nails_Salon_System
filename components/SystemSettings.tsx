import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Settings, Clock, Users, Bell, FileText, CreditCard, Globe } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const updateSalonProfile = async (profileData: any) => {
//   await axios.patch('/api/salon/profile', profileData);
// };
// const updateUserRoles = async (userId: string, roles: string[]) => {
//   await axios.patch(`/api/users/${userId}/roles`, { roles });
// };
// const updateNotificationTemplates = async (templates: any) => {
//   await axios.patch('/api/notifications/templates', templates);
// };
// const updateIntegrations = async (integrations: any) => {
//   await axios.patch('/api/integrations', integrations);
// };

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
        <h2 className="text-3xl text-gray-900">Paramètres du Système</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg">Profil Salon</TabsTrigger>
          <TabsTrigger value="hours" className="rounded-lg">Horaires</TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
          <TabsTrigger value="receipts" className="rounded-lg">Reçus</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg">Intégrations</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-pink-500" />
              <h3 className="text-2xl text-gray-900">Profil du Salon</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nom du Salon</label>
                <Input defaultValue={salonProfile.name} className="rounded-xl" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Adresse</label>
                <Textarea defaultValue={salonProfile.address} rows={3} className="rounded-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Téléphone</label>
                  <Input defaultValue={salonProfile.phone} className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email</label>
                  <Input type="email" defaultValue={salonProfile.email} className="rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Site Web</label>
                <Input defaultValue={salonProfile.website} className="rounded-xl" />
              </div>

              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                Sauvegarder les Modifications
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Hours Tab */}
        <TabsContent value="hours">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl text-gray-900">Horaires d'Ouverture</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(salonProfile.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-32">
                    <p className="text-gray-900 capitalize">{
                      day === 'monday' ? 'Lundi' :
                      day === 'tuesday' ? 'Mardi' :
                      day === 'wednesday' ? 'Mercredi' :
                      day === 'thursday' ? 'Jeudi' :
                      day === 'friday' ? 'Vendredi' :
                      day === 'saturday' ? 'Samedi' : 'Dimanche'
                    }</p>
                  </div>
                  <div className="flex-1">
                    {hours === 'Fermé' ? (
                      <Badge className="bg-red-500 text-white">Fermé</Badge>
                    ) : (
                      <Input defaultValue={hours} className="rounded-xl" />
                    )}
                  </div>
                  <Switch defaultChecked={hours !== 'Fermé'} />
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
              Sauvegarder Horaires
            </Button>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <h3 className="text-2xl text-gray-900">Utilisateurs & Permissions</h3>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                + Nouvel Utilisateur
              </Button>
            </div>

            <div className="space-y-3">
              {userRoles.map((user) => (
                <Card key={user.id} className="bg-gray-50 border-0 p-6 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-lg text-gray-900">{user.name}</p>
                        <Badge className={`${
                          user.role === 'Admin' ? 'bg-red-500' :
                          user.role === 'Manager' ? 'bg-purple-500' :
                          user.role === 'Réceptionniste' ? 'bg-blue-500' : 'bg-green-500'
                        } text-white`}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-full">
                        Modifier
                      </Button>
                      {user.role !== 'Admin' && (
                        <Button size="sm" variant="outline" className="rounded-full text-red-600">
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 p-6 mt-6">
              <h4 className="text-lg text-gray-900 mb-4">Rôles et Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-900 mb-2">👑 <strong>Admin:</strong></p>
                  <p className="text-gray-700">Accès complet à toutes les fonctionnalités</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-2">📊 <strong>Manager:</strong></p>
                  <p className="text-gray-700">Planning, finances, staff, inventaire</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-2">📅 <strong>Réceptionniste:</strong></p>
                  <p className="text-gray-700">Rendez-vous, clients, caisse</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-2">✨ <strong>Technicienne:</strong></p>
                  <p className="text-gray-700">Ses propres RDV et clients assignés</p>
                </div>
              </div>
            </Card>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl text-gray-900">Paramètres Notifications</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-900">Rappels Automatiques</p>
                    <p className="text-sm text-gray-600">Envoyer rappels RDV automatiquement</p>
                  </div>
                  <Switch checked={autoReminders} onCheckedChange={setAutoReminders} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-900">Notifications SMS</p>
                    <p className="text-sm text-gray-600">Activer les notifications par SMS</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-900">Notifications Email</p>
                    <p className="text-sm text-gray-600">Activer les notifications par email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-900">Réservation en Ligne</p>
                    <p className="text-sm text-gray-600">Permettre réservations via le site web</p>
                  </div>
                  <Switch checked={onlineBooking} onCheckedChange={setOnlineBooking} />
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <h3 className="text-xl text-gray-900 mb-4">Modèles de Notifications</h3>
              <div className="space-y-3">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-600">{template.channel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${
                        template.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      } text-white`}>
                        {template.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button size="sm" variant="outline" className="rounded-full">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 rounded-full">
                + Nouveau Modèle
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-amber-500" />
              <h3 className="text-2xl text-gray-900">Personnalisation des Reçus</h3>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg text-gray-900 mb-4">Aperçu du Reçu</h4>
                <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl text-gray-900 mb-2">{salonProfile.name}</h2>
                    <p className="text-sm text-gray-600">{salonProfile.address}</p>
                    <p className="text-sm text-gray-600">{salonProfile.phone}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm text-gray-700">Date: 04/12/2024</p>
                    <p className="text-sm text-gray-700">N° Reçu: #2024-0432</p>
                    <p className="text-sm text-gray-700">Cliente: Marie Kabila</p>
                  </div>
                  <div className="border-t border-gray-200 py-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Manucure Gel</span>
                      <span className="text-gray-900">30 000 CDF</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Extension Cils</span>
                      <span className="text-gray-900">45 000 CDF</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">75 000 CDF</span>
                    </div>
                  </div>
                  <div className="text-center mt-6 text-sm text-gray-600">
                    <p>Merci pour votre visite!</p>
                    <p>À bientôt chez Beauty Nails</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Message de Remerciement</label>
                  <Textarea
                    defaultValue="Merci pour votre visite! À bientôt chez Beauty Nails"
                    rows={3}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Conditions Générales (pied de page)</label>
                  <Textarea
                    defaultValue="Paiement non remboursable. Valable 30 jours."
                    rows={2}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                Sauvegarder Personnalisation
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-cyan-500" />
              <h3 className="text-2xl text-gray-900">Intégrations & Services</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, idx) => {
                const Icon = integration.icon;
                return (
                  <Card key={idx} className={`p-6 border-2 ${
                    integration.status === 'connected' 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          integration.status === 'connected' ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            integration.status === 'connected' ? 'text-green-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <p className="text-gray-900">{integration.name}</p>
                      </div>
                      <Badge className={`${
                        integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                      } text-white`}>
                        {integration.status === 'connected' ? 'Connecté' : 'Non connecté'}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant={integration.status === 'connected' ? 'outline' : 'default'}
                      className="w-full rounded-full"
                    >
                      {integration.status === 'connected' ? 'Configurer' : 'Connecter'}
                    </Button>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 p-6 mt-6">
              <h4 className="text-lg text-gray-900 mb-2">API & Webhooks</h4>
              <p className="text-sm text-gray-700 mb-4">
                Intégrez Beauty Nails avec vos propres systèmes ou applications tierces
              </p>
              <Button variant="outline" className="rounded-full">
                Voir Documentation API
              </Button>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
