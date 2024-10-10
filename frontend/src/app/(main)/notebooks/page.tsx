import React from 'react';
import Link from 'next/link';
import { customFetch } from '@/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitcoin Research | Dhruvan',
  description: 'Explore the research process for finding indicators.'
}

type Notebook = {
  path: string;
  name: string;
};

type Notebooks = {
  notebooks: Notebook[];
}

async function getNotebooks(): Promise<Notebooks> {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/research/notebooks`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch research notebooks');
  }
  return res.json();
}

export default async function ResearchPage() {
  const { notebooks } = await getNotebooks();

  console.log(notebooks);

  return (
    <div className='bg-[#fff] text-[#191919] font-sans'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Research Notebooks</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notebooks.map((notebook) => (
              <Link href={`/notebooks/${notebook.path}`} key={notebook.name}>
                <div className='bg-gray-100 p-6 rounded-lg hover:shadow-md transition duration-300'>
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