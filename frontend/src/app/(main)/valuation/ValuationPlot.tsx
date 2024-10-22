'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ValuationPoint } from './page';

function ChartSkeleton() {
  return (
    <div className='w-full h-[75vh] animate-pulse bg-[#f0f0f0] flex items-center justify-center rounded-md'>
      <span className='text-[#191919]'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

interface ValuationPlotProps {
  valuationData: ValuationPoint[];
  bitcoinData: { date: string; price: number }[];
}

export default function ValuationPlot({ valuationData, bitcoinData }: ValuationPlotProps) {
  const sortedValuation = valuationData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedBitcoin = bitcoinData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const valuationTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: 'Valuation',
    x: sortedValuation.map((d) => d.date),
    y: sortedValuation.map((d) => d.value),
    line: { color: '#00aaff' },
    yaxis: 'y2', // Plots on the second y-axis
  };

  const bitcoinTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: 'Bitcoin Price',
    x: sortedBitcoin.map((d) => d.date),
    y: sortedBitcoin.map((d) => d.price),
    line: { color: '#ff0000' },
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
      gridcolor: 'rgba(0,0,0,0.1)',
    },
    yaxis: {
      title: 'Bitcoin Price (USD)',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)',
      type: 'log', // Logarithmic scale for Bitcoin price
    },
    yaxis2: {
      title: 'Valuation',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      gridcolor: 'rgba(0,0,0,0.1)',
    },
    legend: {
      x: 0,
      y: 1,
      orientation: 'h',
    },
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: false,  // Hide the mode bar
  };

  return (
    <div className='w-full h-[75vh]'>
      <Plot
        className='w-full h-full'
        data={[bitcoinTrace, valuationTrace]}
        layout={layout}
        config={config}
        useResizeHandler={true}
      />
    </div>
  );
}