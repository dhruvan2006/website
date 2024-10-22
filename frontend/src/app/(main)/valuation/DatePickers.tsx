'use client';

import DatePicker from "@/components/DatePicker";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DatePickers({
  startDate, endDate
} : {
  startDate: string;
  endDate: string
}) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)
  const router = useRouter();

  const handleButtonUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(`/valuation?startDate=${localStartDate}&endDate=${localEndDate}`);
  }

  return (
    <form className='mb-6 flex flex-col sm:flex-row items-center w-full lg:w-auto justify-between'>
      <div className='flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0'>
        <DatePicker 
          label="Start Date" 
          value={localStartDate}
          onChange={setLocalStartDate} 
        />
        <DatePicker 
          label="End Date" 
          value={localEndDate} 
          onChange={setLocalEndDate} 
        />
      </div>
      <button 
        className='m-0 sm:mt-7 lg:ml-8 bg-[#191919] hover:bg-[#474747] text-white transition duration-300 py-2 px-6 rounded-md'
        onClick={handleButtonUpdate}
      >
        Update
      </button>
    </form>
  );
}