"use client";

export function ShiftItem({ data }) {
  // Trạng thái bật/tắt của công tắc (Lấy từ data, sau này có thể dùng useState nếu muốn click đổi trạng thái ngay lập tức)
  const isToggleOn = data.status !== "off"; 

  // Hàm chọn màu cho các Badge trạng thái
  const getBadgeStyle = (status) => {
    switch (status) {
      case "booked":
        return "bg-[#7DA7FF] text-white"; // Xanh dương
      case "empty":
        return "bg-[#6B7280] text-white"; // Xám đậm
      case "off":
        return "bg-[#D1D5DB] text-gray-700"; // Xám nhạt
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getBadgeText = (status) => {
    switch (status) {
      case "booked": return "Có lịch khám";
      case "empty": return "Trống";
      case "off": return "Nghỉ";
      default: return "";
    }
  };

  return (
    <div className={`w-full flex items-center justify-between p-4 mb-3 rounded-lg border border-gray-200 rasa-font
      ${data.status === "off" ? "bg-[#F3F4F6]" : "bg-white"} shadow-sm`}
    >
      
      {/* PHẦN BÊN TRÁI: Tên ca + Toggle + Cảnh báo GẤP */}
      <div className="flex items-center gap-6">
        <span className="font-bold text-[16px] w-[40px]">{data.name}</span>
        
        {/* Nút Toggle tự chế bằng Tailwind */}
        <div className={`w-11 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors duration-300
          ${isToggleOn ? "bg-[#6EE7B7]" : "bg-gray-300"}`}
        >
          {/* Cục tròn bên trong Toggle */}
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300
            ${isToggleOn ? "translate-x-5" : "translate-x-0"}`} 
          />
        </div>

        {/* Chữ GẤP! (Nếu có) */}
        {data.isUrgent && (
          <span className="text-red-500 font-bold italic text-[16px]">GẤP!</span>
        )}
      </div>

      {/* PHẦN BÊN PHẢI: Trạng thái + Nút Hủy */}
      <div className="flex items-center gap-4">
        {/* Badge trạng thái */}
        <div className={`px-4 py-1 rounded-full text-[14px] ${getBadgeStyle(data.status)}`}>
          {getBadgeText(data.status)}
        </div>

        {/* Nút Hủy (Chỉ hiện khi có lịch và cho phép hủy) */}
        {data.status === "booked" && data.canCancel ? (
          <button className="text-red-500 border border-red-500 rounded-full w-8 h-8 flex items-center justify-center text-[12px] hover:bg-red-50 transition-colors">
            Hủy
          </button>
        ) : (
          // Khối div trống để giữ layout không bị giật khi ca khác có nút Hủy
          <div className="w-8 h-8"></div> 
        )}
      </div>

    </div>
  );
}