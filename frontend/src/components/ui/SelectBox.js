"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "./Button"

export function SelectBox({
  options = [],
  value = null,
  onChange = (value) => { },
  placeholder = "Chọn một mục"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative rasa-font">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between cursor-pointer
          border border-gray-300 rounded-[4px] 
          px-2 py-1 text-[14px] focus:outline-none bg-white
        `}
      >
        <span className={`flex-1 text-left truncate ${!value ? "text-gray-500" : "text-black"}`}>
          {value ? value : placeholder}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 z-20 mt-1 w-max
            bg-white border border-gray-200 rounded-[4px] shadow-lg
            max-h-60 overflow-y-auto hide-scrollbar
          `}
        >
          <ul className="flex flex-col">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  if (value === option) {
                    onChange(null)
                  } else {
                    onChange(option)
                  }
                  setIsOpen(false)
                }}
                className={`
                  px-3 py-1.5 cursor-pointer text-[14px] text-black
                  hover:bg-gray-100 transition-colors
                  ${value === option ? "bg-blue-50 text-blue-600 font-medium" : ""}
                `}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}