import { QuizClientPage } from '@/components/quiz/quiz-client-page';
import type { Metadata } from 'next';

type QuizPageParams = {
  params: Promise<{
    sessionId: string;
    userId: 'A' | 'B';
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: 'Your Quiz | QuizConnect',
};

export default async function QuizPage({ params, searchParams }: QuizPageParams) {
  const { sessionId, userId } = await params;

  return (
    <QuizClientPage
      sessionId={sessionId}
  userId={userId}
    />
  );
}
