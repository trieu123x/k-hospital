"use client"

import { LinkButton } from "@/components/ui/LinkButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { SelectBox } from "@/components/ui/SelectBox";
import { Table } from "@/components/ui/Table";
import { Filter } from "lucide-react";
import { useState } from "react";

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "15%" },
  { key: "medicineType", label: "Loại thuốc", width: "120px" },
  { key: "ingredients", label: "Thành phần" },
  { key: "dosage", label: "Liều lượng" },
  { key: "usageInstruction", label: "Hướng dẫn sử dụng" },
  { key: "sideEffects", label: "Tác dụng phụ" },
  { key: "action", label: "Xóa tài khoản", mode: "del", width: "120px" },
]

const TABLE_DATAS = [
  {
    name: "Paracetamol 500mg",
    medicineType: "Giảm đau, hạ sốt",
    ingredients: "Paracetamol 500mg, Tá dược vừa đủ",
    dosage: "1-2 viên/lần, không quá 8 viên/ngày",
    usageInstruction: "Uống sau khi ăn, các liều cách nhau ít nhất 4-6 tiếng.",
    sideEffects: "Phát ban, buồn nôn, tổn thương gan (nếu dùng quá liều)."
  },
  {
    name: "Amoxicillin 500mg",
    medicineType: "Kháng sinh",
    ingredients: "Amoxicillin trihydrate 500mg",
    dosage: "1 viên/lần, 2-3 lần/ngày",
    usageInstruction: "Uống ngay trước hoặc sau bữa ăn để giảm thiểu đau dạ dày. Phải uống đủ liều bác sĩ kê.",
    sideEffects: "Tiêu chảy, mẩn ngứa, dị ứng nổi mề đay."
  },
  {
    name: "Omeprazole 20mg",
    medicineType: "Trị đau dạ dày",
    ingredients: "Omeprazole 20mg",
    dosage: "1 viên/ngày",
    usageInstruction: "Uống nguyên viên với nước trước bữa ăn sáng 30 phút. Không nhai hoặc nghiền nát.",
    sideEffects: "Đau đầu, đầy hơi, buồn nôn, táo bón."
  },
  {
    name: "Vitamin C Sủi 1000mg",
    medicineType: "Thực phẩm chức năng",
    ingredients: "Acid Ascorbic 1000mg, Kẽm",
    dosage: "1 viên/ngày",
    usageInstruction: "Hòa tan 1 viên vào 200ml nước lọc, uống vào buổi sáng sau khi ăn no.",
    sideEffects: "Rối loạn tiêu hóa, loét dạ dày (nếu uống lúc đói)."
  },
  {
    name: "Cetirizine 10mg",
    medicineType: "Kháng histamin",
    ingredients: "Cetirizine hydrochloride 10mg",
    dosage: "1 viên/ngày",
    usageInstruction: "Uống vào buổi tối trước khi đi ngủ vì thuốc có thể gây buồn ngủ.",
    sideEffects: "Buồn ngủ, khô miệng, chóng mặt nhẹ."
  }
];

export default function Medicines() {
  const [option, setOption] = useState(null)

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="flex h-15 px-10 items-end justify-between">
      <div className="flex items-center gap-1">
        <Filter className="w-6 h-6 flex-none" />
        <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
        <SelectBox placeholder="Loại thuốc" value={option}
          onChange={(value) => setOption(value)}
          options={["Tất cả", "Uống", "Ngậm", "Bôi"]} />
      </div>

      <div className="flex items-center gap-2">
        <LinkButton href={"/admin/medicines/detail"} className={`
          bg-[#070575] hover:bg-[#08069b] text-white 
          rounded-[10px] font-light 
        `}>
          Thêm
        </LinkButton>
        <SearchInput className="w-95 py-1" />
      </div>
    </div>

    <div className="px-10 pt-3 pb-4">
      <Table columns={TABLE_COLUMNS} data={TABLE_DATAS}
        className="max-h-155"
        rowClassName="even:bg-white odd:bg-[#F1F4FF]" />
    </div>

    <div className="px-10 flex">
      <span className="font-bold italic text-[#1100CD] text-[12px]">
        Tổng số {TABLE_DATAS.length}
      </span>
    </div>
  </div>
}