import Image from "next/image";
import DoctorAvatar from "../../../public/images/Avartar.jpg"; 

export function BookingDetails({ data, isConfirmed }) {
  
  const hasStartedTyping = data && (data.specialtyId || data.date || data.reason);

  if (!hasStartedTyping) {
    return (
      <div className="w-full h-full flex flex-col p-6 lg:px-12 rasa-font text-gray-900">
        <h2 className="rasa-font font-bold text-[28px]">Chi tiết thông tin</h2>
        <div className="flex-1 flex items-center justify-center">
          <p className="rasa-font text-[24px] text-gray-500 italic">
            Bạn chưa điền thông tin để hiển thị
          </p>
        </div>
      </div>
    );
  }

  const formatShift = (shiftNum) => {
    if (!shiftNum) return "---";
    const startHour = 6 + parseInt(shiftNum);
    return `Ca ${shiftNum} (${startHour}h - ${startHour + 1}h)`;
  };

  return (
    <div className="w-full h-full flex flex-col p-6 lg:px-12 rasa-font text-gray-900">
      
      <h2 className={`font-bold text-[24px] mb-8 ${isConfirmed ? "text-green-600" : "text-black"}`}>
        {isConfirmed ? "🎉 Đặt lịch thành công! Chi tiết thông tin:" : "Chi tiết thông tin đăng ký:"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 rasa-font text-[20px]">
        <div>Chuyên khoa: <strong>{data.specialtyName || "---"}</strong></div>
        <div>Bác sĩ: <strong>{data.doctorName || "---"}</strong></div>
        
        <div className="md:col-span-2">Ngày khám: <strong>{data.date ? new Date(data.date).toLocaleDateString("vi-VN") : "---"}</strong></div>
        <div className="md:col-span-2">Ca khám: <strong>{formatShift(data.shift)}</strong></div>
        
        <div className="md:col-span-2 mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
          <span className="text-gray-600 block mb-1">Lý do khám:</span>
          <strong>{data.reason || "Chưa nhập lý do"}</strong>
        </div>

        <div className="md:col-span-2 mt-2 leading-relaxed">
          Địa điểm khám: <strong>Phòng 401, Tầng 5, Số 55, Phố Yên Ninh</strong>
        </div>
      </div>

      {data.doctorId && (
        <div className="mt-8 flex justify-center w-full">
          <div className="w-[250px] border border-gray-100 shadow-sm bg-white flex flex-col rounded-md overflow-hidden">
            <div className="h-[250px] bg-[#F5F5F5] relative w-full">
              <Image src={DoctorAvatar} fill className="object-cover object-top" alt="Doctor" />
            </div>
            <div className="p-2 flex flex-col items-center text-center gap-1">
              <h3 className="rasa-font font-bold text-[16px] text-center">
                {data.doctorName}
              </h3>
              <p className="rasa-font text-[14px] text-gray-600">Chuyên khoa: {data.specialtyName}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}