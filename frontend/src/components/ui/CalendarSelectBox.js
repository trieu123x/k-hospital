"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "./Button"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import vi from "date-fns/locale/vi"
import "react-day-picker/dist/style.css"

export function CalendarSelectBox({
  value = null,
  onChange,
  placeholder = "Ngày bắt đầu"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formattedDate = value
    ? format(value, "dd/MM/yyyy")
    : ""

  return (
    <div ref={dropdownRef} className="relative rasa-font w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between cursor-pointer
          border border-gray-300 rounded-[4px] bg-white
          px-2 py-1 text-[14px] focus:outline-none
        `}
      >
        <span className={`flex-1 text-left truncate ${!value ? "text-gray-500" : "text-black"}`}>
          {value ? formattedDate : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-600" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 bg-white border border-gray-200 rounded-[4px] shadow-lg p-3">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (onChange) onChange(date)
              setIsOpen(false)
            }}
            locale={vi}
          />

        </div>
      )}
    </div>
  )
}