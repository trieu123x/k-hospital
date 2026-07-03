"use client"

import { OptionBar } from "@/components/layout/OptionBar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [isOptionbarOpen, setOptionbarOpen] = useState(true)
  const isDoctor = true

  return <div className="w-full flex">
    {
      isOptionbarOpen &&
      <OptionBar />
    }

    <div className="hidden xl:block w-[220px] flex-none"></div>
    {children}
  </div>
}