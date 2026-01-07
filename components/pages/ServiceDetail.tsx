'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, DollarSign, Star, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function ServiceDetail() {
  const params = useParams();
  const category = params?.id as string;

  const serviceData: Record<string, any> = {
    onglerie: {
      name: 'Onglerie',
      icon: '💅',
      description: 'Des ongles sublimes pour toutes les occasions. Notre équipe experte utilise des produits de qualité premium pour des résultats durables et élégants.',
      image: 'https://images.unsplash.com/photo-1737214475335-8ed64d91f473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlsJTIwYXJ0JTIwbWFuaWN1cmV8ZW58MXx8fHwxNzYyMzI1MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      services: [
        {
          name: 'Manucure Classique',
          duration: '45 min',
          price: '15 000 CDF',
          description: 'Soin complet des ongles avec mise en forme, cuticules, massage des mains et pose de vernis classique.',
          addons: ['Nail art simple (+10 000 CDF)', 'Paraffine (+5 000 CDF)']
        },
        {
          name: 'Manucure Gel',
          duration: '60 min',
          price: '25 000 CDF',
          description: 'Manucure avec vernis gel semi-permanent pour une tenue jusqu\'à 3 semaines.',
          addons: ['Nail art complexe (+15 000 CDF)', 'French manucure (+5 000 CDF)']
        },
        {
          name: 'Pédicure Spa',
          duration: '60 min',
          price: '20 000 CDF',
          description: 'Soin luxueux des pieds avec bain relaxant, gommage, massage et pose de vernis.',
          addons: ['Vernis gel (+10 000 CDF)', 'Paraffine (+5 000 CDF)']
        },
        {
          name: 'Extensions Ongles',
          duration: '90 min',
          price: '35 000 CDF',
          description: 'Pose d\'extensions en gel ou résine pour des ongles longs et élégants.',
          addons: ['Nail art personnalisé (+20 000 CDF)', 'Déco strass (+10 000 CDF)']
        }
      ]
    },
    cils: {
      name: 'Cils',
      icon: '👁️',
      description: 'Un regard intense et captivant avec nos extensions et traitements de cils professionnels.',
      image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      services: [
        {
          name: 'Extensions de Cils Volume Naturel',
          duration: '120 min',
          price: '40 000 CDF',
          description: 'Extensions cil par cil pour un effet naturel et élégant.',
          addons: ['Teinture des cils (+5 000 CDF)']
        },
        {
          name: 'Extensions de Cils Volume Russe',
          duration: '150 min',
          price: '60 000 CDF',
          description: 'Technique de pose en éventail pour un volume spectaculaire et glamour.',
          addons: ['Effet ombré (+10 000 CDF)', 'Strass (+8 000 CDF)']
        },
        {
          name: 'Rehaussement de Cils',
          duration: '60 min',
          price: '25 000 CDF',
          description: 'Traitement qui relève et courbe naturellement vos cils pour 6-8 semaines.',
          addons: ['Teinture incluse']
        }
      ]
    },
    tresses: {
      name: 'Tresses',
      icon: '💇‍♀️',
      description: 'Coiffures créatives et professionnelles adaptées à votre style et personnalité.',
      image: 'https://images.unsplash.com/photo-1702236242829-a34c39814f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwYnJhaWRpbmclMjBzYWxvbnxlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      services: [
        {
          name: 'Tresses Box Braids',
          duration: '180 min',
          price: '45 000 CDF',
          description: 'Tresses carrées classiques, protectrices et stylées.',
          addons: ['Rajouts premium (+15 000 CDF)', 'Perles décoratives (+8 000 CDF)']
        },
        {
          name: 'Tissage avec Closure',
          duration: '150 min',
          price: '50 000 CDF',
          description: 'Pose de tissage professionnel avec closure pour un résultat naturel.',
          addons: ['Cheveux premium (+25 000 CDF)', 'Coupe + brushing (+10 000 CDF)']
        },
        {
          name: 'Crochet Braids',
          duration: '120 min',
          price: '35 000 CDF',
          description: 'Technique rapide et polyvalente pour différents styles.',
          addons: ['Cheveux bouclés premium (+12 000 CDF)']
        }
      ]
    },
    maquillage: {
      name: 'Maquillage',
      icon: '💄',
      description: 'Sublimez votre visage pour chaque événement avec notre expertise en maquillage professionnel.',
      image: 'https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhcnRpc3R8ZW58MXx8fHwxNzYyMjgzMTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      services: [
        {
          name: 'Maquillage Soirée',
          duration: '60 min',
          price: '30 000 CDF',
          description: 'Maquillage glamour pour vos soirées et événements spéciaux.',
          addons: ['Faux cils (+5 000 CDF)', 'Contouring avancé (+8 000 CDF)']
        },
        {
          name: 'Maquillage Mariage',
          duration: '90 min',
          price: '50 000 CDF',
          description: 'Maquillage longue tenue pour votre jour le plus important, avec essai inclus.',
          addons: ['Maquillage demoiselles d\'honneur (+20 000 CDF/personne)']
        },
        {
          name: 'Cours Maquillage Personnel',
          duration: '120 min',
          price: '60 000 CDF',
          description: 'Apprenez les techniques de maquillage adaptées à votre visage avec une experte.',
          addons: ['Kit maquillage recommandé (sur demande)']
        }
      ]
    }
  };

  const service = category ? serviceData[category] : null;

  if (!service) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl text-gray-900 mb-6">Service non trouvé</h1>
          <Link href="/services">
            <Button className="bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8">
              Retour aux services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/services" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux services
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-amber-400 rounded-2xl opacity-20 blur-2xl" />
            <ImageWithFallback
              src={service.image}
              alt={service.name}
              className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>

          <div>
            <div className="text-6xl mb-4">{service.icon}</div>
            <h1 className="text-5xl text-gray-900 mb-6">{service.name}</h1>
            <p className="text-xl text-gray-600 mb-8">{service.description}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-600">4.9/5 (158 avis)</span>
            </div>
            <Link href="/appointments">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8">
                Réserver maintenant
              </Button>
            </Link>
          </div>
        </div>

        {/* Services List */}
        <div>
          <h2 className="text-3xl text-gray-900 mb-8">Nos prestations {service.name.toLowerCase()}</h2>
          <div className="space-y-6">
            {service.services.map((item: any, index: number) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow p-8 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl text-gray-900 mb-3">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    {item.addons && item.addons.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Options supplémentaires :</p>
                        <ul className="space-y-1">
                          {item.addons.map((addon: string, i: number) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2" />
                              {addon}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-pink-500" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-2xl text-gray-900">{item.price}</span>
                      </div>
                    </div>
                    <Link href="/appointments" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full">
                        Réserver
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12">
          <h2 className="text-3xl text-gray-900 mb-8 text-center">Pourquoi choisir Beauty Nails ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Expertes Qualifiées</h3>
              <p className="text-gray-600 text-sm">Techniciennes certifiées et expérimentées</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Produits Premium</h3>
              <p className="text-gray-600 text-sm">Marques reconnues et de qualité</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Hygiène Stricte</h3>
              <p className="text-gray-600 text-sm">Stérilisation et protocoles sanitaires</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Ambiance Luxueuse</h3>
              <p className="text-gray-600 text-sm">Cadre élégant et relaxant</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl text-gray-900 mb-6">Prête à réserver votre prestation ?</h2>
          <Link href="/appointments">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-12">
              Prendre rendez-vous
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
