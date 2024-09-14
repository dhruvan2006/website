import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default async function NotFound() {
  return (
    <div className="h-[88vh] bg-[#fff] text-[#191919] font-sans">
      <main className="container h-full mx-auto px-4 sm:px-8 lg:px-16 py-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-4">Oops! The page you are looking for does not exist.</p>
        <Image className='mb-8' src="/404.jpg" width={300} height={0} alt="404 error image" />
        <Link href="/" className='bg-blue hover:bg-darkerblue text-white py-2 px-6 rounded-md transition duration-300'>
          Go back home
        </Link>
      </main>
    </div>
  )
}
