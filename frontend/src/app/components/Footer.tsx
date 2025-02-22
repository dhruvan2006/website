import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#181a1b] border-t border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold ml-2">Dhruvan.</span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-300">
              Empowering financial decisions with analytics and data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/liquidity" className="hover:text-[#7f7f7f] transition duration-300">Liquidity</Link></li>
              <li><Link href="/valuation" className="hover:text-[#7f7f7f] transition duration-300">Valuation</Link></li>
              <li><Link href="/optimal" className="hover:text-[#7f7f7f] transition duration-300">Optimal</Link></li>
              <li><Link href="/indicators" className="hover:text-[#7f7f7f] transition duration-300">Indicators</Link></li>
              <li><Link href="/datasources" className="hover:text-[#7f7f7f] transition duration-300">Data Sources</Link></li>
              <li><Link href="/notebooks" className="hover:text-[#7f7f7f] transition duration-300">Research</Link></li>
              <li><Link href="/docs" className="hover:text-[#7f7f7f] transition duration-300">API Docs</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="mailto:contact@dhruvan.com" className="hover:text-[#7f7f7f] transition duration-300">dhruvan2006@gmail.com</a></li>
              <li className="flex space-x-2 mt-4 items-center">
                <a href="https://github.com/dhruvan2006" target="_blank" rel="noopener noreferrer">
                  <svg className="w-8 h-8 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/dhruvan-g" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-300 dark:border-zinc-700 text-center text-sm text-zinc-500 dark:text-zinc-300">
          © {new Date().getFullYear()} Dhruvan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
