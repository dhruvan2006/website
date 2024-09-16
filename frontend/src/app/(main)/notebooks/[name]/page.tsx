import React from "react";
import { notFound } from "next/navigation";

async function fetchHtml(name: string) {
  const res = await fetch(`${process.env.API_BASE_URL}/api/research/notebooks/${name}`);

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
