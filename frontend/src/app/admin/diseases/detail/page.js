"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"

export default function Detail() {
  const [diseaseName, setDiseaseName] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [diseaseGroup, setDiseaseGroup] = useState("")
  const [description, setDescription] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [homeRemedies, setHomeRemedies] = useState("")

  const handleImageChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
  }

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Tên bệnh"} placeholder={"Nhập tên bệnh"}
          value={diseaseName} setValue={(value) => setDiseaseName(value)} />
        <InputForm label={"Chuyên khoa"} placeholder={"Chọn chuyên khoa"} options={["Nội tổng hợp", "Hô hấp", "Tiêu hóa", "Thần kinh"]}
          value={specialty} setValue={(value) => setSpecialty(value)} mode={"select"} />
        <InputForm label={"Nhóm bệnh"} placeholder={"Nhập nhóm bệnh"}
          value={diseaseGroup} setValue={(value) => setDiseaseGroup(value)} />
        <InputForm label={"Mô tả"} placeholder={"Nhập mô tả chi tiết"}
          value={description} setValue={(value) => setDescription(value)} />
        <InputForm label={"Triệu chứng"} placeholder={"Nhập các triệu chứng"}
          value={symptoms} setValue={(value) => setSymptoms(value)} />
        <InputForm label={"Cách chữa tại nhà"} placeholder={"Nhập cách chữa tại nhà"}
          value={homeRemedies} setValue={(value) => setHomeRemedies(value)} />
      </div>

      <div className="w-full">
        <AvatarPicker
          label="Ảnh bệnh"
          onChange={handleImageChange}
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