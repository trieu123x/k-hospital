"use client"
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { X, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword
      });
      if (res.success) {
        setSuccess("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      } else {
        setError(res.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mật khẩu cũ không chính xác hoặc xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mx-4 text-gray-800 transition-all duration-300 rasa-font">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="size-6" />
        </button>
 
        <h2 className="text-2xl font-bold text-center text-[#070575] mb-6 flex items-center justify-center gap-2">
          Đổi mật khẩu
        </h2>
 
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}
 
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">
            {success}
          </div>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Mật khẩu cũ"
              className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden text-black"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showOld ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
 
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden text-black"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showNew ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
 
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden text-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
 
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold transition-colors cursor-pointer text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-[#070575] hover:bg-[#150a8b] text-white rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
