'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Star, Gift, Award, Users, Heart, CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import HeroSection, { CarouselService } from '../HeroSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { format } from 'date-fns';
import { useMemberships } from '@/lib/hooks/useMemberships';
import { useLoyalty } from '@/lib/hooks/useLoyalty';
import LoaderBN from '../Loader-BN';
import { LoyaltyTransaction } from '@/lib/api/loyalty';
import { Membership } from '@/lib/api/memberships';

export default function Home() {

  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [loading, setLoading] = useState(true);
  const { points: loyaltyPoints, tier: loyaltyTier, transactions: loyaltyTransactions, isLoading: loyaltyLoading } = useLoyalty();
  const { memberships, isLoading: membershipsLoading } = useMemberships();

  // --- Process Loyalty Data for Cards ---
  // Example: Show top 3 recent transactions as benefits/rewards claimed
  const recentRewards: LoyaltyTransaction[] = loyaltyTransactions?.slice(0, 3) || [];

  // --- Process Membership Data for Cards ---
  // Sort memberships by display order if available, otherwise by price or name
  const sortedMemberships = [...memberships].sort((a, b) => a.displayOrder - b.displayOrder);
  const displayedMemberships: Membership[] = sortedMemberships.slice(0, 3);
  const services = [
    {
      id: 'onglerie',
      name: 'Onglerie',
      description: 'Manucure, pédicure, nail art et extensions',
      icon: '💅',
      image: 'https://images.unsplash.com/photo-1737214475335-8ed64d91f473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlsJTIwYXJ0JTIwbWFuaWN1cmV8ZW58MXx8fHwxNzYyMzI1MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-pink-400 to-rose-400'
    },
    {
      id: 'cils',
      name: 'Cils',
      description: 'Extensions de cils, teinture et rehaussement',
      icon: '👁️',
      image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'tresses',
      name: 'Tresses',
      description: 'Tressage, tissage et coiffure créative',
      icon: '💇‍♀️',
      image: 'https://images.unsplash.com/photo-1702236242829-a34c39814f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwYnJhaWRpbmclMjBzYWxvbnxlbnwxfHx8fDE3NjIzNjE1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-amber-400 to-orange-400'
    },
    {
      id: 'maquillage',
      name: 'Maquillage',
      description: 'Maquillage événementiel et quotidien',
      icon: '💄',
      image: 'https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhcnRpc3R8ZW58MXx8fHwxNzYyMjgzMTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-rose-400 to-pink-400'
    }
  ];
  const [selectedService, setSelectedService] = React.useState<CarouselService | null>(services[0] ?? null);

  React.useEffect(() => {
    if (!selectedService && services.length > 0) {
      setSelectedService(services[0]);
    } else if (selectedService && !services.find(s => s.id === selectedService.id) && services.length > 0) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  const handleServiceChange = (service: CarouselService) => {
    setSelectedService(service);
  };

  const reserveHref = `/appointments?service=${encodeURIComponent(selectedService?.id ?? '')}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`;

  const testimonials = [
    {
      name: 'Marie Kabila',
      rating: 5,
      text: 'Un service exceptionnel ! L\'équipe est professionnelle et accueillante. Mes ongles n\'ont jamais été aussi beaux.',
      date: '15 Oct 2025'
    },
    {
      name: 'Grace Lumière',
      rating: 5,
      text: 'Les extensions de cils sont parfaites. Je recommande vivement Beauty Nails pour leur expertise.',
      date: '22 Oct 2025'
    },
    {
      name: 'Sophie Makala',
      rating: 5,
      text: 'L\'ambiance est luxueuse et relaxante. Le personnel est aux petits soins. Mon salon préféré !',
      date: '28 Oct 2025'
    }
  ];

  // Simulate initial loading delay for the loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  // Show loader initially
  if (loading || loyaltyLoading || membershipsLoading) {
    return <LoaderBN />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-150 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1632643746039-de953cb0f260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzYyMjYzMDgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Beauty Nails Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-pink-900/80 via-purple-900/70 to-amber-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-pink-500/20 text-pink-100 border-pink-300/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Votre Destination Beauté Premium
            </Badge>
            <h1 className="text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Sublimez votre beauté,<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-200 to-amber-200">
                un soin à la fois
              </span>
            </h1>
            <p className="text-xl text-pink-100 mb-8">
              Spécialistes en ongles, cils, tresses et maquillage. Découvrez l'excellence de nos services dans une ambiance luxueuse et relaxante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/appointments">
                <Button size="lg" className="bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Prendre rendez-vous maintenant
                </Button>
              </Link>
              <Link href="/catalog">
                <Button size="lg" variant="link" className="border-2 border-white text-gray-200 dark:text-white hover:bg-white/10 rounded-full px-8 backdrop-blur-sm">
                  Découvrir Nos Services, Produits & Offres
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Appointment Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-16 relative z-20 text-gray-200">
        <Card className="bg-white dark:bg-gray-950 border-b border-pink-100 dark:border-pink-900 shadow-2xl rounded-2xl p-6 ">
          <div className="flex flex-col lg:flex-row items-end gap-4">
            {/* Service Select */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Service</label>
              <Select value={selectedService?.id ?? ''} onValueChange={(value) => {
                const s = services.find((svc) => svc.id === value)
                if (s) setSelectedService(s)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>
                      <span className="mr-2">{svc.icon}</span>
                      {svc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(new Date(selectedDate), 'PPP') : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date.toISOString().split('T')[0]);
                      }
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Select */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Heure</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une heure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    09:00
                  </SelectItem>
                  <SelectItem value="10:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    10:00
                  </SelectItem>
                  <SelectItem value="11:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    11:00
                  </SelectItem>
                  <SelectItem value="14:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    14:00
                  </SelectItem>
                  <SelectItem value="15:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    15:00
                  </SelectItem>
                  <SelectItem value="16:00">
                    <Clock className="inline mr-2 h-4 w-4" />
                    16:00
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reserve Button */}
            <div className="w-full lg:w-auto">
              <Link href={reserveHref}>
                <Button className="w-full lg:w-auto bg-linear-to-br from-gray-900 via-pink-800 to-pink-600 hover:from-pink-600 hover:via-pink-800 hover:to-gray-900 text-white rounded-xl px-8 py-6">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Services Preview */}
      <section className=" bg-background pt-16 dark:bg-gray-950">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200">Nos Services</Badge>
          <h2 className="  text-4xl text-gray-900 dark:text-gray-100 mb-4">
            Des services d'excellence pour votre beauté
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services professionnels dans un cadre luxueux
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <Card className="group cursor-pointer overflow-hidden bg-white dark:bg-gray-950 border-b border-pink-100 dark:border-pink-900 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Softer overlay so images remain visible */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-30 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute top-4 left-4 text-4xl">{service.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-gray-900 dark:text-gray-100 mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="flex items-center text-pink-500 group-hover:text-pink-600">
                    <span className="mr-2">En savoir plus</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-background dark:bg-gray-950">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200">Nos Abonnements</Badge>
          <h2 className="  text-4xl text-gray-900 dark:text-gray-100 mb-4">
            Rejoignez notre cercle de clientes privilégiées
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Économisez jusqu'à 30% sur vos soins préférés et profitez d'avantages exclusifs avec nos formules.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedMemberships.map((membership, index) => {
              // Assign colors based on index or specific plan characteristics
              const colorClasses = [
                "from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-purple-300 dark:border-purple-900",
                "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-300 dark:border-amber-900",
                "from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-2 border-blue-300 dark:border-blue-900",
              ][index % 3];

              const badgeColor = [
                "bg-purple-500",
                "bg-amber-500",
                "bg-blue-500",
              ][index % 3];

              const linearBg = [
                "bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
                "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
              ][index % 3];

              return (
                <Card key={membership.id} className={`bg-linear-to-br ${colorClasses} shadow-2xl rounded-3xl overflow-hidden relative transform hover:scale-[1.02] transition-transform ${index === 1 ? 'ring-4 ring-amber-400 dark:ring-amber-600 -translate-y-2' : ''}`}>
                  {/* Popular Badge for second item (example logic) */}
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white px-6 py-2 rounded-bl-3xl z-10">
                      <span className="flex items-center text-sm ">
                        <Star className="w-4 h-4 mr-1" />
                        Populaire
                      </span>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Badge className={`${badgeColor} text-white`}>
                          {membership.name}
                        </Badge>
                        <h3 className="text-3xl text-gray-900 dark:text-gray-100 mt-4 mb-2">{membership.name}</h3>
                        <div className="flex items-baseline mb-6">
                          <span className="text-5xl text-gray-900 dark:text-gray-100">{membership.price.toLocaleString()}</span>
                          <span className="text-xl text-gray-600 dark:text-gray-300 ml-2">Fc</span>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {membership.benefits.map((benefit: any, idx: any) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center mr-3 shrink-0">
                            <span className="text-white text-xs ">✓</span>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup"> {/* Or a specific purchase route */}
                      <Button className={`w-full ${linearBg} text-white rounded-full py-4 text-lg  shadow-md`}>
                        {membership.name.includes('Premium') ? 'Devenir membre Premium' : 'S\'abonner maintenant'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
          <Link href="/memberships">
            <Button variant="link" className="text-purple-600 dark:text-purple-400 underline">
              Voir tout
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 bg-background dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200">
              <Heart className="w-4 h-4 mr-2" />
              Témoignages
            </Badge>
            <h2 className="  text-4xl text-gray-900 dark:text-gray-100 mb-4">
              Ce que nos clientes disent de nous
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-2xl text-gray-600 dark:text-gray-300">4.9/5</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Basé sur 247+ avis Trustpilot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-950 border-b border-pink-100 dark:border-pink-900 shadow-2xl p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{testimonial.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-900 via-pink-800 to-pink-600 hover:from-pink-600 hover:via-pink-800 hover:to-gray-900 flex items-center justify-center text-white text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente vérifiée</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button variant="outline" className="border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full px-8">
                Voir tous les témoignages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-pink-400 to-amber-400 rounded-2xl opacity-20 blur-2xl" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1595944024804-733665a112db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBuYWlsJTIwc2Fsb24lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIzNjE1OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Beauty Nails Salon Interior"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>

          <div>
            <Badge className="mb-4 bg-pink-100 text-pink-600">Notre Histoire</Badge>
            <h2 className="  text-4xl text-gray-900 dark:text-gray-200 mb-6">
              La beauté au service du bien-être
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200 mb-6">
              Beauty Nails est née d'une passion pour la beauté et le bien-être. Nous croyons que chaque femme mérite de se sentir sublime et confiante.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-200 mb-8">
              Notre équipe de professionnels qualifiés utilise les meilleures techniques et produits pour vous offrir une expérience luxueuse et des résultats exceptionnels.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-pink-50 dark:bg-gray-950 border-b border-pink-100 dark:border-pink-900 shadow-2xl">
                <div className="text-4xl text-pink-600 mb-2">5+</div>
                <div className="text-gray-600 dark:text-gray-200">Années d'expérience</div>
              </div>
              <div className="text-center p-6 bg-amber-50 dark:bg-gray-950 border-b border-pink-100 dark:border-pink-900 shadow-2xl">
                <div className="text-4xl text-amber-600 mb-2">200+</div>
                <div className="text-gray-600 dark:text-gray-200">Clientes satisfaites</div>
              </div>
            </div>

            <Link href="/about">
              <Button className="bg-linear-to-br from-gray-900 via-pink-800 to-pink-600 hover:from-pink-600 hover:via-pink-800 hover:to-gray-900 text-white rounded-full px-8">
                Découvrir notre équipe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-pink-500 to-purple-500 dark:from-pink-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl  text-white mb-4">
            Prête à sublimer votre beauté ?
          </h2>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            Réservez dès maintenant votre prochain rendez-vous et profitez d'une expérience beauté exceptionnelle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointments">
              <Button className="bg-white text-pink-600 hover:bg-gray-100 rounded-full px-8 py-6 text-base sm:text-lg  shadow-md">
                Réserver maintenant
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
}
