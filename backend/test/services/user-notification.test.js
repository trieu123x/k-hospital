import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notificationService } from '@/services/user-notification.js'
import { notificationRepository } from '@/repositories/user-notification.js'

// 1. Mock Repository
vi.mock('@/repositories/user-notification.js', () => ({
  notificationRepository: {
    findByUserId: vi.fn(),
    markAsRead: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteReadNotificationsByUserId: vi.fn()
  }
}))

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsersNotifications', () => {
    it('nên gọi repository với đúng userId và tham số phân trang', async () => {
      const userId = 'user-123'
      const lastId = 'notif-99'
      notificationRepository.findByUserId.mockResolvedValue([])

      await notificationService.getUsersNotifications(userId, lastId)

      // Kiểm tra tham số: userId, limit=10, lastId
      expect(notificationRepository.findByUserId).toHaveBeenCalledWith(userId, 10, lastId)
    })
  })

  describe('readNotification', () => {
    it('nên trả về thông báo sau khi đã đánh dấu là đã đọc', async () => {
      const mockNotif = { id: 1, userId: 'u1', content: 'Lịch khám mới', isRead: true }
      notificationRepository.markAsRead.mockResolvedValue(mockNotif)

      const result = await notificationService.readNotification(1)

      expect(result.isRead).toBe(true)
      expect(notificationRepository.markAsRead).toHaveBeenCalledWith(1)
    })

    it('nên ném lỗi 404 nếu không tìm thấy thông báo để đọc', async () => {
      notificationRepository.markAsRead.mockResolvedValue(null)

      await expect(notificationService.readNotification(999))
        .rejects.toThrow('Thông báo ID 999 không tồn tại')
    })
  })

  describe('deleteReadUserNotifications', () => {
    it('nên gọi lệnh xóa tất cả thông báo đã đọc của một user', async () => {
      const userId = 'user-456'
      notificationRepository.deleteReadNotificationsByUserId.mockResolvedValue({ count: 5 })

      const result = await notificationService.deleteReadUserNotifications(userId)

      expect(result.count).toBe(5)
      expect(notificationRepository.deleteReadNotificationsByUserId).toHaveBeenCalledWith(userId)
    })
  })

  describe('sendNotification', () => {
    it('nên gọi lệnh tạo thông báo mới với payload truyền vào', async () => {
      const payload = { userId: 'u1', content: 'Chào mừng!' }
      notificationRepository.create.mockResolvedValue({ id: 1, ...payload })

      await notificationService.sendNotification(payload)

      expect(notificationRepository.create).toHaveBeenCalledWith(payload)
    })
  })
})