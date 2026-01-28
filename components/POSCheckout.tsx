"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { useServices } from '@/lib/hooks/useServices';
import { useInventory } from '@/lib/hooks/useInventory';
import POSOperationModal from '@/components/modals/POSOperationModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Gift, Percent } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const processPayment = async (paymentData: any) => {
//   const response = await axiosdb.post('/api/payments/process', paymentData);
//   return response.data;
// };
// const generateReceipt = async (saleId: string) => {
//   const response = await axiosdb.get(`/api/sales/${saleId}/receipt`);
//   return response.data;
// };
// const closeDailyRegister = async (date: string) => {
//   const response = await axiosdb.post('/api/sales/close-register', { date });
//   return response.data;
// };

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface PaymentMethod {
  type: 'cash' | 'card' | 'mobile' | 'giftcard';
  amount: number;
}

export default function POSCheckout({ showMock }: { showMock?: boolean }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientName, setClientName] = useState('');

  const { services: apiServices = [] } = useServices();
  const { inventory: apiInventory = [] } = useInventory();

  const MOCK_SERVICES = [
    { id: 's1', name: 'Manucure Gel', price: 30000, type: 'service' as const },
  ];
  const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Vernis Gel', price: 15000, type: 'product' as const },
  ];

  type ItemSource = { id: string; name: string; price: number; type: 'service' | 'product' };
  const services: ItemSource[] = (apiServices && apiServices.length) ? (apiServices as any as ItemSource[]) : (showMock ? MOCK_SERVICES : []);
  const products: ItemSource[] = (apiInventory && apiInventory.length) ? apiInventory.map((i: any) => ({ id: i.id, name: i.name, price: Number(i.cost || 0), type: 'product' as const })) : (showMock ? MOCK_PRODUCTS : []);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showPayment, setShowPayment] = useState(false);

  const addToCart = (item: ItemSource) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const totalPaid = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  const remaining = total - totalPaid;

  const addPayment = (type: PaymentMethod['type']) => {
    if (remaining > 0) {
      setPaymentMethods([...paymentMethods, { type, amount: remaining }]);
    }
  };

  const updatePaymentAmount = (index: number, amount: number) => {
    const newPayments = [...paymentMethods];
    newPayments[index].amount = Math.max(0, amount);
    setPaymentMethods(newPayments);
  };

  const removePayment = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const completeTransaction = () => {
    if (remaining <= 0 && cart.length > 0) {
      // API call would go here
      // await processPayment({ cart, paymentMethods, clientName, total });

      alert('Paiement complété avec succès!');
      // Reset
      setCart([]);
      setClientName('');
      setDiscountPercent(0);
      setPaymentMethods([]);
      setShowPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Caisse (POS)</h2>
        <div className="flex items-center gap-3">
          <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
            Caisse Ouverte
          </Badge>
          <POSOperationModal triggerLabel="Opération POS" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services & Products Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <Card className="border-0 shadow-lg rounded-2xl p-6">
            <h3 className="text-xl text-gray-900 mb-4">Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {services.map((service) => (
                <Button
                  key={service.id}
                  onClick={() => addToCart(service)}
                  variant="outline"
                  className="h-auto flex flex-col items-start p-4 rounded-xl hover:bg-pink-50 hover:border-pink-300"
                >
                  <p className="text-sm text-gray-900 mb-1">{service.name}</p>
                  <p className="text-lg text-pink-600">{(service.price).toLocaleString()} Fc</p>
                </Button>
              ))}
            </div>
          </Card>

          {/* Products */}
          <Card className="border-0 shadow-lg rounded-2xl p-6">
            <h3 className="text-xl text-gray-900 mb-4">Produits</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {products.map((product) => (
                <Button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  variant="outline"
                  className="h-auto flex flex-col items-start p-4 rounded-xl hover:bg-purple-50 hover:border-purple-300"
                >
                  <p className="text-sm text-gray-900 mb-1">{product.name}</p>
                  <p className="text-lg text-purple-600">{(product.price).toLocaleString()} Fc</p>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart & Checkout */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-6 h-6 text-pink-500" />
              <h3 className="text-xl text-gray-900">Panier</h3>
              {cart.length > 0 && (
                <Badge className="bg-pink-500 text-white ml-auto">
                  {cart.length}
                </Badge>
              )}
            </div>

            <Input
              placeholder="Nom du client (optionnel)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mb-4 rounded-xl"
            />

            <Separator className="my-4" />

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Panier vide</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.price.toLocaleString()} Fc × {item.quantity}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-7 w-7 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm text-gray-900 w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-7 w-7 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-900">
                        {(item.price * item.quantity).toLocaleString()} Fc
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            {/* Discount */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="Remise %"
                  value={discountPercent || ''}
                  onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total:</span>
                <span>{subtotal.toLocaleString()} Fc</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise ({discountPercent}%):</span>
                  <span>- {discountAmount.toLocaleString()} Fc</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-xl text-gray-900">
                <span>Total:</span>
                <span>{total.toLocaleString()} Fc</span>
              </div>
            </div>

            <Button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6"
            >
              Procéder au Paiement
            </Button>
          </Card>

          {/* Payment Section */}
          {showPayment && cart.length > 0 && (
            <Card className="border-0 shadow-lg rounded-2xl p-6 bg-linear-to-br from-green-50 to-emerald-50">
              <h3 className="text-xl text-gray-900 mb-4">Mode de Paiement</h3>

              {/* Payment Methods */}
              <div className="space-y-3 mb-4">
                {paymentMethods.map((pm, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-xl">
                    <Badge className={`${pm.type === 'cash' ? 'bg-green-500' :
                      pm.type === 'card' ? 'bg-blue-500' :
                        pm.type === 'mobile' ? 'bg-purple-500' : 'bg-amber-500'
                      } text-white`}>
                      {pm.type === 'cash' ? 'Espèces' :
                        pm.type === 'card' ? 'Carte' :
                          pm.type === 'mobile' ? 'Mobile Money' : 'Carte Cadeau'}
                    </Badge>
                    <Input
                      type="number"
                      value={pm.amount}
                      onChange={(e) => updatePaymentAmount(index, Number(e.target.value))}
                      className="rounded-xl"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removePayment(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Payment Method Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  onClick={() => addPayment('cash')}
                  variant="outline"
                  className="rounded-xl hover:bg-green-50"
                  disabled={remaining <= 0}
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  Espèces
                </Button>
                <Button
                  onClick={() => addPayment('card')}
                  variant="outline"
                  className="rounded-xl hover:bg-blue-50"
                  disabled={remaining <= 0}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Carte
                </Button>
                <Button
                  onClick={() => addPayment('mobile')}
                  variant="outline"
                  className="rounded-xl hover:bg-purple-50"
                  disabled={remaining <= 0}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile Money
                </Button>
                <Button
                  onClick={() => addPayment('giftcard')}
                  variant="outline"
                  className="rounded-xl hover:bg-amber-50"
                  disabled={remaining <= 0}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Carte Cadeau
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Payment Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Total à payer:</span>
                  <span>{total.toLocaleString()} Fc</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total payé:</span>
                  <span>{totalPaid.toLocaleString()} Fc</span>
                </div>
                <Separator />
                <div className={`flex justify-between text-xl ${remaining > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                  <span>{remaining > 0 ? 'Reste à payer:' : 'Monnaie:'}</span>
                  <span>{Math.abs(remaining).toLocaleString()} Fc</span>
                </div>
              </div>

              <Button
                onClick={completeTransaction}
                disabled={remaining > 0}
                className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full py-6"
              >
                Finaliser la Transaction
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-0 p-6">
          <p className="text-sm text-gray-600 mb-1">Transactions Aujourd'hui</p>
          <p className="text-3xl text-gray-900">32</p>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-0 p-6">
          <p className="text-sm text-gray-600 mb-1">Revenus Journée</p>
          <p className="text-2xl text-gray-900">1 250 000 Fc</p>
        </Card>
        <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-0 p-6">
          <p className="text-sm text-gray-600 mb-1">Ticket Moyen</p>
          <p className="text-2xl text-gray-900">39 063 Fc</p>
        </Card>
        <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-0 p-6">
          <Button className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full">
            Clôture de Caisse
          </Button>
        </Card>
      </div>
    </div>
  );
}
