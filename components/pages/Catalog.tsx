"use client"
import { useState } from 'react';
import { Card } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Clock, DollarSign, Sparkles, Package, ShoppingBag, Tag, Star } from 'lucide-react';
import { ImageWithFallback } from 'components/figma/ImageWithFallback';
import Link from 'next/link';

export default function Catalog() {
  const [activeTab, setActiveTab] = useState('services');

  // Reuse service data
  const services = [
    {
      category: 'Onglerie',
      items: [
        { name: 'Manucure Gel', price: '25 000 Fc', duration: '60 min', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=60' },
        { name: 'Pédicure Spa', price: '20 000 Fc', duration: '60 min', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=800&auto=format&fit=crop&q=60' }
      ]
    },
    {
      category: 'Cils & Sourcils',
      items: [
        { name: 'Extensions Volume Russe', price: '60 000 Fc', duration: '150 min', image: 'https://images.unsplash.com/photo-1587776536125-e1b790d93708?w=800&auto=format&fit=crop&q=60' },
        { name: 'Microblading', price: '150 000 Fc', duration: '120 min', image: 'https://images.unsplash.com/photo-1599692994476-b5190d7945e4?w=800&auto=format&fit=crop&q=60' }
      ]
    }
  ];

  const products = [
    { name: 'Huile Cuticules Bio', price: '15 000 Fc', brand: 'Beauty Nails', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60' },
    { name: 'Sérum Cils Croissance', price: '35 000 Fc', brand: 'Lash Pro', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&auto=format&fit=crop&q=60' },
    { name: 'Kit Entretien Tresses', price: '25 000 Fc', brand: 'Afro Care', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop&q=60' },
    { name: 'Palette Maquillage Nude', price: '45 000 Fc', brand: 'Glamour', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=60' }
  ];

  const packages = [
    {
      name: 'Mariée VIP',
      price: '250 000 Fc',
      oldPrice: '300 000 Fc',
      includes: ['Essai Maquillage', 'Manucure & Pédicure Gel', 'Soin Visage Éclat', 'Maquillage Jour J'],
      duration: 'Validité 3 mois',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=60'
    },
    {
      name: 'Détente Totale',
      price: '85 000 Fc',
      oldPrice: '110 000 Fc',
      includes: ['Massage 60min', 'Pédicure Spa', 'Thé Gourmand'],
      duration: 'Validité 6 mois',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=60'
    }
  ];

  const promotions = [
    {
      title: 'Offre Découverte',
      discount: '-20%',
      description: 'Sur votre première visite pour tout service de plus de 30 000 Fc',
      code: 'WELCOME20',
      validUntil: '31 Déc 2026',
      bg: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      title: 'Parrainage',
      discount: '10 000 Fc',
      description: 'Offert à vous et votre amie pour chaque parrainage validé',
      code: 'FRIENDS',
      validUntil: 'Illimité',
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen py-24 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Catalogue Complet
          </Badge>
          <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-gray-100 mb-6">
            Services, Produits & Offres
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Tout l'univers Beauty Nails réuni au même endroit. Découvrez nos prestations,
            nos produits de soin et nos offres exclusives.
          </p>
        </div>

        <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
              <TabsTrigger value="services" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Sparkles className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="packages" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Package className="w-4 h-4 mr-2" />
                Forfaits
              </TabsTrigger>
              <TabsTrigger value="promotions" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">
                <Tag className="w-4 h-4 mr-2" />
                Promotions
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Services Content */}
          <TabsContent value="services" className="space-y-12">
            {services.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-pink-500 rounded-full block"></span>
                  {cat.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cat.items.map((service, sIdx) => (
                    <Card key={sIdx} className="overflow-hidden border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all group">
                      <div className="h-48 overflow-hidden relative">
                        <ImageWithFallback src={service.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-gray-100">
                          {service.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{service.name}</h4>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-pink-600 font-bold text-lg">{service.price}</span>
                          <Button size="sm" className="rounded-full bg-black text-white hover:bg-gray-800">
                            Réserver
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <Link href="/services">
                <Button variant="outline" className="rounded-full border-pink-200 text-pink-600">
                  Voir tous les services
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Products Content */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <Card key={idx} className="overflow-hidden border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all group">
                  <div className="h-64 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                    <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                    <Button
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white text-black hover:bg-gray-100"
                    >
                      Ajouter au panier
                    </Button>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h4>
                    <p className="text-pink-600 font-bold">{product.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Packages Content */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages.map((pkg, idx) => (
                <Card key={idx} className="overflow-hidden border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900 shadow-lg flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-64 md:h-auto relative">
                    <ImageWithFallback src={pkg.image} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                      Best Seller
                    </div>
                  </div>
                  <div className="p-6 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-pink-600">{pkg.price}</span>
                        <span className="text-lg text-gray-400 line-through">{pkg.oldPrice}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {pkg.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {pkg.duration}
                      </span>
                      <Button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        Choisir ce forfait
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Promotions Content */}
          <TabsContent value="promotions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo, idx) => (
                <Card key={idx} className={`${promo.bg} text-white p-8 rounded-2xl relative overflow-hidden`}>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                        Offre Spéciale
                      </Badge>
                      <span className="text-sm opacity-80">Valide jusqu'au {promo.validUntil}</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{promo.title}</h3>
                    <p className="text-white/90 mb-6 text-lg">{promo.description}</p>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/20">
                      <div>
                        <p className="text-xs opacity-70">Code Promo</p>
                        <p className="text-2xl font-mono font-bold tracking-wider">{promo.code}</p>
                      </div>
                      <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                        Copier
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
