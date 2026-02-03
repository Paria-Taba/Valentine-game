'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/quiz-context';
import { SetupStep } from '@/components/quiz/steps/setup-step';
import clock from '../../../../public/clock.png';
import './css/intro.css';
import logo from "../../../../public/logo.png"


export default function IntroPage() {
  const { language, setLanguage } = useQuiz();
  const [step, setStep] = useState<'intro' | 'setup'>('intro');

  if (step === 'setup') return <SetupStep />;

  return (
    <div className="intro-wrapper ">

      {/* BACKGROUND IMAGE */}
      <Image
        src={clock}
        alt="Time Story"
        fill
        priority
        className="intro-bg"
      />
	 <Image
  src={logo}
  alt="Logo"
  width={60}
  height={60}
  priority
  className="logo"
/>

      {/* OVERLAY CONTENT */}
      <div className="intro-overlay">

        {/* LANGUAGE SWITCH */}
        <div className="language-switch">
         
          <Button
            size="sm"
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
		   <Button
            size="sm"
            variant={language === 'de' ? 'default' : 'outline'}
            onClick={() => setLanguage('de')}
          >
            Deutsch
          </Button>
        </div>

        {/* STORY TEXT */}
       <p className="intro-text">
  {language === 'de'
    ? 'Diese Geschichte handelt von Zeit, Verbindung und gemeinsamen Erinnerungen. Antwort für Antwort entsteht eine Geschichte über dich und deinen Partner – gekrönt von einem Bild, das nur euch gehört.'
    : 'This story is about time, connection, and shared memories. With every answer, a story about you and your partner takes shape – ending in an image created just for you.'}
</p>

        {/* CONTINUE */}
        <Button size="lg" onClick={() => setStep('setup')}>
          {language === 'de' ? 'Weiter' : 'Continue'}
        </Button>

      </div>
    </div>
  );
}
