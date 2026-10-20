import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  Settings,
  Volume2,
  VolumeX,
  ExternalLink,
  Trash2,
  Check,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { AppView } from '../types';

export const NotificationModal: React.FC = () => {
  const {
    isOpenModal,
    setIsOpenModal,
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
    navigateToView,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'alerts' | 'history' | 'settings'>('alerts');
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  if (!isOpenModal) return null;

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    await requestPermission();
    setIsRequesting(false);
  };

  const handleNavigate = (view: AppView) => {
    navigateToView(view);
    setIsOpenModal(false);
  };

  const formatTimestamp = (ts: number): string => {
    const diffSeconds = Math.floor((Date.now() - ts) / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="clay-card w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-center-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="notification-center-title" className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                  Study Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spaced-repetition reviews and scheduled task reminders
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpenModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            aria-label="Close notifications modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-transparent border-b border-slate-100 dark:border-white/10 shrink-0">
          {permission === 'granted' ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Browser Notifications Active</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Desktop & mobile alerts will notify you when flashcards are due.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={sendTestNotification}
                  className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Alert</span>
                </button>
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Browser Notifications Blocked
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Notifications were denied in your browser settings. To enable, click the lock or settings icon in your browser address bar and switch Notifications to "Allow". In-app alerts will still trigger normally.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Enable System Study Alerts
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get alerted when spaced-repetition cards are due for optimal memory retention.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isRequesting ? 'Requesting...' : 'Enable Alerts'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-3 border-b border-slate-100 dark:border-white/10 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Alerts</span>
            {(dueFlashcardCount > 0 || pendingTasksCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-violet-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>History ({notifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ACTIVE STUDY ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Card 1: Due Spaced-Repetition Reviews */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1324] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Spaced-Repetition Reviews
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Leitner retention queue
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    dueFlashcardCount > 0
                      ? 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {dueFlashcardCount} Due
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dueFlashcardCount > 0
                    ? `You have ${dueFlashcardCount} card${dueFlashcardCount > 1 ? 's' : ''} due for review right now. Complete a 3-minute active recall session to advance them into higher Leitner boxes.`
                    : 'All flashcards are currently up to date! New reviews will appear when their scheduled spaced-repetition intervals expire.'}
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Box intervals: 1d · 3d · 7d · 14d · 30d
                  </span>

                  <button
                    type="button"
                    onClick={() => handleNavigate('revision')}
                    className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{dueFlashcardCount > 0 ? 'Review Due Cards Now' : 'Open Flashcard Deck'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Today's Scheduled Tasks */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1324] border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Scheduled Study Tasks
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Today's study checklist
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    pendingTasksCount > 0
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {pendingTasksCount > 0 ? `${pendingTasksCount} Pending` : 'All Done ✓'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pendingTasksCount > 0
                    ? `You have ${pendingTasksCount} study task${pendingTasksCount > 1 ? 's' : ''} scheduled for today. Complete them to maintain your daily study streak and achieve your exam targets.`
                    : 'Great job! You have no pending study tasks scheduled for today. Create new tasks in your study planner whenever needed.'}
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={triggerManualCheck}
                    className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Check for new tasks
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('planner')}
                    className="clay-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Open Study Planner</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Recent Alerts Log
                </span>

                <div className="flex items-center gap-2">
                  {notifications.some(n => !n.read) && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="p-1 text-slate-400 hover:text-red-500 rounded-lg"
                      title="Clear history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6 opacity-40" />
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No Notifications Yet
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    When flashcards become due or tasks need your attention, alerts will appear here.
                  </p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.targetView) {
                        handleNavigate(notif.targetView);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      notif.read
                        ? 'bg-slate-50/50 dark:bg-white/5 border-slate-200/60 dark:border-white/5'
                        : 'bg-white dark:bg-[#0c1324] border-violet-500/40 shadow-xs'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        notif.type === 'flashcard_due'
                          ? 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400'
                          : notif.type === 'task_reminder'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {notif.type === 'flashcard_due' ? <Layers className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className={`text-xs truncate ${notif.read ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-bold text-slate-900 dark:text-white'}`}>
                          {notif.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTimestamp(notif.timestamp)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {notif.body}
                      </p>

                      {notif.actionLabel && (
                        <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: NOTIFICATION SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1324] border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="font-display font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                  Alert Preferences
                </div>

                {/* Master Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Enable Notification System
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Master switch for study reminders
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enabled}
                    onChange={e => updatePreferences({ enabled: e.target.checked })}
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>

                {/* Flashcard Reviews */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Spaced-Repetition Review Alerts
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Notify when Leitner cards become due
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.flashcardReminders}
                    onChange={e => updatePreferences({ flashcardReminders: e.target.checked })}
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>

                {/* Task Reminders */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Scheduled Study Task Deadlines
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Notify about tasks scheduled for today
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.taskReminders}
                    onChange={e => updatePreferences({ taskReminders: e.target.checked })}
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>

                {/* Audio Sound */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Notification Sound (Chime)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.sound}
                    onChange={e => updatePreferences({ sound: e.target.checked })}
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>

                {/* Frequency */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Check Frequency
                  </label>
                  <select
                    value={preferences.frequencyMinutes}
                    onChange={e => updatePreferences({ frequencyMinutes: Number(e.target.value) })}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="30">Every 30 Minutes</option>
                    <option value="60">Every 1 Hour (Recommended)</option>
                    <option value="120">Every 2 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Browser API Status:</span>
            <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">
              {permission}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpenModal(false)}
            className="clay-btn-secondary px-4 py-1.5 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
