"use client"
import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Heart, Award, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function JoinTeam() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    toast.success('Candidature envoyée !', {
      description: 'Nous examinerons votre profil et vous contacterons bientôt.'
    });
    setFormData({ name: '', email: '', phone: '', position: '', experience: '', message: '' });
  };

  const positions = [
    {
      title: 'Spécialiste Ongles',
      description: 'Expert(e) en manucure, pédicure et nail art',
      requirements: ['Certification en onglerie', 'Minimum 2 ans d\'expérience', 'Maîtrise du gel et des extensions']
    },
    {
      title: 'Experte Cils',
      description: 'Spécialiste en extensions et traitements de cils',
      requirements: ['Formation certifiée', 'Expérience en volume russe', 'Précision et patience']
    },
    {
      title: 'Coiffeuse Professionnelle',
      description: 'Experte en tresses, tissage et coiffures créatives',
      requirements: ['Formation professionnelle', '3+ ans d\'expérience', 'Créativité et polyvalence']
    },
    {
      title: 'Maquilleuse',
      description: 'Artiste du maquillage pour tous événements',
      requirements: ['Portfolio démontrable', 'Connaissance des tendances', 'Maîtrise de différentes techniques']
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: 'Salaire Compétitif',
      description: 'Rémunération attractive avec commissions sur vos prestations',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: 'Formation Continue',
      description: 'Opportunités de formation et de développement professionnel',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: 'Environnement Agréable',
      description: 'Ambiance de travail conviviale et professionnelle',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: 'Produits Premium',
      description: 'Travaillez avec les meilleures marques et équipements',
      color: 'from-amber-400 to-orange-400'
    }
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 text-pink-600">
            <Users className="w-4 h-4 mr-2" />
            Carrières
          </Badge>
          <h1 className="text-5xl text-gray-900 mb-6">
            Rejoignez l'équipe Beauty Nails
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Faites partie d'une équipe passionnée et talentueuse dans le plus beau salon de Kinshasa
          </p>
        </div>

        {/* Why Join Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-4xl text-gray-900 mb-6">
              Pourquoi travailler chez Beauty Nails ?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Beauty Nails n'est pas qu'un salon de beauté, c'est une famille. Nous investissons dans notre équipe
              et créons un environnement où chaque membre peut s'épanouir professionnellement et personnellement.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Nous recherchons des professionnelles passionnées, créatives et dévouées qui partagent notre vision
              de l'excellence et du service client exceptionnel.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-pink-50 rounded-2xl">
                <div className="text-4xl text-pink-600 mb-2">8</div>
                <div className="text-sm text-gray-600">Membres de l'équipe</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="text-4xl text-purple-600 mb-2">5+</div>
                <div className="text-sm text-gray-600">Années d'expérience</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-pink-400 to-amber-400 rounded-2xl opacity-20 blur-2xl" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1632643746039-de953cb0f260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzYyMjYzMDgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Beauty Nails Team"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Avantages</h2>
            <p className="text-xl text-gray-600">Nous prenons soin de notre équipe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white border-0 shadow-xl rounded-2xl p-8 text-center hover:shadow-2xl transition-shadow">
                <div className={`w-16 h-16 rounded-full bg-linear-to-br ${benefit.color} flex items-center justify-center mx-auto mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Postes Ouverts</h2>
            <p className="text-xl text-gray-600">Trouvez le poste qui vous correspond</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {positions.map((position, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow p-8 rounded-2xl">
                <h3 className="text-2xl text-gray-900 mb-3">{position.title}</h3>
                <p className="text-gray-600 mb-6">{position.description}</p>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Exigences :</p>
                  <ul className="space-y-2">
                    {position.requirements.map((req, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 mt-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Postulez Maintenant</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Marie Kabila"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="marie@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+243 123 456 789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Poste désiré *</Label>
                    <Select value={formData.position} onValueChange={(value: any) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger className="mt-2 rounded-xl">
                        <SelectValue placeholder="Sélectionner un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nails">Spécialiste Ongles</SelectItem>
                        <SelectItem value="lashes">Experte Cils</SelectItem>
                        <SelectItem value="hair">Coiffeuse</SelectItem>
                        <SelectItem value="makeup">Maquilleuse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    placeholder="ex: 3 ans"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-2 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Parlez-nous de vous *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre expérience, vos compétences et pourquoi vous souhaitez rejoindre Beauty Nails..."
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 rounded-xl min-h-[150px]"
                    required
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    📎 Vous pouvez également envoyer votre CV et portfolio par email à <strong>recrutement@beautynails.cd</strong>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full py-6"
                >
                  Envoyer ma candidature
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-linear-to-br from-pink-50 to-purple-50 border-0 shadow-lg p-6 rounded-2xl">
              <h3 className="text-xl text-gray-900 mb-4">Processus de Recrutement</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-gray-900">Candidature</p>
                    <p className="text-sm text-gray-600">Envoi de votre CV et portfolio</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-gray-900">Entretien</p>
                    <p className="text-sm text-gray-600">Discussion avec notre équipe</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-gray-900">Test Pratique</p>
                    <p className="text-sm text-gray-600">Démonstration de vos compétences</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-gray-900">Bienvenue !</p>
                    <p className="text-sm text-gray-600">Intégration dans l'équipe</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 shadow-lg p-6 rounded-2xl">
              <h3 className="text-xl text-gray-900 mb-4">Questions ?</h3>
              <p className="text-gray-600 mb-4">
                Contactez notre responsable RH pour plus d'informations
              </p>
              <p className="text-sm text-gray-700 mb-2">
                📧 recrutement@beautynails.cd
              </p>
              <p className="text-sm text-gray-700">
                📞 +243 123 456 789
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
