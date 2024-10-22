'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IndicatorPoint } from './page';

type IndicatorItemProps = {
  baseUrl: string;
  indicator: IndicatorPoint;
}

export default function IndicatorItem({ baseUrl, indicator }: IndicatorItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<IndicatorPoint | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

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
          const res = await fetch(`https://api.gnanadhandayuthapani.com/api/indicators/indicator/id/25`);
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

  return (
    <div ref={ref} className="p-4 border">
      {data ? (
        <div>
          <h3>Indicator {data.indicator}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <p>Transformation: {data.transformation}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}