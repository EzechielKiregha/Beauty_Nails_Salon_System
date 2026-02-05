"use client"

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, AlertCircle, Calendar, Package, DollarSign, Users, MessageSquare, X, Clock } from 'lucide-react';

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
  const [notifications, setNotifications] = useState<Notification[]>(
    [
      //   {
      //     id: '1',
      //     type: 'appointment',
      //     priority: 'high',
      //     title: 'Cliente en Attente',
      //     message: 'Marie Kabila vient d\'arriver pour son rendez-vous de 14:00',
      //     time: 'Il y a 2 minutes',
      //     read: false
      //   },
      //   {
      //     id: '2',
      //     type: 'stock',
      //     priority: 'high',
      //     title: 'Stock Critique',
      //     message: 'Colle Cils - Stock épuisé. Commander immédiatement.',
      //     time: 'Il y a 15 minutes',
      //     read: false
      //   },
      //   {
      //     id: '3',
      //     type: 'appointment',
      //     priority: 'medium',
      //     title: 'Rendez-vous Annulé',
      //     message: 'Sophie Makala a annulé son RDV de 15:00 aujourd\'hui',
      //     time: 'Il y a 30 minutes',
      //     read: false
      //   },
      //   {
      //     id: '4',
      //     type: 'payment',
      //     priority: 'high',
      //     title: 'Facture Impayée',
      //     message: 'Facture #2024-0428 non payée - Cliente: Grace Lumière (45 000 Fc)',
      //     time: 'Il y a 1 heure',
      //     read: false
      //   },
      //   {
      //     id: '5',
      //     type: 'stock',
      //     priority: 'medium',
      //     title: 'Stock Bas',
      //     message: 'Rajouts Cheveux Box Braids - 15 unités restantes (min: 20)',
      //     time: 'Il y a 2 heures',
      //     read: true
      //   },
      //   {
      //     id: '6',
      //     type: 'client',
      //     priority: 'low',
      //     title: 'Nouvelle Cliente',
      //     message: 'Nouvelle inscription: Patricia Nzuzi - Téléphone: +243 856 789 012',
      //     time: 'Il y a 3 heures',
      //     read: true
      //   },
      //   {
      //     id: '7',
      //     type: 'appointment',
      //     priority: 'medium',
      //     title: 'Rappel RDV à Envoyer',
      //     message: '12 clientes ont RDV demain - Rappels SMS non encore envoyés',
      //     time: 'Il y a 4 heures',
      //     read: true
      //   }
    ]
  );

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
    <Card className="bg-transparent dark:bg-transparent border-none">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-pink-500" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                <span className="text-[10px]  text-white">{unreadCount}</span>
              </div>
            )}
          </div>
          <h3 className="text-xl  text-gray-900 dark:text-gray-100">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="text-sm font-semibold text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            Tout marquer lu
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${!notification.read
                  ? 'bg-linear-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 border-pink-200 dark:border-pink-900 shadow-sm'
                  : 'bg-gray-50/50 dark:bg-gray-900/50 border-transparent hover:border-gray-200 dark:hover:border-pink-900/30'
                  }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                    notification.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                    <Icon className={`w-5 h-5 ${notification.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                      notification.priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={` truncate ${!notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-400'}`}>
                        {notification.title}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </span>
                      <Badge className={`text-[10px] uppercase  tracking-wider px-2 py-0.5 border-0 ${notification.priority === 'high' ? 'bg-red-500 text-white' :
                        notification.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
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
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-pink-900/30">
          <p className="text-xs  text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Actions Rapides</p>
          <div className="grid grid-cols-2 gap-3">
            <Button size="sm" variant="outline" className="rounded-full py-5 border-pink-100 dark:border-pink-900 dark:text-gray-300 dark:hover:bg-pink-900/20">
              <MessageSquare className="w-3.5 h-3.5 mr-2 text-pink-500" />
              SMS
            </Button>
            <Button size="sm" variant="outline" className="rounded-full py-5 border-pink-100 dark:border-pink-900 dark:text-gray-300 dark:hover:bg-pink-900/20">
              <Package className="w-3.5 h-3.5 mr-2 text-pink-500" />
              Stock
            </Button>
          </div>
        </div>
      )}

      {/* Alert Summary */}
      <Card className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/30 p-4 mt-6 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm  text-gray-900 dark:text-gray-100">Alertes Actives</p>
        </div>
        <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>Alertes Stock</span>
            <Badge variant="outline" className="h-5 bg-white dark:bg-gray-950 border-red-100 dark:border-red-900/50">
              {notifications.filter(n => n.type === 'stock' && !n.read).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Paiements en attente</span>
            <Badge variant="outline" className="h-5 bg-white dark:bg-gray-950 border-red-100 dark:border-red-900/50">
              {notifications.filter(n => n.type === 'payment' && !n.read).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications RDV</span>
            <Badge variant="outline" className="h-5 bg-white dark:bg-gray-950 border-red-100 dark:border-red-900/50">
              {notifications.filter(n => n.type === 'appointment' && !n.read).length}
            </Badge>
          </div>
        </div>
      </Card>
    </Card>
  );
}
