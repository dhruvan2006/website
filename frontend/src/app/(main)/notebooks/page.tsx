export const dynamic = "force-dynamic";

import React from 'react';
import Link from 'next/link';
import { customFetch } from '@/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitcoin Research | Dhruvan',
  description: 'Explore the research process for finding indicators.',
  openGraph: {
    title: 'Bitcoin Research | Dhruvan',
    description: 'Explore the research process for finding indicators.',
    url: 'https://crypto.dhruvan.dev/notebooks',
    images: [
      {
        url: '/og/research.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Research | Dhruvan',
      }
    ],
    siteName: 'Dhruvan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Research | Dhruvan',
    description: 'Explore the research process for finding indicators.',
    images: ['/og/research.png'],
  }
}


type Notebook = {
  path: string;
  name: string;
};

type Notebooks = {
  notebooks: Notebook[];
}

async function getNotebooks(): Promise<Notebooks> {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/research/notebooks`);
  if (!res.ok) {
    throw new Error('Failed to fetch research notebooks');
  }
  return res.json();
}

export default async function ResearchPage() {
  const { notebooks } = await getNotebooks();

  console.log(notebooks);

  return (
    <div className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-sans'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Research Notebooks</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notebooks.map((notebook) => (
              <Link href={`/notebooks/${notebook.path}`} key={notebook.name}>
                <div className='bg-gray-100 dark:bg-[#1e2022] p-6 rounded-lg hover:shadow-md shadow-zinc-200 dark:shadow-zinc-800 transition duration-300'>
                  <h2 className='text-xl font-semibold mb-2'>{notebook.name}</h2>
                  {/* <p className='text-gray-600 mb-2'>{indicator.human_name}</p> */}
                  {/* <span className='text-sm text-blue-600'>{notebook.name}</span> */}
                </div>
              </Link>
            ))}
          </div>
      </main>
    </div>
  );
}