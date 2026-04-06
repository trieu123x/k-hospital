"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"

export default function Detail() {
  const [fullName, setFullName] = useState("")
  const [hometown, setHometown] = useState("")

  const handleAvatarChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
  }

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Tiêu đề"} placeholder={"Nhập tên của bạn"}
          value={fullName} setValue={(value) => setFullName(value)} />
        <InputForm label={"Nội dung"} placeholder={"Nhập quên quán của bạn"}
          value={hometown} setValue={(value) => setHometown(value)} />

        <AvatarPicker
          label="Ảnh tin tức"
          onChange={handleAvatarChange}
          className="w-191"
        // defaultImage={"/path/to/my/current/avatar.jpg"} // Tùy chọn truyền ảnh hiện tại
        />
      </div>

      <Button className={`absolute bottom-5 right-10 
        bg-[#070575] hover:bg-[#08069b] py-2 text-white
      `}>
        Lưu lại thay đổi
      </Button>
    </div>
  </div>
}

function InputForm({ label, placeholder, value, setValue = (value) => { }, mode = "normal", options = [] }) {
  return <div className="w-full flex justify-between gap-3">
    <EditField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      className="w-full"
      mode={mode}
      options={options} />
    <Pencil className="mt-11 size-6 opacity-60" />
  </div>
}