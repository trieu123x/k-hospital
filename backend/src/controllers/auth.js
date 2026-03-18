import { authService } from "../services/auth.js"
import { catchError } from "../helpers/catchError.js"

/**
 * POST /auth/register
 * Body: { email, password, fullName, phone }
 */
export const register = catchError(async (req, res) => {
    const { email, password, fullName, phone } = req.body

    if (!email || !password || !fullName || !phone) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin bắt buộc: email, password, fullName, phone"
        })
    }

    const data = await authService.register({ email, password, fullName, phone })

    res.status(201).json({
        success: true,
        message: "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.",
        data
    })
})

/**
 * POST /auth/login
 * Body: { email, password }
 */
export const login = catchError(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin bắt buộc: email, password"
        })
    }

    const data = await authService.login({ email, password })

    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data
    })
})

/**
 * POST /auth/logout
 * Header: Authorization: Bearer <access_token>
 */
export const logout = catchError(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    await authService.logout(token)

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công"
    })
})

/**
 * GET /auth/me
 * Header: Authorization: Bearer <access_token>
 * Middleware: authenticate
 */
export const getMe = catchError(async (req, res) => {
    const userId = req.user.id
    const data = await authService.getMe(userId)

    res.status(200).json({
        success: true,
        message: "Lấy thông tin người dùng thành công",
        data
    })
})
