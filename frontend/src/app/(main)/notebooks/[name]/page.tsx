export const dynamic = "force-dynamic";

import React from "react";
import { customFetch } from "@/api";
import NotebookClient from "./NotebookClient";

function formatTitle(name: string) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: { name: string } }) {
  const { name } = params;
  const title = formatTitle(name);

  return {
    title: `${title} Notebook | Dhruvan`,
    description: `Explore the ${title} notebook for in-depth Bitcoin research on Dhruvan.`,
    openGraph: {
      title: `${title} Notebook | Dhruvan`,
      description: `Explore the ${title} notebook for in-depth Bitcoin research on Dhruvan.`,
      url: `https://crypto.dhruvan.dev/notebooks/${name}`,
      images: [
        {
          url: '/og/notebook.png',
          width: 1200,
          height: 630,
          alt: `${title} Notebook | Dhruvan`,
        }
      ],
      siteName: 'Dhruvan',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Notebook | Dhruvan`,
      description: `Explore the ${title} notebook for in-depth Bitcoin research on Dhruvan.`,
      images: ['/og/notebook.png'],
    }
  };
}

async function fetchHtml(name: string) {
  const res = await customFetch(`${process.env.API_BASE_URL}/api/research/notebooks/${name}`);

  return res.text();
}

export default async function NotebookPage({ params }: { params: { name: string } }) {
  const { name } = params;
  const htmlContent = await fetchHtml(name);

  return (
    <NotebookClient htmlContent={htmlContent} />
  );
}
