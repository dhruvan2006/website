import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import LiquidityClient from './LiquidityClient';

// Metadata
export const metadata: Metadata = {
  title: "FED Liquidity | Dhruvan",
  description: "Explore live FED liquidity data. Learn how liquidity works and visualize its effect on Bitcoin price."
}

// Types and constants
export type SeriesData = {
  id: number;
  ticker: string;
  date: string;
  value: number;
}

export type CombinedSeriesData = {
  [key: string]: SeriesData[];
}

const tickers = {
  'LIQUIDITY': '#ededed',
  'WALCL': '#ff5733', // Vibrant red
  'TGA': '#33c1ff',   // Bright cyan
  'RRPONTSYD': '#6f42c1', // Bright purple
  'H41RESPPALDKNWW': '#ff5733', // Vibrant red
  'WLCFLPCL': '#33c1ff' // Bright cyan
};

// Server-side data fetching
async function fetchSeriesData(ticker: string, startDate: string, endDate: string): Promise<SeriesData[]> {
  const url = `${process.env.API_BASE_URL}/api/liquidity/series?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function fetchLastUpdated(): Promise<string | null> {
  const url = `${process.env.API_BASE_URL}/api/liquidity/last_updated`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.last_updated;
  } catch (error) {
    console.error('Error fetching last updated:', error);
    return null;
  }
}

// Fallback component
function LiquidityFallback() {
  return (
    <div className='h-[88vh] flex items-center justify-center'>
      <div className="animate-spin rounded-full h-32 w-32 border-8 border-black border-t-8 border-t-transparent"></div>
    </div>
  )
}

export default async function Liquidity({
  searchParams
}: {
  searchParams: { startDate?: string, endDate?: string }
}) {
  const nineMonthsAgo = new Date();
  nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

  const startDate = searchParams.startDate || nineMonthsAgo.toISOString().split('T')[0];
  const endDate = searchParams.endDate || new Date().toISOString().split('T')[0];

  const seriesData = await Promise.all(
    Object.keys(tickers).map(async (ticker) => {
      const data = await fetchSeriesData(ticker, startDate, endDate);
      return { [ticker]: data };
    }
  ));

  const combinedSeriesData: CombinedSeriesData = Object.assign({}, ...seriesData);

  const lastUpdated = await fetchLastUpdated();

  return (
    <Suspense fallback={<LiquidityFallback />}>
      <LiquidityClient
        combinedSeriesData={combinedSeriesData}
        lastUpdated={lastUpdated}
        startDate={startDate}
        endDate={endDate}
        tickers={tickers}
      />
    </Suspense>
  )
}
