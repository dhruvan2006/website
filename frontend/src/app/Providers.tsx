'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import {ThemeProvider} from "@/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ProgressBar
        height="2px"
        color="#ff0000"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ThemeProvider>
  );
}