'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSharedImageInputSchema = z.object({
  userAAnswers: z.array(z.string()),
  userBAnswers: z.array(z.string()),
  userAName: z.string(),
  userBName: z.string(),
});

export type GenerateSharedImageInput = z.infer<
  typeof GenerateSharedImageInputSchema
>;

const GenerateSharedImageOutputSchema = z.object({
  imageUrl: z.string(),
});

export type GenerateSharedImageOutput = z.infer<
  typeof GenerateSharedImageOutputSchema
>;

export async function generateSharedImage(
  input: GenerateSharedImageInput
): Promise<GenerateSharedImageOutput> {
  return generateSharedImageFlow(input);
}

const generateSharedImageFlow = ai.defineFlow(
  {
    name: 'generateSharedImageFlow',
    inputSchema: GenerateSharedImageInputSchema,
    outputSchema: GenerateSharedImageOutputSchema,
  },
  async () => {

    // 
    /*
    const promptText = `Generate a visually appealing abstract image...`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: promptText,
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
    */

    return {
      imageUrl: '/valentine-image.png',
    };
  }
);
