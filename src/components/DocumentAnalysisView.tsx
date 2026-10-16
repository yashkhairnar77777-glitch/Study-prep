import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  X,
  Send,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  HelpCircle,
} from 'lucide-react';
import { GradeLevel, SubjectCategory, UserProfile } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { api, ChatResponseData } from '../lib/api';

interface DocumentAnalysisViewProps {
  profile: UserProfile;
}

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({ profile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(1);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: ChatResponseData; timestamp: number }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (uploadedFile: File) => {
    if (uploadedFile.size > 8 * 1024 * 1024) {
      setParseError('Document exceeds 8MB size limit.');
      return;
    }

    setFile(uploadedFile);
    setIsParsing(true);
    setParseError(null);
    setExtractedText('');
    setChatHistory([]);

    try {
      if (
        uploadedFile.type === 'text/plain' ||
        uploadedFile.name.endsWith('.txt') ||
        uploadedFile.name.endsWith('.md') ||
        uploadedFile.name.endsWith('.json') ||
        uploadedFile.name.endsWith('.csv')
      ) {
        const text = await uploadedFile.text();
        if (!text.trim()) {
          throw new Error('The text file appears to be completely empty.');
        }
        setExtractedText(text);
        setPageCount(Math.max(1, Math.ceil(text.length / 2500)));
      } else if (
        uploadedFile.type === 'application/pdf' ||
        uploadedFile.name.endsWith('.pdf')
      ) {
        const pdfjs = await import('pdfjs-dist');
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await uploadedFile.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        setPageCount(pdf.numPages);
        let fullText = '';
        const maxPagesToExtract = Math.min(pdf.numPages, 30);

        for (let i = 1; i <= maxPagesToExtract; i++) {
          const page = await pdf.getPage(i);
          const tokenized = await page.getTextContent();
          const pageText = tokenized.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
          if (pageText.trim()) {
            fullText += `\n[--- Page ${i} ---]\n` + pageText + '\n';
          }
        }

        if (!fullText.trim()) {
          throw new Error(
            'This PDF appears to be a scanned image without embedded digital text. Please use our Photo Question Solver to snapshot individual pages for OCR analysis.'
          );
        }

        setExtractedText(fullText.trim());
      } else {
        throw new Error(
          'Unsupported file format. Please upload a PDF (.pdf), Markdown (.md), or plain text document (.txt).'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse document';
      setParseError(msg);
      setExtractedText('');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) processFile(uploadedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleClearDoc = () => {
    setFile(null);
    setExtractedText('');
    setChatHistory([]);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAskQuestion = async () => {
    if (!extractedText || !questionInput.trim() || isAsking) return;

    const currentQ = questionInput.trim();
    setQuestionInput('');
    setIsAsking(true);

    try {
      const res = await api.analyzeDocument({
        documentTitle: file?.name || 'Study Document',
        documentContent: extractedText,
        question: currentQ,
        grade: profile.grade,
        subject: profile.primarySubject,
      });

      setChatHistory(prev => [
        ...prev,
        {
          question: currentQ,
          answer: res,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setParseError(msg);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Title */}
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" />
            <span>Document Grounding & Extraction</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            PDF & Document Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload textbook chapters, syllabi, lecture notes, or research papers.
            Ask targeted questions grounded strictly in the document text with page references.
          </p>
        </div>

        {/* Upload Card */}
        <div className="clay-card p-6 rounded-3xl space-y-4">
          {!file ? (
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-violet-400 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 mb-3 shadow-xs">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Drag & drop or browse study document
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF (.pdf), Markdown (.md), and plain text (.txt) up to 8MB
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <span aria-hidden="true">·</span>
                    <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {extractedText.length.toLocaleString()} characters indexed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={handleClearDoc}
                  className="rounded-xl bg-rose-50 dark:bg-rose-950/60 p-2 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Loading Parsing State */}
          {isParsing && (
            <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Extracting and indexing text from document pages...</span>
            </div>
          )}

          {/* Error Banner */}
          {parseError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Q&A Section when text is extracted */}
        {extractedText && (
          <div className="space-y-6 animate-in fade-in">
            {/* Ask Question Composer */}
            <div className="clay-card p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Search className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Ask a question about this document</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={e => setQuestionInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAskQuestion();
                  }}
                  placeholder="e.g. Summarize Section 3.2 or What are the primary formulas listed on page 4?"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                />

                <button
                  type="button"
                  onClick={handleAskQuestion}
                  disabled={isAsking || !questionInput.trim()}
                  className="clay-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-40 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </div>

              {/* Starter questions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Summarize the core takeaways in 3 bullet points.',
                  'List all key formulas and definitions.',
                  'Generate 3 practice exam questions from this document.',
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuestionInput(s);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Q&A History */}
            {chatHistory.length > 0 && (
              <div className="space-y-4">
                {chatHistory.map((item, idx) => (
                  <div key={idx} className="clay-card p-6 rounded-3xl space-y-3">
                    <div className="text-xs font-bold text-violet-600 dark:text-violet-400">
                      Q: {item.question}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                      <MarkdownRenderer content={item.answer.content} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
