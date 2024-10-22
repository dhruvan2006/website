// import DatePicker from "@/components/DatePicker";

import { customFetch } from "@/api";
import ValuationPlot from "./ValuationPlot";
import IndicatorItem from "./IndicatorItem";

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

async function fetchPrice() {
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
}

export type ValuationData = {
  valuation: ValuationPoint[];
  indicators: IndicatorPoint[];
}

export default async function ValuationPage() {
  const data = await fetchData();
  const price = await fetchPrice();

  const valuation = data?.valuation;
  const indicators = data?.indicators;

  return (
    <div className='bg-[#fff] text-[#191919] font-sans min-h-screen'>
      <main className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
          <div className='flex flex-col lg:flex-row justify-center items-center'>
            <h1 className='text-3xl font-bold'>Bitcoin Valuation</h1>
            
            {/* <div className='mb-6 flex flex-col sm:flex-row items-center w-full lg:w-auto justify-between'>
              <div className='flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0'>
                <DatePicker 
                  label="Start Date" 
                  value={localStartDate}
                  onChange={setLocalStartDate} 
                />
                <DatePicker 
                  label="End Date" 
                  value={localEndDate} 
                  onChange={setLocalEndDate} 
                />
              </div>
              <button 
                className='m-0 sm:mt-7 lg:ml-8 bg-[#191919] hover:bg-[#474747] text-white transition duration-300 py-2 px-6 rounded-md'
                onClick={handleButtonUpdate}
              >
                Update
              </button>
            </div> */}
          </div>

          <div>
            {valuation && <ValuationPlot valuationData={valuation} bitcoinData={price} />}
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-3">
            {indicators && indicators.map((indicator) => (
              process.env.API_BASE_URL && <IndicatorItem key={indicator.indicator} baseUrl={process.env.API_BASE_URL} indicator={indicator} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}