'use client';

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import DataPlot from './DataPlot';

export type SimpleDataPoint = {
  date: string;
  value: number;
}

export type SeriesData = {
  [key: string]: SimpleDataPoint[];
}

const tickers = {'LIQUIDITY': '#ededed', 'WALCL': '#0057ff', 'TGA': '#d64933', 'RRPONTSYD': '#0c7c59', 'H41RESPPALDKNWW': '#58a4b0', 'WLCFLPCL': '#bac1b8'};

function Home() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [seriesData, setSeriesData] = useState<SeriesData>({});
  const [roc1D, setRoc1D] = useState<number | null>(null);
  const [roc3D, setRoc3D] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(threeMonthsAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchLastUpdated = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/last_updated');
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
        axios.get(`http://localhost:8000/api/series/?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`)
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
    <div className='min-h-screen flex flex-col font-mono relative'>
      {/* Navbar */}
      <header className='bg-black border-b border-white border-opacity-65'>
        <nav className='flex justify-between items-center max-w-5xl mx-auto'>
          <div className='flex items-center px-4 py-5 md:py-4 justify-between w-full'>
            <h1 className='text-2xl text-white font-bold'>FED Liquidity</h1>

            <div className='flex flex-col items-end ml-auto mr-4'>
              <p className='text-white text-sm'>ROC 1D: 
                <span className={`ml-1 ${getColorClass(roc1D)}`}>
                  {roc1D !== null ? `${roc1D.toFixed(2)}%` : 'N/A'}
                </span>
              </p>
              <p className='text-white text-sm'>ROC 3D: 
                <span className={`ml-1 ${getColorClass(roc3D)}`}>
                  {roc3D !== null ? `${roc3D.toFixed(2)}%` : 'N/A'}
                </span>
              </p>
            </div>

            <img src="/usa.png" alt="USA Flag" className="h-8 w-auto" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center font-mono mx-auto">
        {/* Main Liquidity Plot */}
        <div className="w-full flex justify-center bg-lightblack pt-2 pb-4">
          <div className='max-w-6xl w-full'>
            <DataPlot ticker="LIQUIDITY" color="#ededed" data={seriesData['LIQUIDITY'] || []} />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-b border-white border-opacity-65"></div>

        {/* Date Pickers */}
        <div className='bg-black w-full flex gap-6 justify-center items-center p-4 pb-6 text-white'>
          <div className='flex gap-4'>
            <div className='flex flex-col items-start'>
              <span>Start Date:</span>
              <input 
                type="date" 
                className='bg-green px-4 py-2 rounded-md' 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className='flex flex-col items-start'>
              <span>End Date:</span>
              <input 
                type="date" 
                className='bg-green px-4 py-2 rounded-md' 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          <button className='bg-blue hover:bg-darkerblue px-4 py-2 mt-6 rounded-md' onClick={handleButtonUpdate}>Update</button>
        </div>

        {/* Divider */}
        <div className="w-full border-b border-white border-opacity-65"></div>

        <div className='w-full text-white bg-lightblack p-4 text-center'>
          <h1 className='text-xl mb-2 font-semibold'>How it works</h1>
          <p className='text-xs'>
            <InlineMath math="WALCL - TGA - RRPONTSYD + H41RESPPALDKNWW + WLCFLPCL" />
          </p>
        </div>
        
        {/* Components Plot */}
        <div className='bg-black grid grid-cols-1 md:grid-cols-2 max-w-7xl'>
          {Object.entries(tickers).slice(1).map(([ticker, color], index, array) => (
            <div 
              key={ticker} 
              className={`flex justify-center border border-white border-opacity-50 p-4 ${index === array.length - 1 ? 'md:col-span-2' : ''}`}
            >
              <DataPlot ticker={ticker} color={color} data={seriesData[ticker] || []} />
            </div>
          ))}
        </div>
      </main>

      {/* Last Updated Box */}
      <div className="fixed bottom-0 right-0 bg-blue p-2 rounded-tl-md">
        <p className="text-sm">Last Updated: {lastUpdated || 'N/A'}</p>
      </div>
    </div>
  );
}

export default Home;
