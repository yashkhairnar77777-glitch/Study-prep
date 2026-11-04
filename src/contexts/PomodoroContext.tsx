import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  PomodoroMode,
  PomodoroSession,
  SubjectCategory,
  UserProfile,
  AiStudySchedule,
  AiScheduleInterval,
  AmbientSoundType,
} from '../types';
import { storage } from '../lib/storage';
import {
  playCompletionChime,
  playStartChime,
  playIntervalTransitionChime,
  startAmbientSound,
  stopAmbientSound,
  setAmbientSoundVolume,
} from '../lib/sound';

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
  // Smart AI Study Schedule Extensions
  activeSchedule: AiStudySchedule | null;
  currentIntervalIndex: number;
  currentInterval: AiScheduleInterval | null;
  autoAdvanceIntervals: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number;
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
  // AI Schedule actions
  loadSchedule: (schedule: AiStudySchedule) => void;
  advanceToNextInterval: () => void;
  jumpToInterval: (index: number) => void;
  clearSchedule: () => void;
  setAutoAdvanceIntervals: (auto: boolean) => void;
  setAmbientSound: (sound: AmbientSoundType) => void;
  setAmbientVolume: (vol: number) => void;
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

  // AI Study Schedule State
  const [activeSchedule, setActiveSchedule] = useState<AiStudySchedule | null>(null);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [autoAdvanceIntervals, setAutoAdvanceIntervals] = useState<boolean>(true);
  const [ambientSound, setAmbientSoundState] = useState<AmbientSoundType>('none');
  const [ambientVolume, setAmbientVolumeState] = useState<number>(0.5);

  const currentInterval =
    activeSchedule && activeSchedule.intervals[currentIntervalIndex]
      ? activeSchedule.intervals[currentIntervalIndex]
      : null;

  // Sync subject when profile changes
  useEffect(() => {
    if (profile.primarySubject && !activeTopic && !activeSchedule) {
      setActiveSubject(profile.primarySubject);
    }
  }, [profile.primarySubject]);

  // Ambient sound lifecycle
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientSound(ambientSound, ambientVolume);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isRunning, ambientSound]);

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
  }, [isRunning, mode, totalDuration, activeSubject, activeTopic, activeSchedule, currentIntervalIndex, autoAdvanceIntervals]);

  // Calculate today's stats from storage
  const todayStr = new Date().toDateString();
  const todaySessions = recentSessions.filter(
    s => new Date(s.completedAt).toDateString() === todayStr && s.mode === 'focus'
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todaySessionsCount = todaySessions.length;

  const handleTimerCompleted = () => {
    setIsRunning(false);

    // If running an AI Schedule:
    if (activeSchedule) {
      const currentInv = activeSchedule.intervals[currentIntervalIndex];
      const durationMin = currentInv ? currentInv.durationMinutes : Math.round(totalDuration / 60);

      // Mark current interval completed
      const updatedIntervals = [...activeSchedule.intervals];
      if (updatedIntervals[currentIntervalIndex]) {
        updatedIntervals[currentIntervalIndex] = {
          ...updatedIntervals[currentIntervalIndex],
          completed: true,
        };
        setActiveSchedule({
          ...activeSchedule,
          intervals: updatedIntervals,
        });
      }

      // Log focus time
      if (mode === 'focus') {
        const newSession: PomodoroSession = {
          id: `pomo-${Date.now()}`,
          durationMinutes: durationMin,
          mode: 'focus',
          subject: activeSubject,
          topic: (currentInv?.title || activeTopic || '').trim() || undefined,
          completedAt: Date.now(),
          completed: true,
          scheduleId: activeSchedule.id,
          intervalTitle: currentInv?.title,
        };

        storage.saveFocusSession(newSession);
        setRecentSessions(storage.getFocusSessions());
        if (onActivityLogged) onActivityLogged();
      }

      const nextIdx = currentIntervalIndex + 1;
      const hasNext = nextIdx < activeSchedule.intervals.length;

      if (hasNext) {
        const nextInv = activeSchedule.intervals[nextIdx];
        setCurrentIntervalIndex(nextIdx);
        const nextMode: PomodoroMode =
          nextInv.type === 'focus' ? 'focus' : nextInv.type === 'long_break' ? 'long_break' : 'short_break';
        setMode(nextMode);
        const nextSec = nextInv.durationMinutes * 60;
        setTotalDuration(nextSec);
        setTimeLeft(nextSec);

        if (soundEnabled) {
          playIntervalTransitionChime();
        }

        setLastCompletedNotice({
          title:
            mode === 'focus'
              ? `Sprint completed! ${nextInv.durationMinutes}m restorative break starting.`
              : `Break finished! Ready for ${nextInv.title} (${nextInv.durationMinutes}m).`,
          minutes: durationMin,
        });

        if (autoAdvanceIntervals) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else {
        // Entire schedule completed!
        setIsRunning(false);
        if (soundEnabled) {
          playCompletionChime();
        }
        setLastCompletedNotice({
          title: `AI Study Schedule Complete! Logged ${activeSchedule.totalDurationMinutes}m in ${activeSubject}`,
          minutes: activeSchedule.totalDurationMinutes,
        });
      }
      return;
    }

    // Standard Standalone Pomodoro
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
        title: `Focus sprint completed! Logged ${durationMin}m in ${activeSubject}`,
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
        topic: (currentInterval?.title || activeTopic).trim() || undefined,
        completedAt: Date.now(),
        completed: true,
        scheduleId: activeSchedule?.id,
        intervalTitle: currentInterval?.title,
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

    // Reset timer to totalDuration
    setTimeLeft(totalDuration);
  };

  const dismissNotice = () => {
    setLastCompletedNotice(null);
  };

  // AI Schedule operations
  const loadSchedule = (schedule: AiStudySchedule) => {
    setActiveSchedule(schedule);
    setCurrentIntervalIndex(0);
    setActiveSubject(schedule.subject);
    setActiveTopic(schedule.topic);

    const first = schedule.intervals[0];
    if (first) {
      const modeToSet: PomodoroMode =
        first.type === 'focus' ? 'focus' : first.type === 'long_break' ? 'long_break' : 'short_break';
      setMode(modeToSet);
      const sec = first.durationMinutes * 60;
      setTotalDuration(sec);
      setTimeLeft(sec);
    }
    setIsRunning(false);
  };

  const jumpToInterval = (index: number) => {
    if (!activeSchedule || !activeSchedule.intervals[index]) return;
    setCurrentIntervalIndex(index);
    const target = activeSchedule.intervals[index];
    const modeToSet: PomodoroMode =
      target.type === 'focus' ? 'focus' : target.type === 'long_break' ? 'long_break' : 'short_break';
    setMode(modeToSet);
    const sec = target.durationMinutes * 60;
    setTotalDuration(sec);
    setTimeLeft(sec);
    setIsRunning(false);
  };

  const advanceToNextInterval = () => {
    if (!activeSchedule) return;
    const nextIdx = currentIntervalIndex + 1;
    if (nextIdx < activeSchedule.intervals.length) {
      jumpToInterval(nextIdx);
    } else {
      setLastCompletedNotice({
        title: `Schedule "${activeSchedule.title}" Complete! Excellent work!`,
        minutes: activeSchedule.totalDurationMinutes,
      });
      clearSchedule();
    }
  };

  const clearSchedule = () => {
    setActiveSchedule(null);
    setCurrentIntervalIndex(0);
    setMode('focus');
    setTotalDuration(DEFAULT_DURATIONS.focus);
    setTimeLeft(DEFAULT_DURATIONS.focus);
    setIsRunning(false);
  };

  const setAmbientSound = (sound: AmbientSoundType) => {
    setAmbientSoundState(sound);
    if (isRunning && sound !== 'none') {
      startAmbientSound(sound, ambientVolume);
    } else if (sound === 'none') {
      stopAmbientSound();
    }
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVolumeState(vol);
    setAmbientSoundVolume(vol);
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
        activeSchedule,
        currentIntervalIndex,
        currentInterval,
        autoAdvanceIntervals,
        ambientSound,
        ambientVolume,
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
        loadSchedule,
        advanceToNextInterval,
        jumpToInterval,
        clearSchedule,
        setAutoAdvanceIntervals,
        setAmbientSound,
        setAmbientVolume,
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
