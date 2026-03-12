"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  User,
  Briefcase,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Percent,
  Phone,
  Mail,
  Camera,
  Save,
  Loader2,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useWorker } from '@/lib/hooks/useStaff';
import { toast } from 'sonner';
import { commissionApi } from '@/lib/api/commission'; // Assuming this exists or similar endpoint
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useWorkerProfile } from '@/lib/hooks/useWorkerProfile';

interface StaffModalProps {
  staffId: string;
  trigger?: React.ReactNode;
}

interface CommissionSettings {
  commissionRate: number;
  commissionType: 'percentage' | 'fixed';
  commissionFrequency: 'daily' | 'weekly' | 'monthly';
  commissionDay: number;
  minimumPayout: number;
}

interface WorkingHours {
  [day: string]: {
    startTime: string;
    endTime: string;
  };
}

interface WorkerProfileData {
  position: string;
  specialties: string[];
  bio: string;
  isAvailable: boolean;
  workingHours: WorkingHours;
  // Add commission fields if they exist in WorkerProfile (schema suggests they might need to be added)
  commissionRate?: number;
  commissionType?: string;
  commissionFrequency?: string;
  commissionDay?: number;
  minimumPayout?: number;
  lastCommissionPaidAt?: Date | null;
}

export function StaffModal({ staffId, trigger }: StaffModalProps) {
  const { data: workerData, isLoading: isWorkerLoading, error: workerError, refetch: refetchWorker } = useWorker(staffId);
  const { updateProfile } = useWorkerProfile(staffId);

  const [formData, setFormData] = useState<WorkerProfileData>({
    position: '',
    specialties: [],
    bio: '',
    isAvailable: true,
    workingHours: {},
    commissionRate: 0,
    commissionType: 'percentage',
    commissionFrequency: 'monthly',
    commissionDay: 1,
    minimumPayout: 0,
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [isUpdating, setIsUpdating] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    if (workerData) {
      setFormData({
        position: workerData.position || '',
        specialties: workerData.specialties || [],
        bio: workerData.bio || '', // Assuming bio is added to WorkerProfile
        isAvailable: workerData.isAvailable,
        workingHours: workerData.workingHours || {},
        commissionRate: workerData.commissionRate || 0,
        commissionType: workerData.commissionType || 'percentage',
        commissionFrequency: workerData.commissionFrequency || 'monthly',
        commissionDay: workerData.commissionDay || 1,
        minimumPayout: workerData.minimumPayout || 0,
      });
    }
  }, [workerData]);

  if (!open) return null;

  if (isWorkerLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (workerError || !workerData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="mx-4 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-500 mb-4">Erreur de chargement du profil</p>
            {/* <Button onClick={() => onOpenChange(false)}>Fermer</Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof WorkerProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      handleInputChange('specialties', [...formData.specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties.splice(index, 1);
    handleInputChange('specialties', newSpecialties);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Example API call - adjust based on your actual API structure
      // This assumes an endpoint like PUT /api/workers/{id}/profile
      updateProfile({
        position: formData.position,
        specialties: formData.specialties,
        bio: formData.bio,
        isAvailable: true,
        workingHours: formData.workingHours,
        // Include commission fields if managed here
        commissionRate: formData.commissionRate,
        commissionType: formData.commissionType,
        commissionFrequency: formData.commissionFrequency,
        commissionDay: formData.commissionDay,
        minimumPayout: formData.minimumPayout,
      })

      await refetchWorker(); // Refresh the data after successful update
      toast.success('Profil mis à jour avec succès');
      // onOpenChange(false); // Close modal on success
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (type: 'commission-report' | 'payment-history' | 'earnings-statement', period?: string) => {
    try {
      // Example API calls for downloading documents
      // Replace these with your actual backend endpoints
      // let response;
      // switch (type) {
      //   case 'commission-report':
      //     response = await commissionApi.getReport(staffId, period); // Hypothetical API call
      //     break;
      //   case 'payment-history':
      //     response = await commissionApi.getPaymentHistory(staffId); // Hypothetical API call
      //     break;
      //   case 'earnings-statement':
      //     response = await commissionApi.getEarningsStatement(staffId, period); // Hypothetical API call
      //     break;
      //   default:
      //     throw new Error('Type de document inconnu');
      // }

      // Assuming the response contains a URL or blob data
      // const url = window.URL.createObjectURL(response.blob()); // If it's a blob
      // const link = document.createElement('a');
      // link.href = url; // Or response.url
      // link.download = `${type}_${period || 'current'}.pdf`;
      // link.click();
      // window.URL.revokeObjectURL(url);

      // For now, just show a success message
      toast.success(`Téléchargement de ${type} démarré`);
    } catch (err: any) {
      console.error(`Erreur lors du téléchargement de ${type}:`, err);
      toast.error(`Erreur lors du téléchargement de ${type}`);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="sr-only">Profil Employée - {workerData.user?.name || workerData.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="professional">Professionnel</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={workerData.user?.avatar || ""} alt={workerData.user?.name} />
                    <AvatarFallback>{workerData.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{workerData.user?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{workerData.user?.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{workerData.user?.phone}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{workerData.rating.toFixed(1)} ({workerData.totalReviews} avis)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Poste</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Poste occupé"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hireDate">Date d'embauche</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={workerData.hireDate.split('T')[0]}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Décrivez vos compétences, votre expérience et votre parcours..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="p-6">
              <div className="space-y-6">
                <div>
                  <Label>Compétences</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialty(index)}>
                        {skill} ✕
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Ajouter une compétence"
                      onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                    />
                    <Button onClick={addSpecialty}>Ajouter</Button>
                  </div>
                </div>

                <div>
                  <Label>Disponibilité</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span>Accepter les nouveaux rendez-vous</span>
                    <Switch
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Horaires de travail Hebdomadaires</Label>
                  <div className="space-y-2 mt-2">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex items-center justify-between gap-4">
                        <span className="capitalize w-24">{day}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Input
                              type="time"
                              value={formData.workingHours[day]?.startTime || '09:00'}
                              onChange={(e) => handleWorkingHoursChange(day, 'startTime', e.target.value)}
                              className="w-24"
                            />
                          </div>
                          <span>-</span>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Input
                              type="time"
                              value={formData.workingHours[day]?.endTime || '17:00'}
                              onChange={(e) => handleWorkingHoursChange(day, 'endTime', e.target.value)}
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Commission Settings Tab */}
            <TabsContent value="commission" className="p-6">
              <div className="space-y-6">
                <Card className="bg-muted p-4">
                  <h3 className="font-medium mb-2">Résumé Actuel</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Taux de base:</span>
                      <span>{workerData.commissionRate}%</span>
                    </div>
                    {/* Add other summary fields as needed */}
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="commissionRate"
                        type="number"
                        step="0.1"
                        value={formData.commissionRate}
                        onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="minimumPayout">Seuil minimum de paiement (CDF)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="minimumPayout"
                        type="number"
                        step="100"
                        value={formData.minimumPayout}
                        onChange={(e) => handleInputChange('minimumPayout', parseFloat(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissionFrequency">Fréquence de paiement</Label>
                    <Select
                      value={formData.commissionFrequency}
                      onValueChange={(value: any) => handleInputChange('commissionFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="commissionDay">Jour de paiement estimé</Label>
                    <Input
                      id="commissionDay"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.commissionDay}
                      onChange={(e) => handleInputChange('commissionDay', parseInt(e.target.value) || 1)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Appliqué selon la fréquence sélectionnée.</p>
                  </div>
                </div>

                <div>
                  <Label>Type de commission</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="percentage"
                        name="commissionType"
                        checked={formData.commissionType === 'percentage'}
                        onChange={() => handleInputChange('commissionType', 'percentage')}
                        className="mr-2"
                      />
                      <Label htmlFor="percentage">Pourcentage</Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="fixed"
                        name="commissionType"
                        checked={formData.commissionType === 'fixed'}
                        onChange={() => handleInputChange('commissionType', 'fixed')}
                        className="mr-2"
                      />
                      <Label htmlFor="fixed">Montant Fixe</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="p-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">Rapport de Commission</h3>
                          <p className="text-sm text-muted-foreground">Détail des commissions gagnées</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDownload('commission-report', 'current')}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-500" />
                        <div>
                          <h3 className="font-medium">Historique des Paiements</h3>
                          <p className="text-sm text-muted-foreground">Historique des paiements reçus</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDownload('payment-history')}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-purple-500" />
                        <div>
                          <h3 className="font-medium">Relevé de Gains</h3>
                          <p className="text-sm text-muted-foreground">Synthèse des gains mensuels</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDownload('earnings-statement', 'current')}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Separator />

          <div className="p-4 flex justify-end gap-2">
            {/* <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button> */}
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}