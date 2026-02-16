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

// --- Edit Schedule Modal (Mobile Optimized with Dark Mode) ---
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
      <DialogContent className="sm:max-w-180 max-h-[85vh] overflow-y-auto dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="text-gray-900 dark:text-gray-100">Modifier Planning - {staffName || "Employée"}</span>

            <Button variant="outline" size="sm" className="gap-2 text-xs dark:border-pink-900 dark:text-pink-300 dark:hover:border-pink-400">
              <Copy className="w-3 h-3" /> Copier semaine précédente
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* ---------------- TABLE ---------------- */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground mb-2 px-3 dark:text-gray-300">
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
                  className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-400 transition-colors"
                >
                  {/* Day */}
                  <div className="col-span-3 font-medium text-gray-900 dark:text-gray-100">
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
                      className="h-8 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
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
                      className="h-8 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>

                  {/* Availability */}
                  <div className="col-span-1 flex justify-center">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground dark:text-gray-400" />
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
                        className="scale-110 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 dark:data-[state=checked]:bg-pink-600 dark:data-[state=checked]:border-pink-600"
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
          <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Annuler
          </Button>

          <Button
            onClick={saveAll}
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 dark:bg-purple-700 dark:hover:bg-purple-800"
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

// --- Staff Profile Modal (Mobile Optimized with Enhanced Dark Mode) ---
interface StaffProfileModalProps {
  staff?: Worker;
  trigger?: React.ReactNode;
}

export function StaffProfileModal({ staff, trigger }: StaffProfileModalProps) {
  const [selectedMonth, setSelectedMonth] = useState("2026-02");
  const allMonths = [
    { value: "2026-01", label: "Janvier 2026" },
    { value: "2026-02", label: "Février 2026" },
    { value: "2026-03", label: "Mars 2026" },
    { value: "2026-04", label: "Avril 2026" },
    { value: "2026-05", label: "Mai 2026" },
    { value: "2026-06", label: "Juin 2026" },
    { value: "2026-07", label: "Juillet 2026" },
    { value: "2026-08", label: "Août 2026" },
    { value: "2026-09", label: "Septembre 2026" },
    { value: "2026-10", label: "Octobre 2026" },
    { value: "2026-11", label: "Novembre 2026" },
    { value: "2026-12", label: "Décembre 2026" },
  ];

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
      <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="sr-only">Profil Employée</DialogTitle>
        </DialogHeader>

        <div className="px-2 pb-4">
          <div className="flex flex-col gap-6">
            {/* Profile Info - Mobile Optimized */}
            <div className="w-full text-center space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg dark:border-gray-800">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {staff?.name.split(" ")[0]?.charAt(0) || staff?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{staff?.name}</h3>
                <p className="text-pink-600 dark:text-pink-400 font-medium">Employee</p>
              </div>

              <Badge className={staff?.isAvailable ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-700'}>
                {staff?.isAvailable ? 'Employée Active' : 'Inactif'}
              </Badge>

              <div className="w-full space-y-3 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  {staff?.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  {staff?.email}
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  Embauche: {staff?.hireDate ? staff?.hireDate.split('T')[0].split('-').reverse().join('/') : "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-left block font-semibold text-gray-900 dark:text-gray-100">Biographie</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-left">
                  Spécialiste en onglerie avec plus de 5 ans d'expérience.
                  Experte en Nail Art et soins des mains. Appréciée pour sa douceur et sa créativité.
                  Parle Français et Lingala couramment.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-left block font-semibold text-gray-900 dark:text-gray-100">Compétences</Label>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Manucure', 'Pédicure', 'Nail Art', 'Gel', 'Acrylique', 'Massage des mains'].map(skill => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Tabs */}
            <div className="w-full pt-2">
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap dark:border-gray-700">
                  <TabsTrigger
                    value="performance"
                    className="rounded-lg px-4 py-2 mb-2 sm:mb-0 sm:mr-2 text-sm data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-400"
                  >
                    Performance
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="rounded-lg px-4 py-2 mb-2 sm:mb-0 sm:mr-2 text-sm data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-400"
                  >
                    Horaires
                  </TabsTrigger>
                  <TabsTrigger
                    value="commission"
                    className="rounded-lg px-4 py-2 mb-2 sm:mb-0 sm:mr-2 text-sm data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-400"
                  >
                    Commission
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="rounded-lg px-4 py-2 mb-2 sm:mb-0 sm:mr-2 text-sm data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-400"
                  >
                    Documents
                  </TabsTrigger>
                </TabsList>

                {/* Performance Tab - Mobile Optimized */}
                <TabsContent value="performance" className="space-y-4 mt-4">
                  <div className="flex flex-col items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{staff?.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{staff?.role}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400 dark:fill-amber-500 dark:text-amber-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{staff?.rating}</span>
                    </div>
                  </div>

                  {/* Performance Metrics - Stacked on mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 p-3">
                      <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{staff?.appointmentsCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">RDV ce mois</p>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 p-3">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{staff?.revenue}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Revenus</p>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 p-3">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{staff?.clientRetention}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Rétention</p>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 p-3">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{staff?.upsellRate}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Taux Vente+</p>
                    </Card>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Jours de Travail</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                        <Badge
                          key={day}
                          className={staff?.schedules?.some((s: any) => s.dayOfWeek === index && s.isAvailable)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <EditScheduleModal
                    staffId={staff?.id || ""}
                    staffName={staff?.name}
                    trigger={
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700">
                        Modifier Horaires
                      </Button>
                    }
                  />
                </TabsContent>

                {/* Schedule Tab - Mobile Optimized */}
                <TabsContent value="schedule" className="space-y-4 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Planning de la Semaine</h4>
                  <div className="space-y-3">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{day}</p>
                          <Badge className={
                            staff?.workingDays.includes(day.substring(0, 3))
                              ? 'bg-green-500 text-white text-xs'
                              : 'bg-gray-400 dark:bg-gray-700 text-white text-xs'
                          }>
                            {staff?.workingDays.includes(day.substring(0, 3))
                              ? 'Travaille' : 'Repos'}
                          </Badge>
                        </div>
                        {staff?.workingDays.includes(day.substring(0, 3)) && (
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              09:00-12:00
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              13:00-16:00
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              16:00-18:00
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <EditScheduleModal
                    staffId={staff?.id || ''}
                    staffName={staff?.name}
                    trigger={
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800">
                        Modifier Planning
                      </Button>
                    }
                  />
                </TabsContent>

                {/* Commission Tab - Mobile Optimized */}
                <TabsContent value="commission" className="space-y-4 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Calcul Commission & Paie</h4>
                  <div className="space-y-4">
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {allMonths.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            disabled={isMonthPaid(m.value)}
                            className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedMonth && getCommissionForMonth(selectedMonth) && (
                      <Card className="hover:shadow-lg transition-shadow border border-pink-100 hover:border-pink-400 dark:border-pink-900 dark:hover:border-pink-400 shadow-xl rounded-2xl bg-white dark:bg-gray-950 p-4">
                        <h5 className="text-sm mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Ce Mois ({allMonths.find((m) => m.value === selectedMonth)?.label} - {getCommissionForMonth(selectedMonth)?.status === "paid" ? "Payé" : "En attente"})
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Revenus générés</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Taux commission</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{commissionRate.toLocaleString()}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Business revenue</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{employerShare}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Materials reserve</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{materielShare}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Operational costs</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{operationalCosts}</span>
                          </div>

                          <Separator className="my-3 dark:bg-gray-700" />

                          <div className="flex justify-between items-center pt-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">Commission totale</span>
                            <span className="text-xl text-green-600 dark:text-green-400 font-bold">{commissionAmount.toLocaleString()}</span>
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
                            size="default"
                            className="w-full bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                          >
                            Générer Fiche de Paie
                          </Button>
                        }
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Documents Tab - Mobile Optimized */}
                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-3">
                    {['Contrat de travail.pdf', 'Pièce d\'identité.jpg', 'Certificats.pdf'].map((doc, i) => (
                      <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                          <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-500 dark:text-pink-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{doc}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ajouté le 12 Jan 2023</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-dashed py-6 text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-400">
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

// --- Payroll Modal (Mobile Optimized with Dark Mode) ---
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
    { value: "2026-01", label: "Janvier 2026" },
    { value: "2026-02", label: "Février 2026" },
    { value: "2026-03", label: "Mars 2026" },
    { value: "2026-04", label: "Avril 2026" },
    { value: "2026-05", label: "Mai 2026" },
    { value: "2026-06", label: "Juin 2026" },
    { value: "2026-07", label: "Juillet 2026" },
    { value: "2026-08", label: "Août 2026" },
    { value: "2026-09", label: "Septembre 2026" },
    { value: "2026-10", label: "Octobre 2026" },
    { value: "2026-11", label: "Novembre 2026" },
    { value: "2026-12", label: "Décembre 2026" },
  ];

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
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto p-4 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Générer Fiche de Paie</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300">Employée</Label>
              <Input
                value={staffName || 'Marie Nkumu'}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300">Période</Label>
              <Select value={period}>
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

          <Separator className="dark:bg-gray-700" />

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Détails du Calcul</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-gray-600 dark:text-gray-400 text-sm">Totall Revenue</Label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Fc</span>
                  <Input
                    type="number"
                    value={totalRevenue}
                    className="text-right w-32 h-10 text-base bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label className="text-gray-600 dark:text-gray-400 text-sm">Commissions (Auto)</Label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Fc</span>
                  <Input
                    value={commissionAmount}
                    disabled
                    className="text-right w-32 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-between items-center">
                  <Label className="text-blue-600 dark:text-blue-400 text-sm">Part Administrateur</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Fc</span>
                    <Input
                      value={employerShare}
                      disabled
                      className="text-right w-32 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-xl flex justify-between items-center">
              <span className="font-medium">Net à Payer</span>
              <span className="text-xl font-bold">{commissionAmount.toLocaleString()} Fc</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="email-slip"
                defaultChecked
                className="border-gray-400 dark:border-gray-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 dark:data-[state=checked]:bg-pink-600 dark:data-[state=checked]:border-pink-600"
              />
              <Label htmlFor="email-slip" className="text-gray-600 dark:text-gray-400">Envoyer par email à l'employeur</Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
          <Button variant="outline" className="w-full sm:w-auto gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="w-4 h-4" /> PDF
          </Button>
          {isAdmin ? (
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              {isUpdating ? "Paiement..." : "Approuver & Payer"}
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isCreating || !isMonthPaid(period || "")}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
            >
              {isCreating ? "Envoi..." : !isMonthPaid(period || "") ? "Payement en attente" : "Demander Paiement"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}