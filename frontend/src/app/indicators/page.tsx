import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

const indicators = [
  { name: 'PLRR', fullName: 'Power Law Residual Ratio', category: 'Power Law' },
];

export default function IndicatorPage() {
  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <Navbar />
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Bitcoin Indicators</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {indicators.map((indicator) => (
            <Link href={`/indicators/${indicator.name.toLowerCase()}`} key={indicator.name}>
              <div className='bg-gray-100 p-6 rounded-lg hover:shadow-md transition duration-300'>
                <h2 className='text-xl font-semibold mb-2'>{indicator.name}</h2>
                <p className='text-gray-600 mb-2'>{indicator.fullName}</p>
                <span className='text-sm text-blue-600'>{indicator.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}