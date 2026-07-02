"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { useAuthStore } from '@/stores/auth';
import { SideBar } from "@/components/layout/SideBar";
import { OptionBar } from "@/components/layout/OptionBar";
import { ChatForm } from "@/components/chat/form";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalLoading } from "@/stores/globalLoading";

export default function RootLayout({ children }) {

  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isOptionbarOpen, setOptionbarOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const fetchUser = useAuthStore(state => state.fetchUser)
  const user = useAuthStore(state => state.user)

  const isLoadingGlobal = useGlobalLoading(state => state.isLoading)
  const loadingMessage = useGlobalLoading(state => state.message)

  useEffect(() => {
    const match = document.cookie.match(/(^| )theme=([^;]+)/);
    const theme = match ? match[2] : 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchUser();
    }
  }, [fetchUser, isHydrated]);

  // Chuyển hướng nếu tài khoản bị khóa
  useEffect(() => {
    if (isHydrated && user) {
      if (user.isActive === false && pathname !== "/account-locked") {
        router.push("/account-locked")
      }
    }
  }, [isHydrated, user, pathname, router])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-[#0B0A1A] text-gray-800 dark:text-slate-200 transition-colors duration-200`}
      >
        {!isHydrated ? (
          <div className="flex items-center justify-center min-h-screen dark:bg-[#0B0A1A]">
            {/* Màn hình chờ nhẹ nhàng khi đang nạp dữ liệu */}
          </div>
        ) : (
          <>
            <Navbar setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
            <main className="mt-15 grow w-full flex flex-col min-h-[calc(100vh-3.75rem)]">
              <div className="w-full grow flex flex-col bg-white dark:bg-[#121124] transition-colors duration-200">
                {children}
              </div>
            </main>
            <Footer />

            {
              isSidebarOpen &&
              <SideBar setSidebarClose={() => setSidebarOpen(false)} />
            }

            {
              isOptionbarOpen &&
              <OptionBar />
            }

            <ChatForm />

            {isLoadingGlobal && (
              <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-white border-b-transparent mb-4 shadow-lg"></div>
                {loadingMessage && <p className="text-white text-lg font-medium drop-shadow-md">{loadingMessage}</p>}
              </div>
            )}
          </>
        )}
      </body>
    </html>
  );
}
