'use client';

import React from 'react';
import dynamic from 'next/dynamic';

function ChartSkeleton() {
  return (
    <div className='w-full h-[40vh] animate-pulse bg-[#f0f0f0] flex items-center justify-center rounded-md'>
      <span className='text-[#191919]'>Chart Loading...</span>
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
      className='w-full h-[40vh]'
      data={[
        {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: 'Normal Distribution',
          line: { color: 'rgba(75, 192, 192, 1)' },
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
        title: 'Normal Distribution with Latest Score',
        xaxis: {
          title: 'Value',
        },
        yaxis: {
          title: 'Probability Density',
        },
        showlegend: true,
      }}
      useResizeHandler
    />
  );
}