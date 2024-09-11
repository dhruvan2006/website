'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Indicator {
  name: string;
  url_name: string;
  human_name: string;
}

interface Category {
  name: string;
  id: number;
}

interface CategoryWithIndicators {
  category: Category;
  indicators: Indicator[];
}

interface DataSource {
  url: string;
  name: string;
  description: string;
}

interface Notebook {
  name: string;
  url_name: string;
}

export default function Navbar() {
  // Handle dropdowns logic
  const [isIndicatorDropdownOpen, setIsIndicatorDropdownOpen] = useState(false);
  const [isDataSourceDropdownOpen, setIsDataSourceDropdownOpen] = useState(false);
  const [isNotebookDropdownOpen, setIsNotebookDropdownOpen] = useState(false);

  const handleIndicatorMouseEnter = () => setIsIndicatorDropdownOpen(true);
  const handleIndicatorMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Element;
    if (!relatedTarget || !(relatedTarget instanceof Element) || !relatedTarget.closest('.indicator-dropdown-area')) {
      setIsIndicatorDropdownOpen(false);
    }
  };

  const handleDataSourceMouseEnter = () => setIsDataSourceDropdownOpen(true);
  const handleDataSourceMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Element;
    if (!relatedTarget || !(relatedTarget instanceof Element) || !relatedTarget.closest('.datasource-dropdown-area')) {
      setIsDataSourceDropdownOpen(false);
    }
  };

  const handleNotebookMouseEnter = () => setIsNotebookDropdownOpen(true);
  const handleNotebookMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Element;
    if (!relatedTarget || !(relatedTarget instanceof Element) || !relatedTarget.closest('.notebook-dropdown-area')) {
      setIsNotebookDropdownOpen(false);
    }
  };

  // Fetch indicators data
  const [indicators, setIndicators] = useState<CategoryWithIndicators[]>([]);
  const [indicatorsIsLoading, setIndicatorsIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/indicators/categories_with_indicators');
        if (!response.ok) {
          throw new Error('Failed to fetch indicators');
        }
        const data = await response.json();
        setIndicators(data);
      } catch (error) {
        console.error('Error fetching indicators:', error);
      } finally {
        setIndicatorsIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fetch data sources data
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [dataSourcesIsLoading, setDataSourcesIsLoading] = useState<boolean>(true);

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
        setDataSourcesIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Notebooks data
  const notebooks: Notebook[] = [{name: 'Thermocap Multiple', url_name: 'thermocap-multiple'}, {name: 'Bitcoin Decay Channel', url_name: 'bitcoin-decay-channel'}]

  return (
    <header className='bg-[#fff]/75 backdrop-blur-md text-[#191919] flex flex-col font-sans fixed top-0 left-0 right-0 z-50 border-b border-zinc-300'>
      <nav className='container mx-auto px-4 sm:px-8 lg:px-16'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <div className='flex items-center'>
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className='text-xl font-bold ml-2'>Indicator</span>
          </div>

          {/* Nav Links */}
          <ul className='flex items-center'>
            <li>
              <Link href="/" className='hover:text-[#7f7f7f] transition duration-100'>
                Liquidity
              </Link>
            </li>

            <li 
              className='py-6 pl-6'
              onMouseEnter={handleIndicatorMouseEnter} 
              onMouseLeave={handleIndicatorMouseLeave}
            >
              <div className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center cursor-pointer'>
                <Link href="/indicators">Indicators</Link>

                <svg
                  className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isIndicatorDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </li>

            <li 
              className='py-6 pl-6'
              onMouseEnter={handleDataSourceMouseEnter} 
              onMouseLeave={handleDataSourceMouseLeave}
            >
              <div className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center cursor-pointer'>
                <Link href="/datasources">Data Sources</Link>

                <svg
                  className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isDataSourceDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </li>

            <li 
              className='py-6 pl-6'
              onMouseEnter={handleNotebookMouseEnter} 
              onMouseLeave={handleNotebookMouseLeave}
            >
              <div className='focus:outline-none hover:text-[#7f7f7f] transition duration-100 flex items-center cursor-pointer'>
                {/* TODO: Add this page.tsx */}
                <Link href="#">Research Notebooks</Link>

                <svg
                  className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-200 ${isNotebookDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </li>
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
        </div>

        {/* Dropdowns */}
        <div>
          {/* Indicator Dropdown */}
          <div 
            className={`indicator-dropdown-area ${isIndicatorDropdownOpen ? 'transition-all duration-200 ease-in-out pb-5 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleIndicatorMouseEnter}
            onMouseLeave={handleIndicatorMouseLeave}
          >
            <div className='container flex mx-auto p-4 divide-x divide-[#e5e5e5]'>
              {indicatorsIsLoading ? (
                <div className="text-center w-full">Loading...</div>
              ) : (
                indicators.map((item) => (
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

          {/* Data Source Dropdown */}
          <div 
            className={`datasource-dropdown-area ${isDataSourceDropdownOpen ? 'transition-all duration-200 ease-in-out pb-5 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleDataSourceMouseEnter}
            onMouseLeave={handleDataSourceMouseLeave}
          >
            <div className='container flex mx-auto p-4'>
              {dataSourcesIsLoading ? (
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

          {/* Notebook Dropdown */}
          <div 
            className={`notebook-dropdown-area ${isNotebookDropdownOpen ? 'transition-all duration-200 ease-in-out pb-5 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleNotebookMouseEnter}
            onMouseLeave={handleNotebookMouseLeave}
          >
            <div className='container flex mx-auto p-4'>
              {dataSourcesIsLoading ? (
                <div className="text-center w-full">Loading...</div>
              ) : (
                <div className='flex-1 px-4'>
                  <h2 className='text-sm text-[#7f7f7f] mb-3'>Research Notebooks</h2>
                  <ul className='mt-2 space-y-2'>
                  {notebooks.map((notebook, idx) => (
                      <li key={idx}>
                      <Link href={`/notebooks/${notebook.url_name}`} className='hover:text-[#7f7f7f] transition duration-100'>
                          {notebook.name}
                      </Link>
                      </li>
                  ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
