// --- NEW COMPONENT: ManageClientMembership ---

import { useMembershipPurchases, useMemberships } from "@/lib/hooks/useMemberships";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// This component should ideally be in its own file later.
interface ManageClientMembershipProps {
  clientId: string;
}

export default function ManageClientMembership({ clientId }: ManageClientMembershipProps) {
  const { purchases, isLoading, error, purchaseMembership, updatePurchase } = useMembershipPurchases({ clientId });
  const { memberships } = useMemberships(); // Fetch available memberships to choose from

  const [selectedMembershipId, setSelectedMembershipId] = useState<string>("");
  const [autoRenew, setAutoRenew] = useState<boolean>(true); // Default auto-renew on

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const activePurchase = purchases.find(p => p.status === 'active'); // Assume only one active at a time

  const handlePurchase = () => {
    if (selectedMembershipId) {
      purchaseMembership({ clientId, membershipId: selectedMembershipId, autoRenew });
    }
  };

  const handleCancel = (purchaseId: string) => {
    // Assuming cancellation means setting status to 'cancelled'
    updatePurchase({ id: purchaseId, data: { status: 'cancelled' } });
  };

  const handleRenew = (purchaseId: string, membershipId: string) => {
    // Renewal logic: could mean extending end date or creating a new purchase record.
    // For simplicity, here we just update the status to active again if it was cancelled/expired.
    // A full renewal might require payment processing logic.
    updatePurchase({ id: purchaseId, data: { status: 'active' } });
  };

  const handleUpgrade = (currentPurchaseId: string, newMembershipId: string) => {
    // Upgrading could involve cancelling the old one and purchasing a new one.
    // Simplified here by just updating the membershipId and resetting dates.
    // Real logic depends on business rules (proration, payment, etc.).
    updatePurchase({ id: currentPurchaseId, data: { membershipId: newMembershipId, status: 'active' /*, reset start/end dates */ } });
  };

  return (
    <div className="space-y-4">
      {!activePurchase ? (
        // No active membership: Show purchase options
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">Aucun abonnement actif.</p>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedMembershipId}
              onChange={(e) => setSelectedMembershipId(e.target.value)}
              className="flex-1 min-w-[150px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 text-sm"
            >
              <option value="">Choisir un abonnement</option>
              {memberships
                .filter(m => m.isActive) // Only show active ones for purchase
                .map(m => (
                  <option key={m.id} value={m.id}>{m.name} - {m.price} CDF</option>
                ))
              }
            </select>
            <div className="flex items-center space-x-2">
              <input
                id="autoRenew"
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="autoRenew" className="text-xs text-gray-600 dark:text-gray-400">Auto-Renouvellement</label>
            </div>
            <Button
              onClick={handlePurchase}
              disabled={!selectedMembershipId || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2"
            >
              Acheter
            </Button>
          </div>
        </div>
      ) : (
        // Active membership found: Show details and actions
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h5 className=" text-gray-900 dark:text-gray-100">{activePurchase.membership?.name || "Abonnement Inconnu"}</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Du {new Date(activePurchase.startDate).toLocaleDateString()} au {new Date(activePurchase.endDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Auto-Renouvellement: {activePurchase.autoRenew ? "Oui" : "Non"}
              </p>
            </div>
            <Badge variant={activePurchase.status === 'active' ? "default" : activePurchase.status === 'expired' ? "destructive" : "secondary"}>
              {activePurchase.status === 'active' ? 'Payé' : activePurchase.status === 'expired' ? 'Expiré' : 'Annulé'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRenew(activePurchase.id, activePurchase.membershipId)}
              disabled={activePurchase.status !== 'expired' && activePurchase.status !== 'cancelled'}
              className="text-xs px-3 py-1.5"
            >
              Renouveler
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancel(activePurchase.id)}
              disabled={activePurchase.status === 'cancelled'}
              className="text-xs px-3 py-1.5 text-red-600 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Annuler
            </Button>
            <select
              value=""
              onChange={(e) => handleUpgrade(activePurchase.id, e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-1 text-xs"
            >
              <option value="" disabled>Changer pour...</option>
              {memberships
                .filter(m => m.isActive && m.id !== activePurchase.membershipId) // Exclude current
                .map(m => (
                  <option key={m.id} value={m.id}>{m.name} - {m.price} CDF</option>
                ))
              }
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
// --- END NEW COMPONENT ---

// ... rest of the original ClientManagement component code ...
