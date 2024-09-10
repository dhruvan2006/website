import React from 'react';
import axios from 'axios';
import Navbar from '../../Navbar';
import InteractiveChart from './InteractiveChart';
import ApiHelp from './ApiHelp';
import IndicatorDescription from './IndicatorDescription';

async function getIndicator(indicator: string) {
  const res = await axios.get(`https://api.liquidity.gnanadhandayuthapani.com/api/indicators/indicator/${indicator}`);
  return res.data;
}

async function getIndicatorValues(indicator: string) {
  const res = await axios.get(`https://api.liquidity.gnanadhandayuthapani.com/api/indicators/indicator/${indicator}/values`);
  return res.data;
}

async function getBitcoinPriceData() {
  const res = await fetch('https://api.liquidity.gnanadhandayuthapani.com/api/indicators/price');
  if (!res.ok) {
    throw new Error('Failed to fetch Bitcoin price data');
  }
  return res.json();
}

export default async function IndicatorPage({ params }: { params: { indicator: string } }) {
  const indicator = await getIndicator(params.indicator);
  const indicatorValues = await getIndicatorValues(params.indicator);
  const bitcoinPriceData = await getBitcoinPriceData();

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <Navbar />

      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-2'>
        <div className='mb-6'>
          <InteractiveChart indicator={indicator} initialIndicatorData={indicatorValues} initialBitcoinData={bitcoinPriceData} />
        </div>

        <IndicatorDescription indicator={indicator} />

        <ApiHelp indicator={params.indicator} />

        {/* <pre className='bg-gray-100 p-4 rounded-md overflow-auto mb-6'>
          {JSON.stringify(indicatorData, null, 2)}
        </pre> */}
      </main>
    </div>
  );
}