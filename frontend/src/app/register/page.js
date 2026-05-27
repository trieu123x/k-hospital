"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routers";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        email,
        password,
        fullName,
        phone
      });

      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Giao diện khi người dùng bấm Đăng ký thành công
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_0px_10px_rgb(0,0,0,0.2)] w-full max-w-md border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-4">Kiểm tra Email của bạn</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Chúng tôi đã gửi một liên kết xác nhận đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc thư rác) và nhấp vào liên kết để kích hoạt tài khoản.
          </p>
          <Link href={ROUTES.LOGIN} className="text-[#070575] font-bold hover:underline transition-colors block w-full border border-[#070575] py-3 rounded-lg">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 rasa-font">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_0px_10px_rgb(0,0,0,0.2)] w-full max-w-md border border-gray-100">
        <h1 className="text-[36px] font-extrabold text-center mb-6">Đăng ký</h1>


        <form onSubmit={handleRegister} className="relative space-y-4">
          {error && <p className="absolute -top-4 text-red-500 text-xs font-semibold mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500  transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500  transition-colors"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500  transition-colors pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden transition-colors pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <input
            type="tel"
            placeholder="Enter your phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500  transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#070575] text-white py-3 mt-2 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-5 text-center font-medium">
          <p className="text-black text-[20px] leading-none">Đã có tài khoản?</p>
          <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline text-xs block mt-1">
            Đăng nhập ngay!
          </Link>
        </div>
      </div>
    </div>
  );
}
