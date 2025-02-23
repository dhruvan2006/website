import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import {useTheme} from "@/ThemeContext";

export default function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.body.style.backgroundColor = newTheme === "dark" ? "#181a1b" : "#ffffff";
  };

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? (
        <SunIcon className="h-7 w-7 text-[#191919] hover:text-[#474747] dark:text-[#d8d5d0] dark:hover:text-[#bbb5ac] transition duration-300" />
      ) : (
        <MoonIcon className="h-7 w-7 text-[#191919] hover:text-[#474747] dark:text-[#d8d5d0] dark:hover:text-[#bbb5ac] transition duration-300" />
      )}
    </button>
  );
}
