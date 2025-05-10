export const dynamic = "force-dynamic";

import { customFetch } from "@/api";
import { Metadata } from "next";
import SpeedometerPlot from "./SpeedometerPlot";

// TODO: Fix metadata
// export const metadata: Metadata = {
//   title: "Bitcoin Valuation | Dhruvan",
//   description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
//   keywords: "Bitcoin valuation, cycle tops, cycle bottoms, market indicators, Bitcoin analysis, cryptocurrency, crypto valuation tools",
//   authors: [{ name: "Dhruvan Gnanadhandayuthapani" }],
//   openGraph: {
//     title: "Bitcoin Valuation | Dhruvan",
//     description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
//     url: "https://crypto.dhruvan.dev/valuation",
//     siteName: "Dhruvan",
//     images: [
//       {
//         url: "/og/valuation.png",
//         width: 1200,
//         height: 630,
//         alt: "Bitcoin Valuation",
//       },
//     ],
//     locale: "en_US",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Bitcoin Valuation | Dhruvan",
//     description: "An aggregate of live Bitcoin indicators designed to pinpoint market cycle tops and bottoms.",
//     images: ["/og/valuation.png"],
//   },
// };

export type Score = {
  date: string;
  score: number;
}

export type DataPoint = {
  ticker: string;
  scores: Score[];
}

async function fetchData(): Promise<DataPoint[]> {
  const url = `${process.env.API_BASE_URL}/api/speedometer/ticker-scores/`;

  try {
    const response = await customFetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching last updated:', error);
    return [];
  }
}

export default async function SpeedometerPage({
  searchParams
}: {
  searchParams: { startDate?: string, endDate?: string }
}) {
  const data = await fetchData();
    // const ticker = data[0].ticker;
    // const value = data[0].scores[data[0].scores.length - 1].score;

  console.log(data);

  return (
    <div className='font-sans min-h-screen'>
      <main className='min-h-screen flex flex-col font-sans bg-[#fff] text-[#191919]'>
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4'>
          <h1 className='text-4xl font-bold text-center mb-4'>Speedometer</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((dataPoint) => (
              <div key={dataPoint.ticker} className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-2">{dataPoint.ticker}</h2>
                <SpeedometerPlot
                  ticker={dataPoint.ticker}
                  value={dataPoint.scores[dataPoint.scores.length - 1].score}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
