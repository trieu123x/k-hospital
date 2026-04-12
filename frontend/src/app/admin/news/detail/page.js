"use client"

import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"
import { useSearchParams, useRouter } from "next/navigation"
import { getNewsById, createNews, updateNews } from "@/routers/news-api"

export default function Detail() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get("id")
  const isEditMode = !!id

  // State cho Form Tin tức
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // State hỗ trợ logic nghiệp vụ
  const [initialData, setInitialData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(isEditMode)

  // Lấy dữ liệu Tin tức nếu đang ở chế độ Sửa
  useEffect(() => {
    const initData = async () => {
      try {
        if (isEditMode) {
          let dataToUse = null

          const res = await getNewsById(id)
          if (res.data) {
            dataToUse = res.data
          }

          if (dataToUse) {
            setTitle(dataToUse.title || "")
            setContent(dataToUse.content || "")
            setPreviewImage(dataToUse.newUrl || dataToUse.imageUrl || dataToUse.image || null)

            setInitialData({
              title: dataToUse.title || "",
              content: dataToUse.content || ""
            })
          }
        } else {
          setInitialData({
            title: "",
            content: ""
          })
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu tin tức:", error)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [id, isEditMode])

  const handleAvatarChange = (file) => {
    setImageFile(file)
  }

  // Hàm gom dữ liệu hiện tại để so sánh
  const getCurrentData = () => ({
    title,
    content
  })

  const hasChanges = () => {
    if (!initialData) return false
    if (imageFile !== null) return true // Có chọn ảnh mới
    return JSON.stringify(getCurrentData()) !== JSON.stringify(initialData)
  }

  const showSubmitButton = !isEditMode || hasChanges()

  const handleSubmit = async () => {
    try {
      const payload = new FormData()
      payload.append("title", title)
      payload.append("content", content)

      if (imageFile) {
        payload.append("image", imageFile)
      }

      if (isEditMode) {
        await updateNews(id, payload)
        alert("Cập nhật thành công!")
        setInitialData(getCurrentData()) // Cập nhật mốc so sánh để ẩn nút
        setImageFile(null)
      } else {
        await createNews(payload)
        alert("Thêm tin tức thành công!")
        router.push("/admin/news")
      }
    } catch (error) {
      console.error("Lỗi lưu thay đổi:", error)
      alert("Lưu thất bại!")
    }
  }

  if (loading) return <div className="p-10 italic text-gray-500">Đang tải dữ liệu...</div>

  return (
    <div className="grow flex flex-col rasa-font bg-white">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        <div className="w-200 flex flex-col flex-none">
          <InputForm
            label={"Tiêu đề"}
            placeholder={"Nhập tiêu đề tin tức"}
            value={title}
            setValue={(value) => setTitle(value)}
          />
          <InputForm
            label={"Nội dung"}
            placeholder={"Nhập nội dung bài viết"}
            value={content}
            setValue={(value) => setContent(value)}
          />

          <AvatarPicker
            label="Ảnh tin tức"
            onChange={handleAvatarChange}
            className="w-fit"
            defaultImage={previewImage}
          />
        </div>

        {showSubmitButton && (
          <Button
            onClick={handleSubmit}
            className={`absolute bottom-5 right-10 
              bg-[#070575] hover:bg-[#08069b] py-2 text-white
            `}
          >
            {isEditMode ? "Lưu lại thay đổi" : "Thêm tin tức"}
          </Button>
        )}
      </div>
    </div>
  )
}

function InputForm({ label, placeholder, value, setValue = (value) => { }, mode = "normal", options = [] }) {
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