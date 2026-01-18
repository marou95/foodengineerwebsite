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
    ingredients: string[];
  };
}

export interface BlogPost {
  _id: string;
  title: { en: string; tr: string };
  slug: { current: string };
  excerpt: { en: string; tr: string };
  content?: any;
  mainImage?: {
    asset: { _ref: string };
  };
  publishedAt: string;
}

// Navigation Item
export interface NavItem {
  label: string;
  href: string;
}