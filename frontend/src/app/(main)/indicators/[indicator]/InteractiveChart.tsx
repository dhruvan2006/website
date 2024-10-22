'use client';

import React, { useState, useMemo } from 'react';
import Chart from './Chart';
import DatePicker from '../../../components/DatePicker';
import { Indicator } from '../page';
import Histogram from './Histogram';
import NormalProbabilityPlot from './NormalProbabilityPlot';
import TransformationDropdown from './TransformationDropdown';
import * as XLSX from 'xlsx';
import DownloadDropdown from './DownloadDropdown';

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

// Download to Excel
function downloadExcel(indicatorData: DataPoint[], bitcoinData: BitcoinDataPoint[], fileName: string) {
  const mergedData = indicatorData.map(indicator => {
    const bitcoin = bitcoinData.find(b => b.date === indicator.date);
    return {
      Date: indicator.date,
      Value: indicator.value,
      Price: bitcoin ? bitcoin.price : 'N/A' // In case there's no matching Bitcoin price
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(mergedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
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
  const [startDate, setStartDate] = useState<string>(new Date(Date.UTC(2014, 0, 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [transformation, setTransformation] = useState<string>('x');

  const applyTransformation = (x: number): number => {
    switch (transformation) {
      case 'x²':
        return Math.pow(x, 2);
      case 'x':
        return x;
      case '√x':
        return Math.sqrt(x);
      case 'ln(x)':
        return Math.log(x);
      case '-1/√x':
        return -1 / Math.sqrt(x);
      case '-1/x':
        return -1 / x;
      case '-1/x²':
        return -1 / Math.pow(x, 2);
      default:
        return x;
    }
  };

  const filteredIndicatorData = useMemo(() => {
    return initialIndicatorData
      .filter((dataPoint) => dataPoint.date >= startDate && dataPoint.date <= endDate)
      .map(dataPoint => ({
        ...dataPoint,
        value: applyTransformation(dataPoint.value)
      }));
  }, [initialIndicatorData, startDate, endDate, applyTransformation]);

  const filteredBitcoinData = useMemo(() => {
    return initialBitcoinData.filter(
      (dataPoint) => dataPoint.date >= startDate && dataPoint.date <= endDate
    );
  }, [initialBitcoinData, startDate, endDate]);

  const handleDownloadSelect = (format: string) => {
    if (format === 'CSV') {
      downloadCSV(filteredIndicatorData, filteredBitcoinData, indicator.human_name);
    } else if (format === 'Excel') {
      downloadExcel(filteredIndicatorData, filteredBitcoinData, indicator.human_name);
    }
  };

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
        <div className='flex items-center mt-7 ms-2'>
          <DownloadDropdown onDownloadSelect={handleDownloadSelect} />
          <TransformationDropdown transformation={transformation} setTransformation={setTransformation} />
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