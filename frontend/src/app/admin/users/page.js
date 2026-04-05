"use client"

import { LinkButton } from "@/components/ui/LinkButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { SelectBox } from "@/components/ui/SelectBox";
import { Table } from "@/components/ui/Table";
import { Filter } from "lucide-react";
import { useState } from "react";

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "25%" },
  { key: "phone", label: "Số điện thoại", width: "180px" },
  { key: "email", label: "Email" },
  { key: "role", label: "Vai trò", width: "150px" },
  { key: "isBlocked", label: "Chặn tài khoản", mode: "tick", width: "130px" },
  { key: "action", label: "Xóa tài khoản", mode: "del", width: "120px" },
]

const TABLE_DATAS = [
  { id: 1, name: "Nguyễn Hải Tùng", phone: "0987654321", email: "tung.nguyen@gmail.com", role: "quản trị viên", isBlocked: false },
  { id: 2, name: "Trần Thị Mai", phone: "0912345678", email: "mai.tran.88@gmail.com", role: "bác sĩ", isBlocked: true },
  { id: 3, name: "Lê Văn Hoàng", phone: "0901234567", email: "hoangle.dev@yahoo.com", role: "bác sĩ", isBlocked: false },
  { id: 4, name: "Phạm Thu Hương", phone: "0934567890", email: "huong.pham9x@gmail.com", role: "bác sĩ", isBlocked: false },
  { id: 5, name: "Hoàng Minh Trí", phone: "0976543210", email: "tri.hoang.minh@outlook.com", role: "bác sĩ", isBlocked: true },
  { id: 6, name: "Vũ Đại Dương", phone: "0888123456", email: "duongvu.ocean@gmail.com", role: "bác sĩ", isBlocked: false },
  { id: 7, name: "Đặng Mỹ Linh", phone: "0867890123", email: "linh.dang.my@gmail.com", role: "bác sĩ", isBlocked: false },
  { id: 8, name: "Bùi Xuân Phát", phone: "0923456789", email: "phat.bui@hotmail.com", role: "bác sĩ", isBlocked: true },
  { id: 9, name: "Đỗ Bảo Trâm", phone: "0945678901", email: "tram.do.bao@gmail.com", role: "bác sĩ", isBlocked: false },
  { id: 10, name: "Hồ Việt Anh", phone: "0967890123", email: "vietanh.ho@company.vn", role: "người dùng", isBlocked: false },
  { id: 11, name: "Ngô Nhật Minh", phone: "0981234567", email: "minh.ngo.nhat@gmail.com", role: "người dùng", is0Blocked: false },
  { id: 12, name: "Dương Ngọc Yến", phone: "0913456789", email: "yen.duong@yahoo.com.vn", role: "người dùng", isBlocked: true },
  { id: 13, name: "Lý Tiến Đạt", phone: "0909876543", email: "dat.ly.tien@gmail.com", role: "người dùng", isBlocked: false },
  { id: 14, name: "Đoàn Thanh Bình", phone: "0938765432", email: "binh.doan.thanh@gmail.com", role: "người dùng", isBlocked: false },
  { id: 15, name: "Trương Quang Khải", phone: "0971234987", email: "khai.truong@outlook.com", role: "người dùng", isBlocked: true },
  { id: 16, name: "Đinh Thu Thảo", phone: "0889988776", email: "thao.dinh.thu@gmail.com", role: "người dùng", isBlocked: false },
  { id: 17, name: "Lâm Gia Hưng", phone: "0865432109", email: "hung.lam.gia@gmail.com", role: "người dùng", isBlocked: false },
  { id: 18, name: "Phùng Tuấn Kiệt", phone: "0921122334", email: "kiet.phung@company.com", role: "người dùng", isBlocked: true },
  { id: 19, name: "Mai Kiều Oanh", phone: "0943344556", email: "oanh.mai.kieu@gmail.com", role: "người dùng", isBlocked: false },
  { id: 20, name: "Châu Ngọc Anh", phone: "0965566778", email: "anh.chau.ngoc@yahoo.com", role: "bác sĩ", isBlocked: false },
]

export default function User() {
  const [option, setOption] = useState(null)

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="flex h-15 px-10 items-end justify-between">
      <div className="flex items-center gap-1">
        <Filter className="w-6 h-6 flex-none" />
        <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
        <SelectBox placeholder="Vai trò" value={option}
          onChange={(value) => setOption(value)}
          options={["admin", "doctor", "user"]} />
      </div>

      <div className="flex items-center gap-2">
        <LinkButton href={"/admin/users/detail"} className={`
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