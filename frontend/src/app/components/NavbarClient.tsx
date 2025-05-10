// @ts-nocheck

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryWithIndicators, DataSource, Notebook } from './Navbar';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import DisplayAPI from './DisplayAPI';
import Toast from './Toast';
import { customFetch } from '@/api';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/solid';
import ThemeToggleSwitch from "@/components/ThemeToggleSwitch";

interface NavbarClientProps {
  indicators: CategoryWithIndicators[];
  dataSources: DataSource[];
  notebooks: { notebooks: Notebook[] };
  session: Session | null;
}

export default function NavbarClient({ indicators, dataSources, notebooks, session }: NavbarClientProps) {
  // API Key Logic
  const [apiKey, setApiKey] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const response = await fetch(`https://crypto.dhruvan.dev/api/api/indicators/check_api_key`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(data.has_api_key);
      }
    };
    if (session?.accessToken) {
      checkApiKey();
    }
  }, [session]);

  const fetchKey = async () => {
    const response = await fetch(`https://crypto.dhruvan.dev/api/api/indicators/generate_api_key`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
    if (!response.ok) throw new Error("Fetch api key failed");
    
    const data = await response.json()
    setApiKey(data.key);
  }

  const [showGenToast, setShowGenToast] = useState<boolean>(false);
  const generateApiKey = async () => {
    const response = await fetch(`https://crypto.dhruvan.dev/api/api/indicators/generate_api_key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      setApiKey(data.key);
      setHasApiKey(true);

      setShowGenToast(true);
      setTimeout(() => setShowGenToast(false), 2000);
    }
  };

  const [showRegenToast, setShowRegenToast] = useState<boolean>(false);
  const regenerateApiKey = async () => {
    const response = await fetch(`https://crypto.dhruvan.dev/api/api/indicators/regenerate_api_key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      setApiKey(data.key);

      setShowRegenToast(true);
      setTimeout(() => setShowRegenToast(false), 2000);
    }
  };

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

  // Mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const toggleIndicators = () => setIsIndicatorsOpen(!isIndicatorsOpen);
  const [isDatasourcesOpen, setIsDatasourcesOpen] = useState(false);
  const toggleDatasources = () => setIsDatasourcesOpen(!isDatasourcesOpen);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const toggleResearch = () => setIsResearchOpen(!isResearchOpen);

  // Active nav links
  const pathname = usePathname();

  return (
    <header className='bg-white dark:bg-[#181a1b] lg:bg-white/75 dark:lg:bg-[#181a1b]/75 lg:backdrop-blur-md text-gray-900 dark:text-gray-100 flex flex-col font-sans fixed top-0 left-0 right-0 z-50 border-b border-zinc-300 dark:border-zinc-700'>      <nav className='px-4 sm:px-8 lg:px-16'>
        <div className='flex lg:justify-between items-center'>
          {/* Logo */}
          <div className='flex-1 lg:flex-grow-0'>
            <Link href="/" className='inline-flex items-center'>
              <div className='flex items-center'>
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                <span className='text-xl font-bold ml-2 dark:text-gray-100'>Dhruvan.</span>
              </div>
            </Link>
          </div>
          
          {/* Get API button for Mobile */}
          {!session?.user ? (
            <Link href="/login">
              <button className="hidden md:block lg:hidden me-8 font-semibold bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition duration-300 py-1.5 px-4 rounded-md">
                Get API
              </button>
            </Link>
          ) : ''}

          {/* Hamburger Menu for Mobile */}
          <div className="lg:hidden py-4">
            <button onClick={toggleMenu} className="mt-1">
              {isMenuOpen ? (
                <XMarkIcon className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" />
              ) : (
                <Bars3Icon className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" />
              )}
            </button>
          </div>

          {/* Nav Links */}
          <ul className='hidden lg:flex items-center gap-3 xl:gap-6'>
            <li>
              <Link href="/liquidity" className={`transition duration-300 ${pathname === '/liquidity' ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                Liquidity
              </Link>
            </li>

            <li>
              <Link href="/valuation" className={`transition duration-300 ${pathname === '/valuation' ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                Valuation
              </Link>
            </li>

            <li>
              <Link href="/optimal" className={`transition duration-300 ${pathname === '/optimal' ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                Optimal
              </Link>
            </li>

            <li 
              className='py-6'
              onMouseEnter={handleIndicatorMouseEnter} 
              onMouseLeave={handleIndicatorMouseLeave}
            >
              <div className={`focus:outline-none flex items-center cursor-pointer transition duration-300 ${pathname.startsWith('/indicators') ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
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
              className='py-6'
              onMouseEnter={handleDataSourceMouseEnter} 
              onMouseLeave={handleDataSourceMouseLeave}
            >
              <div className={`focus:outline-none flex items-center cursor-pointer transition duration-300 ${pathname.startsWith('/datasources') ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                <Link href="/datasources">Data Sources</Link>

                <svg
                  className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-300 ${isDataSourceDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </li>

            <li 
              className='py-6'
              onMouseEnter={handleNotebookMouseEnter} 
              onMouseLeave={handleNotebookMouseLeave}
            >
              <div className={`focus:outline-none flex items-center cursor-pointer transition duration-300 ${pathname.startsWith('/notebooks') ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                <Link href="/notebooks">Research</Link>

                <svg
                  className={`ml-1 mt-0.5 h-4 w-4 transition-transform duration-300 ${isNotebookDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </li>

            <li>
              <Link href="/docs" className={`transition duration-300 ${pathname === '/docs' ? 'text-blue-500' : 'hover:text-gray-500 dark:hover:text-gray-400'}`}>
                API Docs
              </Link>
            </li>
          </ul>

          {/* Social Media + API */}
          <div className='hidden lg:flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              {/* GitHub Logo */}
              <a href="https://github.com/dhruvan2006" target="_blank" rel="noopener noreferrer">
                <svg className="w-8 h-8 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* LinkedIn Logo */}
              <a href="https://www.linkedin.com/in/dhruvan-g" target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Light/dark theme switch */}
              <ThemeToggleSwitch />
            </div>

            {/* Login Button */}
            {session?.user ? (
              <div className='relative group py-5'>
                {session.picture ? (
                  <Image src={session.picture} alt="Profile" width={32} height={32} className='rounded-full cursor-pointer shadow-md' />
                ) : (
                  <div className="flex items-center justify-center text-white dark:text-gray-900 w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full cursor-pointer">
                    <span>{session.name ? session.name.charAt(0).toUpperCase() : "?"}</span>
                  </div>
                )}
                <div className='absolute hidden group-hover:block right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10'>
                  <p className='px-4 pt-2 pb-1 text-sm dark:text-gray-200'>Hi, {session.name}</p>
                  <p className='px-4 pt-1 pb-2 text-sm dark:text-gray-300'>{session.email}</p>
                  <hr className='my-1 border-gray-200 dark:border-gray-700' />
                  {!hasApiKey ? (
                  <button onClick={() => generateApiKey()} className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'>
                    Generate API Key
                  </button>
                  ) : apiKey ? (
                    <div className='px-4 py-2 text-sm'>
                      <p>Your API Key:</p>
                      <DisplayAPI apiKey={apiKey} />
                    </div>
                  ) : (
                    <div className='p-1 space-y-2'>
                      <input
                        type='password'
                        value={"dhruvandhruvandhruvandhruvandhruvan"}
                        readOnly
                        className='w-full text-left px-4 py-2 text-sm font-mono break-all bg-gray-100 dark:bg-gray-900 p-1'
                      />
                      {/* <p className='px-4 py-2 text-sm'>API Key already generated</p> */}
                      <button onClick={() => regenerateApiKey()} className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900'>
                        Regenerate API Key
                      </button>
                    </div>
                  )}
                  <hr className='my-1 border-gray-100 dark:border-gray-900' />
                  <button onClick={() => signOut({ callbackUrl: '/' })} className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900'>
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <button className="font-semibold bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition duration-300 py-1.5 px-4 rounded-md">
                  Get API
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className='overflow-y-auto max-h-[60vh]'>
          {/* Indicator Dropdown */}
          <div
            className={`indicator-dropdown-area ${isIndicatorDropdownOpen ? 'transition-all duration-300 ease-in-out pb-5 opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleIndicatorMouseEnter}
            onMouseLeave={handleIndicatorMouseLeave}
          >
            <div className='container grid grid-cols-1 md:grid-cols-3 gap-0 p-4'>
              {indicators !== "" && indicators?.map((item, itemIndex) => (
                <div key={item.category.id} className={`p-4 ${(itemIndex % 3 == 0 || itemIndex % 3 == 1) && itemIndex !== indicators.length - 1 ? 'border-r border-zinc-300 dark:border-zinc-700' : ''}`}>
                  <h2 className='text-sm text-[#7f7f7f] dark:text-gray-400 mb-3'>{item.category.name}</h2>
                  <ul className='mt-2 space-y-2'>
                    {item.indicators.map((indicator, idx) => (
                      <li key={idx}>
                        <Link href={`/indicators/${indicator.url_name}`} className={`transition duration-300 ${pathname.startsWith(`/indicators/${indicator.url_name}`) ? 'text-blue' : 'hover:text-[#7f7f7f] dark:hover:text-gray-400'}`}>
                          {indicator.human_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Data Source Dropdown */}
          <div
            className={`datasource-dropdown-area ${isDataSourceDropdownOpen ? 'transition-all duration-300 ease-in-out pb-5 opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleDataSourceMouseEnter}
            onMouseLeave={handleDataSourceMouseLeave}
          >
            <div className='container flex mx-auto p-4'>
                <div className='flex-1 px-4'>
                  <h2 className='text-sm text-[#7f7f7f] dark:text-gray-400 mb-3'>Data Sources</h2>
                  <ul className='mt-2 space-y-2'>
                  {dataSources.map((dataSource, idx) => (
                      <li key={idx}>
                      <Link href={`/datasources/${dataSource.url}`} className={`transition duration-300 ${pathname.startsWith(`/datasources/${dataSource.url}`) ? 'text-blue-500' : 'hover:text-[#7f7f7f] dark:hover:text-gray-400'}`}>
                          {dataSource.name}
                      </Link>
                      </li>
                  ))}
                  </ul>
                </div>
            </div>
          </div>

          {/* Notebook Dropdown */}
          <div
            className={`notebook-dropdown-area ${isNotebookDropdownOpen ? 'transition-all duration-300 ease-in-out pb-5 opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}
            onMouseEnter={handleNotebookMouseEnter}
            onMouseLeave={handleNotebookMouseLeave}
          >
            <div className='container flex mx-auto p-4'>
                <div className='flex-1 px-4'>
                  <h2 className='text-sm text-[#7f7f7f] dark:text-gray-400 mb-3'>Research Notebooks</h2>
                  <ul className='mt-2 space-y-2'>
                  {notebooks.notebooks.map((notebook, idx) => (
                      <li key={idx}>
                        <Link href={`/notebooks/${notebook.path}`} className={`transition duration-300 ${pathname.startsWith(`/notebooks/${notebook.path}`) ? 'text-blue-500' : 'hover:text-[#7f7f7f] dark:hover:text-gray-400'}`}>
                          {notebook.name}
                      </Link>
                      </li>
                  ))}
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Navbar Dropdown Mobile + Tab*/}
        <div className={`lg:hidden h-0 md:min-h-screen bg-white dark:bg-[#181a1b] md:border-l md:border-zinc-300 dark:md:border-zinc-700 w-full md:w-2/5 flex flex-col transition-all duration-300 ease-in-out md:absolute md:top-0 ${isMenuOpen ? 'md:right-0 flex min-h-[92.3dvh]' : 'md:min-h-screen md:-right-full overflow-hidden min-h-0'}`}>
          {/* Nav close for md */}
          <div className='hidden md:block'>
            <button onClick={() => setIsMenuOpen(false)} className="py-6 px-4">
              <XMarkIcon className="h-7 w-7 text-[#7f7f7f] hover:text-[#191919] dark:text-gray-400 dark:hover:text-gray-100" />
            </button>
          </div>

          {/* Nav Links */}
          <ul className='p-4 overflow-y-scroll'>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <Link href='/liquidity' onClick={() => setIsMenuOpen(false)} className='p-2 block hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all duration-300 ease-in-out'>
                Liquidity
              </Link>
            </li>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <Link href='/valuation' onClick={() => setIsMenuOpen(false)} className='p-2 block hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all duration-300 ease-in-out'>
                Valuation
              </Link>
            </li>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <Link href='/optimal' onClick={() => setIsMenuOpen(false)} className='p-2 block hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all duration-300 ease-in-out'>
                Optimal
              </Link>
            </li>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <div className='flex flex-row items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-300 ease-in-out'>
                <Link href='/indicators' onClick={() => setIsMenuOpen(false)} className='flex-1 p-2 block border-r border-zinc-300 dark:border-zinc-700'>
                  Indicators
                </Link>
                <button
                  className='p-2'
                  onClick={() => toggleIndicators()}
                >
                  <svg
                    className={`cursor-pointer mr-2 h-4 w-4 transition-transform duration-200 ${isIndicatorsOpen ? 'rotate-180 ml-2 mr-1' : 'ml-1 mb-1 '}`}
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {indicators !== "" && indicators?.map((item) => (
                <div key={item.category.id} className={ `mt-2 ml-2 flex-1 px-4 first:pl-0 last:pr-0 ${isIndicatorsOpen ? 'block' : 'hidden'}` }>
                  <h2 className='text-sm text-gray-500 dark:text-gray-400 mb-3'>{item.category.name}</h2>
                  <ul className='ml-2 space-y-2'>
                    {item.indicators.map((indicator, idx) => (
                      <li key={idx} className={`w-full ${pathname.startsWith(`/indicators/${indicator.url_name}`) ? '' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'} rounded-md py-1`}>
                        <Link href={`/indicators/${indicator.url_name}`} onClick={() => setIsMenuOpen(false)} className={`block w-full p-0.5 transition duration-300 ${pathname.startsWith(`/indicators/${indicator.url_name}`) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}>
                          {indicator.human_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </li>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <div className="flex flex-row items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-300 ease-in-out">
                <Link href='/datasources' onClick={() => setIsMenuOpen(false)} className='flex-1 p-2 block border-r border-zinc-300 dark:border-zinc-700'>
                  Data Sources
                </Link>
                <button
                  className='p-2'
                  onClick={() => toggleDatasources()}
                >
                  <svg
                    className={`cursor-pointer mr-2 h-4 w-4 transition-transform duration-200 ${isDatasourcesOpen ? 'rotate-180 ml-2 mr-1' : 'ml-1 mb-1 '}`}
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {dataSources.map((dataSource, idx) => (
                <ul key={idx} className={ `mt-2 ml-2 flex-1 px-4 first:pl-0 last:pr-0 ${isDatasourcesOpen ? 'block' : 'hidden'}`}>
                  <li className={`w-full ${pathname.startsWith(`/datasources/${dataSource.url}`) ? '' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'} rounded-md py-1`}>
                  <Link href={`/datasources/${dataSource.url}`} onClick={() => setIsMenuOpen(false)} className={`block w-full p-0.5 transition duration-300 ${pathname.startsWith(`/datasources/${dataSource.url}`) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}>
                      {dataSource.name}
                  </Link>
                  </li>
                </ul>
              ))}
            </li>
            <li className='py-2 border-b border-zinc-300 dark:border-zinc-700'>
              <div className="flex flex-row items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all duration-300 ease-in-out">
                <Link href='/notebooks' onClick={() => setIsMenuOpen(false)} className='flex-1 p-2 block border-r border-zinc-300 dark:border-zinc-700'>
                  Research
                </Link>
                <button
                  className='p-2'
                  onClick={() => toggleResearch()}
                >
                  <svg
                    className={`cursor-pointer mr-2 h-4 w-4 transition-transform duration-200 ${isResearchOpen ? 'rotate-180 ml-2 mr-1' : 'ml-1 mb-1 '}`}
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {notebooks.notebooks.map((notebook, idx) => (
                <ul key={idx} className={ `mt-2 ml-2 flex-1 px-4 first:pl-0 last:pr-0 ${isResearchOpen ? 'block' : 'hidden'}`}>
                  <li className={`w-full ${pathname.startsWith(`/notebooks/${notebook.path}`) ? '' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'} rounded-md py-1`}>
                  <Link href={`/notebooks/${notebook.path}`} onClick={() => setIsMenuOpen(false)} className={`block w-full p-0.5 transition duration-300 ${pathname.startsWith(`/notebooks/${notebook.path}`) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}>
                      {notebook.name}
                  </Link>
                  </li>
                </ul>
              ))}
            </li>
            <li className='py-2'>
              <Link href='/docs' onClick={() => setIsMenuOpen(false)} className='p-2 block hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all duration-300 ease-in-out'>
                API Docs
              </Link>
            </li>
          </ul>

          {/* Navbar Footer */}
          <div className='mt-auto mb-5 md:mb-0 flex flex-row justify-between border-t border-zinc-300 dark:border-zinc-700 p-4'>
            <div className='flex space-x-4 items-center'>
              <a href="https://github.com/dhruvan2006" target="_blank" rel="noopener noreferrer">
                <svg className="w-8 h-8 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* LinkedIn Logo */}
              <a href="https://www.linkedin.com/in/dhruvan-g" target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Light/dark theme switch */}
              <ThemeToggleSwitch />
            </div>
            {/* Login btn for mobile */}
            {!session?.user ? (
            <Link href="/login">
              <button className="block md:hidden lg:hidden font-semibold bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition duration-300 py-1.5 px-4 rounded-md">
                Get API
              </button>
            </Link>
          ) : ''}
          </div>
        </div>


        <Toast showToast={showGenToast} message="API Key Generated" />
        <Toast showToast={showRegenToast} message="API Key Regenerated" />
      </nav>
    </header>
  );
}
