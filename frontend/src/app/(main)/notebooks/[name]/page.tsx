import React from "react";
import { customFetch } from "@/api";

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
    <div>
        <iframe
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            overflow: 'auto',
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
  );
}
