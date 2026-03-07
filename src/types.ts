export interface LocaleString {
  en: string;
  tr: string;
}

export interface SanityImage {
  asset: {
    _ref: string;
    _type?: string; // Rendu optionnel pour éviter des erreurs avec les images par défaut
  };
  alt?: string;
}

export interface BlogPost {
  _id: string;
  title: { en: string; tr: string };
  slug: { current: string };
  excerpt: { en: string; tr: string };
  content?: any;
  body?: { en: any[]; tr: any[] };
  mainImage?: {
    asset: { _ref: string };
  };
  publishedAt: string;
  tags?: string[];
}

export interface JourneyStep {
  _id: string;
  order: number;
  period: LocaleString;
  role: LocaleString;
  company: string;
  description: { en: any[]; tr: any[] };
  image?: SanityImage;
}

export interface EngineerProfile {
  name: string;
  role: string;
  bio: { en: any[]; tr: any[] };
  yearsOfExperience: number;
  specialties: string[];
  profileImage?: {
    asset: { _ref: string };
  };
}

// Navigation Item
export interface NavItem {
  label: string;
  href: string;
}