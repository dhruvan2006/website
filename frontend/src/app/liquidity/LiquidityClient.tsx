'use client';

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import DataPlot from './DataPlot';
import DatePicker from '../DatePicker';
import { CombinedSeriesData, SeriesData } from './page';
import { useRouter } from 'next/navigation';

// Calculate ROC for LIQUIDITY
function calculateROC(data: CombinedSeriesData['LIQUIDITY'] | undefined) {
  if (!data || data.length < 4) {
    return { roc1D: null, roc3D: null };
  }
  
  const latestValue = data[data.length - 1].value;
  const oneDayAgoValue = data[data.length - 2].value;
  const threeDaysAgoValue = data[data.length - 4].value;
  
  const roc1D = ((latestValue - oneDayAgoValue) / oneDayAgoValue) * 100;
  const roc3D = ((latestValue - threeDaysAgoValue) / threeDaysAgoValue) * 100;

  return { roc1D, roc3D };
}

// Formate date for last updated
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');
}

export default function LiquidityClient({
  combinedSeriesData,
  lastUpdated,
  startDate,
  endDate,
  tickers,
}: {
  combinedSeriesData: CombinedSeriesData;
  lastUpdated: string | null;
  startDate: string;
  endDate: string;
  tickers: { [key: string]: string };
}) {
  const [roc1D, setRoc1D] = useState<number | null>(null);
  const [roc3D, setRoc3D] = useState<number | null>(null);
  const [localStartDate, setLocalStartDate] = useState<string>(startDate);
  const [localEndDate, setLocalEndDate] = useState<string>(endDate);
  const router = useRouter();

  useEffect(() => {
    const { roc1D, roc3D } = calculateROC(combinedSeriesData['LIQUIDITY']);
    setRoc1D(roc1D);
    setRoc3D(roc3D);
  }, [combinedSeriesData['LIQUIDITY']]);

  const getColorClass = (value: number | null) => {
    if (value === null) return 'text-white';
    return value >= 0 ? 'text-green' : 'text-red';
  };

  const handleButtonUpdate = () => {
    router.push(`/liquidity?startDate=${localStartDate}&endDate=${localEndDate}`);
  };

  return (
    <div className='min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>

      {/* Liquidity Overview */}
      <main>
        <div className='container mx-auto px-4 sm:px-8 lg:px-16 py-4'>
          <div className='flex flex-col lg:flex-row justify-between items-center'>
            <h1 className='text-3xl font-bold mb-8'>FED Liquidity</h1>
            
            <div className='mb-6 flex flex-col sm:flex-row items-center w-full lg:w-auto justify-between'>
              <div className='flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0'>
                <DatePicker 
                  label="Start Date" 
                  value={localStartDate}
                  onChange={setLocalStartDate} 
                />
                <DatePicker 
                  label="End Date" 
                  value={localEndDate} 
                  onChange={setLocalEndDate} 
                />
              </div>
              <button 
                className='m-0 sm:mt-7 lg:ml-8 bg-[#191919] hover:bg-[#474747] text-white transition duration-300 py-2 px-6 rounded-md'
                onClick={handleButtonUpdate}
              >
                Update
              </button>
            </div>
          </div>

          <div className='mb-6'>
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-xl font-semibold'>Liquidity Overview</h2>
              <div className='flex gap-4'>
                <p>ROC 1D: <span className={getColorClass(roc1D)}>{roc1D !== null ? `${roc1D.toFixed(2)}%` : 'N/A'}</span></p>
                <p>ROC 3D: <span className={getColorClass(roc3D)}>{roc3D !== null ? `${roc3D.toFixed(2)}%` : 'N/A'}</span></p>
              </div>
            </div>
            <DataPlot ticker="LIQUIDITY" color="#191919" data={combinedSeriesData['LIQUIDITY'] || []} />
          </div>
        </div>

        {/* How it works */}
        <div className='w-full bg-gray-100 py-4 mb-4 border-y border-zinc-300'>
          <div className='container mx-auto px-4 sm:px-8 lg:px-16 text-center'>
            <h2 className='text-xl font-semibold mb-2'>How it works</h2>
            <p className='text-sm mb-2'>
              <InlineMath math="WALCL - TGA - RRPONTSYD + H41RESPPALDKNWW + WLCFLPCL" />
            </p>
          </div>
        </div>

        {/* Constituent Plots */}
        <div className='mb-6 container mx-auto px-4 sm:px-8 lg:px-16'>
          <h2 className='text-2xl font-semibold text-center mb-4'>Component Plots</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Object.entries(tickers).slice(1).map(([ticker, color]) => {
              return (
                <div key={ticker} className={`border border-zinc-300 bg-gray-100 hover:shadow-sm transition duration-200`}>
                  <DataPlot ticker={ticker} color={color} data={combinedSeriesData[ticker] || []} />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {lastUpdated && (
        <div className="fixed bottom-0 right-0 bg-[#191919] text-[#fff] p-2 rounded-tl-md text-sm">
          <b>Last Updated:</b> {formatDate(lastUpdated)}
        </div>
      )}
    </div>
  );
}
