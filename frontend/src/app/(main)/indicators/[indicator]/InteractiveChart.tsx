'use client';

import React, { useState, useMemo } from 'react';
import Chart from './Chart';
import DatePicker from '../../../components/DatePicker';
import { Indicator } from '../page';
import Histogram from './Histogram';
import NormalProbabilityPlot from './NormalProbabilityPlot';

// Download to csv
function downloadCSV(indicatorData: DataPoint[], bitcoinData: BitcoinDataPoint[], fileName: string) {
  const mergedData = indicatorData.map(indicator => {
    const bitcoin = bitcoinData.find(b => b.date === indicator.date);
    return {
      date: indicator.date,
      value: indicator.value,
      price: bitcoin ? bitcoin.price : 'N/A' // In case there's no matching Bitcoin price
    };
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + ["Date,Value,Price", ...mergedData.map(d => `${d.date},${d.value},${d.price}`)].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface DataPoint {
  date: string;
  value: number;
}

interface BitcoinDataPoint {
  date: string;
  price: number;
}

interface InteractiveChartProps {
  initialIndicatorData: DataPoint[];
  initialBitcoinData: BitcoinDataPoint[];
  indicator: Indicator;
}

export default function InteractiveChart({ initialIndicatorData, initialBitcoinData, indicator }: InteractiveChartProps) {
  const [startDate, setStartDate] = useState<string>(new Date(2014, 1, 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filteredIndicatorData = useMemo(() => {
    return initialIndicatorData.filter(
      (dataPoint) => dataPoint.date >= startDate && dataPoint.date <= endDate
    );
  }, [initialIndicatorData, startDate, endDate]);

  const filteredBitcoinData = useMemo(() => {
    return initialBitcoinData.filter(
      (dataPoint) => dataPoint.date >= startDate && dataPoint.date <= endDate
    );
  }, [initialBitcoinData, startDate, endDate]);

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-center justify-around mb-4'>
        <h1 className='mt-5 flex-4 text-3xl font-bold mb-4 sm:mb-0 text-center tracking-wide'>{indicator.human_name}</h1>
        <div className='flex-5 flex flex-col sm:flex-row gap-4'>
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
        <button className='mt-6 ms-2' onClick={() => downloadCSV(filteredIndicatorData, filteredBitcoinData, indicator.human_name)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6 hover:stroke-[#474747]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>

      <div className='mb-4'>
        <Chart ticker={indicator.human_name} color="#000" data={filteredIndicatorData} bitcoinData={filteredBitcoinData} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Histogram ticker={indicator.human_name} color="#000" data={filteredIndicatorData} />
        <NormalProbabilityPlot ticker={indicator.human_name} color="#000" data={filteredIndicatorData} />
      </div>
    </div>
  );
}