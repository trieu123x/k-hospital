import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { ROUTES } from "@/routers";

export default function Footer() {
  return (
    <footer className={`
    bg-white h-15 px-10 rasa-font
      border-t border-gray-100 z-30
      flex flex-col lg:flex-row lg:items-center justify-between
    `}>
      <div className="flex flex-col lg:flex-row lg:gap-5">
        {/* Left: Contact Info */}
        <div className="flex items-center space-x-2">
          <Phone strokeWidth={2} className="w-4 h-4" />
          <span>Liên hệ: 1900 636 555</span>
        </div>

        {/* Center: Address */}
        <div className="flex items-center space-x-2 text-center">
          <MapPin strokeWidth={2} className="w-4 h-4" />
          <span>Địa chỉ: Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội</span>
        </div>
      </div>

      {/* Right: Links */}
      <div className="flex space-x-12 mx-auto justify-end mb-6 text-[18px]">
        <Link href={ROUTES.POLICY} className="hover:underline">
          Chính sách bảo mật
        </Link>
        <Link href={ROUTES.PROCEDURES} className="hover:underline">
          Thủ tục khám bệnh
        </Link>
      </div>
    </footer>
  );
}
