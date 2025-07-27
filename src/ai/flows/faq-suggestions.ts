
// This file uses server-side code.
'use server';

/**
 * @fileOverview FAQ Suggestions Flow.
 *
 * This file defines a Genkit flow that suggests relevant FAQs based on user input from a contact form.
 * It exports:
 * - `suggestFaq` - The main function to trigger the FAQ suggestion flow.
 * - `SuggestFaqInput` - The input type for the suggestFaq function.
 * - `SuggestFaqOutput` - The output type for the suggestFaq function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the FAQ suggestion flow
const SuggestFaqInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input from the contact form that the FAQ suggestions will be based on.'),
});
export type SuggestFaqInput = z.infer<typeof SuggestFaqInputSchema>;

// Define the output schema for the FAQ suggestion flow
const SuggestFaqOutputSchema = z.object({
  suggestedFaqs: z
    .array(z.string())
    .describe('An array of suggested FAQs based on the user input.'),
});
export type SuggestFaqOutput = z.infer<typeof SuggestFaqOutputSchema>;

// Define the main function to trigger the FAQ suggestion flow
export async function suggestFaq(input: SuggestFaqInput): Promise<SuggestFaqOutput> {
  return suggestFaqFlow(input);
}

// Define the prompt for the FAQ suggestion
const faqSuggestionPrompt = ai.definePrompt({
  name: 'faqSuggestionPrompt',
  input: {schema: SuggestFaqInputSchema},
  output: {schema: SuggestFaqOutputSchema},
  prompt: `Based on the following user input from a contact form, suggest 3 relevant FAQs that might help the user.\n\nUser Input: {{{userInput}}}\n\nEnsure the suggested FAQs are concise and directly related to the user's input. The output should be an array of strings.\n`,
});

// Define the Genkit flow for suggesting FAQs
const suggestFaqFlow = ai.defineFlow(
  {
    name: 'suggestFaqFlow',
    inputSchema: SuggestFaqInputSchema,
    outputSchema: SuggestFaqOutputSchema,
  },
  async input => {
    const {output} = await faqSuggestionPrompt(input);
    return output!;
  }
);
