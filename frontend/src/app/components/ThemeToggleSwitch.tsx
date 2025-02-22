import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggleSwitch() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#181a1b';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
      }
    } else {
      // If no stored theme, check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#181a1b';
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: any) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.body.style.backgroundColor = '#181a1b';
        } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = '#ffffff';
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#181a1b';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <SunIcon className="h-7 w-7 text-[#191919] hover:text-[#474747] dark:text-[#d8d5d0] dark:hover:text-[#bbb5ac] transition duration-300" />
      ) : (
        <MoonIcon className="h-7 w-7 text-[#191919] hover:text-[#474747] dark:text-[#d8d5d0] dark:hover:text-[#bbb5ac] transition duration-300" />
      )}
    </button>
  );
}
