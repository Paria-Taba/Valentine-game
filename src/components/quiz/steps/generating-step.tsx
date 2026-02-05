'use client';

import { useEffect, useState } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { generateSharedImage } from '@/ai/flows/generate-shared-image';
import { generateStory } from '@/ai/flows/generate-story';
import { updateDoc, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import ValentineBackground from '@/components/ValentineBackground';

export function GeneratingStep() {
  const {
    session,
    sessionId,
    userAnswers,
    partnerAnswers,
    userRole,
    language,
  } = useQuiz();

  const firestore = useFirestore();
  const [error, setError] = useState<string | null>(null);
  const t = translations;

  useEffect(() => {
    if (
      userRole !== 'A' ||
      !session ||
      !sessionId ||
      session.generatedImageUrl ||
      session.generatedStory
    ) {
      return;
    }

    const generate = async () => {
      try {
        const userAAnswers = userAnswers.map(a => a.answer);
        const userBAnswers = partnerAnswers.map(a => a.answer);

        // 1️⃣ STORY
        const storyResult = await generateStory({
          userAName: session.userAName,
          userBName: session.userBName,
          userAAnswers,
          userBAnswers,
          language,
        });

        // 2️IMAGE
        const imageResult = await generateSharedImage({
          userAName: session.userAName,
          userBName: session.userBName,
          userAAnswers,
          userBAnswers,
        });

        // SAVE TO FIRESTORE
        await updateDoc(doc(firestore, 'sessions', sessionId), {
          generatedStory: storyResult.story,
          generatedImageUrl: imageResult.imageUrl,
        });

      } catch (e) {
        console.error(e);
        setError(t.generationError[language]);
      }
    };

    generate();
  }, [session, sessionId, userRole, language]);

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
