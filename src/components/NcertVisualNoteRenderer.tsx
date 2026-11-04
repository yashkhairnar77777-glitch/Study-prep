import React, { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  BookOpen,
  Lightbulb,
  Award,
  Sparkles,
  Compass,
  Clock,
  CheckCircle2,
  Layers,
  Globe,
  FileText,
  Check,
  Copy,
  Download,
  Flame,
  ArrowRight,
  Tag,
  Zap,
  Printer,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
} from 'lucide-react';
import { SubjectCategory } from '../types';

interface NcertVisualNoteRendererProps {
  title: string;
  content: string;
  subject?: SubjectCategory | string;
  tags?: string[];
  createdAt?: number;
  className?: string;
  onOpenEdit?: () => void;
}

interface VisualSection {
  id: string;
  number?: string;
  title: string;
  type: 'concept' | 'definition' | 'did_you_know' | 'exam_tip' | 'formula' | 'comparison' | 'general';
  points: VisualPoint[];
  rawText: string;
}

interface VisualPoint {
  term?: string;
  body: string;
  isFormula?: boolean;
  isImportant?: boolean;
}

export const NcertVisualNoteRenderer: React.FC<NcertVisualNoteRendererProps> = ({
  title,
  content,
  subject = 'History & Social Studies',
  tags = [],
  createdAt,
  className = '',
  onOpenEdit,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'concepts' | 'ncert_boxes' | 'formulas' | 'exam_tips'>('all');
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Helper to format inline math with KaTeX
  const renderMathAndText = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={idx}
              className="my-3 overflow-x-auto py-2 text-center text-slate-900 dark:text-indigo-200 font-semibold"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={idx} className="font-mono text-xs">{part}</pre>;
        }
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-math mx-0.5 text-slate-900 dark:text-indigo-300 font-bold"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="font-mono text-xs">{part}</span>;
        }
      }

      // Inline code and formatting
      const tokens = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <span key={idx}>
          {tokens.map((token, ti) => {
            if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
              return (
                <code
                  key={ti}
                  className="rounded bg-slate-200/90 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[0.85em] font-bold text-slate-800 dark:text-violet-300 border border-slate-300/60 dark:border-white/10"
                >
                  {token.slice(1, -1)}
                </code>
              );
            }
            if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
              const inner = token.slice(2, -2);
              return highlightKeywords ? (
                <mark
                  key={ti}
                  className="bg-amber-100/90 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 px-1 py-0.5 rounded font-black border-b border-amber-400 dark:border-amber-500/40"
                >
                  {inner}
                </mark>
              ) : (
                <strong key={ti} className="font-extrabold text-slate-950 dark:text-white">
                  {inner}
                </strong>
              );
            }
            return token;
          })}
        </span>
      );
    });
  };

  // Structured parse of markdown content into visual NCERT sections
  const parsedData = useMemo(() => {
    const rawLines = content.split('\n');
    const sections: VisualSection[] = [];
    const extractedKeywords: Set<string> = new Set();
    const ncertBoxes: { title: string; body: string; type: 'did_you_know' | 'exam_tip' | 'formula' | 'definition' }[] = [];

    let currentSection: VisualSection | null = null;

    const pushCurrentSection = () => {
      if (currentSection) {
        if (currentSection.points.length > 0 || currentSection.rawText.trim().length > 0) {
          sections.push(currentSection);
        }
        currentSection = null;
      }
    };

    rawLines.forEach(line => {
      const trimmed = line.trim();

      // Heading 2 or 3
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        pushCurrentSection();
        const headerText = trimmed.replace(/^###?\s+/, '').replace(/\*\*/g, '');
        
        // Extract section number if present
        const numMatch = headerText.match(/^(\d+[\.\)]|\bTheme\s+[A-Z]:?)\s*(.*)/i);
        const sectionNum = numMatch ? numMatch[1] : undefined;
        const cleanTitle = numMatch ? numMatch[2] : headerText;

        // Classify section
        let secType: VisualSection['type'] = 'concept';
        const lower = cleanTitle.toLowerCase();
        if (lower.includes('definition') || lower.includes('terminology')) secType = 'definition';
        else if (lower.includes('did you know') || lower.includes('fact')) secType = 'did_you_know';
        else if (lower.includes('exam') || lower.includes('pitfall') || lower.includes('tip')) secType = 'exam_tip';
        else if (lower.includes('formula') || lower.includes('equation') || lower.includes('law')) secType = 'formula';
        else if (lower.includes('comparison') || lower.includes(' vs ') || lower.includes('difference')) secType = 'comparison';

        currentSection = {
          id: `sec-${sections.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          number: sectionNum,
          title: cleanTitle,
          type: secType,
          points: [],
          rawText: '',
        };
        return;
      }

      // Check for NCERT callout blocks: > [!DID-YOU-KNOW] or > [!EXAM-TIP] etc.
      if (trimmed.startsWith('> [!DID-YOU-KNOW]') || trimmed.toLowerCase().includes('did you know')) {
        ncertBoxes.push({
          title: 'Did You Know? (NCERT Capsule)',
          body: trimmed.replace(/^>\s*(\[!DID-YOU-KNOW\])?/i, '').trim(),
          type: 'did_you_know',
        });
        return;
      }

      if (trimmed.startsWith('> [!EXAM-TIP]') || trimmed.toLowerCase().includes('exam tip')) {
        ncertBoxes.push({
          title: 'NCERT Board Exam Pointer',
          body: trimmed.replace(/^>\s*(\[!EXAM-TIP\])?/i, '').trim(),
          type: 'exam_tip',
        });
        return;
      }

      // Bullets with Key Terms: - **Term**: Explanation
      const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
      if (bulletMatch) {
        const bodyContent = bulletMatch[1];
        const termMatch = bodyContent.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);

        if (termMatch) {
          const term = termMatch[1].trim();
          const rest = termMatch[2].trim();
          extractedKeywords.add(term);

          if (!currentSection) {
            currentSection = {
              id: `sec-default-${Date.now()}`,
              title: 'Key Concepts & Definitions',
              type: 'concept',
              points: [],
              rawText: '',
            };
          }

          currentSection.points.push({
            term,
            body: rest,
            isFormula: rest.includes('$'),
            isImportant: true,
          });
          return;
        }

        if (!currentSection) {
          currentSection = {
            id: `sec-default-${Date.now()}`,
            title: 'Core Topics',
            type: 'concept',
            points: [],
            rawText: '',
          };
        }

        currentSection.points.push({
          body: bodyContent,
          isFormula: bodyContent.includes('$'),
        });
        return;
      }

      // Regular text or subheadings
      if (currentSection && trimmed.length > 0 && !trimmed.startsWith('---')) {
        currentSection.rawText += (currentSection.rawText ? '\n' : '') + trimmed;
      }
    });

    pushCurrentSection();

    return {
      sections,
      keywords: Array.from(extractedKeywords).slice(0, 14),
      ncertBoxes,
    };
  }, [content]);

  // Color schemes for section cards
  const getSectionColor = (type: VisualSection['type'], index: number) => {
    switch (type) {
      case 'definition':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
          card: 'border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
          dot: 'bg-amber-500',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      case 'did_you_know':
        return {
          badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/50',
          card: 'border-l-4 border-l-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20',
          dot: 'bg-cyan-500',
          iconColor: 'text-cyan-600 dark:text-cyan-400',
        };
      case 'exam_tip':
        return {
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700/50',
          card: 'border-l-4 border-l-purple-500 bg-purple-50/40 dark:bg-purple-950/20',
          dot: 'bg-purple-500',
          iconColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'formula':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700/50',
          card: 'border-l-4 border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/20',
          dot: 'bg-rose-500',
          iconColor: 'text-rose-600 dark:text-rose-400',
        };
      case 'comparison':
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
          card: 'border-l-4 border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
          dot: 'bg-emerald-500',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      default: {
        const palette = [
          {
            badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50',
            card: 'border-l-4 border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20',
            dot: 'bg-indigo-500',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
          },
          {
            badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 border-violet-300 dark:border-violet-700/50',
            card: 'border-l-4 border-l-violet-500 bg-violet-50/30 dark:bg-violet-950/20',
            dot: 'bg-violet-500',
            iconColor: 'text-violet-600 dark:text-violet-400',
          },
          {
            badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700/50',
            card: 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20',
            dot: 'bg-blue-500',
            iconColor: 'text-blue-600 dark:text-blue-400',
          },
          {
            badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-700/50',
            card: 'border-l-4 border-l-teal-500 bg-teal-50/30 dark:bg-teal-950/20',
            dot: 'bg-teal-500',
            iconColor: 'text-teal-600 dark:text-teal-400',
          },
        ];
        return palette[index % palette.length];
      }
    }
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter sections
  const filteredSections = parsedData.sections.filter(sec => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'concepts') return sec.type === 'concept';
    if (activeFilter === 'ncert_boxes') return sec.type === 'did_you_know' || sec.type === 'definition';
    if (activeFilter === 'formulas') return sec.type === 'formula' || sec.points.some(p => p.isFormula);
    if (activeFilter === 'exam_tips') return sec.type === 'exam_tip';
    return true;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. VISUAL NCERT POSTER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#101b38] to-[#1e1b4b] text-white p-6 sm:p-8 border border-white/10 shadow-lg">
        {/* Decorative graphic background glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NCERT Visual Study Sheet</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-xs">
                {subject}
              </span>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHighlightKeywords(!highlightKeywords)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  highlightKeywords
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
                title="Toggle highlighted key points"
              >
                <span>🎨 Highlights {highlightKeywords ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyNote}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {onOpenEdit && (
                <button
                  type="button"
                  onClick={onOpenEdit}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Curriculum-aligned textbook breakdown with high-yield definition cards, visual formulas, and color-coded key terms.
            </p>
          </div>

          {/* Key Vocabulary Chip Row */}
          {parsedData.keywords.length > 0 && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" />
                <span>NCERT Key Terms:</span>
              </span>
              {parsedData.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. FILTER & VIEW CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] mr-1">Display Focus:</span>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Modules ({parsedData.sections.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('concepts')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'concepts'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Core Concepts
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('ncert_boxes')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'ncert_boxes'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            📖 NCERT Boxes
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('formulas')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'formulas'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            ⚡ Formulas & Math
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          {filteredSections.length} visual section{filteredSections.length !== 1 ? 's' : ''} shown
        </div>
      </div>

      {/* 3. VISUAL SECTIONS MESH */}
      <div className="space-y-6">
        {filteredSections.map((sec, idx) => {
          const color = getSectionColor(sec.type, idx);

          return (
            <div
              key={sec.id}
              className={`clay-card p-5 sm:p-7 rounded-3xl space-y-4 border transition-all ${color.card} border-slate-200/80 dark:border-white/10`}
            >
              {/* Section Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  {sec.number ? (
                    <div
                      className={`w-8 h-8 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 ${color.badge}`}
                    >
                      {sec.number.replace(/\D/g, '') || sec.number}
                    </div>
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${color.dot} shrink-0`} />
                  )}

                  <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {sec.title}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${color.badge}`}
                >
                  {sec.type === 'definition'
                    ? '📖 NCERT Definition'
                    : sec.type === 'did_you_know'
                    ? '💡 Did You Know?'
                    : sec.type === 'formula'
                    ? '⚡ Governing Law / Formula'
                    : sec.type === 'exam_tip'
                    ? '🎯 Exam Pointer'
                    : sec.type === 'comparison'
                    ? '⚖️ Comparison Matrix'
                    : 'NCERT Core Pillar'}
                </span>
              </div>

              {/* General Descriptive text if present */}
              {sec.rawText && (
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  {renderMathAndText(sec.rawText)}
                </div>
              )}

              {/* Point Cards Grid */}
              {sec.points.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {sec.points.map((pt, pIdx) => {
                    return (
                      <div
                        key={pIdx}
                        className={`p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border transition-all hover:shadow-sm ${
                          pt.isFormula
                            ? 'border-rose-300/80 dark:border-rose-700/50 bg-rose-50/30 dark:bg-rose-950/20'
                            : pt.term
                            ? 'border-slate-200/80 dark:border-white/10 hover:border-violet-500/40'
                            : 'border-slate-200/60 dark:border-white/5'
                        } flex flex-col justify-between space-y-2`}
                      >
                        <div>
                          {pt.term ? (
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0" />
                              <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {pt.term}
                              </h4>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Key Takeaway</span>
                            </div>
                          )}

                          <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                            {renderMathAndText(pt.body)}
                          </div>
                        </div>

                        {pt.isFormula && (
                          <div className="pt-1 flex items-center gap-1 text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                            <Zap className="w-3 h-3" />
                            <span>Formula Equation</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. NCERT OFFICIAL CALLOUT CAPSULES SECTION */}
      {parsedData.ncertBoxes.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              NCERT Textbook Callout Capsules
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedData.ncertBoxes.map((box, bIdx) => (
              <div
                key={bIdx}
                className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300/80 dark:border-amber-700/50 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{box.title}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {renderMathAndText(box.body)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FOOTER PRINT & QUICK REVISION BADGE */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>NCERT Curriculum Alignment: High-yield concepts verified for school examinations</span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-violet-500 font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF Visual Sheet</span>
        </button>
      </div>
    </div>
  );
};
