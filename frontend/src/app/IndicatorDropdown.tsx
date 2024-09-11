'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Indicator {
  name: string;
  url_name: string;
  human_name: string;
}

interface Category {
  name: string;
  id: number;
}

interface Item {
  category: Category;
  indicators: Indicator[];
}

export default function Dropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/indicators/categories_with_indicators');
        if (!response.ok) {
          throw new Error('Failed to fetch indicators');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching indicators:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget as Node) &&
      navRef.current &&
      !navRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const currentDropdownRef = dropdownRef.current;
    navRef.current = document.querySelector('nav');
    const currentNavRef = navRef.current;

    if (currentDropdownRef) {
      currentDropdownRef.addEventListener('mouseleave', handleMouseLeave);
    }
    if (currentNavRef) {
      currentNavRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentDropdownRef) {
        currentDropdownRef.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (currentNavRef) {
        currentNavRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  items.map((category) => {
    console.log(category);
  });

  return (
    <li className='relative' ref={dropdownRef} onMouseEnter={handleMouseEnter}>
      <div className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center cursor-pointer'>
        <Link href="/indicators">Indicators</Link>

        <svg
          className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* {isDropdownOpen && (
        <div
          className='bg-[#fff]/75 backdrop-blur-md fixed left-0 top-16 w-screen shadow-md z-50 pb-5'
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
      )} */}
      
      {isDropdownOpen && (
        <div className='bg-[#fff]/75 backdrop-blur-md fixed left-0 top-16 w-screen shadow-sm z-50 pb-5 border-b border-zinc-300'>
          <div className='container flex mx-auto p-4 max-w-4xl divide-x divide-[#e5e5e5]'>
            {isLoading ? (
              <div className="text-center w-full">Loading...</div>
            ) : (
              items.map((item) => (
                <div key={item.category.id} className='flex-1 px-4 first:pl-0 last:pr-0'>
                  <h2 className='text-sm text-[#7f7f7f] mb-3'>{item.category.name}</h2>
                  <ul className='mt-2 space-y-2'>
                    {item.indicators.map((indicator, idx) => (
                      <li key={idx}>
                        <Link href={`/indicators/${indicator.url_name}`} className='hover:text-[#7f7f7f] transition duration-100'>
                          {indicator.human_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </li>
  )
}
