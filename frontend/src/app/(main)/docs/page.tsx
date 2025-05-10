export const dynamic = "force-dynamic";

import React from 'react';
import { Metadata } from 'next';
import DocsClient from './DocsClient';

export const metadata: Metadata = {
  title: "API Documentation | Dhruvan",
  description: "Explore the API documentation for Dhruvan to learn how to access our data.",
  openGraph: {
    title: "API Documentation | Dhruvan",
    description: "Explore the API documentation for Dhruvan to learn how to access our data.",
    url: "https://crypto.dhruvan.dev/docs",
    images: [
      {
        url: '/og/docs.png',
        width: 1200,
        height: 630,
        alt: "API Documentation | Dhruvan",
      }
    ],
    siteName: 'Dhruvan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "API Documentation | Dhruvan",
    description: "Explore the API documentation for Dhruvan to learn how to access our data.",
    images: ['/og/docs.png'],
  }
}

export default function APIDocs() {
  return <DocsClient />;
}