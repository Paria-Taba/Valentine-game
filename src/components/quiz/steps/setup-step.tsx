'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizConnectLogo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import "./css/setup-step.css"
import ValentineBackground from '@/components/ValentineBackground';

export function SetupStep() {
  const [userAName, setUserAName] = useState('');
  const [userBName, setUserBName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createSession, language, setLanguage } = useQuiz();

  const t = translations;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userAName.trim() && userBName.trim()) {
      setIsLoading(true);
      try {
        const sessionId = await createSession(userAName, userBName);
        router.push(`/quiz/${sessionId}/A`);
      } catch (error) {
        console.error("Failed to create session", error);
        setIsLoading(false);
        // Here you could show a toast notification
      }
    }
  };

  return (
  <div>
	<ValentineBackground />
<div className='container-cart'>
		 <Card className="w-full max-w-md">
      <CardHeader className="text-center cart-header">
        <div className="flex justify-center gap-4 mb-4">
            <Button variant={language === 'de' ? 'default' : 'outline'} onClick={() => setLanguage('de')}>Deutsch</Button>
            <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>English</Button>
        </div>
        <div className="flex justify-center items-center gap-3 mb-4">
            <QuizConnectLogo className="h-12 w-12 text-primary"/>
            <h1 className="text-4xl font-bold font-headline">{t.welcomeTitle[language]}</h1>
        </div>
        <CardDescription className='cart-description'>
          {t.welcomeDescription[language]}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 input">
          <div className="space-y-2">
            <Label htmlFor="userAName">{t.yourNameLabel[language]}</Label>
            <Input
              id="userAName"
              value={userAName}
              onChange={(e) => setUserAName(e.target.value)}
              placeholder={t.yourNamePlaceholder[language]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userBName">{t.partnerNameLabel[language]}</Label>
            <Input
              id="userBName"
              value={userBName}
              onChange={(e) => setUserBName(e.target.value)}
              placeholder={t.partnerNamePlaceholder[language]}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit"className="w-full" disabled={isLoading || !userAName || !userBName}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.continueButton[language]}
          </Button>
        </CardFooter>
      </form>
    </Card>
	</div>
  </div>
	
   
  );
}
