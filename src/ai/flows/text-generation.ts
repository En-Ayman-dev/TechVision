
// // This file uses server-side code.
// 'use server';

// /**
//  * @fileOverview Text Generation Flows.
//  *
//  * This file defines Genkit flows for generating various types of text content,
//  * such as service descriptions, project details, and testimonial quotes.
//  * It exports:
//  * - `generateDescription`
//  * - `GenerateDescriptionInput`
//  * - `GenerateDescriptionOutput`
//  * - `generateTestimonialQuote`
//  * - `GenerateTestimonialQuoteInput`
//  * - `GenerateTestimonialQuoteOutput`
//  */

// import { ai } from '@/ai/genkit';
// import { z } from 'genkit';

// // Schema for generating descriptions (for services or projects)
// const GenerateDescriptionInputSchema = z.object({
//   type: z.enum(['service', 'project']).describe("The type of content to generate a description for."),
//   topic: z.string().describe("The topic or title for which to generate a description."),
// });
// export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

// const GenerateDescriptionOutputSchema = z.object({
//   description: z.string().describe("The generated description."),
// });
// export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;

// // Schema for generating testimonial quotes
// const GenerateTestimonialQuoteInputSchema = z.object({
//   authorName: z.string().describe("The name of the author of the testimonial."),
// });
// export type GenerateTestimonialQuoteInput = z.infer<typeof GenerateTestimonialQuoteInputSchema>;

// const GenerateTestimonialQuoteOutputSchema = z.object({
//   quote: z.string().describe("The generated testimonial quote."),
// });
// export type GenerateTestimonialQuoteOutput = z.infer<typeof GenerateTestimonialQuoteOutputSchema>;


// // Main exported functions
// export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
//   return generateDescriptionFlow(input);
// }

// export async function generateTestimonialQuote(input: GenerateTestimonialQuoteInput): Promise<GenerateTestimonialQuoteOutput> {
//   return generateTestimonialQuoteFlow(input);
// }


// // Prompt Definitions
// const descriptionPrompt = ai.definePrompt({
//   name: 'descriptionPrompt',
//   input: { schema: GenerateDescriptionInputSchema },
//   output: { schema: GenerateDescriptionOutputSchema },
//   prompt: `You are a professional copywriter for a tech company. 
//   Generate a concise and compelling description for a {{type}} with the following topic: {{{topic}}}.
//   The description should be around 20-30 words, suitable for a website.
//   `,
// });

// const testimonialPrompt = ai.definePrompt({
//   name: 'testimonialPrompt',
//   input: { schema: GenerateTestimonialQuoteInputSchema },
//   output: { schema: GenerateTestimonialQuoteOutputSchema },
//   prompt: `You are an AI that generates realistic and positive testimonials.
//   Create a quote from a fictional client named {{{authorName}}} praising our tech company's services.
//   The quote should sound authentic and highlight professionalism and great results.
//   Keep it to one or two sentences.
//   `,
// });


// // Flow Definitions
// const generateDescriptionFlow = ai.defineFlow(
//   {
//     name: 'generateDescriptionFlow',
//     inputSchema: GenerateDescriptionInputSchema,
//     outputSchema: GenerateDescriptionOutputSchema,
//   },
//   async (input) => {
//     const { output } = await descriptionPrompt(input);
//     return output!;
//   }
// );

// const generateTestimonialQuoteFlow = ai.defineFlow(
//   {
//     name: 'generateTestimonialQuoteFlow',
//     inputSchema: GenerateTestimonialQuoteInputSchema,
//     outputSchema: GenerateTestimonialQuoteOutputSchema,
//   },
//   async (input) => {
//     const { output } = await testimonialPrompt(input);
//     return output!;
//   }
// );


"use server";

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

// New Schema for structuring project ideas
const GenerateStructuredIdeaInputSchema = z.object({
  projectIdea: z.string().describe("The user's raw idea for a project."),
  language: z.string().describe("The language to generate the structured idea in."),
});
export type GenerateStructuredIdeaInput = z.infer<typeof GenerateStructuredIdeaInputSchema>;

const GenerateStructuredIdeaOutputSchema = z.object({
  structuredIdea: z.string().describe("The generated, structured, and academic-sounding project idea."),
});
export type GenerateStructuredIdeaOutput = z.infer<typeof GenerateStructuredIdeaOutputSchema>;


// Main exported functions
export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

export async function generateTestimonialQuote(input: GenerateTestimonialQuoteInput): Promise<GenerateTestimonialQuoteOutput> {
  return generateTestimonialQuoteFlow(input);
}

// New exported function for project idea generation
export async function generateStructuredIdea(input: GenerateStructuredIdeaInput): Promise<GenerateStructuredIdeaOutput> {
  return generateStructuredIdeaFlow(input);
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

// New prompt definition for structuring project ideas
const structuredIdeaPrompt = ai.definePrompt({
  name: 'structuredIdeaPrompt',
  input: { schema: GenerateStructuredIdeaInputSchema },
  output: { schema: GenerateStructuredIdeaOutputSchema },
  prompt: `You are an expert project manager and technical writer. A user has provided a raw idea for a project. Your task is to rephrase this idea into a detailed, professional, and structured project prompt.

The output should be a clear, concise, and technically sound description of the project, including the following sections:
- **Project Title:** A creative and descriptive title.
- **Project Overview:** A brief summary of the project's purpose and its core functionality.
- **Key Features:** A list of the main features the project should include.
- **Target Audience:** Who is this project for?
- **Technical Stack:** Suggestions for technologies (e.g., languages, frameworks, databases, cloud services).

The tone should be formal and academic. The entire response must be in the language specified: "{{{language}}}".

User's raw idea:
{{{projectIdea}}}
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

// New flow definition for structuring project ideas
const generateStructuredIdeaFlow = ai.defineFlow(
  {
    name: 'generateStructuredIdeaFlow',
    inputSchema: GenerateStructuredIdeaInputSchema,
    outputSchema: GenerateStructuredIdeaOutputSchema,
  },
  async (input) => {
    const { output } = await structuredIdeaPrompt(input);
    return output!;
  }
);
