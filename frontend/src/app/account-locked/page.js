"use client"

import { ShieldAlert, LogOut, PhoneCall } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "next/navigation"

export default function AccountLockedPage() {
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="grow flex flex-col items-center justify-center bg-gray-50 p-6 rasa-font min-h-[600px]">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-red-100 border border-red-50 max-w-lg w-full text-center space-y-6">
        
        <div className="flex justify-center">
          <div className="bg-red-50 p-5 rounded-full">
            <ShieldAlert className="text-red-500 size-16" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Tài khoản bị khóa</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Chúng tôi rất tiếc phải thông báo rằng tài khoản của bạn đã bị tạm khóa do vi phạm chính sách hoặc theo yêu cầu của quản trị viên.
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl flex items-center gap-4 text-left border border-gray-100">
          <div className="bg-blue-100 p-3 rounded-xl">
            <PhoneCall className="text-blue-600 size-6" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-700">Cần hỗ trợ?</p>
            <p className="text-[13px] text-gray-500">Vui lòng liên hệ quản lý qua hotline hoặc email hệ thống để yêu cầu mở khóa.</p>
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#070575] hover:bg-[#050355] text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/10"
          >
            <LogOut size={20} />
            Đăng xuất và quay về trang chủ
          </button>
        </div>

      </div>
      
      <p className="mt-10 text-gray-400 text-[13px]">© 2026 Medicare - Hệ thống quản lý bệnh viện thông minh</p>
    </div>
  )
}
