"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation" 
import { Pencil } from "lucide-react"
import { EditField } from "@/components/ui/EditField"
import { AvatarPicker } from "@/components/ui/ImagePicker"
import { Button } from "@/components/ui/Button"
import { userApi } from "@/routers/profile/profileRouter" 

export default function Detail() {
  const params = useParams()
  const userId = params?.uuid 

  const [fullName, setFullName] = useState("")
  const [hometown, setHometown] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  
  const [avatarFile, setAvatarFile] = useState(null)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return
      
      try {
        const res = await userApi.getUserById(userId)
        
        if (res && res.success) {
          const profile = res.data?.profile || res.data || {}
          
          setFullName(profile.fullName || "") 
          setEmail(profile.email || "")
          setPhone(profile.phone || "")
          setHometown(profile.address || "") 
          setCurrentAvatarUrl(profile.avatarUrl || "")
          
        } else {
          console.error("Lỗi từ server:", res?.message)
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [userId])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)

    try {
      const formData = new FormData()
      
      formData.append("fullName", fullName)
      formData.append("address", hometown) 
      formData.append("email", email)
      formData.append("phone", phone)

      if (avatarFile) {
        formData.append("avatarUrl", avatarFile) 
      }

      const res = await userApi.updateUser(userId, formData)
      
      if (res && res.success) {
        alert("Cập nhật thông tin thành công!")
      } else {
        alert("Lỗi: " + (res?.message || "Không thể cập nhật"))
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error)
      alert("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (file) => {
    console.log("Tệp ảnh đã chọn:", file)
    setAvatarFile(file)
  }

  if (loading) {
    return <div className="grow flex items-center justify-center bg-white min-h-[500px]">
      <p className="text-gray-500 italic">Đang tải thông tin...</p>
    </div>
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        <div className="w-200 flex flex-col flex-none">
          <InputForm label={"Họ và tên"} placeholder={"Nhập tên của bạn"}
            value={fullName} setValue={setFullName} />
          <InputForm label={"Quê quán"} placeholder={"Nhập quê quán của bạn"}
            value={hometown} setValue={setHometown} />
          <InputForm label={"Email"} placeholder={"Nhập email của bạn"}
            value={email} setValue={setEmail} />
          <InputForm label={"Số điện thoại"} placeholder={"Nhập số điện thoại"}
            value={phone} setValue={setPhone} />
        </div>

        <div className="w-full">
          <AvatarPicker
            label="Họ và tên"
            onChange={handleAvatarChange}
            defaultImage={currentAvatarUrl} 
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={saving}
          className={`absolute bottom-5 right-10 
          bg-[#070575] hover:bg-[#08069b] py-2 text-white transition-opacity
          ${saving ? "opacity-70 cursor-not-allowed" : ""}
        `}>
          {saving ? "Đang lưu..." : "Lưu lại thay đổi"}
        </Button>
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