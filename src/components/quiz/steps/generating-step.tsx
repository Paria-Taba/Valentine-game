'use client';

import { useEffect, useState, useRef } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { updateDoc, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import ValentineBackground from '@/components/ValentineBackground';
import { apiPost } from '@/lib/couplesQuizApi';

export function GeneratingStep() {
  const { session, sessionId, userRole, language } = useQuiz();
  const firestore = useFirestore();
  const [error, setError] = useState<string | null>(null);
  const hasGenerated = useRef(false);
  const t = translations;

  useEffect(() => {
    if (
      hasGenerated.current ||
      userRole !== 'A' ||
      !session ||
      !sessionId ||
      session.generatedImageUrl ||
      session.generatedStory
    ) {
      return;
    }

    hasGenerated.current = true;

    const generateResult = async () => {
      try {
        const result = await apiPost('generateResult', { sessionId });

        if (!result.success) {
          throw new Error(result.error || 'Generation failed');
        }

        await updateDoc(doc(firestore, 'sessions', sessionId), {
          generatedStory: result.story,
          generatedImageUrl: result.imageUrl,
          matchCount: result.matchCount,
          matchDetails: result.matchDetails,
        });

      } catch (e) {
        console.error('Generate result failed:', e);
        setError(
          e instanceof Error
            ? e.message
            : t.generationError[language]
        );
      }
    };

    generateResult();
  }, [session, sessionId, userRole, language, firestore]);

  return (
    <>
      <ValentineBackground />
      <div className="container-cart generating-div text-center">
        <Loader2 className="h-16 w-16 animate-spin mx-auto" />
        <p className="mt-4 text-muted-foreground">
          {t.generatingDescription[language]}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
}
