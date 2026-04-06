"use client";

import { useState, useMemo } from "react";
import FilterImage from "../../../../../../public/images/Filter.svg"
import { UpcomingAppointmentItem } from "../../../../../components//medicalRecord//upcomingItem.js" 
import Image from "next/image";

// DATA GIẢ LẬP ĐÃ CẬP NHẬT THÊM TRẠNG THÁI (status)
const mockUpcomingRecords = [
  {
    id: 1,
    department: "Tai mũi họng",
    doctor: "TTND.PGS.TS.BS - Nguyễn Xuân Hùng",
    date: "21-03-2026",
    timestamp: new Date("2026-03-21T10:00:00").getTime(), 
    shift: "Ca 4 (10h - 11h)",
    location: "Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội",
    status: "ongoing" // Trạng thái: Đang diễn ra
  },
  {
    id: 2,
    department: "Tai mũi họng",
    doctor: "TTND.PGS.TS.BS - Nguyễn Xuân Hùng",
    date: "21-03-2026",
    timestamp: new Date("2026-03-21T11:00:00").getTime(),
    shift: "Ca 4 (10h - 11h)",
    location: "Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội",
    status: "urgent" // Trạng thái: GẤP
  },
  {
    id: 3,
    department: "Tai mũi họng",
    doctor: "TTND.PGS.TS.BS - Nguyễn Xuân Hùng",
    date: "21-03-2026",
    timestamp: new Date("2026-03-21T14:00:00").getTime(),
    shift: "Ca 4 (10h - 11h)",
    location: "Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội",
    status: "normal" // Trạng thái: Bình thường (có nút Hủy)
  }
];

export default function UpcomingAppointmentsPage() {
  const [filterOption, setFilterOption] = useState("newest");

  const displayedRecords = useMemo(() => {
    let result = [...mockUpcomingRecords]; 

    if (filterOption === "newest") {
      result.sort((a, b) => b.timestamp - a.timestamp); 
    } else if (filterOption === "oldest") {
      result.sort((a, b) => a.timestamp - b.timestamp); 
    } else if (filterOption === "tai_mui_hong") {
      result = result.filter(record => record.department === "Tai mũi họng");
    }

    return result;
  }, [filterOption]);

  return (
    <div className="w-full bg-[#FBFBFB] p-6 lg:p-10 min-h-screen flex justify-center">
      <div className="w-full">
        
        <div className="flex items-center gap-3 mb-6 rasa-font text-[20px]">
          <Image
            src={FilterImage}
            alt="Filter"
            height={20}
            width={20}
          />
          <span className="font-bold">Bộ lọc:</span>
          
          <select 
            className="border border-gray-300 bg-white px-3 py-1.5 rounded-md text-[15px] outline-none cursor-pointer focus:border-blue-500"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="newest">Ngày khám: Gần đây nhất</option>
            <option value="oldest">Ngày khám: Cũ nhất</option>
            <option value="tai_mui_hong">Chỉ khoa: Tai mũi họng</option>
          </select>
        </div>

        <div className="w-full max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
          {displayedRecords.length > 0 ? (
            displayedRecords.map((record) => (
              <UpcomingAppointmentItem key={record.id} data={record} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 italic rasa-font">
              Không có lịch hẹn sắp tới nào.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}