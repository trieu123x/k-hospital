"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      <nav className=" flex md:justify-between bg-[#070575] md:bg-transparent px-4 py-3 md:px-0 md:py-0">
      <div className="md:bg-[#070575] md:rounded-br-[999px] text-white md:px-2 md:py-4 w-full md:w-3/4 flex items-center justify-between md:place-content-around">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold font-serif whitespace-nowrap">
          <span className="text-white">Medi</span>
          <span className="text-blue-800" style={{ color: "#3a4ce0" }}>Care</span>
        </Link>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link href="/" className="hover:text-blue-300 transition-colors">
          Trang chủ
        </Link>
        <Link href="/doctors" className="hover:text-blue-300 transition-colors">
          Bác sĩ
        </Link>
        <div className="group cursor-pointer flex items-center hover:text-blue-300 transition-colors">
          <span>Tra cứu</span>
          <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </div>
        <Link href="/news" className="hover:text-blue-300 transition-colors">
          Tin tức
        </Link>
        <Link href="/booking" className="hover:text-blue-300 transition-colors">
          Đặt lịch khám
        </Link>
      </div>

      {/* Mobile Right Nav (Responsive) */}
      <div className="flex md:hidden items-center space-x-2 text-xs font-medium">
        <Link href="/login" className="px-3 py-1.5 border border-white text-white rounded-full">
          Đăng nhập
        </Link>
        <Link href="/register" className="px-3 py-1.5 bg-white text-[#070575] rounded-full">
          Đăng ký
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6 text-white ml-1" />
        </button>
      </div>
</div>
      {/* Right Buttons Desktop */}
      <div className="hidden md:flex w-1/4 justify-center items-center space-x-4 text-sm font-medium">
        <Link
          href="/login"
          className="px-6  py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-200 hover:text-[#0b0c2a] transition-all"
        >
          Đăng nhập
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-[#0a0068] text-white rounded-full hover:bg-[#150a8b] transition-all shadow-sm"
        >
          Đăng ký
        </Link>
      </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#070575] text-white font-medium absolute top-full left-0 w-full z-50 flex flex-col shadow-lg">
          <Link href="/" className="px-6 py-4 bg-[#050355] border-t border-[#100e70] hover:bg-[#050355]">
            Trang chủ
          </Link>
          <Link href="/doctors" className="px-6 py-4 border-t border-[#100e70] hover:bg-[#050355]">
            Bác sĩ
          </Link>
          <div className="px-6 py-4 border-t border-[#100e70] hover:bg-[#050355] flex justify-between items-center cursor-pointer">
            <span>Tra cứu</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
          <Link href="/booking" className="px-6 py-4 border-t border-[#100e70] hover:bg-[#050355]">
            Đặt lịch khám
          </Link>
          <div className="px-6 py-4 border-t border-[#100e70] hover:bg-[#050355] flex justify-between items-center cursor-pointer">
            <span>Quản lý</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
