'use client';

import React, { useState, useEffect } from 'react';
import CodeBlock from './CodeBlock';

export default function DocsClient() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {threshold: 0.5}
    );
    
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'endpoints', title: 'Endpoints' }
  ];

  return (
    <div className="min-h-[88.7vh] flex flex-col font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 py-2">
      <h1 className="text-4xl font-bold mb-6 text-center">API Documentation</h1>
      <div className='flex flex-row'>
      <main className="container mx-auto px-4 flex-grow">
        <section id="introduction" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>Welcome to the API documentation for Dhruvan. This API allows you to access all the data available on this website programmatically.</p>
          <br />
          <p><b>Base URL:</b>{' '}<code className="bg-gray-100 dark:bg-[#1e2022] text-red-500 px-1 rounded">https://crypto.dhruvan.dev/api/</code></p>
        </section>

        <section id="authentication" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p>All requests to the endpoints are required to have an API key in the HTTP <code className="bg-gray-100 dark:bg-[#1e2022] text-red-500 px-1 rounded">X-Api-Key</code> header.</p>
          <br />
          <p>To get an API key, you need to create an account. Click on the &quot;Get API Key&quot; button at the top of the page. After creating your account, go to your profile picture, click on it, and in the dropdown menu, select &quot;Generate API Key&quot;.</p>
          <br />
          <p>Then, add the <code className="bg-gray-100 dark:bg-[#1e2022] text-red-500 px-1 rounded">X-Api-Key: &lt;API_KEY&gt;</code> HTTP header to all your requests to the server. This is how you are authenticated. In case you lose the API key, you can always regenerate a new one.</p>
          <CodeBlock apiKey='<API_KEY>' />
        </section>

        <section id="endpoints" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
          <p className='mb-4'>Here are the available API endpoints:</p>
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get Liquidity Values</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/liquidity/series?ticker={'<ticker_name>'}</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve liquidity values by using &aposLIQUIDITY&apos. Get the components with the corresponding {'<ticker_name>'}.</p>
            </div>
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get Bitcoin Price</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/indicators/price</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve live daily historical Bitcoin price.</p>
            </div>
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get List of Indicators</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/indicators/indicator</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve a list of available indicators.</p>
            </div>
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get Indicator Values</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/indicators/indicator/{'<indicator_name>'}/values</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve values for a specific indicator.</p>
            </div>
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get List of Data Sources</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/indicators/datasource</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve a list of available data sources.</p>
            </div>
            <div className="bg-gray-100 dark:bg-[#1e2022] p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">Get Data Sources</h3>
              <code className="text-red-500 inline-block text-wrap">GET /api/indicators/datasource/{'<datasource_name>'}/values</code>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Retrieve values for a specific data source.</p>
            </div>
          </div>
        </section>
      </main>

      <nav className="hidden lg:block w-64 p-6 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-l border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Contents</h3>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block py-2 px-3 rounded-md transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      </div>
    </div>
  )
}