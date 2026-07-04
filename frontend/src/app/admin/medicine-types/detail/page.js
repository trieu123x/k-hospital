"use client"

import { useState, useEffect, Suspense } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { Button } from "@/components/ui/Button"
import { useSearchParams, useRouter } from "next/navigation"
import { getMedicineTypeDetail, createMedicineType, updateMedicineType } from "@/routers/medicine-type-api"
import { useGlobalLoading } from "@/stores/globalLoading"

function DetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showLoading, hideLoading } = useGlobalLoading()

  const id = searchParams.get("id")
  const isEditMode = !!id

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(isEditMode)

  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const initData = async () => {
      try {
        if (isEditMode) {
          const res = await getMedicineTypeDetail(id)
          if (res.data) {
            const dataToUse = res.data
            setName(dataToUse.name || "")
            setDescription(dataToUse.description || "")

            setInitialData({
              name: dataToUse.name || "",
              description: dataToUse.description || ""
            })
          }
        } else {
          setInitialData({
            name: "",
            description: ""
          })
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết loại thuốc:", error)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [id, isEditMode])

  const getCurrentData = () => ({
    name,
    description
  })

  const hasChanges = () => {
    if (!initialData) return false
    return JSON.stringify(getCurrentData()) !== JSON.stringify(initialData)
  }

  const showSubmitButton = !isEditMode || hasChanges()

  const handleSubmit = async () => {
    showLoading("Đang xử lý yêu cầu...")
    try {
      const payload = {
        name,
        description
      }

      if (isEditMode) {
        await updateMedicineType(id, payload)
        alert("Cập nhật loại thuốc thành công!")
        setInitialData(getCurrentData())
      } else {
        await createMedicineType(payload)
        alert("Thêm loại thuốc thành công!")
        router.push("/admin/medicine-types")
      }
    } catch (error) {
      console.error("Lỗi lưu loại thuốc:", error)
      alert("Lưu thất bại!")
    } finally {
      hideLoading()
    }
  }

  if (loading) return <div className="p-10 italic text-gray-500">Đang tải dữ liệu...</div>

  return (
    <div className="grow flex flex-col rasa-font bg-white">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        <div className="w-200 flex flex-col flex-none">
          <InputForm label={"Tên loại thuốc"} placeholder={"Nhập tên loại thuốc"}
            value={name} setValue={setName} />
          <InputForm label={"Mô tả"} placeholder={"Nhập mô tả chi tiết"}
            value={description} setValue={setDescription} />
        </div>

        {showSubmitButton && (
          <Button onClick={handleSubmit} className={`absolute bottom-5 right-10 
            bg-[#070575] hover:bg-[#08069b] py-2 text-white
          `}>
            {isEditMode ? "Lưu lại thay đổi" : "Thêm"}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function Detail() {
  return (
    <Suspense fallback={<div className="p-10 italic text-gray-500">Đang tải...</div>}>
      <DetailContent />
    </Suspense>
  )
}

function InputForm({ label, placeholder, value, setValue = () => {}, mode = "normal", options = [] }) {
  return (
    <div className="w-full flex justify-between gap-3">
      <EditField
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        className="w-full"
        mode={mode}
        options={options}
      />
      <Pencil className="mt-11 size-6 opacity-60" />
    </div>
  )
}
