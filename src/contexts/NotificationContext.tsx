import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProperties } from '../hooks/useProperties';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const { properties } = useProperties();

  // Check for lease expirations and other notifications
  useEffect(() => {
    const checkLeaseExpirations = () => {
      const today = new Date();
      properties.forEach(property => {
        // Example: Check if lease is expiring in 30 days
        const leaseEndDate = new Date(property.leaseEndDate || '');
        const daysUntilExpiration = Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration === 30) {
          addNotification({
            title: 'Lease Expiring Soon',
            message: `The lease for ${property.name} will expire in 30 days.`,
            type: 'warning'
          });
        }
      });
    };

    checkLeaseExpirations();
    // Check every day
    const interval = setInterval(checkLeaseExpirations, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
