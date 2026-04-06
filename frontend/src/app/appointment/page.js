"use client";

import { useState } from "react";
import { BookingForm } from "@/components/appointment/bookingForm";
import { BookingDetails } from "@/components/appointment/bookingDetail";

export default function BookingPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="w-full min-h-screen  bg-[#FBFBFB] flex justify-center">
      
      <div className="w-full h-full flex flex-col lg:flex-row">
        
        <div className="w-full lg:w-[450px] border-b lg:border-b-0 lg:border-r border-gray-300 mt-5 mb-5">
          <BookingForm onConfirm={handleConfirm} />
        </div>

        <div className="flex-1 mt-5 ml-20">
          <BookingDetails isConfirmed={isConfirmed} />
        </div>

      </div>
    </div>
  );
}