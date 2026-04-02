import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-6 px-10 border-t border-gray-100 text-sm font-medium">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
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

        {/* Right: Links */}
        <div className="flex items-center space-x-6 text-blue-600">
          <Link href="/policy" className="hover:underline">
            Chính sách
          </Link>
          <Link href="/procedures" className="hover:underline">
            Thủ tục
          </Link>
        </div>
        
      </div>
    </footer>
  );
}
