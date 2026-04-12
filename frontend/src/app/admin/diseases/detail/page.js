"use client"

import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"
import { useSearchParams, useRouter } from "next/navigation"
import { getDiseaseById, createDisease, updateDisease } from "@/routers/disease-api"
import { getSpecialties } from "@/routers/specialty-api"
import { getAllDiseaseCategories } from "@/routers/categorize-api"

export default function Detail() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get("id")
  const isEditMode = !!id

  const [diseaseName, setDiseaseName] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [diseaseGroup, setDiseaseGroup] = useState("")
  const [description, setDescription] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [homeRemedies, setHomeRemedies] = useState("")
  const [loading, setLoading] = useState(isEditMode)

  const [initialData, setInitialData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [specialtyList, setSpecialtyList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    const initData = async () => {
      try {
        const [specRes, catRes] = await Promise.all([
          getSpecialties(),
          getAllDiseaseCategories()
        ])

        if (specRes.data) setSpecialtyList(specRes.data)
        if (catRes.data) setCategoryList(catRes.data)

        if (isEditMode) {
          let dataToUse = null
          const res = await getDiseaseById(id)
          if (res.data) {
            dataToUse = res.data
          }

          if (dataToUse) {
            setDiseaseName(dataToUse.name || "")
            setSpecialty(dataToUse.specialty?.name || "")
            setDiseaseGroup(dataToUse.category?.name || "")
            setDescription(dataToUse.description || "")
            setSymptoms(dataToUse.symptoms || "")
            setHomeRemedies(dataToUse.homeTreatment || "")
            setPreviewImage(dataToUse.imageUrl || null)

            setInitialData({
              diseaseName: dataToUse.name || "",
              specialty: dataToUse.specialty?.name || "",
              diseaseGroup: dataToUse.category?.name || "",
              description: dataToUse.description || "",
              symptoms: dataToUse.symptoms || "",
              homeRemedies: dataToUse.homeTreatment || ""
            })
          }
        } else {
          setInitialData({
            diseaseName: "",
            specialty: "",
            diseaseGroup: "",
            description: "",
            symptoms: "",
            homeRemedies: ""
          })
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error)
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
    diseaseName,
    specialty,
    diseaseGroup,
    description,
    symptoms,
    homeRemedies
  })

  const hasChanges = () => {
    if (!initialData) return false
    if (imageFile !== null) return true
    return JSON.stringify(getCurrentData()) !== JSON.stringify(initialData)
  }

  const showSubmitButton = !isEditMode || hasChanges()

  const handleSubmit = async () => {
    try {
      const selectedSpec = specialtyList.find(s => s.name === specialty)
      const selectedCat = categoryList.find(c => c.name === diseaseGroup)

      const payload = new FormData()
      payload.append("name", diseaseName)
      if (selectedSpec) payload.append("specialtyId", selectedSpec.id)
      if (selectedCat) payload.append("categoryId", selectedCat.id)
      payload.append("description", description)
      payload.append("symptoms", symptoms)
      payload.append("homeTreatment", homeRemedies)

      if (imageFile) {
        payload.append("image", imageFile)
      }

      if (isEditMode) {
        await updateDisease(id, payload)
        alert("Cập nhật thành công!")
        setInitialData(getCurrentData())
        setImageFile(null)
      } else {
        await createDisease(payload)
        alert("Thêm bệnh thành công!")
        router.push("/admin/diseases")
      }
    } catch (error) {
      console.error("Lỗi lưu thay đổi:", error)
      alert("Lưu thất bại!")
    }
  }

  if (loading) return <div className="p-10 italic text-gray-500">Đang tải dữ liệu...</div>

  return <div className="grow flex flex-col rasa-font bg-white">
    <div className="relative grow flex px-10 py-8 justify-between gap-35">
      <div className="w-200 flex flex-col flex-none">
        <InputForm label={"Tên bệnh"} placeholder={"Nhập tên bệnh"}
          value={diseaseName} setValue={(value) => setDiseaseName(value)} />
        <InputForm label={"Chuyên khoa"} placeholder={"Chọn chuyên khoa"}
          options={specialtyList.map(s => s.name)}
          value={specialty} setValue={(value) => setSpecialty(value)} mode={"select"} />
        <InputForm label={"Nhóm bệnh"} placeholder={"Nhập nhóm bệnh"}
          options={categoryList.map(c => c.name)}
          value={diseaseGroup} setValue={(value) => setDiseaseGroup(value)} mode={"select"} />
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