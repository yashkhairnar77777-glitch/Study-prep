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
              className="my-3 overflow-x-auto py-2 text-center text-indigo-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={idx} className="font-mono text-sm">{part}</pre>;
        }
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-math mx-0.5 text-indigo-300"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="font-mono text-xs">{part}</span>;
        }
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  // Simple, robust Markdown parser for academic and tutoring responses
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
          className={`my-3 space-y-1 pl-5 ${
            type === 'ol' ? 'list-decimal' : 'list-disc'
          } text-slate-300`}
        >
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
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
              className="group relative my-3 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-slate-400">
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
              <pre className="overflow-x-auto p-3.5 text-slate-200 leading-relaxed">
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
            className="mt-4 mb-2 text-base font-semibold text-slate-100 font-display"
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
            className="mt-5 mb-2.5 text-lg font-bold text-slate-100 font-display border-b border-slate-800 pb-1"
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
            className="mt-6 mb-3 text-xl font-bold text-slate-100 font-display"
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
            className="my-3 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-2.5 text-sm italic text-slate-300"
          >
            {renderMathAndText(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Regular paragraph
      blocks.push(
        <p key={`p-${idx}`} className="my-2 leading-relaxed text-slate-200">
          {renderMathAndText(line)}
        </p>
      );
    });

    flushList();
    return blocks;
  }, [content, copiedCode]);

  return <div className={`text-sm md:text-base leading-relaxed ${className}`}>{parsedBlocks}</div>;
};
