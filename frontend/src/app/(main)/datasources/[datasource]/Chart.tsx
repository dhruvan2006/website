'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic'
import DatePicker from '../../../components/DatePicker';

function ChartSkeleton() {
  return (
    <div className='w-full h-[75vh] animate-pulse bg-[#f0f0f0] flex items-center justify-center rounded-md'>
      <span className='text-[#191919]'>Chart Loading...</span>
    </div>
  );
}

// Display skeleton until it laods
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

interface DataSource {
  id: string;
  name: string;
  url: string;
}

interface DataSourceValue {
  date: string;
  value: number;
}


export default function Chart({ datasource, datasourceValues }: { datasource: DataSource, datasourceValues: DataSourceValue[] }) {
  const [startDate, setStartDate] = useState<string>(new Date(2009, 1, 3).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filteredData = useMemo(() => {
    return datasourceValues.filter(
      (dataPoint) => dataPoint.date >= startDate && dataPoint.date <= endDate
    );
  }, [datasourceValues, startDate, endDate]);

  const datasourceTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: datasource.name,
    x: filteredData.map(d => d.date),
    y: filteredData.map(d => d.value),
    line: {color: '#191919'},
    yaxis: 'y2',
  };

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#191919', family: 'Apercu, sans-serif', size: 14 },
    margin: { l: 50, r: 50, t: 30, b: 50 },
    xaxis: {
      title: 'Date',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    yaxis: {
      title: datasource.name,
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)',
      type: 'log'
    },
    legend: {
      x: 0,
      y: 1,
      orientation: 'h'
    }
  }

  const config: Partial<Plotly.Config> = {
    displayModeBar: false
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-center justify-around mb-4'>
        <h1 className='flex-4 text-3xl font-bold mb-4 sm:mb-0 text-center tracking-wide'>{datasource.name} Source</h1>
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

      <div className='w-full h-[75vh] mb-4'>
        <Plot
          className='w-full h-full'
          data={[datasourceTrace]}
          layout={layout}
          config={config}
          useResizeHandler={true}
        />
      </div>
    </div>
  );
}