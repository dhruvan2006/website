import React from 'react';
import Link from 'next/link';
import { customFetch } from '@/api';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Bitcoin Data Sources | Dhruvan',
  description: 'Explore a wide suite of data sources provided for Bitcoin On-Chain data.',
  openGraph: {
    title: 'Bitcoin Data Sources | Dhruvan',
    description: 'Explore a wide suite of data sources provided for Bitcoin On-Chain data.',
    url: 'https://gnanadhandayuthapani.com/datasources',
    images: [
      {
        url: '/og/datasources.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Data Sources | Dhruvan',
      }
    ],
    siteName: 'Dhruvan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Data Sources | Dhruvan',
    description: 'Explore a wide suite of data sources provided for Bitcoin On-Chain data.',
    images: ['/og/datasources.png'], 
  }
}

interface DataSource {
  id: number;
  url: string;
  name: string;
  description: string;
}

async function getDataSources(): Promise<DataSource[]> {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/datasource`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories and indicators');
  }
  return res.json();
}

export default async function IndicatorPage() {
  const data = await getDataSources();

  return (
    <div className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-sans min-h-screen'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Bitcoin Data Sources</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data.map((dataSource) => (
              <Link href={`/datasources/${dataSource.url}`} key={dataSource.id}>
                  <div className='bg-gray-100 dark:bg-[#1e2022] p-6 rounded-lg hover:shadow-md shadow-zinc-100 dark:shadow-zinc-800 transition duration-300'>
                  <h2 className='text-xl font-semibold mb-2'>{dataSource.url}</h2>
                  <p className='text-gray-600 dark:text-gray-400 mb-2'>{dataSource.name}</p>
                  </div>
              </Link>
              ))}
          </div>
      </main>
    </div>
  );
}