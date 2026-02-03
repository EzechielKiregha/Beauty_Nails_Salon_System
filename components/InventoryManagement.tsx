"use client"
import { useState, useMemo } from 'react';
import { useInventory } from '@/lib/hooks/useInventory';
import CreateInventoryModal from '@/components/modals/CreateInventoryModal';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, AlertCircle, TrendingUp, ShoppingCart, Phone, Mail, Search, Users } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: string;
  supplier: string;
  lastRestock: string;
  usageRate: string;
  status: 'good' | 'low' | 'critical' | 'out';
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: string[];
  rating: number;
}

export default function InventoryManagement({ showMock }: { showMock?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { inventory: apiInventory = [], isLoading: inventoryLoading } = useInventory();

  const MOCK_INVENTORY: InventoryItem[] = [
    {
      id: '1',
      name: 'Vernis Gel - Rouge Passion',
      category: 'Onglerie',
      stock: 45,
      minStock: 30,
      unit: 'unités',
      price: '15 000 Fc',
      supplier: 'Beauty Supplies DRC',
      lastRestock: '2024-11-15',
      usageRate: '8 unités/semaine',
      status: 'good'
    }
  ];

  const inventory: InventoryItem[] = useMemo(() => {
    if (apiInventory && apiInventory.length) return apiInventory as unknown as InventoryItem[];
    return showMock ? MOCK_INVENTORY : [];
  }, [apiInventory, showMock]);

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Beauty Supplies DRC',
      contact: 'Jean Mukendi',
      email: 'contact@beautysupplies.cd',
      phone: '+243 810 123 456',
      products: ['Vernis', 'Produits Ongles', 'Accessoires'],
      rating: 4.8
    },
    {
      id: '2',
      name: 'Lash Pro Africa',
      contact: 'Marie Kalala',
      email: 'info@lashpro.cd',
      phone: '+243 820 234 567',
      products: ['Extensions Cils', 'Colles', 'Pinces'],
      rating: 4.9
    },
    {
      id: '3',
      name: 'African Hair Supplies',
      contact: 'Grace Mbuyi',
      email: 'sales@africanhair.cd',
      phone: '+243 830 345 678',
      products: ['Rajouts', 'Tresses', 'Fils', 'Perruques'],
      rating: 4.7
    },
    {
      id: '4',
      name: 'Makeup Pro Congo',
      contact: 'Sophie Nzuzi',
      email: 'orders@makeuppro.cd',
      phone: '+243 840 456 789',
      products: ['Maquillage', 'Pinceaux', 'Démaquillants'],
      rating: 4.6
    }
  ];

  const usageReport = [
    { item: 'Vernis Gel', used: 32, revenue: '480 000 Fc', trend: 'up' },
    { item: 'Extensions Cils', used: 24, revenue: '600 000 Fc', trend: 'up' },
    { item: 'Rajouts Cheveux', used: 16, revenue: '480 000 Fc', trend: 'stable' },
    { item: 'Fond de Teint', used: 20, revenue: '400 000 Fc', trend: 'up' },
    { item: 'Fils Tresses', used: 24, revenue: '192 000 Fc', trend: 'stable' }
  ];

  const categories = ['Onglerie', 'Cils', 'Tresses', 'Maquillage'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const alertItems = inventory.filter(item => item.status === 'low' || item.status === 'critical' || item.status === 'out');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion de l'Inventaire</h2>
        <CreateInventoryModal triggerLabel="+ Ajouter Produit" />
      </div>

      {/* Alert Panel */}
      {alertItems.length > 0 && (
        <Card className="p-4 sm:p-6 border border-red-100 dark:border-red-900 shadow-xl rounded-2xl bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Alertes Stock</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
                {alertItems.length} produit(s) nécessite(nt) un réapprovisionnement immédiat
              </p>
              <div className="flex flex-wrap gap-2">
                {alertItems.map((item) => (
                  <Badge key={item.id} className={`${item.status === 'out' ? 'bg-red-600 dark:bg-red-700' :
                    item.status === 'critical' ? 'bg-orange-600 dark:bg-orange-700' : 'bg-amber-600 dark:bg-amber-700'
                    } text-white border-0 shadow-sm`}>
                    {item.name} ({item.stock} {item.unit})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 dark:border-pink-900 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 focus:ring-pink-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-6 transition-all ${selectedCategory === 'all' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'dark:border-gray-700 dark:text-gray-300'}`}
            >
              Tous
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 transition-all ${selectedCategory === cat ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'dark:border-gray-700 dark:text-gray-300'}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-pink-900/30 p-1 rounded-xl w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
          <TabsTrigger value="stock" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Stock</TabsTrigger>
          <TabsTrigger value="suppliers" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Fournisseurs</TabsTrigger>
          <TabsTrigger value="usage" className="rounded-lg px-4 sm:px-8 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Rapport d'Utilisation</TabsTrigger>
        </TabsList>

        {/* Stock Tab */}
        <TabsContent value="stock">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id} className={`p-4 sm:p-6 hover:shadow-lg transition-all border-2 shadow-xl rounded-2xl ${item.status === 'out' ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900' :
                item.status === 'critical' ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900' :
                  item.status === 'low' ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900' :
                    'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
                }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${item.status === 'out' ? 'bg-red-100 dark:bg-red-900/40' :
                    item.status === 'critical' ? 'bg-orange-100 dark:bg-orange-900/40' :
                      item.status === 'low' ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-green-100 dark:bg-green-900/40'
                    }`}>
                    <Package className={`w-7 h-7 ${item.status === 'out' ? 'text-red-600 dark:text-red-400' :
                      item.status === 'critical' ? 'text-orange-600 dark:text-orange-400' :
                        item.status === 'low' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                      }`} />
                  </div>
                  <Badge className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-black/20 text-gray-600 dark:text-gray-300 border-0">
                    {item.category}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{item.name}</h3>

                <div className="space-y-3 mb-6 p-4 bg-white/50 dark:bg-black/10 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Stock actuel:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Stock minimum:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {item.minStock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Prix unitaire:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{item.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Utilisation:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{item.usageRate}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${item.status === 'out' ? 'bg-red-600' :
                      item.status === 'critical' ? 'bg-orange-600' :
                        item.status === 'low' ? 'bg-amber-600' : 'bg-green-600'
                      }`}
                    style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Fournisseur: <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">{item.supplier}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Dernier réappro: <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">{item.lastRestock}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  {(item.status === 'low' || item.status === 'critical' || item.status === 'out') && (
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full py-5 transition-all">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commander
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 rounded-full py-5 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    Ajuster
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4 sm:p-6 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{supplier.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Contact: {supplier.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{supplier.rating}</span>
                    <span className="text-amber-400">⭐</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{supplier.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 break-all">{supplier.email}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Produits fournis</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.products.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs px-3 py-1 dark:border-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full py-6 font-bold shadow-lg shadow-blue-500/20 transition-all">
                    Passer Commande
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-full py-6 font-bold dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-all">
                    Contacter
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-8 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-7 text-lg font-bold shadow-lg shadow-pink-500/20 transition-all">
            + Ajouter Fournisseur
          </Button>
        </TabsContent>

        {/* Usage Report Tab */}
        <TabsContent value="usage">
          <Card className="p-4 sm:p-8 hover:shadow-lg transition-all border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Rapport d'Utilisation - Novembre 2024</h3>
            <div className="space-y-4">
              {usageReport.map((report, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{report.item}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span className="font-semibold text-pink-500">{report.used} unités</span> utilisées ce mois
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{report.revenue}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tighter">Revenus générés</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
                      <TrendingUp className={`w-5 h-5 ${report.trend === 'up' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      {report.trend === 'up' ? (
                        <Badge className="bg-green-500 dark:bg-green-600 text-white border-0 font-bold px-3">↑ +12%</Badge>
                      ) : (
                        <Badge className="bg-gray-400 dark:bg-gray-500 text-white border-0 font-bold px-3">→ Stable</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 sm:p-10 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Statistiques Globales du Mois
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100">116</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mt-2 tracking-widest">Produits Utilisés</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">2,15M Fc</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mt-2 tracking-widest">Valeur Stock</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-900/20">
                  <p className="text-3xl sm:text-4xl font-black text-green-600 dark:text-green-400">+8%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mt-2 tracking-widest">vs Mois Dernier</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-8 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full py-7 text-lg font-bold shadow-lg shadow-amber-500/20 transition-all">
              Télécharger Rapport Complet (PDF)
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
