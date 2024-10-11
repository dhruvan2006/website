'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker';
import NumberPicker from '@/components/NumberPicker';
import TickerPicker from '@/components/TickerPicker';
import OptimalPlot from './OptimalPlot';
import PricePlot from './PricePlot';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export type Data = {
  ticker: string;
  start_date: string;
  end_date: string;
  fees: number;
  lower_lev: number;
  upper_lev: number;
  k_max: number;
  R_max: number;
  R: number[]
  R_fees: number[];
  k: number[];
  dates: number[];
  close: number[];
}

type OptimalClientProps = {
  apiBase: string;
  ticker: string;
  data: Data;
  startDate: string;
  endDate: string;
  fees: number;
  lowerLev: number;
  upperLev: number;
}

export default function OptimalClient({ apiBase, ticker, data, startDate, endDate, fees, lowerLev, upperLev }: OptimalClientProps) {
  const [localTicker, setLocalTicker] = useState<string>(ticker);
  const [localStartDate, setLocalStartDate] = useState<string>(startDate);
  const [localEndDate, setLocalEndDate] = useState<string>(endDate);
  // TODO: Add fees const [localFees, setLocalFees] = useState<number>(fees);
  const [localLowerLev, setLocalLowerLev] = useState<number>(lowerLev);
  const [localupperLev, setLocalupperLev] = useState<number>(upperLev);
  const router = useRouter();

  const handleButtonUpdate = () => {
    router.push(`/optimal?ticker=${localTicker}&startDate=${localStartDate}&endDate=${localEndDate}&fees=${fees}&lowerLev=${localLowerLev}&upperLev=${localupperLev}`);
  };

  // TODO: Key down handler
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleButtonUpdate();
    }
  };

  return (
    <div className='min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>
      <main>
        <div className='container mx-auto px-4 sm:px-8 lg:px-16 py-4'>
          <div className='flex flex-col justify-between items-center'>
            <h1 className='text-3xl font-bold mb-4'>Optimal Leverage</h1>
            
            <div className='mb-6 flex flex-col xl:flex-row gap-4 items-center w-full lg:w-auto justify-between'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <TickerPicker
                  apiBase={apiBase}
                  label="Ticker"
                  value={localTicker}
                  onChange={setLocalTicker}
                />
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
              <div className='flex flex-col sm:flex-row'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  {/* <NumberPicker
                    label="Fees"
                    value={localFees}
                    onChange={setLocalFees}
                  /> */}
                  <NumberPicker
                    label="Lower Leverage"
                    value={localLowerLev}
                    onChange={setLocalLowerLev}
                  />
                  <NumberPicker
                    label="Upper Leverage"
                    value={localupperLev}
                    onChange={setLocalupperLev}
                  />
                </div>
                <button
                  className='m-0 mt-6 sm:mt-7 sm:ml-8 bg-[#191919] hover:bg-[#474747] text-white transition duration-300 py-2 px-6 rounded-md'
                  onClick={handleButtonUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className='mb-8 p-4 bg-zinc-100 rounded-sm border border-zinc-300'>
            <OptimalPlot ticker={ticker} data={data} />
          </div>

          <div className='mb-8 p-4 bg-zinc-100 rounded-sm border border-zinc-300'>
            <PricePlot ticker={ticker} data={data} />
          </div>
        </div>

        <div className="w-full bg-zinc-100 py-8 border-y border-zinc-300">
          <div className="container mx-auto px-4 sm:px-8 lg:px-16 space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Calculation of Optimal Leverage Curves
            </h2>
            <p>
              Leveraged ETFs are affected by the concept of <strong>volatility drag</strong>, which refers to the loss in returns caused by daily market volatility. This drag impacts all leveraged ETFs.
            </p>
            <p>
              This paper<sup>[1]</sup> presents a formula for the long-term compound annual growth rate of a leveraged ETF, which is approximated as: {' '}
            </p>
            <BlockMath math={`R = k \\mu - \\frac{0.5 k^2 \\sigma^2}{1 + k \\mu}`} />
            <p>
              Here, <InlineMath math='R' /> represents the compound daily growth rate, <InlineMath math='k' /> denotes the ETF leverage, <InlineMath math='\mu' /> is the mean daily return of the benchmark, and <InlineMath math='\sigma' /> indicates the daily volatility of the benchmark.
            </p>
            <p>
              References:
              <br />
              <span className='ms-4'>
                [1] Cooper, Tony, Alpha Generation and Risk Smoothing Using Managed Volatility (August 25, 2010). Available at SSRN: <a className='text-blue underline cursor-pointer' href="https://ssrn.com/abstract=1664823" target='_blank'>https://ssrn.com/abstract=1664823</a> or <a className='text-blue underline cursor-pointer' href='http://dx.doi.org/10.2139/ssrn.1664823' target='_blank'>http://dx.doi.org/10.2139/ssrn.1664823</a>
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
