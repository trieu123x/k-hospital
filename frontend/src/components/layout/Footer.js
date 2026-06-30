import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { ROUTES } from "@/routers";

export default function Footer() {
  return (
    <footer className="bg-white py-8 px-6 md:px-12 lg:px-20 rasa-font border-t border-gray-200 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-gray-200">

          {/* Column 1: Logo & Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-3xl font-extrabold tracking-tight flex items-center mb-2">
              <span className="text-[#070575]">Medi</span>
              <span className="text-blue-600">Care</span>
            </Link>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-[17px] leading-relaxed text-gray-600">
                <Phone className="w-5 h-5 text-[#070575] shrink-0 mt-1" />
                <span>
                  <strong className="text-gray-800 block md:inline font-semibold">Liên hệ:</strong>{" "}
                  <a href="tel:1900636555" className="hover:text-blue-600 transition-colors">1900 636 555</a>
                </span>
              </div>

              <div className="flex items-start space-x-3 text-[17px] leading-relaxed text-gray-600">
                <MapPin className="w-5 h-5 text-[#070575] shrink-0 mt-1" />
                <span>
                  <strong className="text-gray-800 block md:inline font-semibold">Địa chỉ:</strong>{" "}
                  Số 55, Phố Yên Ninh, Phường Ba Đình, Thành phố Hà Nội
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Dịch vụ */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[#070575] uppercase tracking-wider mb-6">
              <span className="border-b-2 border-blue-200 pb-1">Dịch vụ</span>
            </h3>
            <ul className="space-y-3.5 text-[17px]">
              <li>
                <Link href={ROUTES.BOOKING} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Emergency Services
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOKING} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Khám tổng quát
                </Link>
              </li>
              <li>
                <Link href={ROUTES.DOCTORS} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Chuyên khoa
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Thông tin */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[#070575] uppercase tracking-wider mb-6">
              <span className="border-b-2 border-blue-200 pb-1">Thông tin</span>
            </h3>
            <ul className="space-y-3.5 text-[17px]">
              <li>
                <Link href={ROUTES.NEWS} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Tin tức & Sự kiện
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Pháp lý */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[#070575] uppercase tracking-wider mb-6">
              <span className="border-b-2 border-blue-200 pb-1">Pháp lý</span>
            </h3>
            <ul className="space-y-3.5 text-[17px]">
              <li>
                <Link href={ROUTES.POLICY} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PROCEDURES} className="text-gray-600 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-300 inline-block">
                  Chính sách & Thủ tục
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[15px] space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} MediCare. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center space-x-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
              <span>Facebook</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors flex items-center space-x-1.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.002 3.002 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Youtube</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center space-x-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>Website</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
