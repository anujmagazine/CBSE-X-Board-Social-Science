
import React, { useState } from 'react';
import { CHAPTERS } from './constants';
import { Chapter, Question } from './types';
import ChapterCard from './components/ChapterCard';
import QuestionDisplay from './components/QuestionDisplay';
import { generateQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetPredictions = async (chapter: Chapter) => {
    setIsLoading(true);
    try {
      const result = await generateQuestions(chapter);
      setQuestions(result);
      setSelectedChapter(chapter);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      alert("Failed to predict questions. Check your API key or connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1e] text-white p-12">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-slate-800 rounded-full"></div>
          <div className="w-24 h-24 border-8 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h2 className="text-3xl font-black mt-12 mb-4">Hotspot Analysis Engine</h2>
        <p className="text-slate-400 text-lg text-center max-w-md font-medium animate-pulse">
          Synthesizing 5-year trends & 2026 CBSE curriculum for "{CHAPTERS.find(c => true)?.name}"...
        </p>
      </div>
    );
  }

  if (selectedChapter) {
    return (
      <QuestionDisplay 
        chapter={selectedChapter} 
        questions={questions} 
        onBack={() => {
          setSelectedChapter(null);
          setQuestions([]);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0f172a]">
      {/* Header Section */}
      <header className="px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-300 mb-6 shadow-xl">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              2026 HOTSPOT ANALYSIS ACTIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
              Class X Board <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Social Science</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
              Master your 2026 board exam with AI predictions, marking scheme analysis, and model 100% score answers.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 p-6 rounded-[2.5rem] min-w-[140px] text-center shadow-2xl">
              <div className="text-4xl font-black text-white">22</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Units</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {(['HISTORY', 'GEOGRAPHY', 'CIVICS', 'ECONOMICS'] as const).map(subject => (
          <div key={subject} className="mb-20">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">{subject}</h2>
              <div className="h-[1px] w-full bg-slate-800/50"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CHAPTERS.filter(ch => ch.subject === subject).map(chapter => (
                <ChapterCard 
                  key={chapter.id} 
                  chapter={chapter} 
                  onClick={handleGetPredictions}
                />
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Floating Footer Stats */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex items-center gap-8 md:gap-12">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Analysis Mode: Predictive 2026</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-700"></div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Source: <span className="text-purple-400">CBSE Marking Scheme v3.1</span>
        </div>
      </div>
    </div>
  );
};

export default App;
