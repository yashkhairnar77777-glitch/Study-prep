import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PomodoroMode, PomodoroSession, SubjectCategory, UserProfile } from '../types';
import { storage } from '../lib/storage';
import { playCompletionChime, playStartChime } from '../lib/sound';

interface PomodoroContextType {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  isRunning: boolean;
  activeSubject: SubjectCategory;
  activeTopic: string;
  soundEnabled: boolean;
  isOpenModal: boolean;
  todayMinutes: number;
  todaySessionsCount: number;
  recentSessions: PomodoroSession[];
  lastCompletedNotice: { title: string; minutes: number } | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: PomodoroMode, customMinutes?: number) => void;
  setCustomDuration: (minutes: number) => void;
  completeAndLogSession: () => void;
  setActiveSubject: (subject: SubjectCategory) => void;
  setActiveTopic: (topic: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setIsOpenModal: (open: boolean) => void;
  dismissNotice: () => void;
}

const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{
  children: React.ReactNode;
  profile: UserProfile;
  onActivityLogged?: () => void;
}> = ({ children, profile, onActivityLogged }) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [totalDuration, setTotalDuration] = useState<number>(DEFAULT_DURATIONS.focus);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<SubjectCategory>(
    profile.primarySubject || 'Mathematics'
  );
  const [activeTopic, setActiveTopic] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [recentSessions, setRecentSessions] = useState<PomodoroSession[]>(() =>
    storage.getFocusSessions()
  );
  const [lastCompletedNotice, setLastCompletedNotice] = useState<{
    title: string;
    minutes: number;
  } | null>(null);

  // Sync subject when profile changes
  useEffect(() => {
    if (profile.primarySubject && !activeTopic) {
      setActiveSubject(profile.primarySubject);
    }
  }, [profile.primarySubject]);

  const timerRef = useRef<number | null>(null);

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer Finished!
            clearInterval(timerRef.current!);
            handleTimerCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, totalDuration, activeSubject, activeTopic]);

  // Calculate today's stats from storage
  const todayStr = new Date().toDateString();
  const todaySessions = recentSessions.filter(
    s => new Date(s.completedAt).toDateString() === todayStr && s.mode === 'focus'
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todaySessionsCount = todaySessions.length;

  const handleTimerCompleted = () => {
    setIsRunning(false);

    if (soundEnabled) {
      playCompletionChime();
    }

    const durationMin = Math.round(totalDuration / 60);

    if (mode === 'focus') {
      const newSession: PomodoroSession = {
        id: `pomo-${Date.now()}`,
        durationMinutes: durationMin,
        mode: 'focus',
        subject: activeSubject,
        topic: activeTopic.trim() || undefined,
        completedAt: Date.now(),
        completed: true,
      };

      storage.saveFocusSession(newSession);
      const updated = storage.getFocusSessions();
      setRecentSessions(updated);
      if (onActivityLogged) onActivityLogged();

      setLastCompletedNotice({
        title: `Focus session completed! Logged ${durationMin}m in ${activeSubject}`,
        minutes: durationMin,
      });

      // Automatically suggest short break
      setMode('short_break');
      setTotalDuration(DEFAULT_DURATIONS.short_break);
      setTimeLeft(DEFAULT_DURATIONS.short_break);
    } else {
      // Break completed
      setLastCompletedNotice({
        title: `Break finished! Ready for your next study sprint?`,
        minutes: durationMin,
      });
      setMode('focus');
      setTotalDuration(DEFAULT_DURATIONS.focus);
      setTimeLeft(DEFAULT_DURATIONS.focus);
    }
  };

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalDuration);
    }
    if (soundEnabled && !isRunning) {
      playStartChime();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const switchMode = (newMode: PomodoroMode, customMinutes?: number) => {
    setIsRunning(false);
    setMode(newMode);
    const durationSec = (customMinutes ? customMinutes : DEFAULT_DURATIONS[newMode] / 60) * 60;
    setTotalDuration(durationSec);
    setTimeLeft(durationSec);
  };

  const setCustomDuration = (minutes: number) => {
    setIsRunning(false);
    const durationSec = minutes * 60;
    setTotalDuration(durationSec);
    setTimeLeft(durationSec);
  };

  const completeAndLogSession = () => {
    const elapsedSeconds = totalDuration - timeLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    setIsRunning(false);

    if (mode === 'focus' && elapsedMinutes > 0) {
      const newSession: PomodoroSession = {
        id: `pomo-${Date.now()}`,
        durationMinutes: elapsedMinutes,
        mode: 'focus',
        subject: activeSubject,
        topic: activeTopic.trim() || undefined,
        completedAt: Date.now(),
        completed: true,
      };

      storage.saveFocusSession(newSession);
      const updated = storage.getFocusSessions();
      setRecentSessions(updated);
      if (onActivityLogged) onActivityLogged();

      if (soundEnabled) {
        playCompletionChime();
      }

      setLastCompletedNotice({
        title: `Session logged! Added ${elapsedMinutes}m in ${activeSubject} to your study activity`,
        minutes: elapsedMinutes,
      });
    }

    // Reset timer
    setTimeLeft(totalDuration);
  };

  const dismissNotice = () => {
    setLastCompletedNotice(null);
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        timeLeft,
        totalDuration,
        isRunning,
        activeSubject,
        activeTopic,
        soundEnabled,
        isOpenModal,
        todayMinutes,
        todaySessionsCount,
        recentSessions,
        lastCompletedNotice,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        setCustomDuration,
        completeAndLogSession,
        setActiveSubject,
        setActiveTopic,
        setSoundEnabled,
        setIsOpenModal,
        dismissNotice,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
