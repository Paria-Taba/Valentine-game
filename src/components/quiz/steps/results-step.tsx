'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisStep } from './analysis-step';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { translations } from '@/lib/translations';
import { QUIZ_QUESTIONS, MCQuestion } from '@/lib/quiz-data';
import type { Answer } from '@/lib/types';
import "./css/setup-step.css"

export function ResultsStep() {
  const { session, language, userAnswers, partnerAnswers, userRole, generatedImageUrl } = useQuiz();
  const { toast } = useToast();
  const t = translations;

  const relevantQuestions = useMemo(() => {
    if (!session?.questionIds) return [];
    return session.questionIds
      .map(id => QUIZ_QUESTIONS.find(q => q.id === id))
      .filter((q): q is MCQuestion => !!q);
  }, [session?.questionIds]);

  const getAnswer = (answers: Answer[], questionId: number, type: 'self' | 'guess') => {
    return answers.find(a => a.questionId === questionId && a.questionType === type)?.answer;
  };

  const myScore = useMemo(() => {
    if (!session || !userAnswers || !partnerAnswers || !userRole) return 0;
    let score = 0;
    relevantQuestions.forEach(q => {
        const partnerSelfAnswer = getAnswer(partnerAnswers, q.id, 'self');
        const myGuessOnPartner = getAnswer(userAnswers, q.id, 'guess');

        if (partnerSelfAnswer && myGuessOnPartner && partnerSelfAnswer === myGuessOnPartner) {
            score++;
        }
    });
    return score;
  }, [session, userAnswers, partnerAnswers, userRole, relevantQuestions]);

  const totalGuesses = relevantQuestions.length;

  const imageUrl = generatedImageUrl || session?.generatedImageUrl;

  if (!session || !imageUrl) {
    return null;
  }

  const resultLink = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultLink).then(() => {
      toast({
        title: t.copiedToastTitle[language],
        description: t.copiedToastDescription[language],
      });
    });
  };

  const shareOnWhatsApp = () => {
    const message = t.shareMessage[language].replace('{link}', resultLink);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
	<div className='container-cart'>
		<div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">{t.resultsTitle[language]}</CardTitle>
          <CardDescription>
            {t.resultsScore[language]
              .replace('{score}', String(myScore))
              .replace('{total}', String(totalGuesses))}
          </CardDescription>
          <CardDescription>
            {t.resultsDescription[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={language === 'de' ? "Generiertes Bild eurer Verbindung" : "Generated image of your connection"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={shareOnWhatsApp} className="w-full sm:w-auto flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            {t.share[language]}
          </Button>
          <Button onClick={copyToClipboard} variant="secondary" className="w-full sm:w-auto flex-1">
            <Copy className="mr-2 h-4 w-4" />
            {t.copyLink[language]}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto flex-1">
                <Eye className="mr-2 h-4 w-4" />
                {t.viewAnalysis[language]}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>{t.analysisTitle[language]}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-4 -mr-4">
                <AnalysisStep />
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
	</div>
    
  );
}
