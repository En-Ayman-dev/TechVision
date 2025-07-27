"use server";

import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function sendContactMessageAction(data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  // In a real application, you would save this to a database.
  // For this demo, we'll just log it to the server console.
  console.log("New contact message received:", validatedFields.data);

  return {
    success: true,
    message: "Thank you for your message! We will get back to you soon.",
  };
}

export async function suggestFaqAction(userInput: string) {
  if (!userInput || userInput.length < 10) {
    return { success: false, suggestions: [] };
  }
  
  try {
    const result = await suggestFaq({ userInput });
    return { success: true, suggestions: result.suggestedFaqs };
  } catch (error) {
    console.error("Error suggesting FAQ:", error);
    return { success: false, suggestions: [] };
  }
}
