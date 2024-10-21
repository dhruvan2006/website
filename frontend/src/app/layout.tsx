import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from './Providers';
import "./globals.css";
import "./fonts.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhruvan | Live Bitcoin Indicators and Liquidity Data",
  description: "Real-time Bitcoin analytics, live market indicators, and liquidity data API for crypto investors. Access powerful tools and insights for cryptocurrency investors, traders, and developers.",
  keywords: "Bitcoin, cryptocurrency, market indicators, liquidity data, crypto API, analytics, trading tools",
  authors: [{ name: "Dhruvan Gnanadhandayuthapani" }],
  openGraph: {
    title: "Dhruvan | Live Bitcoin Indicators and Liquidity Data",
    description: "Real-time Bitcoin analytics, live market indicators, and liquidity data API for crypto investors. Access powerful tools and insights for cryptocurrency investors, traders, and developers.",
    url: "https://www.gnanadhandayuthapani.com",
    siteName: "Dhruvan",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Live Bitcoin Indicators and Liquidity Data",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruvan | Live Bitcoin Indicators and Liquidity Data",
    description: "Real-time Bitcoin analytics, live market indicators, and liquidity data API for crypto investors. Access powerful tools and insights for cryptocurrency investors, traders, and developers.",
    images: ["/og/home.png"],
  },
  verification: {
    google: "LJsjvPuX00Z_d2q4oTjRBvZL91-s-idhiAcEPOPktAQ",
  },
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
