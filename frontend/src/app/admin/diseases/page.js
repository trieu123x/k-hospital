"use client"

import { LinkButton } from "@/components/ui/LinkButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { SelectBox } from "@/components/ui/SelectBox";
import { Table } from "@/components/ui/Table";
import { Filter } from "lucide-react";
import { useState } from "react";

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "15%" },
  { key: "specialty", label: "Chuyên khoa", width: "180px" },
  { key: "description", label: "Mô tả" },
  { key: "symptoms", label: "Triệu chứng", width: "220px" },
  { key: "homeTreatment", label: "Cách xử lý tại nhà", width: "220px" },
  { key: "action", label: "Xóa tài khoản", mode: "del", width: "120px" },
]

const TABLE_DATAS = []

export default function Diseases() {
  const [option, setOption] = useState(null)

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="flex h-15 px-10 items-end justify-between">
      <div className="flex items-center gap-1">
        <Filter className="w-6 h-6 flex-none" />
        <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
        <SelectBox placeholder="Chuyên khoa" value={option}
          onChange={(value) => setOption(value)}
          options={["Tất cả", "Tai mũi họng", "Phụ khoa", "Răng hàm mặt"]} />
      </div>

      <div className="flex items-center gap-2">
        <LinkButton href={"/admin/diseases/detail"} className={`
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