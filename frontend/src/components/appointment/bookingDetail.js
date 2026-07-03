import Image from "next/image";
import DoctorAvatar from "../../../public/images/Avartar.jpg";
import { ROUTES } from "@/routers";
import Link from "next/link";
import { da } from "date-fns/locale";

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
    <div className="w-full h-full flex flex-col p-3 lg:px-12 rasa-font text-gray-900">

      <h2 className={`font-bold text-[28px] mb-2 ${isConfirmed ? "text-green-600" : "text-black"}`}>
        {isConfirmed ? "Đặt lịch thành công! Chi tiết thông tin:" : "Chi tiết thông tin đăng ký:"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 rasa-font text-[20px]">
        <div>Chuyên khoa: <strong>{data.specialtyName || "---"}</strong></div>
        <div>Bác sĩ: <strong>{data.doctorName || "---"}</strong></div>

        <div className="md:col-span-2">Ngày khám: <strong>{data.date ? new Date(data.date).toLocaleDateString("vi-VN") : "---"}</strong></div>
        <div className="md:col-span-2">Ca khám: <strong>{formatShift(data.shift)}</strong></div>

        <div className="md:col-span-2 leading-relaxed">
          Địa điểm khám: <strong>Phòng 401, Tầng 5, Số 55, Phố Yên Ninh</strong>
        </div>

        <div className="md:col-span-2 mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
          <span className="text-gray-600 block mb-1">Lý do khám:</span>
          <strong>{data.reason || "Chưa nhập lý do"}</strong>
        </div>
      </div>

      {data.doctorId && (
        <div className="mt-8 flex justify-center w-full">
          <div className="w-[220px] shadow-[0_0_4px_rgba(144,144,144,0.25)] flex flex-col rounded-md overflow-hidden">
            <div className="h-[252px] bg-[#F5F5F5] relative w-full">
              <Image
                src={data.doctorAvatar || DoctorAvatar}
                fill
                className="object-cover"
                alt="Doctor"
                onError={(e) => {
                  e.currentTarget.srcset = "";
                  e.currentTarget.src = "/images/Avartar.jpg";
                }}
              />
            </div>
            <div className="px-3 py-2 flex flex-col">
              <h3 className="rasa-font font-bold text-[20px] leading-none">
                {data.doctorName}
              </h3>
              <p className="rasa-font text-[14px] text-gray-600">Chuyên khoa: {data.specialtyName}</p>
              <div className="mt-auto text-center pt-2">
                <Link
                  href={`${ROUTES.DOCTORS}/${data.doctorId}`}
                  className="text-blue-500 text-[11px] italic hover:text-blue-700 hover:underline underline-offset-2"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}