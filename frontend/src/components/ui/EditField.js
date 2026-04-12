"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function EditField({
  label = "Tiêu đề",
  value = "",
  onChange = (value) => { },
  mode = "normal", // "normal" | "select"
  options = [], // Danh sách gợi ý cho mode "select"
  placeholder = "",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(value)
  const [dropdownPos, setDropdownPos] = useState("bottom")

  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    if (mode === "normal" && inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = inputRef.current.scrollHeight + "px"
    }
  }, [value, mode])

  useEffect(() => {
    if (mode !== "select") return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mode])

  // Tự động tính toán vị trí hiển thị dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Nếu vị trí top của ô input nằm ở nửa dưới màn hình (> 50%)
      if (rect.top > windowHeight / 2) {
        setDropdownPos("top")
      } else {
        setDropdownPos("bottom")
      }
    }
  }, [isOpen])

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={twMerge("rasa-font", className)}>
      <label className="block text-[24px] font-bold text-black">
        {label}
      </label>

      <div className="relative w-full" ref={dropdownRef}>
        {/* MODE 1: NORMAL */}
        {mode === "normal" ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
              if (onChange) onChange(e.target.value)
            }}
            placeholder={placeholder}
            rows={1}
            className={`w-full border border-black/10 px-3 py-1.5
              text-[20px] bg-white focus:outline-none rounded-[4px]
              transition-colors resize-none overflow-hidden min-h-[44px]
            `}
          />
        ) : (
          /* MODE 2: SELECT */
          <>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setIsOpen(true)
                if (onChange) onChange(e.target.value)
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className={`w-full border border-black/10 px-3 py-1.5 my-1
               text-[20px] bg-white focus:outline-none
               transition-colors min-h-[44px] rounded-[4px]
              `}
            />
            <ChevronDown className={`absolute right-3 top-4.5 w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-200
              ${isOpen && dropdownPos === "top" ? "rotate-180" : ""} 
            `} />

            {/* MENU GỢI Ý MỚI - Thay đổi class linh hoạt */}
            {isOpen && filteredOptions.length > 0 && (
              <div
                className={`absolute left-0 z-20 w-full bg-white border border-gray-400 rounded-[4px] max-h-50 overflow-y-auto hide-scrollbar shadow-lg
                  ${dropdownPos === "top" ? "bottom-full mb-1" : "top-full mt-1"}
                `}
              >
                <ul className="flex flex-col">
                  {filteredOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setSearchTerm(option)
                        if (onChange) onChange(option)
                        setIsOpen(false)
                      }}
                      className={`px-3 py-1.5 cursor-pointer text-[20px] 
                        text-black hover:bg-gray-100 transition-colors`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}