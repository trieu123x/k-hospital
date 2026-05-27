import { z } from "zod";

export const authSchema = {
  register: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
    fullName: z.string().min(2, "Họ tên quá ngắn"),
    phone: z
      .string()
      .regex(
        /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
        "Số điện thoại không hợp lệ (Việt Nam)",
      ),
  }),

  registerDoctor: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }).or(z.literal('')),
    fullName: z.string().min(2, "Họ tên quá ngắn"),
    phone: z
      .string()
      .regex(
        /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
        "Số điện thoại không hợp lệ (Việt Nam)",
      ),
  }),

  login: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  }),

  forgotPassword: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
  }),

  resetPassword: z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    otp: z.string().min(1, "Vui lòng nhập mã OTP"),
    newPassword: z.string().min(6, "Mật khẩu mới phải từ 6 ký tự trở lên"),
  }),
};
