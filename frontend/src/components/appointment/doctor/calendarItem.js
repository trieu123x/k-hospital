import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarSidebar() {
  return (
    <div className="w-full lg:w-[320px] flex flex-col gap-8 rasa-font">
      
      {/* COMPONENT LỊCH */}
      <div className="border border-[#0B1460] bg-white w-full">
        {/* Header Lịch */}
        <div className="bg-[#0B1460] text-white flex items-center justify-between p-3">
          <ChevronLeft className="w-5 h-5 cursor-pointer" />
          <span className="font-bold text-[16px]">Tháng 3, 2026</span>
          <ChevronRight className="w-5 h-5 cursor-pointer" />
        </div>

        {/* Thân Lịch */}
        <div className="p-4">
          {/* Hàng ngày trong tuần */}
          <div className="grid grid-cols-7 text-center font-bold text-[14px] mb-4 text-black">
            <div>Th2</div><div>Th3</div><div>Th4</div><div>Th5</div><div>Th6</div><div>Th7</div><div>CN</div>
          </div>
          
          {/* Lưới ngày (Mock data mô phỏng ảnh) */}
          <div className="grid grid-cols-7 text-center text-[14px] gap-y-4 items-center">
            {/* Tuần 1 */}
            <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
            {/* Tuần 2 (Có ngày 11 viền xanh) */}
            <div>8</div><div>9</div><div>10</div>
            <div className="flex justify-center"><div className="w-8 h-8 flex items-center justify-center border border-[#7DA7FF] rounded-full text-[#7DA7FF]">11</div></div>
            <div>12</div><div>13</div><div>14</div>
            {/* Tuần 3 */}
            <div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div>
            {/* Tuần 4 (Có ngày 25 nền xanh) */}
            <div>22</div><div>23</div><div>24</div>
            <div className="flex justify-center"><div className="w-8 h-8 flex items-center justify-center bg-[#5A67D8] text-white rounded-full">25</div></div>
            <div>26</div><div>27</div><div>28</div>
            {/* Tuần 5 */}
            <div>28</div><div>30</div><div>31</div><div className="text-gray-300">1</div><div className="text-gray-300">2</div><div className="text-gray-300">3</div><div className="text-gray-300">4</div>
          </div>
        </div>
      </div>

      {/* COMPONENT BẢNG CHÚ THÍCH */}
      <div>
        <h3 className="font-bold text-[18px] mb-2 text-black">Chú thích</h3>
        <table className="w-full border-collapse text-center text-[14px]">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-white">Ca</th>
              <th className="border border-black p-2 bg-white">Khung giờ</th>
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
            ].map((item) => (
              <tr key={item.ca}>
                <td className="border border-black p-1">{item.ca}</td>
                <td className="border border-black p-1">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}