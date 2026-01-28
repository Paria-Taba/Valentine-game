'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { Loader2, Hourglass } from 'lucide-react';
import { RelationshipStep } from './steps/relationship-step';
import { QuestionStep } from './steps/question-step';
import { WaitingStep } from './steps/waiting-step';
import { GeneratingStep } from './steps/generating-step';
import { ResultsStep } from './steps/results-step';
import { QuizSidebar } from './quiz-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { QUIZ_QUESTIONS, MCQuestion } from '@/lib/quiz-data';
import { translations } from '@/lib/translations';

export function QuizClientPage({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: 'A' | 'B';
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { 
    session, 
    isLoadingSession, 
    isJoining,
    userRole,
    userAnswers,
    partnerAnswers,
    language,
    joinSession,
    generatedImageUrl
  } = useQuiz();
  
  const router = useRouter();
  const t = translations;

  useEffect(() => {
    joinSession(sessionId, userId);
  }, [sessionId, userId, joinSession]);

  const relevantQuestions = useMemo(() => {
    if (!session?.questionIds || session.questionIds.length === 0) return [];
    
    const questions = session.questionIds
        .map(id => QUIZ_QUESTIONS.find(q => q.id === id))
        .filter((q): q is MCQuestion => !!q);

    if (questions.length !== session.questionIds.length) {
        console.warn("Some question IDs from the session were not found in the quiz data.");
    }
    
    return questions;
  }, [session?.questionIds]);

  if (isLoadingSession || isJoining || !session || !userRole) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg font-semibold">{t.loading[language]}</p>
      </div>
    );
  }
  
  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const renderContent = () => {
    if (!session.relationship) {
      if (userRole === 'A') {
        return <RelationshipStep />;
      } else {
        return (
          <Card className="w-full max-w-md mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center font-headline">{t.waitForPartnerTitle[language].replace('{partnerName}', partnerName)}</CardTitle>
              <CardDescription className="text-center">
                {t.waitForRelationshipDescription[language]}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
              <Hourglass className="h-16 w-16 text-primary animate-pulse" />
            </CardContent>
          </Card>
        );
      }
    }
    
    const totalQuestions = (session.questionIds?.length || 0) * 2;

    if (totalQuestions === 0 && session.relationship) {
       return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg font-semibold">{t.loading[language]}</p>
        </div>
      );
    }
    
    if (totalQuestions === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <p>
              {t.noQuestionsError[language]}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (userAnswers.length < totalQuestions) {
      return <QuestionStep />;
    }

    if (partnerAnswers.length < totalQuestions) {
      return <WaitingStep />;
    }

    if (!session.generatedImageUrl && !generatedImageUrl) {
      return <GeneratingStep />;
    }

    return <ResultsStep />;
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      <QuizSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto h-full w-full max-w-4xl">{renderContent()}</div>
      </main>
    </div>
  );
}
