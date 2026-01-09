"use client"
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, AlertCircle, TrendingUp, ShoppingCart, Phone, Mail, Search } from 'lucide-react';

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

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Vernis Gel - Rouge Passion',
      category: 'Onglerie',
      stock: 45,
      minStock: 30,
      unit: 'unités',
      price: '15 000 CDF',
      supplier: 'Beauty Supplies DRC',
      lastRestock: '2024-11-15',
      usageRate: '8 unités/semaine',
      status: 'good'
    },
    {
      id: '2',
      name: 'Extensions Cils - Volume Classique',
      category: 'Cils',
      stock: 28,
      minStock: 30,
      unit: 'boîtes',
      price: '25 000 CDF',
      supplier: 'Lash Pro Africa',
      lastRestock: '2024-11-01',
      usageRate: '6 boîtes/semaine',
      status: 'low'
    },
    {
      id: '3',
      name: 'Rajouts Cheveux - Box Braids',
      category: 'Tresses',
      stock: 15,
      minStock: 20,
      unit: 'paquets',
      price: '30 000 CDF',
      supplier: 'African Hair Supplies',
      lastRestock: '2024-10-20',
      usageRate: '4 paquets/semaine',
      status: 'critical'
    },
    {
      id: '4',
      name: 'Fond de Teint - Teintes Variées',
      category: 'Maquillage',
      stock: 60,
      minStock: 40,
      unit: 'unités',
      price: '20 000 CDF',
      supplier: 'Makeup Pro Congo',
      lastRestock: '2024-11-20',
      usageRate: '5 unités/semaine',
      status: 'good'
    },
    {
      id: '5',
      name: 'Colle Cils - Professional',
      category: 'Cils',
      stock: 0,
      minStock: 15,
      unit: 'tubes',
      price: '18 000 CDF',
      supplier: 'Lash Pro Africa',
      lastRestock: '2024-10-15',
      usageRate: '3 tubes/semaine',
      status: 'out'
    },
    {
      id: '6',
      name: 'Vernis Gel - Rose Poudré',
      category: 'Onglerie',
      stock: 38,
      minStock: 30,
      unit: 'unités',
      price: '15 000 CDF',
      supplier: 'Beauty Supplies DRC',
      lastRestock: '2024-11-18',
      usageRate: '7 unités/semaine',
      status: 'good'
    },
    {
      id: '7',
      name: 'Huile Démaquillante',
      category: 'Maquillage',
      stock: 22,
      minStock: 25,
      unit: 'flacons',
      price: '12 000 CDF',
      supplier: 'Makeup Pro Congo',
      lastRestock: '2024-11-10',
      usageRate: '4 flacons/semaine',
      status: 'low'
    },
    {
      id: '8',
      name: 'Fils Tresses - Noir',
      category: 'Tresses',
      stock: 42,
      minStock: 25,
      unit: 'bobines',
      price: '8 000 CDF',
      supplier: 'African Hair Supplies',
      lastRestock: '2024-11-22',
      usageRate: '6 bobines/semaine',
      status: 'good'
    }
  ];

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
    { item: 'Vernis Gel', used: 32, revenue: '480 000 CDF', trend: 'up' },
    { item: 'Extensions Cils', used: 24, revenue: '600 000 CDF', trend: 'up' },
    { item: 'Rajouts Cheveux', used: 16, revenue: '480 000 CDF', trend: 'stable' },
    { item: 'Fond de Teint', used: 20, revenue: '400 000 CDF', trend: 'up' },
    { item: 'Fils Tresses', used: 24, revenue: '192 000 CDF', trend: 'stable' }
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-gray-900">Gestion de l'Inventaire</h2>
        <Button className="bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full">
          + Ajouter Produit
        </Button>
      </div>

      {/* Alert Panel */}
      {alertItems.length > 0 && (
        <Card className="border-0 shadow-lg rounded-2xl p-6 bg-linear-to-br from-red-50 to-orange-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl text-gray-900 mb-2">Alertes Stock</h3>
              <p className="text-gray-700 mb-3">
                {alertItems.length} produit(s) nécessite(nt) un réapprovisionnement immédiat
              </p>
              <div className="flex flex-wrap gap-2">
                {alertItems.map((item) => (
                  <Badge key={item.id} className={`${item.status === 'out' ? 'bg-red-600' :
                    item.status === 'critical' ? 'bg-orange-600' : 'bg-amber-600'
                    } text-white`}>
                    {item.name} ({item.stock} {item.unit})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full"
            >
              Tous
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="stock" className="rounded-lg">Stock</TabsTrigger>
          <TabsTrigger value="suppliers" className="rounded-lg">Fournisseurs</TabsTrigger>
          <TabsTrigger value="usage" className="rounded-lg">Rapport d'Utilisation</TabsTrigger>
        </TabsList>

        {/* Stock Tab */}
        <TabsContent value="stock">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => (
              <Card key={item.id} className={`border-2 p-6 rounded-2xl ${item.status === 'out' ? 'border-red-300 bg-red-50' :
                item.status === 'critical' ? 'border-orange-300 bg-orange-50' :
                  item.status === 'low' ? 'border-amber-300 bg-amber-50' :
                    'border-green-300 bg-green-50'
                }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.status === 'out' ? 'bg-red-100' :
                    item.status === 'critical' ? 'bg-orange-100' :
                      item.status === 'low' ? 'bg-amber-100' : 'bg-green-100'
                    }`}>
                    <Package className={`w-6 h-6 ${item.status === 'out' ? 'text-red-600' :
                      item.status === 'critical' ? 'text-orange-600' :
                        item.status === 'low' ? 'text-amber-600' : 'text-green-600'
                      }`} />
                  </div>
                  <Badge className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                <h3 className="text-lg text-gray-900 mb-2">{item.name}</h3>

                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Stock actuel:</span>
                    <span className="text-gray-900">
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock minimum:</span>
                    <span className="text-gray-900">
                      {item.minStock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix unitaire:</span>
                    <span className="text-gray-900">{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilisation:</span>
                    <span className="text-gray-900">{item.usageRate}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full ${item.status === 'out' ? 'bg-red-600' :
                      item.status === 'critical' ? 'bg-orange-600' :
                        item.status === 'low' ? 'bg-amber-600' : 'bg-green-600'
                      }`}
                    style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Fournisseur: {item.supplier}
                  </p>
                  <p className="text-xs text-gray-600">
                    Dernier réappro: {item.lastRestock}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  {(item.status === 'low' || item.status === 'critical' || item.status === 'out') && (
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Commander
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 rounded-full">
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
              <Card key={supplier.id} className="border-0 shadow-lg rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">Contact: {supplier.contact}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl text-gray-900">{supplier.rating}</span>
                    <span className="text-amber-400">⭐</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {supplier.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {supplier.email}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Produits fournis:</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.products.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-full">
                    Passer Commande
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Contacter
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
            + Ajouter Fournisseur
          </Button>
        </TabsContent>

        {/* Usage Report Tab */}
        <TabsContent value="usage">
          <Card className="border-0 shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl text-gray-900 mb-6">Rapport d'Utilisation - Novembre 2024</h3>
            <div className="space-y-4">
              {usageReport.map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{report.item}</p>
                    <p className="text-sm text-gray-600">
                      {report.used} unités utilisées ce mois
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg text-gray-900">{report.revenue}</p>
                      <p className="text-xs text-gray-600">Revenus générés</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${report.trend === 'up' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      {report.trend === 'up' ? (
                        <Badge className="bg-green-500 text-white">↑ +12%</Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white">→ Stable</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl">
              <h4 className="text-lg text-gray-900 mb-4">Statistiques du Mois</h4>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl text-gray-900">116</p>
                  <p className="text-sm text-gray-600">Produits Utilisés</p>
                </div>
                <div>
                  <p className="text-2xl text-gray-900">2 152 000 CDF</p>
                  <p className="text-sm text-gray-600">Valeur Utilisée</p>
                </div>
                <div>
                  <p className="text-3xl text-green-600">+8%</p>
                  <p className="text-sm text-gray-600">vs Mois Dernier</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full">
              Télécharger Rapport Complet
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
