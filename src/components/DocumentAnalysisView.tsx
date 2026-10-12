import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  X,
  Send,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Search,
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
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: ChatResponseData; timestamp: number }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse text or PDF document
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate size (max 8MB)
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
        // Parse PDF using pdfjs-dist
        const pdfjs = await import('pdfjs-dist');
        // Set worker source to CDN or reliable build
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await uploadedFile.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        setPageCount(pdf.numPages);
        let fullText = '';
        const maxPagesToExtract = Math.min(pdf.numPages, 30); // reasonable cap

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
            'This PDF appears to be a scanned image without embedded digital text. Please use our Photo Question Solver to snapshot individual pages for visual OCR analysis.'
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
    <div className="h-full overflow-y-auto bg-transparent text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Title */}
        <div className="border-b border-slate-200/60 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <FileText className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Document Grounding
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            PDF & Study Material Analysis
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload course syllabi, lecture notes, textbook chapters, or research papers.
            Ask targeted questions grounded strictly in the supplied text with page references.
          </p>
        </div>

        {/* Upload Card */}
        <div className="clay-card p-6 rounded-3xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-850 p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Choose PDF or text document to analyze
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, TXT, MD up to 8MB (digital text extraction)
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 truncate max-w-sm">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <span>·</span>
                    <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                    <span>·</span>
                    <span className="text-emerald-400">
                      {extractedText.length.toLocaleString()} chars parsed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={handleClearDoc}
                  className="rounded-lg bg-rose-900/60 p-1.5 text-rose-300 hover:bg-rose-800"
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
        </div>

        {/* Parsing Progress / Warning */}
        {isParsing && (
          <div className="rounded-xl border border-indigo-800/60 bg-indigo-950/40 p-4 flex items-center gap-3 text-xs text-indigo-300">
            <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span>Extracting document text and organizing sections...</span>
          </div>
        )}

        {parseError && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/60 p-4 flex items-start gap-3 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-100">Document Processing Notice:</p>
              <p className="mt-1">{parseError}</p>
            </div>
          </div>
        )}

        {/* Q&A Workspace when document is ready */}
        {extractedText && (
          <div className="space-y-6">
            {/* Quick Preview snippet */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Document Excerpt Preview:
              </span>
              <p className="line-clamp-3 font-mono leading-relaxed">
                {extractedText.slice(0, 350)}...
              </p>
            </div>

            {/* Q&A Feed */}
            {chatHistory.length > 0 && (
              <div className="space-y-4">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                      <Search className="h-4 w-4" />
                      <span>{item.question}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50 text-sm leading-relaxed text-slate-200">
                      <MarkdownRenderer content={item.answer.content} />
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      Grounded via {item.answer.providerUsed} ({item.answer.modelUsed})
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Composer */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3 shadow-inner">
              <div className="flex items-end gap-2">
                <textarea
                  value={questionInput}
                  onChange={e => setQuestionInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskQuestion();
                    }
                  }}
                  placeholder="Ask any question grounded in this document (e.g. 'Summarize Section 3' or 'What formulas are introduced?')..."
                  rows={2}
                  className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />

                <button
                  type="button"
                  onClick={handleAskQuestion}
                  disabled={isAsking || !questionInput.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition-all active:scale-95"
                >
                  {isAsking ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
