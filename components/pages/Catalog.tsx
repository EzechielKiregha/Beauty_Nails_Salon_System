"use client"
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Scissors, ShoppingBag, Package, Percent, Award, Star, Clock, DollarSign, Sparkles, Users, Calendar, Gift, TrendingUp, Target } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { usePackages } from '@/lib/hooks/usePackages';
import { useDiscounts } from '@/lib/hooks/useMarketing';
import { useLoyalty } from '@/lib/hooks/useLoyalty';
import { Service } from '@/lib/api/services';
import Link from 'next/link';
import { useInventory } from '@/lib/hooks/useInventory';
import LoaderBN from '../Loader-BN';
import { useClients } from '@/lib/hooks/useClients';

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState('services');

  // Fetch data using hooks
  const { services, isLoading: servicesLoading } = useServices();
  const { inventory: products, isLoading: productsLoading } = useInventory(); // Placeholder hook
  const { packages, isLoading: packagesLoading } = usePackages();
  const { discounts, isLoading: discountsLoading } = useDiscounts();
  const { points: loyaltyPoints, tier: loyaltyTier, transactions: loyaltyTransactions, isLoading: loyaltyLoading } = useLoyalty();
  // API hook
  const { clients: allClients = [] } = useClients()

  const loyaltyRules = {
    pointsPerSpend: 1,
    appointmentsForReward: 5,
    referralsForReward: 5,
    rewards: [
      { points: 300, reward: 'Manucure gratuite' },
      { points: 550, reward: 'Extension cils gratuite' },
      { points: 750, reward: '50% sur tous services' },
      { points: 1000, reward: 'Journée beauté complète gratuite' }
    ]
  };

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = {};
  services.forEach(service => {
    const cat = service.category;
    if (!servicesByCategory[cat]) {
      servicesByCategory[cat] = [];
    }
    servicesByCategory[cat].push(service);
  });

  // Prepare data for display
  const loyaltyRewards = loyaltyTransactions?.filter(t => t.type === 'earned_referral').slice(0, 3) || []; // Example filter

  const isLoading = servicesLoading || productsLoading || packagesLoading || discountsLoading || loyaltyLoading;

  if (isLoading) {
    return <LoaderBN />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 dark:text-gray-100 mb-6">
            Notre Catalogue
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explorez nos services, produits, forfaits et offres spéciales.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl mb-16 lg:mb-12">
              <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Scissors className="w-4 h-4 mr-2" /> Services
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <ShoppingBag className="w-4 h-4 mr-2" /> Produits
              </TabsTrigger>
              <TabsTrigger value="packages" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Package className="w-4 h-4 mr-2" /> Forfaits
              </TabsTrigger>
              <TabsTrigger value="promotions" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Percent className="w-4 h-4 mr-2" /> Promotions
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Award className="w-4 h-4 mr-2" /> Fidélité
              </TabsTrigger>
              {/* <TabsTrigger value="campaigns" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Sparkles className="w-4 h-4 mr-2" /> Campagnes
              </TabsTrigger> */}
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-2xl  text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-pink-500" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    {categoryServices.map(service => (
                      <Card key={service.id} className="p-6 bg-white dark:bg-gray-900 border-b border-pink-100 dark:border-pink-900 shadow-xl rounded-3xl overflow-hidden relative transform hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl  text-gray-900 dark:text-gray-100">{service.name}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                          </div>
                          <Badge className="bg-green-500 dark:bg-green-600 text-white">
                            {service.price.toLocaleString()} CDF
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            {service.duration} min
                          </span>
                        </div>
                        <Link href={`/appointments?service=${service.id}`}>
                          <Button className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6  shadow-md">
                            Réserver
                          </Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-0 shadow-lg rounded-3xl transition-all hover:-translate-y-1">
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img src={product.name || 'https://placehold.co/400x400'} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <Badge className="absolute top-2 right-2 bg-white text-gray-900 hover:bg-white">{product.currentStock} en stock</Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-amber-600  uppercase tracking-wider mb-1">{product.name}</p>
                      <h3 className=" text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className=" text-lg">{product.cost.toLocaleString()} CDF</span>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-amber-50 text-gray-400 hover:text-amber-600">
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map(pkg => {
                  const regularPrice = pkg.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
                  const savings = regularPrice - pkg.price;
                  return (
                    <Card key={pkg.id} className="p-6 bg-white dark:bg-gray-900 border-b border-pink-100 dark:border-pink-900 shadow-xl rounded-3xl overflow-hidden relative transform hover:scale-[1.02] transition-transform">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                          <Package className="w-7 h-7 text-white" />
                        </div>
                        <Badge className={`${pkg.isActive ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-400'} text-white border-0 px-3 py-1`}>
                          {pkg.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>

                      <h3 className="text-xl  text-gray-900 dark:text-gray-100 mb-2">{pkg.name}</h3>
                      {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-400" />
                        Durée: {pkg || 'N/A'}
                      </p> */}

                      <div className="space-y-3 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs  text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Services inclus</p>
                        {pkg.services?.slice(0, 3).map((service, idx) => ( // Show first 3 services
                          <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
                            <span>{service.name}</span>
                          </div>
                        ))}
                        {pkg.services && pkg.services.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">+ {pkg.services.length - 3} autres</p>
                        )}
                      </div>

                      <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">{regularPrice > 0 ? regularPrice.toLocaleString() : 'N/A'} CDF</span>
                          <span className="text-2xl  text-green-600 dark:text-green-400">{pkg.price.toLocaleString()} CDF</span>
                        </div>
                        <Badge className="bg-green-500 dark:bg-green-600 text-white border-0 w-full justify-center py-1.5">
                          Économisez {savings > 0 ? savings.toLocaleString() : 'N/A'} CDF
                        </Badge>
                      </div>

                      <Link href={`/appointments?package=${pkg.id}&price=${pkg.price}`}>
                        <Button size="sm" className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-md">
                          Réserver Forfait
                        </Button>
                      </Link>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Promotions Tab */}
            <TabsContent value="promotions" className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {discounts.map(promo => (
                  <Card key={promo.id} className="p-6 bg-linear-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-b border-amber-100 dark:border-amber-900 shadow-xl rounded-3xl overflow-hidden relative transform hover:scale-[1.02] transition-transform">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h4 className="text-lg  text-gray-900 dark:text-gray-100">
                            {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value} CDF`} Off
                          </h4>
                          <Badge className={`${promo.isActive ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-400'} text-white border-0`}>
                            {promo.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 inline-block px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">Code: <strong className="text-amber-600 dark:text-amber-400">{promo.code}</strong></p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{promo.value}</p>
                        <p className="text-[10px] sm:text-xs  text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                          {promo.type === 'percentage' ? 'Réduction %' : 'Réduction Fixe'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  mb-1">Début</p>
                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{new Date(promo.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase  mb-1">Fin</p>
                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{new Date(promo.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-amber-500 to-orange-500 h-3 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        style={{ width: `${Math.min((promo.usedCount / promo.maxUses) * 100, 100)}%` }} // Cap at 100%
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 rounded-full py-5 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300">
                        Copier Code
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 rounded-full py-5 text-red-600 bg-white dark:bg-gray-900 dark:border-red-900/30">
                        Désactiver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-12">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100">Programme Actuel</h3>
                  </div>

                  <div className="space-y-4">
                    <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 border border-purple-100 dark:border-purple-900/30 p-4 sm:p-5 rounded-2xl">
                      <p className="text-[10px] sm:text-xs  text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Points par dépense</p>
                      <p className="text-base sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                        {loyaltyRules.pointsPerSpend} point / 1 000 Fc dépensé
                      </p>
                    </Card>

                    <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 border border-blue-100 dark:border-blue-900/30 p-4 sm:p-5 rounded-2xl">
                      <p className="text-[10px] sm:text-xs  text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Récompense par visites</p>
                      <p className="text-base sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                        Service gratuit après {loyaltyRules.appointmentsForReward} rendez-vous
                      </p>
                    </Card>

                    <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/50 border border-green-100 dark:border-green-900/30 p-4 sm:p-5 rounded-2xl">
                      <p className="text-[10px] sm:text-xs  text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Récompense par parrainages</p>
                      <p className="text-base sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                        Service gratuit après {loyaltyRules.referralsForReward} parrainages
                      </p>
                    </Card>
                  </div>
                </Card>

                <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/20">
                      <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100">Paliers de Récompenses</h3>
                  </div>

                  <div className="space-y-4">
                    {loyaltyRules.rewards.map((reward, idx) => (
                      <Card key={idx} className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 border border-amber-100 dark:border-amber-900/30 p-4 sm:p-5 rounded-2xl hover:shadow-md transition-all">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-base sm:text-lg  text-gray-900 dark:text-gray-100 mb-1">{reward.reward}</p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                              {reward.points} points requis
                            </p>
                          </div>
                          <Badge className="bg-amber-500 dark:bg-amber-600 text-white border-0 font-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg shadow-amber-500/20 text-[10px] sm:text-xs">
                            {reward.points} PTS
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 lg:col-span-2">
                  <h3 className="text-xl sm:text-2xl  text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                    Statistiques Programme Fidélité
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-100 dark:border-blue-900/30 text-center">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <p className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">{allClients.length}</p> {/* Use real count */}
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase  mt-2 tracking-widest">Membres Actifs</p>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/30 text-center">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                      <p className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">{loyaltyPoints}</p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase  mt-2 tracking-widest">Points Totaux</p>
                    </div>
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-green-100 dark:border-green-900/30 text-center">
                      <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                      <p className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">38 {/* Replace with real count from API */}</p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase  mt-2 tracking-widest">Utilisées</p>
                    </div>
                    <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-100 dark:border-amber-900/30 text-center">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                      <p className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">+15%</p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase  mt-2 tracking-widest">Rétention</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns Tab - Placeholder */}
            {/* <TabsContent value="campaigns" className="space-y-12">
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                <h3 className="text-xl  text-gray-900 dark:text-gray-100 mb-2">Campagnes Marketing</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Consultez ici les campagnes en cours et les offres spéciales envoyées par email ou SMS.
                </p>
                <Link href="/marketing">
                  <Button className="mt-6 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6 px-8  shadow-md">
                    Voir Campagnes
                  </Button>
                </Link>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mb-0 bg-linear-to-r from-pink-500 to-purple-500 dark:from-pink-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl  text-white mb-4">
            Transformez votre routine beauté
          </h2>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            Devenez membre dès aujourd'hui et profitez d'une expérience sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="sm" className="bg-white text-pink-600 hover:bg-gray-100 rounded-full text-base sm:text-lg  shadow-md">
                Devenir Membre
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="sm" className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full text-base sm:text-lg ">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};