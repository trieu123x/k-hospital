import { userService } from "../services/user.js"
import { catchError } from "../helpers/catch-error.js"

export const userController = {
    getAllUsers: async (req, res, next) => {
        try {
            const requesterRole = req.user.role
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const result = await userService.getAllUsers(requesterRole, page, limit)

            res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination
            })
        } catch (error) {
            next(error)
        }
    },

    getTotalUsers: async (req, res, next) => {
        try {
            const total = await userService.getTotalCount()
            res.status(200).json({
                success: true,
                data: { total }
            })
        } catch (error) {
            next(error)
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params
            const requesterRole = req.user.role
            const requesterId = req.user.id

            const user = await userService.getUserById(id, requesterRole, requesterId)

            res.status(200).json({
                success: true,
                data: user
            })
        } catch (error) {
            next(error)
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params
            const requesterRole = req.user.role
            const requesterId = requesterRole === 'admin' || requesterRole === 'ADMIN' ? id : req.user.id
            const updateData = req.body
            const updatedUser = await userService.updateUser(id, requesterId, updateData, req.file)

            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin thành công",
                data: updatedUser
            })
        } catch (error) {
            next(error)
        }
    },

    toggleBlockUser: async (req, res, next) => {
        try {
            const { id } = req.params
            const { isActive } = req.body

            const updatedUser = await userService.toggleBlockUser(id, isActive)

            res.status(200).json({
                success: true,
                message: isActive ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
                data: updatedUser
            })
        } catch (error) {
            next(error)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params

            await userService.deleteUser(id)

            res.status(200).json({
                success: true,
                message: "Đã xóa người dùng thành công"
            })
        } catch (error) {
            next(error)
        }
    }
}

export const getUsersForAdmin = catchError(async (req, res) => {
    const { role, name, lastId, limit } = req.query
    const data = await userService.getUsersForAdmin({
        role,
        name,
        lastId,
        limit: limit ? parseInt(limit) : 30
    })
    res.status(200).json({
        success: true,
        message: "Lấy danh sách người dùng cho admin thành công",
        data
    })
})