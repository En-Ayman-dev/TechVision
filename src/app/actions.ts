"use server";

import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";
import { promises as fs } from 'fs';
import path from 'path';
import type { Message, Project, TeamMember } from "@/lib/types";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');
const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json');
const teamFilePath = path.join(process.cwd(), 'data', 'team.json');


async function ensureFileExists(filePath: string, defaultContent: string) {
  try {
    await fs.access(path.dirname(filePath));
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  }
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, defaultContent, 'utf8');
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent) as T[];
}

export async function getMessagesAction(): Promise<Message[]> {
  await ensureFileExists(messagesFilePath, '[]');
  try {
    const messages = await readJsonFile<Message>(messagesFilePath);
    return messages.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
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

  await ensureFileExists(messagesFilePath, '[]');

  try {
    const messages = await readJsonFile<Message>(messagesFilePath);

    const newMessage: Message = {
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

export async function getProjectsAction(): Promise<Project[]> {
  await ensureFileExists(projectsFilePath, '[]');
  try {
    return await readJsonFile<Project>(projectsFilePath);
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}

export async function getTeamAction(): Promise<TeamMember[]> {
  await ensureFileExists(teamFilePath, '[]');
  try {
    return await readJsonFile<TeamMember>(teamFilePath);
  } catch (error) {
    console.error("Error reading team members:", error);
    return [];
  }
}
