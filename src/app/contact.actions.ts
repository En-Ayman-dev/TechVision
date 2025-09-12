"use server";

import { sendContactMessageAction, suggestFaqAction } from "@/app/actions";
import { revalidatePath } from "next/cache";
import { generateStructuredIdea } from "@/ai/flows/text-generation";
import { getLocale } from "next-intl/server";
import * as z from "zod";

// The form data is already validated on the client by the hook.
// This action now directly forwards the validated data.
export async function sendMessageAction(data: FormData) {
  try {
    // We can create a simple object from FormData for the main action
    const messageData = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      message: data.get("message") as string,
      inquiry: data.get("projectIdea") as string || "No specific inquiry.",
      beneficiaryType: data.get("beneficiaryType") as string,
      requestType: data.get("requestType") as string,
      preferredContactMethod: data.get("preferredContactMethod") as string,
      contactMethodValue: data.get("contactMethodValue") as string,
    };

    // Pass the structured data to the main action
    await sendContactMessageAction(messageData);

    revalidatePath("/ar");
    revalidatePath("/en");
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Failed to add message:", error);
    // Check if it's a Zod validation error from the nested action
    if (error instanceof z.ZodError) {
      const firstError = Object.values(error.flatten().fieldErrors)[0]?.[0];
      return { success: false, message: firstError || "Validation failed." };
    }
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}


// Helper to detect language
function isArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

// This action for FAQ suggestions remains unchanged as it serves a different purpose.
export async function getContactSuggestionsAction(message: string) {
  if (message.length < 10) {
    return { success: false, message: "Message must be at least 10 characters long to get suggestions." };
  }

  try {
    const isArabicInput = isArabic(message);
    const languageHint = isArabicInput ? "in Arabic" : "in English";
    const result = await suggestFaqAction({ userInput: message, languageHint });
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error("Failed to get AI suggestions:", error);
    return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
  }
}


// ========= START: AI CONTEXT AND PROMPT RE-ENGINEERING =========

// Define the shape of the context object the AI will receive
interface AIContext {
  description: string;
  beneficiaryType?: string;
  requestType?: string;
}

// The main AI generation action is now context-aware
export async function generateProjectIdeaAction(context: AIContext) {
  if (context.description.length < 20) {
    return { success: false, message: "Description must be at least 20 characters long." };
  }

  try {
    const locale = await getLocale();
    const language = locale === 'ar' ? 'Arabic' : 'English';

    // The new, smarter prompt that provides full context to the AI
    const enhancedPrompt = `
As an expert project consultant, rewrite the following user request into a more professional and detailed project brief.
The final output MUST be formatted using Markdown (e.g., headings, bullet points, bold text).

Here is the user's context:
- Beneficiary Type: ${context.beneficiaryType || "[Please specify the beneficiary type]"}
- Request Type: ${context.requestType || "[Please specify the request type]"}
- User's Initial Description: "${context.description || "[Please provide a description]"}"

Your tasks:
1. Synthesize ALL the information above into a coherent brief that explicitly reflects the **Beneficiary Type** and the **Request Type**.
2. Adapt the rewritten brief so that it naturally aligns with the **given request type** (e.g., "Problem Solving", "New Project Proposal", "Technical Support", etc.).
3. Ensure that the perspective and tone are appropriate for the **specified beneficiary type** (e.g., student, company, NGO).
4. Enrich the description with professional terminology, making it clearer and more structured.
5. If the user's description is vague or missing critical information for the given request type, you MUST insert a clear placeholder in the text, like "[Please specify the programming language being used]" or "[Please describe the target audience]".
6. The entire response MUST be in ${language}.
`;

    const result = await generateStructuredIdea({
      // Send the new enhanced prompt instead of the raw description
      projectIdea: enhancedPrompt,
      language
    });

    return { success: true, structuredIdea: result.structuredIdea };
  } catch (error) {
    console.error("Failed to generate structured project idea:", error);
    return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
  }
}

// ========= END: AI CONTEXT AND PROMPT RE-ENGINEERING =========