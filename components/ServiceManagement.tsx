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

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchServices = async () => {
//   const response = await axiosdb.get('/api/services');
//   return response.data;
// };
// const updateService = async (serviceId: string, data: any) => {
//   await axiosdb.patch(`/api/services/${serviceId}`, data);
// };
// const createPackage = async (packageData: any) => {
//   await axiosdb.post('/api/packages', packageData);
// };
// const createPromotion = async (promoData: any) => {
//   await axiosdb.post('/api/promotions', promoData);
// };

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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Gestion des Services</h2>
        <CreateServiceModal triggerLabel="+ Nouveau Service" />
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
          <TabsTrigger value="packages" className="rounded-lg">Forfaits</TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-lg">Promotions</TabsTrigger>
          <TabsTrigger value="online" className="rounded-lg">Réservation en Ligne</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List by Category */}
            <div className="lg:col-span-2 space-y-6">
              {categories.map((category) => (
                <Card key={category} className="border-0 shadow-lg rounded-2xl p-6">
                  <h3 className="text-xl text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-3">
                    {services.filter(s => s.category === category).map((service) => (
                      <Card
                        key={service.id}
                        className={`p-4 cursor-pointer transition-all ${selectedService?.id === service.id
                          ? 'bg-linear-to-r from-pink-100 to-purple-100 border-2 border-pink-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-gray-900">{service.name}</p>
                              {service.popular && (
                                <Badge className="bg-amber-500 text-white text-xs">
                                  Populaire
                                </Badge>
                              )}
                              {service.onlineBookable && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="w-3 h-3 mr-1" />
                                  En ligne
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {service.price}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
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
              <Card className="border-0 shadow-lg rounded-2xl p-6">
                <h3 className="text-xl text-gray-900 mb-4">Détails du Service</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Nom du Service</label>
                    <Input defaultValue={selectedService.name} className="rounded-xl" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Catégorie</label>
                    <Input defaultValue={selectedService.category} className="rounded-xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Prix</label>
                      <Input defaultValue={selectedService.price} className="rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Durée (min)</label>
                      <Input type="number" defaultValue={selectedService.duration} className="rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Description</label>
                    <Textarea defaultValue={selectedService.description} rows={3} className="rounded-xl" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-700">Réservable en ligne</span>
                      <Switch defaultChecked={selectedService.onlineBookable} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-700">Service populaire</span>
                      <Switch defaultChecked={selectedService.popular} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full">
                      Sauvegarder
                    </Button>
                    <Button variant="outline" className="rounded-full text-red-600">
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Scissors className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un service pour voir ses détails</p>
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
                <Card key={pkg.id} className="border-0 shadow-lg rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={`${pkg.active ? 'bg-green-500' : 'bg-gray-400'
                      } text-white`}>
                      {pkg.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>

                  <h3 className="text-xl text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Durée: {pkg.duration}</p>

                  <div className="space-y-2 mb-4">
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-linear-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 line-through">{pkg.regularPrice}</span>
                      <span className="text-2xl text-gray-900">{pkg.packagePrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Badge className="bg-green-500 text-white">
                        Économie: {pkg.savings}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full">
                      Modifier
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Package className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button className="w-full bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
              + Créer Nouveau Forfait
            </Button>
          </div>
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Percent className="w-8 h-8 text-amber-500" />
                <h3 className="text-2xl text-gray-900">Codes Promotionnels</h3>
              </div>
              <Button className="bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full">
                + Nouvelle Promotion
              </Button>
            </div>

            <div className="space-y-4">
              {promotions.map((promo) => (
                <Card key={promo.id} className="bg-linear-to-r from-amber-50 to-orange-50 border-0 p-6 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg text-gray-900">{promo.name}</h4>
                        <Badge className={`${promo.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          } text-white`}>
                          {promo.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Code: <strong>{promo.code}</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-gray-900">{promo.discount}</p>
                      <p className="text-xs text-gray-600">Réduction</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Valide jusqu'au</p>
                      <p className="text-gray-900">{promo.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Utilisations</p>
                      <p className="text-gray-900">{promo.usageCount} / {promo.usageLimit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Restant</p>
                      <p className="text-gray-900">{promo.usageLimit - promo.usageCount}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4 mb-4">
                    <div
                      className="bg-linear-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      Dupliquer
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full text-red-600">
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
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-2xl text-gray-900">Paramètres Réservation en Ligne</h3>
                <p className="text-sm text-gray-600">Configurez les services disponibles pour la réservation en ligne</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.category} • {service.duration} min • {service.price}</p>
                  </div>
                  <Switch defaultChecked={service.onlineBookable} />
                </div>
              ))}
            </div>

            <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-6">
              <h4 className="text-lg text-gray-900 mb-4">Options Supplémentaires</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Demander confirmation avant acceptation</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Envoyer rappel automatique 24h avant</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Permettre annulation en ligne</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Afficher disponibilité en temps réel</span>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </Card>

            <Button className="w-full mt-6 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full">
              Sauvegarder les Paramètres
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
