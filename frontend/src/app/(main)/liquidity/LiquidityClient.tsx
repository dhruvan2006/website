'use client';

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import DataPlot from './DataPlot';
import DatePicker from '../../components/DatePicker';
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

        {/* Understanding FED Liquidity */}
        <div className='w-full bg-gray-100 py-8 mb-4 border-y border-zinc-300'>
          <div className='container mx-auto px-4 sm:px-8 lg:px-16'>
            <h2 className='text-3xl font-bold mb-6 text-center'>Understanding FED Liquidity</h2>
            
            <p className='text-center mb-8'>FED Liquidity is a measure of the money supply in the U.S. financial system. It's influenced by several key components, each affecting the overall liquidity in different ways.</p>
            
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4'>Components of FED Liquidity</h3>
              <div className='flex flex-wrap gap-3 mb-4'>
                {['Balance Sheet', 'Treasury General Account', 'Reverse Repo Program', 'Bank Term Funding Program', 'Credit Facility'].map((component) => (
                  <span key={component} className='bg-[#fff] px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition duration-300'>{component}</span>
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
                <div key={item.title} className='bg-[#fff] p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300'>
                  <h4 className='font-semibold mb-2'>{item.title}</h4>
                  <p className='text-sm mb-2'>
                    Effect: <span className={`font-semibold ${item.effect === 'Increase' ? 'text-green-600' : 'text-red-600'}`}>{item.effect}</span>
                  </p>
                  <p className='text-sm mb-2'>
                    Impact: <span className='font-semibold text-blue-600'>{item.impact}</span>
                  </p>
                  <p className='text-xs text-gray-600'>{item.description}</p>
                </div>
              ))}
            </div>

            <div className='bg-[#fff] p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300'>
              <h3 className='text-xl font-semibold mb-4 text-center'>FED Liquidity Formula</h3>
              <p className='text-lg mb-4 text-center'>
                <InlineMath math="WALCL - TGA - RRPONTSYD + H41RESPPALDKNWW + WLCFLPCL" />
              </p>
              <p className='text-sm text-center text-gray-600'>This formula combines the effects of all components to calculate overall FED Liquidity.</p>
            </div>
          </div>
        </div>

        {/* Constituent Plots */}
        <div className='mb-6 container mx-auto px-4 sm:px-8 lg:px-16'>
          <h2 className='text-2xl font-semibold text-center mb-4'>Components of Liquidity</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Object.entries(tickers).slice(1).map(([ticker, color]) => {
              return (
                <div key={ticker} className={`border border-zinc-300 bg-gray-100 shadow-sm hover:shadow-md transition duration-300`}>
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
