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
      setTimeout(() => setSuccessMsg(""), 3000)
      // In a real flow, you would redirect to a Reset Password page offering OTP + new password fields.
      // E.g. router.push(`/reset-password?email=${inputValue}`)
      setTimeout(() => alert("Redirect to reset-password page..."), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Email không tồn tại trong hệ thống");
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 rasa-font">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_0px_10px_rgb(0,0,0,0.2)] w-full max-w-md border border-gray-100">
        <h1 className="text-[36px] font-extrabold text-center mb-4">Xác thực</h1>

        <form onSubmit={handleRequestOtp} className="relative space-y-2">
          {error && <p className="absolute -top-4 text-red-500 text-xs font-semibold mb-2">{error}</p>}
          {successMsg && <p className="absolute -top-4 text-green-500 text-xs font-semibold mb-2">{successMsg}</p>}
          <input
            type={method === "email" ? "email" : "text"}
            placeholder={`Enter your ${method}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />

          <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
            <span>Chọn phương thức:</span>
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
            className="w-full bg-[#070575] text-white py-3 mt-4 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Xác thực"}
          </button>
        </form>

        <div className="mt-4 text-center font-medium">
          <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline text-xs block">
            Trở về trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
