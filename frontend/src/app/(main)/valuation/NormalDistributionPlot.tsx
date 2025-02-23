'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {useTheme} from "@/ThemeContext";

function ChartSkeleton() {
  return (
    <div className='w-full h-96 animate-pulse bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-md'>
      <span className='text-zinc-900 dark:text-zinc-300'>Chart Loading...</span>
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

type NormalDistributionPlot = {
  mean: number;
  stddev: number;
  latestScore: number;
}

export default function NormalDistributionPlot({
  mean,
  stddev,
  latestScore
} : NormalDistributionPlot) {
  const { theme } = useTheme();
  const themeColor = theme === 'dark' ? '#d8d5d0' : '#191919';

  const generateDataPoints = () => {
    const xValues = Array.from({ length: 100 }, (_, i) => i / 16.5 - 3); // X values from -3 to 3
    const yValues = xValues.map((x) => {
      const exponent = -((x - mean) ** 2) / (2 * stddev ** 2);
      return (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    });
    return { xValues, yValues };
  };

  const calculateProbabilityDensity = (x: number) => {
    const exponent = -((x - mean) ** 2) / (2 * stddev ** 2);
    return (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  };

  const { xValues, yValues } = generateDataPoints();
  const latestScoreY = calculateProbabilityDensity(latestScore);

  return (
    <Plot
      className='w-full h-96'
      data={[
        {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: 'Normal Distribution',
          line: { color: themeColor },
        },
        {
          x: [latestScore],
          y: [latestScoreY],
          type: 'scatter',
          mode: 'markers',
          name: 'Latest Score',
          marker: { color: 'red', size: 10 },
        },
      ]}
      layout={{
        title: {
          text: 'Normal Distribution with Latest Score',
          font: { color: themeColor },
        },
        xaxis: {
          title: {
            text: 'Value',
            font: { color: themeColor },
          },
          tickfont: { color: themeColor },
        },
        yaxis: {
          title: {
            text: 'Probability Density',
            font: { color: themeColor },
          },
          tickfont: { color: themeColor },
        },
        showlegend: true,
        legend: {
          font: { color: themeColor },
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
      }}
      useResizeHandler
    />
  );
}