import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// Client with token for authenticated requests (mutations, drafts)
export const writeClient = createClient({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
