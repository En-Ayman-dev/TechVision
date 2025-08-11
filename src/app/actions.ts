
// "use server";
// import { z } from "zod";
// import { suggestFaq } from "@/ai/flows/faq-suggestions";
// import { db } from "@/lib/firebase-admin";
// // import type { BlogPost } from "@/components/blog/blog-system";

// // import type { Message, Project, TeamMember, Service, Testimonial, SiteSettings, Partner, ThemeSettings } from "@/lib/types";
// import type { Message, Project, TeamMember, Service, Testimonial, SiteSettings, Partner, ThemeSettings, BlogPost } from "@/lib/types";

// import { revalidatePath } from "next/cache";
// import { promises as fs } from 'fs';
// import path from 'path';

// import {
//   generateDescription,
//   generateTestimonialQuote,
// } from "@/ai/flows/text-generation";
// import { firestore } from "firebase-admin";



// // Helper to check if db is initialized
// const isDbInitialized = () => db && typeof db.collection === 'function';

// // Schemas
// const contactSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters." }),
//   email: z.string().email({ message: "Please enter a valid email address." }),
//   message: z.string().min(10, { message: "Message must be at least 10 characters." }),
// });

// const projectSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().min(2, "Title must be at least 2 characters."),
//   category: z.string().min(2, "Category must be at least 2 characters."),
//   description: z.string().min(10, "Description must be at least 10 characters."),
//   image: z.string().url("Image must be a valid URL."),
//   dataAiHint: z.string().optional(),
// });

// const teamMemberSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(2, "Name must be at least 2 characters."),
//   role: z.string().min(2, "Role must be at least 2 characters."),
//   image: z.string().url("Image must be a valid URL."),
//   social: z.object({
//     twitter: z.string().url().or(z.literal("")).or(z.literal("#")),
//     linkedin: z.string().url().or(z.literal("")).or(z.literal("#")),
//   }),
//   dataAiHint: z.string().optional(),
// });

// const serviceSchema = z.object({
//   id: z.string().optional(),
//   icon: z.string().min(2, "Icon name is required."),
//   title: z.string().min(2, "Title must be at least 2 characters."),
//   description: z.string().min(10, "Description must be at least 10 characters."),
//   dataAiHint: z.string().optional(),
// });

// const testimonialSchema = z.object({
//     id: z.string().optional(),
//     quote: z.string().min(10, "Quote must be at least 10 characters."),
//     author: z.string().min(2, "Author must be at least 2 characters."),
//     role: z.string().min(2, "Role must be at least 2 characters."),
//     image: z.string().url("Image must be a valid URL."),
//     dataAiHint: z.string().optional(),
// });

// const siteSettingsSchema = z.object({
//     stats: z.object({
//         satisfaction: z.coerce.number().min(0).max(100),
//         projects: z.coerce.number().min(0),
//         experience: z.coerce.number().min(0),
//         team: z.coerce.number().min(0),
//     })
// });

// const partnerSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(2, "Name must be at least 2 characters."),
//   logo: z.string().min(2, "Logo name is required."),
//   dataAiHint: z.string().optional(),
// });

// const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;

// const themeSettingsSchema = z.object({
//   light: z.object({
//     background: z.string().regex(hslColorRegex, "Invalid HSL format"),
//     primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
//     accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
//   }),
//   dark: z.object({
//     background: z.string().regex(hslColorRegex, "Invalid HSL format"),
//     primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
//     accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
//   }),
// });


// // Firestore Collections (conditional)
// const messagesCollection = isDbInitialized() ? db.collection('messages') : null;
// const projectsCollection = isDbInitialized() ? db.collection('projects') : null;
// const teamCollection = isDbInitialized() ? db.collection('team') : null;
// const servicesCollection = isDbInitialized() ? db.collection('services') : null;
// const testimonialsCollection = isDbInitialized() ? db.collection('testimonials') : null;
// const settingsCollection = isDbInitialized() ? db.collection('settings') : null;
// const partnersCollection = isDbInitialized() ? db.collection('partners') : null;
// const blogPostsCollection = isDbInitialized() ? db.collection('blogPosts') : null;
// const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');


// // Message Actions
// export async function getMessagesAction(): Promise<Message[]> {
//   if (!messagesCollection) return [];
//   const snapshot = await messagesCollection.orderBy('submittedAt', 'desc').get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Message));
// }

// export async function sendContactMessageAction(data: z.infer<typeof contactSchema>) {
//   if (!messagesCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = contactSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const newMessage = { 
//         ...validatedFields.data, 
//         submittedAt: new Date().toISOString() 
//     };
//     await messagesCollection.add(newMessage);
//     revalidatePath("/[locale]/admin/messages", "page");
//     revalidatePath("/[locale]/admin", "page");
//     return { success: true, message: "Message sent!" };
//   } catch (error) {
//     return { success: false, message: "An unexpected error occurred." };
//   }
// }

// export async function deleteMessageAction(id: string) {
//   if (!messagesCollection) return { success: false, message: "Database not configured." };
//   try {
//     await messagesCollection.doc(id).delete();
//     revalidatePath("/[locale]/admin/messages", "page");
//     revalidatePath("/[locale]/admin", "page");
//     return { success: true, message: "Message deleted." };
//   } catch (error) {
//     return { success: false, message: "Failed to delete message." };
//   }
// }


// export async function suggestFaqAction(input: { userInput: string; languageHint: string }) {
//   if (!input.userInput || input.userInput.length < 10) return { success: false, suggestions: [] };
//   try {
//     const result = await suggestFaq(input);
//     return { success: true, suggestions: result.suggestedFaqs };
//   } catch (error) {
//     console.error("Error suggesting FAQ:", error);
//     return { success: false, suggestions: [] };
//   }
// }


// // Project Actions
// export async function getProjectsAction(): Promise<Project[]> {
//   if (!projectsCollection) return [];
//   const snapshot = await projectsCollection.get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Project));
// }

// export async function addProjectAction(data: z.infer<typeof projectSchema>) {
//   if (!projectsCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = projectSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...projectData } = validatedFields.data;
//     await projectsCollection.add(projectData);
//     revalidatePath("/[locale]/admin/projects", "page");
//     revalidatePath("/", "layout");
//     revalidatePath("/[locale]/admin", "page");
//     return { success: true, message: "Project added successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to add project." };
//   }
// }

// export async function updateProjectAction(data: z.infer<typeof projectSchema>) {
//   if (!projectsCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = projectSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...projectData } = validatedFields.data;
//     if (!id) throw new Error("Project ID is missing.");
//     await projectsCollection.doc(id).set(projectData, { merge: true });
//     revalidatePath("/[locale]/admin/projects", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Project updated successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to update project." };
//   }
// }

// export async function deleteProjectAction(id: string) {
//   if (!projectsCollection) return { success: false, message: "Database not configured." };
//   try {
//     await projectsCollection.doc(id).delete();
//     revalidatePath("/[locale]/admin/projects", "page");
//     revalidatePath("/", "layout");
//     revalidatePath("/[locale]/admin", "page");
//     return { success: true, message: "Project deleted." };
//   } catch (error) {
//     return { success: false, message: "Failed to delete project." };
//   }
// }


// // Team Member Actions
// export async function getTeamAction(): Promise<TeamMember[]> {
//   if (!teamCollection) return [];
//   const snapshot = await teamCollection.get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as TeamMember));
// }

// export async function addTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
//     if (!teamCollection) return { success: false, message: "Database not configured." };
//     const validatedFields = teamMemberSchema.safeParse(data);
//     if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//     try {
//         const { id, ...memberData } = validatedFields.data;
//         await teamCollection.add(memberData);
//         revalidatePath("/[locale]/admin/team", "page");
//         revalidatePath("/", "layout");
//         revalidatePath("/[locale]/admin", "page");
//         return { success: true, message: "Team member added successfully." };
//     } catch (error) {
//         return { success: false, message: "Failed to add team member." };
//     }
// }

// export async function updateTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
//     if (!teamCollection) return { success: false, message: "Database not configured." };
//     const validatedFields = teamMemberSchema.safeParse(data);
//     if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
    
//     try {
//         const { id, ...memberData } = validatedFields.data;
//         if (!id) throw new Error("Team member ID is missing.");
//         await teamCollection.doc(id).set(memberData, { merge: true });
//         revalidatePath("/[locale]/admin/team", "page");
//         revalidatePath("/", "layout");
//         return { success: true, message: "Team member updated successfully." };
//     } catch (error) {
//         return { success: false, message: "Failed to update team member." };
//     }
// }

// export async function deleteTeamMemberAction(id: string) {
//     if (!teamCollection) return { success: false, message: "Database not configured." };
//     try {
//         await teamCollection.doc(id).delete();
//         revalidatePath("/[locale]/admin/team", "page");
//         revalidatePath("/", "layout");
//         revalidatePath("/[locale]/admin", "page");
//         return { success: true, message: "Team member deleted." };
//     } catch (error) {
//         return { success: false, message: "Failed to delete team member." };
//     }
// }


// // Service Actions
// export async function getServicesAction(): Promise<Service[]> {
//   if (!servicesCollection) return [];
//   const snapshot = await servicesCollection.get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Service));
// }

// export async function addServiceAction(data: z.infer<typeof serviceSchema>) {
//   if (!servicesCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = serviceSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...serviceData } = validatedFields.data;
//     await servicesCollection.add(serviceData);
//     revalidatePath("/[locale]/admin/services", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Service added successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to add service." };
//   }
// }

// export async function updateServiceAction(data: z.infer<typeof serviceSchema>) {
//   if (!servicesCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = serviceSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...serviceData } = validatedFields.data;
//     if (!id) throw new Error("Service ID is missing.");
//     await servicesCollection.doc(id).set(serviceData, { merge: true });
//     revalidatePath("/[locale]/admin/services", "page");
//     revalidatePath("/", "layout");
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

// // Testimonial Actions
// export async function getTestimonialsAction(): Promise<Testimonial[]> {
//   if (!testimonialsCollection) return [];
//   const snapshot = await testimonialsCollection.get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Testimonial));
// }

// export async function addTestimonialAction(data: z.infer<typeof testimonialSchema>) {
//     if (!testimonialsCollection) return { success: false, message: "Database not configured." };
//     const validatedFields = testimonialSchema.safeParse(data);
//     if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//     try {
//         const { id, ...testimonialData } = validatedFields.data;
//         await testimonialsCollection.add(testimonialData);
//         revalidatePath("/[locale]/admin/testimonials", "page");
//         revalidatePath("/", "layout");
//         return { success: true, message: "Testimonial added successfully." };
//     } catch (error) {
//         return { success: false, message: "Failed to add testimonial." };
//     }
// }

// export async function updateTestimonialAction(data: z.infer<typeof testimonialSchema>) {
//     if (!testimonialsCollection) return { success: false, message: "Database not configured." };
//     const validatedFields = testimonialSchema.safeParse(data);
//     if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//     try {
//         const { id, ...testimonialData } = validatedFields.data;
//         if (!id) throw new Error("Testimonial ID is missing.");
//         await testimonialsCollection.doc(id).set(testimonialData, { merge: true });
//         revalidatePath("/[locale]/admin/testimonials", "page");
//         revalidatePath("/", "layout");
//         return { success: true, message: "Testimonial updated successfully." };
//     } catch (error) {
//         return { success: false, message: "Failed to update testimonial." };
//     }
// }

// export async function deleteTestimonialAction(id: string) {
//     if (!testimonialsCollection) return { success: false, message: "Database not configured." };
//     try {
//         await testimonialsCollection.doc(id).delete();
//         revalidatePath("/[locale]/admin/testimonials", "page");
//         revalidatePath("/", "layout");
//         return { success: true, message: "Testimonial deleted." };
//     } catch (error) {
//         return { success: false, message: "Failed to delete testimonial." };
//     }
// }


// // Site Settings Actions
// export async function getSiteSettingsAction(): Promise<SiteSettings> {
//   if (!settingsCollection) {
//     return { stats: { satisfaction: 0, projects: 0, experience: 0, team: 0 } };
//   }
//   const doc = await settingsCollection.doc('main').get();
//   if (!doc.exists) {
//       // Create default settings if they don't exist
//       const defaultSettings: SiteSettings = {
//           stats: { satisfaction: 98, projects: 150, experience: 12, team: 42 }
//       };
//       await settingsCollection.doc('main').set(defaultSettings);
//       return defaultSettings;
//   }
//   return doc.data() as SiteSettings;
// }

// export async function updateSiteSettingsAction(data: z.infer<typeof siteSettingsSchema>) {
//     if (!settingsCollection) return { success: false, message: "Database not configured." };
//     const validatedFields = siteSettingsSchema.safeParse(data);
//     if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//     try {
//         await settingsCollection.doc('main').set(validatedFields.data, { merge: true });
//         revalidatePath("/[locale]/admin/settings", "page");
//         revalidatePath("/", "layout");
//         return { success: true, message: "Settings updated successfully." };
//     } catch (error) {
//         return { success: false, message: "Failed to update settings." };
//     }
// }

// // Partner Actions
// export async function getPartnersAction(): Promise<Partner[]> {
//     if (!partnersCollection) return [];
//     const snapshot = await partnersCollection.get();
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Partner));
// }

// export async function addPartnerAction(data: z.infer<typeof partnerSchema>) {
//   if (!partnersCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = partnerSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...partnerData } = validatedFields.data;
//     await partnersCollection.add(partnerData);
//     revalidatePath("/[locale]/admin/partners", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Partner added successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to add partner." };
//   }
// }

// export async function updatePartnerAction(data: z.infer<typeof partnerSchema>) {
//   if (!partnersCollection) return { success: false, message: "Database not configured." };
//   const validatedFields = partnerSchema.safeParse(data);
//   if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

//   try {
//     const { id, ...partnerData } = validatedFields.data;
//     if (!id) throw new Error("Partner ID is missing.");
//     await partnersCollection.doc(id).set(partnerData, { merge: true });
//     revalidatePath("/[locale]/admin/partners", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Partner updated successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to update partner." };
//   }
// }

// export async function deletePartnerAction(id: string) {
//   if (!partnersCollection) return { success: false, message: "Database not configured." };
//   try {
//     await partnersCollection.doc(id).delete();
//     revalidatePath("/[locale]/admin/partners", "page");
//     revalidatePath("/", "layout");
//     return { success: true, message: "Partner deleted." };
//   } catch (error) {
//     return { success: false, message: "Failed to delete partner." };
//   }
// }

// // Theme Settings Actions
// function parseHsl(css: string): ThemeSettings {
//   const settings: ThemeSettings = {
//     light: { background: '', primary: '', accent: '' },
//     dark: { background: '', primary: '', accent: '' },
//   };

//   const lightBgMatch = css.match(/:root\s*\{[^}]*--background:\s*([^;]+);/);
//   if (lightBgMatch) settings.light.background = lightBgMatch[1].trim();
  
//   const lightPrimaryMatch = css.match(/:root\s*\{[^}]*--primary:\s*([^;]+);/);
//   if (lightPrimaryMatch) settings.light.primary = lightPrimaryMatch[1].trim();

//   const lightAccentMatch = css.match(/:root\s*\{[^}]*--accent:\s*([^;]+);/);
//   if (lightAccentMatch) settings.light.accent = lightAccentMatch[1].trim();

//   const darkBlockMatch = css.match(/\.dark\s*\{([^}]+)\}/);
//     if (darkBlockMatch) {
//     const darkCss = darkBlockMatch[1];
//     const darkBgMatch = darkCss.match(/--background:\s*([^;]+);/);
//     if (darkBgMatch) settings.dark.background = darkBgMatch[1].trim();

//     const darkPrimaryMatch = darkCss.match(/--primary:\s*([^;]+);/);
//     if (darkPrimaryMatch) settings.dark.primary = darkPrimaryMatch[1].trim();
    
//     const darkAccentMatch = darkCss.match(/--accent:\s*([^;]+);/);
//     if (darkAccentMatch) settings.dark.accent = darkAccentMatch[1].trim();
//   }
  
//   return settings;
// }

// export async function getThemeSettingsAction(): Promise<ThemeSettings> {
//     const cssContent = await fs.readFile(globalsCssPath, 'utf8');
//     return parseHsl(cssContent);
// }

// export async function updateThemeSettingsAction(data: z.infer<typeof themeSettingsSchema>) {
//     const validatedFields = themeSettingsSchema.safeParse(data);
//     if (!validatedFields.success) {
//         return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
//     }

//     try {
//         let cssContent = await fs.readFile(globalsCssPath, 'utf8');
//         const { light, dark } = validatedFields.data;
        
//         // Update light theme variables in :root
//         cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--background:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.background}$2`);
//         cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--primary:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.primary}$2`);
//         cssContent = cssContent.replace(/(:root\s*\{[\s\S]*?--accent:\s*)[^;]+(;[\s\S]*?\})/, `$1${light.accent}$2`);

//         // Update dark theme variables in .dark
//         cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--background:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.background}$2`);
//         cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--primary:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.primary}$2`);
//         cssContent = cssContent.replace(/(\.dark\s*\{[\s\S]*?--accent:\s*)[^;]+(;[\s\S]*?\})/, `$1${dark.accent}$2`);

//         await fs.writeFile(globalsCssPath, cssContent, 'utf8');
//         revalidatePath("/", "layout");
//         return { success: true, message: "Theme updated successfully." };
//     } catch (error) {
//         console.error("Error updating theme:", error);
//         return { success: false, message: "Failed to update theme file." };
//     }
// }


// // Blog Post Actions (with Firestore)
// const blogPostSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().min(2, "Title must be at least 2 characters."),
//   content: z.string().min(10, "Content must be at least 10 characters."),
//   excerpt: z.string().optional(),
//   author: z.string().min(2, "Author must be at least 2 characters."),
//   publishedAt: z.string().optional(),
//   updatedAt: z.string().optional(),
//   tags: z.array(z.string()).optional(),
//   category: z.string().min(2, "Category must be at least 2 characters."),
//   views: z.number().optional(),
//   likes: z.number().optional(),
//   featured: z.boolean().optional(),
//   published: z.boolean().optional(),
// });

// export async function getBlogPostsAction(): Promise<BlogPost[]> {
//   try {
//     const snapshot = await db.collection('blogPosts').get();
//     return snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as unknown as BlogPost));
//   } catch (error) {
//     console.error("Failed to fetch blog posts:", error);
//     return [];
//   }
// }

// export async function addBlogPostAction(data: z.infer<typeof blogPostSchema>) {
//   const validatedFields = blogPostSchema.safeParse(data);
//   if (!validatedFields.success) {
//     return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
//   }

//   try {
//     const { id, ...postData } = validatedFields.data;
// const postRef = await db.collection('blogPosts').add({
//         ...postData,
//       publishedAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });
//     if (!postRef.id) {
//       return { success: false, message: "Failed to create blog post reference." };
//     }
//     console.log("PostRef ID:", postRef.id);
//     console.log("PostData:", postData);
//     revalidatePath("/[locale]/admin/blog", "page");
//     revalidatePath("/[locale]/blog", "page");
//     return { success: true, message: "Blog post added successfully." };
//   } catch (error) {
//     console.error("Error adding blog post:", error);

//     return { success: false, message: "Failed to add blog post." };
//   }
// }

// export async function updateBlogPostAction(data: z.infer<typeof blogPostSchema>) {
//   const validatedFields = blogPostSchema.safeParse(data);
//   if (!validatedFields.success) {
//     return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
//   }

//   try {
//     const { id, ...postData } = validatedFields.data;
//     if (!id) throw new Error("Post ID is missing.");
//     // await db.collection('blogPosts').doc(id).set(postData, { merge: true });
//         const postRef = db.collection('blogPosts').doc(id);
//     await postRef.set(postData, { merge: true });
//     if (!postRef.id) {
//       return { success: false, message: "Failed to update blog post." };
//     }
//     revalidatePath("/[locale]/admin/blog", "page");
//     revalidatePath("/[locale]/blog", "page");
//     return { success: true, message: "Blog post updated successfully." };
//   } catch (error) {
//      console.error("Error updating blog post:", error);
//     return { success: false, message: "Failed to update blog post." };
//   }
// }
// export async function deleteBlogPostAction(id: string) {
//   try {
//     await db.collection('blogPosts').doc(id).delete();
//     revalidatePath("/[locale]/admin/blog", "page");
//     revalidatePath("/[locale]/blog", "page");
//     return { success: true, message: "Blog post deleted." };
//   } catch (error) {
//     return { success: false, message: "Failed to delete blog post." };
//   }
// }



// // =============================================================================
// // AI Generation Actions
// // =============================================================================

// export async function generateProjectDescriptionAction(title: string) {
//   if (!title) return { success: false, description: null, message: "Title is required." };
//   try {
//     const result = await generateDescription({ type: 'project', topic: title });
//     return { success: true, description: result.description };
//   } catch (error) {
//     console.error("Error generating project description:", error);
//     return { success: false, description: null, message: "AI generation failed." };
//   }
// }

// export async function generateServiceDescriptionAction(title: string) {
//   if (!title) return { success: false, description: null, message: "Title is required." };
//   try {
//     const result = await generateDescription({ type: 'service', topic: title });
//     return { success: true, description: result.description };
//   } catch (error) {
//     console.error("Error generating service description:", error);
//     return { success: false, description: null, message: "AI generation failed." };
//   }
// }

// export async function generateTestimonialQuoteAction(authorName: string) {
//   if (!authorName) return { success: false, quote: null, message: "Author name is required." };
//   try {
//     const result = await generateTestimonialQuote({ authorName });
//     return { success: true, quote: result.quote };
//   } catch (error) {
//     console.error("Error generating testimonial quote:", error);
//     return { success: false, quote: null, message: "AI generation failed." };
//   }
// }

// // =============================================================================
// // Contact Form Actions (Missing)
// // =============================================================================

// export async function addMessageAction(name: string, email: string, message: string) {
//     if (!messagesCollection) return { success: false, message: "Database not configured." };
//     try {
//         await messagesCollection.add({
//             name,
//             email,
//             message,
//             submittedAt: new Date().toISOString(),
//         });
//         revalidatePath("/ar");
//         return { success: true, message: "Message sent successfully." };
//     } catch (error: any) {
//         return { success: false, message: error.message };
//     }
// }

"use server";
import { z } from "zod";
import { suggestFaq } from "@/ai/flows/faq-suggestions";
import { db } from "@/lib/firebase-admin";
// import type { BlogPost } from "@/components/blog/blog-system";

// import type { Message, Project, TeamMember, Service, Testimonial, SiteSettings, Partner, ThemeSettings } from "@/lib/types";
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
  
});

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  image: z.string().url("Image must be a valid URL."),
  dataAiHint: z.string().optional(),
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

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(2, "Icon name is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  dataAiHint: z.string().optional(),
});

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


// Project Actions
export async function getProjectsAction(): Promise<Project[]> {
  if (!projectsCollection) return [];
  const snapshot = await projectsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Project));
}

export async function addProjectAction(data: z.infer<typeof projectSchema>) {
  if (!projectsCollection) return { success: false, message: "Database not configured." };
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
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

export async function updateProjectAction(data: z.infer<typeof projectSchema>) {
  if (!projectsCollection) return { success: false, message: "Database not configured." };
  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
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


// Service Actions
export async function getServicesAction(): Promise<Service[]> {
  if (!servicesCollection) return [];
  const snapshot = await servicesCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Service));
}

export async function addServiceAction(data: z.infer<typeof serviceSchema>) {
  if (!servicesCollection) return { success: false, message: "Database not configured." };
  const validatedFields = serviceSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...serviceData } = validatedFields.data;
    await servicesCollection.add(serviceData);
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Service added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add service." };
  }
}

export async function updateServiceAction(data: z.infer<typeof serviceSchema>) {
  if (!servicesCollection) return { success: false, message: "Database not configured." };
  const validatedFields = serviceSchema.safeParse(data);
  if (!validatedFields.success) return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };

  try {
    const { id, ...serviceData } = validatedFields.data;
    if (!id) throw new Error("Service ID is missing.");
    await servicesCollection.doc(id).set(serviceData, { merge: true });
    revalidatePath("/[locale]/admin/services", "page");
    revalidatePath("/", "layout");
    return { success: true, message: "Service updated successfully." };
  } catch (error) {
    return { success: false, message: "Failed to update service." };
  }
}

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


// Blog Post Actions (with Firestore)
const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
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

export async function addBlogPostAction(data: z.infer<typeof blogPostSchema>) {
  const validatedFields = blogPostSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    const { id, ...postData } = validatedFields.data;
const postRef = await db.collection('blogPosts').add({
        ...postData,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (!postRef.id) {
      return { success: false, message: "Failed to create blog post reference." };
    }
    console.log("PostRef ID:", postRef.id);
    console.log("PostData:", postData);
    revalidatePath("/[locale]/admin/blog", "page");
    revalidatePath("/[locale]/blog", "page");
    return { success: true, message: "Blog post added successfully." };
  } catch (error) {
    console.error("Error adding blog post:", error);

    return { success: false, message: "Failed to add blog post." };
  }
}

export async function updateBlogPostAction(data: z.infer<typeof blogPostSchema>) {
  const validatedFields = blogPostSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
  }

  try {
    const { id, ...postData } = validatedFields.data;
    if (!id) throw new Error("Post ID is missing.");
    // await db.collection('blogPosts').doc(id).set(postData, { merge: true });
        const postRef = db.collection('blogPosts').doc(id);
    await postRef.set(postData, { merge: true });
    if (!postRef.id) {
      return { success: false, message: "Failed to update blog post." };
    }
    revalidatePath("/[locale]/admin/blog", "page");
    revalidatePath("/[locale]/blog", "page");
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
