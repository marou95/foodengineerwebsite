export interface LocaleString {
  en: string;
  tr: string;
}

export interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

export interface DrinkProject {
  _id: string;
  title: LocaleString;
  client: string;
  description: LocaleString;
  slug: { current: string };
  mainImage: SanityImage;
  // Technical specs for the "Lab" feel
  specs: {
    ph: number;
    brix: number;
    ingredients: string[]; // Simple array for demo
  };
}

export interface BlogPost {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  mainImage: SanityImage;
  publishedAt: string;
  excerpt: LocaleString;
  // In a real app, body would be PortableText
  body?: any; 
}

// Navigation Item
export interface NavItem {
  label: string; // Translation key
  href: string;
}