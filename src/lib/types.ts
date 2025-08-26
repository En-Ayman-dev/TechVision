import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

// An object to hold content that exists in both English and Arabic
export interface BilingualContent {
  en: string;
  ar: string;
}

// An object for features, also bilingual
export interface ServiceFeature {
  title: BilingualContent;
  description: BilingualContent;
  icon: string; // Icon name from lucide-react
}

export interface Service {
  id: string;
  slug: string; // For the URL, e.g., "web-development"
  icon: string; // Icon for the main service card
  
  // Bilingual fields
  title: BilingualContent;
  description: BilingualContent; // This is the short description for the card
  detailedContent: BilingualContent; // This is the rich HTML content for the service page
  
  heroImage?: string; // Optional hero image for the service page
  
  features?: ServiceFeature[]; // Array of features for the service
  
  dataAiHint?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  dataAiHint?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social: {
    twitter: string;
    linkedin: string;
  };
  dataAiHint?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image: string;
  dataAiHint?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Partner {
  id?: string;
  name: string;
  logo: string;
  dataAiHint?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  inquiry?: string; // NEW: New inquiry field
  beneficiaryType?: string; // NEW: Beneficiary type field
  requestType?: string; // NEW: Request type field

}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  dataAiHint?: string;
  
  // --- Fields Added as per your request ---
  githubUrl?: string;
  liveUrl?: string;
  detailedDescription?: string;
  // -----------------------------------------
}

export interface SiteSettings {
  stats: {
    satisfaction: number;
    projects: number;
    experience: number;
    team: number;
  }
}

export interface ThemeSettings {
  light: {
    background: string;
    primary: string;
    accent: string;
  },
  dark: {
    background: string;
    primary: string;
    accent: string;
  }
}
export interface BlogPost {
  id: string;
  title: string;
  slug: string; // <-- 1. Added for SEO-friendly URLs
  featuredImage?: string; // <-- 2. Added for the post's hero image
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  views: number;
  likes: number;
  featured: boolean;
  published: boolean;
}
