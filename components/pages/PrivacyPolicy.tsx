import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-pink-100 text-pink-600">
            <Shield className="w-4 h-4 mr-2" />
            Confidentialité
          </Badge>
          <h1 className="text-5xl text-gray-900 mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : 5 novembre 2025
          </p>
        </div>

        <Card className="bg-white border-0 shadow-xl rounded-2xl p-8 prose prose-pink max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Beauty Nails s'engage à protéger la vie privée de ses clientes. Cette politique de confidentialité
            explique comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>

          <h2>2. Informations Collectées</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul>
            <li>Nom, prénom et coordonnées (email, téléphone, adresse)</li>
            <li>Informations de rendez-vous et historique de services</li>
            <li>Préférences et notes concernant vos prestations</li>
            <li>Informations de paiement (traitées de manière sécurisée)</li>
            <li>Photos de réalisations (avec votre consentement explicite)</li>
          </ul>

          <h2>3. Utilisation des Données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Gérer vos rendez-vous et prestations</li>
            <li>Vous contacter concernant vos réservations</li>
            <li>Personnaliser votre expérience client</li>
            <li>Vous envoyer des offres et promotions (avec votre accord)</li>
            <li>Améliorer nos services</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>4. Protection des Données</h2>
          <p>
            Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations contre
            tout accès non autorisé, modification, divulgation ou destruction.
          </p>

          <h2>5. Partage des Données</h2>
          <p>
            Nous ne vendons ni ne louons vos informations personnelles. Vos données peuvent être partagées uniquement :
          </p>
          <ul>
            <li>Avec nos prestataires de services (paiement, communication)</li>
            <li>Si requis par la loi ou par une autorité compétente</li>
            <li>Avec votre consentement explicite</li>
          </ul>

          <h2>6. Vos Droits</h2>
          <p>Vous avez le droit de :</p>
          <ul>
            <li>Accéder à vos données personnelles</li>
            <li>Rectifier vos informations</li>
            <li>Supprimer votre compte et vos données</li>
            <li>Vous opposer au traitement de vos données</li>
            <li>Retirer votre consentement à tout moment</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez désactiver
            les cookies dans les paramètres de votre navigateur.
          </p>

          <h2>8. Conservation des Données</h2>
          <p>
            Nous conservons vos données aussi longtemps que nécessaire pour vous fournir nos services ou selon
            les exigences légales.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité. Les modifications seront publiées
            sur cette page avec une nouvelle date de mise à jour.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
            contactez-nous à :
          </p>
          <p>
            Email : contact@beautynails.cd<br />
            Téléphone : +243 123 456 789<br />
            Adresse : Avenue de la Paix, Gombe, Kinshasa
          </p>
        </Card>
      </div>
    </div>
  );
}
