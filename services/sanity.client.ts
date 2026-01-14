import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { DrinkProject, BlogPost } from '../types';

// Helper to safely get env vars in Vite or fallback
// process.env is not available in standard Vite client builds
const getEnvVar = (key: string, fallback: string) => {
  // @ts-ignore - import.meta is standard in Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key] || fallback;
  }
  return fallback;
};

// FIX: Default fallback must be lowercase alphanumeric with dashes only (no underscores) 
// to pass Sanity's strict regex validation.
const PROJECT_ID = getEnvVar('VITE_SANITY_PROJECT_ID', 'mock-project-id');
const DATASET = getEnvVar('VITE_SANITY_DATASET', 'production');

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: true, // Use CDN for public data (faster)
  apiVersion: '2023-05-03',
  // No token needed for reading public datasets
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  try {
    return builder.image(source);
  } catch (error) {
    // Fail silently if builder isn't configured correctly
    return { width: () => ({ url: () => '' }) };
  }
};

// --- MOCK DATA FOR DEMONSTRATION ---
export const MOCK_DRINKS: DrinkProject[] = [
  {
    _id: '1',
    title: { en: 'Zenith Kombucha', tr: 'Zenith Kombuça' },
    client: 'Döhler Internal',
    description: { en: 'A fermented tea infused with hibiscus and rose.', tr: 'Hibiskus ve gül ile demlenmiş fermente çay.' },
    slug: { current: 'zenith-kombucha' },
    mainImage: { asset: { _ref: 'image-1', _type: 'reference' } },
    specs: { ph: 3.2, brix: 4.5, ingredients: ['Hibiscus', 'Rose', 'Probiotics'] }
  },
  {
    _id: '2',
    title: { en: 'Nitro Cold Brew Citrus', tr: 'Nitro Cold Brew Narenciye' },
    client: 'Local Cafe Chain',
    description: { en: 'Nitrogen infused coffee with yuzu extract.', tr: 'Yuzu özlü azotlu kahve.' },
    slug: { current: 'nitro-citrus' },
    mainImage: { asset: { _ref: 'image-2', _type: 'reference' } },
    specs: { ph: 5.8, brix: 2.1, ingredients: ['Arabica', 'Yuzu', 'Nitrogen'] }
  }
];

export const MOCK_POSTS: BlogPost[] = [
  {
    _id: '101',
    title: { en: 'The Science of Emulsions', tr: 'Emülsiyon Bilimi' },
    slug: { current: 'science-emulsions' },
    publishedAt: '2023-10-15',
    excerpt: { en: 'Understanding stability in plant-based milks.', tr: 'Bitkisel sütlerde stabiliteyi anlamak.' },
    mainImage: { asset: { _ref: 'image-3', _type: 'reference' } }
  }
];

// --- GROQ QUERIES ---
export const getDrinks = async (): Promise<DrinkProject[]> => {
  try {
    // Return mocks immediately if we are using the placeholder ID
    if (PROJECT_ID === 'mock-project-id') return MOCK_DRINKS;
    
    return await client.fetch(
      `*[_type == "drink" && !(_id in path("drafts.**"))]{
        _id,
        title,
        client,
        description,
        slug,
        mainImage,
        specs
      }`
    );
  } catch (error) {
    console.warn("Sanity fetch failed, using mock data", error);
    return MOCK_DRINKS;
  }
};

export const getPosts = async (): Promise<BlogPost[]> => {
  try {
    // Return mocks immediately if we are using the placeholder ID
    if (PROJECT_ID === 'mock-project-id') return MOCK_POSTS;

    return await client.fetch(
      `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc){
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage
      }`
    );
  } catch (error) {
    console.warn("Sanity fetch failed, using mock data", error);
    return MOCK_POSTS;
  }
};