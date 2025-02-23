import React from 'react';
import Link from 'next/link';
import { customFetch } from '@/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitcoin Indicators | Dhruvan',
  description: 'Explore a wide suite of uniquely researched bitcoin indicators.',
  openGraph: {
    title: 'Bitcoin Indicators | Dhruvan',
    description: 'Explore a wide suite of uniquely researched bitcoin indicators.',
    url: 'https://gnanadhandayuthapani.com/indicators',
    images: [
      {
        url: '/og/indicators.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Indicators | Dhruvan',
      }
    ],
    siteName: 'Dhruvan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Indicators | Dhruvan',
    description: 'Explore a wide suite of uniquely researched bitcoin indicators.',
    images: ['/og/indicators.png'],
  }
}


interface Category {
  id: number;
  name: string;
}

export interface Indicator {
  id: number;
  url_name: string;
  human_name: string;
  description: string;
  category: number;
}

interface CategoryWithIndicators {
  category: Category;
  indicators: Indicator[];
}

async function getCategoriesWithIndicators(): Promise<CategoryWithIndicators[]> {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/categories_with_indicators`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories and indicators');
  }
  return res.json();
}

export default async function IndicatorPage() {
  const data = await getCategoriesWithIndicators();

  return (
    <div className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-sans'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Bitcoin Indicators</h1>
        {data.map(({ category, indicators }) => (
          <div key={category.id} className='mb-8'>
            <h2 className='text-2xl font-bold mb-4'>{category.name}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {indicators.map((indicator) => (
                <Link href={`/indicators/${indicator.url_name}`} key={indicator.id}>
                  <div className='bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg hover:shadow-md transition duration-300'>
                    <h2 className='text-xl font-semibold mb-2'>{indicator.human_name}</h2>
                    <p className='text-gray-600 dark:text-gray-300 mb-2'>{indicator.url_name}</p>
                    <span className='text-sm text-blue-600'>{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
