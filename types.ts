
export type Subject = 'HISTORY' | 'GEOGRAPHY' | 'ECONOMICS' | 'CIVICS';

// Added missing Chapter interface required by constants.tsx and other components
export interface Chapter {
  id: string;
  name: string;
  subject: Subject;
  chapterNumber: number;
}

export interface Question {
  type: 'MCQ' | 'VSA' | 'SA' | 'LA' | 'CBQ' | 'MAP';
  marks: number;
  text: string;
  probability: number;
  insight: string;
  options?: string[];
  context?: string;
  answer?: string;
}

export interface GeneratedContent {
  questions: Question[];
}