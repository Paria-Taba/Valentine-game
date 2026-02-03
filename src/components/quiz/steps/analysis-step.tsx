'use client';

import { useQuiz } from '@/context/quiz-context';
import { QUIZ_QUESTIONS, MCQuestion } from '@/lib/quiz-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useMemo } from 'react';
import { analyzeAnswerSimilarity } from '@/ai/flows/analyze-answer-similarity';
import { Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import type { Answer } from '@/lib/types';

type SimilarityResult = {
  similarity: string;
  explanation?: string;
};

function SimilarityBadge({
  similarity,
  language,
}: {
  similarity: string | undefined;
  language: 'de' | 'en';
}) {
  const t = translations;
  if (!similarity) return null;
  const lowerSimilarity = similarity.toLowerCase();

  if (lowerSimilarity.includes('match')) {
    return <Badge variant="default" className="bg-green-500">{t.match[language]}</Badge>;
  }
  if (lowerSimilarity.includes('similar')) {
    return <Badge variant="secondary" className="bg-yellow-500">{t.similar[language]}</Badge>;
  }
  return <Badge variant="destructive">{t.noMatch[language]}</Badge>;
}

function AnswerComparison({
  title,
  answer1,
  answer2,
  language,
}: {
  title: string;
  answer1: string;
  answer2: string;
  language: 'de' | 'en';
}) {
  const [analysis, setAnalysis] = useState<SimilarityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations;

  useEffect(() => {
    const getSimilarity = async () => {
      setIsLoading(true);
      try {
        const result = await analyzeAnswerSimilarity({ answer1, answer2 });
        setAnalysis(result);
      } catch (error) {
        console.error('Failed to analyze similarity:', error);
        setAnalysis({ similarity: 'Error' });
      }
      setIsLoading(false);
    };

    if (answer1 && answer2) {
        getSimilarity();
    } else {
        setIsLoading(false);
        setAnalysis({ similarity: 'no match', explanation: language === 'de' ? 'Eine Antwort fehlt.' : 'An answer is missing.' });
    }
  }, [answer1, answer2, language]);

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-secondary-foreground">{title}</h4>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SimilarityBadge similarity={analysis?.similarity} language={language} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-muted-foreground">{t.yourAnswer[language]}</p>
          <p className="p-2 bg-background rounded-md mt-1">{answer1 || t.notAnswered[language]}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">{t.partnerAnswer[language]}</p>
          <p className="p-2 bg-background rounded-md mt-1">{answer2 || t.notAnswered[language]}</p>
        </div>
      </div>
       {analysis?.explanation && (
         <p className="text-xs text-muted-foreground mt-2">
           <span className='font-bold'>{t.aiAnalysis[language]}:</span> {analysis.explanation}
         </p>
       )}
    </div>
  );
}

export function AnalysisStep() {
  const { session, userRole, userAnswers, partnerAnswers, language } = useQuiz();
  const t = translations;

  const relevantQuestions = useMemo(() => {
    if (!session?.questionIds) return [];
    return session.questionIds
      .map(id => QUIZ_QUESTIONS.find(q => q.id === id))
      .filter((q): q is MCQuestion => !!q);
  }, [session?.questionIds]);

  if (!session || !userRole || !userAnswers || !partnerAnswers) return null;
  
  const myName = userRole === 'A' ? session.userAName : session.userBName;
  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const getAnswer = (answers: Answer[], questionId: number, type: 'self' | 'guess') => {
    return answers.find(a => a.questionId === questionId && a.questionType === type)?.answer;
  };

  return (
    <div className="space-y-4 analys">
      <h2 className="text-2xl font-bold font-headline text-center">{t.analysisHeadline[language]}</h2>
      <p className="text-center text-muted-foreground">
        {t.analysisDescription[language]}
      </p>

      <Accordion type="single" collapsible className="w-full">
        {relevantQuestions.map((q) => {
          const mySelfAnswer = getAnswer(userAnswers, q.id, 'self');
          const partnerGuessOnMe = getAnswer(partnerAnswers, q.id, 'guess');
          
          const partnerSelfAnswer = getAnswer(partnerAnswers, q.id, 'self');
          const myGuessOnPartner = getAnswer(userAnswers, q.id, 'guess');

          return (
			
            <AccordionItem value={`item-${q.id}`} key={q.id}>
				
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <q.icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{q.topic}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 p-2">
                <AnswerComparison
                  title={t.partnerGuesses[language].replace('{partnerName}', partnerName).replace('{userName}', myName)}
                  answer1={mySelfAnswer ?? ''}
                  answer2={partnerGuessOnMe ?? ''}
                  language={language}
                />
                <AnswerComparison
                  title={t.youGuess[language].replace('{userName}', myName).replace('{partnerName}', partnerName)}
                  answer1={partnerSelfAnswer ?? ''}
                  answer2={myGuessOnPartner ?? ''}
                  language={language}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
