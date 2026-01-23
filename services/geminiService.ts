
import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (chapter: Chapter): Promise<Question[]> => {
  const prompt = `Act as a world-class CBSE Class X Social Science board examiner. 
  Analyze the last 5 years (2020-2025) of board exam patterns for the chapter "${chapter.name}" from the subject ${chapter.subject}.
  Generate 8-10 highly probable questions for the upcoming 2026 board exam.
  
  CRITICAL REQUIREMENT: For every 'MCQ' type question, you MUST provide 4 distinct options (A, B, C, D).
  
  For each question, provide:
  1. A probability percentage (between 85% and 99%) based on historical frequency and 2026 trends.
  2. An examiner insight (bulb icon text) explaining why this specific topic is a 'hotspot' or high-probability area.
  3. For MCQs: 4 options in an array. For other types, leave options as an empty array or null.
  
  Include a mix of:
  - MCQs (1 mark) - MUST have 4 options.
  - Short Answer (2-3 marks)
  - Long Answer (5 marks)
  - Case-Based/Competency Questions (4 marks)
  
  Ensure questions align with the 2026 CBSE curriculum and the latest competency-based assessment guidelines.`;

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
                text: { type: Type.STRING, description: "The actual question text" },
                type: { type: Type.STRING, enum: ["MCQ", "SHORT", "LONG", "CASE_BASED"] },
                marks: { type: Type.NUMBER },
                probability: { type: Type.NUMBER, description: "Percentage from 85-99" },
                insight: { type: Type.STRING, description: "Examiner insight explaining why this is a hotspot" },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Required for MCQ type. List of 4 options."
                },
                context: { type: Type.STRING, description: "Case passage if applicable" }
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
  const prompt = `For the following list of questions from Class X Social Science chapter "${chapter.name}", provide model answers that would fetch 100% marks in the 2026 CBSE board exams.
  Follow these guidelines:
  - For MCQs, clearly state the correct option letter (A/B/C/D) and the text of that option.
  - Use clear headings and sub-headings for others.
  - Provide point-wise answers for 3 and 5 markers.
  - Include relevant keywords that examiners look for.
  
  Questions:
  ${questions.map((q, i) => `Q${i+1}: ${q.text} (${q.marks} marks) ${q.options ? `Options: ${q.options.join(', ')}` : ''}`).join('\n')}`;

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
            items: { type: Type.STRING, description: "The full formatted answer for the question" }
          }
        },
        required: ["answers"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{"answers": []}');
  return questions.map((q, i) => ({ ...q, answer: parsed.answers[i] }));
};
