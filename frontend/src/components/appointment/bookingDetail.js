import Image from "next/image";
import DoctorAvatar from "../../../public/images/Avartar.jpg"; 

export function BookingDetails({ isConfirmed }) {
  
  // TRẠNG THÁI 1: Chưa xác nhận (Làm giống hệt ảnh mới của bạn)
  if (!isConfirmed) {
    return (
      <div className="w-full h-full flex flex-col p-6 lg:px-12 rasa-font text-gray-900">
        
        {/* Tiêu đề vẫn giữ nguyên ở góc trên */}
        <h2 className="rasa-font font-bold text-[28px]">Chi tiết thông tin</h2>
        
        {/* Dùng flex-1 để chiếm toàn bộ chiều cao còn lại, đẩy chữ vào giữa */}
        <div className="flex-1 flex items-center justify-center">
          <p className="rasa-font text-[24px] text-gray-500 italic">
            Bạn chưa điền thông tin để hiển thị
          </p>
        </div>
        
      </div>
    );
  }

  // TRẠNG THÁI 2: Đã xác nhận (Giữ nguyên như cũ)
  return (
    <div className="w-full h-full flex flex-col p-6 lg:px-12 rasa-font text-gray-900">
      
      <h2 className="font-bold text-[24px] mb-8">Chi tiết thông tin</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-8 rasa-font text-[20px]">
        <div>Chuyên khoa: <strong>Răng hàm mặt</strong></div>
        <div>Họ và tên: <strong>Đinh Tiến Tùng</strong></div>
        
        <div>Chi phí thăm khám: <strong>520.000 vnd</strong></div>
        <div>Email: <strong>ns********@gmail.com</strong></div>
        
        <div>Bác sĩ: <strong>TTND.PGS.TS.BS - Nguyễn Xuân Hùng</strong></div>
        <div>Số điện thoại: <strong>0123456789</strong></div>
        
        <div className="md:col-span-2 mt-2">Ngày khám: <strong>21-03-2026</strong></div>
        <div className="md:col-span-2">Ca khám: <strong>Ca 4 (10h - 11h)</strong></div>
        <div className="md:col-span-2 leading-relaxed">
          Địa điểm khám: <strong>Phòng 401, Tầng 5, Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội</strong>
        </div>
      </div>

      <div className="mt-12 flex justify-center w-full">
        <div className="w-[250px] border border-gray-100 shadow-sm bg-white flex flex-col rounded-md overflow-hidden">
          
          <div className="h-[250px] bg-[#F5F5F5] relative w-full">
            <Image 
              src={DoctorAvatar} 
              fill 
              className="object-cover object-top" 
              alt="Doctor"
            />
          </div>
          
          <div className="p-2 flex flex-col items-center text-center gap-1">
            <h3 className="rasa-font font-bold text-[16px]">PGS.TS.BS - Hà Kim Trung</h3>
            <p className="rasa-font text-[14px] text-gray-600">Chuyên khoa: Tai mũi họng</p>
            <a href="#" className="text-blue-600 text-[13px] underline underline-offset-2 mt-1">
              Xem chi tiết
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}