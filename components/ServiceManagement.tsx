"use client"
import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Scissors, Clock, DollarSign, Sparkles, Package, Percent, Globe } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import CreateServiceModal from '@/components/modals/CreateServiceModal';

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: number;
  description: string;
  onlineBookable?: boolean;
  popular?: boolean;
}

interface Package {
  id: string;
  name: string;
  services: string[];
  regularPrice: string;
  packagePrice: string;
  savings: string;
  duration: string;
  active: boolean;
}

export default function ServiceManagement({ showMock }: { showMock?: boolean }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // API services (fall back to mock when none and showMock enabled)
  const { services: apiServices = [], isLoading: servicesLoading } = useServices();

  const MOCK_SERVICES: Service[] = [
    {
      id: '1',
      name: 'Manucure Gel',
      category: 'Onglerie',
      price: '30 000 Fc',
      duration: 60,
      description: 'Manucure complète avec pose de gel semi-permanent',
      onlineBookable: true,
      popular: true
    },
    {
      id: '2',
      name: 'Extension Cils Volume',
      category: 'Cils',
      price: '45 000 Fc',
      duration: 90,
      description: 'Extension de cils technique volume russe',
      onlineBookable: true,
      popular: true
    }
  ];

  const services: Service[] = useMemo(() => {
    if ((apiServices as any)?.length > 0) return apiServices as unknown as Service[];
    return showMock ? MOCK_SERVICES : [];
  }, [apiServices, showMock]);

  const packages: Package[] = [
    {
      id: '1',
      name: 'Package Beauté Complète',
      services: ['Manucure Gel', 'Pédicure Spa', 'Extension Cils'],
      regularPrice: '100 000 Fc',
      packagePrice: '85 000 Fc',
      savings: '15 000 Fc',
      duration: '3 mois',
      active: true
    },
    {
      id: '2',
      name: 'Package Mains & Pieds',
      services: ['Manucure Gel', 'Pédicure Spa'],
      regularPrice: '55 000 Fc',
      packagePrice: '45 000 Fc',
      savings: '10 000 Fc',
      duration: '6 mois',
      active: true
    },
    {
      id: '3',
      name: 'Package VIP Mensuel',
      services: ['Manucure Gel', 'Extension Cils', 'Maquillage', 'Tresses'],
      regularPrice: '165 000 Fc',
      packagePrice: '135 000 Fc',
      savings: '30 000 Fc',
      duration: '1 mois',
      active: true
    }
  ];

  const promotions = [
    {
      id: '1',
      name: 'Promo Décembre -20%',
      code: 'DEC20',
      discount: '20%',
      validUntil: '31/12/2024',
      usageLimit: 100,
      usageCount: 23,
      status: 'active'
    },
    {
      id: '2',
      name: 'Nouvelle Cliente -15%',
      code: 'NOUVELLE15',
      discount: '15%',
      validUntil: '31/12/2024',
      usageLimit: 50,
      usageCount: 12,
      status: 'active'
    },
    {
      id: '3',
      name: 'Parrainage -10 000',
      code: 'PARRAIN',
      discount: '10 000 Fc',
      validUntil: 'Illimité',
      usageLimit: 999,
      usageCount: 45,
      status: 'active'
    }
  ];

  const categories = ['Onglerie', 'Cils', 'Tresses', 'Maquillage'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion des Services</h2>
        <CreateServiceModal triggerLabel="+ Nouveau Service" />
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
          <TabsTrigger value="services" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Services</TabsTrigger>
          <TabsTrigger value="packages" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Forfaits</TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Promotions</TabsTrigger>
          <TabsTrigger value="online" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Réservation en Ligne</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List by Category */}
            <div className="lg:col-span-2 space-y-6">
              {categories.map((category) => (
                <Card key={category} className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-pink-500" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.filter(s => s.category === category).map((service) => (
                      <Card
                        key={service.id}
                        className={`p-4 cursor-pointer transition-all border-2 ${selectedService?.id === service.id
                          ? 'bg-linear-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-300 dark:border-pink-500 shadow-md'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-pink-200 dark:hover:border-pink-900/50'
                          }`}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{service.name}</p>
                              {service.popular && (
                                <Badge className="bg-amber-500 dark:bg-amber-600 text-white text-[10px] sm:text-xs">
                                  Populaire
                                </Badge>
                              )}
                              {service.onlineBookable && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs dark:text-gray-300 dark:border-gray-700">
                                  <Globe className="w-3 h-3 mr-1" />
                                  En ligne
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1 font-medium">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                {service.price}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-blue-500" />
                                {service.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Service Details */}
            {selectedService ? (
              <div className="lg:sticky lg:top-6">
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Détails du Service</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du Service</label>
                      <Input defaultValue={selectedService.name} className="rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 focus:ring-pink-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catégorie</label>
                      <Input defaultValue={selectedService.category} className="rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix</label>
                        <Input defaultValue={selectedService.price} className="rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (min)</label>
                        <Input type="number" defaultValue={selectedService.duration} className="rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <Textarea defaultValue={selectedService.description} rows={4} className="rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Réservable en ligne</span>
                        <Switch defaultChecked={selectedService.onlineBookable} className="data-[state=checked]:bg-pink-500" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Service populaire</span>
                        <Switch defaultChecked={selectedService.popular} className="data-[state=checked]:bg-amber-500" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button className="flex-1 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6 transition-all">
                        Sauvegarder
                      </Button>
                      <Button variant="outline" className="rounded-full py-6 text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 hover:shadow-lg transition-all border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Scissors className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Sélectionnez un service pour voir ses détails</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <Badge className={`${pkg.active ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-400'
                      } text-white border-0 px-3 py-1`}>
                      {pkg.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400" />
                    Durée de validité: {pkg.duration}
                  </p>

                  <div className="space-y-3 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Services inclus</p>
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">{pkg.regularPrice}</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{pkg.packagePrice}</span>
                    </div>
                    <Badge className="bg-green-500 dark:bg-green-600 text-white border-0 w-full justify-center py-1.5">
                      Économisez {pkg.savings}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full py-5 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                      Modifier
                    </Button>
                    <Button variant="outline" className="rounded-full w-12 h-12 p-0 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                      <Package className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-7 text-lg font-bold shadow-lg shadow-pink-500/20 transition-all">
              + Créer Nouveau Forfait
            </Button>
          </div>
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Codes Promotionnels</h3>
              </div>
              <Button className="w-full sm:w-auto bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-6 px-8 transition-all">
                + Nouvelle Promotion
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6 bg-linear-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 border border-amber-100 dark:border-amber-900/30 rounded-2xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{promo.name}</h4>
                        <Badge className={`${promo.status === 'active' ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-400'
                          } text-white border-0`}>
                          {promo.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 inline-block px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">Code: <strong className="text-amber-600 dark:text-amber-400">{promo.code}</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{promo.discount}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Réduction</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/20 text-center">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Valide jusqu'au</p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{promo.validUntil}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/20 text-center">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Utilisations</p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{promo.usageCount} / {promo.usageLimit}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/20 text-center">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Restant</p>
                      <p className="text-green-600 dark:text-green-400 font-bold">{promo.usageLimit - promo.usageCount}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-amber-500 to-orange-500 h-3 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 rounded-full py-5 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300">
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-full py-5 text-red-600 bg-white dark:bg-gray-900 dark:border-red-900/30">
                      Désactiver
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>


        {/* Online Booking Settings Tab */}
        <TabsContent value="online">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Paramètres Réservation en Ligne</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configurez les services disponibles pour la réservation en ligne</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{service.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{service.category} • {service.duration} min • {service.price}</p>
                  </div>
                  <Switch defaultChecked={service.onlineBookable} className="data-[state=checked]:bg-blue-500" />
                </div>
              ))}
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 p-6 sm:p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Options Supplémentaires
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Demander confirmation avant acceptation</span>
                  <Switch defaultChecked={true} className="data-[state=checked]:bg-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Envoyer rappel automatique 24h avant</span>
                  <Switch defaultChecked={true} className="data-[state=checked]:bg-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Permettre annulation en ligne</span>
                  <Switch defaultChecked={true} className="data-[state=checked]:bg-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Afficher disponibilité en temps réel</span>
                  <Switch defaultChecked={true} className="data-[state=checked]:bg-blue-500" />
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full py-7 text-lg font-bold shadow-lg shadow-blue-500/20 transition-all">
              Sauvegarder les Paramètres
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
