"use client";

import { ChevronDown, Menu, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "../ui/LinkButton";
import { Button } from "../ui/Button";
import Link from "next/link";
import { NotificationForm } from "../notification/form";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { supabase } from "@/utils/supabase";

// ======================================================================
// COMPONENT: TỰ CẮT ẢNH BẰNG TRÌNH DUYỆT (CANVAS) DỰA TRÊN CROP-DATA
// ======================================================================
function CroppedAvatar({ rawAvatarUrl, cropData, className }) {
  const [displayUrl, setDisplayUrl] = useState(rawAvatarUrl);

  useEffect(() => {
    let isMounted = true;

    const generateLogo = async () => {
      if (!rawAvatarUrl || !cropData) return;

      // 1. Chuyển đổi thành Link public của Supabase nếu cần
      let fullUrl = rawAvatarUrl;
      if (fullUrl && !fullUrl.startsWith("http") && !fullUrl.startsWith("/")) {
        fullUrl = supabase.storage.from("avatars").getPublicUrl(fullUrl).data.publicUrl;
      }

      // 2. Parse JSON an toàn
      let parsedData = cropData;
      if (typeof parsedData === 'string') {
        try { parsedData = JSON.parse(parsedData); } catch (e) { }
      }
      if (typeof parsedData === 'string') {
        try { parsedData = JSON.parse(parsedData); } catch (e) { }
      }

      // 3. Nếu không có tọa độ cắt, dùng ảnh gốc
      if (!parsedData || !parsedData.width) {
        if (isMounted) setDisplayUrl(fullUrl);
        return;
      }

      // 4. Dùng trình duyệt để "Cắt nóng" ảnh bằng Canvas
      const img = new window.Image();
      img.crossOrigin = "anonymous"; // Vượt rào CORS của Supabase

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = parsedData.width;
        canvas.height = parsedData.height;
        const ctx = canvas.getContext('2d');

        // Vẽ đúng vùng đã cắt
        ctx.drawImage(
          img,
          parsedData.x, parsedData.y, parsedData.width, parsedData.height,
          0, 0, parsedData.width, parsedData.height
        );

        // Chuyển thành Base64 và hiển thị
        if (isMounted) {
          setDisplayUrl(canvas.toDataURL('image/jpeg'));
        }
      };

      img.onerror = () => {
        console.error("Lỗi tải ảnh để crop trên Navbar");
        if (isMounted) setDisplayUrl(fullUrl); // Lỗi thì fallback về ảnh gốc
      };

      img.src = fullUrl;
    };

    generateLogo();

    return () => {
      isMounted = false; // Chống memory leak
    };
  }, [rawAvatarUrl, cropData]);

  return <img src={displayUrl} alt="Avatar" className={className} />;
}

// ======================================================================
// NAVBAR COMPONENT CHÍNH
// ======================================================================
export default function Navbar({ setSidebarOpen = () => { } }) {
  const isLogin = useAuthStore(state => state.isLogin)
  const isAdmin = useAuthStore(state => state.isAdmin)
  const [isLookUpOpen, setLookUpOpen] = useState(false)
  const [isNotiOpen, setNotiOpen] = useState(false)
  const lookUpRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest("#lookup-btn")) return

      if (lookUpRef.current && !lookUpRef.current.contains(event.target)) {
        setLookUpOpen(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  return (
    <nav className="fixed h-15 w-full bg-white z-30">
      <div className="flex h-full xl:justify-between bg-[#070575] xl:bg-transparent">
        <div className={`xl:bg-[#070575] xl:rounded-br-full text-white w-full h-full flex items-center justify-between`}>
          <div className="flex items-center ml-13">
            <LinkButton href="/" className="text-[26px] font-bold">
              <span className="text-white">Medi</span>
              <span className="text-blue-800">Care</span>
            </LinkButton>
          </div>

          <div className={`hidden xl:flex items-center space-x-5 text-[20px] ${isAdmin ? "mr-[12%]" : "mr-[18%]"}`}>
            <LinkButton href="/">Trang chủ</LinkButton>
            <LinkButton href="/doctors">Bác sĩ</LinkButton>

            <Button id="lookup-btn" onClick={() => { setLookUpOpen(!isLookUpOpen) }} className="relative">
              <span>Tra cứu</span>
              <ChevronDown className={`size-3 ${isLookUpOpen && "rotate-180"}`} />
              {isLookUpOpen &&
                <div ref={lookUpRef} className={`absolute top-[140%] z-20 bg-[#070575] rounded-xl overflow-hidden flex flex-col text-[12px]`}>
                  <LinkButton href="/diseases" className="hover:bg-[#3040A8] rounded-none px-12 py-2">Bệnh</LinkButton>
                  <LinkButton href="/medicines" className="hover:bg-[#3040A8] rounded-none px-12 py-2">Thuốc</LinkButton>
                </div>
              }
            </Button>

            <LinkButton href="/news">Tin tức</LinkButton>
            <LinkButton href="/appointment">Đặt lịch khám</LinkButton>
            {isAdmin && <LinkButton href="/admin/aggregate">Quản lý</LinkButton>}
          </div>

          {isLogin ?
            <LoginOption2 setSidebarOpen={setSidebarOpen} isNotiOpen={isNotiOpen} setNotiOpen={setNotiOpen} /> :
            <UnLoginOption2 setSidebarOpen={setSidebarOpen} />
          }
        </div>

        {isLogin ?
          <LoginOption1 isNotiOpen={isNotiOpen} setNotiOpen={setNotiOpen} /> :
          <UnLoginOption1 />
        }
      </div>
    </nav>);
}

function UnLoginOption1() {
  return (
    <div className="hidden xl:flex w-1/5 justify-center items-center gap-4">
      <LinkButton href="/login" className={`py-1.5 border border-[#8482F1] text-[#8482F1] hover:border-[#5C59FF] hover:text-[#5C59FF]`}>
        Đăng nhập
      </LinkButton>
      <LinkButton href="/register" className="bg-[#0a0068] hover:bg-[#150a8b] text-white py-1.5">
        Đăng ký
      </LinkButton>
    </div>
  )
}

function UnLoginOption2({ setSidebarOpen }) {
  return (
    <div className="flex xl:hidden items-center gap-3.5 mr-5">
      <LinkButton href="/login" className="border border-white">Đăng nhập</LinkButton>
      <LinkButton href="/register" className="bg-white text-[#070575]">Đăng ký</LinkButton>
      <button id="sidebar-menu-btn" onClick={setSidebarOpen}>
        <Menu className="w-6.5 h-6.5 text-white cursor-pointer" />
      </button>
    </div>
  )
}

function LoginOption1({ isNotiOpen, setNotiOpen }) {
  const notifications = useNotificationStore(state => state.notifications)
  const hasUnread = notifications?.some(noti => !noti.isRead)

  const user = useAuthStore(state => state.user)
  const isAdmin = useAuthStore(state => state.isAdmin)
  const isDoctor = useAuthStore(state => state.isDoctor)

  const rawAvatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "/images/Avartar.jpg"
  const cropData = user?.profile?.avatarCropData || user?.avatarCropData

  let profileLink = "/profile/patient/detail"
  if (isAdmin) profileLink = "/admin/aggregate"
  else if (isDoctor) profileLink = "/profile/doctor/detail"

  return (
    <div className="hidden xl:flex w-1/5 justify-end items-center gap-2">
      <div className="relative cursor-pointer hover:bg-[#E8E8E8] transition-all duration-300 p-1 rounded-full">
        {hasUnread && <div className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white z-10"></div>}
        <Bell className="size-6" onClick={() => setNotiOpen(prev => !prev)} />
        <NotificationForm isOpen={isNotiOpen} />
      </div>

      <Link href={profileLink} className="size-9 rounded-full overflow-hidden cursor-pointer mr-6 block">
        {/* SỬ DỤNG COMPONENT CẮT ẢNH TỰ ĐỘNG Ở ĐÂY */}
        <CroppedAvatar
          rawAvatarUrl={rawAvatarUrl}
          cropData={cropData}
          className="object-cover w-full h-full"
        />
      </Link>
    </div>
  )
}

function LoginOption2({ setSidebarOpen, isNotiOpen, setNotiOpen }) {
  const notifications = useNotificationStore(state => state.notifications)
  const hasUnread = notifications?.some(noti => !noti.isRead)

  const user = useAuthStore(state => state.user)
  const isAdmin = useAuthStore(state => state.isAdmin)
  const isDoctor = useAuthStore(state => state.isDoctor)

  const rawAvatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "/images/Avartar.jpg"
  const cropData = user?.profile?.avatarCropData || user?.avatarCropData

  let profileLink = "/profile/patient"
  if (isAdmin) profileLink = "/admin/aggregate"
  else if (isDoctor) profileLink = "/profile/doctor"

  return (
    <div className="flex xl:hidden items-center gap-3.5 mr-5">
      <div onClick={() => setNotiOpen(prev => !prev)}
        className="relative cursor-pointer hover:bg-[#bdbddf] transition-all duration-300 p-2 ml-2 rounded-full">
        {hasUnread && <div className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white z-10"></div>}
        <Bell className="size-6" />
        <NotificationForm isOpen={isNotiOpen} />
      </div>

      <Link href={profileLink} className="size-9 rounded-full overflow-hidden cursor-pointer block">
        {/* SỬ DỤNG COMPONENT CẮT ẢNH TỰ ĐỘNG Ở ĐÂY */}
        <CroppedAvatar
          rawAvatarUrl={rawAvatarUrl}
          cropData={cropData}
          className="object-cover w-full h-full"
        />
      </Link>

      <button id="sidebar-menu-btn" onClick={setSidebarOpen}>
        <Menu className="w-6.5 h-6.5 text-white cursor-pointer" />
      </button>
    </div>
  )
}