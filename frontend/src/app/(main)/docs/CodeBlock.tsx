import React, { useState } from 'react';
import Image from 'next/image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
  apiKey: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ apiKey }) => {
  const [activeTab, setActiveTab] = useState('curl');

  const codeExamples = {
    curl: `curl -X GET "https://api.gnanadhandayuthapani.com/api/" \\
     -H "X-Api-Key: ${apiKey}"`,
    python: `import requests

url = "https://api.gnanadhandayuthapani.com/api/"
headers = {
    "X-Api-Key": "${apiKey}"
}

response = requests.get(url, headers=headers)
print(response.json())`,
    javascript: `fetch('https://api.gnanadhandayuthapani.com/api/ {
  headers: {
    'X-Api-Key': '${apiKey}'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
  };

  return (
    <div className=''>
      <div className="mt-4">
        <div className="flex mb-2">
          {Object.keys(codeExamples).map((lang) => (
            <button
              key={lang}
              className={`px-3 py-1 mr-2 rounded-t-md ${
                activeTab === lang
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
        <pre className="bg-gray-100 rounded-b-md overflow-x-auto relative">
          <code>
            <SyntaxHighlighter language={activeTab === 'curl' ? 'bash' : activeTab} style={tomorrowNightBright} wrapLines wrapLongLines>
              {codeExamples[activeTab as keyof typeof codeExamples]}
            </SyntaxHighlighter>
          </code>
        </pre>
      </div>

      <div className='mt-4 mb-8'>
        <div className="flex mb-2">
          <button className='px-3 py-1 mr-2 rounded-t-md bg-gray-200 text-gray-800'>
            Response
          </button>
        </div>
        <pre className="bg-gray-100 rounded-b-md overflow-x-auto">
          <code>
            <SyntaxHighlighter language='json' style={tomorrowNightBright} wrapLines wrapLongLines>
              {"{\"message\"\: \"API key is valid}"}
            </SyntaxHighlighter>
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;