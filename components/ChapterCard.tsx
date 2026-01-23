
import React from 'react';
import { Chapter, Subject } from '../types';
import { SUBJECT_COLORS } from '../constants';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: (chapter: Chapter) => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick }) => {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl">
      <div className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wider mb-6 ${SUBJECT_COLORS[chapter.subject]}`}>
        {chapter.subject} • CH{chapter.chapterNumber}
      </div>
      <h3 className="text-slate-900 text-2xl font-bold mb-8 leading-tight min-h-[4rem] flex items-center">
        {chapter.name}
      </h3>
      <button
        onClick={() => onClick(chapter)}
        className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
      >
        <span className="text-yellow-400">⚡</span>
        Get Predictions
      </button>
    </div>
  );
};

export default ChapterCard;
