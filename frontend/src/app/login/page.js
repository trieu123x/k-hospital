"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routers";

import { useAuthStore } from "@/stores/auth"; 

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      const userData = res.data?.data; 
      
      console.log("Thông tin user sau khi đăng nhập:", userData);
      
      setUser(userData);
      
      // Redirect based on role or to home
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || "Email or password failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="bg-white p-10 md:p-12 rounded-lg shadow-[0_4px_30px_rgb(0,0,0,0.06)] w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-serif font-bold text-center mb-10">Đăng nhập</h1>
        
        {error && <p className="text-red-500 text-xs font-semibold mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-end mt-2">
              <Link href={ROUTES.FORGET_PASSWORD} className="text-xs text-blue-500 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#070575] text-white py-3.5 rounded-lg font-bold hover:bg-[#110d9e] transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-gray-800">Do not have account?</p>
          <Link href={ROUTES.REGISTER} className="text-blue-500 hover:underline tracking-tight text-xs block mt-1">
            Click here to signup now!
          </Link>
        </div>
      </div>
    </div>
  );
}