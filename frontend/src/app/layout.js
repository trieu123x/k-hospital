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

export default function RootLayout({ children }) {

  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isOptionbarOpen, setOptionbarOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const fetchUser = useAuthStore(state => state.fetchUser)
  const user = useAuthStore(state => state.user)

  useEffect(() => {
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
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        {!isHydrated ? (
          <div className="flex items-center justify-center min-h-screen">
            {/* Màn hình chờ nhẹ nhàng khi đang nạp dữ liệu */}
          </div>
        ) : (
          <>
            <Navbar setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
            <main className="mt-15 grow w-full flex flex-col">
              <div className="w-full grow flex flex-col bg-white">
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
          </>
        )}
      </body>
    </html>
  );
}
