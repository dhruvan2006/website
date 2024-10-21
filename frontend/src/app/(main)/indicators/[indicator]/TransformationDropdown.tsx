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
        className="flex justify-between items-center w-full px-2 py-1.5 bg-[#fff] border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue focus:border-blue"
      >
        <span>{transformation}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-[#fff] border border-zinc-300 rounded-md mt-1 shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 hover:bg-blue hover:text-[#fff] cursor-pointer transition duration-100 ${bold.includes(option) ? 'font-bold' : ''} ${option === transformation ? 'bg-blue text-[#fff]' : ''}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
