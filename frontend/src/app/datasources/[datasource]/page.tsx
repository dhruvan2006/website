import React from 'react';
import axios from 'axios';
import Navbar from '../../Navbar';
import Chart from './Chart';

async function getDataSource(datasource: string) {
  const res = await axios.get(`https://api.liquidity.gnanadhandayuthapani.com/api/indicators/datasource/${datasource}`);
  return res.data;
}

async function getDataSourceValues(datasource: string) {
  const res = await axios.get(`https://api.liquidity.gnanadhandayuthapani.com/api/indicators/datasource/${datasource}/values`);
  return res.data;
}

export default async function DataSourcePage({ params }: { params: { datasource: string } }) {
  const datasource = await getDataSource(params.datasource);
  const datasourceValues = await getDataSourceValues(params.datasource);

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <Navbar />

      <main className='container mx-auto px-4 sm:px-8 lg:px-16 py-2'>
        <div className='mb-6'>
          <Chart datasource={datasource} datasourceValues={datasourceValues} />
        </div>
      </main>
    </div>
  );
}