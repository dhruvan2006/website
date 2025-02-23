'use client';

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import DataPlot from './DataPlot';
import DatePicker from '../../components/DatePicker';
import { CombinedSeriesData, SeriesData } from './page';
import { useRouter } from 'next/navigation';
import {useTheme} from "@/ThemeContext";

// Function to download as CSV
const downloadCSV = (data: SeriesData[]) => {
  if (!data || data.length === 0) return;

  const headers = ['date', 'value'];
  const rows = data.map(row => `${row.date},${row.value}`);
  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'fed_liquidity.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


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
  const { theme } = useTheme();

  const color = theme === "dark" ? "#d8d5d0" : "#191919";

  useEffect(() => {
    const { roc1D, roc3D } = calculateROC(combinedSeriesData['LIQUIDITY']);
    setRoc1D(roc1D);
    setRoc3D(roc3D);
  }, [combinedSeriesData]);

  const getColorClass = (value: number | null) => {
    if (value === null) return 'text-white';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const handleButtonUpdate = () => {
    router.push(`/liquidity?startDate=${localStartDate}&endDate=${localEndDate}`);
  };

  return (
    <div className='min-h-screen flex flex-col font-sans bg-white text-zinc-900 dark:bg-[#181a1b] dark:text-zinc-300'>

      {/* Liquidity Overview */}
      <main>
        <div className='mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
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
                className='m-0 sm:mt-7 lg:ml-8 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition duration-300 py-2 px-6 rounded-md'
                onClick={handleButtonUpdate}
              >
                Update
              </button>
            </div>
          </div>

          <div className='mb-6'>
            <div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-2'>
              <h2 className='text-xl font-semibold'>Liquidity Overview</h2>
              <div className='flex gap-4 items-center'>
                <div className='flex gap-4'>
                  <p>ROC 1D: <span className={getColorClass(roc1D)}>{roc1D !== null ? `${roc1D.toFixed(2)}%` : 'N/A'}</span></p>
                  <p>ROC 3D: <span className={getColorClass(roc3D)}>{roc3D !== null ? `${roc3D.toFixed(2)}%` : 'N/A'}</span></p>
                </div>
                <button 
                  className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-[#fff] py-1.5 px-4 text-sm rounded-md transition-colors duration-300'
                  onClick={() => downloadCSV(combinedSeriesData['LIQUIDITY'])}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>CSV</span>
                </button>
              </div>
            </div>
            <DataPlot
              ticker="LIQUIDITY"
              color={color}
              data={combinedSeriesData['LIQUIDITY'] || []} />
          </div>
        </div>

        {/* Understanding FED Liquidity */}
        <div className='w-full bg-zinc-100 dark:bg-[#1e2022] py-8 mb-4 border-y border-zinc-300 dark:border-zinc-700'>
          <div className='container mx-auto px-4 sm:px-8 lg:px-16'>
            <h2 className='text-3xl font-bold mb-6 text-center'>Understanding FED Liquidity</h2>
            
            <p className="text-center mb-8">FED Liquidity is a measure of the money supply in the U.S. financial system. It&apos;s influenced by several key components, each affecting the overall liquidity in different ways.</p>
            
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4'>Components of FED Liquidity</h3>
              <div className='flex flex-wrap gap-3 mb-4'>
                {['Balance Sheet', 'Treasury General Account', 'Reverse Repo Program', 'Bank Term Funding Program', 'Credit Facility'].map((component) => (
                  <span key={component} className='bg-white dark:bg-[#181a1b] px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition duration-300'>{component}</span>
                ))}
              </div>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              {[
                { 
                  title: 'Balance Sheet (WALCL)', 
                  effect: 'Increase', 
                  impact: 'Liquidity Injection',
                  description: 'Represents what the Fed owns. Growth injects money into the economy.'
                },
                { 
                  title: 'Treasury General Account (TGA)', 
                  effect: 'Increase', 
                  impact: 'Liquidity Drain',
                  description: 'The government\'s checking account. Spending from here releases money into markets.'
                },
                { 
                  title: 'Reverse Repo Program (RRPONTSYD)', 
                  effect: 'Increase', 
                  impact: 'Liquidity Drain',
                  description: 'Tool to control short-term interest rates. Higher usage means more money sucked out of the system.'
                },
                { 
                  title: 'Bank Term Funding Program (H41RESPPALDKNWW)', 
                  effect: 'Increase', 
                  impact: 'Liquidity Injection',
                  description: 'Loan program for banks. More loans mean more liquidity in the banking system.'
                },
                { 
                  title: 'Credit Facility (WLCFLPCL)', 
                  effect: 'Increase', 
                  impact: 'Liquidity Injection',
                  description: 'Lending program supporting banking stability. More lending increases liquidity.'
                },
              ].map((item) => (
                <div key={item.title} className='bg-white dark:bg-[#181a1b] p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300'>
                  <h4 className='font-semibold mb-2'>{item.title}</h4>
                  <p className='text-sm mb-2'>
                    Effect: <span className={`font-semibold ${item.effect === 'Increase' ? 'text-green-600' : 'text-red-600'}`}>{item.effect}</span>
                  </p>
                  <p className='text-sm mb-2'>
                    Impact: <span className='font-semibold text-blue-600'>{item.impact}</span>
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-300'>{item.description}</p>
                </div>
              ))}
            </div>

            <div className='bg-white dark:bg-[#181a1b] p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300'>
              <h3 className='text-xl font-semibold mb-4 text-center'>FED Liquidity Formula</h3>
              <p className='text-lg mb-4 text-center'>
                <InlineMath math="WALCL - TGA - RRPONTSYD + H41RESPPALDKNWW + WLCFLPCL" />
              </p>
              <p className='text-sm text-center text-gray-600 dark:text-gray-300'>This formula combines the effects of all components to calculate overall FED Liquidity.</p>
            </div>
          </div>
        </div>

        {/* Constituent Plots */}
        <div className='mb-6 container mx-auto px-4 sm:px-8 lg:px-16'>
          <h2 className='text-2xl font-semibold text-center mb-4'>Components of Liquidity</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Object.entries(tickers).slice(1).map(([ticker, color]) => {
              return (
                <div key={ticker} className={`border border-zinc-300 dark:border-zinc-700 bg-gray-100 dark:bg-[#1e2022] shadow-sm hover:shadow-md transition duration-300`}>
                  <DataPlot ticker={ticker} color={color} data={combinedSeriesData[ticker] || []} />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {lastUpdated && (
        <div className="fixed bottom-0 right-0 bg-[#191919] text-[#fff] p-2 rounded-tl-md text-sm">
          <b>Last Fetch:</b> {formatDate(lastUpdated)}
        </div>
      )}
    </div>
  );
}
