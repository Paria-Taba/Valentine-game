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
import "./steps/css/setup-step.css"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { QUIZ_QUESTIONS, MCQuestion } from '@/lib/quiz-data';
import { translations } from '@/lib/translations';

export function QuizClientPage({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: 'A' | 'B';
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
    generatedImageUrl,
  } = useQuiz();

  const router = useRouter();
  const t = translations;

  useEffect(() => {
    joinSession(sessionId, userId);
  }, [sessionId, userId, joinSession]);

  const relevantQuestions = useMemo(() => {
    if (!session?.questionIds?.length) return [];
    return session.questionIds
      .map(id => QUIZ_QUESTIONS.find(q => q.id === id))
      .filter((q): q is MCQuestion => Boolean(q));
  }, [session?.questionIds]);

  // ⏳ Loading state
  if (isLoadingSession || isJoining || !session || !userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg font-semibold">
          {t.loading[language]}
        </p>
      </div>
    );
  }

  const partnerName =
    userRole === 'A' ? session.userBName : session.userAName;

  const totalQuestions = (session.questionIds?.length || 0) * 2;

  const shouldShowSidebar =
    session.relationship &&
    userAnswers.length < totalQuestions;

  const renderContent = () => {
    // 1️⃣ Relationship step
    if (!session.relationship) {
      if (userRole === 'A') {
        return <RelationshipStep />;
      }

      return (
        <Card className="mx-auto w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center font-headline">
              {t.waitForPartnerTitle[language].replace(
                '{partnerName}',
                partnerName
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {t.waitForRelationshipDescription[language]}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-10">
            <Hourglass className="h-16 w-16 animate-pulse text-primary" />
          </CardContent>
        </Card>
      );
    }

    // 2️⃣ No questions yet
    if (totalQuestions === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            {t.noQuestionsError[language]}
          </CardContent>
        </Card>
      );
    }

    // 3️⃣ Question step
    if (userAnswers.length < totalQuestions) {
      return <QuestionStep />;
    }

    // 4️⃣ Waiting for partner
    if (partnerAnswers.length < totalQuestions) {
      return <WaitingStep />;
    }

    // 5️⃣ Generating result
    if (!session.generatedImageUrl && !generatedImageUrl) {
      return <GeneratingStep />;
    }

    // 6️⃣ Results
    return <ResultsStep />;
  };

  return (

			<div className="flex min-h-screen bg-secondary layout-column">
      {shouldShowSidebar && <QuizSidebar />}

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full max-w-4xl">
          {renderContent()}
        </div>
		
      </main>
    </div>
	
	
	
    
  );
}
