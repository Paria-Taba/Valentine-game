'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/quiz-context';
import { SetupStep } from '@/components/quiz/steps/setup-step';
import clock from '../../../../public/clock.png';
import './css/intro.css';

export default function IntroPage() {
  const { language, setLanguage } = useQuiz();
  const [step, setStep] = useState<'intro' | 'setup'>('intro');
  const [hasInteracted, setHasInteracted] = useState(false);

  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  /* ---------- PLAY VOICE → THEN PIANO ---------- */
  const playVoiceThenMusic = (lang: 'en' | 'de') => {
    voiceRef.current?.pause();
    musicRef.current?.pause();

    voiceRef.current = null;
    musicRef.current = null;

    const voiceSrc =
      lang === 'de' ? '/audio/german.mp3' : '/audio/english.mp3';

    const voice = new Audio(voiceSrc);
    voiceRef.current = voice;

    voice.play().catch(() => {});

    voice.onended = () => {
      const music = new Audio('/audio/piano.mp3');
      music.loop = true;
      music.volume = 0.4;
      music.play().catch(() => {});
      musicRef.current = music;
    };
  };

  /* ---------- FIRST USER INTERACTION ---------- */
  useEffect(() => {
    if (!hasInteracted) return;

    // default language = English → auto play
    playVoiceThenMusic(language);
  }, [hasInteracted]);

  /* ---------- LANGUAGE CHANGE ---------- */
  const handleLanguageChange = (lang: 'en' | 'de') => {
    setLanguage(lang);

    if (hasInteracted) {
      playVoiceThenMusic(lang);
    }
  };

  /* ---------- CONTINUE ---------- */
  const handleContinue = () => {
    voiceRef.current?.pause();
    musicRef.current?.pause();

    voiceRef.current = null;
    musicRef.current = null;

    setStep('setup');
  };

  if (step === 'setup') return <SetupStep />;

  return (
    <div
      className="intro-wrapper"
      onClick={() => {
        if (!hasInteracted) setHasInteracted(true);
      }}
    >
      {/* BACKGROUND */}
      <Image
        src={clock}
        alt="Time Story"
        fill
        priority
        className="intro-bg"
      />

      <div className="intro-overlay">
        {/* LANGUAGE */}
        <div className="language-switch">
          <Button
            size="sm"
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </Button>

          <Button
            size="sm"
            variant={language === 'de' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('de')}
          >
            Deutsch
          </Button>
        </div>

        {/* TEXT */}
        <p className="intro-text">
          {language === 'de'
            ? 'Diese Geschichte handelt von Zeit, Verbindung und gemeinsamen Erinnerungen. Antwort für Antwort entsteht eine Geschichte über dich und deinen Partner – gekrönt von einem Bild, das nur euch gehört.'
            : 'This story is about time, connection, and shared memories. With every answer, a story about you and your partner takes shape – ending in an image created just for you.'}
        </p>
	{language === 'en' && (
  <div className="tap-hint">
    <span className="tap-icon">👆</span>
    <p className="tap-text">
      Tap anywhere to begin the story with sound
    </p>
  </div>
)}

        {/* CONTINUE */}
        <Button size="lg" onClick={handleContinue}>
          {language === 'de' ? 'Weiter' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
