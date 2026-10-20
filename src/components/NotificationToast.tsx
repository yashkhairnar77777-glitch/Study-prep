import React, { useEffect } from 'react';
import { Bell, X, ExternalLink, Layers, Calendar } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast, navigateToView } = useNotifications();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const handleClickAction = () => {
    if (activeToast.targetView) {
      navigateToView(activeToast.targetView);
    }
    dismissToast();
  };

  return (
    <div className="fixed top-18 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1324] border border-violet-500/40 dark:border-violet-500/30 shadow-xl shadow-violet-900/20 backdrop-blur-md flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
          {activeToast.type === 'flashcard_due' ? (
            <Layers className="w-4 h-4" />
          ) : activeToast.type === 'task_reminder' ? (
            <Calendar className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h5 className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
              {activeToast.title}
            </h5>
            <button
              type="button"
              onClick={dismissToast}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeToast.body}
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClickAction}
              className="clay-btn-primary px-3 py-1 text-[11px] font-bold flex items-center gap-1 shadow-xs"
            >
              <span>{activeToast.actionLabel || 'View Now'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={dismissToast}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
