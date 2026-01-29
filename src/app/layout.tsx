import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/genkit/analytics';
import { QuizProvider } from '@/context/quiz-context';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'QuizConnect',
  description:
    'Ein Quiz für Paare und Freunde, um ihre Verbindung zu vertiefen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-[#f2f2fc] m-0 p-0">
        <FirebaseClientProvider>
          <QuizProvider>
            {children}
            <Toaster />
            <Analytics />
          </QuizProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
