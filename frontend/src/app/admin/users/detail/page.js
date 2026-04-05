"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"

export default function Detail() {
  const [fullName, setFullName] = useState("")
  const [hometown, setHometown] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [degree, setDegree] = useState("")
  const [education, setEducation] = useState("")
  const [experience, setExperience] = useState("")
  const [achievements, setAchievements] = useState("")

  const handleAvatarChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
  }

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Họ và tên"} placeholder={"Nhập tên của bạn"}
          value={fullName} setValue={(value) => setFullName(value)} />
        <InputForm label={"Quê quán"} placeholder={"Nhập quên quán của bạn"}
          value={hometown} setValue={(value) => setHometown(value)} />
        <InputForm label={"Email"} placeholder={"Nhập email của bạn"}
          value={email} setValue={(value) => setEmail(value)} />
        <InputForm label={"Số điện thoại"} placeholder={"Nhập số điện thoại"}
          value={phone} setValue={(value) => setPhone(value)} />
        <InputForm label={"Bằng cấp"} placeholder={"Chọn bằng cấp"} options={["Thạc sĩ", "Tiến sĩ", "Kỹ sư", "Cử nhân", "Giáo sư", "Tinh anh"]}
          value={degree} setValue={(value) => setDegree(value)} mode={"select"} />
        <InputForm label={"Trình độ học vấn"} placeholder={"Nhập thông tin"}
          value={education} setValue={(value) => setEducation(value)} />
        <InputForm label={"Kinh nghiệm làm việc"} placeholder={"Nhập thông tin"}
          value={experience} setValue={(value) => setExperience(value)} />
        <InputForm label={"Thành tựu"} placeholder={"Nhập thông tin"}
          value={achievements} setValue={(value) => setAchievements(value)} />
      </div>

      <div className="w-full">
        <AvatarPicker
          label="Họ và tên"
          onChange={handleAvatarChange}
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