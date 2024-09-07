import React from 'react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  return (
    <div className='flex flex-col items-start'>
      <span className='text-[#191919] mb-1'>{label}</span>
      <input 
        type="date" 
        className='bg-[#fff] border border-[#191919] text-[#191919] px-4 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#0057ff] focus:border-transparent'
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};

export default DatePicker;