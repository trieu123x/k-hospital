"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"

export default function Detail() {
  const [medicineName, setMedicineName] = useState("")
  const [medicineType, setMedicineType] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [sideEffects, setSideEffects] = useState("")
  const [dosage, setDosage] = useState("")
  const [usageInstruction, setUsageInstruction] = useState("")

  const handleImageChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
  }

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Tên thuốc"} placeholder={"Nhập tên thuốc"}
          value={medicineName} setValue={(value) => setMedicineName(value)} />
        <InputForm label={"Loại thuốc"} placeholder={"Chọn loại thuốc"} options={["Kháng sinh", "Giảm đau, hạ sốt", "Tiêu hóa", "Thực phẩm chức năng", "Vitamin", "Kháng histamin"]}
          value={medicineType} setValue={(value) => setMedicineType(value)} mode={"select"} />
        <InputForm label={"Thành phần"} placeholder={"Nhập thành phần thuốc"}
          value={ingredients} setValue={(value) => setIngredients(value)} />
        <InputForm label={"Tác dụng phụ"} placeholder={"Nhập các tác dụng phụ"}
          value={sideEffects} setValue={(value) => setSideEffects(value)} />
        <InputForm label={"Liều lượng"} placeholder={"Nhập liều lượng sử dụng"}
          value={dosage} setValue={(value) => setDosage(value)} />
        <InputForm label={"Hướng dẫn sử dụng"} placeholder={"Hướng dẫn sử dụng"}
          value={usageInstruction} setValue={(value) => setUsageInstruction(value)} />
      </div>

      <div className="w-full">
        <AvatarPicker
          label="Ảnh thuốc"
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