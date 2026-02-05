'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InputSchema = z.object({
  userAName: z.string(),
  userBName: z.string(),
  userAAnswers: z.array(z.string()),
  userBAnswers: z.array(z.string()),
  language: z.enum(['en', 'de']),
});

const OutputSchema = z.object({
  story: z.string(),
});

export async function generateStory(input: z.infer<typeof InputSchema>) {
  const { userAName, userBName, language } = input;

  if (language === 'de') {
    return {
      story: `${userAName} und ${userBName} trafen sich im richtigen Moment.
Zwischen Lachen, stillen Augenblicken und gemeinsamen Erinnerungen
entstand eine Verbindung — ehrlich und tief.

Dies ist nicht nur eine Geschichte aus Antworten,
sondern ein Spiegel zweier Herzen, die einander entdecken.`,
    };
  }

  return {
    story: `
${userAName} and ${userBName} crossed paths at just the right moment.
Through laughter, quiet moments, and shared memories,
a connection grew — honestly and deeply.

This is not just a story of answers,
but a reflection of two hearts discovering each other.
`,
  };
}
