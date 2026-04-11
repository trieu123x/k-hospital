"use client";

export function ShiftItem({ data, onToggle, onCancel }) {
  const isToggleOn = data.status !== "off"; 

  const getBadgeStyle = (status) => {
    switch (status) {
      case "booked": return "bg-[#7DA7FF] text-white";
      case "empty": return "bg-[#6B7280] text-white";
      case "off": return "bg-[#D1D5DB] text-gray-700";
      default: return "bg-gray-200 text-gray-700";
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
    <div className="w-full flex items-center gap-3 mb-3 rasa-font">
      
      <div className={`flex-1 flex items-center justify-between p-4 rounded-lg border border-gray-200 
        ${data.status === "off" ? "bg-[#F3F4F6]" : "bg-white"} shadow-sm transition-colors`}
      >
        <div className="flex items-center gap-6">
          <span className="font-bold text-[16px] w-[50px]">{data.name}</span>
          
          <div 
            onClick={() => onToggle(data)}
            className={`w-11 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors duration-300
            ${isToggleOn ? "bg-[#6EE7B7]" : "bg-gray-300"}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300
              ${isToggleOn ? "translate-x-5" : "translate-x-0"}`} 
            />
          </div>

          {data.isUrgent && (
            <span className="text-red-500 font-bold italic text-[16px]">GẤP!</span>
          )}
        </div>

        <div className={`px-4 py-1.5 rounded-full text-[14px] min-w-[110px] text-center ${getBadgeStyle(data.status)}`}>
          {getBadgeText(data.status)}
        </div>
      </div>

      {data.status === "booked" ? (
        <button 
          onClick={() => onCancel(data)} 
          className="text-red-500 border border-red-500 bg-white rounded-full min-w-[64px] h-[25px] cursor-pointer flex items-center justify-center text-[13px] hover:bg-red-50 transition-colors shadow-sm"
        >
          Hủy
        </button>
      ) : (
        <div className="min-w-[64px] h-[36px]"></div> 
      )}

    </div>
  );
}