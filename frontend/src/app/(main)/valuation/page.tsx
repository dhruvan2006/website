// import DatePicker from "@/components/DatePicker";

import { customFetch } from "@/api";
import ValuationPlot from "./ValuationPlot";
import IndicatorItem from "./IndicatorItem";
import DatePickers from "./DatePickers";
import NormalDistributionPlot from "./NormalDistributionPlot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin Valuation | Dhruvan",
  description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
  keywords: "Bitcoin valuation, cycle tops, cycle bottoms, market indicators, Bitcoin analysis, cryptocurrency, crypto valuation tools",
  authors: [{ name: "Dhruvan Gnanadhandayuthapani" }],
  openGraph: {
    title: "Bitcoin Valuation | Dhruvan",
    description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
    url: "https://www.gnanadhandayuthapani.com/valuation",
    siteName: "Dhruvan",
    images: [
      {
        url: "/og/valuation.png",
        width: 1200,
        height: 630,
        alt: "Bitcoin Valuation",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Valuation | Dhruvan",
    description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
    images: ["/og/valuation.png"],
  },
};


async function fetchData(): Promise<ValuationData | null> {
  const url = `${process.env.API_BASE_URL}/api/valuation`;

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

  const latestDate = valuation && valuation.length !== 0 ? valuation[valuation.length - 1].date : 'Loading...';
  const latestValuation = valuation && valuation.length !== 0 ? valuation[valuation.length - 1].value : 0;
  const mean = valuation&& valuation.length !== 0 ? valuation.reduce((acc, point) => acc + point.value, 0) / valuation.length : 0;
  const stddev = valuation&& valuation.length !== 0 ? Math.sqrt(valuation.reduce((acc, point) => acc + (point.value - mean) ** 2, 0) / valuation.length) : 0;

  // Get gradient color between red and green
  const getColor = (value: number) => {
    const red = Math.min(255, Math.max(0, Math.round(((value + 2) / 4) * 255)));
    const green = 255 - red;

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className='font-sans min-h-screen'>
      <main className='min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
          <div className='flex flex-col lg:flex-row gap-4 justify-around items-center mb-4'>
            <h1 className='text-4xl font-bold'>Bitcoin Valuation</h1>

            <div className='flex gap-2 items-center'>
              <h2 className="text-2xl">Latest score:</h2>
              <p className="text-4xl font-extrabold border border-zinc-300 p-1 rounded-sm shadow-sm" style={{ color: getColor(latestValuation) }}>{latestValuation.toFixed(2)}</p>
              <p className="text-xl font-semibold mt-1">({latestDate})</p>
            </div>
          </div>

          <div className="mb-4">
            {valuation && (
                <ValuationPlot valuationData={valuation} bitcoinData={price} />
            )}
          </div>

          <div className="flex justify-center">
            <DatePickers startDate={startDate} endDate={endDate} />
          </div>
        </div>

        <section className="x-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-t border-zinc-300 bg-zinc-100">
          <h2 className="font-bold text-2xl tracking-tight text-center mb-4">What is Bitcoin Valuation?</h2>
          <p className="">
            The <strong>Bitcoin Valuation</strong> is an average of various technical and onchain indicators on bitcoin that have been z-scored. 
            Each indicator has been transformed to bring it as close as possible to the normal model.
            The signal of the indicators has been <a className="underline decoration-dashed underline-offset-2" href="/notebooks">boosted</a> to prevent alpha decay.
          </p>
        </section>

        <div className="bg-zinc-50 text-[#191919] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-t border-zinc-300">
          <h2 className="font-bold text-2xl tracking-tight text-center mb-4">Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators && indicators.map((indicator) => (
              process.env.API_BASE_URL && <IndicatorItem key={indicator.indicator} bitcoinData={price} baseUrl={process.env.API_BASE_URL} indicator={indicator} startDate={startDate} endDate={endDate} />
            ))}
          </div>
        </div>

        <div className="w-full">
          <NormalDistributionPlot mean={mean} stddev={stddev} latestScore={latestValuation} />
        </div>
      </main>
    </div>
  );
}
