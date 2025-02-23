'use client';

import React from 'react';
import dynamic from 'next/dynamic'

function ChartSkeleton() {
  return (
    <div className='w-full h-[50vh] animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-zinc-900 dark:text-zinc-300'>Chart Loading...</span>
    </div>
  );
}

// Display skeleton until it laods
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

interface DataPoint {
    date: string;
    value: number;
  }
  
  interface HistogramProps {
    ticker: string;
    color: string;
    data: DataPoint[];
  }

  export default function Histogram({ ticker, color, data }: HistogramProps) {
  const histogramTrace: Plotly.Data = {
    type: 'histogram',
    x: data.map((d: DataPoint) => d.value),
    name: 'Distribution',
    marker: { color: color },
  };

  const layout: Partial<Plotly.Layout> = {
    title: 'Distribution',
    autosize: true,
    height: 300,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: color, family: 'Apercu, sans-serif', size: 14 },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    xaxis: {
      title: ticker,
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    yaxis: {
      title: 'Frequency',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
  }

  const config: Partial<Plotly.Config> = {
    displayModeBar: false
  }

  return (
    <div className='w-full h-[50vh]'>
      <Plot 
        className='w-full h-full' 
        data={[histogramTrace]} 
        layout={layout} 
        config={config} 
        useResizeHandler={true} 
      />
    </div>
  )
}
