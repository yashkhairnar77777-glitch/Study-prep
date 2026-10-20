import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppNotification, AppView, Flashcard, NotificationPreferences, StudyTask } from '../types';
import {
  isNotificationSupported,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  getNotificationPreferences,
  saveNotificationPreferences,
  getNotificationHistory,
  markNotificationAsRead as markReadStorage,
  markAllNotificationsAsRead as markAllReadStorage,
  clearNotificationHistory as clearHistoryStorage,
  sendBrowserNotification,
  checkAndNotifyDueItems,
  playNotificationSound,
} from '../lib/notifications';
import { storage } from '../lib/storage';

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<boolean>;
  preferences: NotificationPreferences;
  updatePreferences: (partial: Partial<NotificationPreferences>) => void;
  notifications: AppNotification[];
  unreadCount: number;
  dueFlashcardCount: number;
  pendingTasksCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
  sendTestNotification: () => void;
  triggerManualCheck: () => void;
  isOpenModal: boolean;
  setIsOpenModal: (open: boolean) => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;
  navigateToView: (view: AppView) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  onNavigate: (view: AppView) => void;
  flashcards?: Flashcard[];
  tasks?: StudyTask[];
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  onNavigate,
  flashcards: propsFlashcards,
  tasks: propsTasks,
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getBrowserNotificationPermission()
  );
  const [preferences, setPreferences] = useState<NotificationPreferences>(() =>
    getNotificationPreferences()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getNotificationHistory()
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Dynamic counts
  const currentFlashcards = propsFlashcards || storage.getFlashcards();
  const currentTasks = propsTasks || storage.getTasks();
  const now = Date.now();
  const dueFlashcardCount = currentFlashcards.filter(c => c.nextReviewDate <= now).length;
  const pendingTasksCount = currentTasks.filter(
    t => !t.completed && (t.dueDate.toLowerCase().includes('today') || t.reminderEnabled)
  ).length;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request browser permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const res = await requestBrowserNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      sendBrowserNotification({
        title: 'ORYQEN Notifications Enabled! 🔔',
        body: 'You will receive reminders for scheduled study tasks and spaced-repetition flashcards.',
        type: 'system',
        targetView: 'dashboard',
        onNavigate,
      });
      return true;
    }
    return false;
  }, [onNavigate]);

  // Update preferences
  const updatePreferences = useCallback((partial: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...partial };
      saveNotificationPreferences(next);
      return next;
    });
  }, []);

  // Mark single notification read
  const markAsRead = useCallback((id: string) => {
    markReadStorage(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  // Mark all read
  const markAllAsRead = useCallback(() => {
    markAllReadStorage();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    clearHistoryStorage();
    setNotifications([]);
  }, []);

  // Dismiss toast
  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Send a test notification immediately
  const sendTestNotification = useCallback(() => {
    const isGranted = permission === 'granted';
    sendBrowserNotification({
      title: 'ORYQEN Study Reminder (Test)',
      body: isGranted
        ? 'Great! Your browser Notification API is active and ready to keep you on schedule.'
        : 'In-app reminder test successful. Enable browser alerts above for system-level notifications.',
      type: 'system',
      targetView: 'dashboard',
      actionLabel: 'Open Dashboard',
      onNavigate,
    });
  }, [permission, onNavigate]);

  // Manual check trigger
  const triggerManualCheck = useCallback(() => {
    const cards = propsFlashcards || storage.getFlashcards();
    const taskList = propsTasks || storage.getTasks();
    checkAndNotifyDueItems(cards, taskList, onNavigate);
  }, [propsFlashcards, propsTasks, onNavigate]);

  // Listen for in-app custom notification events
  useEffect(() => {
    const handleNotificationEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        setNotifications(prev => [customEvent.detail, ...prev.filter(n => n.id !== customEvent.detail.id)]);
        setActiveToast(customEvent.detail);
      }
    };

    window.addEventListener('oryqen:notification', handleNotificationEvent);
    return () => window.removeEventListener('oryqen:notification', handleNotificationEvent);
  }, []);

  // Periodic interval check (every 60 seconds)
  useEffect(() => {
    // Initial check on load
    const initialTimer = setTimeout(() => {
      triggerManualCheck();
    }, 4000);

    const interval = setInterval(() => {
      triggerManualCheck();
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [triggerManualCheck]);

  return (
    <NotificationContext.Provider
      value={{
        isSupported: isNotificationSupported(),
        permission,
        requestPermission,
        preferences,
        updatePreferences,
        notifications,
        unreadCount,
        dueFlashcardCount,
        pendingTasksCount,
        markAsRead,
        markAllAsRead,
        clearHistory,
        sendTestNotification,
        triggerManualCheck,
        isOpenModal,
        setIsOpenModal,
        activeToast,
        dismissToast,
        navigateToView: onNavigate,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
