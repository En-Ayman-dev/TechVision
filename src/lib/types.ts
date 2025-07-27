import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
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
  name: string;
  logo: string;
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
