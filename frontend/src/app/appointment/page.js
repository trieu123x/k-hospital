"use client";

import { useState } from "react";
import { BookingForm } from "@/components/appointment/bookingForm";
import { BookingDetails } from "@/components/appointment/bookingDetail";
import { useAuthStore } from "@/stores/auth"; 
import { Suspense } from "react";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải form đặt lịch...</div>}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const { user } = useAuthStore(); 
  const patientId = user?.id; 

  const [previewData, setPreviewData] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] flex justify-center">
      <div className="w-full h-full flex flex-col lg:flex-row">
        
        <div className="w-full lg:w-[450px] border-b lg:border-b-0 lg:border-r border-gray-300 mt-5 mb-5">
          {patientId ? (
            <BookingForm 
              patientId={patientId} 
              onChangeData={(data) => setPreviewData(data)} 
              onConfirm={() => setIsConfirmed(true)} 
            />
          ) : (
            <div className="p-8 mt-10 text-center">
              <p className="text-gray-500 font-medium">Vui lòng đăng nhập để tiến hành đặt lịch.</p>
            </div>
          )}
        </div>

        <div className="flex-1 mt-5 ml-20">
          <BookingDetails data={previewData} isConfirmed={isConfirmed} />
        </div>

      </div>
    </div>
  );
}