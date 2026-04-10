"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarSidebar({ value, onChange }) {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(value || new Date());

  const year = currentDisplayDate.getFullYear();
  const month = currentDisplayDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const today = new Date();
  
  const MAX_MONTHS_AHEAD = 2; 
  
  const currentMonthBoundary = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonthBoundary = new Date(today.getFullYear(), today.getMonth() + MAX_MONTHS_AHEAD, 1);
  const displayMonthBoundary = new Date(year, month, 1);

  const isPrevDisabled = displayMonthBoundary <= currentMonthBoundary; 
  const isNextDisabled = displayMonthBoundary >= maxMonthBoundary;     

  const handlePrevMonth = () => {
    if (!isPrevDisabled) setCurrentDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    if (!isNextDisabled) setCurrentDisplayDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(year, month, day);
    if (onChange) onChange(newDate);
  };

  const renderDays = () => {
    const days = [];
    
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-gray-300">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = value && value.getDate() === i && value.getMonth() === month && value.getFullYear() === year;
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
      
      const currentDateObj = new Date(year, month, i);
      const isPast = currentDateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      days.push(
        <div 
          key={`current-${i}`} 
          className={`flex justify-start ${isPast ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`} 
          onClick={() => !isPast && handleSelectDate(i)} 
        >
          <div className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-all 
            ${isSelected ? "bg-[#5A67D8] text-white font-bold" : 
              isToday ? "border-2 border-[#7DA7FF] text-[#7DA7FF]" : 
              isPast ? "text-gray-400" : "text-black hover:bg-gray-100"}`}
          >
            {i}
          </div>
        </div>
      );
    }

    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="text-gray-300">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full lg:w-[420px] flex flex-col gap-2 rasa-font mr-auto">
      
      <div className="border border-[#0B1460] bg-white w-full shadow-sm">
        <div className="bg-[#0B1460] text-white flex items-center justify-between p-1">
          <ChevronLeft 
            className={`w-6 h-6 ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:text-gray-300"}`} 
            onClick={handlePrevMonth} 
          />
          
          <span className="font-bold text-[18px]">
            Tháng {month + 1}, {year}
          </span>
          
          <ChevronRight 
            className={`w-6 h-6 ${isNextDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:text-gray-300"}`} 
            onClick={handleNextMonth} 
          />
        </div>

        <div className="p-5">
          <div className="grid grid-cols-7 text-center font-bold text-[16px] mb-5 text-black">
            <div>Th2</div><div>Th3</div><div>Th4</div><div>Th5</div><div>Th6</div><div>Th7</div><div>CN</div>
          </div>
          
          <div className="grid grid-cols-7 text-center text-[16px] gap-y-5 items-center">
            {renderDays()}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[20px] mb-3 text-black">Chú thích</h3>
        <table className="w-full border-collapse text-center text-[16px] bg-white shadow-sm">
          <thead>
            <tr>
              <th className="border border-black p-3 bg-gray-50">Ca</th>
              <th className="border border-black p-3 bg-gray-50">Khung giờ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { ca: 1, time: "7:00-8:00" },
              { ca: 2, time: "8:00-9:00" },
              { ca: 3, time: "9:00-10:00" },
              { ca: 4, time: "10:00-11:00" },
              { ca: 5, time: "11:00-12:00" },
              { ca: 6, time: "13:00-14:00" },
              { ca: 7, time: "14:00-15:00" },
              { ca: 8, time: "15:00-16:00" },
              { ca: 9, time: "16:00-17:00" },
              { ca: 10, time: "17:00-18:00" },
              { ca: 11, time: "18:00-19:00" },
              { ca: 12, time: "19:00-20:00" }
            ].map((item) => (
              <tr key={item.ca}>
                <td className="border border-black p-2">{item.ca}</td>
                <td className="border border-black p-2">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}