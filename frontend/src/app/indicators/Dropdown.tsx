'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Dropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <li className='relative'>
      <button onClick={toggleDropdown} className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center'>
        Indicators

        <svg
          className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          className='bg-[#fff]/75 backdrop-blur-md fixed left-0 top-16 w-screen shadow-md z-5s0 pb-5'
        >
          <div className='container flex mx-auto p-4 max-w-4xl'>
            <div className='flex-1 pr-4 border-r'>
              <h2 className='text-sm text-[#7f7f7f] mb-3'>Power Law</h2>
              <ul className='mt-2 space-y'>
                <li><Link href="/indicators/plrr" className='hover:text-[#7f7f7f] transition duration-100'>Residual Ratio</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>Logarithmic Regression</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>S2F Model</Link></li>
              </ul>
            </div>
            <div className='flex-1 pl-4 pr-4 border-r'>
              <h2 className='text-sm text-[#7f7f7f] mb-3'>On-Chain</h2>
              <ul className='mt-2 space-y'>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>MVRV Ratio</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>NVT Ratio</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>SOPR</Link></li>
              </ul>
            </div>
            <div className='flex-1 pl-4'>
              <h2 className='text-sm text-[#7f7f7f] mb-3'>Technical</h2>
              <ul className='mt-2 space-y'>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>RSI</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>MACD</Link></li>
                <li><Link href="#" className='hover:text-[#7f7f7f] transition duration-100'>Bollinger Bands</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
