'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeAnswerSimilarityInputSchema = z.object({
  answer1: z.string(),
  answer2: z.string(),
});

export type AnalyzeAnswerSimilarityInput =
  z.infer<typeof AnalyzeAnswerSimilarityInputSchema>;

const AnalyzeAnswerSimilarityOutputSchema = z.object({
  similarity: z.string(),
  explanation: z.string().optional(),
});

export type AnalyzeAnswerSimilarityOutput =
  z.infer<typeof AnalyzeAnswerSimilarityOutputSchema>;

export async function analyzeAnswerSimilarity(
  input: AnalyzeAnswerSimilarityInput
): Promise<AnalyzeAnswerSimilarityOutput> {
  return analyzeAnswerSimilarityFlow(input);
}

const analyzeAnswerSimilarityPrompt = ai.definePrompt({
  name: 'analyzeAnswerSimilarityPrompt',

  // این خط اضافه شده (مهم‌ترین تغییر)
  model: 'googleai/gemini-1.5-flash',

  input: { schema: AnalyzeAnswerSimilarityInputSchema },
  output: { schema: AnalyzeAnswerSimilarityOutputSchema },

  prompt: `
You are an expert at determining the similarity between two text answers.

Determine whether they are:
- match
- similar
- no match

Return the similarity as the first word.

Answer 1: {{{answer1}}}
Answer 2: {{{answer2}}}
`,
});

const analyzeAnswerSimilarityFlow = ai.defineFlow(
  {
    name: 'analyzeAnswerSimilarityFlow',
    inputSchema: AnalyzeAnswerSimilarityInputSchema,
    outputSchema: AnalyzeAnswerSimilarityOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeAnswerSimilarityPrompt(input);
    return output!;
  }
);
