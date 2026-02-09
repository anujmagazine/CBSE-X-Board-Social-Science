
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (chapter: Chapter): Promise<Question[]> => {
  const prompt = `Act as a senior CBSE Board Paper Setter for Class X Social Science (History, Geography, Political Science, Economics).
  Target Year: 2026 Board Exams.
  Chapter: "${chapter.name}" (${chapter.subject}).

  Generate a set of 8-10 highly probable questions following this STRICT structure:

  1. MCQs (1 Mark): Focus on COMPETENCY. Include:
     - 1 Assertion-Reasoning question.
     - 1 Correct/Incorrect statement selection or Matching table.
     - 1 Picture-based or Fact-based identification.
  
  2. VSA (2 Marks): Very Short Answer. Conceptual and precise (max 40 words).
  
  3. SA (3 Marks): Short Answer. Reasoning-based (max 60 words).
  
  4. LA (5 Marks): Long Answer. Detailed analysis/Justification (max 120 words).
  
  5. CBQ (4 Marks): Case-Based Question.
     - Provide a Source Text/Passage.
     - Provide 3 sub-questions: (a) 1 mark, (b) 1 mark, (c) 2 marks.
  
  6. MAP Work (5 Marks): 
     - If History: Focus on identification/labeling (2 items).
     - If Geography: Focus on location/labeling (3 items).
     - Only provide if relevant to "${chapter.name}".

  For each question, provide:
  - 'probability': (85-99%) based on 5-year trend analysis.
  - 'insight': 1-2 sentences of "Examiner's Hotspot Insight" (why this is high-probability).
  - 'options': Only for MCQ.
  - 'context': The source passage for CBQs or a description of a picture/map for others.

  Response MUST be in JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "The main question text" },
                type: { type: Type.STRING, enum: ["MCQ", "VSA", "SA", "LA", "CBQ", "MAP"] },
                marks: { type: Type.NUMBER },
                probability: { type: Type.NUMBER },
                insight: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Required for MCQ. 4 options."
                },
                context: { type: Type.STRING, description: "Passage for CBQ or Map description" }
              },
              required: ["text", "type", "marks", "probability", "insight"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{"questions": []}');
  return parsed.questions;
};

export const generateAnswers = async (chapter: Chapter, questions: Question[]): Promise<Question[]> => {
  const prompt = `Provide model answers for these CBSE X 2026 predicted questions for "${chapter.name}".
  Model Answer Guidelines:
  - MCQ: State Option Letter and Text.
  - VSA: Direct and precise (2 points).
  - SA/LA: Bullet points with specific keywords underlined in your mind.
  - CBQ: Separate answers for (a), (b), and (c).
  - MAP: Descriptions of where to locate or what the correct labels are.

  Questions:
  ${questions.map((q, i) => `[${q.type}] Q${i+1}: ${q.text} (${q.marks}M)`).join('\n')}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answers: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: "Full model answer" }
          }
        },
        required: ["answers"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{"answers": []}');
  return questions.map((q, i) => ({ ...q, answer: parsed.answers[i] }));
};
