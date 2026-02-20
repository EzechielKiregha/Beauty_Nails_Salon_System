'use client';

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useSalonProfile, useUpdateSalonProfile, useSystemSettings, useUpdateSystemSettings } from '@/lib/hooks/useSettings';
import { useState, useEffect } from 'react';

export default function SystemSettings() {
  const { data: salonProfile, isLoading: profileLoading } = useSalonProfile();
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateSalonProfile();
  const { data: systemSettings, isLoading: settingsLoading } = useSystemSettings();
  const { mutate: updateSettings, isPending: updatingSettings } = useUpdateSystemSettings();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo: '',
    currency: 'CDF',
    timezone: 'Africa/Kinshasa',
    language: 'fr',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    smsNotifications: false,
    emailNotifications: false,
    autoReminders: false,
  });

  const [bookingSettings, setBookingSettings] = useState({
    onlineBooking: false,
    requireConfirmation: false,
  });

  // Load data when available
  useEffect(() => {
    if (salonProfile) {
      setFormData({
        name: salonProfile.name || '',
        address: salonProfile.address || '',
        phone: salonProfile.phone || '',
        email: salonProfile.email || '',
        website: salonProfile.website || '',
        description: salonProfile.description || '',
        logo: salonProfile.logo || '',
        currency: salonProfile.currency || 'CDF',
        timezone: salonProfile.timezone || 'Africa/Kinshasa',
        language: salonProfile.language || 'fr',
      });
    }

    if (systemSettings) {
      setNotificationSettings({
        smsNotifications: systemSettings.smsNotifications || false,
        emailNotifications: systemSettings.emailNotifications || false,
        autoReminders: systemSettings.autoReminders || false,
      });

      setBookingSettings({
        onlineBooking: systemSettings.onlineBooking || false,
        requireConfirmation: systemSettings.requireConfirmation || false,
      });
    }
  }, [salonProfile, systemSettings]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleNotificationsChange = (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);

    // Update system settings
    updateSettings({
      ...systemSettings,
      ...newSettings,
    });
  };

  const handleBookingChange = (key: string, value: boolean) => {
    const newSettings = { ...bookingSettings, [key]: value };
    setBookingSettings(newSettings);

    // Update system settings
    updateSettings({
      ...systemSettings,
      ...newSettings,
    });
  };

  const handleGeneralSettingChange = (key: string, value: any) => {
    updateSettings({
      ...systemSettings,
      [key]: value,
    });
  };

  if (profileLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Paramètres Système</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              updateProfile(formData);
              updateSettings({
                ...notificationSettings,
                ...bookingSettings,
              });
            }}
            disabled={updatingProfile || updatingSettings}
            className="bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full"
          >
            {updatingProfile || updatingSettings ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salon Profile Section */}
        <Card className="p-6 border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-gray-950">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Profil du Salon</h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du Salon</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du salon"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse complète du salon"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+243 810 000 000"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@beautynails.cd"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.beautynails.cd"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du salon"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDF">CDF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Fuseau Horaire</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Kinshasa">Africa/Kinshasa</SelectItem>
                    <SelectItem value="Africa/Lubumbashi">Africa/Lubumbashi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Langue</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </Card>

        {/* System Settings Section */}
        <Card className="p-6 border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-gray-950">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Paramètres Système</h3>

          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">SMS Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Envoyer des notifications SMS aux clients</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationsChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Email Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Envoyer des notifications par email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationsChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Rappels Automatiques</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Envoyer des rappels automatiques avant les rendez-vous</p>
                  </div>
                  <Switch
                    checked={notificationSettings.autoReminders}
                    onCheckedChange={(checked) => handleNotificationsChange('autoReminders', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Réservations</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Réservations en Ligne</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Autoriser les clients à réserver en ligne</p>
                  </div>
                  <Switch
                    checked={bookingSettings.onlineBooking}
                    onCheckedChange={(checked) => handleBookingChange('onlineBooking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Confirmation Requise</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exiger une confirmation manuelle des réservations</p>
                  </div>
                  <Switch
                    checked={bookingSettings.requireConfirmation}
                    onCheckedChange={(checked) => handleBookingChange('requireConfirmation', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Paramètres Avancés</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Mode Maintenance</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mettre le site en mode maintenance</p>
                  </div>
                  <Switch
                    checked={systemSettings?.maintenanceMode || false}
                    onCheckedChange={(checked) => handleGeneralSettingChange('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Historique des Rendez-vous</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Afficher les anciens rendez-vous</p>
                  </div>
                  <Switch
                    checked={systemSettings?.showPastAppointments || true}
                    onCheckedChange={(checked) => handleGeneralSettingChange('showPastAppointments', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}