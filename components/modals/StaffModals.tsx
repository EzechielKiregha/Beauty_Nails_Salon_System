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
import { Calendar, Clock, MapPin, Phone, Mail, DollarSign, Star, FileText, Download, Copy, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useWorkerSchedule } from '@/lib/hooks/useStaff';
import { Worker } from '@/lib/api/staff';

interface EditScheduleModalProps {
  staffId: string;
  staffName?: string;
  trigger?: React.ReactNode;
}

type DaySchedule = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export function EditScheduleModal({
  staffId,
  staffName,
  trigger,
}: EditScheduleModalProps) {
  const { updateSchedule, schedule, isUpdating } = useWorkerSchedule(staffId);

  const [weekSchedule, setWeekSchedule] = useState<Record<number, DaySchedule>>({});
  const [savingDays, setSavingDays] = useState<Record<number, boolean>>({});

  const daysOfWeek = [
    { idx: 0, day: "Lundi" },
    { idx: 1, day: "Mardi" },
    { idx: 2, day: "Mercredi" },
    { idx: 3, day: "Jeudi" },
    { idx: 4, day: "Vendredi" },
    { idx: 5, day: "Samedi" },
    { idx: 6, day: "Dimanche" },
  ];

  /* ----------------------------------
     Map API schedule → UI state
  -----------------------------------*/
  useEffect(() => {
    if (!schedule) return;

    const map: Record<number, DaySchedule> = {};

    schedule.forEach((s: any) => {
      map[s.dayOfWeek] = {
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable,
      };
    });

    daysOfWeek.forEach((d) => {
      if (!map[d.idx]) {
        map[d.idx] = {
          startTime: "09:00",
          endTime: "18:00",
          isAvailable: d.idx !== 6,
        };
      }
    });

    // 🔥 Prevent infinite loop
    setWeekSchedule((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(map)) {
        return prev;
      }
      return map;
    });
  }, [schedule]);

  /* ----------------------------------
    Local updater
  -----------------------------------*/
  const updateDay = (day: number, changes: Partial<DaySchedule>) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...changes,
      },
    }));
  };

  /* ----------------------------------
    Save one day
  -----------------------------------*/
  const saveDay = async (day: number) => {
    const d = weekSchedule[day];
    if (!d) return;

    try {
      setSavingDays((prev) => ({ ...prev, [day]: true }));

      await updateSchedule({
        dayOfWeek: day,
        startTime: d.startTime,
        endTime: d.endTime,
        isAvailable: d.isAvailable,
      });
    } finally {
      setSavingDays((prev) => ({ ...prev, [day]: false }));
    }
  };

  /* ----------------------------------
    Optional full save fallback
  -----------------------------------*/
  const saveAll = async () => {
    for (const day of Object.keys(weekSchedule)) {
      await saveDay(Number(day));
    }
  };

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-180 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Modifier Planning - {staffName || "Employée"}</span>

            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Copy className="w-3 h-3" /> Copier semaine précédente
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* ---------------- TABLE ---------------- */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-2">

            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground mb-2 px-3">
              <div className="col-span-3">Jour</div>
              <div className="col-span-4">Début</div>
              <div className="col-span-4">Fin</div>
              <div className="col-span-1 text-center">Actif</div>
            </div>

            {daysOfWeek.map((day) => {
              const row = weekSchedule[day.idx];
              const saving = savingDays[day.idx];

              return (
                <div
                  key={day.idx}
                  className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/30 rounded-lg border"
                >
                  {/* Day */}
                  <div className="col-span-3 font-medium">
                    {day.day}
                  </div>

                  {/* Start Time */}
                  <div className="col-span-4">
                    <Input
                      type="time"
                      value={row?.startTime || "09:00"}
                      disabled={!row?.isAvailable}
                      onChange={(e) =>
                        updateDay(day.idx, { startTime: e.target.value })
                      }
                      onBlur={() => saveDay(day.idx)}
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* End Time */}
                  <div className="col-span-4">
                    <Input
                      type="time"
                      value={row?.endTime || "18:00"}
                      disabled={!row?.isAvailable}
                      onChange={(e) =>
                        updateDay(day.idx, { endTime: e.target.value })
                      }
                      onBlur={() => saveDay(day.idx)}
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Availability */}
                  <div className="col-span-1 flex justify-center">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Checkbox
                        id={`day-${day.idx}`}
                        checked={row?.isAvailable ?? true}
                        onCheckedChange={(checked: boolean) => {
                          updateDay(day.idx, { isAvailable: checked });
                          saveDay(day.idx);
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional fallback save */}
        <DialogFooter>
          <Button variant="outline">Annuler</Button>

          <Button
            onClick={saveAll}
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer Planning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// --- Staff Profile Modal ---

interface StaffProfileModalProps {
  staff?: Worker;
  trigger?: React.ReactNode;
}

export function StaffProfileModal({ staff, trigger }: StaffProfileModalProps) {

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-pink-400 to-purple-500 relative">
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
                  {staff?.user?.name.split(" ")[0]?.charAt(0) || staff?.user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl  text-gray-900 dark:text-gray-100">{staff?.user?.name}</h3>
                <p className="text-pink-600 font-medium">Employee</p>
              </div>
              <Badge className={staff?.isAvailable ? 'bg-green-500' : 'bg-gray-400'}>
                {staff?.isAvailable ? 'Employée Active' : 'Inactif'}
              </Badge>

              <div className="w-full pt-4 space-y-4 text-left bg-gray-50 dark:bg-background p-4 rounded-xl">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" /> {staff?.user?.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" /> {staff?.user?.email}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" /> {staff?.position}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" /> Embauche: {staff?.hireDate.split('T')[0].split('-').reverse().join('/')}
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
                      <p className="text-3xl  text-blue-700">{staff?.rating.toFixed(1)}</p>
                      <p className="text-xs text-blue-600">Basé sur {staff?.totalReviews} avis</p>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Ventes (Mois)</span>
                      </div>
                      <p className="text-3xl  text-green-700">{staff?.totalSales} CDF</p>
                      <p className="text-xs text-green-600">CDF ce mois-ci</p>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 dark:text-gray-100 font-semibold">Biographie</Label>
                    <p className="text-sm text-gray-600 leading-relaxed bg-white border p-3 rounded-lg">
                      Spécialiste en onglerie avec plus de 5 ans d'expérience.
                      Experte en Nail Art et soins des mains. Appréciée pour sa douceur et sa créativité.
                      Parle Français et Lingala couramment.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 dark:text-gray-100 font-semibold">Compétences</Label>
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
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Historique des Services</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-background rounded-lg border">
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
                      <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:bg-background cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{doc}</p>
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
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Détails du Calcul</h4>

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
                <Input value={commission} disabled className="text-right pr-12 bg-gray-50 dark:bg-background" />
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
