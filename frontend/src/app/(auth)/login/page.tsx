import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Login | Dhruvan",
  description: "Log in to your account to access your API key."
};

function Success() {
  return (
    <div className="mb-6 px-4 py-2 flex items-center justify-between bg-[#e6f4ea] text-[#1e8e3e] border border-[#34a853] rounded-md">
      <span>Registration successful! You can now log in.</span>
      <Link
        href="/login"
        className="text-[#1e8e3e] hover:bg-[#d4edda] hover:text-[#155724] px-1 rounded-md transition-colors duration-300"
        aria-label="Close"
      >
        &#x2715;
      </Link>
    </div> 
  );
}

export default async function LogInPage({
  searchParams,
}: {
  searchParams: { registered?: string }
}) {
  const session = await auth();

  if (session?.user) {
    return redirect('/docs');
  }
  
  const registered = searchParams.registered === 'true';

  return (
    <div className='flex w-full min-h-screen px-4 lg:px-0 relative'>
      {/* <div className="absolute top-6 right-8 hover:bg-gray-100 rounded-md py-2 px-4 transition-all duration-300">
        <Link href="/signup">
          Sign up
        </Link>
      </div> */}

      <div className="hidden lg:block w-1/3 min-h-screen bg-[#191919] items-center py-6 px-8">
        <Link href="/" className="flex items-center">
          <Image className='invert' src="logo.svg" alt="Logo" width={35} height={35} />
          <h1 className='text-[#fff] text-3xl font-bold ml-2'>Dhruvan</h1>
        </Link>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center bg-[#fff] text-[#191919] font-sans">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Log in</h1>

          {registered && <Success />}
          
          {/* <form className="space-y-6" action={async () => {
            "use server"
            await signIn('credentials', { callbackUrl: '/indicators' })
          }}>
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
          </form> */}

          <form action={async () => {
            "use server"
            await signIn('google', { callbackUrl: '/docs' })
          }}>
            <button
              type="submit"
              className="w-full flex flex-row items-center justify-center space-x-2 bg-[#fff] hover:bg-white text-[#191919] border border-[#191919] py-3 px-4 rounded-md transition duration-300"
            >
              <Image src="/google-logo.svg" alt="Google Logo" width={24} height={0} />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* <form action={async () => {
            "use server"
            await signIn('facebook', { callbackUrl: '/docs' })
          }}>
            <button
              type="submit"
              className="w-full flex flex-row items-center justify-center space-x-2 bg-[#fff] hover:bg-[#e6f0ff] text-[#191919] border border-[#0866ff] py-3 px-4 rounded-md transition duration-300"
            >
              <Image src="/facebook-logo.png" alt="Facebook Logo" width={24} height={0} />
              <span>Continue with Facebook</span>
            </button>
          </form> */}

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <form action={async () => {
            "use server"
            await signIn('github', { redirectTo: '/docs' })
          }}>
            <button
              type="submit"
              className="w-full flex flex-row items-center justify-center space-x-2 bg-[#222222] hover:bg-[#000] text-white py-3 px-4 rounded-md transition duration-300"
            >
              <Image src="github-mark-white.svg" alt="GitHub Logo" width={24} height={0} />
              <span>Continue with GitHub</span>
            </button>
          </form>

          {/* <form action={async () => {
            "use server"
            await signIn('spotify', { redirectTo: '/docs' })
          }}>
            <button
              type="submit"
              className="w-full flex flex-row items-center justify-center space-x-2 bg-[#1cd661] hover:bg-[#1ab956] text-white py-3 px-4 rounded-md transition duration-300"
            >
              <Image src="/spotify-logo-white.png" alt="Spotify Logo" width={24} height={0} />
              <span>Continue with Spotify</span>
            </button>
          </form> */}

          <form action={async () => {
            "use server"
            await signIn('gitlab', { redirectTo: '/docs' })
          }}>
            <button
              type="submit"
              className="w-full flex flex-row items-center justify-center space-x-2 bg-[#fc6d26] hover:bg-[#db5f21] text-[#fff] py-3 px-4 rounded-md transition duration-300"
            >
              <Image src="/gitlab-logo.png" alt="GitLab Logo" width={24} height={0} />
              <span>Continue with GitLab</span>
            </button>
          </form>
          
          {/* <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue hover:underline">
              Sign up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}