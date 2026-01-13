"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Gift, Award, Mail, Send, Calendar, TrendingUp, Users, Cake, MessageSquare, Target } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const createLoyaltyProgram = async (programData: any) => {
//   await axiosdb.post('/api/loyalty/programs', programData);
// };
// const sendCampaign = async (campaignData: any) => {
//   await axiosdb.post('/api/marketing/campaigns', campaignData);
// };
// const scheduleBirthdayMessages = async (date: string) => {
//   await axiosdb.post('/api/marketing/birthday-scheduler', { date });
// };
// const fetchCampaignAnalytics = async (campaignId: string) => {
//   const response = await axiosdb.get(`/api/marketing/campaigns/${campaignId}/analytics`);
//   return response.data;
// };

export default function MarketingLoyalty() {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // Mock loyalty program data
  const loyaltyRules = {
    pointsPerSpend: 1, // 1 point per 1000 CDF
    appointmentsForReward: 5,
    referralsForReward: 5,
    rewards: [
      { points: 100, reward: 'Manucure gratuite' },
      { points: 250, reward: 'Extension cils gratuite' },
      { points: 500, reward: '50% sur tous services' },
      { points: 1000, reward: 'Journée beauté complète gratuite' }
    ]
  };

  const campaigns = [
    {
      id: '1',
      name: 'Promotion Fêtes de Fin d\'Année',
      type: 'email',
      status: 'active',
      sent: 247,
      opened: 198,
      clicked: 87,
      conversions: 23,
      revenue: '690 000 CDF',
      date: '2024-11-15'
    },
    {
      id: '2',
      name: 'SMS Rappel RDV Semaine',
      type: 'sms',
      status: 'completed',
      sent: 145,
      opened: 145,
      clicked: 0,
      conversions: 12,
      revenue: '360 000 CDF',
      date: '2024-11-20'
    },
    {
      id: '3',
      name: 'Offre Spéciale Anniversaire',
      type: 'email',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      revenue: '0 CDF',
      date: '2024-12-01'
    }
  ];

  const birthdayClients = [
    { name: 'Marie Kabila', birthday: '15 Décembre', phone: '+243 812 345 678', email: 'marie.k@email.com' },
    { name: 'Grace Lumière', birthday: '18 Décembre', phone: '+243 823 456 789', email: 'grace.l@email.com' },
    { name: 'Sophie Makala', birthday: '22 Décembre', phone: '+243 834 567 890', email: 'sophie.m@email.com' }
  ];

  const topReferrers = [
    { name: 'Marie Kabila', referrals: 5, reward: 'Service gratuit gagné', status: 'eligible' },
    { name: 'Grace Lumière', referrals: 3, reward: '2 parrainages restants', status: 'progress' },
    { name: 'Sophie Makala', referrals: 7, reward: '2 services gratuits gagnés', status: 'vip' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Marketing & Fidélité</h2>
      </div>

      <Tabs defaultValue="loyalty" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="loyalty" className="rounded-lg">Programme Fidélité</TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-lg">Campagnes</TabsTrigger>
          <TabsTrigger value="birthday" className="rounded-lg">Anniversaires</TabsTrigger>
          <TabsTrigger value="referral" className="rounded-lg">Parrainages</TabsTrigger>
          <TabsTrigger value="broadcast" className="rounded-lg">Envoi Groupé</TabsTrigger>
        </TabsList>

        {/* Loyalty Program Tab */}
        <TabsContent value="loyalty">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Program */}
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900">Programme Actuel</h3>
              </div>

              <div className="space-y-4">
                <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 p-4">
                  <p className="text-sm text-gray-700 mb-1">Points par dépense</p>
                  <p className="text-2xl text-gray-900">
                    {loyaltyRules.pointsPerSpend} point / 1 000 CDF dépensé
                  </p>
                </Card>

                <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-4">
                  <p className="text-sm text-gray-700 mb-1">Récompense par visites</p>
                  <p className="text-2xl text-gray-900">
                    Service gratuit après {loyaltyRules.appointmentsForReward} rendez-vous
                  </p>
                </Card>

                <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 p-4">
                  <p className="text-sm text-gray-700 mb-1">Récompense par parrainages</p>
                  <p className="text-2xl text-gray-900">
                    Service gratuit après {loyaltyRules.referralsForReward} parrainages
                  </p>
                </Card>
              </div>

              <Button className="w-full mt-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
                Modifier Programme
              </Button>
            </Card>

            {/* Rewards Tiers */}
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900">Paliers de Récompenses</h3>
              </div>

              <div className="space-y-3">
                {loyaltyRules.rewards.map((reward, idx) => (
                  <Card key={idx} className="bg-linear-to-r from-amber-50 to-orange-50 border-0 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">{reward.reward}</p>
                        <p className="text-sm text-gray-600">{reward.points} points requis</p>
                      </div>
                      <Badge className="bg-amber-500 text-white">
                        {reward.points} pts
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6 rounded-full">
                + Ajouter Palier
              </Button>
            </Card>

            {/* Stats */}
            <Card className="border-0 shadow-lg rounded-2xl p-8 lg:col-span-2">
              <h3 className="text-2xl text-gray-900 mb-6">Statistiques Programme Fidélité</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-6">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-3xl text-gray-900">247</p>
                  <p className="text-sm text-gray-600">Membres Actifs</p>
                </Card>
                <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 p-6">
                  <Award className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-3xl text-gray-900">1,245</p>
                  <p className="text-sm text-gray-600">Points Distribués</p>
                </Card>
                <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 p-6">
                  <Gift className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-3xl text-gray-900">38</p>
                  <p className="text-sm text-gray-600">Récompenses Utilisées</p>
                </Card>
                <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 p-6">
                  <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
                  <p className="text-3xl text-gray-900">+15%</p>
                  <p className="text-sm text-gray-600">Rétention Clients</p>
                </Card>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-gray-900">Campagnes Marketing</h3>
                <Button className="bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full">
                  + Nouvelle Campagne
                </Button>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="bg-gray-50 border-0 p-6 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg text-gray-900">{campaign.name}</h4>
                          <Badge className={`${campaign.status === 'active' ? 'bg-green-500' :
                            campaign.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
                            } text-white`}>
                            {campaign.status === 'active' ? 'Active' :
                              campaign.status === 'completed' ? 'Terminée' : 'Programmée'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {campaign.type === 'email' ? '📧 Email' : '📱 SMS'} • {campaign.date}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl text-gray-900">{campaign.sent}</p>
                        <p className="text-xs text-gray-600">Envoyés</p>
                      </div>
                      {campaign.type === 'email' && (
                        <>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl text-gray-900">{campaign.opened}</p>
                            <p className="text-xs text-gray-600">Ouverts</p>
                            {campaign.sent > 0 && (
                              <p className="text-xs text-green-600">
                                {Math.round((campaign.opened / campaign.sent) * 100)}%
                              </p>
                            )}
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl text-gray-900">{campaign.clicked}</p>
                            <p className="text-xs text-gray-600">Cliqués</p>
                            {campaign.opened > 0 && (
                              <p className="text-xs text-green-600">
                                {Math.round((campaign.clicked / campaign.opened) * 100)}%
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl text-gray-900">{campaign.conversions}</p>
                        <p className="text-xs text-gray-600">Conversions</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-lg text-green-600">{campaign.revenue}</p>
                        <p className="text-xs text-gray-600">Revenus</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="rounded-full">
                        Voir Détails
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full">
                        Dupliquer
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Campaign Performance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-6">
                <Send className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-3xl text-gray-900">392</p>
                <p className="text-sm text-gray-600">Total Envois</p>
              </Card>
              <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 p-6">
                <Target className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-3xl text-gray-900">35</p>
                <p className="text-sm text-gray-600">Conversions</p>
              </Card>
              <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 p-6">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-3xl text-gray-900">8.9%</p>
                <p className="text-sm text-gray-600">Taux Conversion</p>
              </Card>
              <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">ROI Campagnes</p>
                <p className="text-2xl text-green-600">1 050 000 CDF</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Birthday Tab */}
        <TabsContent value="birthday">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-400 to-rose-400 flex items-center justify-center">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-gray-900">Anniversaires à Venir</h3>
                <p className="text-sm text-gray-600">Envoi automatique de messages d'anniversaire</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {birthdayClients.map((client, idx) => (
                <Card key={idx} className="bg-linear-to-r from-pink-50 to-purple-50 border-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">🎂 {client.birthday}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        SMS
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 p-6">
              <h4 className="text-lg text-gray-900 mb-4">Message d'Anniversaire Par Défaut</h4>
              <Textarea
                placeholder="Chère [NOM], Joyeux Anniversaire! 🎉 Profitez de 20% de réduction sur tous nos services ce mois-ci. L'équipe Beauty Nails vous souhaite une merveilleuse journée!"
                rows={4}
                className="mb-4 rounded-xl"
              />
              <div className="flex gap-3">
                <Button className="flex-1 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full">
                  Sauvegarder Message
                </Button>
                <Button variant="outline" className="rounded-full">
                  Prévisualiser
                </Button>
              </div>
            </Card>
          </Card>
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-gray-900">Programme de Parrainage</h3>
                <p className="text-sm text-gray-600">Service gratuit après 5 parrainages réussis</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {topReferrers.map((referrer, idx) => (
                <Card key={idx} className={`border-0 p-4 ${referrer.status === 'vip' ? 'bg-linear-to-r from-amber-50 to-orange-50' :
                  referrer.status === 'eligible' ? 'bg-linear-to-r from-green-50 to-emerald-50' :
                    'bg-linear-to-r from-blue-50 to-cyan-50'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{referrer.name}</p>
                      <p className="text-sm text-gray-600">{referrer.referrals} parrainages</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${referrer.status === 'vip' ? 'bg-amber-500' :
                        referrer.status === 'eligible' ? 'bg-green-500' : 'bg-blue-500'
                        } text-white mb-2`}>
                        {referrer.status === 'vip' ? 'VIP' :
                          referrer.status === 'eligible' ? 'Éligible' : 'En cours'}
                      </Badge>
                      <p className="text-sm text-gray-700">{referrer.reward}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">Total Parrainages</p>
                <p className="text-3xl text-gray-900">87</p>
              </Card>
              <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">Nouvelles Clientes</p>
                <p className="text-3xl text-gray-900">63</p>
                <p className="text-xs text-green-600">Taux conversion: 72%</p>
              </Card>
              <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 p-6">
                <p className="text-sm text-gray-600 mb-1">Récompenses Données</p>
                <p className="text-3xl text-gray-900">17</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Broadcast Tab */}
        <TabsContent value="broadcast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Broadcast */}
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl text-gray-900">Envoi Email Groupé</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Destinataires</label>
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-blue-500 text-white">Toutes les clientes (247)</Badge>
                    <Badge className="bg-purple-500 text-white">Membres VIP (45)</Badge>
                    <Badge className="bg-green-500 text-white">Inactives (32)</Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Sujet</label>
                  <Input
                    placeholder="Ex: Offre spéciale du mois..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Composez votre message email..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className="rounded-xl"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer Maintenant
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer
                  </Button>
                </div>
              </div>
            </Card>

            {/* SMS Broadcast */}
            <Card className="border-0 shadow-lg rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl text-gray-900">Envoi SMS Groupé</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Destinataires</label>
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-blue-500 text-white">Toutes les clientes (247)</Badge>
                    <Badge className="bg-purple-500 text-white">RDV demain (12)</Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Message SMS</label>
                  <Textarea
                    placeholder="Composez votre message SMS (160 caractères max)..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value.slice(0, 160))}
                    rows={6}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {smsMessage.length}/160 caractères
                  </p>
                </div>

                <Card className="bg-amber-50 border-0 p-4">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Conseil:</strong> Les SMS ont un taux d'ouverture de 98% dans les 3 minutes!
                  </p>
                </Card>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer SMS
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Prévisualiser
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
