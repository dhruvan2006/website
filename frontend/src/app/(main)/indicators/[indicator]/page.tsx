import React from 'react';
import InteractiveChart from './InteractiveChart';
import ApiHelp from './ApiHelp';
import IndicatorDescription from './IndicatorDescription';
import { customFetch } from '@/api';

export async function generateMetadata({ params }: { params: { indicator: string } }) {
  const indicatorData = await getIndicator(params.indicator);
  return {
    title: `${indicatorData.human_name} Indicator | Dhruvan`,
    description: `Explore the ${indicatorData.human_name} indicator on Dhruvan.`,
    openGraph: {
      title: `${indicatorData.human_name} Indicator | Dhruvan`,
      description: `Explore the ${indicatorData.human_name} indicator on Dhruvan.`,
      url: `https://gnanadhandayuthapani.com/indicators/${params.indicator}`,
      images: [
        {
          url: '/og/indicator.png',
          width: 1200,
          height: 630,
          alt: `${indicatorData.human_name} Indicator | Dhruvan`,
        }
      ],
      siteName: 'Dhruvan',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${indicatorData.human_name} Indicator | Dhruvan`,
      description: `Explore the ${indicatorData.human_name} indicator on Dhruvan.`,
      images: ['/og/indicator.png'],
    }
  };
}

async function getIndicator(indicator: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/indicator/${indicator}`);
  if (!res.ok) {
    throw new Error('Failed to fetch indicator data');
  }
  return res.json();
}

async function getIndicatorValues(indicator: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/indicator/${indicator}/values`);
  if (!res.ok) {
    throw new Error('Failed to fetch indicator values');
  }
  return res.json();
}

async function getBitcoinPriceData() {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/price`);
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
    <div className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 font-sans min-h-screen'>
      <main className='mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
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