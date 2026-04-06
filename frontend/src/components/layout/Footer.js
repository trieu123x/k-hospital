import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className={`
    bg-white h-11 px-10 rasa-font
      border-t border-gray-100 z-10
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
      <div className="flex items-center space-x-6 text-blue-600">
        <Link href="/policy" className="hover:underline">
          Chính sách
        </Link>
        <Link href="/procedures" className="hover:underline">
          Thủ tục
        </Link>
      </div>
    </footer>
  );
}
