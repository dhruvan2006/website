import React, { Suspense } from 'react';
import { customFetch } from '@/api';
import { Metadata } from 'next';
import OptimalClient from './OptimalClient';

export const metadata: Metadata = {
  title: 'Optimal Leverage Calculator | Dhruvan',
  description: 'TODO:'
}

// Fallback component
function OptimalFallback() {
  return (
    <div className='h-[88vh] flex items-center justify-center'>
      <div className="animate-spin rounded-full h-32 w-32 border-8 border-black border-t-8 border-t-transparent"></div>
    </div>
  )
}

async function fetchOptimalData(ticker: string, start_date: string, end_date: string, fees: number, lower_lev: number, upper_lev: number) {
  const url = `${process.env.API_BASE_URL}/api/optimal/`;
  try {
    const response = await customFetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: ticker,
        start_date: start_date,
        end_date: end_date,
        fees: fees,
        lower_lev: lower_lev,
        upper_lev: upper_lev
      }),
    });
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

export default async function OptimalPage({
  searchParams
}: {
  searchParams: {
    ticker?: string,
    startDate?: string,
    endDate?: string,
    fees?: number,
    lowerLev?: number,
    upperLev?: number
  }
}) {
  const ticker = searchParams.ticker || "BTC-USD";
  const startDate = searchParams.startDate || new Date("2023-01-01").toISOString().split('T')[0];
  const endDate = searchParams.endDate || new Date().toISOString().split('T')[0];
  const fees = searchParams.fees || 0;
  const lowerLev = searchParams.lowerLev || 0;
  const upperLev = searchParams.upperLev || 8;

  const data = await fetchOptimalData(ticker, startDate, endDate, fees, lowerLev, upperLev);
  
  return (
    <div className='bg-[#fff] text-[#191919] font-sans'>
      <Suspense fallback={<OptimalFallback />}>
        <OptimalClient apiBase={process.env.API_BASE_URL || ""} ticker={ticker} data={data} startDate={startDate} endDate={endDate} fees={fees} lowerLev={lowerLev} upperLev={upperLev} />
      </Suspense>
    </div>
  );
}