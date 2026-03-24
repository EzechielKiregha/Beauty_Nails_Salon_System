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
import { useAuth } from '@/lib/hooks/useAuth';
import WorkerProfileSettings from '../WorkerProfileSettings';

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

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 dark:bg-gray-950">
        <WorkerProfileSettings />
      </DialogContent>
    </Dialog>
  );
}