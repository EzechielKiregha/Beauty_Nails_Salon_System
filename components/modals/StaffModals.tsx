import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Mail, DollarSign, Star, FileText, Download, Copy, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

// --- Edit Schedule Modal ---

interface EditScheduleModalProps {
  staffId?: string;
  staffName?: string;
  currentSchedule?: any;
  trigger?: React.ReactNode;
}

export function EditScheduleModal({ staffName, trigger }: EditScheduleModalProps) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Modifier Planning - {staffName || 'Employée'}</span>
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Copy className="w-3 h-3" /> Copier semaine précédente
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 mb-2 px-3">
              <div className="col-span-3">Jour</div>
              <div className="col-span-4">Matin</div>
              <div className="col-span-4">Après-midi</div>
              <div className="col-span-1">Actif</div>
            </div>

            {days.map((day) => (
              <div key={day} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="col-span-3 font-medium text-gray-900">{day}</div>

                <div className="col-span-4 flex items-center gap-1">
                  <Input type="time" defaultValue="09:00" className="h-8 text-xs" />
                  <span className="text-gray-400">-</span>
                  <Input type="time" defaultValue="13:00" className="h-8 text-xs" />
                </div>

                <div className="col-span-4 flex items-center gap-1">
                  <Input type="time" defaultValue="14:00" className="h-8 text-xs" />
                  <span className="text-gray-400">-</span>
                  <Input type="time" defaultValue="18:00" className="h-8 text-xs" />
                </div>

                <div className="col-span-1 flex justify-center">
                  <Checkbox id={`day-${day}`} defaultChecked={day !== 'Dimanche'} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Save className="w-4 h-4" /> Enregistrer Planning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Staff Profile Modal ---

interface StaffProfileModalProps {
  staff?: any;
  trigger?: React.ReactNode;
}

export function StaffProfileModal({ staff, trigger }: StaffProfileModalProps) {
  // Mock data if not provided
  const data = staff || {
    name: 'Marie Nkumu',
    role: 'Spécialiste Ongles',
    email: 'marie.n@beautynails.com',
    phone: '+243 810 111 222',
    address: '123 Av. Kasa-Vubu, Kinshasa',
    joinDate: '12 Jan 2023',
    status: 'active'
  };

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-400 to-purple-500 relative">
          <Button variant="secondary" size="sm" className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30 border-0">
            Modifier Profil
          </Button>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Profile Info */}
            <div className="w-full md:w-1/3 -mt-12 flex flex-col items-center text-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl bg-gray-100 text-gray-600">
                  {data.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl  text-gray-900">{data.name}</h3>
                <p className="text-pink-600 font-medium">{data.role}</p>
              </div>
              <Badge className={data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>
                {data.status === 'active' ? 'Employée Active' : 'Inactif'}
              </Badge>

              <div className="w-full pt-4 space-y-4 text-left bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" /> {data.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" /> {data.email}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" /> {data.address}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" /> Embauche: {data.joinDate}
                </div>
              </div>
            </div>

            {/* Main Content Tabs */}
            <div className="w-full md:w-2/3 pt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent px-4 pb-2">Aperçu</TabsTrigger>
                  <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent px-4 pb-2">Performance</TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-transparent px-4 pb-2">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-blue-50 border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Note Moyenne</span>
                      </div>
                      <p className="text-3xl  text-blue-700">4.9</p>
                      <p className="text-xs text-blue-600">Basé sur 124 avis</p>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Ventes (Mois)</span>
                      </div>
                      <p className="text-3xl  text-green-700">1.2M</p>
                      <p className="text-xs text-green-600">CDF ce mois-ci</p>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">Biographie</Label>
                    <p className="text-sm text-gray-600 leading-relaxed bg-white border p-3 rounded-lg">
                      Spécialiste en onglerie avec plus de 5 ans d'expérience.
                      Experte en Nail Art et soins des mains. Appréciée pour sa douceur et sa créativité.
                      Parle Français et Lingala couramment.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">Compétences</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Manucure', 'Pédicure', 'Nail Art', 'Gel', 'Acrylique', 'Massage des mains'].map(skill => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-6 space-y-4">
                  <h4 className="font-semibold text-gray-900">Historique des Services</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="font-medium">Manucure Gel</p>
                          <p className="text-xs text-gray-500">Hier, 14:00</p>
                        </div>
                        <div className="text-right">
                          <p className=" text-green-600">30 000 CDF</p>
                          <div className="flex text-yellow-400 text-xs">★★★★★</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="space-y-3">
                    {['Contrat de travail.pdf', 'Pièce d\'identité.jpg', 'Certificats.pdf'].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc}</p>
                            <p className="text-xs text-gray-500">Ajouté le 12 Jan 2023</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-pink-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 border-dashed border-2 py-8 text-gray-500 hover:text-pink-600 hover:border-pink-300">
                    + Ajouter un document
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Payroll Modal ---

interface PayrollModalProps {
  staffName?: string;
  trigger?: React.ReactNode;
}

export function PayrollModal({ staffName, trigger }: PayrollModalProps) {
  const [period, setPeriod] = useState('Nov 2024');
  const [baseSalary, setBaseSalary] = useState(450000);
  const [bonus, setBonus] = useState(50000);
  const [deductions, setDeductions] = useState(15000);
  const commission = 186000; // Mock commission based on sales

  const netSalary = baseSalary + commission + Number(bonus) - Number(deductions);

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Générer Fiche de Paie</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <Label>Employée</Label>
              <Input value={staffName || 'Marie Nkumu'} disabled className="bg-gray-100" />
            </div>
            <div className="w-1/2 space-y-2">
              <Label>Période</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nov 2024">Novembre 2024</SelectItem>
                  <SelectItem value="Oct 2024">Octobre 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Détails du Calcul</h4>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-gray-600">Salaire de base</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="text-right pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">CDF</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-gray-600">Commissions (Auto)</Label>
              <div className="relative">
                <Input value={commission} disabled className="text-right pr-12 bg-gray-50" />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">CDF</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-green-600">Bonus / Primes</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="text-right pr-12 text-green-700 border-green-200 focus-visible:ring-green-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">CDF</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-red-600">Retenues / Avances</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="text-right pr-12 text-red-700 border-red-200 focus-visible:ring-red-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">CDF</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
            <span className="font-medium">Net à Payer</span>
            <span className="text-xl ">{netSalary.toLocaleString()} CDF</span>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="email-slip" defaultChecked className="border-gray-400" />
            <Label htmlFor="email-slip" className="text-gray-600 cursor-pointer">Envoyer par email à l'employée</Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> PDF
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            Générer et Payer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
