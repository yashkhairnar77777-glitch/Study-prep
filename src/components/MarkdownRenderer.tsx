import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to format inline markdown like **bold**, *italic*, and `code`
  const renderInlineFormattedText = (text: string) => {
    // Tokenize by inline code `...`, bold **...**, italic *...*
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        return (
          <code
            key={i}
            className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-slate-900 dark:text-violet-300 border border-slate-300/60 dark:border-white/10"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        return (
          <strong key={i} className="font-extrabold text-slate-950 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
        return (
          <em key={i} className="italic text-slate-900 dark:text-slate-200">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  // Render text containing KaTeX equations ($...$ inline or $$...$$ block)
  const renderMathAndText = (rawText: string) => {
    // Process block math $$...$$ first, then inline $...$
    const parts = rawText.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={idx}
              className="my-3 overflow-x-auto py-2 text-center text-slate-950 dark:text-indigo-200 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <pre key={idx} className="font-mono text-sm text-slate-900 dark:text-slate-100">
              {part}
            </pre>
          );
        }
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-math mx-0.5 text-slate-950 dark:text-indigo-300 font-semibold"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={idx} className="font-mono text-xs text-slate-900 dark:text-slate-100">
              {part}
            </span>
          );
        }
      }
      return <React.Fragment key={idx}>{renderInlineFormattedText(part)}</React.Fragment>;
    });
  };

  // Robust Markdown parser for academic notes, formula sheets, questions, and explanations
  const parsedBlocks = useMemo(() => {
    const lines = content.split('\n');
    const blocks: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (!listBuffer) return;
      const { type, items } = listBuffer;
      const Tag = type;
      blocks.push(
        <Tag
          key={`list-${blocks.length}`}
          className={`my-3 space-y-1.5 pl-5 ${
            type === 'ol' ? 'list-decimal' : 'list-disc'
          } text-slate-900 dark:text-slate-100`}
        >
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed text-slate-900 dark:text-slate-100">
              {renderMathAndText(item)}
            </li>
          ))}
        </Tag>
      );
      listBuffer = null;
    };

    lines.forEach((line, idx) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          const codeString = codeBuffer.join('\n');
          const isCopied = copiedCode === codeString;
          blocks.push(
            <div
              key={`code-${idx}`}
              className="group relative my-3 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700/70 bg-slate-950 font-mono text-xs shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3.5 py-1.5 text-slate-300">
                <span className="font-medium tracking-wide uppercase">
                  {codeLanguage || 'code'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeString)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-3.5 text-slate-100 leading-relaxed font-mono">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeBuffer = [];
          codeLanguage = '';
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim();
          codeBuffer = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Block math equation on its own line
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 3) {
        flushList();
        blocks.push(
          <div key={`math-${idx}`} className="my-2">
            {renderMathAndText(line.trim())}
          </div>
        );
        return;
      }

      // Unordered list
      const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (ulMatch) {
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList();
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(ulMatch[2]);
        return;
      }

      // Ordered list
      const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (olMatch) {
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList();
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(olMatch[2]);
        return;
      }

      flushList();

      // Blank line
      if (!line.trim()) {
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        blocks.push(
          <h3
            key={`h3-${idx}`}
            className="mt-4 mb-2 text-base font-bold text-slate-900 dark:text-white font-display"
          >
            {renderMathAndText(line.slice(4))}
          </h3>
        );
        return;
      }
      if (line.startsWith('## ')) {
        blocks.push(
          <h2
            key={`h2-${idx}`}
            className="mt-5 mb-2.5 text-lg font-extrabold text-slate-900 dark:text-white font-display border-b border-slate-200 dark:border-slate-800 pb-1"
          >
            {renderMathAndText(line.slice(3))}
          </h2>
        );
        return;
      }
      if (line.startsWith('# ')) {
        blocks.push(
          <h1
            key={`h1-${idx}`}
            className="mt-6 mb-3 text-xl font-black text-slate-900 dark:text-white font-display"
          >
            {renderMathAndText(line.slice(2))}
          </h1>
        );
        return;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        blocks.push(
          <blockquote
            key={`bq-${idx}`}
            className="my-3 rounded-xl border-l-4 border-violet-500 bg-slate-100/80 dark:bg-slate-800/50 px-4 py-2.5 text-sm italic text-slate-900 dark:text-slate-100"
          >
            {renderMathAndText(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Regular paragraph
      blocks.push(
        <p key={`p-${idx}`} className="my-2.5 leading-relaxed text-slate-900 dark:text-slate-100 font-normal">
          {renderMathAndText(line)}
        </p>
      );
    });

    flushList();
    return blocks;
  }, [content, copiedCode]);

  return (
    <div
      className={`text-sm md:text-base leading-relaxed text-slate-900 dark:text-slate-100 ${className}`}
    >
      {parsedBlocks}
    </div>
  );
};
