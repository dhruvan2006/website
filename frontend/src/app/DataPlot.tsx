'use client';

import React from 'react';
import { SimpleDataPoint } from './page';
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type DataPlotProps = {
  ticker: string;
  color: string;
  data: SimpleDataPoint[];
}

function DataPlot({ ticker, color, data }: DataPlotProps): React.ReactElement {
  const trace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines+markers',
    name: ticker,
    x: data.map(d => d.date),
    y: data.map(d => d.value),
    line: {color: color}
  };

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    title: {
      text: `<b>${ticker}</b>`,
      font: { size: 20, color: '#191919',  }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#191919', family: 'monospace', size: 14 },
    margin: { t: 50, b: 50, l: 75, r: 50 },
    xaxis: {
      showgrid: false,
      linecolor: '#191919',
      title: {
        text: 'Date',
        font: { size: 16 }
      }
    },
    yaxis: {
      showgrid: false,
      linecolor: '#191919',
      title: {
        text: ticker,
        font: { size: 16 }
      }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: color,
      font: { color: 'white', family: 'monospace', size: 12 }
    },
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  };
  
  if (data.length === 0) {
    return (
      <div className={`w-full ${ticker === 'LIQUIDITY' ? 'h-[80vh] bg-zinc-300' : 'h-[60vh] bg-zinc-300'} rounded animate-pulse`}></div>
    );
  }

  return (
    <div className={ticker === 'LIQUIDITY' ? `w-full h-[80vh]` : `w-full h-[60vh]`}>
      <div className='h-full pb-3 pt-1'>

        <Plot 
          className='w-full h-full' 
          data={[trace]} 
          layout={layout} 
          config={config} 
          useResizeHandler={true}
          style={{width: "100%", height: "100%"}}
          />
      </div>
    </div>
  );
}

export default DataPlot;
