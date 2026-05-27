"use client";
import { useState, Suspense } from "react";
import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/routers";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setTimeout(() => setError(""), 3000)
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setTimeout(() => setError(""), 3000)
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      setSuccess(true)
      router.push(ROUTES.LOGIN);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại!");
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_4px_30px_rgb(0,0,0,0.06)] w-full max-w-md border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold mb-4">Thành công!</h1>
          <p className="text-gray-600 mb-8">Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng về trang đăng nhập trong giây lát.</p>
          <Link href={ROUTES.LOGIN} className="text-blue-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 rasa-font">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_0px_10px_rgb(0,0,0,0.2)] w-full max-w-md border border-gray-100">
        <h1 className="text-[36px] font-extrabold text-center mb-4">Đổi mật khẩu</h1>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            {error && <p className="absolute -top-4 text-red-500 text-xs font-semibold mb-2">{error}</p>}
            <input
              type="text"
              placeholder="Nhập mã OTP từ Email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#070575] text-white py-3 mt-2 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm font-medium">
          <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline text-xs block mt-1">
            Trở về trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
