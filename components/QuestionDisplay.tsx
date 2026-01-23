
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
    const header = `CHAPTER: ${chapter.name.toUpperCase()}\n2026 BOARD PREDICTED PAPER - HOTSPOT ANALYSIS\n------------------------------------------\n\n`;
    const body = questionsWithAnswers.map((q, i) => {
      let qText = `${i + 1}. [${q.type.replace('_', ' ')} - ${q.marks} MARKS]\n`;
      qText += `PROBABILITY: ${q.probability}%\n`;
      if (q.context) qText += `CONTEXT: ${q.context}\n`;
      qText += `QUESTION: ${q.text}\n`;
      qText += `EXAMINER INSIGHT: ${q.insight}\n`;
      if (q.answer) qText += `MODEL ANSWER:\n${q.answer}\n`;
      return qText + `\n------------------------------------------\n`;
    }).join('\n');
    return header + body;
  };

  const handleCopyText = () => {
    const content = getFormattedContent();
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard with Chapter Name!");
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
      alert("Failed to generate answers. Please try again.");
    } finally {
      setIsGeneratingAnswers(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Header */}
      <header className="bg-[#0a0f1e] text-white px-6 py-8 md:px-12 flex items-center justify-between border-b border-slate-800/50 sticky top-0 z-20">
        <div>
          <p className="text-[#60a5fa] text-[10px] font-black uppercase tracking-widest mb-1">Hotspot Analysis Engine</p>
          <h2 className="text-2xl md:text-3xl font-extrabold">{chapter.name}</h2>
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
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12 space-y-8 pb-32">
        {questionsWithAnswers.map((q, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-slate-100 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Top Row: Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-[#eef2ff] text-[#4f46e5] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {q.type.replace('_', ' ')} ANSWER • {q.marks} MARKS
              </div>
              <div className="bg-[#fffbeb] text-[#d97706] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {q.probability}% PROBABLE
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              {q.context && (
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed italic border-l-4 border-slate-200">
                  {q.context}
                </div>
              )}
              <p className="text-xl md:text-2xl font-extrabold text-[#1e293b] leading-tight">
                {q.text}
              </p>
            </div>

            {/* Insight (Bulb) */}
            <div className="bg-[#f8fafc] p-5 rounded-2xl flex gap-4 items-start border border-slate-100">
              <span className="text-xl">💡</span>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed">
                {q.insight}
              </p>
            </div>

            {/* Answer (if generated) */}
            {showAnswers && q.answer && (
              <div className="mt-4 p-8 bg-[#f0fdf4] rounded-[2rem] border border-[#dcfce7] animate-in fade-in zoom-in-95 duration-500">
                <h4 className="text-[#15803d] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#16a34a] rounded-full"></div>
                  CBSE 2026 Model Answer Points
                </h4>
                <div className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {q.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Footer Actions Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleGenerateAnswers}
              disabled={isGeneratingAnswers}
              className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                showAnswers 
                ? 'bg-[#818cf8] text-white cursor-default' 
                : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:scale-105 shadow-lg shadow-purple-200'
              }`}
            >
              {isGeneratingAnswers ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-lg">🔓</span>
              )}
              {showAnswers ? 'Model Answers Unlocked' : 'Unlock Model Answers'}
            </button>
            
            <button className="hidden md:flex bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-black text-sm items-center gap-2 hover:bg-slate-200 transition-all">
              <span>+</span> Expand Set
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            <button 
              className="p-3 bg-slate-50 rounded-xl hover:bg-red-50 text-red-600 transition-colors" 
              title="Export PDF (Coming Soon)"
              onClick={() => alert("PDF export integration in progress.")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </button>
            <button 
              onClick={handleDownloadTxt} 
              className="p-3 bg-slate-50 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors" 
              title="Download TXT"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
            <button onClick={handleCopyText} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors" title="Copy to Clipboard">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 mx-2 hidden md:block"></div>
            <button 
              onClick={onBack}
              className="px-8 py-4 bg-[#1e293b] text-white rounded-2xl font-black text-sm hover:bg-[#0f172a] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuestionDisplay;
