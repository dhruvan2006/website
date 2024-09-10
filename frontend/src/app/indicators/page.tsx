import React from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';

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
  const res = await fetch('https://api.liquidity.gnanadhandayuthapani.com/api/indicators/categories_with_indicators', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories and indicators');
  }
  return res.json();
}

export default async function IndicatorPage() {
  const data = await getCategoriesWithIndicators();

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Bitcoin Indicators</h1>
        {data.map(({ category, indicators }) => (
          <div key={category.id}>
            <h2 className='text-2xl font-bold mb-4'>{category.name}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {indicators.map((indicator) => (
                <Link href={`/indicators/${indicator.url_name}`} key={indicator.id}>
                  <div className='bg-gray-100 p-6 rounded-lg hover:shadow-md transition duration-300'>
                    <h2 className='text-xl font-semibold mb-2'>{indicator.url_name}</h2>
                    <p className='text-gray-600 mb-2'>{indicator.human_name}</p>
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