'use client';

import React, { useEffect, useState, useRef } from 'react';

interface TickerPickerProps {
  apiBase: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TickerPicker({ apiBase, label, value, onChange }: TickerPickerProps) {
  const [previousValue, setPreviousValue] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value.length > 0 && value != previousValue) {
      const fetchSuggestions = async (query: string) => {
        try {
          const res = await fetch(`${apiBase}/api/optimal/tickers?q=${query}`);
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await res.json();
          setSuggestions(data.suggestions || []); 
          setIsDropdownOpen(true);
        } catch (e) {
          console.log(`Error fetching ticker search suggestions: ${e}`);
          setSuggestions([]);
          setIsDropdownOpen(false);
        }
      };

      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [value, apiBase, previousValue]);

  const handleSuggestionClick = (ticker: string) => {
    onChange(ticker);
    setPreviousValue(ticker);
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex flex-col items-start relative'>
      <span className='text-zinc-900 dark:text-zinc-300 mb-1'>{label}</span>
      <div ref={inputContainerRef}>
        <input 
          type="text" 
          className='bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-300 text-zinc-900 dark:text-zinc-300 px-4 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#0057ff] focus:border-transparent'
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        />
        {isDropdownOpen && suggestions.length > 0 && (
          <ul className='absolute top-[4.75rem] h-40 overflow-y-auto z-10 bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-300 mt-1 rounded-md w-full'>
            {suggestions.map((ticker) => (
              <li 
                key={ticker} 
                className='px-4 py-2 hover:bg-[#0057ff] hover:text-white dark:hover:text-zinc-900 cursor-pointer'
                onClick={() => handleSuggestionClick(ticker)}
              >
                {ticker}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
