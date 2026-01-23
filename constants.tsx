
import { Chapter } from './types';

export const CHAPTERS: Chapter[] = [
  // History
  { id: 'h1', name: 'The Rise of Nationalism in Europe', subject: 'HISTORY', chapterNumber: 1 },
  { id: 'h2', name: 'Nationalism in India', subject: 'HISTORY', chapterNumber: 2 },
  { id: 'h3', name: 'The Making of a Global World', subject: 'HISTORY', chapterNumber: 3 },
  { id: 'h4', name: 'The Age of Industrialization', subject: 'HISTORY', chapterNumber: 4 },
  { id: 'h5', name: 'Print Culture and the Modern World', subject: 'HISTORY', chapterNumber: 5 },
  
  // Geography
  { id: 'g1', name: 'Resources and Development', subject: 'GEOGRAPHY', chapterNumber: 1 },
  { id: 'g2', name: 'Forest and Wildlife Resources', subject: 'GEOGRAPHY', chapterNumber: 2 },
  { id: 'g3', name: 'Water Resources', subject: 'GEOGRAPHY', chapterNumber: 3 },
  { id: 'g4', name: 'Agriculture', subject: 'GEOGRAPHY', chapterNumber: 4 },
  { id: 'g5', name: 'Minerals and Energy Resources', subject: 'GEOGRAPHY', chapterNumber: 5 },
  { id: 'g6', name: 'Manufacturing Industries', subject: 'GEOGRAPHY', chapterNumber: 6 },
  { id: 'g7', name: 'Lifelines of National Economy', subject: 'GEOGRAPHY', chapterNumber: 7 },

  // Civics
  { id: 'c1', name: 'Power Sharing', subject: 'CIVICS', chapterNumber: 1 },
  { id: 'c2', name: 'Federalism', subject: 'CIVICS', chapterNumber: 2 },
  { id: 'c3', name: 'Gender, Religion and Caste', subject: 'CIVICS', chapterNumber: 3 },
  { id: 'c4', name: 'Political Parties', subject: 'CIVICS', chapterNumber: 4 },
  { id: 'c5', name: 'Outcomes of Democracy', subject: 'CIVICS', chapterNumber: 5 },

  // Economics
  { id: 'e1', name: 'Development', subject: 'ECONOMICS', chapterNumber: 1 },
  { id: 'e2', name: 'Sectors of the Indian Economy', subject: 'ECONOMICS', chapterNumber: 2 },
  { id: 'e3', name: 'Money and Credit', subject: 'ECONOMICS', chapterNumber: 3 },
  { id: 'e4', name: 'Globalisation and the Indian Economy', subject: 'ECONOMICS', chapterNumber: 4 },
  { id: 'e5', name: 'Consumer Rights', subject: 'ECONOMICS', chapterNumber: 5 },
];

export const SUBJECT_COLORS = {
  HISTORY: 'bg-orange-100 text-orange-700',
  GEOGRAPHY: 'bg-green-100 text-green-700',
  CIVICS: 'bg-blue-100 text-blue-700',
  ECONOMICS: 'bg-purple-100 text-purple-700',
};
