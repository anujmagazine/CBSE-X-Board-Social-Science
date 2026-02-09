
import React, { useState } from 'react';
import { Chapter, Question } from '../types';
import { generateAnswers } from '../services/geminiService';

interface QuestionDisplayProps {
  chapter: Chapter;
  questions: Question[];
  onBack: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ chapter, questions, onBack }) => {
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<Question[]>(questions);
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const getFormattedContent = () => {
    const header = `CHAPTER: ${chapter.name.toUpperCase()}\nSUBJECT: ${chapter.subject}\n2026 BOARD PREDICTED PAPER (STRICT PATTERN)\n------------------------------------------\n\n`;
    const body = questionsWithAnswers.map((q, i) => {
      let qText = `${i + 1}. [${q.type} - ${q.marks} MARKS]\n`;
      qText += `PROBABILITY: ${q.probability}%\n`;
      if (q.context) qText += `CONTEXT/PASSAGE:\n${q.context}\n`;
      qText += `QUESTION: ${q.text}\n`;
      if (q.type === 'MCQ' && q.options && q.options.length > 0) {
        qText += `OPTIONS:\n${q.options.map((opt, idx) => `   ${String.fromCharCode(65 + idx)}) ${opt}`).join('\n')}\n`;
      }
      qText += `EXAMINER HOTSPOT INSIGHT: ${q.insight}\n`;
      if (q.answer) qText += `MODEL ANSWER (2026 SCHEME):\n${q.answer}\n`;
      return qText + `\n------------------------------------------\n`;
    }).join('\n');
    return header + body;
  };

  const handleCopyText = () => {
    const content = getFormattedContent();
    navigator.clipboard.writeText(content);
    alert("Copied complete set for " + chapter.name + " to clipboard!");
  };

  const handleDownloadTxt = () => {
    const content = getFormattedContent();
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${chapter.name.replace(/\s+/g, '_')}_2026_Predictions.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGenerateAnswers = async () => {
    if (showAnswers) return;
    setIsGeneratingAnswers(true);
    try {
      const updated = await generateAnswers(chapter, questions);
      setQuestionsWithAnswers(updated);
      setShowAnswers(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate model answers. Please check your connection.");
    } finally {
      setIsGeneratingAnswers(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MCQ': return 'MCQ (COMPETENCY)';
      case 'VSA': return 'VSA (VERY SHORT)';
      case 'SA': return 'SA (SHORT)';
      case 'LA': return 'LA (LONG)';
      case 'CBQ': return 'CBQ (CASE-BASED)';
      case 'MAP': return 'MAP WORK';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Header */}
      <header className="bg-[#0a0f1e]/80 backdrop-blur-md text-white px-6 py-8 md:px-12 flex items-center justify-between border-b border-slate-800/50 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <p className="text-[#60a5fa] text-[10px] font-black uppercase tracking-widest">Hotspot Analysis Engine</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{chapter.name}</h2>
        </div>
        <button 
          onClick={onBack}
          className="bg-slate-800/50 hover:bg-slate-700/50 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12 space-y-10 pb-40">
        {questionsWithAnswers.map((q, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col gap-8 animate-in slide-in-from-bottom-6 duration-500">
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#eef2ff] text-[#4f46e5] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider">
                {getTypeLabel(q.type)} • {q.marks} MARKS
              </div>
              <div className="bg-[#fffbeb] text-[#d97706] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider">
                {q.probability}% PROBABLE
              </div>
            </div>

            {/* Question Section */}
            <div className="space-y-6">
              {q.context && (
                <div className="bg-[#f8fafc] p-8 rounded-3xl text-slate-700 text-sm leading-relaxed border-l-[6px] border-[#3b82f6]">
                  <div className="font-black text-[10px] uppercase tracking-widest text-[#3b82f6] mb-3">Source / Context Passage</div>
                  <div className="whitespace-pre-wrap">{q.context}</div>
                </div>
              )}
              
              <div className="flex gap-4">
                <span className="text-2xl font-black text-slate-300">Q{idx + 1}.</span>
                <p className="text-xl md:text-2xl font-bold text-[#1e293b] leading-[1.4]">
                  {q.text}
                </p>
              </div>
              
              {/* Options */}
              {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-white hover:border-[#8b5cf6] hover:bg-slate-50 transition-all group cursor-pointer">
                      <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#8b5cf6] group-hover:text-white transition-colors flex items-center justify-center font-black text-slate-500 text-sm">
                        {optionLabels[oIdx]}
                      </span>
                      <span className="text-slate-700 font-bold text-base">{opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Insight */}
            <div className="bg-[#faf5ff] p-6 rounded-3xl flex gap-5 items-start border border-[#f3e8ff]">
              <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl shrink-0">💡</div>
              <p className="text-[#6b21a8] text-sm italic font-semibold leading-relaxed">
                <span className="block font-black uppercase text-[10px] not-italic tracking-widest text-[#a855f7] mb-1">Examiner Hotspot Insight</span>
                {q.insight}
              </p>
            </div>

            {/* Answer */}
            {showAnswers && q.answer && (
              <div className="mt-2 p-10 bg-[#f0fdf4] rounded-[2.5rem] border border-[#dcfce7] animate-in fade-in zoom-in-95 duration-500 shadow-inner">
                <h4 className="text-[#15803d] font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full shadow-[0_0_8px_#16a34a]"></div>
                  2026 Model Answer & Marking Scheme
                </h4>
                <div className="text-slate-800 text-lg leading-[1.7] whitespace-pre-wrap font-medium">
                  {q.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-200 p-5 md:p-8 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={handleGenerateAnswers}
              disabled={isGeneratingAnswers}
              className={`flex-1 md:flex-none px-10 py-5 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-4 transition-all ${
                showAnswers 
                ? 'bg-[#818cf8] text-white cursor-default shadow-lg shadow-indigo-100' 
                : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:scale-105 shadow-[0_10px_25px_rgba(139,92,246,0.3)]'
              }`}
            >
              {isGeneratingAnswers ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-2xl">{showAnswers ? '✨' : '🔓'}</span>
              )}
              {showAnswers ? 'Model Answers Active' : 'Unlock Model Answers'}
            </button>
            
            <button className="hidden md:flex bg-slate-100 text-slate-700 px-8 py-5 rounded-[1.5rem] font-black text-sm items-center gap-3 hover:bg-slate-200 transition-all border border-slate-200/50">
              <span className="text-lg">+</span> Expand Question Bank
            </button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <div className="flex items-center gap-2 bg-slate-100/50 p-2 rounded-2xl border border-slate-200/50">
              <button 
                className="p-4 bg-white rounded-xl hover:bg-red-50 text-red-600 transition-colors shadow-sm" 
                title="Export PDF (Under Maintenance)"
                onClick={() => alert("PDF Module is currently being updated for 2026 formatting.")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </button>
              <button 
                onClick={handleDownloadTxt} 
                className="p-4 bg-white rounded-xl hover:bg-blue-50 text-blue-600 transition-colors shadow-sm" 
                title="Download TXT"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              <button 
                onClick={handleCopyText} 
                className="p-4 bg-white rounded-xl hover:bg-slate-200 text-slate-600 transition-colors shadow-sm" 
                title="Copy to Clipboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </button>
            </div>
            
            <div className="hidden lg:block w-[1px] h-8 bg-slate-200 mx-4"></div>
            
            <button 
              onClick={onBack}
              className="px-12 py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-sm hover:bg-black transition-all shadow-xl"
            >
              Finish Review
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuestionDisplay;
