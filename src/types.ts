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
  title: { en: string; tr: string };
  slug: { current: string }; // S'assurer que c'est bien présent
  excerpt: { en: string; tr: string };
  content?: any; // Pour le texte riche de Sanity
  mainImage?: {
    asset: { _ref: string };
  };
  publishedAt: string;
}

// Navigation Item
export interface NavItem {
  label: string; // Translation key
  href: string;
}