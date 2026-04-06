import Image from "next/image"
import ClockImage from "../../../../public/images/Clock.svg"
import testImage from "../../../../public/images/Avartar.jpg" 

export default function NewsDetailPage() {
  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] py-10">
      <div className="w-full mx-auto px-6 lg:px-10">
        
        <h1 className="rasa-font font-bold text-[30px] md:text-[32px] text-gray-900 leading-tight mb-4">
          Ứng dụng công nghệ cao trong ghép giác mạc tại Trung tâm Mắt BVĐK Hồng Ngọc
        </h1>

        <div className="w-full h-[1px] bg-gray-300 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[600px] border border-gray-100 shadow-sm">
              <Image 
                src={testImage} 
                alt="Chi tiết tin tức"
                fill
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex items-center gap-1 mt-4 text-gray-500 text-[18px] rasa-font">
              <Image src={ClockImage} width={18} height={18} alt="clock"/>
              <span>13-2-2026</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rasa-font text-[20px] leading-relaxed text-justify flex flex-col gap-2">
              <p>
                Tại Trung tâm Mắt BVĐK Hồng Ngọc, kỹ thuật ghép giác mạc đã có bước đột phá khi chuyển dịch từ phương pháp truyền thống sang ghép giác mạc chọn lọc lớp bằng công nghệ Laser. 
                Thay vì thay thế toàn bộ giác mạc như trước đây, các chuyên gia hiện nay tập trung điều trị chọn lọc đúng lớp mô tổn thương (như các kỹ thuật DALK, DSAEK, DMEK, PDEK) để giữ lại tối đa mô lành của bệnh nhân.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}