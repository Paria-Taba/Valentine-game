'use client';

import { useQuiz } from '@/context/quiz-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Hourglass } from 'lucide-react';
import { translations } from '@/lib/translations';
import"./css/setup-step.css"
import logo from "../../../../public/logo.png"
import Image from 'next/image';
import ValentineBackground from '@/components/ValentineBackground';

export function WaitingStep() {
  const { session, partnerAnswers, userRole, language } = useQuiz();
  const t = translations;

  if (!session || !userRole) return null;

  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const totalQuestions = (session.questionIds?.length || 0) * 2;
  const partnerProgress = totalQuestions > 0 ? (partnerAnswers.length / totalQuestions) * 100 : 0;

  if (totalQuestions === 0) {
      return (
          <Card className="w-full max-w-md mx-auto animate-fade-in">
              <CardHeader>
                  <CardTitle className="text-center font-headline">{t.errorTitle[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{t.noQuestionsError[language]}</p>
              </CardContent>
          </Card>
      );
  }

  return (
	<div className='result-margin'>
		<ValentineBackground/>
		
		<div className='container-cart waiting-div'> <div className="logo-wrapper">
  <Image
    src={logo}
    alt="Logo"
    width={60}
    height={60}
    priority
  />
</div>
		<Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center font-headline">{t.waitingTitle[language]}</CardTitle>
        <CardDescription className="text-center">
            {t.waitingDescription[language].replace('{partnerName}', partnerName)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
        <Hourglass className="h-16 w-16 text-primary animate-pulse" />
        <div className="w-full space-y-2">
            <p className="text-center text-muted-foreground text-3">
                {t.waitingProgress[language]
                    .replace('{partnerName}', partnerName)
                    .replace('{answered}', String(partnerAnswers.length))
                    .replace('{total}', String(totalQuestions))}
            </p>
            <Progress value={partnerProgress} className="w-full" />
        </div>
      </CardContent>
    </Card>
	</div>
	</div>
	
    
  );
}
