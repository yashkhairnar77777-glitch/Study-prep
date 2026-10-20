import { AppNotification, AppView, Flashcard, NotificationPreferences, StudyTask } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'oryqen_notification_prefs_v1',
  HISTORY: 'oryqen_notification_history_v1',
  LAST_FLASHCARD_NOTIF: 'oryqen_last_flashcard_notif_ts',
  NOTIFIED_TASK_IDS: 'oryqen_notified_task_ids_v1',
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  flashcardReminders: true,
  taskReminders: true,
  reminderTime: 'anytime',
  frequencyMinutes: 60,
  sound: true,
};

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('[Notification API] Request permission error:', err);
    return Notification.permission;
  }
}

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) return DEFAULT_NOTIFICATION_PREFERENCES;
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(data) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (err) {
    console.warn('[Notification API] Failed to save preferences:', err);
  }
}

export function getNotificationHistory(): AppNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveNotificationHistory(history: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 40)));
  } catch (err) {
    console.warn('[Notification API] Failed to save history:', err);
  }
}

export function addNotificationToHistory(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    read: false,
  };
  const history = getNotificationHistory();
  saveNotificationHistory([newNotif, ...history]);
  return newNotif;
}

export function markNotificationAsRead(id: string): void {
  const history = getNotificationHistory();
  const updated = history.map(n => (n.id === id ? { ...n, read: true } : n));
  saveNotificationHistory(updated);
}

export function markAllNotificationsAsRead(): void {
  const history = getNotificationHistory();
  const updated = history.map(n => ({ ...n, read: true }));
  saveNotificationHistory(updated);
}

export function clearNotificationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.warn('[Notification API] Failed to clear history:', err);
  }
}

export function playNotificationSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic two-tone chord for a clean, non-intrusive study chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.12); // A5
    osc2.frequency.setValueAtTime(293.66, now); // D4

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch {
    // Autoplay restrictions or audio context not permitted
  }
}

export interface ShowNotificationOptions {
  title: string;
  body: string;
  type: 'flashcard_due' | 'task_reminder' | 'study_streak' | 'system';
  targetView: AppView;
  actionLabel?: string;
  tag?: string;
  onNavigate?: (view: AppView) => void;
}

/**
 * Sends a real browser Notification via the Notification API,
 * logs it to in-app history, plays sound if permitted, and triggers
 * an in-app toast event.
 */
export function sendBrowserNotification(
  options: ShowNotificationOptions
): AppNotification {
  const prefs = getNotificationPreferences();

  if (prefs.sound) {
    playNotificationSound();
  }

  // 1. Record in history
  const savedRecord = addNotificationToHistory({
    type: options.type,
    title: options.title,
    body: options.body,
    targetView: options.targetView,
    actionLabel: options.actionLabel,
  });

  // 2. Dispatch in-app custom event for floating toast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('oryqen:notification', {
        detail: savedRecord,
      })
    );
  }

  // 3. Trigger Browser Notification API if supported and granted
  if (isNotificationSupported() && Notification.permission === 'granted' && prefs.enabled) {
    try {
      const browserNotif = new Notification(options.title, {
        body: options.body,
        tag: options.tag || `oryqen-${options.type}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });

      browserNotif.onclick = () => {
        window.focus();
        if (options.onNavigate) {
          options.onNavigate(options.targetView);
        }
        browserNotif.close();
      };
    } catch (err) {
      console.warn('[Notification API] Notification creation error:', err);
    }
  }

  return savedRecord;
}

/**
 * Checks for due spaced-repetition flashcards and scheduled study tasks,
 * sending browser notifications if intervals and preferences permit.
 */
export function checkAndNotifyDueItems(
  flashcards: Flashcard[],
  tasks: StudyTask[],
  onNavigate?: (view: AppView) => void
): { dueCardsCount: number; pendingTasksCount: number } {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return { dueCardsCount: 0, pendingTasksCount: 0 };

  const now = Date.now();

  // 1. Due Spaced-Repetition Flashcards
  const dueCards = flashcards.filter(c => c.nextReviewDate <= now);
  if (prefs.flashcardReminders && dueCards.length > 0) {
    const lastNotifTs = Number(localStorage.getItem(STORAGE_KEYS.LAST_FLASHCARD_NOTIF) || 0);
    const cooldownMs = (prefs.frequencyMinutes || 60) * 60 * 1000;

    if (now - lastNotifTs > cooldownMs) {
      const subjects = Array.from(new Set(dueCards.map(c => c.subject))).slice(0, 3);
      const subjectText = subjects.length > 0 ? ` in ${subjects.join(', ')}` : '';

      sendBrowserNotification({
        title: `Spaced Repetition: ${dueCards.length} Flashcard${dueCards.length > 1 ? 's' : ''} Due`,
        body: `Your Leitner spaced-retention review is ready${subjectText}. Review now for long-term memory!`,
        type: 'flashcard_due',
        targetView: 'revision',
        actionLabel: 'Review Flashcards',
        tag: 'oryqen-flashcards-due',
        onNavigate,
      });

      localStorage.setItem(STORAGE_KEYS.LAST_FLASHCARD_NOTIF, String(now));
    }
  }

  // 2. Scheduled Study Tasks
  const todayTasks = tasks.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('today') || t.reminderEnabled));
  if (prefs.taskReminders && todayTasks.length > 0) {
    let notifiedIds: string[] = [];
    try {
      notifiedIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFIED_TASK_IDS) || '[]');
    } catch {
      notifiedIds = [];
    }

    const unnotifiedTasks = todayTasks.filter(t => !notifiedIds.includes(t.id));

    if (unnotifiedTasks.length > 0) {
      const targetTask = unnotifiedTasks[0];
      sendBrowserNotification({
        title: `Study Task Due: ${targetTask.title}`,
        body: `Priority: ${targetTask.priority.toUpperCase()} · Subject: ${targetTask.subject}. Keep your daily study streak going!`,
        type: 'task_reminder',
        targetView: 'planner',
        actionLabel: 'Open Study Planner',
        tag: `oryqen-task-${targetTask.id}`,
        onNavigate,
      });

      const updatedNotifiedIds = [...notifiedIds, targetTask.id].slice(-30);
      localStorage.setItem(STORAGE_KEYS.NOTIFIED_TASK_IDS, JSON.stringify(updatedNotifiedIds));
    }
  }

  return {
    dueCardsCount: dueCards.length,
    pendingTasksCount: todayTasks.length,
  };
}
