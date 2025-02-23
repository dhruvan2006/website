'use client';

import React from 'react';
import dynamic from 'next/dynamic'
import { SeriesData } from './page';
import {useTheme} from "@/ThemeContext";

function DataPlotSkeleton() {
  return (
    <div className='w-full h-full pb-3 pt-1 animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-black dark:text-gray-300'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <DataPlotSkeleton /> });

type DataPlotProps = {
  ticker: string;
  color: string;
  data: SeriesData[];
}

function DataPlot({ ticker, color, data }: DataPlotProps): React.ReactElement {
  const { theme } = useTheme();
  const themeColor = theme === "dark" ? "#d8d5d0" : "#191919";

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
      font: { size: 20, color: themeColor,  }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: themeColor, family: 'monospace', size: 14 },
    margin: { t: 50, b: 70, l: 65, r: 50 },
    xaxis: {
      showgrid: false,
      linecolor: themeColor,
      title: {
        text: 'Date',
        font: { size: 16 }
      }
    },
    yaxis: {
      showgrid: false,
      linecolor: themeColor,
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
  
  return (
    <div className={ticker === 'LIQUIDITY' ? `w-full h-[80vh]` : `w-full h-[60vh]`}>
      <div className='h-full'>
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
