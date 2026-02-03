'use client';

import ValentineBackground from '@/components/ValentineBackground';
import IntroPage from '@/components/quiz/steps/intro';
export default function HomePage() {
  return (
    <>
	
      <ValentineBackground />
      <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <IntroPage></IntroPage>
      </main>
    </>
  );
}
