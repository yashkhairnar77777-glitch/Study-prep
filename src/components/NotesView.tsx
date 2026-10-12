import React, { useState } from 'react';
import { BookMarked, Plus, Search, Trash2, Edit3, Save, Tag, Download, BookOpen } from 'lucide-react';
import { SavedNote, SubjectCategory, UserProfile } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface NotesViewProps {
  notes: SavedNote[];
  onUpdateNotes: (notes: SavedNote[]) => void;
  profile: UserProfile;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onUpdateNotes,
  profile,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState<SubjectCategory>(profile.primarySubject);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const handleCreateNew = () => {
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: 'New Study Note',
      content: 'Write your revision notes, derivations, or summaries here. KaTeX math formulas like $E = mc^2$ and $\\int x dx$ are fully supported.',
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

  const filteredNotes = notes.filter(n => {
    if (filterSubject !== 'all' && n.subject !== filterSubject) return false;
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
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-5 min-h-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <BookMarked className="w-4 h-4" />
              <span>Notes & Study Summaries</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Your Academic Knowledge Base
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2.5 clay-btn-primary font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Two-Column Clay Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
          {/* Left Column: Note List (4 Cols) */}
          <div className="md:col-span-4 clay-card p-4 rounded-3xl flex flex-col min-h-0">
            {/* Search & Subject filter */}
            <div className="space-y-2 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 clay-input text-xs outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-full px-3 py-1.5 clay-input text-xs outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Subjects ({notes.length})</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Note items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No notes found matching your search.
                </div>
              ) : (
                filteredNotes.map(note => {
                  const isSelected = note.id === (selectedNote?.id || '');
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNoteId(note.id);
                        setIsEditing(false);
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'clay-card-flat border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                          {note.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {note.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {note.content}
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

          {/* Right Column: Note Reader / Editor (8 Cols) */}
          <div className="md:col-span-8 clay-card p-6 rounded-3xl flex flex-col min-h-0">
            {selectedNote ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Action Bar */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                      {isEditing ? editSubject : selectedNote.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      Last edited {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="px-4 py-1.5 clay-btn-primary font-bold text-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Note</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(selectedNote)}
                        className="px-3.5 py-1.5 clay-btn-secondary text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
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
                      className="p-1.5 clay-btn-secondary rounded-xl text-slate-500 hover:text-slate-800"
                      title="Download as Markdown"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(selectedNote.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-600 rounded-xl"
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
                          className="w-full text-lg font-bold px-3 py-2 clay-input outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">
                            Subject Category
                          </label>
                          <select
                            value={editSubject}
                            onChange={e => setEditSubject(e.target.value as SubjectCategory)}
                            className="w-full px-3 py-1.5 clay-input text-xs outline-none text-slate-800 dark:text-slate-100"
                          >
                            {subjects.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">
                          Content (Markdown & KaTeX LaTeX Formulas supported)
                        </label>
                        <textarea
                          rows={14}
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="w-full p-4 clay-input text-xs sm:text-sm font-mono outline-none text-slate-800 dark:text-slate-100 resize-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                        {selectedNote.title}
                      </h2>
                      <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200">
                        <MarkdownRenderer content={selectedNote.content} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <BookOpen className="w-12 h-12 mb-3 opacity-50" />
                <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">No Note Selected</h3>
                <p className="text-xs max-w-xs mt-1">
                  Select a note from the left sidebar or create a new note to start drafting your study thoughts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
