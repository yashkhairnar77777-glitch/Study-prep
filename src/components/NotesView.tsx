import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  Download,
  BookOpen,
  Copy,
  Check,
  FileText,
  AlignLeft,
  ListFilter,
  Sparkles,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SavedNote, SubjectCategory, UserProfile } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { NCERT_EXPLORING_SOCIETY_CHAPTERS } from './ChatView';

interface NotesViewProps {
  notes: SavedNote[];
  onUpdateNotes: (notes: SavedNote[]) => void;
  profile: UserProfile;
  onOpenNcertGenerator?: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onUpdateNotes,
  profile,
  onOpenNcertGenerator,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterExploringSocietyOnly, setFilterExploringSocietyOnly] = useState<boolean>(false);
  const [showChapterNav, setShowChapterNav] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState<SubjectCategory>(profile.primarySubject);
  const [viewMode, setViewMode] = useState<'detailed' | 'concise'>('detailed');
  const [copied, setCopied] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const handleCreateNew = () => {
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: 'New Study Note',
      content: '## Key Concepts\nWrite your revision notes, derivations, or summaries here.\n\n### Formula Reference\nKaTeX math equations like $E = mc^2$ and $\\int x\\,dx = \\frac{x^2}{2} + C$ are rendered natively.',
      subject: profile.primarySubject,
      createdAt: Date.now(),
      tags: [profile.primarySubject],
    };
    const updated = [newNote, ...notes];
    onUpdateNotes(updated);
    setSelectedNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditSubject(newNote.subject);
    setIsEditing(true);
  };

  const handleSelectOrGenerateChapterNote = (ch: typeof NCERT_EXPLORING_SOCIETY_CHAPTERS[0]) => {
    // Check if a note already exists for this chapter
    const existing = notes.find(
      n =>
        n.title.toLowerCase().includes(`ch ${ch.number}`) ||
        n.title.toLowerCase().includes(`chapter ${ch.number}`) ||
        n.title.toLowerCase().includes(ch.name.toLowerCase())
    );

    if (existing) {
      setSelectedNoteId(existing.id);
      setIsEditing(false);
      return;
    }

    // Auto-generate comprehensive NCERT revision note for this chapter
    const newNote: SavedNote = {
      id: `note-es-ch${ch.number}-${Date.now()}`,
      title: `NCERT Exploring Society Ch ${ch.number}: ${ch.name}`,
      subject: 'History & Social Studies',
      createdAt: Date.now(),
      tags: ['Exploring Society', 'NCERT', ch.theme.split(':')[0].trim(), ch.name],
      content: `## NCERT Class 6 Exploring Society: India and Beyond
### Chapter ${ch.number}: ${ch.name} (${ch.theme})

---

### 1. Overview & Core Themes
This chapter is a foundational pillar of NCERT Class 6 Social Science:
- **Core Topics**: ${ch.topics}
- **Curriculum Theme**: ${ch.theme}
- **Textbook**: NCERT Exploring Society: India and Beyond (Class 6)

---

### 2. Key Concepts & Structured Breakdown
${ch.topics
  .split(', ')
  .map(
    t => `#### • ${t}
- Essential concept explaining human geography, ancient heritage, grassroots governance, or economic livelihoods.
- Connects local daily observations with broader nationwide institutional structures.`
  )
  .join('\n\n')}

---

### 3. Exam Ready Key Terms & Definitions
- Understand chronological and spatial coordinates relevant to this theme.
- Contrast traditional community practices with modern democratic and economic frameworks.
- Practice drawing conceptual maps, diagrams, and timeline charts.

---

### 4. Practice & Self-Evaluation Questions
1. **Explain the primary significance of ${ch.name} in modern understanding of Indian society.**
2. **How does this chapter highlight the harmony between people, land, and democratic institutions?**`,
    };

    const updated = [newNote, ...notes];
    onUpdateNotes(updated);
    setSelectedNoteId(newNote.id);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedNote) return;
    const updated = notes.map(n =>
      n.id === selectedNote.id
        ? {
            ...n,
            title: editTitle.trim() || 'Untitled Note',
            content: editContent,
            subject: editSubject,
          }
        : n
    );
    onUpdateNotes(updated);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    onUpdateNotes(updated);
    if (selectedNoteId === id) {
      setSelectedNoteId(updated[0]?.id || null);
      setIsEditing(false);
    }
  };

  const startEdit = (note: SavedNote) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubject(note.subject);
    setIsEditing(true);
  };

  const handleCopyNote = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(`${selectedNote.title}\n\n${selectedNote.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredNotes = notes.filter(n => {
    if (filterExploringSocietyOnly) {
      const isES =
        n.title.toLowerCase().includes('exploring society') ||
        n.content.toLowerCase().includes('exploring society') ||
        n.tags?.some(t => t.toLowerCase().includes('exploring society'));
      if (!isES) return false;
    } else if (filterSubject !== 'all' && n.subject !== filterSubject) {
      return false;
    }

    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const subjects: SubjectCategory[] = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English & Languages',
    'History & Social Studies',
    'Economics & Commerce',
    'General Science',
    'Japanese',
    'Foundation & Olympiads',
  ];

  // Concise view extracts top bullet points or headings
  const getConciseContent = (fullText: string) => {
    const lines = fullText.split('\n');
    const highlights = lines.filter(l =>
      l.startsWith('#') || l.startsWith('*') || l.startsWith('-') || l.includes(':') || l.includes('$')
    );
    return highlights.length > 3 ? highlights.join('\n') : fullText;
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-5 min-h-0 pb-14 md:pb-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
              <BookMarked className="w-4 h-4" />
              <span>Knowledge Base & Revision Notes</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Study Notes
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenNcertGenerator && (
              <button
                type="button"
                onClick={onOpenNcertGenerator}
                className="px-3.5 py-2 text-xs font-bold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:opacity-95 flex items-center gap-1.5 transition-all"
                title="Generate comprehensive NCERT chapter notes with just 1-click chapter select"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Generate NCERT Notes</span>
              </button>
            )}

            <button
              onClick={handleCreateNew}
              className="clay-btn-primary px-4 py-2 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Two-Column Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
          {/* Left Column: Note List (4 Cols) */}
          <div className="md:col-span-4 clay-card p-4 rounded-2xl flex flex-col min-h-0">
            {/* Search & Subject filter */}
            <div className="space-y-2 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search note titles or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Filter Tabs: All vs Exploring Society */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setFilterExploringSocietyOnly(false);
                    setFilterSubject('all');
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold text-center transition-all ${
                    !filterExploringSocietyOnly
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  All Notes ({notes.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterExploringSocietyOnly(true);
                    setFilterSubject('all');
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold text-center transition-all flex items-center justify-center gap-1 ${
                    filterExploringSocietyOnly
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>📘 Exploring Society</span>
                </button>
              </div>

              <select
                value={filterSubject}
                onChange={e => {
                  setFilterSubject(e.target.value);
                  if (filterExploringSocietyOnly) setFilterExploringSocietyOnly(false);
                }}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Subjects ({notes.length})</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* NCERT 14 Chapters Quick Drawer Trigger */}
              <button
                type="button"
                onClick={() => setShowChapterNav(!showChapterNav)}
                className="w-full py-1.5 px-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-all hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40"
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>NCERT 14 Chapters Study Guides</span>
                </div>
                {showChapterNav ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* 14 Chapter Quick Drawer */}
              {showChapterNav && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider px-1">
                    Exploring Society Chapters (1–14):
                  </div>
                  {NCERT_EXPLORING_SOCIETY_CHAPTERS.map(ch => {
                    const isExisting = notes.some(
                      n =>
                        n.title.toLowerCase().includes(`ch ${ch.number}`) ||
                        n.title.toLowerCase().includes(`chapter ${ch.number}`) ||
                        n.title.toLowerCase().includes(ch.name.toLowerCase())
                    );
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleSelectOrGenerateChapterNote(ch)}
                        className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between gap-1 transition-all ${
                          isExisting
                            ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/20'
                            : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-1">
                            Ch {ch.number}:
                          </span>
                          <span className="truncate">{ch.name}</span>
                        </div>
                        <span className={`text-[9px] px-1 rounded shrink-0 font-medium ${
                          isExisting
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {isExisting ? 'Ready' : '+ Note'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Note items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  {filterExploringSocietyOnly
                    ? 'No Exploring Society notes found. Use the NCERT 14 Chapters guide above to generate one!'
                    : 'No notes found matching your search.'}
                </div>
              ) : (
                filteredNotes.map(note => {
                  const isSelected = note.id === (selectedNote?.id || '');
                  const isExploringSociety =
                    note.title.toLowerCase().includes('exploring society') ||
                    note.content.toLowerCase().includes('exploring society') ||
                    note.tags?.some(t => t.toLowerCase().includes('exploring society'));

                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNoteId(note.id);
                        setIsEditing(false);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-violet-500/50 bg-violet-50/60 dark:bg-violet-950/40 text-violet-950 dark:text-violet-100'
                          : 'border-slate-200/50 dark:border-white/5 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate">
                          {note.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {note.subject}
                        </span>
                      </div>

                      {isExploringSociety && (
                        <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          <Compass className="w-2.5 h-2.5" />
                          <span>NCERT Exploring Society</span>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {note.content.replace(/[#*`$]/g, '')}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Note Reader & Editor (8 Cols) */}
          <div className="md:col-span-8 clay-card p-6 rounded-2xl flex flex-col min-h-0">
            {selectedNote ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3 mb-4 shrink-0 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                      {isEditing ? editSubject : selectedNote.subject}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-slate-400 text-[11px]">
                      Edited {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions: View Mode, Copy, Export, Edit */}
                  <div className="flex items-center gap-1.5">
                    {/* Concise vs Detailed toggle */}
                    {!isEditing && (
                      <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold mr-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('detailed')}
                          className={`px-2 py-1 rounded-md transition-colors ${
                            viewMode === 'detailed'
                              ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                          }`}
                        >
                          Detailed
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('concise')}
                          className={`px-2 py-1 rounded-md transition-colors ${
                            viewMode === 'concise'
                              ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                          }`}
                        >
                          Concise
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyNote}
                      className="px-2.5 py-1.5 rounded-lg clay-btn-secondary text-xs font-medium flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      title="Copy Note Text"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([`${selectedNote.title}\n\n${selectedNote.content}`], {
                          type: 'text/markdown',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedNote.title.toLowerCase().replace(/\s+/g, '-')}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-1.5 rounded-lg clay-btn-secondary text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title="Export as Markdown (.md)"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={handleSave}
                        className="clay-btn-primary px-3.5 py-1.5 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(selectedNote)}
                        className="px-3 py-1.5 rounded-lg clay-btn-secondary text-xs font-semibold flex items-center gap-1.5 text-violet-600 dark:text-violet-400"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedNote.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">
                          Note Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full text-base font-bold p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">
                          Subject
                        </label>
                        <select
                          value={editSubject}
                          onChange={e => setEditSubject(e.target.value as SubjectCategory)}
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-none"
                        >
                          {subjects.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">
                          Content (Markdown & LaTeX formulas supported)
                        </label>
                        <textarea
                          rows={14}
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 resize-none outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                        {selectedNote.title}
                      </h2>
                      <div className="text-slate-900 dark:text-slate-100 text-sm leading-relaxed">
                        <MarkdownRenderer
                          content={
                            viewMode === 'concise'
                              ? getConciseContent(selectedNote.content)
                              : selectedNote.content
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <BookOpen className="w-12 h-12 mb-3 opacity-40 text-violet-500" />
                <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
                  No Note Selected
                </h3>
                <p className="text-xs max-w-xs mt-1">
                  Select a note from the left sidebar or create a new note to start drafting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
