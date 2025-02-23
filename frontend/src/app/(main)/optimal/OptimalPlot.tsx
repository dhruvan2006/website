import {useTheme} from "@/ThemeContext";

'use-client';

import { Data } from "./OptimalClient";
import dynamic from 'next/dynamic'

type OptimalPlotProps = {
  ticker: string;
  data: Data;
}

function OptimalPlotSkeleton() {
  return (
    <div className='w-full h-full pb-3 pt-1 animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-zinc-900 dark:text-zinc-300'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <OptimalPlotSkeleton /> });

export default function OptimalPlot({ ticker, data}: OptimalPlotProps) {
  const { theme } = useTheme();
  const themeColor = theme === "dark" ? "#d8d5d0" : "#191919";

  const trace: Plotly.Data = {
    type: 'scatter',
    mode: 'lines',
    name: ticker,
    x: data.k,
    y: data.R,
    line: {color: "orange"}
  };

  const maxPointTrace: Plotly.Data = {
    type: 'scatter',
    mode: 'text+markers',
    name: 'Optimal Leverage',
    x: [data.k_max],
    y: [data.R_max],
    marker: { color: 'red', size: 10 },
    text: [`Optimal Leverage: ${data.k_max.toFixed(2)}x`],
    textposition: 'top center',
    hoverinfo: 'text',
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
      linecolor: themeColor ,
      title: {
        text: 'Leverage Multiple',
        font: { size: 16 }
      }
    },
    yaxis: {
      showgrid: false,
      linecolor: themeColor,
      title: {
        text: "Return",
        font: { size: 16 }
      }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: "orange",
      font: { color: 'white', family: 'monospace', size: 12 }
    },
    showlegend: false
  };

  const config: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  };
  
  return (
    <div className={'w-full h-[80vh]'}>
      <div className='h-full'>
        <Plot 
          className='w-full h-full' 
          data={[trace, maxPointTrace]} 
          layout={layout} 
          config={config} 
          useResizeHandler={true}
          style={{width: "100%", height: "100%"}}
          />
      </div>
    </div>
  );
}