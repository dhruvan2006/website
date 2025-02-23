import React, { useState, useEffect, useRef } from "react";

export default function CustomDropdown({
  transformation, setTransformation 
} : {
  transformation: string;
  setTransformation: (str: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['x²', '√x', 'x', 'ln(x)', '-1/√x', '-1/x', '-1/x²'];
  const bold = ['x', 'ln(x)']
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setTransformation(option);
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside or pressing Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block w-20 z-10 ms-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <span>{transformation}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md mt-1 shadow-lg overflow-hidden">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 hover:bg-blue-500 hover:zinc-100 dark:text-zinc-300 cursor-pointer transition duration-100 ${bold.includes(option) ? 'font-bold' : ''} ${option === transformation ? 'bg-blue-500 text-white dark:text-white' : ''}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
