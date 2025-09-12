// "use server";

// import { sendContactMessageAction, suggestFaqAction } from "@/app/actions";
// import { revalidatePath } from "next/cache";
// import { generateStructuredIdea } from "@/ai/flows/text-generation";
// import { getLocale } from "next-intl/server";
// import * as z from "zod";

// // The form data is already validated on the client by the hook.
// // This action now directly forwards the validated data.
// export async function sendMessageAction(data: FormData) {
//   try {
//     // We can create a simple object from FormData for the main action
//     const messageData = {
//       name: data.get("name") as string,
//       email: data.get("email") as string,
//       message: data.get("message") as string,
//       inquiry: data.get("projectIdea") as string || "No specific inquiry.",
//       beneficiaryType: data.get("beneficiaryType") as string,
//       requestType: data.get("requestType") as string,
//       preferredContactMethod: data.get("preferredContactMethod") as string,
//       contactMethodValue: data.get("contactMethodValue") as string,
//     };

//     // Pass the structured data to the main action
//     await sendContactMessageAction(messageData);

//     revalidatePath("/ar");
//     revalidatePath("/en");
//     return { success: true, message: "Message sent successfully!" };
//   } catch (error) {
//     console.error("Failed to add message:", error);
//     // Check if it's a Zod validation error from the nested action
//     if (error instanceof z.ZodError) {
//       const firstError = Object.values(error.flatten().fieldErrors)[0]?.[0];
//       return { success: false, message: firstError || "Validation failed." };
//     }
//     return { success: false, message: "Failed to send message. Please try again later." };
//   }
// }


// // Helper to detect language
// function isArabic(text: string) {
//   const arabicRegex = /[\u0600-\u06FF]/;
//   return arabicRegex.test(text);
// }

// // This action for FAQ suggestions remains unchanged as it serves a different purpose.
// export async function getContactSuggestionsAction(message: string) {
//   if (message.length < 10) {
//     return { success: false, message: "Message must be at least 10 characters long to get suggestions." };
//   }

//   try {
//     const isArabicInput = isArabic(message);
//     const languageHint = isArabicInput ? "in Arabic" : "in English";
//     const result = await suggestFaqAction({ userInput: message, languageHint });
//     return { success: true, suggestions: result.suggestions };
//   } catch (error) {
//     console.error("Failed to get AI suggestions:", error);
//     return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
//   }
// }


// // ========= START: AI CONTEXT AND PROMPT RE-ENGINEERING =========

// // Define the shape of the context object the AI will receive
// interface AIContext {
//   description: string;
//   beneficiaryType?: string;
//   requestType?: string;
// }

// // The main AI generation action is now context-aware
// export async function generateProjectIdeaAction(context: AIContext) {
//   if (context.description.length < 20) {
//     return { success: false, message: "Description must be at least 20 characters long." };
//   }

//   try {
//     const locale = await getLocale();
//     const language = locale === 'ar' ? 'Arabic' : 'English';

//     // The new, smarter prompt that provides full context to the AI
//     const enhancedPrompt = `
//             As an expert project consultant, rewrite the following user request into a more professional and detailed project brief.
//             The final output MUST be formatted using Markdown (e.g., headings, bullet points, bold text).

//             Here is the user's context:
//             - Beneficiary Type: ${context.beneficiaryType || "Not specified"}
//             - Request Type: ${context.requestType || "Not specified"}
//             - User's Initial Description: "${context.description}"

//             Your tasks:
//             1.  Synthesize all the information above into a coherent brief.
//             2.  Enrich the description with professional terminology.
//             3.  If the user's description is vague or missing critical information for the given request type (e.g., a "problem solving" request without mentioning the technology), you MUST insert a clear placeholder in the text, like "[Please specify the programming language being used]" or "[Please describe the target audience]".
//             4.  Ensure the entire response is in ${language}.
//         `;

//     const result = await generateStructuredIdea({
//       // Send the new enhanced prompt instead of the raw description
//       projectIdea: enhancedPrompt,
//       language
//     });

//     return { success: true, structuredIdea: result.structuredIdea };
//   } catch (error) {
//     console.error("Failed to generate structured project idea:", error);
//     return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
//   }
// }
// ذكي حسب اختيار المستخدم 
// غبي عبر سويتش 
// // ========= END: AI CONTEXT AND PROMPT RE-ENGINEERING =========
"use server";

import { sendContactMessageAction, suggestFaqAction } from "@/app/actions";
import { revalidatePath } from "next/cache";
import { generateStructuredIdea } from "@/ai/flows/text-generation";
import { getLocale } from "next-intl/server";
import * as z from "zod";

// Forwarding validated data directly. Client-side hook handles validation.
export async function sendMessageAction(data: FormData) {
  try {
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

    await sendContactMessageAction(messageData);

    revalidatePath("/ar");
    revalidatePath("/en");
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Failed to add message:", error);
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

// Unchanged: This action is for general FAQ suggestions.
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


// ========= START: HYPER-INTELLIGENT DYNAMIC PROMPT ENGINE V2 =========

interface AIContext {
  description: string;
  beneficiaryType?: string;
  requestType?: string;
}

/**
 * The new "brain" of the AI. It builds a highly specific prompt
 * based on the user's actual request type, adopting different personas.
 */
function buildDynamicPrompt(context: AIContext, language: string): string {
  const { description, beneficiaryType, requestType } = context;

  // Strict formatting rules applied to all personas.
  const baseInstructions = `
        ---
        **CRITICAL RULES:**
        1.  Your ENTIRE response MUST be in ${language}.
        2.  Your ENTIRE response MUST be formatted in clean, human-readable Markdown. Use '#' for headings and '*' or '-' for bullet points.
        3.  You are STRICTLY FORBIDDEN from using JSON, curly braces {}, or any other code-like syntax in your output. Your output is for direct display to a non-technical user.
    `;

  // Select a persona and mission based on the request type.
  switch (requestType) {
    case 'problemSolving':
    case 'technicalSupport':
      return `
                **Persona:** You are an expert Technical Support Engineer from TechVision.

                **Context:** A user, who is a '${beneficiaryType || 'client'}', is facing a technical issue with their weather website. Their description is: "${description}".

                **Your Mission:** Your goal is to help diagnose the problem, NOT to propose a new project.
                1.  Start with a professional heading: \`# خطة تشخيصية للمشكلة\` (or "Problem Diagnostic Plan" in English).
                2.  Briefly summarize your understanding of the user's issue in one sentence.
                3.  Create a bulleted list under the heading \`## أسئلة لتحديد المشكلة\` (or "Diagnostic Questions") to gather the necessary information. These questions must be intelligent and specific.
                4.  If the user has not mentioned the technology stack, your FIRST question in the list MUST be a clear placeholder, for example: \`* [ما هي لغات البرمجة، أطر العمل، والأدوات المستخدمة في المشروع؟]\`.
                
                ${baseInstructions}
            `;

    case 'graduationProject':
    case 'appDevelopment':
    case 'personalProject':
      return `
                **Persona:** You are a senior Project Manager and Tech Consultant at TechVision.

                **Context:** A '${beneficiaryType || 'client'}' wants to start a new project. Their initial idea is: "${description}".

                **Your Mission:** Transform this idea into a structured, professional-looking "Preliminary Project Brief".
                1.  Create a main heading: \`# ملخص المشروع المبدئي\` (or "Preliminary Project Brief").
                2.  Create the following sections using Markdown subheadings (\`##\`):
                    - **_الهدف من المشروع_ (Project Goal):** A concise summary of what the project aims to achieve.
                    - **_الميزات الرئيسية المقترحة_ (Key Features):** A bulleted list of the core functionalities based on the user's description.
                    - **_الجمهور المستهدف_ (Target Audience):** Who is this project for? If it is not clear from the description, you MUST insert a placeholder: \`* [يرجى وصف الجمهور المستهدف لهذا المشروع.]\`.
                    - **_الخطوات التالية المقترحة_ (Suggested Next Steps):** A bulleted list of actions the user can take next.
                
                ${baseInstructions}
            `;

    case 'partnership':
    case 'businessInquiry':
      return `
                **Persona:** You are a strategic Business Analyst from TechVision.

                **Context:** A '${beneficiaryType || 'contact'}' is proposing a business inquiry or partnership. Their message is: "${description}".

                **Your Mission:** Draft a professional response to structure the inquiry for further discussion.
                1.  Create a main heading: \`# بخصوص استفساركم\` (or "Regarding Your Inquiry").
                2.  Thank the user and professionally summarize your understanding of their proposal.
                3.  Create a section \`## نقاط تحتاج للتوضيح\` (or "Points for Clarification") with a bulleted list of questions to better understand their proposal (e.g., "What are the expected outcomes?").
                
                ${baseInstructions}
            `;

    default:
      return `
                **Persona:** You are a helpful General Assistant from TechVision.
                **Context:** A user has submitted a request. Their description is: "${description}".
                **Your Mission:** Rewrite their request clearly and professionally, formatted in beautiful Markdown. If any part is unclear, ask for clarification with a placeholder like \`* [يرجى تقديم المزيد من التفاصيل حول ...]\`.
                ${baseInstructions}
            `;
  }
}

export async function generateProjectIdeaAction(context: AIContext) {
  if (context.description.length < 20) {
    return { success: false, message: "Description must be at least 20 characters long." };
  }
  try {
    const locale = await getLocale();
    const language = locale === 'ar' ? 'Arabic' : 'English';

    // The "brain" is now called here to generate the perfect prompt
    const hyperIntelligentPrompt = buildDynamicPrompt(context, language);

    const result = await generateStructuredIdea({
      projectIdea: hyperIntelligentPrompt,
      language
    });

    // Clean the result from any markdown code fences that the model might add
    const cleanedResult = result.structuredIdea.replace(/```markdown/g, '').replace(/```/g, '');

    return { success: true, structuredIdea: cleanedResult };
  } catch (error) {
    console.error("Failed to generate structured project idea:", error);
    return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
  }
}
// ========= END: HYPER-INTELLIGENT DYNAMIC PROMPT ENGINE V2 =========

