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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Trash2,
  BookMarked,
  Compass,
  GraduationCap,
  ChevronDown,
  ChevronUp,
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

export const NCERT_EXPLORING_SOCIETY_CHAPTERS = [
  { id: 'ch-1', number: 1, theme: 'Theme A: India and the World', name: 'Locating Places on the Earth', topics: 'Globe, Latitudes, Longitudes, Equator, Prime Meridian, IST (+5:30), Grid Coordinates' },
  { id: 'ch-2', number: 2, theme: 'Theme A: India and the World', name: 'Oceans and Continents', topics: '7 Continents, 5 Major Oceans, Hydrosphere, Lithosphere, Continental Drift' },
  { id: 'ch-3', number: 3, theme: 'Theme A: India and the World', name: 'Landforms and Life', topics: 'Mountains (Fold/Block/Volcanic), Plateaus, Plains, River Valleys, Human Settlements' },
  { id: 'ch-4', number: 4, theme: 'Theme B: Tapestry of the Past', name: 'Timeline and Sources of History', topics: 'BCE/CE chronology, Archaeological & Literary sources, Inscriptions, Coins, Monuments' },
  { id: 'ch-5', number: 5, theme: 'Theme B: Tapestry of the Past', name: 'India, That Is Bharat', topics: 'Origins of names Bharat, India, Jambudvipa, Sapta Sindhu, Geographic extent' },
  { id: 'ch-6', number: 6, theme: 'Theme B: Tapestry of the Past', name: 'The Beginnings of Indian Civilisation', topics: 'Harappan civilisation, Citadel, Lower Town, Great Bath, Drainage, Seals, Lothal Dockyard' },
  { id: 'ch-7', number: 7, theme: 'Theme C: Cultural Heritage', name: "India's Cultural Roots", topics: 'Vedic traditions, Upanishads, Epics (Ramayana, Mahabharata), Shramana traditions' },
  { id: 'ch-8', number: 8, theme: 'Theme C: Cultural Heritage', name: 'Unity in Diversity', topics: 'Geographical, linguistic, cultural and religious diversity, Common constitutional bond' },
  { id: 'ch-9', number: 9, theme: 'Theme D: Governance & Democracy', name: 'Family and Community', topics: 'Social institutions, kinship, community cooperation, mutual support in village life' },
  { id: 'ch-10', number: 10, theme: 'Theme D: Governance & Democracy', name: 'Grassroots Democracy — Part 1: Governance', topics: 'What is government, Need for laws, Three levels: Local, State, National' },
  { id: 'ch-11', number: 11, theme: 'Theme D: Governance & Democracy', name: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', topics: 'Gram Sabha, Gram Panchayat, Sarpanch, Ward Panch, 3-tier Panchayati Raj' },
  { id: 'ch-12', number: 12, theme: 'Theme D: Governance & Democracy', name: 'Grassroots Democracy — Part 3: Local Government in Urban Areas', topics: 'Municipal Corporation, Ward Councillors, Municipal Commissioner, Urban services' },
  { id: 'ch-13', number: 13, theme: 'Theme E: Economic Life Around Us', name: 'The Value of Work', topics: 'Dignity of labour, domestic unpaid work, caregiving, craftsmanship, gender equality' },
  { id: 'ch-14', number: 14, theme: 'Theme E: Economic Life Around Us', name: 'Economic Activities Around Us', topics: 'Primary (Farming/Mining), Secondary (Manufacturing), Tertiary (Services), Interdependence' },
];

export interface SpeechLanguage {
  code: string;
  label: string;
}

export const SPEECH_LANGUAGES: SpeechLanguage[] = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'hi-IN', label: 'Hindi (हिंदी)' },
  { code: 'es-ES', label: 'Spanish (Español)' },
  { code: 'fr-FR', label: 'French (Français)' },
  { code: 'de-DE', label: 'German (Deutsch)' },
  { code: 'ja-JP', label: 'Japanese (日本語)' },
];

interface ChatViewProps {
  conversation: Conversation;
  onUpdateConversation: (updated: Conversation) => void;
  profile: UserProfile;
  providerStatus: ProviderStatus | null;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
  onCreateFlashcard: (front: string, back: string, subject: SubjectCategory) => void;
  onOpenNcertGenerator?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onUpdateConversation,
  profile,
  providerStatus,
  onSaveAsNote,
  onCreateFlashcard,
  onOpenNcertGenerator,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [preferredProvider, setPreferredProvider] = useState<'auto' | 'groq' | 'openrouter' | 'gemini'>('auto');
  const [showNcertDrawer, setShowNcertDrawer] = useState(false);

  // Web Speech API: Speech Recognition (STT) & Speech Synthesis (TTS)
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check browser speech recognition support on mount
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setIsSpeechSupported(supported);
  }, []);

  // Language mapping for Web Speech API
  const getRecognitionLanguage = (): string => {
    if (conversation.subject === 'Japanese' || profile.preferredLanguage === 'Japanese') {
      return 'ja-JP';
    }
    switch (profile.preferredLanguage) {
      case 'Hindi':
        return 'hi-IN';
      case 'French':
        return 'fr-FR';
      case 'German':
        return 'de-DE';
      case 'Spanish':
        return 'es-ES';
      default:
        return 'en-IN';
    }
  };

  const [selectedSpeechLang, setSelectedSpeechLang] = useState<string>(() => getRecognitionLanguage());

  // Web Audio chime for acoustic start/stop cues
  const playSpeechChime = (action: 'start' | 'stop') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      if (action === 'start') {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.14);
      } else {
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.14);
      }
    } catch {}
  };

  // Stop active speech or recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getLanguageLabel = (): string => {
    const found = SPEECH_LANGUAGES.find(l => l.code === selectedSpeechLang);
    if (found) return found.label;
    if (conversation.subject === 'Japanese' || profile.preferredLanguage === 'Japanese') return 'Japanese';
    if (profile.preferredLanguage === 'Hindi') return 'Hindi';
    if (profile.preferredLanguage === 'French') return 'French';
    if (profile.preferredLanguage === 'German') return 'German';
    if (profile.preferredLanguage === 'Spanish') return 'Spanish';
    return 'English';
  };

  // Web Speech API: Toggle Dictation
  const handleToggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showNotification('Voice dictation is not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      playSpeechChime('stop');
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      setSpeechError(null);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedSpeechLang || getRecognitionLanguage();

      recognition.onstart = () => {
        setIsListening(true);
        playSpeechChime('start');
        textareaRef.current?.focus();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const transcript = item[0]?.transcript || '';
          if (item.isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (final) {
          const lower = final.trim().toLowerCase();
          // Hands-free voice command: "send question" / "send message" / "submit"
          if (
            lower.endsWith('send question') ||
            lower.endsWith('send message') ||
            lower.endsWith('ask question') ||
            lower === 'send'
          ) {
            const stripped = final
              .replace(/send\s*(question|message)?/i, '')
              .replace(/ask\s*(this\s*)?question/i, '')
              .trim();
            const fullQuestion = (inputText ? `${inputText.trim()} ${stripped}` : stripped).trim();
            if (fullQuestion) {
              try {
                recognition.stop();
              } catch {}
              playSpeechChime('stop');
              setIsListening(false);
              setInterimTranscript('');
              handleSendMessage(fullQuestion);
              return;
            }
          }

          // Hands-free voice command: "clear question"
          if (lower === 'clear question' || lower === 'clear input') {
            setInputText('');
            setInterimTranscript('');
            showNotification('Cleared question via voice command.');
            return;
          }

          setInputText(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${final.trim()}` : final.trim();
          });
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error in ChatView:', e);
        setIsListening(false);
        setInterimTranscript('');
        playSpeechChime('stop');
        if (e.error === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please allow microphone in browser address bar.');
          showNotification('Microphone permission denied.');
        } else if (e.error === 'no-speech') {
          // Normal timeout on silence
        } else if (e.error === 'audio-capture') {
          setSpeechError('No microphone detected. Please check your system audio device.');
          showNotification('No microphone detected.');
        } else {
          showNotification(`Voice dictation stopped: ${e.error || 'idle'}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      playSpeechChime('stop');
      showNotification('Could not start microphone dictation.');
    }
  };

  // Clean Markdown & LaTeX so speech synthesis sounds natural
  const cleanTextForSpeech = (raw: string): string => {
    return raw
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
      .replace(/\\times/g, ' times ')
      .replace(/\\div/g, ' divided by ')
      .replace(/\\pm/g, ' plus or minus ')
      .replace(/\\approx/g, ' approximately ')
      .replace(/\\implies/g, ' implies ')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\$\$([\s\S]*?)\$\$/g, 'Formula: $1')
      .replace(/\$([^\$\n]+?)\$/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*>\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Web Speech API: Toggle Read Aloud (TTS)
  const handleToggleSpeak = (messageId: string, content: string) => {
    if (!('speechSynthesis' in window)) {
      showNotification('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleaned = cleanTextForSpeech(content);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    const lang = getRecognitionLanguage();
    utterance.lang = lang === 'en-IN' ? 'en-US' : lang;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

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
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      playSpeechChime('stop');
      setIsListening(false);
    }

    const pendingSpoken = interimTranscript.trim();
    setInterimTranscript('');

    const baseText = textToSend !== undefined ? textToSend : inputText;
    const text = (pendingSpoken && !baseText.includes(pendingSpoken) ? `${baseText} ${pendingSpoken}` : baseText).trim();

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
      'Explain how latitudes, longitudes, and the Prime Meridian help us locate any place on Earth (NCERT Exploring Society Ch 1).',
      'What were the key architectural and town planning features of the Harappan Civilisation? (NCERT Exploring Society Ch 6).',
      'How does Grassroots Democracy work in rural villages through Gram Sabha and Gram Panchayat? (NCERT Exploring Society Ch 10 & 11).',
      'Explain the primary, secondary, and tertiary economic activities around us with real-world examples (NCERT Exploring Society Ch 14).',
      'What are the origins and significance of the names Bharat and India? (NCERT Exploring Society Ch 5).',
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
    Japanese: [
      'Teach me the stroke order and pronunciation rules for Hiragana vowels (あ, い, う, え, お).',
      'How do I introduce myself in Japanese using Watashi wa [Name] desu and Hajimemashite?',
      'Explain the difference between Japanese particles は (wa), を (o), and に (ni).',
    ],
    'Foundation & Olympiads': [
      'Derive the maximum height and time of flight for a projectile launched at angle θ.',
      'Explain the relationship between roots of a quadratic equation using Vieta’s formulas.',
      'Solve this NTSE number series problem with pattern step-by-step logic.',
    ],
  };

  const currentSuggestions = suggestedQuestions[conversation.subject] || suggestedQuestions.Mathematics;

  const handleSelectExploringSocietyChapter = (ch: typeof NCERT_EXPLORING_SOCIETY_CHAPTERS[0]) => {
    const chapterPrompt = `I want to study NCERT Class 6 Exploring Society: India and Beyond — Chapter ${ch.number}: "${ch.name}" (${ch.theme}).
Please tutor me on this chapter:
1. Explain the key core concepts clearly with real-world examples (${ch.topics}).
2. List the essential NCERT definitions and terms I need to memorize for exams.
3. Provide 2 conceptual test questions with model answers.`;

    onUpdateConversation({
      ...conversation,
      subject: 'History & Social Studies',
      title: `Exploring Society: Ch ${ch.number} ${ch.name}`,
    });
    setShowNcertDrawer(false);
    handleSendMessage(chapterPrompt);
  };

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

          {/* Quick NCERT Exploring Society Toggle & Provider Selector */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowNcertDrawer(!showNcertDrawer)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-xs"
              title="Browse and tutor all 14 chapters of NCERT Exploring Society: India and Beyond"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">📘 Exploring Society</span>
              <span className="sm:hidden">📘 SST Book</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/20 font-mono font-extrabold text-emerald-700 dark:text-emerald-200">14 Ch</span>
              {showNcertDrawer ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>

            {onOpenNcertGenerator && (
              <button
                type="button"
                onClick={onOpenNcertGenerator}
                className="px-2 py-1 text-xs font-semibold rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1 transition-all"
                title="Open 1-Click NCERT Pack Generator for Notes and Flashcards"
              >
                <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                <span className="hidden md:inline">NCERT Generator</span>
              </button>
            )}

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block" />

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

        {/* NCERT Exploring Society Quick Tutor Drawer */}
        {showNcertDrawer && (
          <div className="max-w-5xl mx-auto mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/30 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  NCERT Class 6 — Exploring Society: India and Beyond (All 14 Chapters)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Click any chapter to tutor with AI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {NCERT_EXPLORING_SOCIETY_CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectExploringSocietyChapter(ch)}
                  className="text-left p-2 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500 hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Ch {ch.number}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {ch.theme.split(':')[0]}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate mt-0.5">
                    {ch.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {ch.topics}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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

              {/* Exploring Society Quick Tutor Highlight Card */}
              <div className="text-left rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      NCERT: Exploring Society — India and Beyond (Class 6 SST)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNcertDrawer(!showNcertDrawer)}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{showNcertDrawer ? 'Hide All 14 Ch' : 'View All 14 Ch'}</span>
                    {showNcertDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Select a chapter to begin an interactive AI tutoring session covering key concepts, exam terms, and practice questions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NCERT_EXPLORING_SOCIETY_CHAPTERS.slice(0, 4).map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectExploringSocietyChapter(ch)}
                      className="text-left p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500 text-xs transition-all hover:translate-x-0.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">Ch {ch.number}</span>
                        <span className="text-[9px] px-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium">Tutor</span>
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">{ch.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{ch.topics}</div>
                    </button>
                  ))}
                </div>
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

                            {/* Web Speech API: Text-to-Speech Read Aloud */}
                            <button
                              type="button"
                              onClick={() => handleToggleSpeak(msg.id, msg.content)}
                              className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-colors ${
                                speakingMessageId === msg.id
                                  ? 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-semibold'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                              }`}
                              title={speakingMessageId === msg.id ? 'Stop reading aloud' : 'Listen to explanation (Text-to-Speech)'}
                            >
                              {speakingMessageId === msg.id ? (
                                <>
                                  <VolumeX className="h-3 w-3 text-violet-600 dark:text-violet-400 animate-pulse" />
                                  <span className="text-[10px]">Stop Audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3 w-3" />
                                  <span className="text-[10px]">Listen</span>
                                </>
                              )}
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
          {/* Helper notice & Voice Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
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

              {/* Quick 'Speak to AI' trigger */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-400/40'
                    : 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 border border-violet-200/70 dark:border-violet-800/40'
                }`}
                title="Speak to AI — Hands-free voice speech recognition"
              >
                {isListening ? (
                  <MicOff className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )}
                <span>{isListening ? 'Listening...' : 'Speak to AI'}</span>
              </button>

              {/* Speech Recognition Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors"
                  title="Change voice recognition language"
                >
                  <Languages className="h-3 w-3 text-slate-400" />
                  <span>{getLanguageLabel()}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute bottom-full mb-1 left-0 z-30 w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl py-1 text-xs">
                    <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                      Speech Language
                    </div>
                    {SPEECH_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedSpeechLang(lang.code);
                          setShowLangMenu(false);
                          if (isListening && recognitionRef.current) {
                            try {
                              recognitionRef.current.lang = lang.code;
                            } catch {}
                          }
                          showNotification(`Switched voice recognition to ${lang.label}`);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          selectedSpeechLang === lang.code
                            ? 'font-bold text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/30'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {selectedSpeechLang === lang.code && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="hidden sm:inline">
              {isListening ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  Tip: Say &ldquo;send question&rdquo; to submit hands-free
                </span>
              ) : (
                'Enter to send · Shift+Enter for new line · Hands-free voice recognition'
              )}
            </span>
          </div>

          {/* Speech Error Banner */}
          {speechError && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-200 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Live Voice Recording Status Banner */}
          {isListening && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-xs shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Audio Waveform Equalizer */}
                <div className="flex items-center gap-0.5 h-3.5 shrink-0 px-1">
                  <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce [animation-duration:0.6s]" />
                  <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-duration:0.4s]" />
                  <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-bounce [animation-duration:0.5s]" />
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-duration:0.35s]" />
                  <span className="w-1 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-duration:0.7s]" />
                </div>

                <span className="font-bold shrink-0 text-rose-800 dark:text-rose-300">
                  Listening ({getLanguageLabel()}):
                </span>

                <span className="italic truncate text-rose-700 dark:text-rose-200">
                  {interimTranscript
                    ? `"${interimTranscript}"`
                    : inputText
                    ? `"${inputText.slice(-50)}..."`
                    : 'Speak your question clearly into your microphone...'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setInterimTranscript('');
                      showNotification('Cleared question input.');
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-white/70 dark:bg-rose-950/50 hover:bg-white text-[11px] font-semibold text-rose-700 dark:text-rose-300 transition-colors"
                    title="Clear input"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() && !interimTranscript.trim()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold shadow-xs transition-colors disabled:opacity-40"
                  title="Send question now"
                >
                  <Send className="h-3 w-3" />
                  <span>Ask AI</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleListening}
                  className="px-2.5 py-1 rounded-lg bg-rose-200 hover:bg-rose-300 dark:bg-rose-900/60 dark:hover:bg-rose-900 text-[11px] font-bold text-rose-900 dark:text-rose-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

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
              placeholder={
                isListening
                  ? `Listening... speak your question now in ${getLanguageLabel()}...`
                  : !isSpeechSupported
                  ? `Ask a question in ${conversation.subject} (${conversation.grade})...`
                  : `Ask a question in ${conversation.subject} (${conversation.grade}) or click Speak to AI...`
              }
              rows={2}
              className="flex-1 max-h-36 resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none"
            />

            {/* Browser-Native Web Speech API: 'Speak to AI' Microphone Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`flex h-10 items-center justify-center gap-1.5 px-3 rounded-xl font-bold text-xs shrink-0 transition-all shadow-xs cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/50 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/40'
              }`}
              title={
                !isSpeechSupported
                  ? 'Voice dictation is not supported in this browser (Use Chrome or Edge)'
                  : isListening
                  ? `Listening in ${getLanguageLabel()}... Click to stop or say "send question"`
                  : `Speak to AI — Hands-free voice recognition in ${getLanguageLabel()}`
              }
              aria-label="Speak to AI"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 animate-pulse" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="hidden sm:inline">Speak to AI</span>
                  <span className="sm:hidden">Speak</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputText.trim() && !interimTranscript.trim())}
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
