"use client"

import { HorizontalBarChart, KpiCard, VerticalBarChart } from "@/components/admin/dashboardWidget"
import { AggregateForm } from "@/components/admin/form"
import { Button } from "@/components/ui/Button"
import { CalendarSelectBox } from "@/components/ui/CalendarSelectBox"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"

const VERTICAL_DATA = [
  { label: "1", value: 120 },
  { label: "2", value: 110 },
  { label: "3", value: 99 },
  { label: "4", value: 90 },
  { label: "5", value: 85 },
  { label: "6", value: 40 },
  { label: "7", value: 32 },
  { label: "8", value: 30 },
  { label: "9", value: 12 },
  { label: "10", value: 20 },
]

const HORIZONTAL_DATA = [
  { label: "Hen suyễn", value: 48382, color: "#2E2BB5" },
  { label: "Hen suyễn", value: 38023, color: "#4A47F6" },
  { label: "Hen suyễn", value: 28304, color: "#5E5CF7" },
  { label: "Hen suyễn", value: 12035, color: "#6C6BF8" },
  { label: "Hen suyễn", value: 6203, color: "#8E8CFB" },
  { label: "Hen suyễn", value: 5920, color: "#8E8CFB" },
  { label: "Hen suyễn", value: 5383, color: "#8E8CFB" },
  { label: "Hen suyễn", value: 3284, color: "#A8AAF2" },
  { label: "Hen suyễn", value: 805, color: "#A8AAF2" },
  { label: "Khác", value: 100, color: "#C8C9CC" },
]

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

export default function Aggregate() {
  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="flex h-15 px-10 items-end justify-between">
      <div className="flex items-center gap-1">
        <Filter className="w-6 h-6 flex-none" />
        <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
        <CalendarSelectBox placeholder="Ngày bắt đầu" />
        <CalendarSelectBox placeholder="Ngày kết thúc" />
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          className={`
          w-full flex items-center justify-between cursor-pointer
          border border-gray-300 rounded-[4px] 
          px-2 py-1 text-[14px] focus:outline-none
        `}>
          <span className="flex-1 text-left truncate">30 ngày gần đây</span>
        </Button>

        <Button
          className={`
          w-full flex items-center justify-between cursor-pointer
          border border-gray-300 rounded-[4px] 
          px-2 py-1 text-[14px] focus:outline-none
        `}>
          <span className="flex-1 text-left truncate">7 ngày gần đây</span>
        </Button>

        <Button
          className={`
          w-full flex items-center justify-between cursor-pointer
          border border-gray-300 rounded-[4px] 
          px-2 py-1 text-[14px] focus:outline-none
        `}>
          <span className="flex-1 text-left truncate">1 ngày gần đây</span>
        </Button>
      </div>
    </div>

    <div className="grow px-10 py-3 grid grid-cols-5 grid-rows-[repeat(6,140px)] gap-2">
      <div className="row-start-1 col-start-1">
        <AggregateForm title={"Tổng sự kiện"}>
          <KpiCard value="120" />
        </AggregateForm>
      </div>
      <div className="row-start-2 col-start-1">
        <AggregateForm title={"Tổng truy cập"}>
          <KpiCard value="120" />
        </AggregateForm>
      </div>
      <div className="row-start-3 col-start-1">
        <AggregateForm title={"Tổng phiên chat"}>
          <KpiCard value="120" />
        </AggregateForm>
      </div>

      <div className="row-start-1 col-start-2 row-span-3 col-span-2">
        <AggregateForm title={"Ca khám cao điểm"}>
          <span className="absolute top-2 right-2 text-[12px]">Đơn vị: lịch đặt khám</span>
          <VerticalBarChart data={VERTICAL_DATA} />
        </AggregateForm>
      </div>

      <div className="row-start-1 col-start-4 row-span-3 col-span-2">
        <AggregateForm title={"Top chủ đề chat"}>
          <span className="absolute bottom-2 right-2 text-[12px]">Đơn vị: phiên chat</span>
          <HorizontalBarChart data={HORIZONTAL_DATA} />
        </AggregateForm>
      </div>

      <div className="row-start-4 row-span-3 col-start-1 col-span-5">
        <AggregateForm title={"Bảng xếp hạng quan tâm (top 10)"}>
          <div className="absolute top-2 right-4 flex rounded-full text-white gap-1">
            <Button className="text-[13px] bg-[#8080F8] rounded-[10px]">Bác sĩ</Button>
            <Button className="text-[13px] bg-[#A6A6C8] hover:bg-[#b9b9cd] rounded-[10px]">Bệnh</Button>
          </div>

          <Table data={TABLE_DATAS} columns={TABLE_COLUMNS}
            className="px-2 absolute top-13 h-90"
            headerClassName="[box-shadow:inset_0_-1px_0_black] bg-white text-black"
          />
        </AggregateForm>
      </div>
    </div>
  </div>
}