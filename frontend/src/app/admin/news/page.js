"use client"

import { CalendarSelectBox } from "@/components/ui/CalendarSelectBox";
import { LinkButton } from "@/components/ui/LinkButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Table } from "@/components/ui/Table";
import { Filter } from "lucide-react";

const TABLE_COLUMNS = [
  { key: "title", label: "Tiêu đề", width: "30%" },
  { key: "content", label: "Nội dung" },
  { key: "release", label: "Ngày xuất bản", width: "120px" },
  { key: "action", label: "Xóa tin tức", mode: "del", width: "120px" },
]

const TABLE_DATAS = [
  {
    id: 1,
    title: "Khám phá xu hướng công nghệ 2026",
    content: "Trí tuệ nhân tạo tiếp tục dẫn đầu xu hướng phát triển phần mềm trên toàn thế giới, mở ra nhiều cơ hội mới.",
    release: "05/04/2026"
  },
  {
    id: 2,
    title: "Dự báo thời tiết cuối tuần này",
    content: "Khu vực Bắc Bộ đón đợt không khí lạnh mới kèm theo mưa phùn, nhiệt độ giảm sâu vào ban đêm.",
    release: "03/04/2026"
  },
  {
    id: 3,
    title: "Cảnh báo thủ đoạn lừa đảo trực tuyến",
    content: "Các đối tượng tinh vi sử dụng đường link giả mạo để chiếm đoạt tài khoản mạng xã hội của người dùng.",
    release: "02/04/2026"
  },
  {
    id: 4,
    title: "Khai mạc giải bóng đá vô địch quốc gia",
    content: "Trận đấu mở màn diễn ra vô cùng kịch tính tại chảo lửa Mỹ Đình với 3 bàn thắng được ghi ngay trong hiệp 1.",
    release: "01/04/2026"
  },
  {
    id: 5,
    title: "Báo cáo tăng trưởng kinh tế quý 1",
    content: "GDP tăng trưởng ổn định nhờ sự phục hồi mạnh mẽ của ngành dịch vụ, du lịch và xuất khẩu nông sản.",
    release: "31/03/2026"
  },
  {
    id: 6,
    title: "Triển lãm ô tô điện lớn nhất năm",
    content: "Hàng loạt mẫu xe điện thông minh với thiết kế đến từ tương lai đang được trưng bày tại trung tâm triển lãm.",
    release: "30/03/2026"
  },
  {
    id: 7,
    title: "Hội thảo giáo dục số toàn quốc",
    content: "Các chuyên gia giáo dục hàng đầu thảo luận về việc ứng dụng công nghệ thực tế ảo (VR) vào giảng dạy trực tuyến.",
    release: "28/03/2026"
  },
  {
    id: 8,
    title: "Kinh nghiệm du lịch tự túc tiết kiệm",
    content: "Tổng hợp các mẹo săn vé máy bay 0 đồng, đặt phòng khách sạn ưu đãi và lên lịch trình linh hoạt.",
    release: "25/03/2026"
  },
  {
    id: 9,
    title: "Phát hiện loài sinh vật biển mới",
    content: "Các nhà sinh vật học vừa công bố phát hiện một loài sứa phát sáng kỳ lạ chưa từng được ghi nhận dưới đáy đại dương.",
    release: "22/03/2026"
  },
  {
    id: 10,
    title: "Ra mắt thư viện UI mới cho React",
    content: "Cộng đồng lập trình viên đang xôn xao với bộ UI Kit mới giúp xây dựng giao diện tối ưu hiệu suất chỉ trong vài phút.",
    release: "20/03/2026"
  }
]

export default function News() {
  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="flex h-15 px-10 items-end justify-between">
      <div className="flex items-center gap-1">
        <Filter className="w-6 h-6 flex-none" />
        <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
        <CalendarSelectBox placeholder="Ngày xuất bản" />
      </div>

      <div className="flex items-center gap-2">
        <LinkButton href={"/admin/news/detail"} className={`
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