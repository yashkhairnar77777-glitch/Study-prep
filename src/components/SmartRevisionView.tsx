import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Bookmark,
  Sparkles,
  Filter,
  Check,
  X,
  FileText,
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
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes'>('flashcards');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newTopic, setNewTopic] = useState('Key Formulas & Concepts');
  const [newSubject, setNewSubject] = useState<SubjectCategory>(profile.primarySubject);

  // Notes state
  const [notesSearch, setNotesSearch] = useState('');

  // Filter cards by subject
  const filteredCards = flashcards.filter(c => {
    if (selectedSubject === 'all') return true;
    return c.subject === selectedSubject;
  });

  // Due cards calculation (deterministic Leitner)
  const now = Date.now();
  const dueCards = filteredCards.filter(c => c.nextReviewDate <= now);
  const activeDeck = dueCards.length > 0 ? dueCards : filteredCards;
  const currentCard = activeDeck[cardIndex] || null;

  // Box statistics
  const boxCounts = [1, 2, 3, 4, 5].map(b => flashcards.filter(c => c.box === b).length);

  const handleRateCard = (rating: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    const updated = storage.reviewCard(currentCard.id, rating);
    onUpdateFlashcards(updated);
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

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    storage.saveNotes(updated);
    onUpdateNotes(updated);
  };

  const filteredNotes = notes.filter(n => {
    if (!notesSearch.trim()) return true;
    return (
      n.title.toLowerCase().includes(notesSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(notesSearch.toLowerCase()) ||
      n.subject.toLowerCase().includes(notesSearch.toLowerCase())
    );
  });

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Layers className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Recall & Spaced Repetition
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Smart Revision Hub
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl border border-slate-700 bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activeTab === 'flashcards'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Flashcards ({flashcards.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved Notes ({notes.length})</span>
            </button>
          </div>
        </div>

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            {/* Leitner Box Progress Strip */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider">
                  Leitner Spaced Repetition Intervals
                </span>
                <span className="text-emerald-400 font-medium">
                  {dueCards.length} {dueCards.length === 1 ? 'card' : 'cards'} due today
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
                    className="rounded-xl border border-slate-700 bg-slate-850 p-2.5 transition-all hover:border-slate-600"
                  >
                    <p className="text-[11px] text-slate-400 font-medium">{b.label}</p>
                    <p className="font-mono text-lg font-bold text-white my-0.5">
                      {boxCounts[b.box - 1]}
                    </p>
                    <p className="text-[10px] text-slate-500">{b.interval}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter & Add Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={e => {
                    setSelectedSubject(e.target.value);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Subjects</option>
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

              <button
                type="button"
                onClick={() => setIsCreatingCard(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Flashcard</span>
              </button>
            </div>

            {/* Flashcard Practice Stage */}
            {currentCard ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>
                    Card {cardIndex + 1} of {activeDeck.length}
                  </span>
                  <span>
                    Box {currentCard.box} · {currentCard.topic}
                  </span>
                </div>

                {/* 3D Flip Flashcard */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="group min-h-[260px] sm:min-h-[300px] flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-slate-850 p-6 sm:p-8 cursor-pointer shadow-lg hover:border-indigo-500/60 transition-all select-none relative overflow-hidden"
                >
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span className="font-semibold text-indigo-400">
                      {isFlipped ? 'ANSWER / CONCEPT' : 'QUESTION / PROMPT'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">
                        Click card to flip
                      </span>
                      <button
                        type="button"
                        onClick={e => handleDeleteCard(currentCard.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Center Content */}
                  <div className="my-auto py-4">
                    {!isFlipped ? (
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white text-center leading-relaxed">
                        {currentCard.front}
                      </h3>
                    ) : (
                      <div className="text-slate-200 text-sm sm:text-base leading-relaxed">
                        <MarkdownRenderer content={currentCard.back} />
                      </div>
                    )}
                  </div>

                  {/* Bottom hint inside card */}
                  <div className="text-center text-[11px] text-slate-500 pt-3 border-t border-slate-800">
                    {!isFlipped
                      ? 'Press space or tap anywhere to reveal answer'
                      : 'Rate your recall accuracy below to update Leitner interval'}
                  </div>
                </div>

                {/* Leitner Rating Controls */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRateCard('hard')}
                    className="rounded-xl border border-rose-800/80 bg-rose-950/40 py-3 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-colors shadow-xs"
                  >
                    Hard
                    <span className="block text-[10px] text-rose-400 font-normal">
                      Reset to Box 1
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateCard('medium')}
                    className="rounded-xl border border-amber-800/80 bg-amber-950/40 py-3 text-xs font-semibold text-amber-300 hover:bg-amber-900/60 transition-colors shadow-xs"
                  >
                    Medium
                    <span className="block text-[10px] text-amber-400 font-normal">
                      Review soon
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateCard('easy')}
                    className="rounded-xl border border-emerald-800/80 bg-emerald-950/40 py-3 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-xs"
                  >
                    Easy
                    <span className="block text-[10px] text-emerald-400 font-normal">
                      Promote to Box {Math.min(5, currentCard.box + 1)}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-850 p-12 text-center text-slate-400">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-white mb-1">
                  All Caught Up!
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  No flashcards due for review right now in this category. You can add new cards
                  or review the full deck anytime.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreatingCard(true)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Create New Flashcard
                </button>
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={notesSearch}
                onChange={e => setNotesSearch(e.target.value)}
                placeholder="Search saved study notes by topic or formula..."
                className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
            </div>

            {filteredNotes.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-850 p-12 text-center text-slate-400">
                <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-white mb-1">
                  No Saved Notes Yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When asking questions in Tutor Chat or Photo Solver, click "Save Note" on any
                  explanation to archive it here for exam revision.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-slate-700/80 bg-slate-850 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-white">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{note.subject}</span>
                          <span>·</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete Note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                      <MarkdownRenderer content={note.content} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Flashcard Modal */}
        {isCreatingCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-850 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display text-base font-bold text-white">
                  Add New Revision Flashcard
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingCard(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCard} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Subject</label>
                    <select
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value as SubjectCategory)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none"
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
                    <label className="block text-xs text-slate-400 mb-1">Topic</label>
                    <input
                      type="text"
                      value={newTopic}
                      onChange={e => setNewTopic(e.target.value)}
                      placeholder="e.g. Organic Reactions"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Front (Question or Prompt)
                  </label>
                  <textarea
                    value={newFront}
                    onChange={e => setNewFront(e.target.value)}
                    placeholder="e.g. What is the Henderson-Hasselbalch equation for buffer pH?"
                    rows={2}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Back (Answer, Formula & Explanation)
                  </label>
                  <textarea
                    value={newBack}
                    onChange={e => setNewBack(e.target.value)}
                    placeholder="e.g. pH = pKa + log([A⁻]/[HA]) where [A⁻] is conjugate base and [HA] is weak acid..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCard(false)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
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
