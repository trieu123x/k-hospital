"use client";

import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routers";

export default function ForgetPassword() {
  const router = useRouter();
  const [method, setMethod] = useState("email"); // or "phone"
  const [inputValue, setInputValue] = useState("");
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    
    // According to the backend API, we only support email reset right now.
    // If user picks phone, we show an error to emulate the missing route logic as per requested design constraint.
    if (method === "phone") {
        setError("Phone number not exit!");
        setLoading(false);
        return;
    }

    try {
      await axiosInstance.post("/auth/forgot-password", { email: inputValue });
      setSuccessMsg("OTP đã được gửi! Chuyển hướng...");
      setTimeout(() => {
        router.push(`${ROUTES.RESET_PASSWORD}?email=${inputValue}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Email không tồn tại trong hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_4px_30px_rgb(0,0,0,0.06)] w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-serif font-bold text-center mb-10">Xác thực</h1>
        
        {error && <p className="text-red-500 text-xs font-semibold mb-2">{error}</p>}
        {successMsg && <p className="text-green-500 text-xs font-semibold mb-2">{successMsg}</p>}
        
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <input
            type={method === "email" ? "email" : "text"}
            placeholder={`Enter your ${method}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            required
          />
          
          <div className="flex items-center space-x-4 text-xs font-bold text-gray-900 mt-2">
            <span>Select method:</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="phone"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
                className="w-3 h-3 text-blue-600 focus:ring-blue-500"
              />
              <span>phone</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="email"
                checked={method === "email"}
                onChange={() => setMethod("email")}
                className="w-3 h-3 text-blue-600 focus:ring-blue-500"
              />
              <span>email</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#070575] text-white py-3.5 mt-2 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Xác thực"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline text-xs block mt-1">
            Trở về trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
