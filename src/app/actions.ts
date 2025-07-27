"use server";

import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";
import { promises as fs } from 'fs';
import path from 'path';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// The path should be relative to the project root
const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');

// Ensure the data directory and messages.json file exist
async function ensureMessagesFileExists() {
  try {
    await fs.access(path.dirname(messagesFilePath));
  } catch {
    await fs.mkdir(path.dirname(messagesFilePath), { recursive: true });
  }
  try {
    await fs.access(messagesFilePath);
  } catch {
    await fs.writeFile(messagesFilePath, '[]', 'utf8');
  }
}

export async function sendContactMessageAction(data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  await ensureMessagesFileExists();

  try {
    const fileContent = await fs.readFile(messagesFilePath, 'utf8');
    const messages = JSON.parse(fileContent);

    const newMessage = {
      ...validatedFields.data,
      id: new Date().getTime(),
      submittedAt: new Date().toISOString(),
    };

    messages.push(newMessage);

    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');

    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Error saving contact message:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
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
