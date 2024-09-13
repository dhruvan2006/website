'use client';

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import DataPlot from './DataPlot';
import DatePicker from '../DatePicker';

export type SimpleDataPoint = {
  date: string;
  value: number;
}

export type SeriesData = {
  [key: string]: SimpleDataPoint[];
}

const tickers = {
  'LIQUIDITY': '#ededed',
  'WALCL': '#ff5733', // Vibrant red
  'TGA': '#33c1ff',   // Bright cyan
  'RRPONTSYD': '#6f42c1', // Bright purple
  'H41RESPPALDKNWW': '#ff5733', // Vibrant red
  'WLCFLPCL': '#33c1ff' // Bright cyan
};

export default function Liquidity() {
  const nineMonthsAgo = new Date();
  nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

  const [seriesData, setSeriesData] = useState<SeriesData>({});
  const [roc1D, setRoc1D] = useState<number | null>(null);
  const [roc3D, setRoc3D] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(nineMonthsAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchLastUpdated = async () => {
    try {
      const response = await axios.get('/api/liquidity/last_updated/');
      const date = new Date(response.data.last_updated);
      setLastUpdated(date.toLocaleString());
    } catch (error) {
      console.error('Error fetching last updated:', error);
      setLastUpdated(null);
    }
  };

  // Heavy lifting
  const fetchData = async () => {
    try {
      const responses = await Promise.all(Object.keys(tickers).map(ticker => 
        axios.get(`/api/liquidity/series?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`)
      ));
      const newSeriesData = responses.reduce<SeriesData>((acc, response, index) => {
        acc[Object.keys(tickers)[index]] = response.data.map((item: any) => ({
          date: item.date,
          value: item.value
        }));
        return acc;
      }, {});
      setSeriesData(newSeriesData);
      
      // Calculate ROC for LIQUIDITY
      if (newSeriesData['LIQUIDITY'] && newSeriesData['LIQUIDITY'].length > 3) {
        const liquidityData = newSeriesData['LIQUIDITY'];
        const latestValue = liquidityData[liquidityData.length - 1].value;
        const oneDayAgoValue = liquidityData[liquidityData.length - 2].value;
        const threeDaysAgoValue = liquidityData[liquidityData.length - 4].value;
        
        setRoc1D(((latestValue - oneDayAgoValue) / oneDayAgoValue) * 100);
        setRoc3D(((latestValue - threeDaysAgoValue) / threeDaysAgoValue) * 100);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLastUpdated();
  }, []);

  const getColorClass = (value: number | null) => {
    if (value === null) return 'text-white';
    return value >= 0 ? 'text-green' : 'text-red';
  };

  const handleButtonUpdate = () => {
    fetchData();
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
                  value={startDate}
                  onChange={setStartDate} 
                />
                <DatePicker 
                  label="End Date" 
                  value={endDate} 
                  onChange={setEndDate} 
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
            <DataPlot ticker="LIQUIDITY" color="#191919" data={seriesData['LIQUIDITY'] || []} />
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
                  <DataPlot ticker={ticker} color={color} data={seriesData[ticker] || []} />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {lastUpdated && (
        <div className="fixed bottom-0 right-0 bg-[#191919] text-[#fff] p-2 rounded-tl-md text-sm">
          Last Updated: {lastUpdated}
        </div>
      )}
    </div>
  );
}
