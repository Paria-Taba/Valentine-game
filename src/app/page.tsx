'use client';

import { SetupStep } from '@/components/quiz/steps/setup-step';

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <SetupStep />
    </main>
  );
}
