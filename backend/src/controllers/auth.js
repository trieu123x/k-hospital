import { authService } from "../services/auth.js";
import { catchError } from "../helpers/catch-error.js";

/**
 * POST /auth/register
 * Body: { email, password, fullName, phone }
 */
export const register = catchError(async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  const data = await authService.register({ email, password, fullName, phone });

  res.status(200).json({
    success: true,
    message: "Mã OTP xác nhận đã được gửi đến email của bạn.",
    data,
  });
});

/**
 * POST /auth/register-doctor
 * Body: { email, fullName, phone, avatarCropData } + file
 */
export const registerDoctor = catchError(async (req, res) => {
  const { email, fullName, phone, avatarCropData } = req.body;
  const file = req.file;

  const data = await authService.registerDoctor({
    email,
    fullName,
    phone,
    file,
    avatarCropData,
  });

  res.status(201).json({
    success: true,
    message: "Tạo tài khoản bác sĩ thành công.",
    data,
  });
});

/**
 * POST /auth/verify-register
 * Body: { email, otp }
 */
export const verifyRegister = catchError(async (req, res) => {
  const { email, otp } = req.body;

  const data = await authService.verifyRegister({ email, otp });

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
    data,
  });
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
export const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  const data = await authService.login({ email, password });
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("access_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction, // Chỉ bật secure khi ở production (HTTPS)
    sameSite: isProduction ? "none" : "lax", // Lax cho localhost, None cho production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });

  res.cookie("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  });

  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    data: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
});

/**
 * POST /auth/logout
 * Header: Authorization: Bearer <access_token>
 */
export const logout = catchError(async (req, res) => {
  const token =
    req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
  if (token) {
    await authService.logout(token);
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
});

/**
 * GET /auth/me
 * Header: Authorization: Bearer <access_token>
 * Middleware: authenticate
 */
export const getMe = catchError(async (req, res) => {
  const userId = req.user.id;
  const data = await authService.getMe(userId);

  res.status(200).json({
    success: true,
    message: "Lấy thông tin người dùng thành công",
    data,
  });
});

/**
 * POST /auth/forgot-password
 * Body: { email }
 */
export const forgotPassword = catchError(async (req, res) => {
  const { email } = req.body;
  const data = await authService.forgotPassword({ email });
  res.status(200).json({ success: true, ...data });
});

/**
 * POST /auth/reset-password
 * Body: { email, otp, newPassword }
 */
export const resetPassword = catchError(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const data = await authService.resetPassword({ email, otp, newPassword });
  res.status(200).json({ success: true, ...data });
});
