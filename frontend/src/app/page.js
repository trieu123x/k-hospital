import Image from "next/image";

import { Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Left Column: Text content */}
        <div className="flex flex-col space-y-8 pr-0 lg:pr-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            <span className="text-gray-900">Lý do để khách hàng</span>
            <br />
            <span className="text-[#6474fb]">tin tưởng MediCare?</span>
          </h1>
          
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
            Quy tụ đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm cùng hệ thống trang thiết bị y tế hiện đại nhất, MediCare cam kết mang đến dịch vụ thăm khám chính xác, an toàn và tận tâm. Chúng tôi kết hợp y đức truyền thống với hạ tầng số hóa tiên tiến để bảo vệ sức khỏe của bạn một cách trọn vẹn
          </p>

          <div>
            <button className="bg-[#0a0068] text-white px-8 py-3 rounded-full font-medium hover:bg-[#150a8b] transition-all shadow-md">
              Đặt lịch ngay
            </button>
          </div>
        </div>

        {/* Right Column: Staggered Cards */}
        <div className="flex flex-col space-y-8 relative">
          
          {/* Card 1 */}
          <div className="bg-[#424cb8] text-white p-6 md:p-8 rounded-[2rem] shadow-xl w-full md:w-[85%] self-start lg:ml-12 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-3">Đội ngũ chuyên gia đầu ngành</h3>
            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 pr-4">
              Đội ngũ bác sĩ giàu kinh nghiệm, điều trị trực tiếp với phác đồ chuẩn quốc tế
            </p>
            <div className="flex justify-end mt-2">
              <button className="text-xs font-semibold px-4 py-1.5 rounded-full border border-white hover:bg-white hover:text-[#424cb8] transition-colors">
                Xem ngay
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#5ea5ff] text-white p-6 md:p-8 rounded-[2rem] shadow-xl w-full md:w-[75%] self-end lg:mr-4 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-3">Không ngừng tiến bộ</h3>
            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4">
              Luôn cập nhật các tin tức mới nhất về y tế
            </p>
            <div className="flex justify-end mt-2">
              <button className="text-xs font-semibold px-4 py-1.5 rounded-full border border-white hover:bg-white hover:text-[#5ea5ff] transition-colors">
                Xem ngay
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#6c7bfa] text-white p-6 md:p-8 rounded-[2rem] shadow-xl w-full md:w-[85%] self-start lg:ml-[-1rem] lg:-mt-6 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-3">Thông tin phong phú</h3>
            <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4 pr-10">
              Cung cấp từ điển khổng lồ về thông tin của các loại bệnh và các loại thuốc
            </p>
            <div className="flex justify-end mt-2">
              <button className="text-xs font-semibold px-4 py-1.5 rounded-full border border-white hover:bg-white hover:text-[#6c7bfa] transition-colors">
                Tra cứu ngay
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Chatbot */}
      <button className="fixed bottom-8 right-8 bg-[#6c8fff] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#5b7cee] transition-all z-50">
        <Bot className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </button>
    </div>
  );
}
