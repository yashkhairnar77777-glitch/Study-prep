import React, { useState, useEffect } from 'react';
import {
  Layers,
  RotateCw,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Bookmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Keyboard,
} from 'lucide-react';
import { Flashcard, SavedNote, SubjectCategory, UserProfile } from '../types';
import { storage } from '../lib/storage';
import { MarkdownRenderer } from './MarkdownRenderer';

interface SmartRevisionViewProps {
  profile: UserProfile;
  flashcards: Flashcard[];
  notes: SavedNote[];
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  onUpdateNotes: (notes: SavedNote[]) => void;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  profile,
  flashcards,
  notes,
  onUpdateFlashcards,
  onUpdateNotes,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newTopic, setNewTopic] = useState('Key Formulas & Concepts');
  const [newSubject, setNewSubject] = useState<SubjectCategory>(profile.primarySubject);

  // Filter cards by subject
  const filteredCards = flashcards.filter(c => {
    if (selectedSubject === 'all') return true;
    return c.subject === selectedSubject;
  });

  // Due cards calculation (Leitner system)
  const now = Date.now();
  const dueCards = filteredCards.filter(c => c.nextReviewDate <= now);
  const activeDeck = dueCards.length > 0 ? dueCards : filteredCards;
  const currentCard = activeDeck[cardIndex] || null;

  // Box statistics
  const boxCounts = [1, 2, 3, 4, 5].map(b => flashcards.filter(c => c.box === b).length);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCreatingCard) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' && cardIndex < activeDeck.length - 1) {
        setIsFlipped(false);
        setCardIndex(prev => prev + 1);
      } else if (e.code === 'ArrowLeft' && cardIndex > 0) {
        setIsFlipped(false);
        setCardIndex(prev => prev - 1);
      } else if (e.key === '1') {
        handleRateCard('hard');
      } else if (e.key === '2') {
        handleRateCard('medium');
      } else if (e.key === '3') {
        handleRateCard('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardIndex, activeDeck.length, isCreatingCard, isFlipped]);

  const handleRateCard = (rating: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    const updated = storage.reviewCard(currentCard.id, rating);
    onUpdateFlashcards(updated);
    storage.recordStudyEngagement(2); // 2 mins engaged
    setIsFlipped(false);

    if (cardIndex < activeDeck.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      subject: newSubject,
      topic: newTopic.trim() || 'General Revision',
      box: 1,
      nextReviewDate: Date.now(),
      reviewCount: 0,
      easeScore: 'unreviewed',
    };

    const updated = [newCard, ...flashcards];
    storage.saveFlashcards(updated);
    onUpdateFlashcards(updated);

    setNewFront('');
    setNewBack('');
    setIsCreatingCard(false);
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = flashcards.filter(c => c.id !== id);
    storage.saveFlashcards(updated);
    onUpdateFlashcards(updated);
    if (cardIndex >= updated.length) setCardIndex(Math.max(0, updated.length - 1));
  };

  const progressPercent = activeDeck.length > 0 ? ((cardIndex + 1) / activeDeck.length) * 100 : 0;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
              <Layers className="h-4 w-4" />
              <span>Active Recall & Spaced Repetition</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Smart Flashcards
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Master formulas and concepts using the Leitner 5-box cognitive retention model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingCard(true)}
              className="clay-btn-primary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Flashcard</span>
            </button>
          </div>
        </div>

        {/* Leitner Box Progress Strip */}
        <div className="clay-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Leitner Memory Curves
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {dueCards.length} {dueCards.length === 1 ? 'card' : 'cards'} ready for review
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[
              { box: 1, label: 'Box 1', interval: '1 Day' },
              { box: 2, label: 'Box 2', interval: '3 Days' },
              { box: 3, label: 'Box 3', interval: '7 Days' },
              { box: 4, label: 'Box 4', interval: '14 Days' },
              { box: 5, label: 'Box 5', interval: '30 Days' },
            ].map(b => (
              <div
                key={b.box}
                className="clay-card-flat p-2.5 rounded-xl transition-all"
              >
                <p className="text-[10px] text-slate-400 font-semibold">{b.label}</p>
                <p className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white my-0.5">
                  {boxCounts[b.box - 1]}
                </p>
                <p className="text-[10px] text-slate-400">{b.interval}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Filter & Deck Progress */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Subject:</span>
            <select
              value={selectedSubject}
              onChange={e => {
                setSelectedSubject(e.target.value);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">All Subjects ({flashcards.length})</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English & Languages">English & Languages</option>
              <option value="History & Social Studies">History & Social Studies</option>
              <option value="Economics & Commerce">Economics & Commerce</option>
              <option value="General Science">General Science</option>
            </select>
          </div>

          {activeDeck.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Card <span className="font-bold text-slate-900 dark:text-white">{cardIndex + 1}</span> of {activeDeck.length}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Flashcard Practice Stage */}
        {currentCard ? (
          <div className="space-y-4">
            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="group min-h-[280px] sm:min-h-[320px] flex flex-col justify-between rounded-3xl clay-card p-6 sm:p-8 cursor-pointer border border-slate-200/80 dark:border-white/10 select-none transition-all hover:border-violet-500/40 relative"
            >
              {/* Top Bar inside Card */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-violet-600 dark:text-violet-400 tracking-wider text-[11px] uppercase">
                    {isFlipped ? 'Answer / Verification' : 'Question / Prompt'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-medium">{currentCard.subject}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Box {currentCard.box}
                  </span>
                  <button
                    type="button"
                    onClick={e => handleDeleteCard(currentCard.id, e)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                    title="Delete card"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Center Content */}
              <div className="my-auto py-6">
                {!isFlipped ? (
                  <div className="space-y-2 text-center">
                    <span className="text-xs text-slate-400 font-medium">
                      {currentCard.topic}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
                      {currentCard.front}
                    </h3>
                  </div>
                ) : (
                  <div className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                    <MarkdownRenderer content={currentCard.back} />
                  </div>
                )}
              </div>

              {/* Bottom hint inside card */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                <span className="flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Space to flip · 1/2/3 to score</span>
                </span>
                <span className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click anywhere to flip</span>
                </span>
              </div>
            </div>

            {/* Previous / Next Controls */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (cardIndex > 0) {
                    setIsFlipped(false);
                    setCardIndex(cardIndex - 1);
                  }
                }}
                disabled={cardIndex === 0}
                className="px-3.5 py-2 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                {isFlipped ? 'Show Question' : 'Reveal Answer'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (cardIndex < activeDeck.length - 1) {
                    setIsFlipped(false);
                    setCardIndex(cardIndex + 1);
                  }
                }}
                disabled={cardIndex >= activeDeck.length - 1}
                className="px-3.5 py-2 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Leitner Spaced Repetition Rating Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleRateCard('hard')}
                className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shadow-xs"
              >
                <span>1. Hard</span>
                <span className="block text-[10px] text-rose-500 font-normal mt-0.5">
                  Reset to Box 1
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRateCard('medium')}
                className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-xs"
              >
                <span>2. Medium</span>
                <span className="block text-[10px] text-amber-500 font-normal mt-0.5">
                  Review in Box {currentCard.box}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleRateCard('easy')}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
              >
                <span>3. Easy</span>
                <span className="block text-[10px] text-emerald-500 font-normal mt-0.5">
                  Promote to Box {Math.min(5, currentCard.box + 1)}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="clay-card p-12 text-center text-slate-500 space-y-3">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              All Caught Up!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No flashcards due for review right now in this category. You can add new cards
              or switch categories to continue learning.
            </p>
            <button
              type="button"
              onClick={() => setIsCreatingCard(true)}
              className="clay-btn-primary px-4 py-2 text-xs font-bold shadow-sm"
            >
              Create New Flashcard
            </button>
          </div>
        )}

        {/* Modal: Add Flashcard */}
        {isCreatingCard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={e => {
              if (e.target === e.currentTarget) setIsCreatingCard(false);
            }}
          >
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Add New Flashcard
                </h3>
                <button
                  onClick={() => setIsCreatingCard(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCard} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value as SubjectCategory)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English & Languages">English & Languages</option>
                    <option value="History & Social Studies">History & Social Studies</option>
                    <option value="Economics & Commerce">Economics & Commerce</option>
                    <option value="General Science">General Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topic / Concept Tag
                  </label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="e.g. Newton's 2nd Law or Calculus Derivatives"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Front (Question or Formula Prompt)
                  </label>
                  <textarea
                    value={newFront}
                    onChange={e => setNewFront(e.target.value)}
                    placeholder="e.g. State Newton’s Second Law of Motion and its mathematical form."
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Back (Answer, Explanation, or Proof)
                  </label>
                  <textarea
                    value={newBack}
                    onChange={e => setNewBack(e.target.value)}
                    placeholder="e.g. F = m·a (Force equals mass times acceleration in Newtons)..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCard(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="clay-btn-primary px-5 py-2 text-xs font-bold text-white shadow-sm"
                  >
                    Save Flashcard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
