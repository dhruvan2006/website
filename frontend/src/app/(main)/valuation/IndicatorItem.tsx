'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { IndicatorPoint, PricePoint } from './page';
import Link from 'next/link';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function ChartSkeleton() {
  return (
    <div className='w-full h-full animate-pulse bg-[#f0f0f0] flex items-center justify-center'>
      {/* <div className='bg-zinc-200 h-6 w-48 rounded-md'></div> */}
    </div>
  );
}

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <ChartSkeleton /> });

type Indicator = {
  id: number;
  url_name: string;
  human_name: string;
  description: string;
  category: number;
}

type Value = {
  id: number;
  date: string;
  value: number;
  indicator: number;
}

type Data = {
  indicator: Indicator;
  values: Value[];
}

type IndicatorItemProps = {
  baseUrl: string;
  indicator: IndicatorPoint;
  bitcoinData: PricePoint[];
  startDate: string;
  endDate: string;
}

export default function IndicatorItem({ baseUrl, indicator, bitcoinData, startDate, endDate }: IndicatorItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const handle = useFullScreenHandle();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !data) {
      const fetchIndicatorData = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/indicators/indicator/id/${indicator.indicator}`);
          if (res.ok) {
            const result = await res.json();
            setData(result);
          } else {
            throw new Error('Failed to fetch indicator data');
          }
        } catch (error) {
          console.error('Error fetching indicator data:', error);
        }
      };

      fetchIndicatorData();
    }
  }, [isVisible, data, indicator.indicator]);

  const generatePlotData = () : Plotly.Data[] => {
    if (!data) return [];

    const filteredValues = data.values.filter(point => new Date(point.date) >= new Date(startDate) && new Date(point.date) <= new Date(endDate));

    const dates = filteredValues.map((item) => item.date);
    const values = filteredValues.map((item) => item.value);

    const btcDates = bitcoinData.map((item) => item.date);
    const btcPrices = bitcoinData.map((item) => item.price);

    return [
      {
        x: dates,
        y: values,
        type: 'scatter',
        mode: 'lines',
        marker: { color: indicator.color, width: 2 },
        name: data.indicator.human_name,
        yaxis: 'y2',
      },
      {
        x: btcDates,
        y: btcPrices,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'orange', width: 2 },
        name: 'BTC Price',
        yaxis: 'y1',
      },
    ];
  };

  return (
    <div ref={ref} className="border border-zinc-300 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {data ? (
        <FullScreen handle={handle} className='divide-y h-[70vh] max-h-[600px]'>
          <div className='p-4 flex items-center justify-between bg-[#fff]'>
            <Image src={indicator.logo} alt="Logo" height={24} width={24} style={{ height: '24px', width: 'auto' }} />
            <h3 className='font-bold underline underline-offset-4'>
              <Link href={`/indicators/${data.indicator.url_name}`} target='_blank'>
                {data.indicator.human_name}
              </Link>
            </h3>

            {handle.active ? 
              <button onClick={handle.exit} className="transform bg-transparent border-none cursor-pointer transition duration-300 hover:scale-90 hover:text-red">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              </button>
            : 
              <button onClick={handle.enter} className="transform bg-transparent border-none cursor-pointer transition duration-300 hover:scale-110 hover:text-red">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </button>
            }
          </div>

          <div className='w-full h-full overflow-hidden'>
            <Plot
              data={generatePlotData()}
              layout={{
                xaxis: { title: 'Date', showgrid: false },
                yaxis: { title: 'BTC Price', showgrid: false, side: 'left', type: 'log', zeroline: false },
                yaxis2: { title: 'Value', overlaying: 'y', side: 'right', showgrid: false, zeroline: false },
                margin: { l: 60, r: 60, b: 125, t: 25 },
                showlegend: false,
              }}
              config={{displayModeBar: false}}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          {/* <p>Transformation: {data.transformation}</p> */}
        </FullScreen>
      ) : (
        <div className='divide-y divide-zinc-300'>
          <div className='p-4 flex items-center justify-between bg-[#fff]'>
            <div className='size-6 animate-pulse bg-[#f0f0f0] rounded-full' />
            <div className='w-48 h-6 animate-pulse bg-[#f0f0f0] rounded-md' />
            <div className='size-6 animate-pulse bg-[#f0f0f0] rounded-md' />
          </div>

          <div className='w-full h-[60vh] overflow-hidden'>
            <ChartSkeleton />
          </div>
        </div>
      )}
    </div>
  );
}