'use client';

import { useQuiz } from '@/context/quiz-context';

export function AnalysisStep() {
  const { session, language } = useQuiz();

  if (!session?.matchDetails?.length) {
    return <p className="text-muted-foreground">No analysis available.</p>;
  }

  return (
    <div className="space-y-4">
      {session.matchDetails.map((item: any) => (
        <div
          key={item.questionKey}
          className="border rounded-lg p-4 space-y-2"
        >
          <p className="font-semibold">
            Question: {item.questionKey}
          </p>

          <p>
            <strong>A answered:</strong> {item.aSelf}
          </p>
          <p>
            <strong>B guessed:</strong> {item.bGuessAboutA}{' '}
            {item.bGuessedCorrectly ? '✅' : '❌'}
          </p>

          <hr />

          <p>
            <strong>B answered:</strong> {item.bSelf}
          </p>
          <p>
            <strong>A guessed:</strong> {item.aGuessAboutB}{' '}
            {item.aGuessedCorrectly ? '✅' : '❌'}
          </p>
        </div>
      ))}
    </div>
  );
}
