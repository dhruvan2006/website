import React from 'react';
import Link from 'next/link';

interface DataSource {
  id: number;
  url: string;
  name: string;
  description: string;
}

async function getDataSources(): Promise<DataSource[]> {
  const res = await fetch('https://api.gnanadhandayuthapani.com/api/indicators/datasource', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories and indicators');
  }
  return res.json();
}

export default async function IndicatorPage() {
  const data = await getDataSources();

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Bitcoin Data Sources</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data.map((dataSource) => (
              <Link href={`/datasources/${dataSource.url}`} key={dataSource.id}>
                  <div className='bg-gray-100 p-6 rounded-lg hover:shadow-md transition duration-300'>
                  <h2 className='text-xl font-semibold mb-2'>{dataSource.url}</h2>
                  <p className='text-gray-600 mb-2'>{dataSource.name}</p>
                  </div>
              </Link>
              ))}
          </div>
      </main>
    </div>
  );
}