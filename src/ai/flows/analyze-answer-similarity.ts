'use server';

/**
 * @fileOverview Flow to analyze the similarity between two answers.
 *
 * - analyzeAnswerSimilarity - Analyzes the similarity between two text answers.
 * - AnalyzeAnswerSimilarityInput - Input schema for the analyzeAnswerSimilarity function.
 * - AnalyzeAnswerSimilarityOutput - Output schema for the analyzeAnswerSimilarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAnswerSimilarityInputSchema = z.object({
  answer1: z.string().describe('The first answer.'),
  answer2: z.string().describe('The second answer.'),
});

export type AnalyzeAnswerSimilarityInput = z.infer<
  typeof AnalyzeAnswerSimilarityInputSchema
>;

const AnalyzeAnswerSimilarityOutputSchema = z.object({
  similarity: z
    .string()
    .describe(
      'A string indicating the similarity between the two answers, e.g., \'match\', \'similar\', or \'no match\'.'
    ),
  explanation: z.string().optional().describe('Explanation of the similarity result.'),
});

export type AnalyzeAnswerSimilarityOutput = z.infer<
  typeof AnalyzeAnswerSimilarityOutputSchema
>;

export async function analyzeAnswerSimilarity(
  input: AnalyzeAnswerSimilarityInput
): Promise<AnalyzeAnswerSimilarityOutput> {
  return analyzeAnswerSimilarityFlow(input);
}

const analyzeAnswerSimilarityPrompt = ai.definePrompt({
  name: 'analyzeAnswerSimilarityPrompt',
  input: {schema: AnalyzeAnswerSimilarityInputSchema},
  output: {schema: AnalyzeAnswerSimilarityOutputSchema},
  prompt: `You are an expert at determining the similarity between two text answers.

  Given two answers, determine if they are a \'match\', \'similar\', or \'no match\'. Provide a brief explanation for your determination.
  Make sure to provide the similarity as first word, examples: match, similar, or no match.

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
  async input => {
    const {output} = await analyzeAnswerSimilarityPrompt(input);
    return output!;
  }
);
