export const dynamic = "force-dynamic";

import React from 'react';
import Chart from './Chart';
import { customFetch } from '@/api';

export async function generateMetadata({ params }: { params: { datasource: string } }) {
  const datasourceData = await getDataSource(params.datasource);
  
  return {
    title: `${datasourceData.name} Data | Dhruvan`,
    description: `Access ${datasourceData.name}.`,
    openGraph: {
      title: `${datasourceData.name} Data | Dhruvan`,
      description: `Access ${datasourceData.name}.`,
      url: `https://crypto.dhruvan.dev/datasources/${params.datasource}`,
      images: [
        {
          url: '/og/datasource.png',
          width: 1200,
          height: 630,
          alt: `${datasourceData.name} Data | Dhruvan`,
        }
      ],
      siteName: 'Dhruvan',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${datasourceData.name} Data | Dhruvan`,
      description: `Access ${datasourceData.name}.`,
      images: ['/og/datasource.png'],
    }
  };
}

async function getDataSource(datasource: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/datasource/${datasource}`);
  if (!res.ok) {
    throw new Error('Failed to fetch datasource');
  }
  return res.json();
}

async function getDataSourceValues(datasource: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/datasource/${datasource}/values`);
  if (!res.ok) {
    throw new Error('Failed to fetch datasource values');
  }
  return res.json();
}

export default async function DataSourcePage({ params }: { params: { datasource: string } }) {
  const datasource = await getDataSource(params.datasource);
  const datasourceValues = await getDataSourceValues(params.datasource);

  return (
    <div className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-sans min-h-screen'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-2'>
        <div className='mb-6'>
          <Chart datasource={datasource} datasourceValues={datasourceValues} />
        </div>
      </main>
    </div>
  );
}