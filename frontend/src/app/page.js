export default function Home() {
  return (
    <div className="w-full grow rasa-font max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

      {/* Left Column: Text content */}
      <div className="flex flex-col space-y-8 pr-4 lg:pl-5 lg:-mt-5">
        <h1 className="text-[52px] md:text-5xl lg:text-[52px] font-bold leading-none">
          <span className="text-black">Lý do để khách hàng</span>
          <br />
          <span className="text-[#7A78FF]">tin tưởng MediCare?</span>
        </h1>

        <p className="text-gray-700 text-base md:text-[20px] font-medium max-w-130">
          Quy tụ đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm cùng hệ thống trang thiết bị y tế hiện đại nhất, MediCare cam kết mang đến dịch vụ thăm khám chính xác, an toàn và tận tâm. Chúng tôi kết hợp y đức truyền thống với hạ tầng số hóa tiên tiến để bảo vệ sức khỏe của bạn một cách trọn vẹn
        </p>

        <div className="">
          <button className="bg-[#070575] text-white px-12 py-2 rounded-full font-medium hover:bg-[#150a8b] cursor-pointer transition-all duration-200 shadow-md">
            Đặt lịch ngay
          </button>
        </div>
      </div>

      {/* Right Column: Staggered Cards */}
      <div className="flex flex-col relative gap-4 lg:gap-0 lg:pr-5">

        {/* Card 1 */}
        <div className="bg-[#3C50CE] rounded-[30px] text-white py-3.5 px-5.5 lg:self-start lg:-translate-y-2 transition-transform duration-300">
          <h3 className="text-[24px] font-bold">Đội ngũ chuyên gia đầu ngành</h3>
          <p className="text-[20px] opacity-90 leading-6 md:max-w-100 py-0.5">
            Đội ngũ bác sĩ giàu kinh nghiệm, điều trị trực tiếp với phác đồ chuẩn quốc tế
          </p>
          <div className="flex justify-end mt-2">
            <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#424cb8] transition-colors">
              Xem ngay
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#5CA0FF] rounded-[30px] text-white py-3.5 px-5.5 lg:self-end lg:translate-y-5  transition-transform duration-300">
          <h3 className="text-[24px] font-bold">Không ngừng tiến bộ</h3>
          <p className="text-[20px] opacity-90 leading-6 md:max-w-75 py-0.5">
            Luôn cập nhật các tin tức mới nhất về y tế
          </p>
          <div className="flex justify-end mt-2">
            <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#5ea5ff] transition-colors">
              Xem ngay
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#6F82FF] rounded-[30px] text-white py-3.5 px-5.5 lg:self-start lg:-translate-x-20 lg:translate-y-4 transition-transform duration-300">
          <h3 className="text-[24px] font-bold">Thông tin phong phú</h3>
          <p className="text-[20px] opacity-90 leading-6 md:max-w-90 py-0.5">
            Cung cấp từ điển khổng lồ về thông tin của các loại bệnh và các loại thuốc
          </p>
          <div className="flex justify-end mt-2">
            <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#6c7bfa] transition-colors">
              Tra cứu ngay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
