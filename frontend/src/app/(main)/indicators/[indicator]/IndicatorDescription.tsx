import React from 'react';

interface IndicatorDescriptionProps {
  indicator: {
    name: string;
    human_name: string;
    description: string;
  };
}

const IndicatorDescription: React.FC<IndicatorDescriptionProps> = ({ indicator }) => {
  const parseDescription = (description: string) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const parts = description.split(urlRegex);
    const urls = description.match(urlRegex);

    return parts.map((part, index) => {
      if (index < parts.length - 1) {
        return (
          <React.Fragment key={index}>
            {part}
            <a href={urls![index]} className="text-blue text-underline" target="_blank" rel="noopener noreferrer">
              {urls && urls[index]}
            </a>
          </React.Fragment>
        );
      }
      return part;
    });
  };

  return (
    <div className='bg-gray-100 p-4 rounded-md mb-6'>
      <h2 className='text-xl font-bold mb-2'>{indicator.human_name}</h2>
      <p className='mb-4 whitespace-pre-line'>{parseDescription(indicator.description)}</p>
    </div>
  );
};

export default IndicatorDescription;
