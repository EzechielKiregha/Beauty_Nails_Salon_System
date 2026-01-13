"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePayments } from "@/lib/hooks/usePayments";
import { toast } from "sonner";

export default function POSOperationModal({ triggerLabel = "Opération POS" }: { triggerLabel?: string }) {
  const [appointmentId, setAppointmentId] = useState("");
  const [clientId, setClientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile' | 'mixed'>('card');
  const [discountCode, setDiscountCode] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | ''>('');
  const [tip, setTip] = useState<number | ''>('');

  const [itemServiceId, setItemServiceId] = useState("");
  const [itemPrice, setItemPrice] = useState<number | ''>('');
  const [itemQuantity, setItemQuantity] = useState<number | ''>(1);
  const [items, setItems] = useState<Array<{ serviceId: string; quantity: number; price: number }>>([]);

  const [isOpen, setIsOpen] = useState(false);

  const { processPayment, isProcessing } = usePayments();

  const addItem = () => {
    if (!itemServiceId || itemPrice === '') { toast.error('Veuillez renseigner l\'ID du service et le prix'); return; }
    setItems([...items, { serviceId: itemServiceId, quantity: Number(itemQuantity || 1), price: Number(itemPrice) }]);
    setItemServiceId('');
    setItemPrice('');
    setItemQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    if (items.length === 0) { toast.error('Ajouter au moins un article au paiement'); return; }

    const payload: import('@/lib/api/payments').ProcessPaymentData = {
      appointmentId: appointmentId || undefined,
      clientId: clientId || undefined,
      items: items.map(i => ({ serviceId: i.serviceId, quantity: i.quantity, price: i.price })),
      paymentMethod,
      discountCode: discountCode || undefined,
      loyaltyPointsUsed: loyaltyPoints === '' ? undefined : Number(loyaltyPoints),
      tip: tip === '' ? undefined : Number(tip),
    };

    processPayment(payload);

    setIsOpen(false);
    setAppointmentId('');
    setClientId('');
    setPaymentMethod('card');
    setDiscountCode('');
    setLoyaltyPoints('');
    setTip('');
    setItems([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Effectuer un paiement (POS)</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="pos-appointment">ID Rendez-vous (optionnel)</Label>
              <Input id="pos-appointment" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pos-client">Client ID (optionnel)</Label>
              <Input id="pos-client" value={clientId} onChange={(e) => setClientId(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="pos-item-service">ID Service/Produit</Label>
              <Input id="pos-item-service" value={itemServiceId} onChange={(e) => setItemServiceId(e.target.value)} placeholder="ex: svc_123" />
            </div>
            <div>
              <Label htmlFor="pos-item-price">Prix</Label>
              <Input id="pos-item-price" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="pos-item-qty">Quantité</Label>
              <Input id="pos-item-qty" type="number" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={addItem}>Ajouter article</Button>
            <span className="text-sm text-gray-500 self-center">{items.length} article(s) ajoutés</span>
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <p className="text-sm font-medium">{it.serviceId}</p>
                    <p className="text-xs text-gray-600">{it.quantity} × {it.price.toLocaleString()} CDF</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(idx)}>✕</Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="pos-method">Méthode</Label>
              <select id="pos-method" className="w-full rounded-md border px-2 py-1" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                <option value="card">Carte</option>
                <option value="cash">Espèces</option>
                <option value="mobile">Mobile</option>
                <option value="mixed">Mixte</option>
              </select>
            </div>

            <div>
              <Label htmlFor="pos-discount">Code promo (optionnel)</Label>
              <Input id="pos-discount" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="pos-loyalty">Points fidélité (optionnel)</Label>
              <Input id="pos-loyalty" type="number" value={loyaltyPoints} onChange={(e) => setLoyaltyPoints(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div>
            <Label htmlFor="pos-tip">Pourboire (optionnel)</Label>
            <Input id="pos-tip" type="number" value={tip} onChange={(e) => setTip(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isProcessing}>{isProcessing ? "Traitement..." : "Payer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
