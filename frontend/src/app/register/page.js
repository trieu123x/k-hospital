"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

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
      
      // Navigate to verify register page and pass email along via query string
      router.push(`/verify-register?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Email already use!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_4px_30px_rgb(0,0,0,0.06)] w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">Đăng ký</h1>
        
        {error && <p className="text-red-500 text-xs font-semibold mb-2">{error}</p>}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-10"
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
              className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-10"
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
            className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#070575] text-white py-3.5 mt-2 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-gray-800">Đã có tài khoản?</p>
          <Link href="/login" className="text-blue-500 hover:underline text-xs block mt-1">
            Đăng nhập ngay!
          </Link>
        </div>
      </div>
    </div>
  );
}
