import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Edit3,
  BookmarkPlus,
  Layers,
  StopCircle,
  AlertCircle,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import {
  ChatMessage,
  Conversation,
  GradeLevel,
  SubjectCategory,
  ExplanationStyle,
  UserProfile,
  ProviderStatus,
} from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { api } from '../lib/api';

interface ChatViewProps {
  conversation: Conversation;
  onUpdateConversation: (updated: Conversation) => void;
  profile: UserProfile;
  providerStatus: ProviderStatus | null;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
  onCreateFlashcard: (front: string, back: string, subject: SubjectCategory) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onUpdateConversation,
  profile,
  providerStatus,
  onSaveAsNote,
  onCreateFlashcard,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [preferredProvider, setPreferredProvider] = useState<'auto' | 'groq' | 'openrouter' | 'gemini'>('auto');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isLoading]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      styleUsed: conversation.style,
    };

    const newMessages = [...conversation.messages, userMessage];
    const updatedConvo: Conversation = {
      ...conversation,
      messages: newMessages,
      title:
        conversation.messages.length === 0
          ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
          : conversation.title,
      updatedAt: Date.now(),
    };

    onUpdateConversation(updatedConvo);
    setInputText('');
    setIsLoading(true);

    try {
      const serverMessages = newMessages
        .filter(m => !m.error)
        .slice(-15)
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      const res = await api.sendChatMessage({
        messages: serverMessages,
        grade: conversation.grade,
        selectedClass: profile.selectedClass,
        collegeCourse: profile.collegeCourse,
        competitiveExamCategory: profile.competitiveExamCategory,
        studentName: profile.name,
        primaryGoal: profile.primaryGoal,
        subject: conversation.subject,
        language: conversation.language,
        explanationDepth: conversation.style,
        preferredProvider,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.content,
        timestamp: Date.now(),
        providerUsed: res.providerUsed,
        modelUsed: res.modelUsed,
        fallbackOccurred: res.fallbackOccurred,
        fallbackDetails: res.fallbackDetails,
        styleUsed: conversation.style,
      };

      onUpdateConversation({
        ...updatedConvo,
        messages: [...newMessages, assistantMessage],
        updatedAt: Date.now(),
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown communication error';
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `**Study Assistant Notice:**\n${errMsg}`,
        timestamp: Date.now(),
        error: true,
      };

      onUpdateConversation({
        ...updatedConvo,
        messages: [...newMessages, errorMessage],
        updatedAt: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    if (conversation.messages.length === 0 || isLoading) return;
    const lastUserMsg = [...conversation.messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing error
      const cleanedMessages = conversation.messages.filter(m => !m.error);
      onUpdateConversation({
        ...conversation,
        messages: cleanedMessages,
      });
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleSaveEdit = (msgId: string) => {
    if (!editMessageText.trim()) return;
    // Find index of edited user message and remove all subsequent responses
    const msgIndex = conversation.messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    const trimmedMessages = conversation.messages.slice(0, msgIndex);
    const updatedUserMsg: ChatMessage = {
      ...conversation.messages[msgIndex],
      content: editMessageText.trim(),
    };

    onUpdateConversation({
      ...conversation,
      messages: [...trimmedMessages, updatedUserMsg],
      updatedAt: Date.now(),
    });

    setEditingMessageId(null);
    setEditMessageText('');
    handleSendMessage(updatedUserMsg.content);
  };

  const styleOptions: { id: ExplanationStyle; label: string; desc: string }[] = [
    { id: 'quick', label: 'Quick Answer', desc: 'Direct, minimal fluff' },
    { id: 'step_by_step', label: 'Step-by-Step', desc: 'Numbered solution with proof' },
    { id: 'exam_ready', label: 'Exam-Ready', desc: 'High-scoring keywords & layout' },
    { id: 'basics', label: 'Basics & Intuition', desc: 'Simple analogies from zero' },
  ];

  const suggestedQuestions: Record<SubjectCategory, string[]> = {
    Mathematics: [
      'Solve: ∫ (2x + 3) / (x² + 3x + 5) dx step by step',
      'Explain Bayes’ Theorem with an intuitive medical test example',
      'How do I find the eigenvalues and eigenvectors of a 2x2 matrix?',
    ],
    Physics: [
      'Explain the difference between Elastic and Inelastic collisions',
      'Derive the time period of a simple pendulum from simple harmonic motion',
      'How does Lenz’s law demonstrate conservation of energy?',
    ],
    Chemistry: [
      'Explain SN1 vs SN2 reaction mechanisms with stereochemical outcomes',
      'Calculate the pH of a 0.05 M acetic acid solution with Ka = 1.8 × 10⁻⁵',
      'How does crystal field theory explain the color of transition metal complexes?',
    ],
    Biology: [
      'Explain DNA replication fork enzymes: Helicase, Primase, and Polymerase',
      'Compare Mitosis vs Meiosis stages and genetic diversity outcomes',
      'How does the nephron maintain water and electrolyte homeostasis?',
    ],
    'Computer Science': [
      'Explain Time and Space complexity of Quicksort vs Mergesort',
      'How does public-key RSA cryptography mathematically work?',
      'Explain Dynamic Programming using the 0/1 Knapsack problem',
    ],
    'English & Languages': [
      'Explain the difference between Active and Passive voice with 3 examples',
      'How do I structure a persuasive five-paragraph argumentative essay?',
      'Explain the literary devices in Shakespeare’s Sonnet 18',
    ],
    'History & Social Studies': [
      'What were the primary underlying economic causes of World War I?',
      'Explain the doctrine of Separation of Powers in constitutional law',
      'Analyze the impact of the Industrial Revolution on urbanization',
    ],
    'Economics & Commerce': [
      'Explain Price Elasticity of Demand and how firms use it to set prices',
      'What is the difference between Fiscal Policy and Monetary Policy?',
      'Explain Opportunity Cost with a practical student career decision',
    ],
    'General Science': [
      'Why does ice float on liquid water, and how does this protect aquatic life?',
      'Explain the Doppler effect and its application in astronomy (redshift)',
      'How does greenhouse gas absorption of infrared radiation cause warming?',
    ],
  };

  const currentSuggestions = suggestedQuestions[conversation.subject] || suggestedQuestions.Mathematics;

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-800 dark:text-slate-100">
      {/* Top Workspace Toolbar */}
      <div className="border-b border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0c1222]/80 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto">
          {/* Grade & Subject Settings */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">Target:</span>
            <select
              value={conversation.grade}
              onChange={e =>
                onUpdateConversation({
                  ...conversation,
                  grade: e.target.value as GradeLevel,
                })
              }
              className="clay-input px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="Class 1-5 (Primary)">Class 1-5</option>
              <option value="Class 6-8 (Middle School)">Class 6-8</option>
              <option value="Class 9-10 (Secondary)">Class 9-10</option>
              <option value="Class 11-12 (Higher Secondary)">Class 11-12</option>
              <option value="College / Undergraduate">College</option>
              <option value="Competitive Exams (JEE / NEET / SAT / AP / GRE)">Competitive Exams</option>
              <option value="Independent Learner">Independent Learner</option>
            </select>

            <span className="text-slate-600">·</span>

            <select
              value={conversation.subject}
              onChange={e =>
                onUpdateConversation({
                  ...conversation,
                  subject: e.target.value as SubjectCategory,
                })
              }
              className="clay-input px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none"
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

          {/* Provider Selector / Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold hidden sm:inline">Provider:</span>
            <select
              value={preferredProvider}
              onChange={e => setPreferredProvider(e.target.value as any)}
              className="clay-input px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none"
            >
              <option value="auto">Auto Fallback (Groq → OpenRouter → Gemini)</option>
              <option value="groq">Groq (Primary Llama 3.3)</option>
              <option value="openrouter">OpenRouter (Secondary)</option>
              <option value="gemini">Gemini (Built-in)</option>
            </select>
          </div>
        </div>

        {/* Answer Style Selector (Segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 max-w-5xl mx-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 shrink-0">Style:</span>
          {styleOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onUpdateConversation({
                  ...conversation,
                  style: opt.id,
                })
              }
              className={`rounded-xl px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                conversation.style === opt.id
                  ? 'clay-btn-primary shadow-xs'
                  : 'clay-card-flat text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Notice */}
      {actionNotice && (
        <div className="fixed top-16 right-4 z-50 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-fade-in">
          {actionNotice}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Screen if empty */}
          {conversation.messages.length === 0 && (
            <div className="py-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-100 mb-2">
                Welcome to ORYQEN STUDY AI
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Your patient, accurate educational companion configured for{' '}
                <span className="text-indigo-300 font-medium">{conversation.grade}</span> in{' '}
                <span className="text-indigo-300 font-medium">{conversation.subject}</span>.
                Ask any formula, concept, or textbook problem to get step-by-step guidance.
              </p>

              {/* Quick suggestions */}
              <div className="text-left space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Questions for {conversation.subject}:
                </p>
                {currentSuggestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white transition-all block"
                  >
                    → {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Messages */}
          {conversation.messages.map(msg => {
            const isUser = msg.role === 'user';
            const isEditing = editingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mt-1 font-display font-bold text-xs">
                    AI
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`relative group max-w-[92%] sm:max-w-[85%] rounded-3xl p-5 transition-all ${
                    isUser
                      ? 'clay-btn-primary text-white rounded-tr-xs shadow-md'
                      : msg.error
                      ? 'rounded-2xl rounded-tl-xs border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                      : 'clay-card rounded-tl-xs shadow-md text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMessageText}
                        onChange={e => setEditMessageText(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-indigo-400 p-2.5 text-xs text-white outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMessageId(null)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(msg.id)}
                          className="px-2.5 py-1 text-xs rounded bg-indigo-500 text-white font-medium hover:bg-indigo-400"
                        >
                          Save & Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message Content */}
                      <MarkdownRenderer content={msg.content} />

                      {/* Provider & Fallback Metadata (for Assistant messages) */}
                      {!isUser && !msg.error && (
                        <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-indigo-300">
                              {msg.providerUsed === 'groq'
                                ? 'Groq'
                                : msg.providerUsed === 'openrouter'
                                ? 'OpenRouter'
                                : 'Gemini'}
                            </span>
                            {msg.modelUsed && (
                              <span className="text-slate-500">· {msg.modelUsed}</span>
                            )}
                            {msg.fallbackOccurred && (
                              <span className="text-amber-400">· Fallback Active</span>
                            )}
                          </div>

                          {/* Action Tools: Copy, Save Note, Create Flashcard */}
                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="flex items-center gap-1 rounded p-1 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span className="text-[10px]">Copy</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSaveAsNote(
                                  `${conversation.subject} Note: ${conversation.title}`,
                                  msg.content,
                                  conversation.subject
                                );
                                showNotification('Saved to Notes!');
                              }}
                              className="flex items-center gap-1 rounded p-1 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Save to Notes"
                            >
                              <BookmarkPlus className="h-3 w-3" />
                              <span className="text-[10px]">Save Note</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                // Extract a reasonable Q&A front/back
                                const userMsg = conversation.messages.find(m => m.role === 'user');
                                const front = userMsg ? userMsg.content : conversation.title;
                                onCreateFlashcard(front, msg.content.slice(0, 300), conversation.subject);
                                showNotification('Flashcard created!');
                              }}
                              className="flex items-center gap-1 rounded p-1 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Create Flashcard"
                            >
                              <Layers className="h-3 w-3" />
                              <span className="text-[10px]">Flashcard</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* User message edit button */}
                      {isUser && (
                        <div className="mt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditMessageText(msg.content);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-indigo-200 hover:text-white transition-opacity"
                            title="Edit message"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-display font-bold text-xs animate-pulse">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-xs border border-slate-700/60 bg-slate-800/80 p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-400">
                    Oryqen Tutor is structuring step-by-step response...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer Footer */}
      <div className="border-t border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0c1222]/85 p-3 sm:p-4 pb-safe backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Action strip: Retry, Style indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-2">
              {conversation.messages.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={handleRetryLast}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry answer</span>
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Shift + Enter for new line · LaTeX math supported ($...$)
            </span>
          </div>

          {/* Input Box */}
          <div className="relative flex items-end gap-2 rounded-3xl clay-card p-2 sm:p-2.5 focus-within:ring-2 focus-within:ring-indigo-500/30">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask a question in ${conversation.subject} (${conversation.grade})...`}
              rows={2}
              className="flex-1 max-h-36 resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl clay-btn-primary shadow-md disabled:opacity-40"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
