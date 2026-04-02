"use client";
import { useState, Suspense } from "react";
import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-register", { email: defaultEmail, otp });
      router.push("/login?verified=true");
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_4px_30px_rgb(0,0,0,0.06)] w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-serif font-bold text-center mb-6">Xác thực OTP</h1>
        
        {error && <p className="text-red-500 text-xs font-semibold mb-2">{error}</p>}
        <p className="text-sm text-gray-600 mb-6 text-center">
          Vui lòng nhập mã OTP 6 số đã được gửi đến email: <br/><b className="text-[#070575]">{defaultEmail}</b>
        </p>
        
        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-5 py-4 text-center text-xl tracking-[0.5em] font-bold rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#070575] text-white py-3.5 mt-2 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Xác thực & Tạo tài khoản"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <Link href="/login" className="text-blue-500 hover:underline text-xs block mt-1">
            Trở về trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyRegister() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <VerifyRegisterContent />
    </Suspense>
  );
}
