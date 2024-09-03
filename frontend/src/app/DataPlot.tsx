'use client';

import React from 'react';
import Plot from 'react-plotly.js';
import { SimpleDataPoint } from './page';

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
      text: ticker,
      font: { size: 20, color: '#ededed' }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ededed', family: 'monospace', size: 14 },
    margin: { t: 50, b: 50, l: 75, r: 50 },
    xaxis: {
      showgrid: false,
      linecolor: '#ededed',
      title: {
        text: 'Date',
        font: { size: 16 }
      }
    },
    yaxis: {
      showgrid: false,
      linecolor: '#ededed',
      title: {
        text: ticker,
        font: { size: 16 }
      }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: color,
      font: { color: 'black', family: 'monospace', size: 12 }
    },
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  };
  
  return (
    <div className={ticker === 'LIQUIDITY' ? `w-full h-[80vh]` : `w-full h-[60vh]`}>
      <Plot 
        className='w-full h-full' 
        data={[trace]} 
        layout={layout} 
        config={config} 
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
      />
    </div>
  );
}

export default DataPlot;
