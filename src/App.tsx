/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { PhotoSolverView } from './components/PhotoSolverView';
import { DocumentAnalysisView } from './components/DocumentAnalysisView';
import { ExamGeneratorView } from './components/ExamGeneratorView';
import { MockTestView } from './components/MockTestView';
import { SmartRevisionView } from './components/SmartRevisionView';
import { StudyGeneratorView } from './components/StudyGeneratorView';
import { DashboardView } from './components/DashboardView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { NotesView } from './components/NotesView';
import { ProgressView } from './components/ProgressView';
import { PricingView } from './components/PricingView';
import { StudentSubscriptionView } from './components/StudentSubscriptionView';
import { AdminPaymentDashboard } from './components/AdminPaymentDashboard';
import { SmartStudyTimerView } from './components/SmartStudyTimerView';
import { NcertLearningHubView } from './components/NcertLearningHubView';
import { LandingPage } from './components/LandingPage';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { PersonalizedIntro } from './components/PersonalizedIntro';
import { GoalSwitcherModal } from './components/GoalSwitcherModal';
import { SyllabusTrackerView } from './components/SyllabusTrackerView';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { PomodoroGlobalModal } from './components/PomodoroGlobalModal';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationModal } from './components/NotificationModal';
import { NotificationToast } from './components/NotificationToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NcertQuickGeneratorModal, QuickGeneratorMode } from './components/NcertQuickGeneratorModal';
import { storage } from './lib/storage';
import { api } from './lib/api';
import {
  buildGoalConfigFromProfile,
  createGoalWelcomeConversation,
  saveGoalIntoRegistry,
  switchGoalWithPreservation,
} from './lib/goalManager';
import {
  subscribeToAuth,
  loadFromFirestore,
  syncToFirestore,
  signOutUser,
} from './lib/firebaseAuth';
import {
  Conversation,
  Flashcard,
  SavedNote,
  MockTestAttempt,
  UserProfile,
  ExamPaper,
  ProviderStatus,
  SubjectCategory,
  StudyTask,
  AppView,
  SubscriptionTier,
  TopicStatus,
  GoalSnapshot,
  GoalConfig,
} from './types';
import { subscriptionService } from './lib/subscriptionService';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [conversations, setConversations] = useState<Conversation[]>(storage.getConversations());
  const [activeConvoId, setActiveConvoId] = useState<string | null>(storage.getActiveConvoId());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(storage.getFlashcards());
  const [notes, setNotes] = useState<SavedNote[]>(storage.getNotes());
  const [mockTests, setMockTests] = useState<MockTestAttempt[]>(storage.getMockTests());
  const [tasks, setTasks] = useState<StudyTask[]>(storage.getTasks());
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicStatus>>(
    storage.getTopicProgress()
  );
  const [savedGoals, setSavedGoals] = useState<Record<string, GoalSnapshot>>(() => {
    const existing = storage.getSavedGoals();
    const initialProfile = storage.getProfile();
    if (initialProfile.isOnboarded) {
      const cfg = buildGoalConfigFromProfile(initialProfile);
      if (!existing[cfg.id]) {
        const seeded = saveGoalIntoRegistry(existing, initialProfile, {
          topicProgress: storage.getTopicProgress(),
          notes: storage.getNotes(),
          flashcards: storage.getFlashcards(),
          mockTests: storage.getMockTests(),
          tasks: storage.getTasks(),
          conversations: storage.getConversations(),
        });
        storage.saveSavedGoals(seeded);
        return seeded;
      }
    }
    return existing;
  });
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const shouldReduceMotion = useReducedMotion();
  const [isDark, setIsDark] = useState<boolean>(() => {
    return profile.theme === 'dark';
  });

  const [activeExamPaper, setActiveExamPaper] = useState<ExamPaper | null>(null);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [isOpenGoalSwitcher, setIsOpenGoalSwitcher] = useState(false);
  const [introGoalConfig, setIntroGoalConfig] = useState<GoalConfig | null>(null);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [isOpenNcertModal, setIsOpenNcertModal] = useState<boolean>(false);
  const [ncertModalMode, setNcertModalMode] = useState<QuickGeneratorMode>('flashcards');

  const activeGoalConfig = React.useMemo(
    () => buildGoalConfigFromProfile(profile),
    [profile]
  );

  const handleOpenNcertGenerator = (mode: QuickGeneratorMode = 'flashcards') => {
    setNcertModalMode(mode);
    setIsOpenNcertModal(true);
  };

  // Sync theme with document class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load initial status
  useEffect(() => {
    api.getProviderStatus().then(status => {
      if (status) setProviderStatus(status);
    });
  }, []);

  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const updatedProfile: UserProfile = { ...profile, theme: next ? 'dark' : 'light' };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
  };

  const handleOnboardingComplete = (completedProfile: UserProfile, goalCfg?: GoalConfig) => {
    const resolvedConfig = goalCfg || buildGoalConfigFromProfile(completedProfile);
    const welcomeConvo = createGoalWelcomeConversation(completedProfile, resolvedConfig);
    const updatedConvos = [welcomeConvo, ...conversations];

    storage.saveProfile(completedProfile);
    setProfile(completedProfile);
    setIsDark(completedProfile.theme === 'dark');

    setConversations(updatedConvos);
    setActiveConvoId(welcomeConvo.id);
    storage.saveConversations(updatedConvos);
    storage.setActiveConvoId(welcomeConvo.id);

    const updatedRegistry = saveGoalIntoRegistry(savedGoals, completedProfile, {
      topicProgress,
      notes,
      flashcards,
      mockTests,
      tasks,
      conversations: updatedConvos,
    });
    setSavedGoals(updatedRegistry);
    storage.saveSavedGoals(updatedRegistry);

    setCurrentView('dashboard');
    setIntroGoalConfig(resolvedConfig);
  };

  const handleConfirmSwitchGoal = (targetConfig: GoalConfig) => {
    const { updatedSavedGoals, nextProfile, nextData } = switchGoalWithPreservation(
      savedGoals,
      profile,
      {
        topicProgress,
        notes,
        flashcards,
        mockTests,
        tasks,
        conversations,
      },
      targetConfig
    );

    setSavedGoals(updatedSavedGoals);
    storage.saveSavedGoals(updatedSavedGoals);

    setProfile(nextProfile);
    storage.saveProfile(nextProfile);

    setTopicProgress(nextData.topicProgress);
    storage.saveTopicProgress(nextData.topicProgress);

    setNotes(nextData.notes);
    storage.saveNotes(nextData.notes);

    setFlashcards(nextData.flashcards);
    storage.saveFlashcards(nextData.flashcards);

    setMockTests(nextData.mockTests);
    storage.saveMockTests(nextData.mockTests);

    setTasks(nextData.tasks);
    storage.saveTasks(nextData.tasks);

    setConversations(nextData.conversations);
    storage.saveConversations(nextData.conversations);

    const nextConvoId = nextData.conversations[0]?.id || null;
    setActiveConvoId(nextConvoId);
    storage.setActiveConvoId(nextConvoId);

    setIsOpenGoalSwitcher(false);
    setCurrentView('dashboard');
    setIntroGoalConfig(targetConfig);
  };

  const handleUpdateTopicStatus = (topicId: string, status: TopicStatus) => {
    setTopicProgress(prev => {
      const next = { ...prev, [topicId]: status };
      storage.saveTopicProgress(next);
      setSavedGoals(prevGoals => {
        const updatedGoals = saveGoalIntoRegistry(prevGoals, profile, {
          topicProgress: next,
          notes,
          flashcards,
          mockTests,
          tasks,
          conversations,
        });
        storage.saveSavedGoals(updatedGoals);
        return updatedGoals;
      });
      return next;
    });
  };

  const handleLaunchTutorPrompt = (prompt: string, subject?: SubjectCategory) => {
    const newConvo: Conversation = {
      id: `convo-${Date.now()}`,
      title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
      messages: [],
      grade: profile.grade,
      subject: subject || activeGoalConfig.primarySubject || profile.primarySubject,
      language: activeGoalConfig.medium || profile.preferredLanguage,
      style: profile.defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedConvos = [newConvo, ...conversations];
    setConversations(updatedConvos);
    setActiveConvoId(newConvo.id);
    storage.saveConversations(updatedConvos);
    storage.setActiveConvoId(newConvo.id);
    setPendingChatPrompt(prompt);
    setCurrentView('chat');
  };

  // Listen to Firebase Auth state changes and load cloud data
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async authUser => {
      if (authUser) {
        try {
          const cloudData = await loadFromFirestore(authUser.uid);
          setProfile(prev => {
            const updated: UserProfile = {
              ...prev,
              userId: authUser.uid,
              name: authUser.displayName || prev.name || 'Scholar',
              email: authUser.email || prev.email,
              avatarUrl: authUser.photoURL || prev.avatarUrl,
              authProvider: authUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'local',
              isOnboarded: true,
              ...(cloudData?.profile || {}),
            };
            storage.saveProfile(updated);
            return updated;
          });

          if (cloudData) {
            if (Array.isArray(cloudData.notes) && cloudData.notes.length > 0) {
              setNotes(cloudData.notes);
              storage.saveNotes(cloudData.notes);
            }
            if (Array.isArray(cloudData.flashcards) && cloudData.flashcards.length > 0) {
              setFlashcards(cloudData.flashcards);
              storage.saveFlashcards(cloudData.flashcards);
            }
            if (Array.isArray(cloudData.mockTests) && cloudData.mockTests.length > 0) {
              storage.saveMockTests(cloudData.mockTests);
              setMockTests(storage.getMockTests());
            }
            if (Array.isArray(cloudData.tasks) && cloudData.tasks.length > 0) {
              setTasks(cloudData.tasks);
              storage.saveTasks(cloudData.tasks);
            }
            if (Array.isArray(cloudData.conversations) && cloudData.conversations.length > 0) {
              setConversations(cloudData.conversations);
              storage.saveConversations(cloudData.conversations);
            }
            if (cloudData.topicProgress && typeof cloudData.topicProgress === 'object') {
              setTopicProgress(cloudData.topicProgress);
              storage.saveTopicProgress(cloudData.topicProgress);
            }
            if (cloudData.goalSnapshots && typeof cloudData.goalSnapshots === 'object') {
              setSavedGoals(cloudData.goalSnapshots);
              storage.saveSavedGoals(cloudData.goalSnapshots);
            }
          }
        } catch (err) {
          console.warn('[Firestore] Error loading cloud data on auth state change:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-sync real study data to Google Firestore for authenticated user
  useEffect(() => {
    if (!profile.userId) return;
    const timer = setTimeout(() => {
      syncToFirestore(profile.userId!, {
        profile,
        notes,
        flashcards,
        mockTests,
        tasks,
        conversations,
        topicProgress,
        goalSnapshots: savedGoals,
      }).catch(err => console.warn('[Firestore] Auto-sync warning:', err));
    }, 1200);

    return () => clearTimeout(timer);
  }, [profile, notes, flashcards, mockTests, tasks, conversations, topicProgress, savedGoals]);

  // Real-time synchronization of subscription tier from coupons and admin approvals
  useEffect(() => {
    const handleSubUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ plan?: SubscriptionTier }>;
      if (custom.detail?.plan) {
        setProfile(prev => {
          const updated: UserProfile = { ...prev, subscriptionTier: custom.detail.plan };
          storage.saveProfile(updated);
          return updated;
        });
      } else {
        setProfile(storage.getProfile());
      }
    };
    window.addEventListener('oryqen:subscription_updated', handleSubUpdate);
    return () => window.removeEventListener('oryqen:subscription_updated', handleSubUpdate);
  }, []);

  // Sync subscription tier with server on mount or when email changes (with exponential backoff retry)
  useEffect(() => {
    let isCancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const email = profile.email || 'student@oryqen.ai';

    const MAX_RETRIES = 4;
    const BASE_DELAY_MS = 1000;

    const syncSubscriptionStatus = async (attempt: number): Promise<void> => {
      if (isCancelled) return;

      try {
        const res = await subscriptionService.getStatus(email);
        if (isCancelled || !res?.subscription) return;

        const serverPlan: SubscriptionTier =
          res.subscription.status === 'active' && res.subscription.plan
            ? res.subscription.plan
            : 'free';

        setProfile(prev => {
          if (prev.subscriptionTier === serverPlan) {
            return prev;
          }
          const updated: UserProfile = { ...prev, subscriptionTier: serverPlan };
          storage.saveProfile(updated);
          return updated;
        });
      } catch (err) {
        if (isCancelled) return;

        if (attempt < MAX_RETRIES) {
          const jitterMs = Math.floor(Math.random() * 300);
          const delayMs = BASE_DELAY_MS * Math.pow(2, attempt) + jitterMs;
          retryTimer = setTimeout(() => {
            void syncSubscriptionStatus(attempt + 1);
          }, delayMs);
        } else {
          console.warn(
            `[Subscription Sync] Failed to synchronize subscription status after ${MAX_RETRIES + 1} attempts:`,
            err
          );
        }
      }
    };

    void syncSubscriptionStatus(0);

    return () => {
      isCancelled = true;
      if (retryTimer !== null) {
        clearTimeout(retryTimer);
      }
    };
  }, [profile.email]);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    storage.logoutUser();
    setProfile(storage.getProfile());
    setIsOpenProfileModal(false);
  };

  // Active conversation getter
  const activeConversation =
    conversations.find(c => c.id === activeConvoId) ||
    conversations[0] || {
      id: 'default',
      title: 'New Study Session',
      messages: [],
      grade: profile.grade,
      subject: profile.primarySubject,
      language: profile.preferredLanguage,
      style: profile.defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

  const handleNewConversation = () => {
    const newConvo: Conversation = {
      id: `convo-${Date.now()}`,
      title: `Study Session #${conversations.length + 1}`,
      messages: [],
      grade: profile.grade,
      subject: profile.primarySubject,
      language: profile.preferredLanguage,
      style: profile.defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    setActiveConvoId(newConvo.id);
    storage.saveConversations(updated);
    storage.setActiveConvoId(newConvo.id);
    setCurrentView('chat');
  };

  const handleUpdateConversation = (updatedConvo: Conversation) => {
    const updated = conversations.map(c => (c.id === updatedConvo.id ? updatedConvo : c));
    setConversations(updated);
    storage.saveConversations(updated);
  };

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    storage.saveConversations(updated);
    if (activeConvoId === id) {
      const nextId = updated[0]?.id || null;
      setActiveConvoId(nextId);
      storage.setActiveConvoId(nextId);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    const updated = conversations.map(c => (c.id === id ? { ...c, title: newTitle } : c));
    setConversations(updated);
    storage.saveConversations(updated);
  };

  const handleSaveAsNote = (title: string, content: string, subject: SubjectCategory) => {
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: title || `${subject} Note (${new Date().toLocaleDateString()})`,
      content,
      subject,
      createdAt: Date.now(),
      tags: [subject],
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    storage.saveNotes(updated);
  };

  const handleCreateFlashcard = (front: string, back: string, subject: SubjectCategory) => {
    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      front,
      back,
      subject,
      topic: `${subject} Key Point`,
      box: 1,
      nextReviewDate: Date.now(),
      reviewCount: 0,
      easeScore: 'unreviewed',
    };
    const updated = [newCard, ...flashcards];
    setFlashcards(updated);
    storage.saveFlashcards(updated);
  };

  const handleUpdateTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    handleUpdateTasks(updated);
  };

  const handleUpdateNotes = (newNotes: SavedNote[]) => {
    setNotes(newNotes);
    storage.saveNotes(newNotes);
  };

  const handleStartMockTest = (paper: ExamPaper) => {
    setActiveExamPaper(paper);
    setCurrentView('mock_test');
  };

  const handleReloadAllData = () => {
    setProfile(storage.getProfile());
    setConversations(storage.getConversations());
    setActiveConvoId(storage.getActiveConvoId());
    setFlashcards(storage.getFlashcards());
    setNotes(storage.getNotes());
    setMockTests(storage.getMockTests());
    setTasks(storage.getTasks());
    setTopicProgress(storage.getTopicProgress());
    setSavedGoals(storage.getSavedGoals());
  };

  // IF NOT ONBOARDED: SHOW PATH-FIRST ONBOARDING & AUTH FLOW
  if (!profile.isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // PUBLIC LANDING PAGE VIEW
  if (currentView === 'landing') {
    return (
      <LandingPage
        onStartLearning={() => setCurrentView('dashboard')}
        onLogin={() => setCurrentView('dashboard')}
        onExploreFeature={feature => setCurrentView(feature)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <PomodoroProvider profile={profile} onActivityLogged={handleReloadAllData}>
      <NotificationProvider onNavigate={setCurrentView} flashcards={flashcards} tasks={tasks}>
        <div
          className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
          }`}
        >
      {/* Sidebar (Desktop Collapsible & Mobile Slide-out) */}
      <Sidebar
        conversations={conversations}
        activeConvoId={activeConvoId}
        onSelectConversation={id => {
          setActiveConvoId(id);
          storage.setActiveConvoId(id);
        }}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        currentView={currentView}
        setCurrentView={setCurrentView}
        profile={profile}
        goalConfig={activeGoalConfig}
        savedGoalsCount={Object.keys(savedGoals).length}
        onOpenGoalSwitcher={() => setIsOpenGoalSwitcher(true)}
        isOpenMobile={isOpenMobileMenu}
        onCloseMobile={() => setIsOpenMobileMenu(false)}
        onOpenProfile={() => setIsOpenProfileModal(true)}
        onExportData={() => {
          const dataStr = storage.exportAllData();
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `oryqen-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenLanding={() => setCurrentView('landing')}
      />

      {/* Main Study Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenMobileMenu={() => setIsOpenMobileMenu(true)}
          onOpenProfile={() => setIsOpenProfileModal(true)}
          profile={profile}
          goalConfig={activeGoalConfig}
          onOpenGoalSwitcher={() => setIsOpenGoalSwitcher(true)}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenLanding={() => setCurrentView('landing')}
        />

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentView === 'mock_test' ? `mock_test_${activeExamPaper?.title || 'active'}` : currentView}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.995 }}
              transition={{
                duration: shouldReduceMotion ? 0.05 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full w-full overflow-hidden flex flex-col"
            >
              {currentView === 'generator' && (
                <StudyGeneratorView
                  profile={profile}
                  onStartMockTest={handleStartMockTest}
                  onSaveAsNote={handleSaveAsNote}
                  onCreateFlashcard={handleCreateFlashcard}
                  onUpdateFlashcards={cards => {
                    setFlashcards(cards);
                    storage.saveFlashcards(cards);
                  }}
                  onUpdateNotes={handleUpdateNotes}
                />
              )}

              {currentView === 'chat' && (
                <ChatView
                  conversation={activeConversation}
                  onUpdateConversation={handleUpdateConversation}
                  profile={profile}
                  providerStatus={providerStatus}
                  onSaveAsNote={handleSaveAsNote}
                  onCreateFlashcard={handleCreateFlashcard}
                  onOpenNcertGenerator={() => handleOpenNcertGenerator('both')}
                  pendingPrompt={pendingChatPrompt}
                  onConsumePendingPrompt={() => setPendingChatPrompt(null)}
                />
              )}

              {currentView === 'photo' && (
                <PhotoSolverView
                  profile={profile}
                  providerStatus={providerStatus}
                  onSaveAsNote={handleSaveAsNote}
                  onCreateFlashcard={handleCreateFlashcard}
                />
              )}

              {currentView === 'doc' && <DocumentAnalysisView profile={profile} />}

              {currentView === 'exam' && (
                <ExamGeneratorView
                  profile={profile}
                  onStartMockTest={handleStartMockTest}
                  onNavigateToStudyGenerator={() => setCurrentView('generator')}
                  onNavigateToPricing={() => setCurrentView('pricing')}
                />
              )}

              {currentView === 'mock_test' && activeExamPaper && (
                <MockTestView
                  paper={activeExamPaper}
                  profile={profile}
                  onExitTest={() => setCurrentView('exam')}
                  onSavedAttempt={attempt => {
                    setMockTests(prev => [attempt, ...prev.filter(t => t.id !== attempt.id)]);
                    storage.saveMockTest(attempt);
                  }}
                />
              )}

              {currentView === 'revision' && (
                <SmartRevisionView
                  profile={profile}
                  flashcards={flashcards}
                  notes={notes}
                  onUpdateFlashcards={cards => {
                    setFlashcards(cards);
                    storage.saveFlashcards(cards);
                  }}
                  onUpdateNotes={handleUpdateNotes}
                  onOpenNcertGenerator={() => handleOpenNcertGenerator('flashcards')}
                />
              )}

              {currentView === 'dashboard' && (
                <DashboardView
                  profile={profile}
                  goalConfig={activeGoalConfig}
                  topicProgress={topicProgress}
                  conversations={conversations}
                  flashcards={flashcards}
                  notes={notes}
                  mockTests={mockTests}
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  providerStatus={providerStatus}
                  onNavigate={setCurrentView}
                  onSelectConversation={id => {
                    setActiveConvoId(id);
                    storage.setActiveConvoId(id);
                  }}
                  onOpenGoalSwitcher={() => setIsOpenGoalSwitcher(true)}
                  onLaunchTutorPrompt={handleLaunchTutorPrompt}
                  onOpenNcertGenerator={handleOpenNcertGenerator}
                  onUpdateNotes={handleUpdateNotes}
                />
              )}

              {currentView === 'syllabus' && (
                <SyllabusTrackerView
                  goalConfig={activeGoalConfig}
                  topicProgress={topicProgress}
                  onUpdateTopicStatus={handleUpdateTopicStatus}
                  notes={notes}
                  flashcards={flashcards}
                  mockTests={mockTests}
                  onStudyTopicWithAi={(prompt, subjectName) =>
                    handleLaunchTutorPrompt(prompt, subjectName as SubjectCategory)
                  }
                  onNavigate={setCurrentView}
                  onOpenGoalSwitcher={() => setIsOpenGoalSwitcher(true)}
                />
              )}

              {currentView === 'planner' && (
                <StudyPlannerView
                  tasks={tasks}
                  onUpdateTasks={handleUpdateTasks}
                  profile={profile}
                />
              )}

              {currentView === 'notes' && (
                <NotesView
                  notes={notes}
                  onUpdateNotes={handleUpdateNotes}
                  profile={profile}
                  onOpenNcertGenerator={() => handleOpenNcertGenerator('notes')}
                  onNavigateToPricing={() => setCurrentView('pricing')}
                />
              )}

              {currentView === 'progress' && (
                <ProgressView
                  profile={profile}
                  mockTests={mockTests}
                  flashcards={flashcards}
                  conversations={conversations}
                  tasks={tasks}
                />
              )}

              {currentView === 'pricing' && (
                <PricingView
                  userProfile={profile}
                  onBackToDashboard={() => setCurrentView('dashboard')}
                  onNavigateToMySubscription={() => setCurrentView('my_subscription')}
                  onProfileUpdated={updated => setProfile(updated)}
                />
              )}

              {currentView === 'my_subscription' && (
                <StudentSubscriptionView
                  userProfile={profile}
                  onNavigateToPricing={() => setCurrentView('pricing')}
                />
              )}

              {currentView === 'admin_payments' && (
                <AdminPaymentDashboard
                  adminEmail={profile.email || 'yashkhairnar77777@gmail.com'}
                  onBackToDashboard={() => setCurrentView('dashboard')}
                />
              )}

              {currentView === 'timer' && (
                <SmartStudyTimerView
                  profile={profile}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'ncert_hub' && (
                <NcertLearningHubView
                  profile={profile}
                  providerStatus={providerStatus}
                  onNavigate={setCurrentView}
                  onSaveAsNote={handleSaveAsNote}
                  onCreateFlashcard={handleCreateFlashcard}
                  onStartMockTest={handleStartMockTest}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          goalConfig={activeGoalConfig}
        />
      </div>

      {/* Global Focus Timer Modal */}
      <PomodoroGlobalModal profile={profile} onNavigate={setCurrentView} />

      {/* 1-Click NCERT Chapter Flashcard & Notes Generator Modal */}
      <NcertQuickGeneratorModal
        isOpen={isOpenNcertModal}
        onClose={() => setIsOpenNcertModal(false)}
        initialMode={ncertModalMode}
        profile={profile}
        onAddFlashcards={cards => {
          setFlashcards(cards);
          storage.saveFlashcards(cards);
        }}
        onAddNote={note => {
          const updated = [note, ...notes];
          setNotes(updated);
          storage.saveNotes(updated);
        }}
        onNavigateToRevision={() => setCurrentView('revision')}
        onNavigateToNotes={() => setCurrentView('notes')}
      />

      {/* Study Notification Modal & Floating Toast */}
      <NotificationModal />
      <NotificationToast />

      {/* Profile & Settings Modal */}
      {isOpenProfileModal && (
        <ProfileModal
          profile={profile}
          providerStatus={providerStatus}
          goalConfig={activeGoalConfig}
          onOpenGoalSwitcher={() => setIsOpenGoalSwitcher(true)}
          onSaveProfile={p => {
            setProfile(p);
            storage.saveProfile(p);
            setIsDark(p.theme === 'dark');
          }}
          onClose={() => setIsOpenProfileModal(false)}
          onDataImported={handleReloadAllData}
          onLogout={handleLogout}
        />
      )}

      {/* Goal Switcher Modal (One active goal at a time + preserved progress) */}
      <GoalSwitcherModal
        isOpen={isOpenGoalSwitcher}
        onClose={() => setIsOpenGoalSwitcher(false)}
        profile={profile}
        activeGoalConfig={activeGoalConfig}
        savedGoals={savedGoals}
        onConfirmSwitchGoal={handleConfirmSwitchGoal}
      />

      {/* Personalized Cinematic Intro Overlay */}
      {introGoalConfig && (
        <PersonalizedIntro
          goalConfig={introGoalConfig}
          studentName={profile.name}
          onComplete={() => setIntroGoalConfig(null)}
        />
      )}
    </div>
    </NotificationProvider>
    </PomodoroProvider>
  );
}
