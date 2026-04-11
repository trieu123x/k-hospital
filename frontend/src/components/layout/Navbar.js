"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "../ui/LinkButton";
import { Button } from "../ui/Button";
import { Bell } from "lucide-react";
import Image from "next/image";
import { NotificationForm } from "../notification/form";
import { ROUTES } from "@/routers";
import { useAuthStore } from "@/stores/auth";

export default function Navbar({ setSidebarOpen = () => { } }) {
  const isLogin = useAuthStore(state => state.isLogin);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const [isLookUpOpen, setLookUpOpen] = useState(false)
  const [isNotiOpen, setNotiOpen] = useState(false)
  const lookUpRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest("#lookup-btn"))
        return

      if (lookUpRef.current && !lookUpRef.current.contains(event.target)) {
        setLookUpOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

  return (
    <nav className="fixed h-15 w-full bg-white z-20">
      <div className="flex h-full xl:justify-between bg-[#070575] xl:bg-transparent">
        <div className={`
          xl:bg-[#070575] xl:rounded-br-full 
          text-white w-full h-full 
          flex items-center justify-between
        `}>
          {/* Logo */}
          <div className="flex items-center ml-13">
            <LinkButton href={ROUTES.HOME} className="text-[26px] font-bold">
              <span className="text-white">Medi</span>
              <span className="text-blue-800">Care</span>
            </LinkButton>
          </div>

          {/* Center Links */}
          <div className={`hidden xl:flex items-center space-x-5 text-[20px] ${isAdmin ? "mr-[12%]" : "mr-[18%]"}`}>
            <LinkButton href={ROUTES.HOME}>
              Trang chủ
            </LinkButton>

            <LinkButton href={ROUTES.DOCTORS}>
              Bác sĩ
            </LinkButton>

            <Button id="lookup-btn"
              onClick={() => { setLookUpOpen(!isLookUpOpen) }} className="relative">
              <span>Tra cứu</span>
              <ChevronDown className={`size-3 ${isLookUpOpen && "rotate-180"}`} />
              {
                isLookUpOpen &&
                <div ref={lookUpRef}
                  className={`absolute top-[140%] z-20
                  bg-[#070575] rounded-xl overflow-hidden 
                  flex flex-col text-[12px]
                `}>
                  <LinkButton href={ROUTES.DISEASES} className="hover:bg-[#3040A8] rounded-none px-12 py-2">
                    Bệnh
                  </LinkButton>
                  <LinkButton href={ROUTES.MEDICINES} className="hover:bg-[#3040A8] rounded-none px-12 py-2">
                    Thuốc
                  </LinkButton>
                </div>
              }
            </Button>

            <LinkButton href={ROUTES.NEWS}>
              Tin tức
            </LinkButton>

            <LinkButton href={ROUTES.BOOKING}>
              Đặt lịch khám
            </LinkButton>

            {isAdmin && <LinkButton href={ROUTES.ADMIN}>
              Quản lý
            </LinkButton>}
          </div>

          {/* Mobile Right Nav (Responsive) */}
          {
            isLogin ?
              <LoginOption2 setSidebarOpen={setSidebarOpen} isNotiOpen={isNotiOpen} setNotiOpen={setNotiOpen} /> :
              <UnLoginOption2 setSidebarOpen={setSidebarOpen} />
          }
        </div>

        {/* Right Buttons Desktop */}
        {
          isLogin ?
            <LoginOption1 isNotiOpen={isNotiOpen} setNotiOpen={setNotiOpen} /> :
            <UnLoginOption1 />
        }
      </div>
    </nav>);
}

function UnLoginOption1() {
  return <div className="hidden xl:flex w-1/5 justify-center items-center gap-4">
    <LinkButton
      href={ROUTES.LOGIN}
      className={`py-1.5
        border border-[#8482F1] text-[#8482F1] 
        hover:border-[#5C59FF] hover:text-[#5C59FF]
      `}
    >
      Đăng nhập
    </LinkButton>

    <LinkButton href={ROUTES.REGISTER} className="bg-[#0a0068] hover:bg-[#150a8b] text-white py-1.5">
      Đăng ký
    </LinkButton>
  </div>
}

function UnLoginOption2({ setSidebarOpen }) {
  return <div className="flex xl:hidden items-center gap-3.5 mr-5">
    <LinkButton href={ROUTES.LOGIN} className="border border-white">
      Đăng nhập
    </LinkButton>
    <LinkButton href={ROUTES.REGISTER} className="bg-white text-[#070575]">
      Đăng ký
    </LinkButton>
    <button id="sidebar-menu-btn" onClick={setSidebarOpen}>
      <Menu className="w-6.5 h-6.5 text-white cursor-pointer" />
    </button>
  </div>
}

function LoginOption1({ isNotiOpen, setNotiOpen }) {
  return <div className="hidden xl:flex w-1/5 justify-end items-center gap-2">
    <div className="relative cursor-pointer hover:bg-[#E8E8E8] transition-all duration-300 p-2 rounded-full">
      <Bell onClick={() => setNotiOpen(prev => !prev)} className="size-6" />
      {isNotiOpen && <NotificationForm />}
    </div>

    <div className="size-9 rounded-full overflow-hidden cursor-pointer mr-6">
      <Image width={40} height={40} src={"/images/Avartar.jpg"} alt="" />
    </div>
  </div>
}

function LoginOption2({ setSidebarOpen, isNotiOpen, setNotiOpen }) {
  return <div className="flex xl:hidden items-center gap-3.5 mr-5">
    <div className="relative cursor-pointer hover:bg-[#bdbddf] transition-all duration-300 p-2 ml-2 rounded-full">
      <Bell onClick={() => setNotiOpen(prev => !prev)} className="size-6" />
      {isNotiOpen && <NotificationForm />}
    </div>

    <div className="size-9 rounded-full overflow-hidden cursor-pointer">
      <Image width={40} height={40} src={"/images/Avartar.jpg"} alt="" />
    </div>

    <button id="sidebar-menu-btn" onClick={setSidebarOpen}>
      <Menu className="w-6.5 h-6.5 text-white cursor-pointer" />
    </button>
  </div>
}
