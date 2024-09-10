'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface DataSource {
  url: string;
  name: string;
  description: string;
}

export default function Dropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/indicators/datasource');
        if (!response.ok) {
          throw new Error('Failed to fetch data sources');
        }
        const data = await response.json();
        setDataSources(data);
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

  return (
    <li className='relative' ref={dropdownRef} onMouseEnter={handleMouseEnter}>
      <div className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center cursor-pointer'>
        <Link href="/datasources">Data Sources</Link>

        <svg
          className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isDropdownOpen && (
        <div className='bg-[#fff]/75 backdrop-blur-md fixed left-0 top-16 w-screen shadow-md z-50 pb-5'>
          <div className='container flex mx-auto p-4 max-w-4xl'>
            {isLoading ? (
              <div className="text-center w-full">Loading...</div>
            ) : (
              <div className='flex-1 px-4'>
                <h2 className='text-sm text-[#7f7f7f] mb-3'>Data Sources</h2>
                <ul className='mt-2 space-y-2'>
                {dataSources.map((dataSource, idx) => (
                    <li key={idx}>
                    <Link href={`/datasources/${dataSource.url}`} className='hover:text-[#7f7f7f] transition duration-100'>
                        {dataSource.name}
                    </Link>
                    </li>
                ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
