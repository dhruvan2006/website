'use client';

import React, { useState, useMemo } from 'react';
import Chart from './Chart';
import DatePicker from '../../../components/DatePicker';
import { Indicator } from '../page';
import Histogram from './Histogram';
import NormalProbabilityPlot from './NormalProbabilityPlot';

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
        <h1 className='flex-4 text-3xl font-bold mb-4 sm:mb-0 text-center tracking-wide'>{indicator.human_name.toUpperCase()} Indicator</h1>
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