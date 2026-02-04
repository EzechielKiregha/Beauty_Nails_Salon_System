import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Truck, AlertTriangle, Image as ImageIcon, Barcode, Scan } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Add Product Modal ---

interface AddProductModalProps {
  trigger?: React.ReactNode;
}

export function AddProductModal({ trigger }: AddProductModalProps) {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails Produit</TabsTrigger>
            <TabsTrigger value="inventory">Stock & Fournisseur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
             {/* Image Upload Placeholder */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-pink-300 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">Ajouter Photo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du produit</Label>
                <Input placeholder="Ex: Vernis Gel OPI Rouge" />
              </div>
              <div className="space-y-2">
                <Label>Code-barres (SKU)</Label>
                <div className="relative">
                  <Input placeholder="SCAN-12345" className="pl-9" />
                  <Scan className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nails">Onglerie</SelectItem>
                    <SelectItem value="lashes">Cils</SelectItem>
                    <SelectItem value="hair">Cheveux</SelectItem>
                    <SelectItem value="makeup">Maquillage</SelectItem>
                    <SelectItem value="retail">Vente Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label>Marque</Label>
                 <Input placeholder="Ex: OPI, L'Oréal..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix Achat (Coût)</Label>
                <Input placeholder="15000" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Prix Vente (Client)</Label>
                <Input placeholder="25000" type="number" />
              </div>
            </div>
            
             <div className="space-y-2">
               <Label>Description</Label>
               <Textarea placeholder="Détails, usage, contenance..." className="h-20 resize-none" />
             </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4 pt-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div className="text-sm text-orange-800">
                Définissez le seuil d'alerte pour recevoir des notifications automatiques lorsque le stock est bas.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Initial</Label>
                <Input placeholder="0" type="number" className="font-bold" />
              </div>
              <div className="space-y-2">
                <Label>Seuil d'alerte (Min)</Label>
                <Input placeholder="10" type="number" className="border-orange-200 focus-visible:ring-orange-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fournisseur Principal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Beauty Supplies DRC</SelectItem>
                  <SelectItem value="s2">Lash Pro Africa</SelectItem>
                  <SelectItem value="s3">Kinshasa Beauty Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note Interne</Label>
              <Textarea placeholder="Instructions de stockage, délai de commande..." />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline">Annuler</Button>
          <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Enregistrer Produit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Adjust Stock Modal ---

interface AdjustStockModalProps {
  productName?: string;
  currentStock?: number;
  trigger?: React.ReactNode;
}

export function AdjustStockModal({ productName, currentStock, trigger }: AdjustStockModalProps) {
  const [reason, setReason] = useState('restock');
  const [qty, setQty] = useState('');

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Ajustement de Stock</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="bg-gray-50 p-4 rounded-xl text-sm flex justify-between items-center border">
            <div>
              <span className="font-bold block text-base text-gray-900">{productName || 'Produit'}</span>
              <span className="text-gray-500">Stock actuel</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currentStock || 0}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Type d'ajustement</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restock">➕ Réception de marchandise</SelectItem>
                <SelectItem value="return">➕ Retour client</SelectItem>
                <SelectItem value="correction_pos">➕ Correction inventaire (+)</SelectItem>
                <SelectItem value="damage">➖ Perte / Dommage / Vol</SelectItem>
                <SelectItem value="usage">➖ Utilisation Salon</SelectItem>
                <SelectItem value="correction_neg">➖ Correction inventaire (-)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantité à {['damage', 'usage', 'correction_neg'].includes(reason) ? 'retirer' : 'ajouter'}</Label>
            <Input 
              type="number" 
              placeholder="Ex: 5" 
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className={['damage', 'usage', 'correction_neg'].includes(reason) ? "border-red-300 focus-visible:ring-red-500" : "border-green-300 focus-visible:ring-green-500"}
            />
          </div>

          <div className="space-y-2">
            <Label>Note / Référence</Label>
            <Textarea placeholder="Numéro de BL ou explication..." className="h-20" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className={['damage', 'usage', 'correction_neg'].includes(reason) ? "bg-red-600 hover:bg-red-700 text-white w-full" : "bg-green-600 hover:bg-green-700 text-white w-full"}>
            Confirmer {['damage', 'usage', 'correction_neg'].includes(reason) ? 'Retrait' : 'Ajout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Order Modal ---

interface OrderModalProps {
  productName?: string;
  supplierName?: string;
  trigger?: React.ReactNode;
}

export function OrderModal({ productName, supplierName, trigger }: OrderModalProps) {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Commande Fournisseur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="bg-white p-2 rounded-full shadow-sm">
               <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-orange-900">{supplierName || 'Beauty Supplies DRC'}</p>
              <p className="text-xs text-orange-700 font-medium uppercase tracking-wide">Fournisseur Principal</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Produit à commander</Label>
            <Input defaultValue={productName} placeholder="Nom du produit" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantité</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label>Prix Unitaire Est.</Label>
              <div className="relative">
                <Input defaultValue="15000" className="pr-10" />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">CDF</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-lg">
            <span>Total Estimé</span>
            <span className="font-bold text-lg">150 000 CDF</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Brouillon</Button>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
            Envoyer Commande (Email)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
