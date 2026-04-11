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

export default function RootLayout({ children }) {
  // //Mấy cái này state để tạm để thử giao diện, chưa chắc là logic chính thức
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isOptionbarOpen, setOptionbarOpen] = useState(false)

  const fetchUser = useAuthStore(state => state.fetchUser)
  const isLogin = useAuthStore(state => state.isLogin)
  const isAdmin = useAuthStore(state => state.isAdmin)
  const isDoctor = useAuthStore(state => state.isDoctor)

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <Navbar setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
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
          <OptionBar />
        }
      </body>
    </html>
  );
}
