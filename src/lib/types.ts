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

export type QuizSession = {
  id: string; // Firestore document ID
  userAId: string;
  userAName: string;
  userBId: string | null;
  userBName: string;
  relationship: string;
  questionIds: number[];
  generatedImageUrl: string | null;
  createdAt: number;
  language: 'de' | 'en';
};
