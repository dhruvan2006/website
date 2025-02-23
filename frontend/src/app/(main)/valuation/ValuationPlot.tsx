'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ValuationPoint } from './page';
import {useTheme} from "@/ThemeContext";

function ChartSkeleton() {
  return (
    <div className='w-full h-[75vh] animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-zinc-900 dark:text-zinc-100'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

interface ValuationPlotProps {
  valuationData: ValuationPoint[];
  bitcoinData: { date: string; price: number }[];
}

export default function ValuationPlot({ valuationData, bitcoinData }: ValuationPlotProps) {
  const { theme } = useTheme();
  const themeColor = theme === "dark" ? "#d8d5d0" : "#191919";

  const sortedValuation = valuationData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedBitcoin = bitcoinData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const valuationTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: 'Valuation',
    x: sortedValuation.map((d) => d.date),
    y: sortedValuation.map((d) => d.value),
    line: { color: themeColor },
    yaxis: 'y2', // Plots on the second y-axis
  };

  const bitcoinTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: 'Bitcoin Price',
    x: sortedBitcoin.map((d) => d.date),
    y: sortedBitcoin.map((d) => d.price),
    line: { color: '#ff9900' },
  };

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: themeColor, family: 'Apercu, sans-serif', size: 14 },
    margin: { l: 50, r: 50, t: 0, b: 50 },
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
