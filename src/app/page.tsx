'use client';

import ValentineBackground from '@/components/ValentineBackground';
import { SetupStep } from '@/components/quiz/steps/setup-step';

export default function HomePage() {
  return (
    <>
      <ValentineBackground />
      <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <SetupStep />
      </main>
    </>
  );
}
