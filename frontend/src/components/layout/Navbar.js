"use client";

import { ChevronDown, Menu, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "../ui/LinkButton";
import { Button } from "../ui/Button";
import Image from "next/image";
import { NotificationForm } from "../notification/form";
import { ROUTES } from "@/routers";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

export default function Navbar({ setSidebarOpen = () => { } }) {
  const isLogin = useAuthStore(state => state.isLogin);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const [isLookUpOpen, setLookUpOpen] = useState(false);
  const [isNotiOpen, setNotiOpen] = useState(false);
  const lookUpRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest("#lookup-btn")) return;
      if (lookUpRef.current && !lookUpRef.current.contains(event.target)) {
        setLookUpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed h-15 w-full bg-[#070575] z-30 shadow-md">
      <div className="max-w-[1536px] mx-auto h-full flex items-center justify-between px-4 md:px-8 xl:px-12 text-white">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <LinkButton href={ROUTES.HOME} className="text-[26px] font-bold">
            <span className="text-white">Medi</span>
            <span className="text-blue-300">Care</span>
          </LinkButton>
        </div>

        {/* Center Links - desktop only */}
        <div className="hidden xl:flex items-center space-x-8 text-[18px]">
          <LinkButton href={ROUTES.HOME}>Trang chủ</LinkButton>
          <LinkButton href={ROUTES.DOCTORS}>Bác sĩ</LinkButton>

          <Button
            id="lookup-btn"
            onClick={() => setLookUpOpen(!isLookUpOpen)}
            className="relative"
          >
            <span>Tra cứu</span>
            <ChevronDown className={`size-3 transition-transform ${isLookUpOpen && "rotate-180"}`} />
            {isLookUpOpen && (
              <div
                ref={lookUpRef}
                className="absolute top-[140%] z-20 bg-[#070575] rounded-xl overflow-hidden flex flex-col text-[12px]"
              >
                <LinkButton href={ROUTES.DISEASES} className="hover:bg-[#3040A8] rounded-none px-12 py-2">
                  Bệnh
                </LinkButton>
                <LinkButton href={ROUTES.MEDICINES} className="hover:bg-[#3040A8] rounded-none px-12 py-2">
                  Thuốc
                </LinkButton>
              </div>
            )}
          </Button>

          <LinkButton href={ROUTES.NEWS}>Tin tức</LinkButton>
          <LinkButton href={ROUTES.BOOKING}>Đặt lịch khám</LinkButton>
          {isAdmin && (
            <LinkButton href={ROUTES.ADMIN} className="text-white">Quản lý</LinkButton>
          )}
        </div>

        {/* Right side - always visible, responsive internally */}
        <div className="flex items-center shrink-0">
          {isLogin ? (
            <RightLogin
              setSidebarOpen={setSidebarOpen}
              isNotiOpen={isNotiOpen}
              setNotiOpen={setNotiOpen}
            />
          ) : (
            <RightGuest setSidebarOpen={setSidebarOpen} />
          )}
        </div>

      </div>
    </nav>
  );
}

// ─── Logged-in right section ────────────────────────────────────────────────
function RightLogin({ setSidebarOpen, isNotiOpen, setNotiOpen }) {
  const notifications = useNotificationStore(state => state.notifications);
  const hasUnread = notifications?.some(noti => !noti.isRead);

  return (
    <div className="flex   items-center gap-2">
      {/* Bell */}
      <div
        onClick={() => setNotiOpen(prev => !prev)}
        className="relative cursor-pointer hover:bg-[#3040A8] transition-all duration-300 p-1.5 rounded-full"
      >
        {hasUnread && (
          <div className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white z-10" />
        )}
        <Bell className="size-6 text-white" />
        <NotificationForm isOpen={isNotiOpen} />
      </div>

      {/* Avatar */}
      <div className="size-9 rounded-full overflow-hidden cursor-pointer mr-2">
        <Image width={40} height={40} src="/images/Avartar.jpg" alt="avatar" />
      </div>

      {/* Hamburger - mobile only */}
      <button
        id="sidebar-menu-btn"
        className="xl:hidden ml-1"
        onClick={setSidebarOpen}
      >
        <Menu className="w-6 h-6 text-white cursor-pointer" />
      </button>
    </div>
  );
}

// ─── Guest right section ────────────────────────────────────────────────────
function RightGuest({ setSidebarOpen }) {
  return (
    <div className="flex items-center gap-3">
      {/* Login button - always visible */}
      <LinkButton
        href={ROUTES.LOGIN}
        className="border border-[#8482F1] text-[#8482F1] hover:border-[#5C59FF] hover:text-[#5C59FF] py-1.5"
      >
        Đăng nhập
      </LinkButton>

      {/* Register button - always visible */}
      <LinkButton
        href={ROUTES.REGISTER}
        className="bg-[#0a0068] hover:bg-[#150a8b] text-white py-1.5"
      >
        Đăng ký
      </LinkButton>

      {/* Hamburger - mobile only */}
      <button
        id="sidebar-menu-btn"
        className="xl:hidden"
        onClick={setSidebarOpen}
      >
        <Menu className="w-6 h-6 text-white cursor-pointer" />
      </button>
    </div>
  );
}
