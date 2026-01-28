import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-pink-900 to-amber-900 dark:from-gray-950 dark:via-pink-950 dark:to-amber-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <Image
                src={'/Bnails_ white.png'}
                alt="Beauty Nails Logo"
                width={220}
                height={70}
                className={`transition-all duration-300`}
                priority
              />
            </Link>
            <p className="text-gray-300 mb-6">
              Sublimez votre beauté, un soin à la fois. Votre destination premium pour les ongles, cils, tresses et maquillage à RDC - GOMA .
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/memberships" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-pink-300 transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/onglerie" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Onglerie
                </Link>
              </li>
              <li>
                <Link href="/services/cils" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Cils
                </Link>
              </li>
              <li>
                <Link href="/services/tresses" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Tresses
                </Link>
              </li>
              <li>
                <Link href="/services/maquillage" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Maquillage
                </Link>
              </li>
              <li>
                <Link href="/join-team" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Rejoindre l'Équipe
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pink-300 mt-1 shrink-0" />
                <span className="text-gray-300">
                  Q. Birere, Goma<br />
                  Nord-Kivu, D.R. Congo
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-300 shrink-0" />
                <a href="tel:+243123456789" className="text-gray-300 hover:text-pink-300 transition-colors">
                  +243 973 887 148
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-300 shrink-0" />
                <a href="mailto:contact@beautynails.cd" className="text-gray-300 hover:text-pink-300 transition-colors">
                  contact@beautynails.cd
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 Beauty Nails. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-pink-300 transition-colors">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-pink-300 transition-colors">
                Conditions d'Utilisation
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-pink-300 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
