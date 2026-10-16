import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { usePomodoro } from '../contexts/PomodoroContext';
import { PomodoroTimerModal } from './PomodoroTimerModal';
import { UserProfile } from '../types';

interface PomodoroGlobalModalProps {
  profile: UserProfile;
}

export const PomodoroGlobalModal: React.FC<PomodoroGlobalModalProps> = ({ profile }) => {
  const { isOpenModal, setIsOpenModal, lastCompletedNotice, dismissNotice } = usePomodoro();

  return (
    <>
      <PomodoroTimerModal
        profile={profile}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />

      {/* Completion Toast Notification */}
      {lastCompletedNotice && (
        <div
          role="status"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 max-w-sm rounded-2xl bg-slate-900/95 dark:bg-[#0f172a]/95 text-white p-4 shadow-2xl border border-violet-500/40 backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">
                {lastCompletedNotice.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Automatically logged to your study activity & streak
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissNotice}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
