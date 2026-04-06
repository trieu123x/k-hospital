export function DoctorAppointmentItem({ data }) {
  // 1. Logic chọn màu viền dựa theo trạng thái
  let borderColor = "border-gray-300"; // Mặc định (Normal)
  if (data.status === "ongoing") borderColor = "border-[#7DA7FF]"; // Đang diễn ra (Xanh)
  if (data.status === "urgent") borderColor = "border-[#FF7F8E]"; // Gấp (Đỏ)

  return (
    <div className={`w-full border ${borderColor} bg-white p-5 flex flex-col lg:flex-row mb-4 rasa-font text-[16px]`}>
      
      {/* CỘT TRÁI: Thông tin bệnh nhân & Nút xác nhận */}
      <div className="w-full lg:w-1/2 flex flex-col gap-1 lg:border-r border-gray-200 pr-6 relative">
        
        {/* Chữ "Đang diễn ra!" nằm ở góc trên bên phải của CỘT TRÁI */}
        {data.status === "ongoing" && (
          <div className="absolute top-0 right-6 text-[#5A95FF] font-bold italic text-[20px]">
            Đang diễn ra!
          </div>
        )}

        <div>Chuyên khoa: <strong>{data.department}</strong></div>
        <div>Người khám: <strong>{data.patientName}</strong></div>
        <div>Số điện thoại liên hệ: <strong>{data.phone}</strong></div>
        <div>Ngày khám: <strong>{data.date}</strong></div>
        <div>Ca khám: <strong>{data.shift}</strong></div>

        {/* Nút "Xác nhận hoàn tất" nằm ở góc dưới bên phải của CỘT TRÁI */}
        {data.status === "ongoing" && (
          <div className="flex justify-end mt-4">
            <button className="border border-[#7DA7FF] text-[#5A95FF] text-[13px] px-6 py-1 rounded-full hover:bg-blue-50 transition-colors">
              Xác nhận hoàn tất
            </button>
          </div>
        )}
      </div>

      {/* CỘT PHẢI: Khung nhập chẩn đoán */}
      <div className="w-full lg:w-1/2 flex flex-col pl-6 relative mt-4 lg:mt-0">
        
        {/* Chữ "GẤP!" nằm ở góc trên cùng bên phải của CỘT PHẢI */}
        {data.status === "urgent" && (
          <div className="absolute top-0 right-0 text-red-600 font-bold italic text-[20px]">
            GẤP!
          </div>
        )}

        {/* Nội dung chẩn đoán */}
        <div className="text-gray-800">
          Chẩn đoán:{" "}
          <span className="text-gray-500 italic">
            {data.diagnosisMsg}
          </span>
        </div>
        
      </div>

    </div>
  );
}