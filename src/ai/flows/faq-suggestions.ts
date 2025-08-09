
"use server";

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema to include the language hint
const SuggestFaqInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input from the contact form that the FAQ suggestions will be based on.'),
  languageHint: z
    .string()
    .describe('A hint to the AI to generate the FAQs in a specific language (e.g., "in Arabic" or "in English").'),
});

export type SuggestFaqInput = z.infer<typeof SuggestFaqInputSchema>;

const SuggestFaqOutputSchema = z.object({
  suggestedFaqs: z
    .array(z.string())
    .describe('An array of suggested FAQs based on the user input.'),
});
export type SuggestFaqOutput = z.infer<typeof SuggestFaqOutputSchema>;

export async function suggestFaq(input: SuggestFaqInput): Promise<SuggestFaqOutput> {
  return suggestFaqFlow(input);
}

// Update the prompt definition to use the new language hint
const faqSuggestionPrompt = ai.definePrompt({
  name: 'faqSuggestionPrompt',
  input: { schema: SuggestFaqInputSchema },
  output: { schema: SuggestFaqOutputSchema },
  prompt: `Based on the following user input from a contact form, suggest 3 relevant FAQs that might help the user, generated strictly {{{languageHint}}}.\n\nUser Input: {{{userInput}}}\n\nEnsure the suggested FAQs are concise and directly related to the user's input. The output should be an array of strings.\n`,
});

const suggestFaqFlow = ai.defineFlow(
  {
    name: 'suggestFaqFlow',
    inputSchema: SuggestFaqInputSchema,
    outputSchema: SuggestFaqOutputSchema,
  },
  async (input) => {
    const { output } = await faqSuggestionPrompt(input);
    return output!;
  }
);