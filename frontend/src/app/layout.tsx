import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from './Providers';
import "./globals.css";
import "./fonts.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhruvan: Live bitcoin indicators and liquidity data",
  description: "Real-time Bitcoin analytics, live market indicators, and liquidity data API for crypto investors. Access powerful tools and insights for cryptocurrency investors, traders, and developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
