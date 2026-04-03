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

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setAdmin] = useState(true)
  const [isDoctor, setDoctor] = useState(false)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <Navbar isAdmin={isAdmin} setSidebarOpen={() => setSidebarOpen(prev => !prev)} />
        <main className="grow flex flex-col">
          {children}
        </main>
        <Footer />

        {
          isSidebarOpen &&
          <SideBar isAdmin={isAdmin} isDoctor={isDoctor} setSidebarClose={() => setSidebarOpen(false)} />
        }
      </body>
    </html>
  );
}
