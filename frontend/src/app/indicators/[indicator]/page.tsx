import React from 'react';
import Navbar from '../Navbar';
import InteractiveChart from './InteractiveChart';

async function getIndicatorData(indicator: string) {
  const res = await fetch(`http://localhost:8000/api/indicators/indicator?name=${indicator}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch indicator data');
  }
  return res.json();
}

async function getBitcoinPriceData() {
  const res = await fetch('http://localhost:8000/api/indicators/price', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch Bitcoin price data');
  }
  return res.json();
}

export default async function IndicatorPage({ params }: { params: { indicator: string } }) {
  const indicatorData = await getIndicatorData(params.indicator);
  const bitcoinPriceData = await getBitcoinPriceData();

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <Navbar />

      <main className='container mx-auto px-4 sm:px-16 py-2'>
        <div className='mb-6'>
          <InteractiveChart indicator={params.indicator} initialIndicatorData={indicatorData} initialBitcoinData={bitcoinPriceData} />
        </div>

        <pre className='bg-gray-100 p-4 rounded-md overflow-auto'>
          {JSON.stringify(indicatorData, null, 2)}
        </pre>
      </main>
    </div>
  );
}