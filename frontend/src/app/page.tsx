import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mt-[4.5rem] min-h-screen flex flex-col items-center justify-center font-sans bg-[#fff] text-[#191919]">
        <main className="flex flex-col items-center justify-center w-full text-center divide-y divide-zinc-300">
          {/* Welcome to Dhruvan */}
          <div className='min-h-[80vh] flex flex-col justify-center items-center'>
            <div className='text-center px-4 max-w-md m-auto'>
              <h1 className="text-4xl font-bold mb-4">Welcome to Dhruvan</h1>
              <p className="text-xl mb-8">Explore the alpha</p>
              <div className="space-y-4">
                <Link href="/liquidity" className="block bg-blue hover:bg-darkerblue text-white py-2 px-6 rounded-md transition duration-300">
                  Explore Liquidity
                </Link>
                <Link href="/indicators" className="block bg-blue hover:bg-darkerblue text-white py-2 px-6 rounded-md transition duration-300">
                  View Indicators
                </Link>
                <Link href="/docs" className="block bg-blue hover:bg-darkerblue text-white py-2 px-6 rounded-md transition duration-300">
                  Browse API Docs
                </Link>
              </div>
            </div>
          </div>

          <div className='py-8 bg-zinc-100'>
            <h2 className='text-3xl font-semibold mb-2 md:mb-8'>Products Offered</h2>
            {/* Liquidity Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="md:w-1/2 p-6 text-left">
                <h2 className="text-3xl font-semibold mb-3">Liquidity</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Understand the impact of FED liquidity in the cryptocurrency market. Dive deep into the mechanism that defines liquidity and its impact on market moves.
                </p>
                <Link href="/liquidity" className="bg-blue hover:bg-darkerblue text-white py-2 px-5 rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
                  View FED Liquidity
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-auto overflow-hidden border border-zinc-300 rounded-l-3xl">
                <img src="/og/liquidity.png" alt="Liquidity" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Optimal Leverage Section */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16 gap-8">
              <div className="md:w-1/2 p-6 text-left">
                <h2 className="text-3xl font-semibold mb-3">Optimal Leverage</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Discover strategies to maximize your returns by leveraging the right amount of risk. Learn how to find the optimal leverage multiple in the cryptocurrency market to enhance your returns.
                </p>
                <Link href="/optimal" className="bg-blue hover:bg-darkerblue text-white py-2 px-5 rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
                  Calculate Leverage
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-auto overflow-hidden border border-zinc-300 rounded-r-3xl">
                <img src="/og/optimal.png" alt="Optimal Leverage" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Indicators Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="md:w-1/2 p-6 text-left">
                <h2 className="text-3xl font-semibold mb-3">Indicators</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Explore various indicators that help predict market peaks and bottoms. Leverage these tools to make informed investment decisions in the cryptocurrency space.
                </p>
                <Link href="/indicators" className="bg-blue hover:bg-darkerblue text-white py-2 px-5 rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
                  Explore Indicators
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-auto overflow-hidden border border-zinc-300 rounded-l-3xl">
                <img src="/og/indicator.png" alt="Indicators" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* API Docs Section */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16 gap-8">
              <div className="md:w-1/2 p-6 text-left">
                <h2 className="text-3xl font-semibold mb-3">API Documentation</h2>
                <p className="text-lg leading-relaxed mb-6">
                  Integrate liquidity and market data into your own applications with our API. Get detailed information on how to use our endpoints for your analysis and investment tools.
                </p>
                <Link href="/docs" className="bg-blue hover:bg-darkerblue text-white py-2 px-5 rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
                  View API Docs
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-auto overflow-hidden border border-zinc-300 rounded-r-3xl">
                <img src="/og/docs.png" alt="API Docs" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}