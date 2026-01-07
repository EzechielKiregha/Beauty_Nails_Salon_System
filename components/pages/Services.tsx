import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, DollarSign, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import Link from 'next/link';
import HeroSection from '../HeroSection';

export default function Services() {
  const serviceCategories = [
    {
      id: 'onglerie',
      name: 'Onglerie',
      icon: '💅',
      description: 'Des ongles sublimes pour toutes les occasions',
      image: 'https://images.unsplash.com/photo-1737214475335-8ed64d91f473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlsJTIwYXJ0JTIwbWFuaWN1cmV8ZW58MXx8fHwxNzYyMzI1MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-pink-400 to-rose-400',
      services: [
        { name: 'Manucure Classique', duration: '45 min', price: '15 000 CDF' },
        { name: 'Manucure Gel', duration: '60 min', price: '25 000 CDF' },
        { name: 'Pédicure Spa', duration: '60 min', price: '20 000 CDF' },
        { name: 'Nail Art Simple', duration: '30 min', price: '10 000 CDF' },
        { name: 'Nail Art Complexe', duration: '60 min', price: '25 000 CDF' },
        { name: 'Extensions Ongles', duration: '90 min', price: '35 000 CDF' }
      ]
    },
    {
      id: 'cils',
      name: 'Cils',
      icon: '👁️',
      description: 'Un regard intense et captivant',
      image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-400 to-pink-400',
      services: [
        { name: 'Extensions de Cils Volume Naturel', duration: '120 min', price: '40 000 CDF' },
        { name: 'Extensions de Cils Volume Russe', duration: '150 min', price: '60 000 CDF' },
        { name: 'Rehaussement de Cils', duration: '60 min', price: '25 000 CDF' },
        { name: 'Teinture de Cils', duration: '30 min', price: '10 000 CDF' },
        { name: 'Remplissage Cils 2-3 Semaines', duration: '90 min', price: '25 000 CDF' }
      ]
    },
    {
      id: 'tresses',
      name: 'Tresses',
      icon: '💇‍♀️',
      description: 'Coiffures créatives et professionnelles',
      image: 'https://images.unsplash.com/photo-1702236242829-a34c39814f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwYnJhaWRpbmclMjBzYWxvbnxlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-amber-400 to-orange-400',
      services: [
        { name: 'Tresses Simples', duration: '120 min', price: '30 000 CDF' },
        { name: 'Tresses Box Braids', duration: '180 min', price: '45 000 CDF' },
        { name: 'Tissage avec Closure', duration: '150 min', price: '50 000 CDF' },
        { name: 'Tissage avec Frontal', duration: '180 min', price: '65 000 CDF' },
        { name: 'Crochet Braids', duration: '120 min', price: '35 000 CDF' },
        { name: 'Locks / Dreads', duration: '240 min', price: '80 000 CDF' }
      ]
    },
    {
      id: 'maquillage',
      name: 'Maquillage',
      icon: '💄',
      description: 'Sublimez votre visage pour chaque événement',
      image: 'https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhcnRpc3R8ZW58MXx8fHwxNzYyMjgzMTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-rose-400 to-pink-400',
      services: [
        { name: 'Maquillage Quotidien', duration: '45 min', price: '20 000 CDF' },
        { name: 'Maquillage Soirée', duration: '60 min', price: '30 000 CDF' },
        { name: 'Maquillage Mariage', duration: '90 min', price: '50 000 CDF' },
        { name: 'Maquillage Photo/Vidéo', duration: '75 min', price: '40 000 CDF' },
        { name: 'Cours Maquillage Personnel', duration: '120 min', price: '60 000 CDF' }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        imageUrl='/nos services.jpg'
        title="Des services d'excellence pour"
        subtitle='votre beauté'
        description="Découvrez notre gamme complète de services professionnels de beauté.
            Chaque prestation est réalisée par nos expertes dans un environnement luxueux et relaxant."
        badgeText='nos services'
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 text-pink-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Nos Services
          </Badge>
        </div>
        {/* Service Categories */}
        <div className="space-y-24">
          {serviceCategories.map((category) => (
            <div key={category.id} id={category.id}>
              {/* Category Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-amber-400 rounded-2xl opacity-20 blur-2xl" />
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                  />
                </div>

                <div className="order-1 lg:order-2">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h2 className="text-4xl text-gray-900 mb-4">{category.name}</h2>
                  <p className="text-xl text-gray-600 mb-6">{category.description}</p>
                  <Link href={`/services/${category.id}`}>
                    <Button className="bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8">
                      Voir les détails
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, index) => (
                  <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl">
                    <h3 className="text-xl text-gray-900 mb-4">{service.name}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-pink-500" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="text-lg">{service.price}</span>
                      </div>
                    </div>
                    <Link href="/appointments">
                      <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full">
                        Réserver ce service
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-24 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Options supplémentaires</h2>
            <p className="text-gray-600">Personnalisez votre expérience avec nos services additionnels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-0 shadow-md p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl text-gray-900 mb-2">Prestation à domicile</h3>
              <p className="text-gray-600 mb-3">+ 20 000 CDF</p>
              <p className="text-sm text-gray-500">Profitez de nos services dans le confort de votre domicile</p>
            </Card>

            <Card className="bg-white border-0 shadow-md p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl text-gray-900 mb-2">Rendez-vous express</h3>
              <p className="text-gray-600 mb-3">+ 10 000 CDF</p>
              <p className="text-sm text-gray-500">Service prioritaire pour les emplois du temps chargés</p>
            </Card>

            <Card className="bg-white border-0 shadow-md p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl text-gray-900 mb-2">Produits premium</h3>
              <p className="text-gray-600 mb-3">+ 15 000 CDF</p>
              <p className="text-sm text-gray-500">Utilisation de produits haut de gamme exclusifs</p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl text-gray-900 mb-6">Prête à réserver votre moment beauté ?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointments">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8">
                Prendre rendez-vous
              </Button>
            </Link>
            <Link href="/memberships">
              <Button size="lg" variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full px-8">
                Voir les abonnements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
