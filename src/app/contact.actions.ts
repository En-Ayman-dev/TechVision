
"use server";

import * as z from "zod";
import { sendContactMessageAction, suggestFaqAction } from "@/app/actions";
import { revalidatePath } from "next/cache";

// تم تعديل المخطط ليعكس منطق الواجهة الأمامية الجديد
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(1, "Message cannot be empty."), // الحقل الرئيسي الآن يمكن أن يكون إما فكرة مشروع أو رسالة عامة
  inquiry: z.string().optional(), // حقل جديد للاستفسارات
});

export async function sendMessageAction(data: FormData) {
  const parsed = contactSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message"),
    inquiry: data.get("projectIdea") || "لا يوجد اي استفسار حالياً", // استخدام الحقل الجديد للاستفسارات
  });

  if (!parsed.success) {
    console.error("Validation failed:", parsed.data);
    return { success: false, message: "Validation failed." };
  }

  try {
    // إرسال البيانات كحقول منفصلة إلى دالة sendContactMessageAction
    await sendContactMessageAction(parsed.data);
    revalidatePath("/ar");
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Failed to add message:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}

// دالة جديدة للكشف عن اللغة
function isArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

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

import { generateStructuredIdea } from "@/ai/flows/text-generation";
import { getLocale } from "next-intl/server";

export async function generateProjectIdeaAction(projectIdea: string) {
  if (projectIdea.length < 20) {
    return { success: false, message: "Project idea must be at least 20 characters long." };
  }
  
  try {
    const locale = await getLocale();
    const result = await generateStructuredIdea({ 
      projectIdea, 
      language: locale === 'ar' ? 'Arabic' : 'English' 
    });
    return { success: true, structuredIdea: result.structuredIdea };
  } catch (error) {
    console.error("Failed to generate structured project idea:", error);
    return { success: false, message: "The AI assistant is currently unavailable. Please try again later." };
  }
}

