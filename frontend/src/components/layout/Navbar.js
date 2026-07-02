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
import ChangePasswordModal from "./ChangePasswordModal";

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

  return (
    <img
      src={displayUrl}
      alt="Avatar"
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/images/Avartar.jpg";
      }}
    />
  );
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
  const logout = useAuthStore(state => state.logout)
  const setUser = useAuthStore(state => state.setUser)

  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const menuRef = useRef(null)
  const notiRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false)
      }
    }
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isNotiOpen, setNotiOpen])

  const rawAvatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "/images/Avartar.jpg"
  const cropData = user?.profile?.avatarCropData || user?.avatarCropData

  let profileLink = "/profile/patient/detail"
  if (isAdmin) profileLink = "/profile/admin/detail"
  else if (isDoctor) profileLink = "/profile/doctor/detail"

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Lỗi khi đăng xuất ở server:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <div className="hidden xl:flex w-1/5 justify-end items-center gap-2 relative">
      <div ref={notiRef} className="relative cursor-pointer hover:bg-[#E8E8E8] transition-all duration-300 p-1 rounded-full">
        {hasUnread && <div className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white z-10"></div>}
        <Bell className="size-6" onClick={() => setNotiOpen(prev => !prev)} />
        <NotificationForm isOpen={isNotiOpen} />
      </div>

      <div ref={menuRef} className="relative mr-6">
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="size-9 rounded-full overflow-hidden cursor-pointer block focus:outline-none"
        >
          <CroppedAvatar
            rawAvatarUrl={rawAvatarUrl}
            cropData={cropData}
            className="object-cover w-full h-full"
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#070575] text-white rounded-lg z-50 text-[16px] flex flex-col font-medium overflow-hidden rasa-font border border-white/10">
            {/* Header info with logo & name */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-[#050355] border-b border-white/10">
              <div className="size-7 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <CroppedAvatar
                  rawAvatarUrl={rawAvatarUrl}
                  cropData={cropData}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] truncate text-white leading-tight">
                  {user?.profile?.fullName || user?.fullName || "Người dùng"}
                </span>
                <span className="text-[10px] text-[#A4C4FF] font-medium mt-0.5">
                  {isAdmin ? "Quản trị viên" : isDoctor ? "Bác sĩ" : "Bệnh nhân"}
                </span>
              </div>
            </div>

            {/* Menu options */}
            <div className="flex flex-col py-1">
              <Link
                href={profileLink}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-[#3040A8] transition-colors"
              >
                Trang cá nhân
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false)
                  setIsPasswordModalOpen(true)
                }}
                className="px-4 py-2 hover:bg-[#3040A8] transition-colors text-left w-full font-medium cursor-pointer"
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 text-left w-full hover:bg-red-700 transition-colors font-bold text-red-200 border-t border-white/10 mt-1 pt-2 cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  )
}

function LoginOption2({ setSidebarOpen, isNotiOpen, setNotiOpen }) {
  const notifications = useNotificationStore(state => state.notifications)
  const hasUnread = notifications?.some(noti => !noti.isRead)

  const user = useAuthStore(state => state.user)
  const isAdmin = useAuthStore(state => state.isAdmin)
  const isDoctor = useAuthStore(state => state.isDoctor)
  const logout = useAuthStore(state => state.logout)
  const setUser = useAuthStore(state => state.setUser)

  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const menuRef = useRef(null)
  const notiRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false)
      }
    }
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isNotiOpen, setNotiOpen])

  const rawAvatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "/images/Avartar.jpg"
  const cropData = user?.profile?.avatarCropData || user?.avatarCropData

  let profileLink = "/profile/patient/detail"
  if (isAdmin) profileLink = "/profile/admin/detail"
  else if (isDoctor) profileLink = "/profile/doctor/detail"

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Lỗi khi đăng xuất ở server:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <div className="flex xl:hidden items-center gap-3.5 mr-5 relative">
      <div ref={notiRef}
        className="relative cursor-pointer hover:bg-[#bdbddf] transition-all duration-300 p-2 ml-2 rounded-full">
        {hasUnread && <div className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white z-10"></div>}
        <Bell className="size-6 text-white" onClick={() => setNotiOpen(prev => !prev)} />
        <NotificationForm isOpen={isNotiOpen} />
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="size-9 rounded-full overflow-hidden cursor-pointer block focus:outline-none"
        >
          <CroppedAvatar
            rawAvatarUrl={rawAvatarUrl}
            cropData={cropData}
            className="object-cover w-full h-full"
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#070575] text-white rounded-lg shadow-lg z-50 text-[16px] flex flex-col font-medium overflow-hidden rasa-font border border-white/10">
            {/* Header info with logo & name */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-[#050355] border-b border-white/10">
              <div className="size-7 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <CroppedAvatar
                  rawAvatarUrl={rawAvatarUrl}
                  cropData={cropData}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] truncate text-white leading-tight">
                  {user?.profile?.fullName || user?.fullName || "Người dùng"}
                </span>
                <span className="text-[10px] text-[#A4C4FF] font-medium mt-0.5">
                  {isAdmin ? "Quản trị viên" : isDoctor ? "Bác sĩ" : "Bệnh nhân"}
                </span>
              </div>
            </div>

            {/* Menu options */}
            <div className="flex flex-col py-1">
              <Link
                href={profileLink}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-[#3040A8] transition-colors"
              >
                Trang cá nhân
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false)
                  setIsPasswordModalOpen(true)
                }}
                className="px-4 py-2 hover:bg-[#3040A8] transition-colors text-left w-full font-medium cursor-pointer"
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 text-left w-full hover:bg-red-700 transition-colors font-bold text-red-200 border-t border-white/10 mt-1 pt-2"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>

      <button id="sidebar-menu-btn" onClick={setSidebarOpen}>
        <Menu className="w-6.5 h-6.5 text-white cursor-pointer" />
      </button>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  )
}