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
import axiosInstance from "@/utils/axios";
import { SideBar } from "@/components/layout/SideBar";
import { OptionBar } from "@/components/layout/OptionBar";

export default function RootLayout({ children }) {
  //Mấy cái này state để tạm để thử giao diện, chưa chắc là logic chính thức
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isOptionbarOpen, setOptionbarOpen] = useState(false)
  const [isAdmin, setAdmin] = useState(true)
  const [isDoctor, setDoctor] = useState(true)
  const [isLogin, setLogin] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        console.log("=== THÔNG TIN NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ===", res.data);
      } catch (error) {
        // Not logged in or token invalid
      }
    };
    fetchUser();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <Navbar isLogin={isLogin} isAdmin={isAdmin} setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
        <main className="mt-15">
          {children}
        </main>
        <Footer />

        {
          isSidebarOpen &&
          <SideBar isAdmin={isAdmin} isDoctor={isDoctor} setSidebarClose={() => setSidebarOpen(false)} />
        }

        {
          isOptionbarOpen &&
          <OptionBar isDoctor={isDoctor} />
        }
      </body>
    </html>
  );
}
