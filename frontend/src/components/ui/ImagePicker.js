"use client"

import { useState, useRef } from "react"
import { twMerge } from "tailwind-merge"
import Image from "next/image"

export function AvatarPicker({
  label = "Tiêu đề",
  onChange = (file) => { },
  className = "",
  defaultImage = null,
}) {
  const [previewUrl, setPreviewUrl] = useState(defaultImage)
  const [selectedFileName, setSelectedFileName] = useState("Chọn ảnh")
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFileName(file.name)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)

      if (onChange) onChange(file)
    } else {
      setSelectedFileName("Chọn ảnh")
      if (onChange) onChange(null)
    }
  }

  const triggerFilePicker = () => {
    // giả lập kick chuột vào thẻ input đang tham chiếu do nó bị ẩn
    fileInputRef.current.click()
  }

  return (
    <div className={twMerge("w-[220px] rasa-font", className)}>
      <div className="flex flex-col items-start">
        <label className="block text-[24px] font-bold text-black">
          {label}
        </label>

        <div
          className="relative group cursor-pointer rounded-[4px] w-full border border-black/10 overflow-hidden"
          onClick={triggerFilePicker}
        >
          <Image
            src={previewUrl ?? "/images/Avartar.jpg"}
            alt="Preview ảnh đại diện"
            width={220}
            height={220}
            className="w-full h-fit block object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-[15px] text-center leading-tight">
              Thay đổi hình ảnh
            </span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}