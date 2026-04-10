"use client"

import { OptionBar } from "@/components/layout/OptionBar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [isOptionbarOpen, setOptionbarOpen] = useState(true)

  return <div className="w-full flex">
    {
      isOptionbarOpen &&
      <OptionBar  optionState="patient" />
    }

    <div className="hidden xl:block w-55 flex-none"></div>
    {children}
  </div>
}