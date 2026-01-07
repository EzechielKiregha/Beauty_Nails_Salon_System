import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-pink-100 text-pink-600">
            <FileText className="w-4 h-4 mr-2" />
            Conditions
          </Badge>
          <h1 className="text-5xl text-gray-900 mb-6">
            Conditions d'Utilisation
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : 5 novembre 2025
          </p>
        </div>

        <Card className="bg-white border-0 shadow-xl rounded-2xl p-8 prose prose-pink max-w-none">
          <h2>1. Acceptation des Conditions</h2>
          <p>
            En utilisant les services de Beauty Nails, vous acceptez d'être lié par ces conditions d'utilisation.
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>

          <h2>2. Services Proposés</h2>
          <p>
            Beauty Nails propose des services de beauté incluant mais non limités à :
          </p>
          <ul>
            <li>Onglerie (manucure, pédicure, nail art, extensions)</li>
            <li>Extensions et traitements de cils</li>
            <li>Coiffure (tresses, tissage, etc.)</li>
            <li>Maquillage professionnel</li>
          </ul>

          <h2>3. Réservations</h2>
          <h3>3.1 Prise de Rendez-vous</h3>
          <p>
            Les rendez-vous peuvent être pris en ligne, par téléphone ou via WhatsApp. Une confirmation vous sera
            envoyée par email ou SMS.
          </p>

          <h3>3.2 Annulation et Modification</h3>
          <ul>
            <li>Les annulations doivent être effectuées au moins 24h à l'avance</li>
            <li>Les annulations tardives (moins de 24h) peuvent entraîner des frais de 50%</li>
            <li>Les "no-show" seront facturés à 100%</li>
            <li>Les modifications sont possibles selon les disponibilités</li>
          </ul>

          <h2>4. Paiement</h2>
          <h3>4.1 Modes de Paiement</h3>
          <p>Nous acceptons :</p>
          <ul>
            <li>Espèces (CDF et USD)</li>
            <li>Mobile Money (Airtel Money, Orange Money, M-Pesa)</li>
            <li>Virement bancaire</li>
          </ul>

          <h3>4.2 Tarification</h3>
          <p>
            Les prix affichés sont en francs congolais (CDF) et peuvent être modifiés sans préavis.
            Le prix convenu lors de la réservation sera respecté.
          </p>

          <h2>5. Abonnements</h2>
          <p>Les abonnements sont soumis aux conditions suivantes :</p>
          <ul>
            <li>Les abonnements sont personnels et non transférables</li>
            <li>Les rendez-vous inclus doivent être utilisés pendant la période d'abonnement</li>
            <li>Les abonnements non utilisés ne sont pas remboursables</li>
            <li>Le renouvellement est automatique sauf demande contraire</li>
          </ul>

          <h2>6. Programme de Fidélité</h2>
          <p>
            Le programme de fidélité est soumis à des conditions spécifiques et peut être modifié ou arrêté à tout moment.
            Les points accumulés expirent après 12 mois d'inactivité.
          </p>

          <h2>7. Responsabilités du Client</h2>
          <p>Le client s'engage à :</p>
          <ul>
            <li>Fournir des informations exactes lors de la réservation</li>
            <li>Informer le salon de toute allergie ou condition médicale</li>
            <li>Arriver à l'heure à son rendez-vous</li>
            <li>Respecter le personnel et les autres clientes</li>
            <li>Suivre les conseils d'entretien donnés après les prestations</li>
          </ul>

          <h2>8. Responsabilités de Beauty Nails</h2>
          <p>Beauty Nails s'engage à :</p>
          <ul>
            <li>Fournir des services professionnels de qualité</li>
            <li>Respecter les normes d'hygiène et de sécurité</li>
            <li>Utiliser des produits de qualité</li>
            <li>Traiter les données personnelles conformément à notre politique de confidentialité</li>
          </ul>

          <h2>9. Limitation de Responsabilité</h2>
          <p>
            Beauty Nails ne peut être tenu responsable de :
          </p>
          <ul>
            <li>Réactions allergiques non signalées préalablement</li>
            <li>Résultats ne correspondant pas aux attentes si les instructions d'entretien n'ont pas été suivies</li>
            <li>Dommages résultant d'une mauvaise utilisation des produits recommandés</li>
          </ul>

          <h2>10. Réclamations</h2>
          <p>
            Toute réclamation doit être formulée dans les 48h suivant la prestation. Nous nous efforcerons de
            trouver une solution satisfaisante rapidement.
          </p>

          <h2>11. Photos et Témoignages</h2>
          <p>
            Avec votre consentement, nous pouvons utiliser des photos de nos réalisations à des fins promotionnelles.
            Vous pouvez retirer votre consentement à tout moment.
          </p>

          <h2>12. Modifications des Conditions</h2>
          <p>
            Beauty Nails se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront
            en vigueur dès leur publication sur le site.
          </p>

          <h2>13. Droit Applicable</h2>
          <p>
            Ces conditions sont régies par le droit de la République Démocratique du Congo. Tout litige sera
            soumis aux tribunaux compétents de Kinshasa.
          </p>

          <h2>14. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation :
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
