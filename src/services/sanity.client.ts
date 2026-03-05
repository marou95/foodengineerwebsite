import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { DrinkProject, BlogPost, JourneyStep } from '../types';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

export const getDrinks = async (): Promise<DrinkProject[]> => {
  return await client.fetch(`*[_type == "drink"] | order(_createdAt desc)`);
};

export const getDrinkBySlug = async (slug: string): Promise<DrinkProject> => {
  return await client.fetch(
    `*[_type == "drink" && slug.current == $slug][0]`,
    { slug }
  );
};

export const getPosts = async (): Promise<BlogPost[]> => {
  return await client.fetch(`*[_type == "post"] | order(publishedAt desc)`);
};

export const getRecentPosts = async (): Promise<BlogPost[]> => {
  return await client.fetch(`*[_type == "post"] | order(publishedAt desc) [0...4]`);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost> => {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug }
  );
};

export const getJourneySteps = async (): Promise<JourneyStep[]> => {
  return await client.fetch(`*[_type == "journeyStep"] | order(order asc)`);
};