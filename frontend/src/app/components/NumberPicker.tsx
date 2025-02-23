import React from 'react';

interface NumberPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function NumberPicker({ label, value, onChange }: NumberPickerProps) {
  return (
    <div className='flex flex-col items-start'>
      <span className='text-zinc-900 dark:text-zinc-300 mb-1'>{label}</span>
      <input 
        type="number" 
        className='bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-300 text-zinc-900 dark:text-zinc-300 px-4 py-2 rounded-md w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-[#0057ff] focus:border-transparent'
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))} 
      />
    </div>
  );
};
