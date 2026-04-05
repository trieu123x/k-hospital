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
import { useState } from "react";
import { SideBar } from "@/components/layout/SideBar";
import { ChatForm } from "@/components/chat/form";

export default function RootLayout({ children }) {
  //Mấy cái này state để tạm để thử giao diện, chưa chắc là logic chính thức
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setAdmin] = useState(true)
  const [isDoctor, setDoctor] = useState(true)
  const [isLogin, setLogin] = useState(true)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <Navbar isLogin={isLogin} isAdmin={isAdmin} setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
        <main className="mt-15 flex grow">
          {children}
        </main>
        <Footer />

        {
          isSidebarOpen &&
          <SideBar isAdmin={isAdmin} isDoctor={isDoctor} setSidebarClose={() => setSidebarOpen(false)} />
        }

        {
          isLogin &&
          <ChatForm />
        }
      </body>
    </html>
  );
}
