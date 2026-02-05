"use client"
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Scissors, ShoppingBag, Package, Percent, Award, Star, Clock, DollarSign, Sparkles, Users, Calendar } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { usePackages } from '@/lib/hooks/usePackages';
import { useDiscounts } from '@/lib/hooks/useMarketing';
import { useLoyalty } from '@/lib/hooks/useLoyalty';
import { Service } from '@/lib/api/services';
import { ServicePackage } from '@/lib/api/packages';
import { DiscountCode } from '@/lib/api/marketing';
import { LoyaltyTransaction } from '@/lib/api/loyalty';
import Link from 'next/link';
import { useInventory } from '@/lib/hooks/useInventory';
import LoaderBN from '../Loader-BN';

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState('services');

  // Fetch data using hooks
  const { services, isLoading: servicesLoading } = useServices();
  const { inventory: products, isLoading: productsLoading } = useInventory(); // Placeholder hook
  const { packages, isLoading: packagesLoading } = usePackages();
  const { discounts, isLoading: discountsLoading } = useDiscounts();
  const { points: loyaltyPoints, tier: loyaltyTier, transactions: loyaltyTransactions, isLoading: loyaltyLoading } = useLoyalty();

  const isLoading = servicesLoading || productsLoading || packagesLoading || discountsLoading || loyaltyLoading;

  if (isLoading) {
    return <LoaderBN />;
  }

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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl mb-16 lg:mb-12">
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
              <TabsTrigger value="campaigns" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Sparkles className="w-4 h-4 mr-2" /> Campagnes
              </TabsTrigger>
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
                        <Button className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-6  shadow-md">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Loyalty Stats & Info */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl   text-gray-900 dark:text-gray-100">Votre Statut Fidélité</h2>
                      <Badge className="bg-amber-500 text-white">{loyaltyTier || 'Standard'}</Badge>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 mb-8">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      Points actuels: <span className=" text-amber-600 dark:text-amber-400 text-2xl">{loyaltyPoints}</span>
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Comment accumuler des points ?</AccordionTrigger>
                      <AccordionContent>
                        Gagnez 1 point pour chaque 1000 Fc dépensés. Obtenez des points bonus pour les anniversaires, parrainages et participation à des événements.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Quels sont les paliers de récompenses ?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>100 points: Manucure gratuite</li>
                          <li>250 points: Extension cils gratuite</li>
                          <li>500 points: 50% sur tous services</li>
                          <li>1000 points: Journée beauté complète gratuite</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Recent Rewards */}
                <div>
                  <h3 className="text-xl  text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Récompenses Récentes
                  </h3>
                  <div className="space-y-4">
                    {loyaltyRewards.length > 0 ? (
                      loyaltyRewards.map(tx => (
                        <Card key={tx.id} className="p-4 bg-white dark:bg-gray-900 border-b border-amber-100 dark:border-amber-900 shadow-sm rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">{tx.description || tx.type}</span>
                            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                              -{tx.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Aucune récompense récente.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Campaigns Tab - Placeholder */}
            <TabsContent value="campaigns" className="space-y-12">
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
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-pink-500 to-purple-500 dark:from-pink-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl  text-white mb-4">
            Transformez votre routine beauté
          </h2>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            Devenez membre dès aujourd'hui et profitez d'une expérience sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-pink-600 hover:bg-gray-100 rounded-full px-8 py-6 text-base sm:text-lg  shadow-md">
                Devenir Membre
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base sm:text-lg ">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};