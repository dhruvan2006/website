import React from 'react';
import Chart from './Chart';
import { customFetch } from '@/api';
import type { Metadata } from 'next'
 
export async function generateMetadata({ params }: { params: { datasource: string } }) {
  const datasource = await getDataSource(params.datasource);
  return {
    title: `${datasource.name} | Dhruvan`,
  }
}

async function getDataSource(datasource: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/datasource/${datasource}`);
  if (!res.ok) {
    throw new Error('Failed to fetch datasource');
  }
  return res.json();
}

async function getDataSourceValues(datasource: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/datasource/${datasource}/values`);
  if (!res.ok) {
    throw new Error('Failed to fetch datasource values');
  }
  return res.json();
}

export default async function DataSourcePage({ params }: { params: { datasource: string } }) {
  const datasource = await getDataSource(params.datasource);
  const datasourceValues = await getDataSourceValues(params.datasource);

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-2'>
        <div className='mb-6'>
          <Chart datasource={datasource} datasourceValues={datasourceValues} />
        </div>
      </main>
    </div>
  );
}