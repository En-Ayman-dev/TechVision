
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  dataAiHint?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface PortfolioItem {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  dataAiHint?: string;
}

export interface TeamMember {
  id: number;
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
  id: number;
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
  id: number;
  name: string;
  logo: string;
  dataAiHint?: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  dataAiHint?: string;
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
export  interface BlogPost {
    id: string;
    title: string;
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
