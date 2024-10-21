import React, { useState, useEffect, useRef } from "react";

export default function DownloadDropdown({
  onDownloadSelect
}: {
  onDownloadSelect: (format: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['CSV', 'Excel'];
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onDownloadSelect(option);
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
    <div className="relative inline-block z-10" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex me-4 justify-between items-center w-full px-2 py-2 bg-blue text-white rounded-md hover:bg-[#0046cc] transition duration-300"
      >
        <span className="text-sm">Download</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-[#fff] border border-gray-300 rounded-md mt-1 shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer transition duration-100 hover:bg-white"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
