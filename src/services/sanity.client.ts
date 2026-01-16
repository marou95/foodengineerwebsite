import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { DrinkProject, BlogPost } from '../types';

// Helper to safely get env vars in Vite or fallback
const getEnvVar = (key: string, fallback: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key] || fallback;
  }
  return fallback;
};

// CONFIGURATION
const PROJECT_ID = getEnvVar('VITE_SANITY_PROJECT_ID', '0z7unhdc');
const DATASET = getEnvVar('VITE_SANITY_DATASET', 'production');
const API_TOKEN = getEnvVar('VITE_SANITY_API_TOKEN', ''); 
const API_VERSION = '2023-05-03';

const IS_MOCK_MODE = PROJECT_ID === 'mock-project-id';

// DIAGNOSTIC AU DÉMARRAGE
console.group("🔌 [The Flavour Lab] Sanity Connection Diagnostics");
console.log(`Project ID: ${PROJECT_ID}`);
console.log(`Dataset: ${DATASET}`);
if (API_TOKEN && API_TOKEN.length > 10) {
  console.log("%c✅ API Token loaded successfully", "color: green; font-weight: bold");
} else {
  console.log("%c❌ API Token MISSING or EMPTY", "color: red; font-weight: bold");
  console.warn("Si tu as ajouté le .env récemment, TU DOIS REDÉMARRER LE SERVEUR (Ctrl+C, npm run dev).");
}
console.groupEnd();

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false, // Important : false pour avoir les dernières données en temps réel
  apiVersion: API_VERSION,
  token: API_TOKEN, // Le token est injecté ici. S'il est vide, la requête part en mode public (et échoue si le dataset est privé).
  ignoreBrowserTokenWarning: true
});

const builder = imageUrlBuilder(client);

const fallbackBuilder: any = {
  width: (w: number) => fallbackBuilder,
  height: (h: number) => fallbackBuilder,
  fit: (f: string) => fallbackBuilder,
  url: () => '',
};

export const urlFor = (source: any) => {
  const ref = source?.asset?._ref;
  const isValidSanityRef = ref && typeof ref === 'string' && ref.split('-').length >= 4;

  if (!isValidSanityRef) return fallbackBuilder;

  try {
    return builder.image(source);
  } catch (error) {
    return fallbackBuilder;
  }
};

// --- MOCK DATA ---
export const MOCK_DRINKS: DrinkProject[] = [
  {
    _id: '1',
    title: { en: 'Zenith Kombucha (Demo)', tr: 'Zenith Kombuça (Demo)' },
    client: 'Döhler Internal',
    description: { en: 'A fermented tea infused with hibiscus and rose.', tr: 'Hibiskus ve gül ile demlenmiş fermente çay.' },
    slug: { current: 'zenith-kombucha' },
    mainImage: { asset: { _ref: 'image-1', _type: 'reference' } },
    specs: { ph: 3.2, brix: 4.5, ingredients: ['Hibiscus', 'Rose', 'Probiotics'] }
  },
  {
    _id: '2',
    title: { en: 'Nitro Cold Brew Citrus (Demo)', tr: 'Nitro Cold Brew Narenciye (Demo)' },
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
    title: { en: 'The Science of Emulsions (Demo)', tr: 'Emülsiyon Bilimi (Demo)' },
    slug: { current: 'science-emulsions' },
    publishedAt: '2023-10-15',
    excerpt: { en: 'Understanding stability in plant-based milks.', tr: 'Bitkisel sütlerde stabiliteyi anlamak.' },
    mainImage: { asset: { _ref: 'image-3', _type: 'reference' } }
  }
];

// --- ERROR HANDLER ---
const handleSanityError = (error: any, source: string) => {
  console.group(`❌ Sanity Fetch Error (${source})`);
  console.error(error);
  
  const isAuthError = error.statusCode === 401 || (error.message && error.message.includes('401'));
  const isGenericRequestError = error.message && error.message.includes('Request error while attempting to reach');

  if (isAuthError || isGenericRequestError) {
     if (!API_TOKEN) {
       console.warn("%c⚠️ TOKEN MANQUANT", "color: red; font-size: 14px; font-weight: bold");
       console.warn("Le fichier .env semble ignoré. REDÉMARRE LE TERMINAL.");
     } else {
       console.warn("Token présent mais refusé. Vérifie que le token est bien de type 'Viewer' et que tu as accès au projet.");
     }
  }
  console.groupEnd();
};

// --- API FETCHING ---

export const getDrinks = async (): Promise<DrinkProject[]> => {
  if (IS_MOCK_MODE) return MOCK_DRINKS;
    
  try {
    const data = await client.fetch(
      `*[_type == "drink"] | order(_createdAt desc) {
        _id,
        title,
        client,
        description,
        slug,
        mainImage,
        specs
      }`
    );
    return data;
  } catch (error: any) {
    handleSanityError(error, 'Drinks');
    return MOCK_DRINKS; 
  }
};

export const getPosts = async (): Promise<BlogPost[]> => {
  if (IS_MOCK_MODE) return MOCK_POSTS;

  try {
    const data = await client.fetch(
      `*[_type == "post"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage
      }`
    );
    return data;
  } catch (error) {
    handleSanityError(error, 'Posts');
    return MOCK_POSTS;
  }
};