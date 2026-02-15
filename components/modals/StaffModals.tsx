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
import { Calendar, Clock, MapPin, Phone, Mail, DollarSign, Star, FileText, Download, Copy, Save, Loader2, CalendarIcon, TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useCommission, useWorkerSchedule } from '@/lib/hooks/useStaff';
import { Worker } from '@/lib/api/staff';
import CreateWorkerModal from './CreateWorkerModal';
import { useAuth } from '@/lib/hooks/useAuth';

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
    if (!schedule || Object.keys(weekSchedule).length > 0) return;


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
  const saveDay = async (day: number, override?: DaySchedule) => {
    const d = override ?? weekSchedule[day];
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
                        onCheckedChange={(checked) => {
                          const value = checked === true;

                          const updated = {
                            ...weekSchedule[day.idx],
                            isAvailable: value,
                          };

                          updateDay(day.idx, { isAvailable: value });

                          saveDay(day.idx, updated);
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
  const [selectedMonth, setSelectedMonth] = useState("2026-02");

  const allMonths = [
    { value: "2026-01", label: "Janvier 2026" }
    , { value: "2026-02", label: "Février 2026" }
    , { value: "2026-03", label: "Mars 2026" }
    , { value: "2026-04", label: "Avril 2026" }
    , { value: "2026-05", label: "Mai 2026" }
    , { value: "2026-06", label: "Juin 2026" }
    , { value: "2026-07", label: "Juillet 2026" }
    , { value: "2026-08", label: "Août 2026" }
    , { value: "2026-09", label: "Septembre 2026" }
    , { value: "2026-10", label: "Octobre 2026" }
    , { value: "2026-11", label: "Novembre 2026" }
    , { value: "2026-12", label: "Décembre 2026" },
  ]
  const scheduleData = [
    { idx: 0, day: 'Lundi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { idx: 1, day: 'Mardi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { idx: 2, day: 'Mercredi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { idx: 3, day: 'Jeudi', slots: ['09:00-12:00', '13:00-16:00', '16:00-18:00'] },
    { idx: 4, day: 'Vendredi', slots: ['09:00-12:00', '13:00-16:00', '16:00-19:00'] },
    { idx: 5, day: 'Samedi', slots: ['Ouvert toute la journée'] }
  ];

  const { commissions, isUpdating } = useCommission();

  const getCommissionForMonth = (month: string) =>
    commissions.find(
      (c) =>
        c.workerId === staff?.id &&
        c.period === month
    );

  const isMonthPaid = (month: string) =>
    getCommissionForMonth(month)?.status === "paid";

  const totalRevenue = getCommissionForMonth(selectedMonth || "")?.totalRevenue || 0;
  const commissionRate = getCommissionForMonth(selectedMonth || "")?.commissionRate || 0;
  const appointmentsCount = getCommissionForMonth(selectedMonth || "")?.appointmentsCount || 0;
  const commissionAmount = getCommissionForMonth(selectedMonth || "")?.commissionAmount || 0;
  const employerShare = totalRevenue - commissionAmount;
  const materielShare = employerShare * 0.05; // 5% du total pour les produits de beauté.
  const operationalCosts = employerShare * 0.05; // 5% du total pour les coûts opérationnels.

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-pink-400 to-purple-500 relative">
          <CreateWorkerModal triggerLabel="Edit" />
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Profile Info */}
            <div className="w-full md:w-1/3 -mt-12 flex flex-col items-center text-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl bg-gray-100 text-gray-600">
                  {staff?.name.split(" ")[0]?.charAt(0) || staff?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl  text-gray-900 dark:text-gray-100">{staff?.name}</h3>
                <p className="text-pink-600 font-medium">Employee</p>
              </div>
              <Badge className={staff?.isAvailable ? 'bg-green-500' : 'bg-gray-400'}>
                {staff?.isAvailable ? 'Employée Active' : 'Inactif'}
              </Badge>

              <div className="w-full pt-4 space-y-4 text-left bg-gray-50 dark:bg-background p-4 rounded-xl">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" /> {staff?.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" /> {staff?.email}
                </div>
                {/* <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" /> {staff?.position}
                </div> */}
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" /> Embauche: {staff?.hireDate ? staff?.hireDate.split('T')[0].split('-').reverse().join('/') : "N/A"}
                </div>
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
            </div>

            {/* Main Content Tabs */}
            <div className="w-full md:w-2/3 pt-6">
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="w-full dark:bg-gray-950 border border-gray-200 dark:border-pink-900/30 justify-start border-b rounded-full h-auto p-0 bg-transparent sm:justify-center">
                  <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Performance</TabsTrigger>
                  <TabsTrigger value="schedule" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Horaires</TabsTrigger>
                  <TabsTrigger value="commission" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Commission</TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 dark:data-[state=active]:text-pink-400">Documents</TabsTrigger>
                </TabsList>
                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-2">{staff?.name}</h3>
                      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">{staff?.role}</p>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2"><span>📞</span> {staff?.phone}</p>
                        <p className="flex items-center gap-2"><span>📧</span> {staff?.email}</p>
                        <p className="flex items-center gap-2"><span>🕒</span> {staff?.workingHours}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 p-3 sm:p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                      <span className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 ">{staff?.rating}</span>
                    </div>

                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-0 p-3 sm:p-4 shadow-sm">
                      <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{staff?.appointmentsCount}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">RDV ce mois</p>
                    </Card>
                    <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 p-3 sm:p-4 shadow-sm">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">{staff?.revenue}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Revenus</p>
                    </Card>
                    <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 p-3 sm:p-4 shadow-sm">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mb-2" />
                      <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{staff?.clientRetention}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Rétention</p>
                    </Card>
                    <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-0 p-3 sm:p-4 shadow-sm">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 mb-2" />
                      <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 ">{staff?.upsellRate}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Taux Vente+</p>
                    </Card>
                  </div>

                  {/* Working Days */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-3 font-medium">Jours de Travail</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                        <Badge
                          key={day}
                          className={staff?.schedules?.some((s: any) => s.dayOfWeek === index && s.isAvailable)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500'}
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <EditScheduleModal
                      staffId={staff?.id || ""}
                      staffName={staff?.name}
                      trigger={
                        <Button className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          Modifier Horaires
                        </Button>
                      }
                    />
                  </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-6">
                  <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4 font-medium">Planning de la Semaine</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {scheduleData.map((day, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{day.day}</p>
                          <Badge className={
                            staff?.workingDays.includes(day.day.substring(0, 3))
                              ? 'bg-green-500 text-white text-[10px]'
                              : 'bg-gray-400 text-white text-[10px]'
                          }>
                            {staff?.workingDays.includes(day.day.substring(0, 3))
                              ? 'Travaille' : 'Repos'}
                          </Badge>
                        </div>
                        {staff?.workingDays.includes(day.day.substring(0, 3)) && (
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot, sidx) => (
                              <Badge key={sidx} variant="outline" className="text-[10px] sm:text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <EditScheduleModal
                    staffId={staff?.id || ''}
                    staffName={staff?.name}
                    trigger={
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                        Modifier Planning
                      </Button>
                    }
                  />
                </TabsContent>

                {/* Commission Tab */}
                <TabsContent value="commission" className="space-y-6">
                  <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4 font-medium">Calcul Commission & Paie</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allMonths.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            disabled={isMonthPaid(m.value)}
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedMonth && getCommissionForMonth(selectedMonth) && (
                      <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-0 p-5 sm:p-6 shadow-sm">
                        <h5 className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-4  flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Ce Mois ( {allMonths.find((m) => m.value === selectedMonth)?.label} - {getCommissionForMonth(selectedMonth)?.status === "paid" ? "Payé" : "En attente"})
                        </h5>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Revenus générés</span>
                            <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">{totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Taux commission</span>
                            <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 ">{commissionRate.toLocaleString()}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Business revenue</span>
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{employerShare}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Materials reserve</span>
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{materielShare}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Operational costs </span>
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">{operationalCosts}</span>
                          </div>

                          <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">Commission totale</span>
                            <span className="text-xl sm:text-2xl text-green-600 dark:text-green-400 font-black">{commissionAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>
                    )}

                    {!isMonthPaid(selectedMonth) && (
                      <PayrollModal
                        staffName={staff?.name}
                        staff={staff}
                        period={selectedMonth}
                        trigger={
                          <Button
                            size="sm"
                            className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full"
                          >
                            Générer Fiche de Paie
                          </Button>
                        }
                      />
                    )}

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
  staff?: Worker;
  period?: string;
  trigger?: React.ReactNode;
}

export function PayrollModal({ staffName, staff, period, trigger }: PayrollModalProps) {
  const { user } = useAuth(); // or however you get current user
  const isAdmin = user?.role === "admin";
  const { createCommission, isCreating } = useCommission();

  const { updateCommission, commissions, isUpdating } = useCommission();
  const allMonths = [
    { value: "2026-01", label: "Janvier 2026" }
    , { value: "2026-02", label: "Février 2026" }
    , { value: "2026-03", label: "Mars 2026" }
    , { value: "2026-04", label: "Avril 2026" }
    , { value: "2026-05", label: "Mai 2026" }
    , { value: "2026-06", label: "Juin 2026" }
    , { value: "2026-07", label: "Juillet 2026" }
    , { value: "2026-08", label: "Août 2026" }
    , { value: "2026-09", label: "Septembre 2026" }
    , { value: "2026-10", label: "Octobre 2026" }
    , { value: "2026-11", label: "Novembre 2026" }
    , { value: "2026-12", label: "Décembre 2026" },
  ]

  const getCommissionForMonth = (month: string) =>
    commissions.find(
      (c: any) =>
        c.workerId === staff?.id &&
        c.period === month
    );

  const isMonthPaid = (month: string) =>
    getCommissionForMonth(month)?.status === "paid";

  const unpaidMonths = allMonths.filter(
    (m) => !isMonthPaid(m.value)
  );

  const totalRevenue = getCommissionForMonth(period || "")?.totalRevenue || 0;
  const commissionRate = getCommissionForMonth(period || "")?.commissionRate || 0;
  const appointmentsCount = getCommissionForMonth(period || "")?.appointmentsCount || 0;
  const commissionAmount = getCommissionForMonth(period || "")?.commissionAmount || 0;
  const employerShare = totalRevenue - commissionAmount;

  const handleGenerate = () => {
    if (!staff) return;

    createCommission({
      workerId: staff.id,
      period,
      totalRevenue,
      appointmentsCount,
      commissionRate,
    });
  };

  const handleApprove = () => {
    const commission = getCommissionForMonth(period || "");
    if (!commission?.id) return;

    updateCommission({
      id: commission.id,
      status: "paid",
    });
  };


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
              <Select value={period} >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unpaidMonths.filter(m => m.value === period && !isMonthPaid(m.value)).map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Détails du Calcul</h4>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-gray-600">Totall Revenue</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={totalRevenue}
                  className="text-right pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">Fc</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <Label className="text-gray-600">Commissions (Auto)</Label>
              <div className="relative">
                <Input value={commissionAmount} disabled className="text-right pr-12 bg-gray-50 dark:bg-background" />
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">Fc</span>
              </div>
            </div>
            {isAdmin && (
              <div className="grid grid-cols-2 gap-4 items-center">
                <Label className="text-blue-600">Part Administrateur</Label>
                <div className="relative">
                  <Input
                    value={employerShare}
                    disabled
                    className="text-right pr-12 bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                    Fc
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
            <span className="font-medium">Net à Payer</span>
            <span className="text-xl ">{commissionAmount.toLocaleString()} Fc</span>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="email-slip" defaultChecked className="border-gray-400" />
            <Label htmlFor="email-slip" className="text-gray-600 cursor-pointer">Envoyer par email à l'employeur</Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> PDF
          </Button>
          {isAdmin ? (
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isUpdating ? "Paiement..." : "Approuver & Payer"}
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isCreating || !isMonthPaid(period || "")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isCreating ? "Envoi..." : !isMonthPaid(period || "") ? "Payement en attente" : "Demander Paiement"}
            </Button>
          )}

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
