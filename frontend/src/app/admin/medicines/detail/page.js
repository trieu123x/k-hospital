"use client"

import { useState, useEffect, Suspense } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"
import { useSearchParams, useRouter } from "next/navigation"
import { getMedicineById, createMedicine, updateMedicine } from "@/routers/medicine-api"
import { getAllMedicineTypes } from "@/routers/medicine-type-api"
import { useGlobalLoading } from "@/stores/globalLoading"

function DetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showLoading, hideLoading } = useGlobalLoading()

  const id = searchParams.get("id")
  const isEditMode = !!id

  const [medicineName, setMedicineName] = useState("")
  const [medicineType, setMedicineType] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [sideEffects, setSideEffects] = useState("")
  const [dosage, setDosage] = useState("")
  const [usageInstruction, setUsageInstruction] = useState("")
  const [loading, setLoading] = useState(isEditMode)

  // State hỗ trợ logic nghiệp vụ
  const [initialData, setInitialData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [medicineTypeOptions, setMedicineTypeOptions] = useState([])

  useEffect(() => {
    const initData = async () => {
      try {
        if (isEditMode) {
          let dataToUse = null
          const [typesRes, medicineRes] = await Promise.all([
            getAllMedicineTypes(),
            getMedicineById(id)
          ])

          if (typesRes.data) {
            setMedicineTypeOptions(typesRes.data)
          }

          if (medicineRes?.data) {
            dataToUse = medicineRes.data
          }

          if (dataToUse) {
            setMedicineName(dataToUse.name || "")
            setMedicineType(dataToUse.medicineType?.name || "")
            setIngredients(dataToUse.ingredients || "")
            setSideEffects(dataToUse.sideEffects || "")
            setDosage(dataToUse.dosage || "")
            setUsageInstruction(dataToUse.usageInstruction || "")
            setPreviewImage(dataToUse.imageUrl || null)

            setInitialData({
              medicineName: dataToUse.name || "",
              medicineType: dataToUse.medicineType?.name || "",
              ingredients: dataToUse.ingredients || "",
              sideEffects: dataToUse.sideEffects || "",
              dosage: dataToUse.dosage || "",
              usageInstruction: dataToUse.usageInstruction || ""
            })
          }
        } else {
          const typesRes = await getAllMedicineTypes()
          if (typesRes.data) {
            setMedicineTypeOptions(typesRes.data)
          }
          // Nếu ở chế độ Thêm mới, mốc so sánh là rỗng
          setInitialData({
            medicineName: "",
            medicineType: "",
            ingredients: "",
            sideEffects: "",
            dosage: "",
            usageInstruction: ""
          })
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thuốc:", error)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [id, isEditMode])

  const handleImageChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
    setImageFile(file)
  }

  // Hàm gom dữ liệu hiện tại để so sánh
  const getCurrentData = () => ({
    medicineName,
    medicineType,
    ingredients,
    sideEffects,
    dosage,
    usageInstruction
  })

  // Logic kiểm tra có thay đổi hay không
  const hasChanges = () => {
    if (!initialData) return false
    if (imageFile !== null) return true
    return JSON.stringify(getCurrentData()) !== JSON.stringify(initialData)
  }

  // Luôn hiện nếu là "Thêm", chỉ hiện khi có thay đổi nếu là "Edit"
  const showSubmitButton = !isEditMode || hasChanges()

  const handleSubmit = async () => {
    showLoading("Đang xử lý yêu cầu...")
    try {
      const payload = new FormData()
      payload.append("name", medicineName)

      const selectedType = medicineTypeOptions.find(t => t.name === medicineType)
      if (selectedType) {
        payload.append("typeId", selectedType.id)
      }

      payload.append("ingredients", ingredients)
      payload.append("sideEffects", sideEffects)
      payload.append("dosage", dosage)
      payload.append("usageInstruction", usageInstruction)

      if (imageFile) {
        if (typeof imageFile === 'string') {
          payload.append("imageUrl", imageFile)
        } else {
          payload.append("image", imageFile)
        }
      }

      if (isEditMode) {
        await updateMedicine(id, payload)
        alert("Cập nhật thành công!")
        setInitialData(getCurrentData())
        setImageFile(null)
      } else {

        await createMedicine(payload)
        alert("Thêm thuốc thành công!")
        router.push("/admin/medicines")
      }
    } catch (error) {
      console.error("Lỗi lưu thay đổi:", error)
      alert("Lưu thất bại!")
    } finally {
      hideLoading()
    }
  }

  if (loading) return <div className="p-10 italic text-gray-500">Đang tải dữ liệu...</div>

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Tên thuốc"} placeholder={"Nhập tên thuốc"}
          value={medicineName} setValue={(value) => setMedicineName(value)} />
        <InputForm label={"Loại thuốc"} placeholder={"Chọn loại thuốc"} options={medicineTypeOptions.map(t => t.name)}
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
          defaultImage={previewImage}
        />
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
}

export default function Detail() {
  return (
    <Suspense fallback={<div className="p-10 italic text-gray-500">Đang tải...</div>}>
      <DetailContent />
    </Suspense>
  )
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