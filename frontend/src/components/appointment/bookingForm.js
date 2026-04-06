"use client";

import { useState } from "react";

export function BookingForm({ onConfirm }) {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  return (
    <div className="w-full h-full flex flex-col p-4 lg:p-8 bg-[FBFBFB]">
      
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-1">
          <label className="rasa-font font-bold text-[24px] text-black">Họ và tên</label>
          <input 
            type="text" 
            placeholder="Nhập họ và tên của bạn"
            className="w-full border border-gray-300 px-3 py-2 text-[15px] text-gray-800 outline-none focus:border-[#0B1460] bg-white rasa-font placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="rasa-font font-bold text-[24px] text-black">Chuyên khoa</label>
          <select defaultValue="" className="w-full border border-gray-300 px-3 py-2 text-[15px] text-gray-500 outline-none focus:border-[#0B1460] bg-white rasa-font cursor-pointer">
            <option value="" disabled hidden>Lựa chọn khoa khám</option>
            <option value="mat">Khoa Mắt</option>
            <option value="noi">Khoa Nội</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="rasa-font font-bold text-[24px] text-black">Bác sĩ</label>
          <select 
            className="w-full border border-gray-300 px-3 py-2 text-[15px] text-gray-800 outline-none focus:border-[#0B1460] bg-white rasa-font cursor-pointer"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="" disabled hidden>Lựa chọn bác sĩ khám</option>
            <option value="hung">TTND.PGS.TS.BS - Nguyễn Xuân Hùng</option>
            <option value="bs2">Thạc sĩ, Bác sĩ Trần Thị B</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="rasa-font font-bold text-[24px] text-black">Ngày khám</label>
          <select defaultValue="" className="w-full border border-gray-300 px-3 py-2 text-[15px] text-gray-500 outline-none focus:border-[#0B1460] bg-white rasa-font cursor-pointer">
            <option value="" disabled hidden>Lựa chọn ngày khám: dd/mm/yy</option>
            <option value="today">Hôm nay</option>
            <option value="tomorrow">Ngày mai</option>
          </select>
        </div>

        {selectedDoctor && (
          <div className="flex flex-col gap-1">
            <label className="rasa-font font-bold text-[24px] text-black">Ca khám</label>
            <select defaultValue="" className="w-full border border-gray-300 px-3 py-2 text-[15px] text-gray-500 outline-none focus:border-[#0B1460] bg-white rasa-font cursor-pointer">
              <option value="" disabled hidden>Lựa chọn ca khám</option>
              <option value="sang">Sáng (07:30 - 11:30)</option>
              <option value="chieu">Chiều (13:30 - 17:00)</option>
            </select>
          </div>
        )}

      </div>

      <div className="pt-60 flex justify-end">
        <button 
          onClick={onConfirm}
          className="bg-[#0B1460] hover:bg-[#152085] transition-colors text-white rasa-font px-8 py-2 rounded-[20px] text-[15px]"
        >
          Xác nhận
        </button>
      </div>

    </div>
  )
}