"use client";

import React, {useState, useEffect, useRef} from 'react';
import { XMarkIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

const SYMBOLS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'MSTR'];

interface PriceData {
  price: number;
  change_percent: number;
}

interface Prices {
  [symbol: string]: PriceData | null;
}

const PriceDisplay: React.FC<{ value: number; prevValue?: number }> = ({
  value,
  prevValue,
}) => {
  const [flash, setFlash] = useState(false);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (prevValue !== undefined && value !== prevValue) {
      setFlash(true);
      const direction = value > prevValue ? "bg-green-500/20" : "bg-red-500/20";
      setFlashClass(direction);

      const timer = setTimeout(() => {
        setFlash(false);
        setFlashClass(""); // Reset flash class after animation
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <span
      className={`px-1 rounded transition-all duration-1000 ease-in-out ${flash ? flashClass : ""}`}
    >
      ${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
};

export default function LiveTicker() {
  const initialPrices = SYMBOLS.reduce((acc, symbol) => {
    acc[symbol] = null;
    return acc;
  }, {} as Prices);
  const [prices, setPrices] = useState<Prices>(initialPrices);

  // Collapse logic from local storage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isCollapsed') === 'true';
    }
    return false;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isCollapsed', String(isCollapsed));
    }
  }, [isCollapsed]);

  // Store prev prices
  const prevPrices = useRef<Prices>(prices);
  useEffect(() => {
    prevPrices.current = prices;
  }, [prices]);

  // Websocket
  useEffect(() => {
    const ws = new WebSocket('wss://api.gnanadhandayuthapani.com/ws/');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (SYMBOLS.includes(data.id)) {
        setPrices(prev => ({
          ...prev,
          [data.id]: data
        }));
      }
    };

    ws.onerror = (error) => {
      console.error('Websocket error: ', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  if (isCollapsed) {
    return (
      <div className="fixed bottom-0 left-0 opacity-100">
        <button
          className="absolute bottom-1 left-1 p-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-500 border border-zinc-300 dark:border-zinc-700 focus:outline-none transition-colors duration-300"
          onClick={() => setIsCollapsed(false)}
        >
          <ArrowUpIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }
  else return (
    <div className="fixed bottom-0 left-0 text-sm rounded-tr-lg py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-t border-r border-zinc-300 dark:border-zinc-700">
      <button
        className="absolute -top-2 -right-2 p-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-500 border border-zinc-300 dark:border-zinc-700 focus:outline-none transition-colors duration-300"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>

        <div className="grid grid-cols-[auto_auto_auto] gap-x-4 gap-y-1 items-center">
          {Object.entries(prices).map(
            ([symbol, data]) =>
              data && (
                <React.Fragment key={symbol}>
                  <span className="font-medium w-12">
                    {symbol.split("-")[0]}
                  </span>
                  <PriceDisplay
                    value={data.price}
                    prevValue={prevPrices.current[symbol]?.price}
                  />
                  <span
                    className={`flex items-center ${
                      data.change_percent >= 0 ? "text-green-500" : "text-red-500"
                    } w-16`}
                  >
                    {data.change_percent >= 0 ? "▲" : "▼"}
                    {Math.abs(data.change_percent).toFixed(2)}%
                  </span>
                </React.Fragment>
              )
          )}
        </div>
    </div>
  );
}
