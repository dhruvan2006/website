// import DatePicker from "@/components/DatePicker";

import { customFetch } from "@/api";
import ValuationPlot from "./ValuationPlot";
import IndicatorItem from "./IndicatorItem";
import DatePickers from "./DatePickers";

async function fetchData(): Promise<ValuationData | null> {
  const url = `${process.env.API_BASE_URL}/api/valuation/`;

  try {
    const response = await customFetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching last updated:', error);
    return null;
  }
}

async function fetchPrice() : Promise<PricePoint[]> {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/indicators/price`);
  if (!res.ok) {
    throw new Error('Failed to fetch Bitcoin price data');
  }
  return res.json();
}

function ValuationFallback() {
  return (
    <div className='h-[88vh] flex items-center justify-center'>
      <div className="animate-spin rounded-full h-32 w-32 border-8 border-black border-t-8 border-t-transparent"></div>
    </div>
  )
}

export type ValuationPoint = {
  date: string;
  value: number;
}

export type IndicatorPoint = {
  indicator: number;  // id of indicator
  transformation: string;
  logo: string;
  color: string;
}

export type PricePoint = {
  date: string;
  price: number;
}

export type ValuationData = {
  valuation: ValuationPoint[];
  indicators: IndicatorPoint[];
}

export default async function ValuationPage({
  searchParams
}: {
  searchParams: { startDate?: string, endDate?: string }
}) {
  const startDate = searchParams.startDate || '2012-01-01';
  const endDate = searchParams.endDate || new Date().toISOString().split('T')[0];

  const data = await fetchData();
  const initialPrice = await fetchPrice();

  const price = initialPrice.filter(point => new Date(point.date) >= new Date(startDate) && new Date(point.date) <= new Date(endDate));
  const valuation = data?.valuation.filter(point => new Date(point.date) >= new Date(startDate) && new Date(point.date) <= new Date(endDate));
  const indicators = data?.indicators;

  return (
    <div className='font-sans min-h-screen'>
      <main className='min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
          <div className='flex flex-col lg:flex-row justify-center items-center mb-4'>
            <h1 className='text-3xl font-bold'>Bitcoin Valuation</h1>
          </div>

          <div className="mb-4">
            {valuation && <ValuationPlot valuationData={valuation} bitcoinData={price} />}
          </div>

          <div className="flex justify-center">
            <DatePickers startDate={startDate} endDate={endDate} />
          </div>
        </div>

        <div className="bg-zinc-50 text-[#191919] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-t border-zinc-300">
          <h2 className="font-bold text-2xl tracking-tight text-center mb-4">Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators && indicators.map((indicator) => (
              process.env.API_BASE_URL && <IndicatorItem key={indicator.indicator} bitcoinData={price} baseUrl={process.env.API_BASE_URL} indicator={indicator} startDate={startDate} endDate={endDate} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}