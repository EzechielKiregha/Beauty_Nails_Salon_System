"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, AlertCircle, Calendar, Package, DollarSign, Users, MessageSquare, X } from 'lucide-react';

// Axios API calls (commented out for future use)
// import axios from 'axios';
// const fetchNotifications = async () => {
//   const response = await axiosdb.get('/api/notifications');
//   return response.data;
// };
// const markAsRead = async (notificationId: string) => {
//   await axiosdb.patch(`/api/notifications/${notificationId}/read`);
// };
// const dismissNotification = async (notificationId: string) => {
//   await axiosdb.delete(`/api/notifications/${notificationId}`);
// };

interface Notification {
  id: string;
  type: 'appointment' | 'stock' | 'payment' | 'system' | 'client';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      priority: 'high',
      title: 'Cliente en Attente',
      message: 'Marie Kabila vient d\'arriver pour son rendez-vous de 14:00',
      time: 'Il y a 2 minutes',
      read: false
    },
    {
      id: '2',
      type: 'stock',
      priority: 'high',
      title: 'Stock Critique',
      message: 'Colle Cils - Stock épuisé. Commander immédiatement.',
      time: 'Il y a 15 minutes',
      read: false
    },
    {
      id: '3',
      type: 'appointment',
      priority: 'medium',
      title: 'Rendez-vous Annulé',
      message: 'Sophie Makala a annulé son RDV de 15:00 aujourd\'hui',
      time: 'Il y a 30 minutes',
      read: false
    },
    {
      id: '4',
      type: 'payment',
      priority: 'high',
      title: 'Facture Impayée',
      message: 'Facture #2024-0428 non payée - Cliente: Grace Lumière (45 000 CDF)',
      time: 'Il y a 1 heure',
      read: false
    },
    {
      id: '5',
      type: 'stock',
      priority: 'medium',
      title: 'Stock Bas',
      message: 'Rajouts Cheveux Box Braids - 15 unités restantes (min: 20)',
      time: 'Il y a 2 heures',
      read: true
    },
    {
      id: '6',
      type: 'client',
      priority: 'low',
      title: 'Nouvelle Cliente',
      message: 'Nouvelle inscription: Patricia Nzuzi - Téléphone: +243 856 789 012',
      time: 'Il y a 3 heures',
      read: true
    },
    {
      id: '7',
      type: 'appointment',
      priority: 'medium',
      title: 'Rappel RDV à Envoyer',
      message: '12 clientes ont RDV demain - Rappels SMS non encore envoyés',
      time: 'Il y a 4 heures',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'stock':
        return Package;
      case 'payment':
        return DollarSign;
      case 'client':
        return Users;
      default:
        return Bell;
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-2xl p-6 max-w-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-pink-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">{unreadCount}</span>
              </div>
            )}
          </div>
          <h3 className="text-xl text-gray-900">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Tout marquer lu
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-150 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${!notification.read
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200'
                  : 'bg-gray-50'
                  }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.priority === 'high' ? 'bg-red-100' :
                    notification.priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                    <Icon className={`w-5 h-5 ${notification.priority === 'high' ? 'text-red-600' :
                      notification.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-gray-900">{notification.title}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="h-6 w-6 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{notification.time}</p>
                      <Badge className={`text-xs ${notification.priority === 'high' ? 'bg-red-500' :
                        notification.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        } text-white`}>
                        {notification.priority === 'high' ? 'Urgent' :
                          notification.priority === 'medium' ? 'Important' : 'Info'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-3">Actions Rapides</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="rounded-full">
              <MessageSquare className="w-3 h-3 mr-1" />
              Envoyer SMS
            </Button>
            <Button size="sm" variant="outline" className="rounded-full">
              <Package className="w-3 h-3 mr-1" />
              Commander
            </Button>
          </div>
        </div>
      )}

      {/* Alert Summary */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-0 p-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-gray-900">Alertes Actives</p>
        </div>
        <div className="space-y-1 text-xs text-gray-700">
          <p>• {notifications.filter(n => n.type === 'stock' && !n.read).length} alertes stock</p>
          <p>• {notifications.filter(n => n.type === 'payment' && !n.read).length} paiements en attente</p>
          <p>• {notifications.filter(n => n.type === 'appointment' && !n.read).length} notifications RDV</p>
        </div>
      </Card>
    </Card>
  );
}
