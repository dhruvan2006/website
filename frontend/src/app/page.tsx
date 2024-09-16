import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-[#fff] text-[#191919]">
        <main className="text-center px-4">
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
        </main>
      </div>
    </>
  );
}