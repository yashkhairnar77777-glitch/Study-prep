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
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import {
  ChatMessage,
  Conversation,
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
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Unable to complete request**: ${
          err.message || 'Service temporarily unavailable. Please check your network or try again.'
        }`,
        timestamp: Date.now(),
        error: true,
      };
      onUpdateConversation({
        ...updatedConvo,
        messages: [...newMessages, errorMessage],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...conversation.messages]
      .reverse()
      .find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editMessageText.trim()) return;
    const msgIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const trimmedMessages = conversation.messages.slice(0, msgIndex);
    const updatedConvo = {
      ...conversation,
      messages: trimmedMessages,
    };
    onUpdateConversation(updatedConvo);
    setEditingMessageId(null);
    handleSendMessage(editMessageText.trim());
  };

  const styleOptions: { id: ExplanationStyle; label: string; desc: string }[] = [
    { id: 'step_by_step', label: 'Step-by-Step', desc: 'Detailed reasoning with intermediate proofs' },
    { id: 'quick', label: 'Concise', desc: 'Direct answer and key takeaways' },
    { id: 'exam_ready', label: 'Exam-Ready', desc: 'Marking scheme format with high-scoring keywords' },
    { id: 'basics', label: 'Intuitive Basics', desc: 'Simple real-world analogies and fundamental principles' },
  ];

  const suggestedQuestions: Record<SubjectCategory, string[]> = {
    Mathematics: [
      'Explain fractions with simple real-life pizza and chocolate examples.',
      'How do I solve quadratic equations using the quadratic formula step by step?',
      'Derive the Pythagorean theorem with a geometric intuition proof.',
    ],
    Physics: [
      'Explain Newton’s 3 Laws of Motion with daily life demonstrations.',
      'What is the difference between speed, velocity, and instantaneous acceleration?',
      'How does electromagnetic induction work in generators?',
    ],
    Chemistry: [
      'Explain Le Chatelier’s principle for chemical equilibrium with an example.',
      'How do ionic and covalent bonds differ in electron behavior?',
      'What is the difference between strong acids and concentrated acids?',
    ],
    Biology: [
      'Explain the key differences between Mitosis and Meiosis cell division.',
      'How do enzymes function as biological catalysts with the lock-and-key model?',
      'What are the main stages of Cellular Respiration in aerobic organisms?',
    ],
    'Computer Science': [
      'Explain Binary Search vs Linear Search with time complexity (Big-O).',
      'What is Recursion and how do base cases prevent stack overflow?',
      'Explain the difference between a Stack and a Queue data structure.',
    ],
    'English & Languages': [
      'Explain active vs passive voice with exam rewrite examples.',
      'How do I structure a persuasive 5-paragraph argumentative essay?',
      'What is the difference between a metaphor and a simile?',
    ],
    'History & Social Studies': [
      'What were the key causes leading up to the Industrial Revolution?',
      'Explain the separation of powers between legislative, executive, and judicial branches.',
      'How did ancient trade routes like the Silk Road influence modern economies?',
    ],
    'Economics & Commerce': [
      'Explain the law of supply and demand and how equilibrium price is determined.',
      'What is inflation and how do central banks use interest rates to control it?',
      'What is the difference between fiscal policy and monetary policy?',
    ],
    'General Science': [
      'Why is the sky blue during daytime and red during sunset?',
      'How does the greenhouse effect trap heat in Earth’s atmosphere?',
      'What causes ocean tides to rise and fall throughout the day?',
    ],
  };

  const currentSuggestions = suggestedQuestions[conversation.subject] || suggestedQuestions.Mathematics;

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-[#090e1a]/50 transition-colors">
      {/* Top Context & Explanation Controls */}
      <div className="border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#090e1a]/80 px-4 py-3 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Subject & Grade Information (Zero-pill clean metadata) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {conversation.title || 'Study Session'}
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <select
              value={conversation.subject}
              onChange={e =>
                onUpdateConversation({
                  ...conversation,
                  subject: e.target.value as SubjectCategory,
                })
              }
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 outline-none"
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

          {/* Provider Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Engine:</span>
            <select
              value={preferredProvider}
              onChange={e => setPreferredProvider(e.target.value as any)}
              className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 outline-none"
            >
              <option value="auto">Auto Fallback</option>
              <option value="gemini">Gemini (Built-in)</option>
              <option value="groq">Groq (Llama / Qwen)</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>
        </div>

        {/* Answer Style Selector (Segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 max-w-5xl mx-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Style:</span>
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
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                conversation.style === opt.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white'
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
        <div className="fixed top-18 right-4 z-50 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg animate-in fade-in">
          {actionNotice}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Screen if empty */}
          {conversation.messages.length === 0 && (
            <div className="py-8 text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-500 border border-violet-500/20">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome to AI Tutor
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Configured for <span className="font-semibold text-violet-600 dark:text-violet-400">{conversation.grade}</span> in{' '}
                  <span className="font-semibold text-violet-600 dark:text-violet-400">{conversation.subject}</span>.
                  Ask homework questions, request step-by-step proofs, or get exam scoring rubrics.
                </p>
              </div>

              {/* Starter Prompt Suggestions */}
              <div className="text-left space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Recommended Starters:
                </p>
                {currentSuggestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 text-xs text-slate-700 dark:text-slate-300 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-white transition-all shadow-xs"
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
                {/* Assistant Geometric Prism Avatar */}
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600/15 border border-violet-500/20 text-violet-500 mt-1 text-xs font-bold font-display">
                    AI
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`relative group max-w-[92%] sm:max-w-[85%] rounded-2xl p-4.5 sm:p-5 transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : msg.error
                      ? 'border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMessageText}
                        onChange={e => setEditMessageText(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-violet-500 p-2.5 text-xs text-white outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMessageId(null)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(msg.id)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500"
                        >
                          Save & Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message Content */}
                      <MarkdownRenderer content={msg.content} />

                      {/* Footer Actions on AI Response */}
                      {!isUser && !msg.error && (
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-slate-400 text-xs">
                          <div className="flex items-center gap-2 text-[11px]">
                            {msg.modelUsed && (
                              <span className="font-mono text-slate-400">
                                {msg.modelUsed}
                              </span>
                            )}
                            {msg.fallbackOccurred && (
                              <span className="text-amber-500">· Fallback</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-500" />
                                  <span className="text-[10px] text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span className="text-[10px]">Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSaveAsNote(
                                  `${conversation.subject} Note: ${conversation.title}`,
                                  msg.content,
                                  conversation.subject
                                );
                                showNotification('Saved to Study Notes!');
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                              title="Save Note"
                            >
                              <BookmarkPlus className="h-3 w-3" />
                              <span className="text-[10px]">Save Note</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const userMsg = conversation.messages.find(m => m.role === 'user');
                                const front = userMsg ? userMsg.content : conversation.title;
                                onCreateFlashcard(front, msg.content.slice(0, 300), conversation.subject);
                                showNotification('Flashcard created!');
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
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
                            className="opacity-0 group-hover:opacity-100 p-1 text-violet-200 hover:text-white transition-opacity"
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600/15 border border-violet-500/20 text-violet-500 font-display font-bold text-xs animate-pulse">
                AI
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400">
                  <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-500 dark:text-slate-400">
                    ORYQEN AI is synthesizing step-by-step response...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer Footer */}
      <div className="border-t border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090e1a]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Helper notice */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-2">
              {conversation.messages.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={handleRetryLast}
                  className="flex items-center gap-1 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry answer</span>
                </button>
              )}
            </div>

            <span>
              Enter to send · Shift + Enter for new line · LaTeX equations supported
            </span>
          </div>

          {/* Input Box */}
          <div className="relative flex items-end gap-2 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-2 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-500 shadow-xs">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-sm disabled:opacity-40 transition-colors"
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
