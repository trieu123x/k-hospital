import { supabase } from "../configs/supabase-config.js";

/**
 * Middleware xác thực JWT 
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token xác thực"
      });
    }

    // Nhờ Supabase verify cái Access Token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn"
      });
    }

    // Gắn thông tin cơ bản của User vào Request
    req.user = data.user;
    req.user.role = data.user.user_metadata?.role;

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware kiểm tra phân quyền
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Yêu cầu xác thực"
        });
      }

      const userRole = req.user.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập tính năng này"
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Khai báo sẵn các Helper cho Router dùng cho tiện
export const authorizeAdmin = authorizeRoles("ADMIN");
export const authorizeDoctor = authorizeRoles("DOCTOR");
export const authorizePatient = authorizeRoles("PATIENT");