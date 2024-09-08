import React from 'react';

interface IndicatorDescriptionProps {
  indicator: {
    name: string;
    human_name: string;
    description: string;
  };
}

const IndicatorDescription: React.FC<IndicatorDescriptionProps> = ({ indicator }) => {
  return (
    <div className='bg-gray-100 p-4 rounded-md mb-6'>
      <h2 className='text-xl font-bold mb-2'>{indicator.human_name}</h2>
      <p className='mb-4 whitespace-pre-line'>{indicator.description}</p>
    </div>
  );
};

export default IndicatorDescription;