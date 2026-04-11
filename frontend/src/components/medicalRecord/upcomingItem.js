"use client";

export function UpcomingAppointmentItem({ data, onCancel }) {
  let borderColor = "border-gray-300"; 
  if (data.status === "ongoing") borderColor = "border-[#7DA7FF]"; 
  if (data.status === "urgent") borderColor = "border-[#FF0000]";

  return (
    <div className={`w-full border ${borderColor} bg-white p-5 flex flex-col lg:flex-row mb-4 rasa-font text-[16px]`}>

      <div className="w-full lg:w-1/2 flex flex-col gap-1 lg:border-r border-gray-200 pr-6 relative">
        
        {data.status === "ongoing" && (
          <div className="absolute top-0 right-6 text-[#5F97FF] rasa-font font-bold italic text-[24px]">
            Đang diễn ra!
          </div>
        )}

        <div>Chuyên khoa: <strong>{data.department}</strong></div>
        <div>Bác sĩ: <strong>{data.doctor}</strong></div>
        <div>Ngày khám: <strong>{data.date}</strong></div>
        <div>Ca khám: <strong>{data.shift}</strong></div>
        <div>Địa điểm khám: <strong>{data.location}</strong></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-between pl-6 relative mt-4 lg:mt-0">
        
        {data.status === "urgent" && (
          <div className="absolute top-0 right-0 text-[#FF0000] rasa-font font-bold italic text-[24px]">
            GẤP!
          </div>
        )}

        <div className="text-gray-800">
          Chẩn đoán:{" "}
          <span className="text-gray-500 italic">
            {data.status === "ongoing" ? "Chờ bác sĩ ghi nhận" : "chưa có"}
          </span>
        </div>

        {data.status === "normal" && (
          <div className="flex justify-end mt-8">
            <button 
              onClick={onCancel} 
              className="border border-red-500 text-red-500 text-[14px] px-8 py-1 rounded-full hover:bg-red-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        )}
        
      </div>

    </div>
  );
}