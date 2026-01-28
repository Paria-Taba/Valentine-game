'use server';

/**
 * @fileOverview Generates a shared image based on the quiz answers of two users.
 *
 * - generateSharedImage - A function that generates a shared image based on the provided answers.
 * - GenerateSharedImageInput - The input type for the generateSharedImage function.
 * - GenerateSharedImageOutput - The return type for the generateSharedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSharedImageInputSchema = z.object({
  userAAnswers: z.array(z.string()).describe('A list of answers provided by user A.'),
  userBAnswers: z.array(z.string()).describe('A list of answers provided by user B.'),
  userAName: z.string().describe('Name of user A.'),
  userBName: z.string().describe('Name of user B.'),
});
export type GenerateSharedImageInput = z.infer<typeof GenerateSharedImageInputSchema>;

const GenerateSharedImageOutputSchema = z.object({
  imageUrl: z.string().describe('URL of the generated shared image.'),
});
export type GenerateSharedImageOutput = z.infer<typeof GenerateSharedImageOutputSchema>;

export async function generateSharedImage(input: GenerateSharedImageInput): Promise<GenerateSharedImageOutput> {
  return generateSharedImageFlow(input);
}

const generateSharedImageFlow = ai.defineFlow(
  {
    name: 'generateSharedImageFlow',
    inputSchema: GenerateSharedImageInputSchema,
    outputSchema: GenerateSharedImageOutputSchema,
  },
  async input => {
    const promptText = `Generate a visually appealing abstract image that represents the connection between two people, ${input.userAName} and ${input.userBName}. Use the following concepts from their answers as inspiration:\n\nConcepts from ${input.userAName}: ${input.userAAnswers.join(', ')}\n\nConcepts from ${input.userBName}: ${input.userBAnswers.join(', ')}\n\nThe image should be artistic and symbolic, reflecting a harmonious blend of their personalities and shared experiences, as well as their differences. Do not create a literal depiction of the words.`;
      
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: promptText,
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
