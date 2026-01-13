'use client'

import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import HeroSection from '../HeroSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    toast.success('Message envoyé !', {
      description: 'Nous vous répondrons dans les plus brefs délais.'
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-pink-500" />,
      title: 'Adresse',
      content: 'Avenue de la Paix, Gombe\nKinshasa, D.R. Congo',
      link: 'https://maps.google.com'
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-500" />,
      title: 'Téléphone',
      content: '+243 123 456 789\n+243 987 654 321',
      link: 'tel:+243123456789'
    },
    {
      icon: <Mail className="w-6 h-6 text-amber-500" />,
      title: 'Email',
      content: 'contact@beautynails.cd\ninfo@beautynails.cd',
      link: 'mailto:contact@beautynails.cd'
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: 'Horaires',
      content: 'Lun - Sam: 09:00 - 19:00\nDimanche: Sur rendez-vous',
      link: null
    }
  ];

  const hours = [
    { day: 'Lundi', hours: '09:00 - 19:00' },
    { day: 'Mardi', hours: '09:00 - 19:00' },
    { day: 'Mercredi', hours: '09:00 - 19:00' },
    { day: 'Jeudi', hours: '09:00 - 19:00' },
    { day: 'Vendredi', hours: '09:00 - 19:00' },
    { day: 'Samedi', hours: '09:00 - 19:00' },
    { day: 'Dimanche', hours: 'Sur rendez-vous' }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        imageUrl='/contact us.jpg'
        title="Contactez-nous"
        description="Une question ? Une demande spéciale ? Nous sommes là pour vous répondre"
        badgeText='nos contacts'
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 text-pink-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Badge>

        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg text-gray-900 mb-2">{info.title}</h3>
              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-gray-600 hover:text-pink-600 whitespace-pre-line"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Envoyez-nous un message</h2>
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
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+243 123 456 789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Demande d'information"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-2 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 rounded-xl min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white rounded-full py-6"
                >
                  Envoyer le message
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 shadow-lg p-6 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">
                  Contactez-nous directement sur WhatsApp pour une réponse rapide
                </p>
                <a href="https://wa.me/243123456789" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full">
                    Ouvrir WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Hours Card */}
            <Card className="bg-white border-0 shadow-lg p-6 rounded-2xl">
              <h3 className="text-xl text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-pink-500" />
                Horaires d'ouverture
              </h3>
              <div className="space-y-3">
                {hours.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.day}</span>
                    <span className={`${item.hours === 'Sur rendez-vous' ? 'text-amber-600' : 'text-gray-900'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media Card */}
            <Card className="bg-linear-to-br from-pink-50 to-purple-50 border-0 shadow-lg p-6 rounded-2xl">
              <h3 className="text-xl text-gray-900 mb-4">Suivez-nous</h3>
              <div className="space-y-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    F
                  </div>
                  <span className="text-gray-700">Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    I
                  </div>
                  <span className="text-gray-700">Instagram</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                    T
                  </div>
                  <span className="text-gray-700">Twitter</span>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 bg-linear-to-r from-pink-50 to-purple-50">
              <h2 className="text-2xl text-gray-900 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-pink-500" />
                Notre Emplacement
              </h2>
            </div>
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Avenue de la Paix, Gombe</p>
                <p>Kinshasa, D.R. Congo</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 mt-2 inline-block"
                >
                  Voir sur Google Maps →
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
