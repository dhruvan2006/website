import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Sign Up | Dhruvan",
  description: "Create an account to access your API key."
};

export default async function SignUpPage() {
  return (
    <div className='flex w-full min-h-screen px-4 lg:px-0 relative'>
      <div className="absolute top-6 right-8 hover:bg-gray-100 rounded-md py-2 px-4 transition-all duration-300">
        <Link href="/login">
          Log in
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
          <h1 className="text-3xl font-bold mb-6 text-center">Create an account</h1>
          
          <form className="space-y-6">
            <div className='space-y-4'>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="John Doe"
                />
              </div>
              
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
              Sign Up
            </button>
          </form>
          
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}