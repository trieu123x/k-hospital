import { chatService } from '../services/chat.js'
import { catchError } from '../helpers/catch-error.js'

export const createSession = catchError(async (req, res) => {
    const userId = req.user?.id || null
    const { content } = req.body

    const data = await chatService.createSession(userId, content)

    res.status(201).json({
        success: true,
        message: "Tạo phiên chat thành công",
        data: data
    })
})

export const getSessions = catchError(async (req, res) => {
    const userId = req.user?.id

    const sessions = await chatService.getSessions(userId)

    res.status(200).json({
        success: true,
        message: "Lấy danh sách phiên chat thành công",
        data: sessions
    })
})

export const getSessionHistory = catchError(async (req, res) => {
    const { id } = req.params
    const userId = req.user?.id || null
    const { lastId, limit } = req.query

    const detail = await chatService.getSessionDetail(id, userId, lastId, limit)

    res.status(200).json({
        success: true,
        message: "Lấy chi tiết phiên chat thành công",
        data: detail
    })
})

export const saveMessage = catchError(async (req, res) => {
    const { id } = req.params
    const { role, content, metadata } = req.body

    const message = await chatService.saveMessage(id, role, content, metadata)

    res.status(201).json({
        success: true,
        message: "Lưu tin nhắn thành công",
        data: message
    })
})

export const updateTopic = catchError(async (req, res) => {
    const { id } = req.params
    const userId = req.user?.id || null

    const topic = await chatService.updateTopicTrigger(id, userId)

    res.status(200).json({
        success: true,
        message: 'Cập nhật chủ đề thành công',
        data: { topic }
    })
})

export const deleteSession = catchError(async (req, res) => {
    const { id } = req.params
    const userId = req.user?.id || null

    await chatService.deleteSession(id, userId)

    res.status(200).json({
        success: true,
        message: "Xóa phiên chat thành công"
    })
})