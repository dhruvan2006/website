import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import IndicatorDropdown from './IndicatorDropdown';
import DataSourceDropdown from './DataSourceDropdown';

export default function Navbar() {
  return (
    <header className='bg-[#fff]/75 backdrop-blur-md text-[#191919] flex flex-col font-sans sticky top-0 z-50 border-b border-zinc-300'>
      <nav className='container mx-auto flex justify-between items-center p-4 sm:px-8 lg:px-16'>
        {/* Logo */}
        <div className='flex items-center'>
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className='text-xl font-bold ml-2'>Indicator</span>
        </div>

        {/* Nav Links */}
        <ul className='flex space-x-6'>
          <li>
            <Link href="/" className='hover:text-[#7f7f7f] transition duration-100'>
              Liquidity
            </Link>
          </li>

          {/* Indicaors Dropdown */}
          <IndicatorDropdown />

          {/* Data Source Dropdown */}
          <DataSourceDropdown />
        </ul>

        {/* Login Button */}
        <div className='flex space-x-4'>
          <button className="font-semibold hover:text-[#474747] transition duration-300">
            Login
          </button>
          <button className="font-semibold bg-[#191919] hover:bg-[#474747] text-[#fff] transition duration-300 py-1.5 px-4 rounded-md">
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
}
