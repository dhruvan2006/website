import Link from 'next/link';
import React from 'react';

interface ApiHelpProps {
  indicator: string;
}

const ApiHelp: React.FC<ApiHelpProps> = ({ indicator }) => {
  const baseUrl = 'https://api.gnanadhandayuthapani.com/api/indicators';

  return (
    <div className='bg-gray-100 p-4 rounded-md mb-6'>
      <h2 className='text-xl font-bold mb-2'>API Documentation</h2>
      <p className='mb-2'>You can access the {indicator.toUpperCase()} indicator data using the following API endpoints:</p>
      <ul className='list-disc pl-5 mb-4'>
        <li>
          <strong>Get all {indicator.toUpperCase()} data:</strong>
          <br />
          <Link href={`${baseUrl}/indicator/${indicator}/values`} target='_blank'>
            <code className='text-blue hover:text-indigo-500 hover:underline break-all bg-gray-200'>{`${baseUrl}/indicator/${indicator}/values`}</code>
          </Link>
        </li>
        <li>
          <strong>Get Bitcoin price data:</strong>
          <br />
          <Link href={`${baseUrl}/price`} target='_blank'>
            <code className='text-blue hover:text-indigo-500 hover:underline break-all bg-gray-200'>{`${baseUrl}/price`}</code>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ApiHelp;