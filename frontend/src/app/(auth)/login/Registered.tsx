'use client';

import React, { useState } from 'react';

export default function Registered() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-6 px-4 py-2 flex items-center justify-between bg-[#e6f4ea] text-[#1e8e3e] border border-[#34a853] rounded-md">
      <span>Registration successful! You can now log in.</span>
      <button
        onClick={() => setIsVisible(false)}
        className="text-[#1e8e3e] hover:bg-[#d4edda] hover:text-[#155724] px-1 rounded-md transition-colors duration-300"
        aria-label="Close"
      >
        &#x2715;
      </button>
    </div>  
  );
}
