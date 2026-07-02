import { authService } from "../services/auth.js";
import { catchError } from "../helpers/catch-error.js";

/**
 * POST /auth/register
 */
export const register = catchError(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(200).json({ success: true, message: data.message });
});

/**
 * POST /auth/register-doctor
 */
export const registerDoctor = catchError(async (req, res) => {
  const data = await authService.registerDoctor({ ...req.body, file: req.file });
  res.status(201).json({ success: true, message: "Tạo tài khoản bác sĩ thành công.", data });
});

/**
 * POST /auth/login
 */
export const login = catchError(async (req, res) => {
  const data = await authService.login(req.body);
  const isProduction = process.env.NODE_ENV === "production";

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
    expiresIn: data.expiresIn,
  });
});

/**
 * POST /auth/refresh-token
 * Lấy Refresh Token từ Cookie, cấp lại Access Token mới
 */
export const refreshToken = catchError(async (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có refresh token",
    });
  }

  const { supabase } = await import("../configs/supabase-config.js");
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: token });

  const isProduction = process.env.NODE_ENV === "production";

  if (error || !data?.session) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
    });
  }

  res.cookie("refresh_token", data.session.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Trả Access Token mới về cho Frontend
  return res.status(200).json({
    success: true,
    message: "Làm mới token thành công",
    accessToken: data.session.access_token,
    expiresIn: data.session.expires_in,
  });
});

/**
 * POST /auth/logout
 */
export const logout = catchError(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (token) {
    await authService.logout(token);
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Xóa sạch Cookie khi đăng xuất
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

export const forgotPassword = catchError(async (req, res) => {
  const data = await authService.forgotPassword(req.body);
  res.status(200).json({ success: true, ...data });
});

export const resetPassword = catchError(async (req, res) => {
  const data = await authService.resetPassword(req.body);
  res.status(200).json({ success: true, ...data });
});

export const changePassword = catchError(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  const email = req.user.email;

  const data = await authService.changePassword({ userId, email, oldPassword, newPassword });
  res.status(200).json({ success: true, ...data });
});