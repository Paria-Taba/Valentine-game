export type Answer = {
  id: string; // Firestore document ID
  sessionId: string;
  userId: string;
  questionId: number;
  topic: string;
  question: string; // The literal question text
  questionType: 'self' | 'guess';
  answer: string;
};

export interface QuizSession {
  id?: string;
  userAName: string;
  userBName: string;
  userAId: string;
  userBId: string | null;
  relationship: string;
  questionIds: number[];
  generatedImageUrl: string | null;

  generatedStory?: string | null;

  createdAt: number;
  language: 'de' | 'en';
}
