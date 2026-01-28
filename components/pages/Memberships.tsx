"use client"

import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Star, Award, Gift, Calendar, Home, ShoppingBag, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '../HeroSection';

export default function Memberships() {
  const faqs = [
    {
      question: 'Comment fonctionne l\'abonnement ?',
      answer: 'Votre abonnement est activé dès le paiement et vous donne accès à tous les avantages pour la durée choisie (3 ou 6 mois). Vous pouvez réserver vos rendez-vous à tout moment via votre espace client.'
    },
    {
      question: 'Puis-je annuler mon abonnement ?',
      answer: 'Les abonnements ne sont pas remboursables, mais vous pouvez utiliser tous vos crédits de rendez-vous jusqu\'à la fin de votre période d\'abonnement. Vous pouvez choisir de ne pas renouveler à la fin de la période.'
    },
    {
      question: 'Que se passe-t-il si je n\'utilise pas tous mes rendez-vous ?',
      answer: 'Les rendez-vous non utilisés expirent à la fin de votre période d\'abonnement. Nous vous recommandons de planifier vos soins à l\'avance pour profiter pleinement de votre abonnement.'
    },
    {
      question: 'Les prestations à domicile sont-elles disponibles partout à Kinshasa ?',
      answer: 'Oui, nous couvrons toute la zone de Kinshasa. Des frais de déplacement peuvent s\'appliquer pour les zones éloignées du centre-ville.'
    },
    {
      question: 'Comment renouveler mon abonnement ?',
      answer: 'Vous recevrez un rappel 2 semaines avant la fin de votre abonnement. Vous pouvez renouveler directement depuis votre espace client ou nous contacter.'
    }
  ];

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <HeroSection
        imageUrl='/portrait-beautiful.jpg'
        title="Rejoignez notre cercle de "
        subtitle='clientes privilégiées'
        description="Économisez jusqu'à 30% sur vos soins préférés et profitez d'avantages exclusifs avec nos formules d'abonnement"
        badgeText='nos abonnements'
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 dark:bg-gray-950">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200">
            <Award className="w-4 h-4 mr-2" />
            Abonnements Premium
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Plans d'abonnement</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Choisissez le plan qui correspond à vos besoins</p>
        </div>

        {/* Membership Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-24">
          {/* 3 Months Plan */}
          <Card className="bg-linear-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-2 border-pink-200 dark:border-pink-900 shadow-xl rounded-3xl overflow-hidden transform hover:scale-105 transition-transform">
            <div className="p-6 sm:p-10">
              <Badge className="mb-6 bg-pink-500 dark:bg-pink-600 text-white text-xs sm:text-sm px-4 py-1">Standard</Badge>
              <h2 className="text-2xl sm:text-4xl text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Abonnement 3 Mois</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">Parfait pour découvrir nos services</p>

              <div className="flex items-baseline mb-8 sm:mb-10">
                <span className="text-4xl sm:text-6xl text-gray-900 dark:text-gray-100">120 000</span>
                <span className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 ml-2">CDF</span>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">5 rendez-vous salon</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Valables 3 mois</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">3 prestations à domicile</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Dans la zone de Kinshasa</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">10% de réduction</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sur tous les produits de beauté</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-500 dark:bg-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">Points de fidélité doublés</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sur tous vos rendez-vous</p>
                  </div>
                </div>
              </div>

              <Link href="/signup">
                <Button className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-4 sm:py-6 text-sm sm:text-lg">
                  S'abonner maintenant
                </Button>
              </Link>
            </div>
          </Card>

          {/* 6 Months Plan - Premium */}
          <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-2 border-amber-300 dark:border-amber-900 shadow-2xl rounded-3xl overflow-hidden relative transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-bl-3xl">
              <span className="flex items-center text-xs sm:text-lg">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Meilleure Offre
              </span>
            </div>

            <div className="p-6 sm:p-10">
              <Badge className="mb-6 bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white text-xs sm:text-sm px-4 py-1">Premium</Badge>
              <h2 className="text-2xl sm:text-4xl text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Abonnement 6 Mois</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">Maximum d'avantages et d'économies</p>

              <div className="flex items-baseline mb-2">
                <span className="text-4xl sm:text-6xl text-gray-900 dark:text-gray-100">210 000</span>
                <span className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 ml-2">CDF</span>
              </div>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mb-8 sm:mb-10">Économisez 30 000 CDF par rapport au plan 3 mois ×2</p>

              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">10 rendez-vous salon</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Valables 6 mois</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">6 prestations à domicile</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Dans la zone de Kinshasa</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">20% de réduction</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sur tous les produits de beauté</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">Accès prioritaire Best Client Award</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Événement exclusif annuel</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">1 soin gratuit au choix</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cadeau de bienvenue</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">Points de fidélité triplés</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sur tous vos rendez-vous</p>
                  </div>
                </div>
              </div>

              <Link href="/signup">
                <Button className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-4 sm:py-6 text-sm sm:text-lg">
                  Devenir membre Premium
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Benefits Comparison */}
        <div className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 mb-10 sm:mb-12 text-center">Comparaison des avantages</h2>
          <Card className="bg-white dark:bg-gray-900 border-b border-pink-100 dark:border-pink-900 shadow-xl rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-pink-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm text-gray-900 dark:text-gray-100">Avantages</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">Standard (3 mois)</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">Premium (6 mois)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Rendez-vous salon</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">5</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">10</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Prestations à domicile</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">3</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">6</td>
                  </tr>
                  <tr>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Réduction produits</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">10%</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">20%</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Points de fidélité</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">×2</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-900 dark:text-gray-100">×3</td>
                  </tr>
                  <tr>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Best Client Award</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-600">—</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Soin gratuit</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-600">—</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-green-600 dark:text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 mb-10 sm:mb-12 text-center">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-900 border-b border-pink-100 dark:border-pink-900 shadow-md rounded-2xl px-4 sm:px-6">
                <AccordionTrigger className="text-left text-sm sm:text-base text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="mb-0 sm:mb-6 text-center">
          <div className="bg-linear-to-br from-pink-500 via-purple-500 to-amber-500 dark:from-pink-900 dark:via-purple-900 dark:to-amber-900 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4 sm:mb-6">
              Prête à rejoindre notre communauté ?
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-pink-100 dark:text-pink-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Profitez dès maintenant des avantages exclusifs de nos abonnements Beauty Nails
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-base w-full sm:w-auto">
                  S'abonner maintenant
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white dark:border-gray-300 text-white dark:text-gray-100 hover:bg-white/10 dark:hover:bg-white/5 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-base w-full sm:w-auto">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
