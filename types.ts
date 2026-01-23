
export type Subject = 'HISTORY' | 'GEOGRAPHY' | 'ECONOMICS' | 'CIVICS';

export interface Chapter {
  id: string;
  name: string;
  subject: Subject;
  chapterNumber: number;
}

export interface Question {
  type: 'MCQ' | 'SHORT' | 'LONG' | 'CASE_BASED';
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
