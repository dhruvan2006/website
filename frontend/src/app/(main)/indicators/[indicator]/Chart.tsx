'use client';

import React from 'react';
import dynamic from 'next/dynamic'

function ChartSkeleton() {
  return (
    <div className='w-full h-[75vh] animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
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

interface BitcoinDataPoint {
  date: string;
  price: number;
}

export default function Chart({ ticker, color, data, bitcoinData }: { ticker: string, color: string, data: DataPoint[], bitcoinData: BitcoinDataPoint[] }) {
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedBitcoinData = bitcoinData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const indicatorTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: ticker,
    x: sortedData.map((d: DataPoint) => d.date),
    y: sortedData.map((d: DataPoint) => d.value),
    line: {color: color},
    yaxis: 'y2',
  };

  const bitcoinTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: 'Bitcoin',
    x: sortedBitcoinData.map(d => d.date),
    y: sortedBitcoinData.map(d => d.price),
    line: {color: '#ff0000'},
  }

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: color, family: 'Apercu, sans-serif', size: 14 },
    margin: { l: 50, r: 50, t: 30, b: 50 },
    xaxis: {
      title: 'Date',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    yaxis: {
      title: 'Bitcoin Price (USD)',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)',
      type: 'log'
    },
    yaxis2: {
      title: ticker,
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)'
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
    <div className='w-full h-[75vh]'>
      <Plot
        className='w-full h-full'
        data={[bitcoinTrace, indicatorTrace]}
        layout={layout}
        config={config}
        useResizeHandler={true}
      />
    </div>
  )
}