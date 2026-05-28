"use client"

import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { LinkButton } from "../ui/LinkButton";
import { useState, useRef, useEffect } from "react";
import { ROUTES } from "@/routers";
import { useAuthStore } from "@/stores/auth";

export function SideBar({ setSidebarClose = () => { } }) {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isDoctor = useAuthStore(state => state.isDoctor);
  const [isLookUpOpen, setLookUpOpen] = useState(false)
  const [isAdminOpen, setAdminOpen] = useState(false)
  const [isProfileOpen, setProfileOpen] = useState(false)

  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest("#sidebar-menu-btn"))
        return

      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarClose()
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  })

  return (
    <div ref={sidebarRef} className={`
      fixed top-15 bottom-0 w-full z-30 bg-[#070575] 
    text-white rasa-font text-[20px]
      xl:hidden flex flex-col
      transition-all duration-300 ease-in-out
    `}>
      <LinkButton onClick={setSidebarClose} href={ROUTES.HOME}
        className="hover:bg-[#050355] justify-start rounded-none">
        Trang chủ
      </LinkButton>

      <LinkButton onClick={setSidebarClose} href={ROUTES.DOCTORS}
        className="hover:bg-[#050355] justify-start rounded-none">
        Bác sĩ
      </LinkButton>

      <Button
        onClick={() => setLookUpOpen(prev => !prev)}
        className={`justify-between py-2 rounded-none ${isLookUpOpen ? "bg-[#2E2D86]" : "hover:bg-[#050355]"}`}
      >
        <span>Tra cứu</span>
        <ChevronDown className={`size-4 ${isLookUpOpen && "rotate-180"}`} />
      </Button>

      {
        isLookUpOpen &&
        <>
          <LinkButton onClick={setSidebarClose} href={ROUTES.DISEASES}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Bệnh
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.MEDICINES}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Thuốc
          </LinkButton>
        </>
      }

      <LinkButton onClick={setSidebarClose} href={ROUTES.BOOKING}
        className="hover:bg-[#050355] justify-start rounded-none">
        Đặt lịch khám
      </LinkButton>

      <Button
        onClick={() => setProfileOpen(prev => !prev)}
        className={`justify-between py-2 rounded-none ${isProfileOpen ? "bg-[#2E2D86]" : "hover:bg-[#050355]"}`}>
        <span>Trang cá nhân</span>
        <ChevronDown className={`size-4 ${isProfileOpen && "rotate-180"}`} />
      </Button>

      {
        isProfileOpen &&
        <>
          <LinkButton onClick={setSidebarClose} href={ROUTES.PROFILE}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Thông tin cá nhân
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.PROFILE}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            {isDoctor ? "Lịch sử khám bệnh" : "Lịch sử thăm khám"}
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.PROFILE}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            {isDoctor ? "Yêu cầu đã hoàn tất" : "Lịch khám sắp tới"}
          </LinkButton>

          {!isDoctor && <LinkButton onClick={setSidebarClose} href={ROUTES.MEDICAL_RECORD_PENDING}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Yêu cầu chờ phản hồi
          </LinkButton>}

          {isDoctor && <LinkButton onClick={setSidebarClose} href={ROUTES.PROFILE}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Lịch khám bệnh
          </LinkButton>}
        </>
      }

      {
        isAdmin && <Button
          onClick={() => setAdminOpen(prev => !prev)}
          className={`justify-between py-2 rounded-none ${isAdminOpen ? "bg-[#2E2D86]" : "hover:bg-[#050355]"}`}>
          <span>Quản lý</span>
          <ChevronDown className={`size-4 ${isAdminOpen && "rotate-180"}`} />
        </Button>
      }

      {
        isAdminOpen &&
        <>
          <LinkButton onClick={setSidebarClose} href={ROUTES.ADMIN_USERS}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Quản lý tài khoản
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.ADMIN_MEDICINES}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Quản lý thông tin thuốc
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.ADMIN_DISEASES}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Quản lý thông tin bệnh
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.ADMIN_NEWS}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Quản lý tin tức
          </LinkButton>

          <LinkButton onClick={setSidebarClose} href={ROUTES.ADMIN_AGGREGATE}
            className="hover:bg-[#050355] justify-start rounded-none pl-10">
            Tổng kết
          </LinkButton>
        </>
      }
    </div>
  )
}