"use client";

import { useState, useMemo } from "react";
import FilterImage from "../../../../../public/images/Filter.svg"
import { MedicalRecordItem } from "../../../../components/medicalRecord/medicalRecordItem";
import Image from "next/image";

const mockRecords = [
  {
    id: 1,
    department: "Tai mũi họng",
    doctor: "TTND.PGS.TS.BS - Nguyễn Xuân Hùng",
    date: "21-03-2026",
    timestamp: new Date("2026-03-21").getTime(), 
    shift: "Ca 4 (10h - 11h)",
    location: "Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội",
    diagnosis: "Bệnh nhân hiện đang gặp tình trạng sưng đau vùng góc hàm trái, há miệng hạn chế (~2cm), vùng lợi phủ răng 38 sưng tấy đỏ và có dấu hiệu rỉ mủ khi ấn nhẹ do răng mọc lệch gây giắt thức ăn và viêm nhiễm cục bộ. Căn cứ trên lâm sàng, chẩn đoán xác định bệnh nhân bị Viêm lợi trùm/Viêm quanh cuống răng 38 (Mã ICD-10: K05.2) ở trạng thái mọc lệch ngầm độ II. Hướng điều trị trước mắt là bơm rửa sát khuẩn túi lợi tại chỗ, kết hợp sử dụng đơn thuốc gồm kháng sinh, giảm đau và nước súc miệng."
  },
  {
    id: 2,
    department: "Răng hàm mặt",
    doctor: "Thạc sĩ, Bác sĩ Trần Thị B",
    date: "15-02-2026",
    timestamp: new Date("2026-02-15").getTime(),
    shift: "Ca 1 (07h30 - 08h30)",
    location: "Phòng 202, Tầng 2, Số 55, Phố Yên Ninh, Hà Nội",
    diagnosis: "Bệnh nhân đến khám định kỳ. Phát hiện sâu men răng 46, chưa có dấu hiệu viêm tủy. Đã tiến hành hàn trám thẩm mỹ bằng Composite."
  },
  {
    id: 3,
    department: "Tai mũi họng",
    doctor: "TTND.PGS.TS.BS - Nguyễn Xuân Hùng",
    date: "02-01-2026",
    timestamp: new Date("2026-01-02").getTime(),
    shift: "Ca 6 (14h - 15h)",
    location: "Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Hà Nội",
    diagnosis: "Bệnh nhân viêm amidan hốc mủ mạn tính. Kê đơn điều trị nội khoa 7 ngày."
  }
];

export default function MedicalHistoryPage() {
  const [filterOption, setFilterOption] = useState("newest");

  const displayedRecords = useMemo(() => {
    let result = [...mockRecords]; 

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
              <MedicalRecordItem key={record.id} data={record} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 italic rasa-font">
              Không tìm thấy hồ sơ khám bệnh nào phù hợp.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}