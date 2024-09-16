'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Toast from './Toast';

export default function DisplayAPI({ apiKey }: {apiKey: string}) {
  const [showAPI, setShowAPI] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const toggleAPIVisibility = () => {
    setShowAPI(!showAPI);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className='relative'>
      {/* Shows the API Key */}
      <input
        type={showAPI ? 'text' : 'password'}
        value={apiKey}
        readOnly
        className='w-full font-mono break-all bg-gray-100 p-1 pr-16 rounded'
      />

      {/* Copy to clipboard button */}
      <button
        onClick={() => copyToClipboard()}
        className='absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
        title='Copy to clipboard'
      >
        <Image src="/clipboard.png" alt="Copy to clipboard" width={20} height={20} />
      </button>

      {/* Toggle visibility button */}
      <button
        onClick={toggleAPIVisibility}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        title="Toggle visibility"
      >
        {showAPI ? (
          <Image src="/eye-open.png" alt="Show API" width={20} height={20} />
        ) : (
          <Image src="/eye-closed.png" alt="Hide API" width={20} height={20} />
        )}
      </button>

      {/* Notification */}
      <Toast showToast={showNotification} message="API key copied!" />
    </div>
  )
}
