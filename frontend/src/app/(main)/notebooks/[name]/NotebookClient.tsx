"use client";

import React, { useEffect, useRef, useState } from "react";

export default function NotebookClient({ htmlContent }: { htmlContent: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('auto');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const updateHeight = () => {
      if (iframe && iframe.contentWindow?.document) {
        setIframeHeight(`${iframe.contentWindow.document.body.scrollHeight}px`);
      }
    };

    iframe.addEventListener('load', updateHeight);
    window.addEventListener('resize', updateHeight);

    return () => {
      iframe.removeEventListener('load', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          flex: 1,
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
