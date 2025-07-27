
"use server";

import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";
import { promises as fs } from 'fs';
import path from 'path';
import type { Message, Project, TeamMember, Service, Testimonial, SiteSettings } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Schemas
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  image: z.string().url("Image must be a valid URL."),
  dataAiHint: z.string().optional(),
});

const teamMemberSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.string().url("Image must be a valid URL."),
  social: z.object({
    twitter: z.string().url().or(z.literal("")),
    linkedin: z.string().url().or(z.literal("")),
  }),
  dataAiHint: z.string().optional(),
});

const serviceSchema = z.object({
  id: z.number().optional(),
  icon: z.string().min(2, "Icon name is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

const testimonialSchema = z.object({
    id: z.number().optional(),
    quote: z.string().min(10, "Quote must be at least 10 characters."),
    author: z.string().min(2, "Author must be at least 2 characters."),
    role: z.string().min(2, "Role must be at least 2 characters."),
    image: z.string().url("Image must be a valid URL."),
    dataAiHint: z.string().optional(),
});

const siteSettingsSchema = z.object({
    stats: z.object({
        satisfaction: z.number().min(0).max(100),
        projects: z.number().min(0),
        experience: z.number().min(0),
        team: z.number().min(0),
    })
});


// File Paths
const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');
const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json');
const teamFilePath = path.join(process.cwd(), 'data', 'team.json');
const servicesFilePath = path.join(process.cwd(), 'data', 'services.json');
const testimonialsFilePath = path.join(process.cwd(), 'data', 'testimonials.json');
const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

// File System Utilities
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

async function readJsonFile<T>(filePath: string, isArray = true): Promise<T> {
    await ensureFileExists(filePath, isArray ? '[]' : '{}');
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent) as T;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return (isArray ? [] : {}) as T;
    }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        throw new Error(`Could not write to file ${filePath}`);
    }
}

// Generic CRUD Actions
async function createItem<T>(filePath: string, item: T, items: T[]): Promise<void> {
    const newItem = { ...item, id: new Date().getTime() };
    items.push(newItem);
    await writeJsonFile(filePath, items);
}

async function updateItem<T extends { id?: number }>(filePath: string, updatedItem: T, items: T[]): Promise<void> {
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index === -1) throw new Error("Item not found");
    items[index] = updatedItem;
    await writeJsonFile(filePath, items);
}

async function deleteItem(filePath: string, id: number, items: { id: number }[]): Promise<void> {
    const newItems = items.filter(item => item.id !== id);
    if (newItems.length === items.length) throw new Error("Item not found");
    await writeJsonFile(filePath, newItems);
}


// Message Actions
export async function getMessagesAction(): Promise<Message[]> {
  const messages = await readJsonFile<Message[]>(messagesFilePath);
  return messages.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function sendContactMessageAction(data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const messages = await readJsonFile<Message[]>(messagesFilePath);
    const newMessage: Message = { ...validatedFields.data, id: new Date().getTime(), submittedAt: new Date().toISOString() };
    messages.push(newMessage);
    await writeJsonFile(messagesFilePath, messages);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true, message: "Message sent!" };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteMessageAction(id: number) {
  try {
    const messages = await readJsonFile<Message[]>(messagesFilePath);
    await deleteItem(messagesFilePath, id, messages);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true, message: "Message deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete message." };
  }
}


// FAQ Suggestion Action
export async function suggestFaqAction(userInput: string) {
  if (!userInput || userInput.length < 10) return { success: false, suggestions: [] };
  try {
    const result = await suggestFaq({ userInput });
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error("Error suggesting FAQ:", error);
    return { success: false, suggestions: [] };
  }
}


// Project Actions
export async function getProjectsAction(): Promise<Project[]> {
  return await readJsonFile<Project[]>(projectsFilePath);
}

export async function addProjectAction(data: z.infer<typeof projectSchema>) {
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const projects = await readJsonFile<Project[]>(projectsFilePath);
    await createItem<Project>(projectsFilePath, validatedFields.data, projects);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Project added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add project." };
  }
}

export async function updateProjectAction(data: z.infer<typeof projectSchema>) {
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const projects = await readJsonFile<Project[]>(projectsFilePath);
    await updateItem<Project>(projectsFilePath, validatedFields.data, projects);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true, message: "Project updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update project." };
  }
}

export async function deleteProjectAction(id: number) {
  try {
    const projects = await readJsonFile<Project[]>(projectsFilePath);
    await deleteItem(projectsFilePath, id, projects);
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Project deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete project." };
  }
}


// Team Member Actions
export async function getTeamAction(): Promise<TeamMember[]> {
  return await readJsonFile<TeamMember[]>(teamFilePath);
}

export async function addTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
    const validatedFields = teamMemberSchema.safeParse(data);
    if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

    try {
        const teamMembers = await readJsonFile<TeamMember[]>(teamFilePath);
        await createItem<TeamMember>(teamFilePath, validatedFields.data, teamMembers);
        revalidatePath("/admin/team");
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true, message: "Team member added successfully." };
    } catch (error) {
        return { success: false, message: "Failed to add team member." };
    }
}

export async function updateTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
    const validatedFields = teamMemberSchema.safeParse(data);
    if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
    
    try {
        const teamMembers = await readJsonFile<TeamMember[]>(teamFilePath);
        await updateItem<TeamMember>(teamFilePath, validatedFields.data, teamMembers);
        revalidatePath("/admin/team");
        revalidatePath("/");
        return { success: true, message: "Team member updated successfully." };
    } catch (error) {
        return { success: false, message: "Failed to update team member." };
    }
}

export async function deleteTeamMemberAction(id: number) {
    try {
        const teamMembers = await readJsonFile<TeamMember[]>(teamFilePath);
        await deleteItem(teamFilePath, id, teamMembers);
        revalidatePath("/admin/team");
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true, message: "Team member deleted." };
    } catch (error) {
        return { success: false, message: "Failed to delete team member." };
    }
}


// Service Actions
export async function getServicesAction(): Promise<Service[]> {
  return await readJsonFile<Service[]>(servicesFilePath);
}

export async function addServiceAction(data: z.infer<typeof serviceSchema>) {
  const validatedFields = serviceSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const services = await readJsonFile<Service[]>(servicesFilePath);
    await createItem<Service>(servicesFilePath, validatedFields.data, services);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, message: "Service added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add service." };
  }
}

export async function updateServiceAction(data: z.infer<typeof serviceSchema>) {
  const validatedFields = serviceSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const services = await readJsonFile<Service[]>(servicesFilePath);
    await updateItem<Service>(servicesFilePath, validatedFields.data, services);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, message: "Service updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update service." };
  }
}

export async function deleteServiceAction(id: number) {
  try {
    const services = await readJsonFile<Service[]>(servicesFilePath);
    await deleteItem(servicesFilePath, id, services);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, message: "Service deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete service." };
  }
}

// Testimonial Actions
export async function getTestimonialsAction(): Promise<Testimonial[]> {
  return await readJsonFile<Testimonial[]>(testimonialsFilePath);
}

export async function addTestimonialAction(data: z.infer<typeof testimonialSchema>) {
    const validatedFields = testimonialSchema.safeParse(data);
    if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

    try {
        const testimonials = await readJsonFile<Testimonial[]>(testimonialsFilePath);
        await createItem<Testimonial>(testimonialsFilePath, validatedFields.data, testimonials);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial added successfully." };
    } catch (error) {
        return { success: false, message: "Failed to add testimonial." };
    }
}

export async function updateTestimonialAction(data: z.infer<typeof testimonialSchema>) {
    const validatedFields = testimonialSchema.safeParse(data);
    if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

    try {
        const testimonials = await readJsonFile<Testimonial[]>(testimonialsFilePath);
        await updateItem<Testimonial>(testimonialsFilePath, validatedFields.data, testimonials);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial updated successfully." };
    } catch (error) {
        return { success: false, message: "Failed to update testimonial." };
    }
}

export async function deleteTestimonialAction(id: number) {
    try {
        const testimonials = await readJsonFile<Testimonial[]>(testimonialsFilePath);
        await deleteItem(testimonialsFilePath, id, testimonials);
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true, message: "Testimonial deleted." };
    } catch (error) {
        return { success: false, message: "Failed to delete testimonial." };
    }
}


// Site Settings Actions
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  return await readJsonFile<SiteSettings>(settingsFilePath, false);
}

export async function updateSiteSettingsAction(data: z.infer<typeof siteSettingsSchema>) {
    const validatedFields = siteSettingsSchema.safeParse(data);
    if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

    try {
        await writeJsonFile<SiteSettings>(settingsFilePath, validatedFields.data);
        revalidatePath("/admin/settings");
        revalidatePath("/");
        return { success: true, message: "Settings updated successfully." };
    } catch (error) {
        return { success: false, message: "Failed to update settings." };
    }
}
