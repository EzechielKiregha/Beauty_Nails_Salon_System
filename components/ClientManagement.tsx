import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Phone, Calendar, DollarSign, Gift, Bell, CreditCard, Award, Mail, MapPin, Cake } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchClients = async () => {
//   const response = await axios.get('/api/clients');
//   return response.data;
// };
// const fetchClientProfile = async (clientId: string) => {
//   const response = await axios.get(`/api/clients/${clientId}`);
//   return response.data;
// };
// const updateClientNotes = async (clientId: string, notes: string) => {
//   await axios.patch(`/api/clients/${clientId}/notes`, { notes });
// };

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  address: string;
  totalAppointments: number;
  totalSpent: string;
  loyaltyPoints: number;
  membershipStatus: string;
  lastVisit: string;
  preferences: string;
  allergies: string;
  favoriteServices: string[];
  prepaymentBalance: string;
  giftCardBalance: string;
  referrals: number;
}

export default function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Mock data - replace with API call
  const clients: Client[] = [
    {
      id: '1',
      name: 'Marie Kabila',
      phone: '+243 812 345 678',
      email: 'marie.kabila@email.com',
      birthday: '15 Mars 1992',
      address: 'Gombe, Kinshasa',
      totalAppointments: 15,
      totalSpent: '450 000 CDF',
      loyaltyPoints: 450,
      membershipStatus: 'VIP',
      lastVisit: '2024-11-28',
      preferences: 'Préfère les vernis roses, aime les designs discrets',
      allergies: 'Aucune allergie connue',
      favoriteServices: ['Manucure Gel', 'Extension Cils', 'Maquillage Soirée'],
      prepaymentBalance: '50 000 CDF',
      giftCardBalance: '25 000 CDF',
      referrals: 3
    },
    {
      id: '2',
      name: 'Grace Lumière',
      phone: '+243 823 456 789',
      email: 'grace.lumiere@email.com',
      birthday: '22 Juillet 1988',
      address: 'Ma Campagne, Kinshasa',
      totalAppointments: 12,
      totalSpent: '380 000 CDF',
      loyaltyPoints: 380,
      membershipStatus: 'VIP',
      lastVisit: '2024-11-25',
      preferences: 'Adore les tresses africaines, préfère les RDV matinaux',
      allergies: 'Sensible aux parfums forts',
      favoriteServices: ['Tresses Box Braids', 'Pédicure Spa', 'Manucure Française'],
      prepaymentBalance: '0 CDF',
      giftCardBalance: '0 CDF',
      referrals: 5
    },
    {
      id: '3',
      name: 'Sophie Makala',
      phone: '+243 834 567 890',
      email: 'sophie.makala@email.com',
      birthday: '10 Janvier 1995',
      address: 'Limete, Kinshasa',
      totalAppointments: 10,
      totalSpent: '320 000 CDF',
      loyaltyPoints: 320,
      membershipStatus: 'Premium',
      lastVisit: '2024-11-20',
      preferences: 'Aime les couleurs vives, très active sur réseaux sociaux',
      allergies: 'Aucune',
      favoriteServices: ['Extensions Cils Volume', 'Nail Art', 'Maquillage Naturel'],
      prepaymentBalance: '100 000 CDF',
      giftCardBalance: '50 000 CDF',
      referrals: 2
    }
  ];

  const appointmentHistory = [
    { date: '2024-11-28', service: 'Manucure Gel', worker: 'Marie N.', amount: '30 000 CDF', status: 'Complété' },
    { date: '2024-11-15', service: 'Extension Cils', worker: 'Grace L.', amount: '45 000 CDF', status: 'Complété' },
    { date: '2024-11-01', service: 'Maquillage', worker: 'Élise M.', amount: '40 000 CDF', status: 'Complété' },
    { date: '2024-10-20', service: 'Pédicure', worker: 'Sophie K.', amount: '25 000 CDF', status: 'Complété' }
  ];

  const notifications = [
    { date: '2024-11-27', type: 'Rappel', message: 'Rappel RDV envoyé - SMS', status: 'Envoyé' },
    { date: '2024-11-20', type: 'Confirmation', message: 'Confirmation RDV - Email', status: 'Envoyé' },
    { date: '2024-11-15', type: 'Promotion', message: 'Offre spéciale mois anniversaire', status: 'Ouvert' },
    { date: '2024-11-01', type: 'Remerciement', message: 'Merci pour votre visite', status: 'Envoyé' }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900 dark:text-white">Gestion des Clientes</h2>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
          + Nouvelle Cliente
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher par nom ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-xl border-gray-200"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <Card className="border-0 shadow-lg rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-xl text-gray-900 dark:text-white mb-4">Liste des Clientes</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedClient?.id === client.id
                  ? 'bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 border-2 border-pink-300 dark:border-pink-700'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900 dark:text-white">{client.name}</p>
                  <Badge className={`${client.membershipStatus === 'VIP' ? 'bg-amber-500' :
                    client.membershipStatus === 'Premium' ? 'bg-purple-500' : 'bg-gray-500'
                    } text-white`}>
                    {client.membershipStatus}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {client.totalAppointments} visites • {client.loyaltyPoints} points
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Client Profile */}
        {selectedClient ? (
          <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <TabsTrigger value="profile" className="rounded-lg">Profil</TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg">Historique</TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
                <TabsTrigger value="finances" className="rounded-lg">Finances</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl text-gray-900 dark:text-white mb-2">{selectedClient.name}</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedClient.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedClient.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Cake className="w-4 h-4" />
                        {selectedClient.birthday}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedClient.address}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                    {selectedClient.membershipStatus}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-0 p-4">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-2xl text-gray-900 dark:text-white">{selectedClient.totalAppointments}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Visites</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0 p-4">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                    <p className="text-lg text-gray-900 dark:text-white">{selectedClient.totalSpent}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Dépensé</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-0 p-4">
                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-2xl text-gray-900 dark:text-white">{selectedClient.loyaltyPoints}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Points Fidélité</p>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-0 p-4">
                    <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
                    <p className="text-2xl text-gray-900 dark:text-white">{selectedClient.referrals}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Parrainages</p>
                  </Card>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <h4 className="text-gray-900 dark:text-white mb-2">Préférences</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedClient.preferences}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <h4 className="text-gray-900 dark:text-white mb-2">Allergies / Notes Médicales</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedClient.allergies}</p>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl">
                    <h4 className="text-gray-900 dark:text-white mb-2">Services Favoris</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedClient.favoriteServices.map((service, idx) => (
                        <Badge key={idx} className="bg-pink-500 text-white">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                    Prendre RDV
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Modifier
                  </Button>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <h4 className="text-xl text-gray-900 dark:text-white mb-4">Historique des Visites</h4>
                <div className="space-y-3">
                  {appointmentHistory.map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div>
                        <p className="text-gray-900 dark:text-white">{apt.service}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">avec {apt.worker}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{apt.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white">{apt.amount}</p>
                        <Badge className="bg-green-500 text-white mt-1">
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <h4 className="text-xl text-gray-900 dark:text-white mb-4">Journal des Notifications</h4>
                <div className="space-y-3">
                  {notifications.map((notif, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Bell className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-gray-900 dark:text-white">{notif.type}</p>
                          <Badge className={`${notif.status === 'Envoyé' ? 'bg-green-500' :
                            notif.status === 'Ouvert' ? 'bg-blue-500' : 'bg-gray-500'
                            } text-white`}>
                            {notif.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notif.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Finances Tab */}
              <TabsContent value="finances">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h4 className="text-lg text-gray-900 dark:text-white">Solde Prépaiement</h4>
                      </div>
                      <p className="text-3xl text-gray-900 dark:text-white mb-2">{selectedClient.prepaymentBalance}</p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                        Ajouter Fonds
                      </Button>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-0 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h4 className="text-lg text-gray-900 dark:text-white">Carte Cadeau</h4>
                      </div>
                      <p className="text-3xl text-gray-900 dark:text-white mb-2">{selectedClient.giftCardBalance}</p>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                        Gérer Carte
                      </Button>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-0 p-6">
                    <h4 className="text-lg text-gray-900 dark:text-white mb-4">Programme de Fidélité</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Points actuels</span>
                        <span className="text-2xl text-gray-900 dark:text-white">{selectedClient.loyaltyPoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Prochain palier</span>
                        <span className="text-gray-900 dark:text-white">500 points</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                          style={{ width: `${(selectedClient.loyaltyPoints / 500) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Encore {500 - selectedClient.loyaltyPoints} points pour une récompense gratuite!
                      </p>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">Sélectionnez une cliente pour voir son profil</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
