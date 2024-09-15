import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Login | Dhruvan",
  description: "Log in to your account to access your API key."
};

export default async function LogInPage() {
  return (
    <div className='flex w-full min-h-screen px-4 lg:px-0 relative'>
      <div className="absolute top-6 right-8 hover:bg-gray-100 rounded-md py-2 px-4 transition-all duration-300">
        <Link href="/signup">
          Sign up
        </Link>
      </div>

      <div className="hidden lg:block w-1/3 min-h-screen bg-[#191919] items-center py-6 px-8">
        <div className="flex items-center">
          <Image className='invert' src="logo.svg" alt="Logo" width={35} height={35} />
          <h1 className='text-[#fff] text-3xl font-bold ml-2'>Dhruvan</h1>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center bg-[#fff] text-[#191919] font-sans">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Log in</h1>
          
          <form className="space-y-6">
            <div className='space-y-4'>              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#222222] hover:bg-[#000] text-white py-2 px-4 rounded-md transition duration-300"
            >
              Log In
            </button>
          </form>
          
          <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}