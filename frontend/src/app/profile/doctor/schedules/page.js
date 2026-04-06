"use client";

import { CalendarSidebar } from "../../../../components/appointment/doctor/calendarItem";
import { ShiftItem } from "../../../../components/appointment/doctor/shiftItem";

// MOCK DATA MÔ PHỎNG ẢNH CỦA BẠN
const mockShifts = [
  { id: 1, name: "Ca 1", status: "booked", isUrgent: true, canCancel: false },
  { id: 2, name: "Ca 2", status: "off", isUrgent: false, canCancel: false },
  { id: 3, name: "Ca 3", status: "empty", isUrgent: false, canCancel: false },
  { id: 4, name: "Ca 4", status: "booked", isUrgent: false, canCancel: true },
  { id: 5, name: "Ca 5", status: "empty", isUrgent: false, canCancel: false },
  { id: 6, name: "Ca 6", status: "empty", isUrgent: false, canCancel: false },
  { id: 7, name: "Ca 7", status: "off", isUrgent: false, canCancel: false },
  { id: 8, name: "Ca 8", status: "booked", isUrgent: false, canCancel: true },
  { id: 9, name: "Ca 9", status: "booked", isUrgent: false, canCancel: true },
  { id: 10, name: "Ca 10", status: "empty", isUrgent: false, canCancel: false },
];

export default function DoctorScheduleConfigPage() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen flex justify-center py-10">
      
      {/* Container chính */}
      <div className="w-full max-w-[1200px] px-6 flex flex-col lg:flex-row gap-12">
        
        {/* CỘT TRÁI: Lịch & Chú thích */}
        <CalendarSidebar />

        {/* CỘT PHẢI: Danh sách Ca làm việc */}
        <div className="flex-1">
          <h2 className="font-bold text-[28px] mb-3 rasa-font text-black">Ca làm việc</h2>
          
          <div className="w-full flex flex-col">
            {mockShifts.map((shift) => (
              <ShiftItem key={shift.id} data={shift} />
            ))}
          </div>
          
        </div>

      </div>
    </div>
  );
}