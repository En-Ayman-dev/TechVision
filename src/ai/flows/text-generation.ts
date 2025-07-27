
// This file uses server-side code.
'use server';

/**
 * @fileOverview Text Generation Flows.
 *
 * This file defines Genkit flows for generating various types of text content,
 * such as service descriptions, project details, and testimonial quotes.
 * It exports:
 * - `generateDescription`
 * - `GenerateDescriptionInput`
 * - `GenerateDescriptionOutput`
 * - `generateTestimonialQuote`
 * - `GenerateTestimonialQuoteInput`
 * - `GenerateTestimonialQuoteOutput`
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating descriptions (for services or projects)
const GenerateDescriptionInputSchema = z.object({
  type: z.enum(['service', 'project']).describe("The type of content to generate a description for."),
  topic: z.string().describe("The topic or title for which to generate a description."),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe("The generated description."),
});
export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;

// Schema for generating testimonial quotes
const GenerateTestimonialQuoteInputSchema = z.object({
  authorName: z.string().describe("The name of the author of the testimonial."),
});
export type GenerateTestimonialQuoteInput = z.infer<typeof GenerateTestimonialQuoteInputSchema>;

const GenerateTestimonialQuoteOutputSchema = z.object({
  quote: z.string().describe("The generated testimonial quote."),
});
export type GenerateTestimonialQuoteOutput = z.infer<typeof GenerateTestimonialQuoteOutputSchema>;


// Main exported functions
export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

export async function generateTestimonialQuote(input: GenerateTestimonialQuoteInput): Promise<GenerateTestimonialQuoteOutput> {
  return generateTestimonialQuoteFlow(input);
}


// Prompt Definitions
const descriptionPrompt = ai.definePrompt({
  name: 'descriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `You are a professional copywriter for a tech company. 
  Generate a concise and compelling description for a {{type}} with the following topic: {{{topic}}}.
  The description should be around 20-30 words, suitable for a website.
  `,
});

const testimonialPrompt = ai.definePrompt({
  name: 'testimonialPrompt',
  input: { schema: GenerateTestimonialQuoteInputSchema },
  output: { schema: GenerateTestimonialQuoteOutputSchema },
  prompt: `You are an AI that generates realistic and positive testimonials.
  Create a quote from a fictional client named {{{authorName}}} praising our tech company's services.
  The quote should sound authentic and highlight professionalism and great results.
  Keep it to one or two sentences.
  `,
});


// Flow Definitions
const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await descriptionPrompt(input);
    return output!;
  }
);

const generateTestimonialQuoteFlow = ai.defineFlow(
  {
    name: 'generateTestimonialQuoteFlow',
    inputSchema: GenerateTestimonialQuoteInputSchema,
    outputSchema: GenerateTestimonialQuoteOutputSchema,
  },
  async (input) => {
    const { output } = await testimonialPrompt(input);
    return output!;
  }
);
