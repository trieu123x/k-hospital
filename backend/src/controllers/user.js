import { userService } from "../services/user.js"

export const userController = {
    getAllUsers: async (req, res, next) => {
        try {
            const requesterRole = req.user.profile.role
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

    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params
            const requesterRole = req.user.profile.role
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
            const requesterId = req.user.id
            const updateData = req.body
            
            const updatedUser = await userService.updateUser(id, requesterId, updateData)
            
            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin thành công",
                data: updatedUser
            })
        } catch (error) {
            next(error)
        }
    }
}
