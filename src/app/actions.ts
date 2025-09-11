
"use server";
import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";
import { db } from "@/lib/firebase-admin";
import type { Message, Project, TeamMember, Service, Testimonial, SiteSettings, Partner, ThemeSettings, BlogPost } from "@/lib/types";

import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import path from 'path';

import {
  generateDescription,
  generateTestimonialQuote,
} from "@/ai/flows/text-generation";
import { firestore } from "firebase-admin";

import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from "@google/generative-ai";

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider, e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Helper to check if db is initialized
const isDbInitialized = () => db && typeof db.collection === 'function';

// Schemas
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  inquiry: z.string().optional().or(z.literal("")), // Allows empty string or undefined
  beneficiaryType: z.string().optional().or(z.literal("")),
  requestType: z.string().optional().or(z.literal("")),

});

// --- 1. Define the UPDATED schema here ---
// This schema must match the one in your ProjectForm.tsx
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  image: z.string().url("Invalid image URL."),
  dataAiHint: z.string().optional(),
  
  // New optional fields
  detailedDescription: z.string().optional(),
  githubUrl: z.string().url("Invalid GitHub URL.").optional().or(z.literal('')),
  liveUrl: z.string().url("Invalid Live URL.").optional().or(z.literal('')),
});

const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.string().url("Image must be a valid URL."),
  social: z.object({
    twitter: z.string().url().or(z.literal("")).or(z.literal("#")),
    linkedin: z.string().url().or(z.literal("")).or(z.literal("#")),
  }),
  dataAiHint: z.string().optional(),
});

// // --- 1. Define the UPDATED schema for bilingual content ---
// const bilingualContentSchema = z.object({
//   en: z.string().min(1, "English content is required."),
//   ar: z.string().min(1, "Arabic content is required."),
// });

// const serviceFeatureSchema = z.object({
//     title: bilingualContentSchema,
//     description: bilingualContentSchema,
//     icon: z.string().min(1, "Feature icon is required."),
// });

// const serviceSchema = z.object({
//   id: z.string().optional(),
//   slug: z.string().optional(),
//   icon: z.string().min(2, "Icon name is required."),
//   title: bilingualContentSchema,
//   description: bilingualContentSchema,
//   detailedContent: bilingualContentSchema,
//   heroImage: z.string().url("Invalid URL.").optional().or(z.literal('')),
//   features: z.array(serviceFeatureSchema).optional(),
//   dataAiHint: z.string().optional(),
// });


const testimonialSchema = z.object({
  id: z.string().optional(),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  author: z.string().min(2, "Author must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.string().url("Image must be a valid URL."),
  dataAiHint: z.string().optional(),
});

const siteSettingsSchema = z.object({
  stats: z.object({
    satisfaction: z.coerce.number().min(0).max(100),
    projects: z.coerce.number().min(0),
    experience: z.coerce.number().min(0),
    team: z.coerce.number().min(0),
  })
});

const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  logo: z.string().min(2, "Logo name is required."),
  dataAiHint: z.string().optional(),
});

const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;

const themeSettingsSchema = z.object({
  light: z.object({
    background: z.string().regex(hslColorRegex, "Invalid HSL format"),
    primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
    accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
  }),
  dark: z.object({
    background: z.string().regex(hslColorRegex, "Invalid HSL format"),
    primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
    accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
  }),
});


// Firestore Collections (conditional)
const messagesCollection = isDbInitialized() ? db.collection('messages') : null;
const projectsCollection = isDbInitialized() ? db.collection('projects') : null;
const teamCollection = isDbInitialized() ? db.collection('team') : null;
const servicesCollection = isDbInitialized() ? db.collection('services') : null;
const testimonialsCollection = isDbInitialized() ? db.collection('testimonials') : null;
const settingsCollection = isDbInitialized() ? db.collection('settings') : null;
const partnersCollection = isDbInitialized() ? db.collection('partners') : null;
const blogPostsCollection = isDbInitialized() ? db.collection('blogPosts') : null;
const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');


// Message Actions
export async function getMessagesAction(
  limit: number,
  lastVisibleId?: string
): Promise<{ messages: Message[]; lastVisibleId?: string }> {
  if (!messagesCollection) {
    return { messages: [] };
  }

  let query = messagesCollection.orderBy('submittedAt', 'desc').limit(limit);

  if (lastVisibleId) {
    const lastDoc = await messagesCollection.doc(lastVisibleId).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  const snapshot = await query.get();
  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as Message[];

  let newLastVisibleId: string | undefined;
  if (snapshot.docs.length > 0) {
    newLastVisibleId = snapshot.docs[snapshot.docs.length - 1].id;
  }

  return { messages, lastVisibleId: newLastVisibleId };
}
// **الدالة الجديدة المطلوبة**
export async function getMessageById(id: string) {
  if (!messagesCollection) return null;
  try {
    const doc = await messagesCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as Message;
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    return null;
  }
}

// Add 'export' keyword to make the function accessible
export async function sendContactMessageAction(data: z.infer<typeof contactSchema>) {
  if (!messagesCollection) return { success: false, message: "Database not configured." };
  const validatedFields = contactSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const newMessage = {
      ...validatedFields.data,
      submittedAt: new Date().toISOString()
    };
    await messagesCollection.add(newMessage);
    revalidatePath("/[locale]/admin/messages", "page");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Message sent!" };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred." };
  }
}
export async function deleteMessageAction(id: string) {
  if (!messagesCollection) return { success: false, message: "Database not configured." };
  try {
    await messagesCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/messages", "page");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Message deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete message." };
  }
}

// New action to handle sending a reply
const replySchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(10),
});

export async function sendReplyAction(data: z.infer<typeof replySchema>) {
  const validatedFields = replySchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, message: "Validation failed." };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: validatedFields.data.to,
      subject: validatedFields.data.subject,
      html: `
        <p>Hello,</p>
        <p>This is a reply to your message:</p>
        <p><strong>${validatedFields.data.body}</strong></p>
        <p>Thank you.</p>
      `
    });

    return { success: true, message: "Reply sent successfully." };
  } catch (error) {
    console.error("Failed to send reply:", error);
    return { success: false, message: "Failed to send reply. Please check your email service configuration." };
  }
}



export async function suggestFaqAction(input: { userInput: string; languageHint: string }) {
  if (!input.userInput || input.userInput.length < 10) return { success: false, suggestions: [] };
  try {
    const result = await suggestFaq(input);
    return { success: true, suggestions: result.suggestedFaqs };
  } catch (error) {
    console.error("Error suggesting FAQ:", error);
    return { success: false, suggestions: [] };
  }
}


// --- 2. Your Project Actions (Unchanged and Updated) ---

// This action does not need any changes.
export async function getProjectsAction(): Promise<Project[]> {
  if (!projectsCollection) return [];
  const snapshot = await projectsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Project));
}

// This action is now updated to handle the new fields correctly.
export async function addProjectAction(data: z.infer<typeof projectSchema>) {
  if (!projectsCollection) return { success: false, message: "Database not configured." };
  
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    // The validated data now includes the new optional fields.
    // The spread operator will automatically include them in the new project document.
    const { id, ...projectData } = validatedFields.data;
    await projectsCollection.add(projectData);
    
    revalidatePath("/[locale]/admin/projects", "page");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Project added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add project." };
  }
}

// This action is now updated to handle the new fields correctly.
export async function updateProjectAction(data: z.infer<typeof projectSchema>) {
  if (!projectsCollection) return { success: false, message: "Database not configured." };
  
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    // The validated data now includes the new optional fields.
    // The spread operator + merge:true will add/update them correctly.
    const { id, ...projectData } = validatedFields.data;
    if (!id) throw new Error("Project ID is missing.");
    
    await projectsCollection.doc(id).set(projectData, { merge: true });
    
    revalidatePath("/[locale]/admin/projects", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Project updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update project." };
  }
}

// This action does not need any changes.
export async function deleteProjectAction(id: string) {
  if (!projectsCollection) return { success: false, message: "Database not configured." };
  try {
    await projectsCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/projects", "page");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Project deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete project." };
  }
}


// Team Member Actions
export async function getTeamAction(): Promise<TeamMember[]> {
  if (!teamCollection) return [];
  const snapshot = await teamCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as TeamMember));
}

export async function addTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
  if (!teamCollection) return { success: false, message: "Database not configured." };
  const validatedFields = teamMemberSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...memberData } = validatedFields.data;
    await teamCollection.add(memberData);
    revalidatePath("/[locale]/admin/team", "page");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Team member added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add team member." };
  }
}

export async function updateTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
  if (!teamCollection) return { success: false, message: "Database not configured." };
  const validatedFields = teamMemberSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...memberData } = validatedFields.data;
    if (!id) throw new Error("Team member ID is missing.");
    await teamCollection.doc(id).set(memberData, { merge: true });
    revalidatePath("/[locale]/admin/team", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Team member updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update team member." };
  }
}

export async function deleteTeamMemberAction(id: string) {
  if (!teamCollection) return { success: false, message: "Database not configured." };
  try {
    await teamCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/team", "page");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/admin", "page");
    return { success: true, message: "Team member deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete team member." };
  }
}

// // --- 2. NEW Action to get a single service by its slug ---
// export async function getServiceBySlugAction(slug: string): Promise<Service | null> {
//   // FIX: Added null check for servicesCollection
//   if (!servicesCollection) {
//     console.error("Services collection is not configured.");
//     return null;
//   }
//   try {
//     const decodedSlug = decodeURIComponent(slug);
//     const snapshot = await servicesCollection.where('slug', '==', decodedSlug).limit(1).get();
//     if (snapshot.empty) {
//       return null;
//     }
//     const doc = snapshot.docs[0];
//     return { id: doc.id, ...doc.data() } as Service;
//   } catch (error) {
//     console.error(`Failed to fetch service by slug "${slug}":`, error);
//     return null;
//   }
// }

// // Service Actions
// export async function getServicesAction(): Promise<Service[]> {
//   if (!servicesCollection) return [];
//   const snapshot = await servicesCollection.get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Service));
// }

// // --- 3. UPDATED Action to handle new structure ---
// export async function addServiceAction(data: z.infer<typeof serviceSchema>) {
//   if (!servicesCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = serviceSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...serviceData } = validatedFields.data;
//     const slug = generateSlug(serviceData.title.en); // Generate slug from English title

//     await servicesCollection.add({ ...serviceData, slug });
//     revalidatePath("/[locale]/admin/services", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Service added successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to add service." };
//   }
// }

// // --- 4. UPDATED Action to handle new structure ---
// export async function updateServiceAction(data: z.infer<typeof serviceSchema>) {
//   if (!servicesCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = serviceSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...serviceData } = validatedFields.data;
//     if (!id) throw new Error("Service ID is missing.");
//     const slug = generateSlug(serviceData.title.en); // Re-generate slug in case title changes

//     await servicesCollection.doc(id).set({ ...serviceData, slug }, { merge: true });
//     revalidatePath("/[locale]/admin/services", "page");
//     revalidatePath("/", "layout");
//     revalidatePath(`/[locale]/services/${slug}`, "page"); // Revalidate the specific service page
//     return { success: true, message: "Service updated successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to update service." };
//   }
// }

// export async function deleteServiceAction(id: string) {
//   if (!servicesCollection) return { success: false, message: "Database not configured." };
//   try {
//     await servicesCollection.doc(id).delete();
//     revalidatePath("/[locale]/admin/services", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Service deleted." };
//   } catch (error) {
//     return { success: false, message: "Failed to delete service." };
//   }
// }

// Testimonial Actions
export async function getTestimonialsAction(): Promise<Testimonial[]> {
  if (!testimonialsCollection) return [];
  const snapshot = await testimonialsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Testimonial));
}

export async function addTestimonialAction(data: z.infer<typeof testimonialSchema>) {
  if (!testimonialsCollection) return { success: false, message: "Database not configured." };
  const validatedFields = testimonialSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...testimonialData } = validatedFields.data;
    await testimonialsCollection.add(testimonialData);
    revalidatePath("/[locale]/admin/testimonials", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Testimonial added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add testimonial." };
  }
}

export async function updateTestimonialAction(data: z.infer<typeof testimonialSchema>) {
  if (!testimonialsCollection) return { success: false, message: "Database not configured." };
  const validatedFields = testimonialSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...testimonialData } = validatedFields.data;
    if (!id) throw new Error("Testimonial ID is missing.");
    await testimonialsCollection.doc(id).set(testimonialData, { merge: true });
    revalidatePath("/[locale]/admin/testimonials", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Testimonial updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update testimonial." };
  }
}

export async function deleteTestimonialAction(id: string) {
  if (!testimonialsCollection) return { success: false, message: "Database not configured." };
  try {
    await testimonialsCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/testimonials", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Testimonial deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete testimonial." };
  }
}


// Site Settings Actions
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  if (!settingsCollection) {
    return { stats: { satisfaction: 0, projects: 0, experience: 0, team: 0 } };
  }
  const doc = await settingsCollection.doc('main').get();
  if (!doc.exists) {
    // Create default settings if they don't exist
    const defaultSettings: SiteSettings = {
      stats: { satisfaction: 98, projects: 150, experience: 12, team: 42 }
    };
    await settingsCollection.doc('main').set(defaultSettings);
    return defaultSettings;
  }
  return doc.data() as SiteSettings;
}

export async function updateSiteSettingsAction(data: z.infer<typeof siteSettingsSchema>) {
  if (!settingsCollection) return { success: false, message: "Database not configured." };
  const validatedFields = siteSettingsSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    await settingsCollection.doc('main').set(validatedFields.data, { merge: true });
    revalidatePath("/[locale]/admin/settings", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Settings updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update settings." };
  }
}

// Partner Actions
export async function getPartnersAction(): Promise<Partner[]> {
  if (!partnersCollection) return [];
  const snapshot = await partnersCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Partner));
}

export async function addPartnerAction(data: z.infer<typeof partnerSchema>) {
  if (!partnersCollection) return { success: false, message: "Database not configured." };
  const validatedFields = partnerSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...partnerData } = validatedFields.data;
    await partnersCollection.add(partnerData);
    revalidatePath("/[locale]/admin/partners", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Partner added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add partner." };
  }
}

export async function updatePartnerAction(data: z.infer<typeof partnerSchema>) {
  if (!partnersCollection) return { success: false, message: "Database not configured." };
  const validatedFields = partnerSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...partnerData } = validatedFields.data;
    if (!id) throw new Error("Partner ID is missing.");
    await partnersCollection.doc(id).set(partnerData, { merge: true });
    revalidatePath("/[locale]/admin/partners", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Partner updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update partner." };
  }
}

export async function deletePartnerAction(id: string) {
  if (!partnersCollection) return { success: false, message: "Database not configured." };
  try {
    await partnersCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/partners", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Partner deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete partner." };
  }
}

// Theme Settings Actions
function parseHsl(css: string): ThemeSettings {
  const settings: ThemeSettings = {
    light: { background: '', primary: '', accent: '' },
    dark: { background: '', primary: '', accent: '' },
  };

  const lightBgMatch = css.match(/:root\s*\{[^}]*--background:\s*([^;]+);/);
  if (lightBgMatch) settings.light.background = lightBgMatch[1].trim();

  const lightPrimaryMatch = css.match(/:root\s*\{[^}]*--primary:\s*([^;]+);/);
  if (lightPrimaryMatch) settings.light.primary = lightPrimaryMatch[1].trim();

  const lightAccentMatch = css.match(/:root\s*\{[^}]*--accent:\s*([^;]+);/);
  if (lightAccentMatch) settings.light.accent = lightAccentMatch[1].trim();

  const darkBlockMatch = css.match(/\.dark\s*\{([^}]+)\}/);
  if (darkBlockMatch) {
    const darkCss = darkBlockMatch[1];
    const darkBgMatch = darkCss.match(/--background:\s*([^;]+);/);
    if (darkBgMatch) settings.dark.background = darkBgMatch[1].trim();

    const darkPrimaryMatch = darkCss.match(/--primary:\s*([^;]+);/);
    if (darkPrimaryMatch) settings.dark.primary = darkPrimaryMatch[1].trim();

    const darkAccentMatch = darkCss.match(/--accent:\s*([^;]+);/);
    if (darkAccentMatch) settings.dark.accent = darkAccentMatch[1].trim();
  }

  return settings;
}

export async function getThemeSettingsAction(): Promise<ThemeSettings> {
  const cssContent = await fs.readFile(globalsCssPath, 'utf8');
  return parseHsl(cssContent);
}

export async function updateThemeSettingsAction(data: z.infer<typeof themeSettingsSchema>) {
  const validatedFields = themeSettingsSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    let cssContent = await fs.readFile(globalsCssPath, 'utf8');
    const { light, dark } = validatedFields.data;

    // Update light theme variables in :root
    cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--background:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.background}$2`);
    cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--primary:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.primary}$2`);
    cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--accent:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.accent}$2`);

    // Update dark theme variables in .dark
    cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--background:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.background}$2`);
    cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--primary:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.primary}$2`);
    cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--accent:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.accent}$2`);

    await fs.writeFile(globalsCssPath, cssContent, 'utf8');
    revalidatePath("/", "layout");
    return { success: true, message: "Theme updated successfully." };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, message: "Failed to update theme file." };
  }
}


// The Schema remains the same
const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().optional(), 
  featuredImage: z.string().url("Invalid image URL.").optional().or(z.literal('')),
  content: z.string().min(10, "Content must be at least 10 characters."),
  excerpt: z.string().optional(),
  author: z.string().min(2, "Author must be at least 2 characters."),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(2, "Category must be at least 2 characters."),
  views: z.number().optional(),
  likes: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

// --- UPDATED Helper function to generate a URL-friendly slug for both English and Arabic ---
const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        // Remove specific punctuation marks but keep Arabic and English characters
        .replace(/[.:,;?_&]/g, '') 
        .replace(/[^a-z0-9\s\-\u0600-\u06FF]/g, '') // Allow Arabic characters (Unicode range)
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove duplicate hyphens
}

// NEW Action to get a single post by its slug
export async function getBlogPostBySlugAction(slug: string): Promise<BlogPost | null> {
  try {
    // Decode the slug to handle non-English characters correctly
    const decodedSlug = decodeURIComponent(slug);
    
    const snapshot = await db.collection('blogPosts').where('slug', '==', decodedSlug).limit(1).get();
    
    if (snapshot.empty) {
      console.warn(`No blog post found for slug: ${decodedSlug}`);
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    console.error(`Failed to fetch blog post by slug "${slug}":`, error);
    return null;
  }
}

// Add this function to your src/app/actions.ts file, alongside other blog actions.

export async function getRelatedPostsAction(category: string, currentPostId: string): Promise<BlogPost[]> {
  try {
    const snapshot = await db.collection('blogPosts')
      .where('category', '==', category)
      .where('published', '==', true)
      .limit(4) // Fetch 4 to ensure we can show 3 even if one is the current post
      .get();
      
    const posts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
      .filter(post => post.id !== currentPostId); // Exclude the current post from related posts

    return posts.slice(0, 3); // Return a maximum of 3 related posts
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}


// This action remains mostly the same for fetching all posts
export async function getBlogPostsAction(): Promise<BlogPost[]> {
  try {
    const snapshot = await db.collection('blogPosts').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as unknown as BlogPost));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

// UPDATED Action to automatically create a slug
export async function addBlogPostAction(data: z.infer<typeof blogPostSchema>) {
  const validatedFields = blogPostSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    const { id, ...postData } = validatedFields.data;
    const slug = generateSlug(postData.title);
    
    const postRef = await db.collection('blogPosts').add({
      ...postData,
      slug: slug,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    revalidatePath("/[locale]/admin/blog", "page");
    revalidatePath("/[locale]/blog", "page");
    return { success: true, message: "Blog post added successfully." };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return { success: false, message: "Failed to add blog post." };
  }
}

// UPDATED Action to handle slug updates
export async function updateBlogPostAction(data: z.infer<typeof blogPostSchema>) {
  const validatedFields = blogPostSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    const { id, ...postData } = validatedFields.data;
    if (!id) throw new Error("Post ID is missing.");
    
    const slug = generateSlug(postData.title);
    const postRef = db.collection('blogPosts').doc(id);
    
    await postRef.set({
        ...postData,
        slug: slug,
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    revalidatePath("/[locale]/admin/blog", "page");
    revalidatePath("/[locale]/blog", "page");
    revalidatePath(`/[locale]/blog/${slug}`, "page");
    return { success: true, message: "Blog post updated successfully." };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, message: "Failed to update blog post." };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await db.collection('blogPosts').doc(id).delete();
    revalidatePath("/[locale]/admin/blog", "page");
    revalidatePath("/[locale]/blog", "page");
    return { success: true, message: "Blog post deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete blog post." };
  }
}

// =============================================================================
// AI Generation Actions
// =============================================================================

export async function generateProjectDescriptionAction(title: string) {
  if (!title) return { success: false, description: null, message: "Title is required." };
  try {
    const result = await generateDescription({ type: 'project', topic: title });
    return { success: true, description: result.description };
  } catch (error) {
    console.error("Error generating project description:", error);
    return { success: false, description: null, message: "AI generation failed." };
  }
}

export async function generateServiceDescriptionAction(title: string) {
  if (!title) return { success: false, description: null, message: "Title is required." };
  try {
    const result = await generateDescription({ type: 'service', topic: title });
    return { success: true, description: result.description };
  } catch (error) {
    console.error("Error generating service description:", error);
    return { success: false, description: null, message: "AI generation failed." };
  }
}

export async function generateTestimonialQuoteAction(authorName: string) {
  if (!authorName) return { success: false, quote: null, message: "Author name is required." };
  try {
    const result = await generateTestimonialQuote({ authorName });
    return { success: true, quote: result.quote };
  } catch (error) {
    console.error("Error generating testimonial quote:", error);
    return { success: false, quote: null, message: "AI generation failed." };
  }
}

// Initialize the Generative AI client
// IMPORTANT: You must set your GEMINI_API_KEY in your environment variables (.env.local)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Zod schema for the expected AI output
const aiResponseSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
});

// --- NEW AI Blog Post Generation Action (FINAL FIX) ---
export async function generateBlogPostAction(title: string, language: 'ar' | 'en') {
  if (!title) {
    return { success: false, message: "Title is required to generate a blog post." };
  }
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Google API key is not configured on the server.");
    return { success: false, message: "AI service is not configured correctly." };
  }

  const langInstruction = language === 'ar' ? "in Arabic" : "in English";

  const prompt = `
    Act as an expert tech blogger, content creator, and SEO specialist. Your audience consists of developers, tech enthusiasts, and business owners.
    Your task is to generate a complete, engaging, and SEO-optimized blog post based on the following title: "${title}".

    The entire response must be ${langInstruction}.

    Please provide the output in a structured JSON format. The JSON object must contain the following keys:
    - "title": A catchy, SEO-friendly title. You can slightly improve the original title if you see fit.
    - "excerpt": A short, compelling summary of the post, perfect for SEO meta descriptions (around 150-160 characters).
    - "content": The full blog post content, formatted in clean HTML. Use tags like <h2>, <h3>, <p>, <ul>, <li>, and <strong> to structure the content logically and make it readable. The content should be comprehensive, informative, and well-written.
    - "category": A single, relevant category for the post (e.g., "Web Development", "Artificial Intelligence", "Data Science").
    - "tags": An array of 3 to 5 relevant keywords/tags as strings.

    The tone should be professional yet accessible. Ensure the HTML is valid. Your entire response must be ONLY the raw JSON object, without any surrounding text, comments, or markdown formatting like \`\`\`json.
  `;

  try {
    // --- The Fix is Here: Using the latest stable model name ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedJson = JSON.parse(jsonString);
    
    // Validate the parsed JSON against our schema
    const validatedData = aiResponseSchema.safeParse(parsedJson);

    if (!validatedData.success) {
      console.error("AI response validation failed:", validatedData.error.flatten());
      return { success: false, message: "The AI returned data in an unexpected format. Please try again." };
    }

    return { success: true, data: validatedData.data };

  } catch (error) {
    console.error("Error generating blog post with AI:", error);
    return { success: false, message: "An error occurred while communicating with the AI. Please check the server logs." };
  }
}

// --- 1. SHARED INITIALIZATION & SCHEMAS (DEFINED ONLY ONCE) ---

// Ensure genAI is initialized only once at the top of your file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Shared Zod schema for bilingual content
const bilingualContentSchema = z.object({
  en: z.string().min(1, "English content is required."),
  ar: z.string().min(1, "Arabic content is required."),
});

// Shared Zod schema for a single service feature
const serviceFeatureSchema = z.object({
    title: bilingualContentSchema,
    description: bilingualContentSchema,
    icon: z.string().min(1, "Feature icon is required."),
});

// Schema for data coming FROM THE FORM (for add/update)
const serviceFormSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  icon: z.string().min(2, "Icon name is required."),
  title: bilingualContentSchema,
  description: bilingualContentSchema,
  detailedContent: bilingualContentSchema,
  heroImage: z.string().url("Invalid URL.").optional().or(z.literal('')),
  features: z.array(serviceFeatureSchema).optional(),
  dataAiHint: z.string().optional(),
});

// Schema for data coming FROM THE AI
const aiServiceResponseSchema = z.object({
  title: bilingualContentSchema,
  description: bilingualContentSchema,
  detailedContent: bilingualContentSchema,
  features: z.array(serviceFeatureSchema).min(3).max(3),
});


// --- 2. ALL SERVICE-RELATED ACTIONS ---

// NEW AI Full Service Generation Action
export async function generateFullServiceAction(serviceTitle: string) {
  if (!serviceTitle) {
    return { success: false, message: "Service title is required." };
  }
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Google API key is not configured on the server.");
    return { success: false, message: "AI service is not configured correctly." };
  }

  const prompt = `
    Act as a Chief Marketing Officer and a Principal Solutions Architect for a high-end tech company called "TechVision".
    Your task is to generate a complete, bilingual (English and Arabic) content package for a new service page based on the following service title: "${serviceTitle}".
    The entire response must be a single, raw JSON object. Do not include any markdown formatting like \`\`\`json or any text before or after the JSON object.
    The JSON object must contain the following keys:
    - "title": An object with "en" and "ar" keys for the service title.
    - "description": An object with "en" and "ar" keys for a short, compelling summary (around 150-160 characters), perfect for a service card.
    - "detailedContent": An object with "en" and "ar" keys for the full service page content, formatted in clean HTML. Use tags like <h2>, <h3>, <p>, <ul>, and <li>.
    - "features": An array of exactly 3 feature objects. Each object must contain:
        - "title": An object with "en" and "ar" keys for the feature title.
        - "description": An object with "en" and "ar" keys for the feature description.
        - "icon": A relevant icon name as a string from the lucide-react library (e.g., "CheckCircle2", "Database", "Cloud").
    Ensure all Arabic text is professional and correctly translated. The tone should be expert, confident, and focused on business value.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonString = responseText.trim();
    const parsedJson = JSON.parse(jsonString);
    const validatedData = aiServiceResponseSchema.safeParse(parsedJson);

    if (!validatedData.success) {
      console.error("AI service response validation failed:", validatedData.error.flatten());
      return { success: false, message: "The AI returned data in an unexpected format. Please try again." };
    }
    return { success: true, data: validatedData.data };

  } catch (error) {
    console.error("Error generating full service content with AI:", error);
    return { success: false, message: "An error occurred while communicating with the AI." };
  }
}

// Action to get a single service by its slug
export async function getServiceBySlugAction(slug: string): Promise<Service | null> {
  if (!servicesCollection) { console.error("Services collection is not configured."); return null; }
  try {
    const decodedSlug = decodeURIComponent(slug);
    const snapshot = await servicesCollection.where('slug', '==', decodedSlug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Service;
  } catch (error) {
    console.error(`Failed to fetch service by slug "${slug}":`, error);
    return null;
  }
}

// Action to get all services
export async function getServicesAction(): Promise<Service[]> {
  if (!servicesCollection) return [];
  const snapshot = await servicesCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Service));
}

// Action to add a new service
export async function addServiceAction(data: z.infer<typeof serviceFormSchema>) {
  if (!servicesCollection) return { success: false, message: "Database not configured." };
  const validatedFields = serviceFormSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...serviceData } = validatedFields.data;
    const slug = generateSlug(serviceData.title.en);
    await servicesCollection.add({ ...serviceData, slug });
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Service added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add service." };
  }
}

// Action to update an existing service
export async function updateServiceAction(data: z.infer<typeof serviceFormSchema>) {
  if (!servicesCollection) return { success: false, message: "Database not configured." };
  const validatedFields = serviceFormSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...serviceData } = validatedFields.data;
    if (!id) throw new Error("Service ID is missing.");
    const slug = generateSlug(serviceData.title.en);
    await servicesCollection.doc(id).set({ ...serviceData, slug }, { merge: true });
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/", "layout");
    revalidatePath(`/[locale]/services/${slug}`, "page");
    return { success: true, message: "Service updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update service." };
  }
}

// Action to delete a service
export async function deleteServiceAction(id: string) {
  if (!servicesCollection) return { success: false, message: "Database not configured." };
  try {
    await servicesCollection.doc(id).delete();
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Service deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete service." };
  }
}

// =============================================================================
// Contact Form Actions (Missing)
// =============================================================================

export async function addMessageAction(name: string, email: string, message: string) {
  if (!messagesCollection) return { success: false, message: "Database not configured." };
  try {
    await messagesCollection.add({
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    });
    revalidatePath("/ar");
    return { success: true, message: "Message sent successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
