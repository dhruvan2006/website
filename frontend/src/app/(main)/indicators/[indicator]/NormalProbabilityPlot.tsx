'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import jstat from 'jstat';

function ChartSkeleton() {
  return (
    <div className='w-full h-[50vh] animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-zinc-900 dark:text-zinc-300'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

interface DataPoint {
  date: string;
  value: number;
}

interface NormalProbabilityPlotProps {
  ticker: string;
  color: string;
  data: DataPoint[];
}

export default function NormalProbabilityPlot({ ticker, color, data }: NormalProbabilityPlotProps) {
  const values = data.map(d => d.value).sort((a, b) => a - b);
  const n = values.length;
  const probabilities = values.map((_, i) => (i + 0.5) / n);

  const trace: Plotly.Data = {
    x: values,
    y: probabilities.map(p => jstat.normal.inv(p, 0, 1)),
    mode: 'markers',
    type: 'scatter',
    marker: { color: color },
  };

  const layout: Partial<Plotly.Layout> = {
    title: 'Normal Probability Plot',
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
      title: 'Theoretical Quantiles',
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
        data={[trace]} 
        layout={layout} 
        config={config} 
        useResizeHandler={true} 
      />
    </div>
  )
}