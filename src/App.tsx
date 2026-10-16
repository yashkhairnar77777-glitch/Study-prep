/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { LandingPage } from './components/LandingPage';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { PomodoroGlobalModal } from './components/PomodoroGlobalModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { storage } from './lib/storage';
import { api } from './lib/api';
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
} from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [conversations, setConversations] = useState<Conversation[]>(storage.getConversations());
  const [activeConvoId, setActiveConvoId] = useState<string | null>(storage.getActiveConvoId());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(storage.getFlashcards());
  const [notes, setNotes] = useState<SavedNote[]>(storage.getNotes());
  const [mockTests, setMockTests] = useState<MockTestAttempt[]>(storage.getMockTests());
  const [tasks, setTasks] = useState<StudyTask[]>(storage.getTasks());
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return profile.theme === 'dark';
  });

  const [activeExamPaper, setActiveExamPaper] = useState<ExamPaper | null>(null);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);

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

  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    storage.saveProfile(completedProfile);
    setProfile(completedProfile);
    setIsDark(completedProfile.theme === 'dark');

    // Create tailored introductory conversation
    const greetingText = `Hello ${completedProfile.name}! I am **ORYQEN STUDY AI**, your personal learning companion.

I have configured your study space for **${completedProfile.selectedClass || completedProfile.grade}**${
      completedProfile.collegeCourse ? ` (${completedProfile.collegeCourse})` : ''
    }${
      completedProfile.competitiveExamCategory ? ` (${completedProfile.competitiveExamCategory})` : ''
    } with a focus on **${completedProfile.primarySubject}**.

**Your Personalized Study Plan:**
- **Goal Mode**: ${
      completedProfile.primaryGoal === 'exam_prep'
        ? 'Exam Preparation (Focus on high-scoring answers, mock test timers, and formula recall)'
        : completedProfile.primaryGoal === 'learn_anything'
        ? 'Conceptual Understanding (Focus on first principles, step-by-step proofs, and intuitive analogies)'
        : 'Comprehensive Dual Mode (Full access to exam generators and conceptual learning tools)'
    }
- **Explanation Depth**: ${completedProfile.defaultStyle}
- **Language**: ${completedProfile.preferredLanguage}

What question, topic, or problem would you like to explore today?`;

    const newConvo: Conversation = {
      id: `convo-${Date.now()}`,
      title: `${completedProfile.primarySubject} Study Session`,
      messages: [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: greetingText,
          timestamp: Date.now(),
          providerUsed: 'groq',
          modelUsed: 'llama-3.3-70b-versatile',
        },
      ],
      grade: completedProfile.grade,
      subject: completedProfile.primarySubject,
      language: completedProfile.preferredLanguage,
      style: completedProfile.defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedConvos = [newConvo, ...conversations];
    setConversations(updatedConvos);
    setActiveConvoId(newConvo.id);
    storage.saveConversations(updatedConvos);
    storage.setActiveConvoId(newConvo.id);

    // Send student directly to personalized Dashboard
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
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
  };

  // IF NOT ONBOARDED: SHOW BEAUTIFUL ONBOARDING & AUTH FLOW
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
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenLanding={() => setCurrentView('landing')}
        />

        <main className="flex-1 overflow-hidden relative">
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
            />
          )}

          {currentView === 'mock_test' && activeExamPaper && (
            <MockTestView
              paper={activeExamPaper}
              profile={profile}
              onExitTest={() => setCurrentView('exam')}
              onSavedAttempt={attempt => {
                setMockTests(prev => [attempt, ...prev]);
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
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              profile={profile}
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
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      {/* Global Focus Timer Modal & Notification Toast */}
      <PomodoroGlobalModal profile={profile} />

      {/* Profile & Settings Modal */}
      {isOpenProfileModal && (
        <ProfileModal
          profile={profile}
          providerStatus={providerStatus}
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
    </div>
    </PomodoroProvider>
  );
}
